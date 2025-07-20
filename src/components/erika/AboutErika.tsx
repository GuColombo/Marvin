import { Brain, Cpu, Database, Shield, Zap, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AboutErika() {
  const capabilities = [
    {
      icon: Database,
      title: 'Memory & Indexing',
      description: 'Persistent storage and semantic classification of all processed documents'
    },
    {
      icon: Brain,
      title: 'Strategic Analysis',
      description: 'Applies consulting frameworks like SWOT, BCG Matrix, and 7S for executive insights'
    },
    {
      icon: Zap,
      title: 'Natural Language Query',
      description: 'Instant answers across your entire knowledge base with citation tracking'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Completely offline operation with no data leaving your local environment'
    }
  ];

  const specifications = [
    { label: 'Version', value: '1.0.0-beta' },
    { label: 'Architecture', value: 'Local AI Processing' },
    { label: 'Storage', value: 'On-premises Vector DB' },
    { label: 'Security', value: 'Offline Only' },
    { label: 'Platform', value: 'macOS Desktop' },
    { label: 'AI Models', value: 'Local LLM Integration' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">About Erika</h1>
        <p className="text-body text-muted-foreground">
          Your executive AI assistant and personal strategic advisor
        </p>
      </div>

      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-title-3 mb-3">Executive Intelligence System</h2>
              <p className="text-body text-muted-foreground mb-4">
                Erika is a locally-hosted AI system designed for executives and strategic leaders. 
                She processes, analyzes, and provides insights on your documents while maintaining 
                complete privacy and security through offline-only operation.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  <Shield className="h-3 w-3 mr-1" />
                  Privacy First
                </Badge>
                <Badge variant="outline" className="text-success border-success">
                  <Cpu className="h-3 w-3 mr-1" />
                  Local Processing
                </Badge>
                <Badge variant="outline" className="text-warning border-warning">
                  <Code className="h-3 w-3 mr-1" />
                  Open Source
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities */}
      <div>
        <h2 className="text-title-3 mb-4">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card key={index} className="executive-card-compact">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-callout font-semibold mb-1">{capability.title}</h3>
                      <p className="text-caption-1 text-muted-foreground">{capability.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-headline">System Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specifications.map((spec, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-border last:border-b-0">
                <span className="text-callout text-muted-foreground">{spec.label}</span>
                <span className="text-callout font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-headline">Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-muted-foreground leading-relaxed">
            Erika empowers executives and strategic leaders with AI-driven insights while maintaining 
            absolute control over sensitive information. By operating entirely offline, she ensures 
            your strategic documents, analyses, and decision-making processes remain completely private 
            and secure within your organization's boundaries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}