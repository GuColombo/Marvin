// Extended types for Marvin UI v0.5

export interface ProcessedFile {
  id: string;
  name: string;
  content: string;
  topics: string[];
  timestamp: Date;
  status: 'processed' | 'processing' | 'error';
  type: string;
  size: number;
}

export interface Topic {
  id: string;
  name: string;
  keywords: string[];
  color: string;
}

export interface BehaviorRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

// New types for v0.5

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  attachments?: ContextAttachment[];
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastActivity: Date;
  isPinned?: boolean;
}

export interface Citation {
  id: string;
  type: 'meeting' | 'file' | 'email' | 'kb';
  sourceId: string;
  snippet: string;
  title: string;
}

export interface ContextAttachment {
  id: string;
  type: 'meeting' | 'file' | 'email' | 'kb';
  title: string;
  preview: string;
}

export interface MeetingSummary {
  id: string;
  title: string;
  date: Date;
  duration: number;
  participants: string[];
  hasTranscript: boolean;
  hasActions: boolean;
  status: 'processed' | 'processing' | 'error';
}

export interface MeetingDetail extends MeetingSummary {
  insights: {
    goals: string[];
    decisions: string[];
    risks: string[];
    timelines: string[];
  };
  actions: MeetingAction[];
  transcript: TranscriptSegment[];
  provenance: ProvenanceInfo;
}

export interface MeetingAction {
  id: string;
  description: string;
  owner: string;
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
  confidence: number;
}

export interface FileSummary {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'processed' | 'processing' | 'error';
  hasInsights: boolean;
}

export interface FileDetail extends FileSummary {
  content: string;
  insights: {
    summary: string;
    keyTopics: string[];
    relevantQuotes: string[];
  };
  provenance: ProvenanceInfo;
}

export interface EmailSummary {
  id: string;
  subject: string;
  threadId: string;
  participants: string[];
  messageCount: number;
  lastActivity: Date;
  hasActions: boolean;
}

export interface EmailDetail extends EmailSummary {
  messages: EmailMessage[];
  insights: {
    summary: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    actionItems: string[];
  };
  provenance: ProvenanceInfo;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface KBItem {
  id: string;
  title: string;
  type: 'meeting' | 'file' | 'email' | 'note';
  snippet: string;
  tags: string[];
  relevanceScore: number;
  lastUpdated: Date;
  sourceId: string;
}

export interface KBItemDetail extends KBItem {
  fullContent: string;
  provenance: ProvenanceInfo;
  relatedItems: KBItem[];
}

export interface ProvenanceInfo {
  sourcePath: string;
  sourceHash: string;
  ingestedAt: Date;
  processedAt: Date;
  confidence: number;
}

export interface HealthStatus {
  status: 'green' | 'amber' | 'red';
  http: '200' | '000' | string;
  message?: string;
}

export interface SearchParams {
  query?: string;
  type?: 'meeting' | 'file' | 'email' | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  total: number;
  items: KBItem[];
}

export interface ChatDelta {
  type: 'content' | 'citation' | 'done';
  content?: string;
  citation?: Citation;
}

export type DataMode = 'mock' | 'live';

// Enhanced Settings Configuration Types

export interface WatchPath {
  id: string;
  path: string;
  type: 'files' | 'meetings';
  enabled: boolean;
  autoProcess: boolean;
  supportedFormats: string[];
  lastScanned?: Date;
  status: 'active' | 'error' | 'inactive';
  errorMessage?: string;
}

export interface EmailConfig {
  provider: 'outlook' | 'gmail' | 'custom';
  enabled: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  syncFrequency: number; // minutes
  processingEnabled: boolean;
  folders: string[];
  errorMessage?: string;
}

export interface MeetingConfig {
  autoTranscription: boolean;
  supportedFormats: string[];
  calendarSync: boolean;
  calendarProvider?: 'outlook' | 'google' | 'custom';
  processRecordings: boolean;
  extractActions: boolean;
}

export interface NotificationConfig {
  systemNotifications: boolean;
  errorAlerts: boolean;
  processingUpdates: boolean;
  emailDigest: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface PrivacyConfig {
  dataRetention: number; // days
  allowTelemetry: boolean;
  encryptLocal: boolean;
  autoBackup: boolean;
  backupLocation?: string;
}

export interface AIBehaviorConfig {
  responseStyle: 'concise' | 'balanced' | 'detailed';
  analysisDepth: 'surface' | 'strategic' | 'comprehensive';
  proactivityLevel: 'reactive' | 'moderate' | 'proactive';
  confidenceThreshold: number;
  suggestionsEnabled: boolean;
}

export interface SystemConfig {
  watchPaths: WatchPath[];
  emailConfig: EmailConfig;
  meetingConfig: MeetingConfig;
  notificationConfig: NotificationConfig;
  privacyConfig: PrivacyConfig;
  aiBehaviorConfig: AIBehaviorConfig;
  lastUpdated: Date;
  version: string;
}