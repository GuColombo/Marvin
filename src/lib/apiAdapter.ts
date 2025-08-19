import { 
  HealthStatus, 
  MeetingSummary, 
  MeetingDetail, 
  FileSummary, 
  FileDetail, 
  EmailSummary, 
  EmailDetail, 
  KBItem, 
  KBItemDetail, 
  ChatThread, 
  SearchParams, 
  SearchResult, 
  ChatDelta,
  DataMode,
  SystemConfig,
  Project,
  ToolPermission,
  ToolUsageRequest,
  MindmapNode,
  MindmapEdge
} from './types';
import { LiveAPIProvider } from './liveAPIProvider';
import { 
  mockHealth, 
  mockMeetings, 
  mockMeetingDetails, 
  mockFiles, 
  mockFileDetails, 
  mockEmails, 
  mockEmailDetails, 
  mockKBItems, 
  mockKBDetails, 
  mockChatThreads,
  mockSystemConfig 
} from './mockData';

const BASE_API = 'http://127.0.0.1:8112';

// Storage key for data mode
const DATA_MODE_KEY = 'marvin.dataMode';

// Get current data mode from localStorage
export function getDataMode(): DataMode {
  const stored = localStorage.getItem(DATA_MODE_KEY);
  return (stored as DataMode) || 'mock';
}

// Set data mode in localStorage
export function setDataMode(mode: DataMode): void {
  localStorage.setItem(DATA_MODE_KEY, mode);
}

// Live Provider - attempts to call real API endpoints
class LiveProvider {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${BASE_API}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`Live API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  async listMeetings(): Promise<MeetingSummary[]> {
    return this.request<MeetingSummary[]>('/meetings/list');
  }

  async getMeeting(id: string): Promise<MeetingDetail> {
    return this.request<MeetingDetail>(`/meetings/${id}`);
  }

  async listFiles(): Promise<FileSummary[]> {
    return this.request<FileSummary[]>('/files/list');
  }

  async getFile(id: string): Promise<FileDetail> {
    return this.request<FileDetail>(`/files/${id}`);
  }

  async listEmails(): Promise<EmailSummary[]> {
    return this.request<EmailSummary[]>('/emails/list');
  }

  async getEmail(id: string): Promise<EmailDetail> {
    return this.request<EmailDetail>(`/emails/${id}`);
  }

  async kbSearch(params: SearchParams): Promise<SearchResult> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('q', params.query);
    if (params.type) searchParams.set('type', params.type);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    return this.request<SearchResult>(`/kb/search?${searchParams}`);
  }

  async getKBItem(id: string): Promise<KBItemDetail> {
    return this.request<KBItemDetail>(`/kb/item/${id}`);
  }

  async listChatThreads(): Promise<ChatThread[]> {
    return this.request<ChatThread[]>('/chat/threads');
  }

  async createChatThread(): Promise<{ id: string }> {
    return this.request<{ id: string }>('/chat/threads', { method: 'POST' });
  }

  async getChatThread(id: string): Promise<ChatThread> {
    return this.request<ChatThread>(`/chat/thread/${id}`);
  }

  async* sendChatMessage(threadId: string, message: string, attachments?: string[]): AsyncGenerator<ChatDelta> {
    const response = await fetch(`${BASE_API}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, message, attachments }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              yield data as ChatDelta;
            } catch (e) {
              console.warn('Failed to parse streaming data:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async getSystemConfig(): Promise<SystemConfig> {
    return this.request<SystemConfig>('/settings/config');
  }

  async updateSystemConfig(config: SystemConfig): Promise<void> {
    await this.request('/settings/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }
}

// Mock Provider - returns realistic demo data
class MockProvider {
  async getHealth(): Promise<HealthStatus> {
    await this.delay(100);
    return mockHealth;
  }

  async listMeetings(): Promise<MeetingSummary[]> {
    await this.delay(200);
    return mockMeetings;
  }

  async getMeeting(id: string): Promise<MeetingDetail> {
    await this.delay(150);
    const detail = mockMeetingDetails[id];
    if (!detail) throw new Error(`Meeting ${id} not found`);
    return detail;
  }

  async listFiles(): Promise<FileSummary[]> {
    await this.delay(180);
    return mockFiles;
  }

  async getFile(id: string): Promise<FileDetail> {
    await this.delay(120);
    const detail = mockFileDetails[id];
    if (!detail) throw new Error(`File ${id} not found`);
    return detail;
  }

  async listEmails(): Promise<EmailSummary[]> {
    await this.delay(160);
    return mockEmails;
  }

  async getEmail(id: string): Promise<EmailDetail> {
    await this.delay(140);
    const detail = mockEmailDetails[id];
    if (!detail) throw new Error(`Email ${id} not found`);
    return detail;
  }

  async kbSearch(params: SearchParams): Promise<SearchResult> {
    await this.delay(220);
    let items = [...mockKBItems];
    
    if (params.query) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(params.query!.toLowerCase()) ||
        item.snippet.toLowerCase().includes(params.query!.toLowerCase())
      );
    }

    if (params.type && params.type !== 'all') {
      items = items.filter(item => item.type === params.type);
    }

    const total = items.length;
    const offset = params.offset || 0;
    const limit = params.limit || 10;
    items = items.slice(offset, offset + limit);

    return { total, items };
  }

  async getKBItem(id: string): Promise<KBItemDetail> {
    await this.delay(130);
    const detail = mockKBDetails[id];
    if (!detail) throw new Error(`KB item ${id} not found`);
    return detail;
  }

  async listChatThreads(): Promise<ChatThread[]> {
    await this.delay(100);
    return mockChatThreads;
  }

  async createChatThread(): Promise<{ id: string }> {
    await this.delay(80);
    return { id: `chat-${Date.now()}` };
  }

  async getChatThread(id: string): Promise<ChatThread> {
    await this.delay(120);
    const thread = mockChatThreads.find(t => t.id === id);
    if (!thread) throw new Error(`Chat thread ${id} not found`);
    return thread;
  }

  async* sendChatMessage(threadId: string, message: string, attachments?: string[]): AsyncGenerator<ChatDelta> {
    // Simulate streaming response
    const response = "I understand you're asking about the topics we discussed. Based on the context from your attached files, here are the key points:\n\n1. **Strategic Planning**: We covered market expansion opportunities\n2. **Resource Allocation**: Budget considerations for Q4 initiatives\n3. **Timeline Management**: Project milestones and delivery dates\n\nWould you like me to elaborate on any of these areas?";
    
    const chunks = response.split(' ');
    
    for (let i = 0; i < chunks.length; i++) {
      await this.delay(50 + Math.random() * 100);
      yield {
        type: 'content',
        content: chunks[i] + (i < chunks.length - 1 ? ' ' : '')
      } as ChatDelta;
    }

    // Add a citation if there are attachments
    if (attachments && attachments.length > 0) {
      await this.delay(200);
      yield {
        type: 'citation',
        citation: {
          id: 'cite-mock',
          type: 'meeting',
          sourceId: attachments[0],
          snippet: 'Referenced content from attached source',
          title: 'Attached Context'
        }
      } as ChatDelta;
    }

    yield { type: 'done' } as ChatDelta;
  }

  async getSystemConfig(): Promise<SystemConfig> {
    await this.delay(150);
    return mockSystemConfig;
  }

  async updateSystemConfig(config: SystemConfig): Promise<void> {
    await this.delay(200);
    // In a real implementation, this would save the config
    console.log('Saving system config:', config);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// API Adapter that switches between Live and Mock providers
class APIAdapter {
  private liveProvider = new LiveProvider();
  private mockProvider = new MockProvider();
  private liveAPIProvider = new LiveAPIProvider();

  private async tryLiveOrFallback<T>(
    liveCall: () => Promise<T>,
    mockCall: () => Promise<T>
  ): Promise<T> {
    const mode = getDataMode();
    
    if (mode === 'mock') {
      return mockCall();
    }

    try {
      return await liveCall();
    } catch (error) {
      console.warn('Live API failed, falling back to mock:', error);
      // Show toast notification about fallback
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('marvin:api-fallback', {
          detail: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
        window.dispatchEvent(event);
      }
      return mockCall();
    }
  }

  async getHealth(): Promise<HealthStatus> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getHealth(),
      () => this.mockProvider.getHealth()
    );
  }

  async listMeetings(): Promise<MeetingSummary[]> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.listMeetings(),
      () => this.mockProvider.listMeetings()
    );
  }

  async getMeeting(id: string): Promise<MeetingDetail> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getMeeting(id),
      () => this.mockProvider.getMeeting(id)
    );
  }

  async listFiles(): Promise<FileSummary[]> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.listFiles(),
      () => this.mockProvider.listFiles()
    );
  }

  async getFile(id: string): Promise<FileDetail> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getFile(id),
      () => this.mockProvider.getFile(id)
    );
  }

  async listEmails(): Promise<EmailSummary[]> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.listEmails(),
      () => this.mockProvider.listEmails()
    );
  }

  async getEmail(id: string): Promise<EmailDetail> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getEmail(id),
      () => this.mockProvider.getEmail(id)
    );
  }

  async kbSearch(params: SearchParams): Promise<SearchResult> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.kbSearch(params),
      () => this.mockProvider.kbSearch(params)
    );
  }

  async getKBItem(id: string): Promise<KBItemDetail> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getKBItem(id),
      () => this.mockProvider.getKBItem(id)
    );
  }

  async listChatThreads(): Promise<ChatThread[]> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.listChatThreads(),
      () => this.mockProvider.listChatThreads()
    );
  }

  async createChatThread(): Promise<{ id: string }> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.createChatThread(),
      () => this.mockProvider.createChatThread()
    );
  }

  async getChatThread(id: string): Promise<ChatThread> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getChatThread(id),
      () => this.mockProvider.getChatThread(id)
    );
  }

  async* sendChatMessage(threadId: string, message: string, attachments?: string[]): AsyncGenerator<ChatDelta> {
    const mode = getDataMode();
    
    if (mode === 'mock') {
      yield* this.mockProvider.sendChatMessage(threadId, message, attachments);
      return;
    }

    try {
      yield* this.liveProvider.sendChatMessage(threadId, message, attachments);
    } catch (error) {
      console.warn('Live chat failed, falling back to mock:', error);
      yield* this.mockProvider.sendChatMessage(threadId, message, attachments);
    }
  }

  async getSystemConfig(): Promise<SystemConfig> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getSystemConfig(),
      () => this.mockProvider.getSystemConfig()
    );
  }

  async updateSystemConfig(config: SystemConfig): Promise<void> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.updateSystemConfig(config),
      () => this.mockProvider.updateSystemConfig(config)
    );
  }

  // New v0.6 methods for enhanced features
  
  async listProjects(): Promise<Project[]> {
    const stored = localStorage.getItem('marvin-projects');
    return stored ? JSON.parse(stored) : [];
  }

  async getProject(id: string): Promise<Project | null> {
    const projects = await this.listProjects();
    return projects.find(p => p.id === id) || null;
  }

  async saveProject(project: Project): Promise<Project> {
    const projects = await this.listProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date() };
    } else {
      projects.push({ ...project, createdAt: new Date(), updatedAt: new Date() });
    }
    
    localStorage.setItem('marvin-projects', JSON.stringify(projects));
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    const projects = await this.listProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem('marvin-projects', JSON.stringify(filtered));
    return true;
  }

  async getMindmapData(): Promise<{ nodes: MindmapNode[]; edges: MindmapEdge[] }> {
    const stored = localStorage.getItem('marvin-mindmap');
    return stored ? JSON.parse(stored) : { nodes: [], edges: [] };
  }

  async saveMindmapData(data: { nodes: MindmapNode[]; edges: MindmapEdge[] }): Promise<void> {
    localStorage.setItem('marvin-mindmap', JSON.stringify(data));
  }

  async getToolPermissions(): Promise<ToolPermission[]> {
    const stored = localStorage.getItem('marvin-tool-permissions');
    return stored ? JSON.parse(stored) : [];
  }

  async saveToolPermission(permission: ToolPermission): Promise<ToolPermission> {
    const permissions = await this.getToolPermissions();
    const index = permissions.findIndex(p => p.toolId === permission.toolId);
    
    if (index >= 0) {
      permissions[index] = permission;
    } else {
      permissions.push(permission);
    }
    
    localStorage.setItem('marvin-tool-permissions', JSON.stringify(permissions));
    return permission;
  }

  async requestToolUsage(request: ToolUsageRequest): Promise<{ approved: boolean; message?: string }> {
    const stored = localStorage.getItem('marvin-tool-requests');
    const requests = stored ? JSON.parse(stored) : [];
    requests.push(request);
    localStorage.setItem('marvin-tool-requests', JSON.stringify(requests));
    
    return { approved: false, message: 'Awaiting user approval' };
  }

  async runIngestionNow(): Promise<{ success: boolean; message: string }> {
    if (this.liveAPIProvider.available) {
      try {
        const result = await this.liveAPIProvider.ingestCommit({});
        return { success: result.success, message: 'Live ingestion completed' };
      } catch (error) {
        console.warn('Live ingestion failed:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'Mock ingestion completed successfully' };
  }

  async reindexSelection(items: string[]): Promise<{ success: boolean; message: string }> {
    if (this.liveAPIProvider.available) {
      try {
        const result = await this.liveAPIProvider.ingestCommit({ items });
        return { success: result.success, message: 'Live reindexing completed' };
      } catch (error) {
        console.warn('Live reindexing failed:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: `Mock reindexing of ${items.length} items completed` };
  }
}

// Export singleton instance
export const apiAdapter = new APIAdapter();