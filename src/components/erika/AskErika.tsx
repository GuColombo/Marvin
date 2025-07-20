import { useState } from 'react';
import { Send, MessageSquare, Brain, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useErika } from '@/contexts/ErikaContext';

interface Message {
  id: string;
  type: 'user' | 'erika';
  content: string;
  timestamp: Date;
  context?: string[];
}

export function AskErika() {
  const { state } = useErika();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'erika',
      content: 'I am Erika, your strategic analysis system. I can help you analyze your processed documents, identify patterns, and provide executive-level insights. What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userQuery: string): { content: string; context: string[] } => {
    const query = userQuery.toLowerCase();
    const relevantFiles = state.files.filter(file => 
      file.content.toLowerCase().includes(query) || 
      file.name.toLowerCase().includes(query) ||
      file.topics.some(topic => query.includes(topic.toLowerCase()))
    );

    const context = relevantFiles.map(f => f.name);

    // Simulated strategic responses based on query patterns
    if (query.includes('summary') || query.includes('overview')) {
      return {
        content: `Based on analysis of ${state.files.length} processed documents across ${state.topics.length} topic areas:\n\n• Strategic documents represent ${Math.round((state.files.filter(f => f.topics.includes('Strategy')).length / state.files.length) * 100)}% of your corpus\n• Financial materials account for ${Math.round((state.files.filter(f => f.topics.includes('Finance')).length / state.files.length) * 100)}% of processed content\n• Operational efficiency appears ${state.files.filter(f => f.topics.includes('Operations')).length > 0 ? 'adequately documented' : 'underdocumented'}\n\nRecommendation: Focus analysis on cross-functional alignment between strategic intent and operational execution.`,
        context
      };
    }

    if (query.includes('risk') || query.includes('issue')) {
      return {
        content: `Risk assessment indicates:\n\n• Documentation fragmentation across ${state.topics.length} disparate topic areas\n• Potential governance gaps in ${state.files.filter(f => f.topics.includes('General')).length} uncategorized documents\n• Information asymmetry risks from inconsistent tagging patterns\n\nMitigation strategy: Implement systematic classification review and establish clear document taxonomy governance.`,
        context
      };
    }

    if (query.includes('strategy') || query.includes('strategic')) {
      const strategyFiles = state.files.filter(f => f.topics.includes('Strategy'));
      return {
        content: `Strategic analysis reveals:\n\n• ${strategyFiles.length} strategic documents in memory\n• Key themes require systematic consolidation\n• Execution linkage to operational documents appears ${state.files.filter(f => f.topics.includes('Operations')).length > 0 ? 'established' : 'weak'}\n\nNext steps: Conduct gap analysis between strategic intent and operational capability documentation.`,
        context
      };
    }

    if (query.includes('trend') || query.includes('pattern')) {
      return {
        content: `Pattern analysis indicates:\n\n• Document velocity: ${state.files.length > 5 ? 'High processing volume' : 'Moderate processing activity'}\n• Topic distribution skew toward ${Object.entries(state.files.reduce((acc, file) => { file.topics.forEach(topic => { acc[topic] = (acc[topic] || 0) + 1; }); return acc; }, {} as Record<string, number>)).sort(([,a], [,b]) => b - a)[0]?.[0] || 'General'}\n• Content complexity trending ${state.files.reduce((acc, f) => acc + f.content.length, 0) / state.files.length > 1000 ? 'upward' : 'moderate'}\n\nInsight: Establish clear content governance framework to maintain analytical coherence.`,
        context
      };
    }

    // Default executive response
    return {
      content: `I have analyzed your query against ${state.files.length} processed documents. For more specific insights, please provide additional context about:\n\n• Specific business domain or functional area\n• Decision framework you're operating within\n• Time horizon for analysis\n• Stakeholder context\n\nI can provide strategic analysis, risk assessment, operational insights, or trend identification based on your processed content.`,
      context
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const { content, context } = generateResponse(input);

    const erikaMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'erika',
      content,
      timestamp: new Date(),
      context,
    };

    setMessages(prev => [...prev, erikaMessage]);
    setIsTyping(false);
  };

  const quickPrompts = [
    { text: "Provide a strategic overview", icon: TrendingUp },
    { text: "Identify potential risks", icon: MessageSquare },
    { text: "Analyze document patterns", icon: Lightbulb },
    { text: "Summary of key themes", icon: Brain },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ask Erika</h1>
        <p className="text-muted-foreground">Interact with Erika's strategic analysis capabilities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Strategic Analysis Interface
            </CardTitle>
            <CardDescription>
              Erika processes your queries using executive-level analytical frameworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScrollArea className="h-96 border rounded-lg p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        {message.context && message.context.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/20">
                            <div className="text-xs opacity-70 mb-1">Referenced documents:</div>
                            <div className="flex flex-wrap gap-1">
                              {message.context.slice(0, 3).map((file, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {file}
                                </Badge>
                              ))}
                              {message.context.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{message.context.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask Erika for strategic analysis, risk assessment, or operational insights..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="min-h-[60px]"
                />
                <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Analysis</CardTitle>
              <CardDescription>Common strategic queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setInput(prompt.text)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{prompt.text}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Context</CardTitle>
              <CardDescription>Available for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">{state.files.length} Documents</div>
                <div className="text-muted-foreground">{state.topics.length} Topic Areas</div>
                <div className="text-muted-foreground">
                  {state.behaviorRules.filter(r => r.enabled).length} Active Rules
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}