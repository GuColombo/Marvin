import { createContext, useContext, useReducer, ReactNode } from 'react';

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

interface ErikaState {
  files: ProcessedFile[];
  topics: Topic[];
  behaviorRules: BehaviorRule[];
}

type ErikaAction =
  | { type: 'ADD_FILE'; payload: ProcessedFile }
  | { type: 'UPDATE_FILE'; payload: { id: string; updates: Partial<ProcessedFile> } }
  | { type: 'ADD_TOPIC'; payload: Topic }
  | { type: 'UPDATE_TOPIC'; payload: { id: string; updates: Partial<Topic> } }
  | { type: 'DELETE_TOPIC'; payload: string }
  | { type: 'ADD_BEHAVIOR_RULE'; payload: BehaviorRule }
  | { type: 'UPDATE_BEHAVIOR_RULE'; payload: { id: string; updates: Partial<BehaviorRule> } }
  | { type: 'DELETE_BEHAVIOR_RULE'; payload: string }
  | { type: 'LOAD_STATE'; payload: ErikaState };

const initialState: ErikaState = {
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
  ]
};

function erikaReducer(state: ErikaState, action: ErikaAction): ErikaState {
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
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

const ErikaContext = createContext<{
  state: ErikaState;
  dispatch: React.Dispatch<ErikaAction>;
} | null>(null);

export function ErikaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(erikaReducer, initialState);

  return (
    <ErikaContext.Provider value={{ state, dispatch }}>
      {children}
    </ErikaContext.Provider>
  );
}

export function useErika() {
  const context = useContext(ErikaContext);
  if (!context) {
    throw new Error('useErika must be used within an ErikaProvider');
  }
  return context;
}