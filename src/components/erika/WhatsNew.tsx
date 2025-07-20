import { Sparkles, Zap, Shield, Brain, FileText, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function WhatsNew() {
  const latestFeatures = [
    {
      icon: Brain,
      title: 'Enhanced AI Processing',
      description: 'Our new neural network models provide 40% better accuracy in document understanding and topic classification.',
      category: 'AI Enhancement',
      isNew: true
    },
    {
      icon: TrendingUp,
      title: 'Consultant Mode',
      description: 'Strategic analysis using McKinsey, BCG, and Bain frameworks. Get executive-level insights automatically.',
      category: 'New Feature',
      isNew: true
    },
    {
      icon: Zap,
      title: 'Parallel Processing',
      description: 'Process multiple documents simultaneously with our new parallel processing engine - 3x faster than before.',
      category: 'Performance',
      isNew: false
    },
    {
      icon: Shield,
      title: 'Zero-Trust Security',
      description: 'Complete privacy overhaul with end-to-end encryption and zero data transmission outside your environment.',
      category: 'Security',
      isNew: false
    }
  ];

  const upcomingFeatures = [
    {
      title: 'Real-time Collaboration',
      description: 'Share insights and collaborate on documents with team members in real-time.',
      eta: 'Q2 2024',
      status: 'in-development'
    },
    {
      title: 'Mobile Application',
      description: 'Access Erika on iOS and Android with full feature parity.',
      eta: 'Q3 2024',
      status: 'planned'
    },
    {
      title: 'API Integration',
      description: 'Connect Erika with your existing tools via comprehensive REST API.',
      eta: 'Q2 2024',
      status: 'in-development'
    },
    {
      title: 'Advanced Analytics',
      description: 'Business intelligence dashboard with custom reporting and metrics.',
      eta: 'Q4 2024',
      status: 'planned'
    }
  ];

  const recentUpdates = [
    {
      date: '2024-01-15',
      title: 'Version 2.1.0 Released',
      description: 'Major update with consultant mode and enhanced AI processing.'
    },
    {
      date: '2024-01-08',
      title: 'Performance Improvements',
      description: 'Faster document indexing and improved memory management.'
    },
    {
      date: '2024-01-01',
      title: 'UI Redesign Complete',
      description: 'New modern interface with improved user experience.'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-development':
        return <Badge variant="default">In Development</Badge>;
      case 'planned':
        return <Badge variant="outline">Planned</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          What's New
        </h1>
        <p className="text-body text-muted-foreground">
          Discover the latest features, improvements, and upcoming developments in Erika
        </p>
      </div>

      {/* Latest Release Highlight */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-title-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Version 2.1.0 - Now Available
            </CardTitle>
            <Badge variant="default">Latest</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-callout mb-4">
            Our biggest update yet brings advanced AI capabilities, consultant-level analysis, and significant performance improvements.
          </p>
          <div className="flex gap-2">
            <Button size="sm">
              View Full Release Notes
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm">Download</Button>
          </div>
        </CardContent>
      </Card>

      {/* Latest Features */}
      <div>
        <h2 className="text-title-3 mb-4">Latest Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="relative">
                {feature.isNew && (
                  <Badge variant="default" className="absolute -top-2 -right-2 z-10">
                    New
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-headline flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {feature.title}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {feature.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-callout text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upcoming Features */}
      <div>
        <h2 className="text-title-3 mb-4">Coming Soon</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingFeatures.map((feature, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-callout font-semibold">{feature.title}</h4>
                        {getStatusBadge(feature.status)}
                      </div>
                      <p className="text-caption-2 text-muted-foreground mb-2">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-1 text-caption-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Expected: {feature.eta}
                      </div>
                    </div>
                  </div>
                  {index < upcomingFeatures.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <div>
        <h2 className="text-title-3 mb-4">Recent Updates</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Release Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUpdates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-callout font-semibold">{update.title}</h4>
                      <span className="text-caption-2 text-muted-foreground">{update.date}</span>
                    </div>
                    <p className="text-caption-2 text-muted-foreground">{update.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-headline font-semibold mb-2">Have Feedback?</h3>
            <p className="text-callout text-muted-foreground mb-4">
              Help us improve Erika by sharing your thoughts and suggestions.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline">Submit Feedback</Button>
              <Button variant="outline">Request Feature</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}