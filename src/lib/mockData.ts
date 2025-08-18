import { 
  MeetingSummary, 
  MeetingDetail, 
  FileSummary, 
  FileDetail, 
  EmailSummary, 
  EmailDetail, 
  KBItem, 
  KBItemDetail, 
  ChatThread,
  HealthStatus 
} from './types';

// Mock Health Status
export const mockHealth: HealthStatus = {
  status: 'green',
  http: '200',
  message: 'Mock mode active'
};

// Mock Meetings
export const mockMeetings: MeetingSummary[] = [
  {
    id: 'meeting-1',
    title: 'Q4 Strategy Planning Session',
    date: new Date('2024-01-15T14:00:00'),
    duration: 90,
    participants: ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown'],
    hasTranscript: true,
    hasActions: true,
    status: 'processed'
  },
  {
    id: 'meeting-2',
    title: 'Product Roadmap Review',
    date: new Date('2024-01-12T10:30:00'),
    duration: 60,
    participants: ['Eve Davis', 'Frank Miller', 'Grace Wilson'],
    hasTranscript: true,
    hasActions: false,
    status: 'processed'
  },
  {
    id: 'meeting-3',
    title: 'Weekly Team Sync',
    date: new Date('2024-01-10T09:00:00'),
    duration: 30,
    participants: ['Alice Johnson', 'Bob Smith'],
    hasTranscript: false,
    hasActions: true,
    status: 'processing'
  }
];

export const mockMeetingDetails: Record<string, MeetingDetail> = {
  'meeting-1': {
    ...mockMeetings[0],
    insights: {
      goals: [
        'Increase market share by 15% in Q4',
        'Launch new product line by year-end',
        'Improve customer satisfaction scores'
      ],
      decisions: [
        'Allocate additional budget to marketing',
        'Hire 3 new engineers for product development',
        'Implement new customer feedback system'
      ],
      risks: [
        'Tight timeline for product launch',
        'Potential supply chain delays',
        'Competition from new market entrants'
      ],
      timelines: [
        'Marketing campaign launch: February 1st',
        'Beta testing phase: March 15th',
        'Product launch: November 30th'
      ]
    },
    actions: [
      {
        id: 'action-1',
        description: 'Prepare marketing budget proposal',
        owner: 'Alice Johnson',
        dueDate: new Date('2024-01-22'),
        status: 'pending'
      },
      {
        id: 'action-2',
        description: 'Begin recruitment for engineering roles',
        owner: 'Bob Smith',
        dueDate: new Date('2024-01-30'),
        status: 'in-progress'
      }
    ],
    transcript: [
      {
        id: 'seg-1',
        speaker: 'Alice Johnson',
        text: 'Good afternoon everyone. Let\'s start with our Q4 strategy discussion.',
        timestamp: 0,
        confidence: 0.95
      },
      {
        id: 'seg-2',
        speaker: 'Bob Smith',
        text: 'I think we need to focus on the market expansion opportunities we identified.',
        timestamp: 15,
        confidence: 0.92
      },
      {
        id: 'seg-3',
        speaker: 'Carol Williams',
        text: 'The budget allocation for marketing looks reasonable, but we should consider the timing.',
        timestamp: 45,
        confidence: 0.89
      }
    ],
    provenance: {
      sourcePath: '/uploads/meetings/q4-strategy-2024.mp4',
      sourceHash: 'sha256:abc123def456',
      ingestedAt: new Date('2024-01-15T16:00:00'),
      processedAt: new Date('2024-01-15T16:30:00'),
      confidence: 0.92
    }
  }
};

// Mock Files
export const mockFiles: FileSummary[] = [
  {
    id: 'file-1',
    name: 'Market Analysis Report 2024.pdf',
    type: 'pdf',
    size: 2048576,
    uploadDate: new Date('2024-01-14T11:00:00'),
    status: 'processed',
    hasInsights: true
  },
  {
    id: 'file-2',
    name: 'Product Requirements Document.docx',
    type: 'docx',
    size: 1024768,
    uploadDate: new Date('2024-01-13T15:30:00'),
    status: 'processed',
    hasInsights: true
  },
  {
    id: 'file-3',
    name: 'Financial Projections Q4.xlsx',
    type: 'xlsx',
    size: 512384,
    uploadDate: new Date('2024-01-12T09:45:00'),
    status: 'processed',
    hasInsights: true
  },
  {
    id: 'file-4',
    name: 'Presentation Draft.pptx',
    type: 'pptx',
    size: 3072890,
    uploadDate: new Date('2024-01-11T14:20:00'),
    status: 'processing',
    hasInsights: false
  }
];

export const mockFileDetails: Record<string, FileDetail> = {
  'file-1': {
    ...mockFiles[0],
    content: 'Market Analysis Report 2024\n\nExecutive Summary\nThe market shows strong growth potential with emerging opportunities in the digital transformation sector. Key findings indicate a 23% increase in demand for AI-powered solutions...',
    insights: {
      summary: 'Comprehensive market analysis revealing strong growth opportunities in AI sector with specific recommendations for product positioning.',
      keyTopics: ['Market Growth', 'AI Solutions', 'Digital Transformation', 'Competitive Analysis'],
      relevantQuotes: [
        'The market shows strong growth potential with emerging opportunities',
        '23% increase in demand for AI-powered solutions',
        'Key competitors are focusing on enterprise solutions'
      ]
    },
    provenance: {
      sourcePath: '/uploads/documents/market-analysis-2024.pdf',
      sourceHash: 'sha256:def789abc012',
      ingestedAt: new Date('2024-01-14T11:00:00'),
      processedAt: new Date('2024-01-14T11:15:00'),
      confidence: 0.94
    }
  }
};

// Mock Emails
export const mockEmails: EmailSummary[] = [
  {
    id: 'email-1',
    subject: 'Project Timeline Updates',
    threadId: 'thread-1',
    participants: ['alice@company.com', 'bob@company.com', 'carol@company.com'],
    messageCount: 4,
    lastActivity: new Date('2024-01-16T10:30:00'),
    hasActions: true
  },
  {
    id: 'email-2',
    subject: 'Budget Approval Request',
    threadId: 'thread-2',
    participants: ['finance@company.com', 'manager@company.com'],
    messageCount: 2,
    lastActivity: new Date('2024-01-15T16:45:00'),
    hasActions: false
  }
];

export const mockEmailDetails: Record<string, EmailDetail> = {
  'email-1': {
    ...mockEmails[0],
    messages: [
      {
        id: 'msg-1',
        from: 'alice@company.com',
        to: ['bob@company.com', 'carol@company.com'],
        content: 'Hi team, I wanted to update you on the project timeline. We\'re looking at a slight delay due to resource constraints.',
        timestamp: new Date('2024-01-16T09:00:00'),
        isRead: true
      },
      {
        id: 'msg-2',
        from: 'bob@company.com',
        to: ['alice@company.com', 'carol@company.com'],
        content: 'Thanks for the update. Can we schedule a call to discuss alternatives?',
        timestamp: new Date('2024-01-16T10:30:00'),
        isRead: true
      }
    ],
    insights: {
      summary: 'Discussion about project delays and resource allocation with proposed solutions.',
      sentiment: 'neutral',
      actionItems: [
        'Schedule team call to discuss alternatives',
        'Review resource allocation for next quarter',
        'Update project timeline documentation'
      ]
    },
    provenance: {
      sourcePath: '/emails/project-timeline-thread',
      sourceHash: 'sha256:email123hash',
      ingestedAt: new Date('2024-01-16T11:00:00'),
      processedAt: new Date('2024-01-16T11:05:00'),
      confidence: 0.88
    }
  }
};

// Mock Knowledge Base
export const mockKBItems: KBItem[] = [
  {
    id: 'kb-1',
    title: 'Q4 Strategy Planning Session - Key Decisions',
    type: 'meeting',
    snippet: 'Allocate additional budget to marketing, hire 3 new engineers for product development...',
    tags: ['strategy', 'planning', 'budget', 'hiring'],
    relevanceScore: 0.95,
    lastUpdated: new Date('2024-01-15T16:30:00'),
    sourceId: 'meeting-1'
  },
  {
    id: 'kb-2',
    title: 'Market Analysis Report 2024 - Growth Opportunities',
    type: 'file',
    snippet: '23% increase in demand for AI-powered solutions with strong growth potential...',
    tags: ['market', 'analysis', 'AI', 'growth'],
    relevanceScore: 0.89,
    lastUpdated: new Date('2024-01-14T11:15:00'),
    sourceId: 'file-1'
  },
  {
    id: 'kb-3',
    title: 'Project Timeline Updates - Resource Constraints',
    type: 'email',
    snippet: 'Slight delay due to resource constraints, need to discuss alternatives...',
    tags: ['project', 'timeline', 'resources', 'delay'],
    relevanceScore: 0.76,
    lastUpdated: new Date('2024-01-16T11:05:00'),
    sourceId: 'email-1'
  }
];

export const mockKBDetails: Record<string, KBItemDetail> = {
  'kb-1': {
    ...mockKBItems[0],
    fullContent: 'Complete knowledge base entry for Q4 Strategy Planning Session including all key decisions, goals, and action items discussed during the meeting.',
    provenance: {
      sourcePath: '/uploads/meetings/q4-strategy-2024.mp4',
      sourceHash: 'sha256:abc123def456',
      ingestedAt: new Date('2024-01-15T16:00:00'),
      processedAt: new Date('2024-01-15T16:30:00'),
      confidence: 0.92
    },
    relatedItems: [mockKBItems[1], mockKBItems[2]]
  }
};

// Mock Chat Threads
export const mockChatThreads: ChatThread[] = [
  {
    id: 'chat-1',
    title: 'Q4 Strategy Discussion',
    messages: [
      {
        id: 'msg-chat-1',
        role: 'user',
        content: 'What were the main decisions from our Q4 strategy meeting?',
        timestamp: new Date('2024-01-16T14:00:00'),
        attachments: [
          {
            id: 'attach-1',
            type: 'meeting',
            title: 'Q4 Strategy Planning Session',
            preview: 'Meeting from Jan 15, 2024 with 4 participants'
          }
        ]
      },
      {
        id: 'msg-chat-2',
        role: 'assistant',
        content: 'Based on the Q4 Strategy Planning Session, there were three main decisions:\n\n1. **Budget Allocation**: Allocate additional budget to marketing initiatives\n2. **Team Expansion**: Hire 3 new engineers for product development\n3. **Customer Experience**: Implement new customer feedback system\n\nThese decisions support the goals of increasing market share by 15% and launching the new product line by year-end.',
        timestamp: new Date('2024-01-16T14:01:00'),
        citations: [
          {
            id: 'cite-1',
            type: 'meeting',
            sourceId: 'meeting-1',
            snippet: 'Allocate additional budget to marketing, hire 3 new engineers...',
            title: 'Q4 Strategy Planning Session'
          }
        ]
      }
    ],
    lastActivity: new Date('2024-01-16T14:01:00'),
    isPinned: true
  },
  {
    id: 'chat-2',
    title: 'Market Research Insights',
    messages: [
      {
        id: 'msg-chat-3',
        role: 'user',
        content: 'Summarize the key findings from our market analysis report',
        timestamp: new Date('2024-01-15T11:00:00')
      }
    ],
    lastActivity: new Date('2024-01-15T11:00:00'),
    isPinned: false
  }
];