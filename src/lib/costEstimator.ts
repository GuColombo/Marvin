interface APIProvider {
  name: string;
  models: {
    [modelName: string]: {
      inputCost: number;
      outputCost: number;
      unit: 'token' | 'character' | 'request';
    };
  };
}

interface ToolConfig {
  name: string;
  provider: string;
  model?: string;
  estimatedTokens?: {
    input: number;
    output: number;
  };
  fixedCost?: number;
}

const apiProviders: Record<string, APIProvider> = {
  openai: {
    name: 'OpenAI',
    models: {
      'gpt-4': { inputCost: 0.03, outputCost: 0.06, unit: 'token' },
      'gpt-4-turbo': { inputCost: 0.01, outputCost: 0.03, unit: 'token' },
      'gpt-3.5-turbo': { inputCost: 0.0015, outputCost: 0.002, unit: 'token' },
      'text-embedding-ada-002': { inputCost: 0.0001, outputCost: 0, unit: 'token' }
    }
  },
  anthropic: {
    name: 'Anthropic',
    models: {
      'claude-3-opus': { inputCost: 0.015, outputCost: 0.075, unit: 'token' },
      'claude-3-sonnet': { inputCost: 0.003, outputCost: 0.015, unit: 'token' },
      'claude-3-haiku': { inputCost: 0.00025, outputCost: 0.00125, unit: 'token' }
    }
  },
  microsoft: {
    name: 'Microsoft Azure',
    models: {
      'outlook-api': { inputCost: 0.0002, outputCost: 0, unit: 'request' },
      'graph-api': { inputCost: 0.0001, outputCost: 0, unit: 'request' },
      'search-api': { inputCost: 0.005, outputCost: 0, unit: 'request' }
    }
  },
  google: {
    name: 'Google',
    models: {
      'gemini-pro': { inputCost: 0.00025, outputCost: 0.0005, unit: 'token' },
      'drive-api': { inputCost: 0.0001, outputCost: 0, unit: 'request' },
      'gmail-api': { inputCost: 0.0001, outputCost: 0, unit: 'request' }
    }
  }
};

const toolConfigs: Record<string, ToolConfig> = {
  'chat': {
    name: 'AI Chat',
    provider: 'openai',
    model: 'gpt-4-turbo',
    estimatedTokens: { input: 1000, output: 500 }
  },
  'email-search': {
    name: 'Email Search',
    provider: 'microsoft',
    model: 'outlook-api',
    estimatedTokens: { input: 100, output: 0 }
  },
  'calendar-search': {
    name: 'Calendar Search',
    provider: 'microsoft',
    model: 'graph-api',
    estimatedTokens: { input: 50, output: 0 }
  },
  'file-search': {
    name: 'Document Search',
    provider: 'openai',
    model: 'text-embedding-ada-002',
    estimatedTokens: { input: 500, output: 0 }
  },
  'knowledge-search': {
    name: 'Knowledge Base Search',
    provider: 'openai',
    model: 'text-embedding-ada-002',
    estimatedTokens: { input: 200, output: 0 }
  },
  'document-analysis': {
    name: 'Document Analysis',
    provider: 'openai',
    model: 'gpt-4-turbo',
    estimatedTokens: { input: 2000, output: 1000 }
  },
  'meeting-summary': {
    name: 'Meeting Summary',
    provider: 'openai',
    model: 'gpt-4-turbo',
    estimatedTokens: { input: 1500, output: 800 }
  },
  'strategic-analysis': {
    name: 'Strategic Analysis',
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    estimatedTokens: { input: 3000, output: 2000 }
  }
};

export interface CostEstimate {
  tool: string;
  provider: string;
  model: string;
  estimatedCost: number;
  breakdown: {
    inputCost: number;
    outputCost: number;
    fixedCost: number;
  };
  currency: string;
}

export interface TaskCostEstimate {
  taskId: string;
  tools: CostEstimate[];
  totalCost: number;
  currency: string;
}

export class CostEstimator {
  private usageKey = 'marvin-tool-usage';

  estimateToolCost(toolName: string, customTokens?: { input: number; output: number }): CostEstimate {
    const config = toolConfigs[toolName];
    if (!config) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    const provider = apiProviders[config.provider];
    if (!provider) {
      throw new Error(`Unknown provider: ${config.provider}`);
    }

    const model = provider.models[config.model!];
    if (!model) {
      throw new Error(`Unknown model: ${config.model} for provider: ${config.provider}`);
    }

    const tokens = customTokens || config.estimatedTokens || { input: 1000, output: 500 };
    
    let inputCost = 0;
    let outputCost = 0;
    let fixedCost = config.fixedCost || 0;

    if (model.unit === 'token') {
      inputCost = (tokens.input / 1000) * model.inputCost;
      outputCost = (tokens.output / 1000) * model.outputCost;
    } else if (model.unit === 'request') {
      inputCost = model.inputCost;
      outputCost = model.outputCost;
    }

    const estimatedCost = inputCost + outputCost + fixedCost;

    return {
      tool: config.name,
      provider: provider.name,
      model: config.model!,
      estimatedCost,
      breakdown: {
        inputCost,
        outputCost,
        fixedCost
      },
      currency: 'USD'
    };
  }

  estimateTaskCost(tools: string[], customTokens?: Record<string, { input: number; output: number }>): TaskCostEstimate {
    const taskId = `task-${Date.now()}`;
    const toolEstimates = tools.map(tool => 
      this.estimateToolCost(tool, customTokens?.[tool])
    );
    
    const totalCost = toolEstimates.reduce((sum, estimate) => sum + estimate.estimatedCost, 0);

    return {
      taskId,
      tools: toolEstimates,
      totalCost,
      currency: 'USD'
    };
  }

  recordActualUsage(taskId: string, tool: string, actualCost: number): void {
    const usage = this.getUsageHistory();
    const record = {
      taskId,
      tool,
      actualCost,
      timestamp: new Date().toISOString()
    };
    
    usage.push(record);
    
    const maxRecords = 1000;
    if (usage.length > maxRecords) {
      usage.splice(0, usage.length - maxRecords);
    }
    
    localStorage.setItem(this.usageKey, JSON.stringify(usage));
  }

  getUsageHistory(): Array<{
    taskId: string;
    tool: string;
    actualCost: number;
    timestamp: string;
  }> {
    const stored = localStorage.getItem(this.usageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getTotalSpent(period?: { start: Date; end: Date }): number {
    const usage = this.getUsageHistory();
    
    if (!period) {
      return usage.reduce((sum, record) => sum + record.actualCost, 0);
    }

    return usage
      .filter(record => {
        const timestamp = new Date(record.timestamp);
        return timestamp >= period.start && timestamp <= period.end;
      })
      .reduce((sum, record) => sum + record.actualCost, 0);
  }

  getSpentByTool(period?: { start: Date; end: Date }): Record<string, number> {
    const usage = this.getUsageHistory();
    const filtered = period 
      ? usage.filter(record => {
          const timestamp = new Date(record.timestamp);
          return timestamp >= period.start && timestamp <= period.end;
        })
      : usage;

    return filtered.reduce((acc, record) => {
      acc[record.tool] = (acc[record.tool] || 0) + record.actualCost;
      return acc;
    }, {} as Record<string, number>);
  }

  checkBudgetStatus(taskCost: number, budgetCap: number, tolerance: number = 0.1): {
    canProceed: boolean;
    percentageOfBudget: number;
    warningMessage?: string;
  } {
    const percentage = taskCost / budgetCap;
    const warningThreshold = 1 + tolerance;

    return {
      canProceed: percentage <= warningThreshold,
      percentageOfBudget: percentage * 100,
      warningMessage: percentage > warningThreshold 
        ? `Task cost ($${taskCost.toFixed(2)}) exceeds budget cap by ${((percentage - 1) * 100).toFixed(1)}%`
        : undefined
    };
  }

  getAvailableTools(): string[] {
    return Object.keys(toolConfigs);
  }

  getToolConfig(toolName: string): ToolConfig | undefined {
    return toolConfigs[toolName];
  }
}

export const costEstimator = new CostEstimator();