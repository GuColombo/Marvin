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
  DataMode 
} from './types';
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
  mockChatThreads 
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// API Adapter that switches between Live and Mock providers
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
}

// Export singleton instance
export const apiAdapter = new APIAdapter();