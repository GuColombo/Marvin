import { z } from 'zod';

export const UploadResponseSchema = z.object({
  run_id: z.string(),
  files_saved: z.number()
});

export const IngestRequestSchema = z.object({
  paths: z.array(z.string()),
  collection: z.string()
});

export const IngestResponseSchema = z.object({
  files: z.number(),
  chunks_added: z.number()
});

export const KBSearchRequestSchema = z.object({
  query: z.string(),
  filters: z.record(z.string()).optional()
});

export const KBSearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  score: z.number(),
  source: z.string(),
  snippet: z.string()
});

export const KBSearchResponseSchema = z.object({
  results: z.array(KBSearchResultSchema)
});

export const KBGraphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string().optional()
});

export const KBGraphEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  weight: z.number().optional(),
  label: z.string().optional()
});

export const KBGraphResponseSchema = z.object({
  nodes: z.array(KBGraphNodeSchema),
  edges: z.array(KBGraphEdgeSchema)
});

export const ChatThreadSchema = z.object({
  id: z.string(),
  name: z.string(),
  updatedAt: z.string()
});

export const ChatThreadsResponseSchema = z.object({
  threads: z.array(ChatThreadSchema)
});

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
  ts: z.string(),
  toolUsage: z.any().optional()
});

export const ChatHistoryResponseSchema = z.object({
  messages: z.array(ChatMessageSchema)
});

export const ChatSendRequestSchema = z.object({
  threadId: z.string().optional(),
  message: z.string()
});

export const ChatSendResponseSchema = z.object({
  reply: z.string(),
  citations: z.array(z.any()).optional(),
  steps: z.array(z.any()).optional()
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  owner: z.string().optional(),
  status: z.string(),
  updatedAt: z.string()
});

export const ProjectsResponseSchema = z.object({
  items: z.array(ProjectItemSchema)
});

export const ProjectDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  owner: z.string(),
  links: z.array(z.any()).optional(),
  artifacts: z.array(z.any()).optional()
});

export const KanbanCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  assignee: z.string().optional(),
  due: z.string().optional()
});

export const KanbanColumnSchema = z.object({
  id: z.string(),
  title: z.string(),
  cards: z.array(KanbanCardSchema)
});

export const KanbanResponseSchema = z.object({
  columns: z.array(KanbanColumnSchema)
});

export const TimelineItemSchema = z.object({
  id: z.string(),
  type: z.enum(['milestone', 'task']),
  title: z.string(),
  start: z.string(),
  end: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().optional(),
  dependencies: z.array(z.string()).optional()
});

export const TimelineResponseSchema = z.object({
  items: z.array(TimelineItemSchema)
});

export const DigestSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  links: z.array(z.any()).optional()
});

export const DigestRequestSchema = z.object({
  scope: z.enum(['project', 'topic', 'global']),
  id: z.string().optional()
});

export const DigestResponseSchema = z.object({
  sections: z.array(DigestSectionSchema)
});

export const WatchPathSchema = z.object({
  id: z.string(),
  path: z.string(),
  type: z.enum(['files', 'meetings'])
});

export const WatchListResponseSchema = z.object({
  paths: z.array(WatchPathSchema)
});

export const WatchAddRequestSchema = z.object({
  path: z.string(),
  type: z.enum(['files', 'meetings'])
});

export const WatchAddResponseSchema = z.object({
  id: z.string()
});

export const WatchRemoveRequestSchema = z.object({
  id: z.string()
});

export const ScheduleWindowSchema = z.object({
  start: z.string(),
  end: z.string()
});

export const ScheduleUpdateRequestSchema = z.object({
  target: z.enum(['files', 'meetings']),
  intervalMinutes: z.number(),
  window: ScheduleWindowSchema
});

export const SuccessResponseSchema = z.object({
  ok: z.literal(true)
});

export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type IngestRequest = z.infer<typeof IngestRequestSchema>;
export type IngestResponse = z.infer<typeof IngestResponseSchema>;
export type KBSearchRequest = z.infer<typeof KBSearchRequestSchema>;
export type KBSearchResult = z.infer<typeof KBSearchResultSchema>;
export type KBSearchResponse = z.infer<typeof KBSearchResponseSchema>;
export type KBGraphResponse = z.infer<typeof KBGraphResponseSchema>;
export type ChatThreadsResponse = z.infer<typeof ChatThreadsResponseSchema>;
export type ChatHistoryResponse = z.infer<typeof ChatHistoryResponseSchema>;
export type ChatSendRequest = z.infer<typeof ChatSendRequestSchema>;
export type ChatSendResponse = z.infer<typeof ChatSendResponseSchema>;
export type ProjectsResponse = z.infer<typeof ProjectsResponseSchema>;
export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
export type KanbanResponse = z.infer<typeof KanbanResponseSchema>;
export type TimelineResponse = z.infer<typeof TimelineResponseSchema>;
export type DigestRequest = z.infer<typeof DigestRequestSchema>;
export type DigestResponse = z.infer<typeof DigestResponseSchema>;
export type WatchListResponse = z.infer<typeof WatchListResponseSchema>;
export type WatchAddRequest = z.infer<typeof WatchAddRequestSchema>;
export type WatchAddResponse = z.infer<typeof WatchAddResponseSchema>;
export type WatchRemoveRequest = z.infer<typeof WatchRemoveRequestSchema>;
export type ScheduleUpdateRequest = z.infer<typeof ScheduleUpdateRequestSchema>;