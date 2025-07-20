import { Activity, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SystemLogs() {
  const logs = [
    { id: 1, type: 'info', message: 'File processing initiated: Q3_Strategy.pdf', timestamp: '2024-01-15 14:32:15' },
    { id: 2, type: 'success', message: 'Classification complete: Document tagged as "Strategy"', timestamp: '2024-01-15 14:32:45' },
    { id: 3, type: 'warning', message: 'Low confidence score (67%) for topic classification', timestamp: '2024-01-15 14:33:02' },
    { id: 4, type: 'error', message: 'Failed to process corrupted file: damaged_doc.pdf', timestamp: '2024-01-15 14:33:18' }
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-primary" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">System Logs</h1>
        <p className="text-body text-muted-foreground">
          Monitor processing activity, errors, and system performance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-headline flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getLogIcon(log.type)}
                <div className="flex-1">
                  <p className="text-body">{log.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-caption-2 text-muted-foreground">{log.timestamp}</span>
                  </div>
                </div>
                <Badge variant={log.type === 'error' ? 'destructive' : 'secondary'}>
                  {log.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}