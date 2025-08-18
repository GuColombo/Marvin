import { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  ProcessedFile, 
  Topic, 
  BehaviorRule, 
  ChatThread, 
  MeetingSummary, 
  EmailSummary, 
  DataMode 
} from '@/lib/types';

interface MarvinState {
  files: ProcessedFile[];
  topics: Topic[];
  behaviorRules: BehaviorRule[];
  chatThreads: ChatThread[];
  meetings: MeetingSummary[];
  emails: EmailSummary[];
  dataMode: DataMode;
}

type MarvinAction =
  | { type: 'ADD_FILE'; payload: ProcessedFile }
  | { type: 'UPDATE_FILE'; payload: { id: string; updates: Partial<ProcessedFile> } }
  | { type: 'ADD_TOPIC'; payload: Topic }
  | { type: 'UPDATE_TOPIC'; payload: { id: string; updates: Partial<Topic> } }
  | { type: 'DELETE_TOPIC'; payload: string }
  | { type: 'ADD_BEHAVIOR_RULE'; payload: BehaviorRule }
  | { type: 'UPDATE_BEHAVIOR_RULE'; payload: { id: string; updates: Partial<BehaviorRule> } }
  | { type: 'DELETE_BEHAVIOR_RULE'; payload: string }
  | { type: 'SET_CHAT_THREADS'; payload: ChatThread[] }
  | { type: 'ADD_CHAT_THREAD'; payload: ChatThread }
  | { type: 'UPDATE_CHAT_THREAD'; payload: { id: string; updates: Partial<ChatThread> } }
  | { type: 'SET_MEETINGS'; payload: MeetingSummary[] }
  | { type: 'SET_EMAILS'; payload: EmailSummary[] }
  | { type: 'SET_DATA_MODE'; payload: DataMode }
  | { type: 'LOAD_STATE'; payload: MarvinState };

const initialState: MarvinState = {
  files: [],
  topics: [
    { id: '1', name: 'Strategy', keywords: ['strategic', 'plan', 'vision', 'goals'], color: '#3b82f6' },
    { id: '2', name: 'Finance', keywords: ['budget', 'revenue', 'cost', 'profit'], color: '#10b981' },
    { id: '3', name: 'Operations', keywords: ['process', 'workflow', 'efficiency', 'operations'], color: '#f59e0b' },
    { id: '4', name: 'General', keywords: [], color: '#6b7280' }
  ],
  behaviorRules: [
    { id: '1', name: 'Executive Tone', condition: 'all_outputs', action: 'use_executive_language', enabled: true },
    { id: '2', name: 'No Emojis', condition: 'all_outputs', action: 'remove_emojis', enabled: true },
    { id: '3', name: 'MECE Structure', condition: 'strategic_content', action: 'apply_mece_framework', enabled: true }
  ],
  chatThreads: [],
  meetings: [],
  emails: [],
  dataMode: 'mock'
};

function marvinReducer(state: MarvinState, action: MarvinAction): MarvinState {
  switch (action.type) {
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] };
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload.id ? { ...file, ...action.payload.updates } : file
        )
      };
    case 'ADD_TOPIC':
      return { ...state, topics: [...state.topics, action.payload] };
    case 'UPDATE_TOPIC':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.id ? { ...topic, ...action.payload.updates } : topic
        )
      };
    case 'DELETE_TOPIC':
      return { ...state, topics: state.topics.filter(topic => topic.id !== action.payload) };
    case 'ADD_BEHAVIOR_RULE':
      return { ...state, behaviorRules: [...state.behaviorRules, action.payload] };
    case 'UPDATE_BEHAVIOR_RULE':
      return {
        ...state,
        behaviorRules: state.behaviorRules.map(rule =>
          rule.id === action.payload.id ? { ...rule, ...action.payload.updates } : rule
        )
      };
    case 'DELETE_BEHAVIOR_RULE':
      return { ...state, behaviorRules: state.behaviorRules.filter(rule => rule.id !== action.payload) };
    case 'SET_CHAT_THREADS':
      return { ...state, chatThreads: action.payload };
    case 'ADD_CHAT_THREAD':
      return { ...state, chatThreads: [...state.chatThreads, action.payload] };
    case 'UPDATE_CHAT_THREAD':
      return {
        ...state,
        chatThreads: state.chatThreads.map(thread =>
          thread.id === action.payload.id ? { ...thread, ...action.payload.updates } : thread
        )
      };
    case 'SET_MEETINGS':
      return { ...state, meetings: action.payload };
    case 'SET_EMAILS':
      return { ...state, emails: action.payload };
    case 'SET_DATA_MODE':
      return { ...state, dataMode: action.payload };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

const MarvinContext = createContext<{
  state: MarvinState;
  dispatch: React.Dispatch<MarvinAction>;
} | null>(null);

export function MarvinProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(marvinReducer, initialState);

  return (
    <MarvinContext.Provider value={{ state, dispatch }}>
      {children}
    </MarvinContext.Provider>
  );
}

export function useMarvin() {
  const context = useContext(MarvinContext);
  if (!context) {
    throw new Error('useMarvin must be used within a MarvinProvider');
  }
  return context;
}