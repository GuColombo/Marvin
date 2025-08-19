interface LiveAPIEndpoints {
  baseURL: string;
  gatewayURL: string;
}

interface SearchFilters {
  type?: string[];
  date?: { start: string; end: string };
  tags?: string[];
  score?: { min: number; max: number };
}

interface ChatOptions {
  projectContext?: string;
  useToolsPermission?: boolean;
  budgetCap?: number;
}

interface UploadResponse {
  id: string;
  status: 'success' | 'error';
  message?: string;
}

interface ChatResponse {
  id: string;
  content: string;
  toolUsage?: {
    tool: string;
    cost: number;
    output: any;
  }[];
}

interface WatcherConfig {
  id: string;
  name: string;
  type: 'email' | 'calendar' | 'files';
  schedule: string;
  timeWindow?: { start: string; end: string };
  enabled: boolean;
}

export class LiveAPIProvider {
  private endpoints: LiveAPIEndpoints;
  private isAvailable: boolean = false;

  constructor() {
    this.endpoints = {
      baseURL: import.meta.env.VITE_API_URL || '',
      gatewayURL: import.meta.env.VITE_GW_URL || '',
    };
    this.isAvailable = !!(this.endpoints.baseURL && this.endpoints.gatewayURL);
  }

  async checkHealth(): Promise<boolean> {
    if (!this.isAvailable) return false;
    
    try {
      const response = await fetch(`${this.endpoints.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async uploadEmail(files: File[]): Promise<UploadResponse> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await fetch(`${this.endpoints.baseURL}/upload/email`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }

  async uploadCalendar(files: File[]): Promise<UploadResponse> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await fetch(`${this.endpoints.baseURL}/upload/calendar`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }

  async ingestCommit(payload: any): Promise<{ success: boolean }> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const response = await fetch(`${this.endpoints.baseURL}/ingest/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) throw new Error('Ingestion failed');
    return response.json();
  }

  async searchKB(query: string, filters: SearchFilters = {}): Promise<any[]> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const params = new URLSearchParams({ q: query });
    if (filters.type?.length) params.append('type', filters.type.join(','));
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    
    const response = await fetch(`${this.endpoints.baseURL}/index/search?${params}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  }

  async chat(messages: any[], options: ChatOptions = {}): Promise<ChatResponse> {
    const chatURL = this.endpoints.gatewayURL 
      ? `${this.endpoints.gatewayURL}/v1/chat/completions`
      : `${this.endpoints.baseURL}/chat`;
    
    if (!chatURL) throw new Error('Chat endpoint not available');
    
    const response = await fetch(chatURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, ...options }),
    });
    
    if (!response.ok) throw new Error('Chat failed');
    return response.json();
  }

  async listWatchers(): Promise<WatcherConfig[]> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const response = await fetch(`${this.endpoints.baseURL}/watchers`);
    if (!response.ok) throw new Error('Failed to list watchers');
    return response.json();
  }

  async upsertWatcher(config: WatcherConfig): Promise<WatcherConfig> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const response = await fetch(`${this.endpoints.baseURL}/watchers/${config.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) throw new Error('Failed to update watcher');
    return response.json();
  }

  async runWatcherNow(id: string): Promise<{ success: boolean }> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const response = await fetch(`${this.endpoints.baseURL}/watchers/${id}/run`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to run watcher');
    return response.json();
  }

  async getConfig(): Promise<any> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const response = await fetch(`${this.endpoints.baseURL}/config`);
    if (!response.ok) throw new Error('Failed to get config');
    return response.json();
  }

  async setConfig(config: any): Promise<{ success: boolean }> {
    if (!this.isAvailable) throw new Error('Live API not available');
    
    const response = await fetch(`${this.endpoints.baseURL}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) throw new Error('Failed to set config');
    return response.json();
  }

  get available(): boolean {
    return this.isAvailable;
  }
}