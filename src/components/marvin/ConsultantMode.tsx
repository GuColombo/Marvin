import { useState } from 'react';
import { TrendingUp, FileText, Download, Play, BookOpen, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Framework {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToComplete: string;
  template?: {
    sections: string[];
    sampleQuestions: string[];
    expectedOutputs: string[];
  };
}

export function ConsultantMode() {
  const [selectedFramework, setSelectedFramework] = useState('');
  const [activeTab, setActiveTab] = useState('frameworks');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const frameworks: Framework[] = [
    {
      id: 'swot',
      name: 'SWOT Analysis',
      description: 'Identify Strengths, Weaknesses, Opportunities, and Threats',
      category: 'Strategic Planning',
      difficulty: 'Beginner',
      timeToComplete: '15-30 min',
      template: {
        sections: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
        sampleQuestions: [
          'What are our key competitive advantages?',
          'Where do we need improvement?',
          'What market opportunities exist?',
          'What external threats should we monitor?'
        ],
        expectedOutputs: ['Strategic recommendations', 'Priority matrix', 'Action plan']
      }
    },
    {
      id: 'bcg',
      name: 'BCG Matrix',
      description: 'Portfolio planning and strategic analysis framework',
      category: 'Portfolio Management',
      difficulty: 'Intermediate',
      timeToComplete: '30-45 min',
      template: {
        sections: ['Stars', 'Cash Cows', 'Question Marks', 'Dogs'],
        sampleQuestions: [
          'Which products have high growth and market share?',
          'What are our stable revenue generators?',
          'Which offerings need investment decisions?',
          'What should we consider divesting?'
        ],
        expectedOutputs: ['Portfolio positioning', 'Investment recommendations', 'Resource allocation plan']
      }
    },
    {
      id: '7s',
      name: 'McKinsey 7S',
      description: 'Organizational effectiveness and alignment analysis',
      category: 'Organizational Design',
      difficulty: 'Advanced',
      timeToComplete: '45-60 min',
      template: {
        sections: ['Strategy', 'Structure', 'Systems', 'Skills', 'Style', 'Staff', 'Shared Values'],
        sampleQuestions: [
          'How aligned are our organizational elements?',
          'Where are the gaps in our capabilities?',
          'What cultural changes are needed?',
          'How can we improve execution?'
        ],
        expectedOutputs: ['Alignment assessment', 'Gap analysis', 'Change roadmap']
      }
    },
    {
      id: 'rapid',
      name: 'RAPID Decision',
      description: 'Decision-making roles and accountability framework',
      category: 'Decision Making',
      difficulty: 'Intermediate',
      timeToComplete: '20-30 min',
      template: {
        sections: ['Recommend', 'Agree', 'Perform', 'Input', 'Decide'],
        sampleQuestions: [
          'Who should make recommendations?',
          'Who needs to agree before proceeding?',
          'Who will execute the decision?',
          'Who should provide input?',
          'Who has final decision authority?'
        ],
        expectedOutputs: ['Decision matrix', 'Role clarity', 'Process optimization']
      }
    },
    {
      id: 'pestle',
      name: 'PESTLE Analysis',
      description: 'External environment and macro-factor analysis',
      category: 'Environmental Scanning',
      difficulty: 'Intermediate',
      timeToComplete: '30-40 min',
      template: {
        sections: ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'],
        sampleQuestions: [
          'What political factors affect our business?',
          'How do economic trends impact us?',
          'What social changes should we consider?',
          'Which technologies disrupt our industry?',
          'What legal/regulatory changes matter?',
          'How do environmental factors influence us?'
        ],
        expectedOutputs: ['External factor assessment', 'Risk analysis', 'Strategic implications']
      }
    },
    {
      id: 'value-chain',
      name: 'Value Chain Analysis',
      description: 'Analyze primary and support activities for competitive advantage',
      category: 'Operations Strategy',
      difficulty: 'Advanced',
      timeToComplete: '40-50 min',
      template: {
        sections: ['Primary Activities', 'Support Activities', 'Linkages', 'Competitive Analysis'],
        sampleQuestions: [
          'Where do we create the most value?',
          'Which activities drive our costs?',
          'How can we optimize our processes?',
          'Where are our competitive advantages?'
        ],
        expectedOutputs: ['Value creation map', 'Cost optimization opportunities', 'Competitive positioning']
      }
    }
  ];

  const handleFrameworkSelect = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    const framework = frameworks.find(f => f.id === frameworkId);
    toast.success(`Selected ${framework?.name} framework`);
  };

  const runAnalysis = async () => {
    const framework = frameworks.find(f => f.id === selectedFramework);
    if (!framework) return;

    setIsRunning(true);
    setActiveTab('results');

    try {
      // Simulate analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

      // Generate mock results based on framework
      const results = generateMockResults(framework);
      setAnalysisResults(results);
      
      toast.success(`${framework.name} analysis completed!`);
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const generateMockResults = (framework: Framework) => {
    const baseResults = {
      framework: framework.name,
      executionTime: `${Math.floor(Math.random() * 30) + 15} minutes`,
      dataSourcesAnalyzed: Math.floor(Math.random() * 50) + 20,
      keyInsights: []
    };

    switch (framework.id) {
      case 'swot':
        return {
          ...baseResults,
          keyInsights: [
            'Strong market position identified in core segments',
            'Technology infrastructure needs modernization',
            'Emerging markets present significant growth opportunity',
            'Regulatory changes pose moderate risk to operations'
          ],
          recommendations: [
            'Invest in digital transformation initiatives',
            'Develop emerging market entry strategy',
            'Strengthen regulatory compliance processes'
          ],
          matrix: {
            strengths: ['Market leadership', 'Strong brand', 'Innovation capability'],
            weaknesses: ['Legacy systems', 'Higher costs', 'Limited geographic reach'],
            opportunities: ['Digital channels', 'New markets', 'Partnership potential'],
            threats: ['New competitors', 'Regulation', 'Economic volatility']
          }
        };

      case 'bcg':
        return {
          ...baseResults,
          keyInsights: [
            'Product A positioned as Star with high growth potential',
            'Product B generates stable cash flow as Cash Cow',
            'Product C requires strategic decision as Question Mark',
            'Product D shows declining performance as Dog'
          ],
          recommendations: [
            'Increase investment in Product A marketing and R&D',
            'Optimize Product B operations for maximum cash generation',
            'Conduct market research for Product C viability',
            'Consider divestiture or repositioning of Product D'
          ],
          portfolio: {
            stars: ['Product A', 'Service X'],
            cashCows: ['Product B', 'Core Platform'],
            questionMarks: ['Product C', 'New Initiative'],
            dogs: ['Product D', 'Legacy System']
          }
        };

      default:
        return {
          ...baseResults,
          keyInsights: [
            'Analysis reveals significant strategic opportunities',
            'Current approach shows both strengths and gaps',
            'Competitive landscape requires strategic response',
            'Implementation roadmap needs prioritization'
          ],
          recommendations: [
            'Develop comprehensive action plan',
            'Align resources with strategic priorities',
            'Monitor key performance indicators',
            'Regular review and adjustment cycle'
          ]
        };
    }
  };

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">Consultant Mode</h1>
        <p className="text-body text-muted-foreground">
          Apply strategic frameworks to your data for executive-level analysis and actionable insights
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frameworks.map((framework) => (
              <Card 
                key={framework.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFramework === framework.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleFrameworkSelect(framework.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{framework.name}</CardTitle>
                    {selectedFramework === framework.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {framework.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {framework.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{framework.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>⏱️ {framework.timeToComplete}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configure" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Analysis Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Selected Framework</label>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategic framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map((framework) => (
                        <SelectItem key={framework.id} value={framework.id}>
                          <div>
                            <div className="font-medium">{framework.name}</div>
                            <div className="text-xs text-muted-foreground">{framework.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFramework && (
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={runAnalysis}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Running Analysis...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Analysis
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedFrameworkData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Framework Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Analysis Sections</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedFrameworkData.template?.sections.map((section, index) => (
                        <Badge key={index} variant="outline" className="justify-center">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Questions</h4>
                    <ScrollArea className="h-32">
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {selectedFrameworkData.template?.sampleQuestions.map((question, index) => (
                          <li key={index}>• {question}</li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Expected Outputs</h4>
                    <div className="space-y-1">
                      {selectedFrameworkData.template?.expectedOutputs.map((output, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                          {output}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {analysisResults ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{analysisResults.executionTime}</div>
                      <div className="text-sm text-muted-foreground">Execution Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analysisResults.dataSourcesAnalyzed}</div>
                      <div className="text-sm text-muted-foreground">Data Sources</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Insights</h4>
                    <ul className="space-y-1 text-sm">
                      {analysisResults.keyInsights.map((insight: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {analysisResults.recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {analysisResults.matrix && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>SWOT Matrix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600">Strengths</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.matrix.strengths.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600">Weaknesses</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.matrix.weaknesses.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-600">Opportunities</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.matrix.opportunities.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-600">Threats</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.matrix.threats.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysisResults.portfolio && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>BCG Portfolio Matrix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-yellow-600">⭐ Stars</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.portfolio.stars.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600">🐄 Cash Cows</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.portfolio.cashCows.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-600">❓ Question Marks</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.portfolio.questionMarks.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-600">🐕 Dogs</h4>
                        <ul className="space-y-1 text-sm">
                          {analysisResults.portfolio.dogs.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No Analysis Results</h3>
                  <p className="text-sm">
                    Select a framework and run an analysis to see results here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}