import { useState } from 'react';
import { FileText, ThumbsUp, ThumbsDown, Edit, Eye, Calendar, Tag, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useErika } from '@/contexts/ErikaContext';

export function DigestView() {
  const { state } = useErika();
  const { files } = state;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const completedFiles = files.filter(f => f.status === 'processed');
  const selectedFileData = selectedFile ? files.find(f => f.id === selectedFile) : null;

  const mockDigest = {
    summary: "This Q3 strategy document outlines key market expansion initiatives across three geographic regions, with emphasis on digital transformation and operational efficiency improvements.",
    keyInsights: [
      "Revenue targets increased by 23% compared to Q2 projections",
      "Digital transformation budget allocated $2.3M for automation",
      "New market entry planned for Southeast Asia in Q4",
      "Risk mitigation strategies implemented for supply chain disruptions"
    ],
    risks: [
      { level: "high", description: "Dependency on single supplier for critical components" },
      { level: "medium", description: "Regulatory changes in target markets" },
      { level: "low", description: "Competition from emerging startups" }
    ],
    actions: [
      "Review supplier diversification strategy by end of month",
      "Conduct regulatory compliance audit for new markets", 
      "Establish competitive intelligence monitoring system"
    ],
    confidence: 85
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'warning'; 
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title-2 mb-2">Digest View</h1>
        <p className="text-body text-muted-foreground">
          Executive summaries, insights, and strategic analysis from processed files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Files List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analyzed Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedFile === file.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-callout font-medium truncate">{file.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {file.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-caption-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date().toLocaleDateString()}
                  </div>
                  {file.topics && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {file.topics.slice(0, 2).map((topic, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {file.topics.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{file.topics.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Digest Content */}
        <div className="lg:col-span-2">
          {selectedFileData ? (
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-headline">Executive Summary</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {mockDigest.confidence}% Confidence
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body leading-relaxed mb-4">{mockDigest.summary}</p>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-title-3 font-semibold text-primary">{mockDigest.keyInsights.length}</div>
                        <div className="text-caption-1 text-muted-foreground">Key Insights</div>
                      </div>
                      <div>
                        <div className="text-title-3 font-semibold text-warning">{mockDigest.risks.length}</div>
                        <div className="text-caption-1 text-muted-foreground">Risks Identified</div>
                      </div>
                      <div>
                        <div className="text-title-3 font-semibold text-success">{mockDigest.actions.length}</div>
                        <div className="text-caption-1 text-muted-foreground">Action Items</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-headline flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDigest.keyInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-body">{insight}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-headline flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockDigest.risks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Badge 
                            variant={getRiskColor(risk.level) as any}
                            className="mt-0.5"
                          >
                            {risk.level.toUpperCase()}
                          </Badge>
                          <p className="text-body flex-1">{risk.description}</p>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-headline flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockDigest.actions.map((action, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                          <p className="text-body flex-1">{action}</p>
                          <Button variant="outline" size="sm">
                            Track
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-headline font-semibold mb-2">Select a File</h3>
                <p className="text-body text-muted-foreground">
                  Choose a processed file to view its executive digest and analysis
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}