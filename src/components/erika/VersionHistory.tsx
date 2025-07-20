import { CheckCircle, Star, Bug, Zap, Shield, Calendar, Code, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function VersionHistory() {
  const versions = [
    {
      version: '2.1.0',
      date: '2024-01-15',
      type: 'major',
      status: 'current',
      changes: [
        { type: 'feature', text: 'Enhanced natural language query processing with 40% better accuracy' },
        { type: 'feature', text: 'New consultant mode with McKinsey-style framework integration' },
        { type: 'feature', text: 'Advanced topic classification using improved ML models' },
        { type: 'improvement', text: 'Faster document indexing with parallel processing' },
        { type: 'bug', text: 'Fixed memory leak in large document processing' },
        { type: 'security', text: 'Enhanced encryption for local data storage' }
      ]
    },
    {
      version: '2.0.5',
      date: '2024-01-08',
      type: 'patch',
      status: 'stable',
      changes: [
        { type: 'bug', text: 'Fixed duplicate file detection in batch imports' },
        { type: 'improvement', text: 'Improved error handling for corrupted documents' },
        { type: 'bug', text: 'Resolved UI freezing during large file uploads' }
      ]
    },
    {
      version: '2.0.0',
      date: '2024-01-01',
      type: 'major',
      status: 'stable',
      changes: [
        { type: 'feature', text: 'Complete UI redesign with modern design system' },
        { type: 'feature', text: 'New memory viewer with advanced search capabilities' },
        { type: 'feature', text: 'Digest view for executive summaries and insights' },
        { type: 'feature', text: 'File inspector with detailed metadata analysis' },
        { type: 'improvement', text: 'Performance optimizations - 3x faster processing' },
        { type: 'security', text: 'Zero-trust architecture implementation' }
      ]
    },
    {
      version: '1.5.2',
      date: '2023-12-20',
      type: 'patch',
      status: 'legacy',
      changes: [
        { type: 'bug', text: 'Fixed export functionality for large datasets' },
        { type: 'improvement', text: 'Better handling of PDF documents with complex layouts' },
        { type: 'bug', text: 'Resolved timeout issues in query processing' }
      ]
    },
    {
      version: '1.5.0',
      date: '2023-12-15',
      type: 'minor',
      status: 'legacy',
      changes: [
        { type: 'feature', text: 'Added support for PowerPoint and Excel files' },
        { type: 'feature', text: 'Batch processing capabilities' },
        { type: 'improvement', text: 'Enhanced search with fuzzy matching' },
        { type: 'bug', text: 'Fixed character encoding issues in international documents' }
      ]
    }
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Star className="h-4 w-4 text-primary" />;
      case 'improvement': return <Zap className="h-4 w-4 text-success" />;
      case 'bug': return <Bug className="h-4 w-4 text-warning" />;
      case 'security': return <Shield className="h-4 w-4 text-destructive" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getVersionBadge = (type: string, status: string) => {
    if (status === 'current') return <Badge variant="default">Current</Badge>;
    if (type === 'major') return <Badge variant="secondary">Major</Badge>;
    if (type === 'minor') return <Badge variant="outline">Minor</Badge>;
    return <Badge variant="outline">Patch</Badge>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'border-l-primary';
      case 'stable': return 'border-l-success';
      case 'legacy': return 'border-l-muted-foreground';
      default: return 'border-l-border';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">Version History</h1>
        <p className="text-body text-muted-foreground">
          Track the evolution of Erika with detailed release notes and feature updates
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-title-3 font-semibold">2.1.0</div>
            <div className="text-caption-2 text-muted-foreground">Current Version</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-title-3 font-semibold">5</div>
            <div className="text-caption-2 text-muted-foreground">Total Releases</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-warning" />
            <div className="text-title-3 font-semibold">12</div>
            <div className="text-caption-2 text-muted-foreground">New Features</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-title-3 font-semibold">98%</div>
            <div className="text-caption-2 text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Version Timeline */}
      <div className="space-y-6">
        {versions.map((version, index) => (
          <Card key={version.version} className={`border-l-4 ${getStatusColor(version.status)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-headline flex items-center gap-3">
                  <span>Version {version.version}</span>
                  {getVersionBadge(version.type, version.status)}
                </CardTitle>
                <div className="flex items-center gap-2 text-caption-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {version.date}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {version.changes.map((change, changeIndex) => (
                  <div key={changeIndex} className="flex items-start gap-3">
                    {getChangeIcon(change.type)}
                    <div className="flex-1">
                      <span className="text-callout">{change.text}</span>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {change.type}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {index < versions.length - 1 && (
                <Separator className="mt-6" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legacy Notice */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-callout font-semibold mb-1">Legacy Version Support</h4>
              <p className="text-caption-2 text-muted-foreground">
                Versions older than 1.5.0 are no longer supported. We recommend upgrading to the latest version for security updates and new features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}