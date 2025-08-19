export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'word' | 'powerpoint' | 'excel';
  category: 'strategy' | 'financial' | 'presentation' | 'custom';
  description: string;
  frameworkIds: string[];
  tokens: string[];
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandAssets {
  logo?: File | string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  watermark?: File | string;
}

export interface ProjectBranding extends BrandAssets {
  projectId?: string;
}

const builtInTemplates: DocumentTemplate[] = [
  {
    id: 'strategy-brief-word',
    name: 'Strategic Brief',
    type: 'word',
    category: 'strategy',
    description: 'Executive strategic analysis document',
    frameworkIds: ['mece', 'swot', 'porters-five-forces'],
    tokens: ['{{project.name}}', '{{date}}', '{{stakeholders}}', '{{objectives}}', '{{insights}}', '{{recommendations}}'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mckinsey-deck-ppt',
    name: 'McKinsey-Style Deck',
    type: 'powerpoint',
    category: 'presentation',
    description: 'Professional consulting presentation template',
    frameworkIds: ['mece', 'mckinsey-7s'],
    tokens: ['{{project.name}}', '{{date}}', '{{executive.summary}}', '{{recommendations}}', '{{next.steps}}'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bain-deck-ppt',
    name: 'Bain-Style Deck',
    type: 'powerpoint',
    category: 'presentation',
    description: 'Clean, results-focused presentation template',
    frameworkIds: ['swot', 'bcg-matrix'],
    tokens: ['{{project.name}}', '{{date}}', '{{situation}}', '{{insights}}', '{{recommendations}}'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bcg-deck-ppt',
    name: 'BCG-Style Deck',
    type: 'powerpoint',
    category: 'presentation',
    description: 'Bold, insight-driven presentation template',
    frameworkIds: ['bcg-matrix', 'porters-five-forces'],
    tokens: ['{{project.name}}', '{{date}}', '{{insights}}', '{{implications}}', '{{actions}}'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'financial-model-excel',
    name: 'Financial Analysis Model',
    type: 'excel',
    category: 'financial',
    description: 'Comprehensive financial analysis spreadsheet',
    frameworkIds: ['bcg-matrix'],
    tokens: ['{{project.name}}', '{{date}}', '{{assumptions}}', '{{projections}}', '{{scenarios}}'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'market-analysis-excel',
    name: 'Market Analysis Model',
    type: 'excel',
    category: 'strategy',
    description: 'Market sizing and competitive analysis spreadsheet',
    frameworkIds: ['porters-five-forces'],
    tokens: ['{{market.size}}', '{{competitors}}', '{{growth.rate}}', '{{segments}}'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultBrandAssets: BrandAssets = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#ffffff',
    text: '#1e293b'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  }
};

export class TemplateManager {
  private templatesKey = 'marvin-templates';
  private brandingKey = 'marvin-branding';
  private projectBrandingKey = 'marvin-project-branding';

  getTemplates(): DocumentTemplate[] {
    const stored = localStorage.getItem(this.templatesKey);
    const customTemplates = stored ? JSON.parse(stored) : [];
    return [...builtInTemplates, ...customTemplates];
  }

  getTemplate(id: string): DocumentTemplate | undefined {
    return this.getTemplates().find(t => t.id === id);
  }

  getTemplatesByFramework(frameworkId: string): DocumentTemplate[] {
    return this.getTemplates().filter(t => t.frameworkIds.includes(frameworkId));
  }

  getTemplatesByType(type: DocumentTemplate['type']): DocumentTemplate[] {
    return this.getTemplates().filter(t => t.type === type);
  }

  addTemplate(template: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt' | 'isBuiltIn'>): DocumentTemplate {
    const newTemplate: DocumentTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBuiltIn: false
    };

    const customTemplates = this.getCustomTemplates();
    customTemplates.push(newTemplate);
    this.saveCustomTemplates(customTemplates);
    
    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<DocumentTemplate>): DocumentTemplate | null {
    const template = this.getTemplate(id);
    if (!template || template.isBuiltIn) return null;

    const customTemplates = this.getCustomTemplates();
    const index = customTemplates.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTemplate = {
      ...customTemplates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    customTemplates[index] = updatedTemplate;
    this.saveCustomTemplates(customTemplates);
    
    return updatedTemplate;
  }

  deleteTemplate(id: string): boolean {
    const template = this.getTemplate(id);
    if (!template || template.isBuiltIn) return false;

    const customTemplates = this.getCustomTemplates();
    const filtered = customTemplates.filter(t => t.id !== id);
    this.saveCustomTemplates(filtered);
    
    return true;
  }

  getBrandAssets(): BrandAssets {
    const stored = localStorage.getItem(this.brandingKey);
    return stored ? { ...defaultBrandAssets, ...JSON.parse(stored) } : defaultBrandAssets;
  }

  setBrandAssets(assets: Partial<BrandAssets>): void {
    const current = this.getBrandAssets();
    const updated = { ...current, ...assets };
    localStorage.setItem(this.brandingKey, JSON.stringify(updated));
  }

  getProjectBranding(projectId: string): ProjectBranding {
    const stored = localStorage.getItem(this.projectBrandingKey);
    const projectBrandings = stored ? JSON.parse(stored) : {};
    return projectBrandings[projectId] || this.getBrandAssets();
  }

  setProjectBranding(projectId: string, branding: Partial<ProjectBranding>): void {
    const stored = localStorage.getItem(this.projectBrandingKey);
    const projectBrandings = stored ? JSON.parse(stored) : {};
    
    projectBrandings[projectId] = {
      ...this.getBrandAssets(),
      ...projectBrandings[projectId],
      ...branding,
      projectId
    };
    
    localStorage.setItem(this.projectBrandingKey, JSON.stringify(projectBrandings));
  }

  replaceTokens(content: string, tokens: Record<string, string>): string {
    let result = content;
    Object.entries(tokens).forEach(([key, value]) => {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(pattern, value);
    });
    return result;
  }

  private getCustomTemplates(): DocumentTemplate[] {
    const stored = localStorage.getItem(this.templatesKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCustomTemplates(templates: DocumentTemplate[]): void {
    localStorage.setItem(this.templatesKey, JSON.stringify(templates));
  }

  getAvailableTokens(): string[] {
    return [
      'project.name',
      'project.description',
      'date',
      'stakeholders',
      'objectives',
      'insights',
      'recommendations',
      'next.steps',
      'executive.summary',
      'situation',
      'implications',
      'actions',
      'assumptions',
      'projections',
      'scenarios',
      'market.size',
      'competitors',
      'growth.rate',
      'segments'
    ];
  }
}

export const templateManager = new TemplateManager();