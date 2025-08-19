export interface Framework {
  id: string;
  name: string;
  description: string;
  category: 'Strategy' | 'Operating Model' | 'PMO' | 'Market' | 'Finance';
  tags: string[];
  inputPrompts: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'multi-select';
    options?: string[];
    required: boolean;
  }[];
  recommendedSteps: string[];
  outputSections: {
    id: string;
    title: string;
    description: string;
  }[];
  linkedTemplates: string[];
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;
}

const builtInFrameworks: Framework[] = [
  {
    id: 'mece',
    name: 'MECE Framework',
    description: 'Mutually Exclusive, Collectively Exhaustive problem structuring',
    category: 'Strategy',
    tags: ['problem-solving', 'structure', 'mckinsey'],
    inputPrompts: [
      { id: 'problem', label: 'Problem Statement', type: 'textarea', required: true },
      { id: 'scope', label: 'Analysis Scope', type: 'text', required: true },
      { id: 'stakeholders', label: 'Key Stakeholders', type: 'multi-select', options: ['Executive', 'Operations', 'Finance', 'IT', 'External'], required: false }
    ],
    recommendedSteps: [
      'Define the problem statement clearly',
      'Break down into mutually exclusive categories',
      'Ensure categories are collectively exhaustive',
      'Validate with stakeholders',
      'Prioritize based on impact and feasibility'
    ],
    outputSections: [
      { id: 'structure', title: 'Problem Structure', description: 'MECE breakdown of the problem' },
      { id: 'analysis', title: 'Category Analysis', description: 'Deep dive into each category' },
      { id: 'recommendations', title: 'Recommendations', description: 'Prioritized action items' }
    ],
    linkedTemplates: ['mece-analysis', 'problem-structure'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBuiltIn: true
  },
  {
    id: 'porters-five-forces',
    name: "Porter's Five Forces",
    description: 'Industry competitive analysis framework',
    category: 'Market',
    tags: ['competitive-analysis', 'industry', 'strategy'],
    inputPrompts: [
      { id: 'industry', label: 'Industry/Market', type: 'text', required: true },
      { id: 'timeframe', label: 'Analysis Timeframe', type: 'select', options: ['Current', '1 Year', '3 Years', '5 Years'], required: true },
      { id: 'geography', label: 'Geographic Scope', type: 'text', required: false }
    ],
    recommendedSteps: [
      'Define industry boundaries',
      'Analyze threat of new entrants',
      'Assess bargaining power of suppliers',
      'Evaluate bargaining power of buyers',
      'Examine threat of substitutes',
      'Analyze competitive rivalry'
    ],
    outputSections: [
      { id: 'forces-analysis', title: 'Five Forces Analysis', description: 'Detailed analysis of each force' },
      { id: 'industry-attractiveness', title: 'Industry Attractiveness', description: 'Overall industry assessment' },
      { id: 'strategic-implications', title: 'Strategic Implications', description: 'Recommendations for competitive positioning' }
    ],
    linkedTemplates: ['porters-analysis', 'competitive-landscape'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBuiltIn: true
  },
  {
    id: 'mckinsey-7s',
    name: 'McKinsey 7S Framework',
    description: 'Organizational analysis and change management framework',
    category: 'Operating Model',
    tags: ['organization', 'change-management', 'mckinsey'],
    inputPrompts: [
      { id: 'organization', label: 'Organization Name', type: 'text', required: true },
      { id: 'change-context', label: 'Change Context', type: 'textarea', required: true },
      { id: 'focus-areas', label: 'Focus Areas', type: 'multi-select', options: ['Strategy', 'Structure', 'Systems', 'Shared Values', 'Style', 'Staff', 'Skills'], required: false }
    ],
    recommendedSteps: [
      'Assess current state of all 7 elements',
      'Define desired future state',
      'Identify gaps and misalignments',
      'Develop integrated change plan',
      'Monitor implementation progress'
    ],
    outputSections: [
      { id: 'current-state', title: 'Current State Assessment', description: 'Analysis of all 7S elements' },
      { id: 'future-state', title: 'Future State Vision', description: 'Target state definition' },
      { id: 'change-roadmap', title: 'Change Roadmap', description: 'Implementation plan and timeline' }
    ],
    linkedTemplates: ['7s-analysis', 'change-roadmap'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBuiltIn: true
  },
  {
    id: 'swot',
    name: 'SWOT Analysis',
    description: 'Strengths, Weaknesses, Opportunities, Threats analysis',
    category: 'Strategy',
    tags: ['strategic-planning', 'assessment', 'decision-making'],
    inputPrompts: [
      { id: 'subject', label: 'Analysis Subject', type: 'text', required: true },
      { id: 'context', label: 'Business Context', type: 'textarea', required: true },
      { id: 'timeframe', label: 'Planning Horizon', type: 'select', options: ['6 months', '1 year', '2 years', '3+ years'], required: true }
    ],
    recommendedSteps: [
      'Identify internal strengths',
      'Assess internal weaknesses',
      'Explore external opportunities',
      'Analyze external threats',
      'Develop strategic options',
      'Prioritize initiatives'
    ],
    outputSections: [
      { id: 'swot-matrix', title: 'SWOT Matrix', description: 'Comprehensive SWOT analysis' },
      { id: 'strategic-options', title: 'Strategic Options', description: 'SO, WO, ST, WT strategies' },
      { id: 'action-plan', title: 'Action Plan', description: 'Prioritized initiatives and next steps' }
    ],
    linkedTemplates: ['swot-matrix', 'strategic-plan'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBuiltIn: true
  },
  {
    id: 'bcg-matrix',
    name: 'BCG Growth-Share Matrix',
    description: 'Portfolio analysis framework for business units or products',
    category: 'Strategy',
    tags: ['portfolio', 'investment', 'bcg'],
    inputPrompts: [
      { id: 'portfolio-units', label: 'Business Units/Products', type: 'textarea', required: true },
      { id: 'market-definition', label: 'Market Definition', type: 'text', required: true },
      { id: 'time-period', label: 'Analysis Period', type: 'text', required: true }
    ],
    recommendedSteps: [
      'Define business units and markets',
      'Calculate market share and growth rates',
      'Plot units on BCG matrix',
      'Analyze cash flow implications',
      'Develop portfolio strategy'
    ],
    outputSections: [
      { id: 'matrix-plot', title: 'BCG Matrix Plot', description: 'Visual representation of portfolio' },
      { id: 'portfolio-analysis', title: 'Portfolio Analysis', description: 'Analysis of each quadrant' },
      { id: 'investment-strategy', title: 'Investment Strategy', description: 'Resource allocation recommendations' }
    ],
    linkedTemplates: ['bcg-matrix', 'portfolio-strategy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBuiltIn: true
  }
];

export class FrameworkRegistry {
  private storageKey = 'marvin-frameworks';

  getFrameworks(): Framework[] {
    const stored = localStorage.getItem(this.storageKey);
    const customFrameworks = stored ? JSON.parse(stored) : [];
    return [...builtInFrameworks, ...customFrameworks];
  }

  getFramework(id: string): Framework | undefined {
    return this.getFrameworks().find(f => f.id === id);
  }

  getFrameworksByCategory(category: Framework['category']): Framework[] {
    return this.getFrameworks().filter(f => f.category === category);
  }

  searchFrameworks(query: string): Framework[] {
    const lowerQuery = query.toLowerCase();
    return this.getFrameworks().filter(f => 
      f.name.toLowerCase().includes(lowerQuery) ||
      f.description.toLowerCase().includes(lowerQuery) ||
      f.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  addFramework(framework: Omit<Framework, 'id' | 'createdAt' | 'updatedAt' | 'isBuiltIn'>): Framework {
    const newFramework: Framework = {
      ...framework,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBuiltIn: false
    };

    const customFrameworks = this.getCustomFrameworks();
    customFrameworks.push(newFramework);
    this.saveCustomFrameworks(customFrameworks);
    
    return newFramework;
  }

  updateFramework(id: string, updates: Partial<Framework>): Framework | null {
    const framework = this.getFramework(id);
    if (!framework || framework.isBuiltIn) return null;

    const customFrameworks = this.getCustomFrameworks();
    const index = customFrameworks.findIndex(f => f.id === id);
    if (index === -1) return null;

    const updatedFramework = {
      ...customFrameworks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    customFrameworks[index] = updatedFramework;
    this.saveCustomFrameworks(customFrameworks);
    
    return updatedFramework;
  }

  deleteFramework(id: string): boolean {
    const framework = this.getFramework(id);
    if (!framework || framework.isBuiltIn) return false;

    const customFrameworks = this.getCustomFrameworks();
    const filtered = customFrameworks.filter(f => f.id !== id);
    this.saveCustomFrameworks(filtered);
    
    return true;
  }

  private getCustomFrameworks(): Framework[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCustomFrameworks(frameworks: Framework[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(frameworks));
  }

  getCategories(): Framework['category'][] {
    return ['Strategy', 'Operating Model', 'PMO', 'Market', 'Finance'];
  }
}

export const frameworkRegistry = new FrameworkRegistry();