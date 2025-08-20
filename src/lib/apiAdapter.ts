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
import {
  UploadResponse,
  IngestRequest,
  IngestResponse,
  KBSearchRequest,
  KBSearchResponse,
  KBGraphResponse,
  ChatThreadsResponse,
  ChatHistoryResponse,
  ChatSendRequest,
  ChatSendResponse,
  ProjectsResponse,
  ProjectDetail as APIProjectDetail,
  KanbanResponse,
  TimelineResponse,
  DigestRequest,
  DigestResponse,
  WatchListResponse,
  WatchAddRequest,
  WatchAddResponse,
  WatchRemoveRequest,
  ScheduleUpdateRequest,
  UploadResponseSchema,
  IngestResponseSchema,
  KBSearchResponseSchema,
  KBGraphResponseSchema,
  ChatThreadsResponseSchema,
  ChatHistoryResponseSchema,
  ChatSendResponseSchema,
  ProjectsResponseSchema,
  KanbanResponseSchema,
  TimelineResponseSchema,
  DigestResponseSchema,
  WatchListResponseSchema,
  WatchAddResponseSchema,
  SuccessResponseSchema
} from './schemas';
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

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://127.0.0.1:8123';
const useMSW = () => import.meta.env.VITE_USE_MSW === 'true';

const DATA_MODE_KEY = 'marvin.dataMode';

export function getDataMode(): DataMode {
  const stored = localStorage.getItem(DATA_MODE_KEY);
  return (stored as DataMode) || (useMSW() ? 'mock' : 'live');
}

export function setDataMode(mode: DataMode): void {
  localStorage.setItem(DATA_MODE_KEY, mode);
}

class LiveProvider {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${getApiUrl()}${endpoint}`, {
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

  async uploadFiles(files: File[], type: 'email' | 'calendar' | 'files'): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await fetch(`${getApiUrl()}/upload/${type}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return UploadResponseSchema.parse(data);
  }

  async ingestCommit(request: IngestRequest): Promise<IngestResponse> {
    const data = await this.request<IngestResponse>('/ingest/commit', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return IngestResponseSchema.parse(data);
  }

  async kbSearch(request: KBSearchRequest): Promise<KBSearchResponse> {
    const data = await this.request<KBSearchResponse>('/kb/search', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return KBSearchResponseSchema.parse(data);
  }

  async kbGraph(): Promise<KBGraphResponse> {
    const data = await this.request<KBGraphResponse>('/kb/graph');
    return KBGraphResponseSchema.parse(data);
  }

  async getChatThreads(): Promise<ChatThreadsResponse> {
    const data = await this.request<ChatThreadsResponse>('/chat/threads');
    return ChatThreadsResponseSchema.parse(data);
  }

  async getChatHistory(threadId: string): Promise<ChatHistoryResponse> {
    const data = await this.request<ChatHistoryResponse>(`/chat/history?threadId=${threadId}`);
    return ChatHistoryResponseSchema.parse(data);
  }

  async sendChat(request: ChatSendRequest): Promise<ChatSendResponse> {
    const data = await this.request<ChatSendResponse>('/chat/send', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return ChatSendResponseSchema.parse(data);
  }

  async getProjects(): Promise<ProjectsResponse> {
    const data = await this.request<ProjectsResponse>('/projects');
    return ProjectsResponseSchema.parse(data);
  }

  async getProject(id: string): Promise<APIProjectDetail> {
    return this.request<APIProjectDetail>(`/projects/${id}`);
  }

  async getProjectKanban(id: string): Promise<KanbanResponse> {
    const data = await this.request<KanbanResponse>(`/projects/${id}/kanban`);
    return KanbanResponseSchema.parse(data);
  }

  async getProjectTimeline(id: string): Promise<TimelineResponse> {
    const data = await this.request<TimelineResponse>(`/projects/${id}/timeline`);
    return TimelineResponseSchema.parse(data);
  }

  async getTopics(): Promise<ProjectsResponse> {
    const data = await this.request<ProjectsResponse>('/topics');
    return ProjectsResponseSchema.parse(data);
  }

  async getTopic(id: string): Promise<APIProjectDetail> {
    return this.request<APIProjectDetail>(`/topics/${id}`);
  }

  async generateDigest(request: DigestRequest): Promise<DigestResponse> {
    const data = await this.request<DigestResponse>('/digest/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return DigestResponseSchema.parse(data);
  }

  async listWatchers(): Promise<WatchListResponse> {
    const data = await this.request<WatchListResponse>('/watch/list');
    return WatchListResponseSchema.parse(data);
  }

  async addWatcher(request: WatchAddRequest): Promise<WatchAddResponse> {
    const data = await this.request<WatchAddResponse>('/watch/add', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return WatchAddResponseSchema.parse(data);
  }

  async removeWatcher(request: WatchRemoveRequest): Promise<{ ok: true }> {
    const data = await this.request('/watch/remove', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const parsed = SuccessResponseSchema.parse(data);
    return { ok: true };
  }

  async updateSchedule(request: ScheduleUpdateRequest): Promise<{ ok: true }> {
    const data = await this.request('/schedule/update', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const parsed = SuccessResponseSchema.parse(data);
    return { ok: true };
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

  async kbSearchLegacy(params: SearchParams): Promise<SearchResult> {
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
    const response = await fetch(`${getApiUrl()}/chat/send`, {
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

class MockProvider {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async uploadFiles(files: File[], type: 'email' | 'calendar' | 'files'): Promise<UploadResponse> {
    await this.delay(1000 + Math.random() * 2000);
    return {
      run_id: `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      files_saved: files.length
    };
  }

  async ingestCommit(request: IngestRequest): Promise<IngestResponse> {
    await this.delay(500 + Math.random() * 1000);
    return {
      files: request.paths.length,
      chunks_added: Math.floor(Math.random() * 500) + 100
    };
  }

  async kbSearch(request: KBSearchRequest): Promise<KBSearchResponse> {
    await this.delay(200 + Math.random() * 300);
    
    const mockResults = [
      {
        id: 'kb-1',
        title: 'Product Strategy Meeting Notes',
        score: 0.95,
        source: 'meetings',
        snippet: `Discussion about ${request.query} and strategic initiatives for Q4...`
      },
      {
        id: 'kb-2', 
        title: 'Email Thread: Project Updates',
        score: 0.87,
        source: 'emails',
        snippet: `Latest updates regarding ${request.query} implementation timeline...`
      },
      {
        id: 'kb-3',
        title: 'Technical Documentation',
        score: 0.82,
        source: 'files',
        snippet: `Comprehensive guide covering ${request.query} best practices and requirements...`
      }
    ];

    return { results: mockResults };
  }

  async kbGraph(): Promise<KBGraphResponse> {
    await this.delay(300);
    return {
      nodes: [
        { id: 'project-alpha', label: 'Project Alpha', type: 'project' },
        { id: 'team-eng', label: 'Engineering Team', type: 'team' },
        { id: 'doc-api', label: 'API Documentation', type: 'document' },
        { id: 'meeting-kickoff', label: 'Kickoff Meeting', type: 'meeting' }
      ],
      edges: [
        { from: 'project-alpha', to: 'team-eng', weight: 0.8, label: 'assigned' },
        { from: 'project-alpha', to: 'doc-api', weight: 0.9, label: 'references' },
        { from: 'team-eng', to: 'meeting-kickoff', weight: 0.7, label: 'attended' }
      ]
    };
  }

  async getChatThreads(): Promise<ChatThreadsResponse> {
    await this.delay(150);
    return {
      threads: [
        { id: 'thread-1', name: 'Project Strategy Discussion', updatedAt: new Date().toISOString() },
        { id: 'thread-2', name: 'Technical Requirements Review', updatedAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'thread-3', name: 'Team Coordination', updatedAt: new Date(Date.now() - 172800000).toISOString() }
      ]
    };
  }

  async getChatHistory(threadId: string): Promise<ChatHistoryResponse> {
    await this.delay(120);
    return {
      messages: [
        {
          role: 'user',
          text: 'Can you help me understand the project timeline?',
          ts: new Date(Date.now() - 3600000).toISOString()
        },
        {
          role: 'assistant', 
          text: 'Based on the project documentation, here are the key milestones and timeline details...',
          ts: new Date(Date.now() - 3500000).toISOString()
        }
      ]
    };
  }

  async sendChat(request: ChatSendRequest): Promise<ChatSendResponse> {
    await this.delay(800 + Math.random() * 1200);
    return {
      reply: `I understand your question about "${request.message}". Based on the available context, here's a comprehensive response with relevant insights and recommendations.`,
      citations: [
        { id: 'cite-1', type: 'meeting', source: 'Strategy Review', snippet: 'Relevant discussion points...' }
      ],
      steps: [
        { type: 'search', description: 'Searched knowledge base for relevant information' },
        { type: 'analysis', description: 'Analyzed context and generated response' }
      ]
    };
  }

  async getProjects(): Promise<ProjectsResponse> {
    await this.delay(200);
    return {
      items: [
        { id: 'proj-1', name: 'Product Launch Initiative', owner: 'Sarah Chen', status: 'active', updatedAt: new Date().toISOString() },
        { id: 'proj-2', name: 'Infrastructure Upgrade', owner: 'Mike Rodriguez', status: 'planning', updatedAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'proj-3', name: 'Customer Feedback Analysis', owner: 'Emily Park', status: 'completed', updatedAt: new Date(Date.now() - 172800000).toISOString() }
      ]
    };
  }

  async getProject(id: string): Promise<APIProjectDetail> {
    await this.delay(150);
    return {
      id,
      name: 'Product Launch Initiative',
      description: 'Comprehensive project to launch our new product line with coordinated marketing and engineering efforts.',
      owner: 'Sarah Chen',
      links: [
        { type: 'document', title: 'Project Charter', url: '/docs/charter' },
        { type: 'repository', title: 'Source Code', url: '/repos/product-launch' }
      ],
      artifacts: [
        { type: 'meeting', title: 'Kickoff Meeting', date: '2024-01-15' },
        { type: 'document', title: 'Requirements Spec', date: '2024-01-20' }
      ]
    };
  }

  async getProjectKanban(id: string): Promise<KanbanResponse> {
    await this.delay(180);
    return {
      columns: [
        {
          id: 'todo',
          title: 'To Do',
          cards: [
            { id: 'task-1', title: 'Define user personas', assignee: 'Alex Thompson', due: '2024-02-01' },
            { id: 'task-2', title: 'Setup CI/CD pipeline', assignee: 'Jordan Liu' }
          ]
        },
        {
          id: 'progress',
          title: 'In Progress', 
          cards: [
            { id: 'task-3', title: 'Implement authentication', assignee: 'Sam Wilson', due: '2024-01-28' }
          ]
        },
        {
          id: 'done',
          title: 'Done',
          cards: [
            { id: 'task-4', title: 'Project kickoff meeting', assignee: 'Sarah Chen' }
          ]
        }
      ]
    };
  }

  async getProjectTimeline(id: string): Promise<TimelineResponse> {
    await this.delay(160);
    return {
      items: [
        {
          id: 'milestone-1',
          type: 'milestone',
          title: 'Project Kickoff',
          start: '2024-01-15',
          owner: 'Sarah Chen',
          status: 'completed'
        },
        {
          id: 'task-dev-1',
          type: 'task', 
          title: 'Core Development Sprint',
          start: '2024-01-20',
          end: '2024-02-15',
          owner: 'Engineering Team',
          status: 'active',
          dependencies: ['milestone-1']
        },
        {
          id: 'milestone-2',
          type: 'milestone',
          title: 'Beta Release',
          start: '2024-02-20',
          owner: 'Product Team',
          status: 'planned',
          dependencies: ['task-dev-1']
        }
      ]
    };
  }

  async getTopics(): Promise<ProjectsResponse> {
    await this.delay(180);
    return {
      items: [
        { id: 'topic-1', name: 'Product Strategy', owner: 'Strategy Team', status: 'active', updatedAt: new Date().toISOString() },
        { id: 'topic-2', name: 'Technical Architecture', owner: 'Engineering', status: 'active', updatedAt: new Date(Date.now() - 43200000).toISOString() },
        { id: 'topic-3', name: 'Market Research', owner: 'Marketing', status: 'completed', updatedAt: new Date(Date.now() - 259200000).toISOString() }
      ]
    };
  }

  async getTopic(id: string): Promise<APIProjectDetail> {
    await this.delay(140);
    return {
      id,
      name: 'Product Strategy',
      description: 'Strategic planning and decision-making for product direction and market positioning.',
      owner: 'Strategy Team',
      links: [
        { type: 'document', title: 'Strategy Framework', url: '/docs/strategy' },
        { type: 'analysis', title: 'Market Analysis', url: '/reports/market' }
      ],
      artifacts: [
        { type: 'meeting', title: 'Strategy Review', date: '2024-01-10' },
        { type: 'document', title: 'Positioning Statement', date: '2024-01-12' }
      ]
    };
  }

  async generateDigest(request: DigestRequest): Promise<DigestResponse> {
    await this.delay(1500 + Math.random() * 2000);
    
    const scopeTitle = request.scope === 'project' ? 'Project' : 
                     request.scope === 'topic' ? 'Topic' : 'Global';
                     
    return {
      sections: [
        {
          title: `${scopeTitle} Overview`,
          content: `This digest provides a comprehensive summary of recent activities, key decisions, and important updates within the ${request.scope} scope.`,
          links: [
            { type: 'meeting', title: 'Recent Strategy Session', url: '/meetings/recent' }
          ]
        },
        {
          title: 'Key Insights',
          content: 'Analysis of recent data shows significant progress in core objectives with several actionable recommendations for continued success.',
          links: [
            { type: 'document', title: 'Analysis Report', url: '/reports/insights' }
          ]
        },
        {
          title: 'Action Items',
          content: 'Priority actions identified for the next phase include stakeholder alignment, resource allocation review, and timeline optimization.'
        }
      ]
    };
  }

  async listWatchers(): Promise<WatchListResponse> {
    await this.delay(120);
    return {
      paths: [
        { id: 'watch-1', path: '/home/user/documents', type: 'files' },
        { id: 'watch-2', path: '/home/user/meetings', type: 'meetings' },
        { id: 'watch-3', path: '/shared/projects', type: 'files' }
      ]
    };
  }

  async addWatcher(request: WatchAddRequest): Promise<WatchAddResponse> {
    await this.delay(100);
    return {
      id: `watch-${Date.now()}`
    };
  }

  async removeWatcher(request: WatchRemoveRequest): Promise<{ ok: true }> {
    await this.delay(80);
    return { ok: true };
  }

  async updateSchedule(request: ScheduleUpdateRequest): Promise<{ ok: true }> {
    await this.delay(100);
    console.log('Mock: Updated schedule for', request.target, 'to', request.intervalMinutes, 'minutes');
    return { ok: true };
  }

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

  async kbSearchLegacy(params: SearchParams): Promise<SearchResult> {
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
    const response = "I understand you're asking about the topics we discussed. Based on the context from your attached files, here are the key points:\n\n1. **Strategic Planning**: We covered market expansion opportunities\n2. **Resource Allocation**: Budget considerations for Q4 initiatives\n3. **Timeline Management**: Project milestones and delivery dates\n\nWould you like me to elaborate on any of these areas?";
    
    const chunks = response.split(' ');
    
    for (let i = 0; i < chunks.length; i++) {
      await this.delay(50 + Math.random() * 100);
      yield {
        type: 'content',
        content: chunks[i] + (i < chunks.length - 1 ? ' ' : '')
      } as ChatDelta;
    }

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
    console.log('Saving system config:', config);
  }
}

class APIAdapter {
  private liveProvider = new LiveProvider();
  private mockProvider = new MockProvider();

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
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('marvin:api-fallback', {
          detail: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
        window.dispatchEvent(event);
      }
      return mockCall();
    }
  }

  async uploadFiles(files: File[], type: 'email' | 'calendar' | 'files'): Promise<UploadResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.uploadFiles(files, type),
      () => this.mockProvider.uploadFiles(files, type)
    );
  }

  async ingestCommit(request: IngestRequest): Promise<IngestResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.ingestCommit(request),
      () => this.mockProvider.ingestCommit(request)
    );
  }

  async kbSearch(request: KBSearchRequest): Promise<KBSearchResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.kbSearch(request),
      () => this.mockProvider.kbSearch(request)
    );
  }

  async kbGraph(): Promise<KBGraphResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.kbGraph(),
      () => this.mockProvider.kbGraph()
    );
  }

  async getChatThreads(): Promise<ChatThreadsResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getChatThreads(),
      () => this.mockProvider.getChatThreads()
    );
  }

  async getChatHistory(threadId: string): Promise<ChatHistoryResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getChatHistory(threadId),
      () => this.mockProvider.getChatHistory(threadId)
    );
  }

  async sendChat(request: ChatSendRequest): Promise<ChatSendResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.sendChat(request),
      () => this.mockProvider.sendChat(request)
    );
  }

  async getProjects(): Promise<ProjectsResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getProjects(),
      () => this.mockProvider.getProjects()
    );
  }

  async getProject(id: string): Promise<APIProjectDetail> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getProject(id),
      () => this.mockProvider.getProject(id)
    );
  }

  async getProjectKanban(id: string): Promise<KanbanResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getProjectKanban(id),
      () => this.mockProvider.getProjectKanban(id)
    );
  }

  async getProjectTimeline(id: string): Promise<TimelineResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getProjectTimeline(id),
      () => this.mockProvider.getProjectTimeline(id)
    );
  }

  async getTopics(): Promise<ProjectsResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getTopics(),
      () => this.mockProvider.getTopics()
    );
  }

  async getTopic(id: string): Promise<APIProjectDetail> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.getTopic(id),
      () => this.mockProvider.getTopic(id)
    );
  }

  async generateDigest(request: DigestRequest): Promise<DigestResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.generateDigest(request),
      () => this.mockProvider.generateDigest(request)
    );
  }

  async listWatchers(): Promise<WatchListResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.listWatchers(),
      () => this.mockProvider.listWatchers()
    );
  }

  async addWatcher(request: WatchAddRequest): Promise<WatchAddResponse> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.addWatcher(request),
      () => this.mockProvider.addWatcher(request)
    );
  }

  async removeWatcher(request: WatchRemoveRequest): Promise<{ ok: true }> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.removeWatcher(request),
      () => this.mockProvider.removeWatcher(request)
    );
  }

  async updateSchedule(request: ScheduleUpdateRequest): Promise<{ ok: true }> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.updateSchedule(request),
      () => this.mockProvider.updateSchedule(request)
    );
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

  async kbSearchLegacy(params: SearchParams): Promise<SearchResult> {
    return this.tryLiveOrFallback(
      () => this.liveProvider.kbSearchLegacy(params),
      () => this.mockProvider.kbSearchLegacy(params)
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

  async listProjects(): Promise<Project[]> {
    const stored = localStorage.getItem('marvin-projects');
    return stored ? JSON.parse(stored) : [];
  }

  async getProjectLocal(id: string): Promise<Project | null> {
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

  async getMindmapData(type: 'project' | 'topic', id?: string): Promise<{ nodes: MindmapNode[], edges: MindmapEdge[] }> {
    const stored = localStorage.getItem(`marvin-mindmap-${type}-${id || 'default'}`);
    return stored ? JSON.parse(stored) : { nodes: [], edges: [] };
  }

  async saveMindmapData(type: 'project' | 'topic', data: { nodes: MindmapNode[], edges: MindmapEdge[] }, id?: string): Promise<void> {
    localStorage.setItem(`marvin-mindmap-${type}-${id || 'default'}`, JSON.stringify(data));
  }

  async getToolPermissions(): Promise<ToolPermission[]> {
    const stored = localStorage.getItem('marvin-tool-permissions');
    return stored ? JSON.parse(stored) : [];
  }

  async saveToolPermission(permission: ToolPermission): Promise<void> {
    const permissions = await this.getToolPermissions();
    const index = permissions.findIndex(p => p.toolId === permission.toolId);
    
    if (index >= 0) {
      permissions[index] = permission;
    } else {
      permissions.push(permission);
    }
    
    localStorage.setItem('marvin-tool-permissions', JSON.stringify(permissions));
  }

  async requestToolUsage(request: ToolUsageRequest): Promise<string> {
    const taskId = `task-${Date.now()}`;
    console.log('Tool usage requested:', { taskId, ...request });
    return taskId;
  }

  async runIngestionNow(): Promise<{ status: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { status: 'Ingestion started' };
  }

  async reindexSelection(paths: string[]): Promise<{ status: string, pathsProcessed: number }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { status: 'Reindexing complete', pathsProcessed: paths.length };
  }
}

export const apiAdapter = new APIAdapter();