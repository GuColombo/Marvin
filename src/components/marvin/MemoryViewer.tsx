import { useState } from 'react';
import { Clock, Filter, Download, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMarvin } from '@/contexts/MarvinContext';
import { useToast } from '@/hooks/use-toast';

export function MemoryViewer() {
  const { state, dispatch } = useMarvin();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const sortedFiles = [...state.files].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  const filteredFiles = filterTopic === 'all' 
    ? sortedFiles 
    : sortedFiles.filter(file => file.topics.includes(filterTopic));

  const handleExportMemory = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      files: state.files,
      topics: state.topics,
      behaviorRules: state.behaviorRules
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marvin-memory-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Memory exported",
      description: "Marvin's memory has been exported successfully.",
    });
  };

  const getTopicStats = () => {
    const stats: Record<string, number> = {};
    state.files.forEach(file => {
      file.topics.forEach(topic => {
        stats[topic] = (stats[topic] || 0) + 1;
      });
    });
    return stats;
  };

  const topicStats = getTopicStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Memory Viewer</h1>
        <p className="text-muted-foreground">Chronological view of processed files and system memory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{state.files.length}</div>
            <div className="text-sm text-muted-foreground">Total Files</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{state.topics.length}</div>
            <div className="text-sm text-muted-foreground">Active Topics</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{state.behaviorRules.filter(r => r.enabled).length}</div>
            <div className="text-sm text-muted-foreground">Active Rules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(state.files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(1)}MB
            </div>
            <div className="text-sm text-muted-foreground">Memory Usage</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic Distribution</CardTitle>
          <CardDescription>Distribution of files across topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(topicStats).map(([topic, count]) => (
              <Badge key={topic} variant="outline" className="px-3 py-1">
                {topic}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>File Memory</CardTitle>
              <CardDescription>Chronological list of all processed files</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTopic} onValueChange={setFilterTopic}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {state.topics.map(topic => (
                    <SelectItem key={topic.id} value={topic.name}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExportMemory}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {state.files.length === 0 ? 'No files in memory yet' : 'No files match the current filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{file.name}</h3>
                      <Badge 
                        variant={file.status === 'processed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {file.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(file.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <div className="flex gap-1">
                        {file.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{file.name}</DialogTitle>
                          <DialogDescription>
                            Processed on {new Date(file.timestamp).toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-96">
                          <div className="whitespace-pre-wrap text-sm">
                            {file.content}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}