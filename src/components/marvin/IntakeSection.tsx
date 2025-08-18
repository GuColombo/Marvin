import { useState, useCallback } from 'react';
import { Upload, File, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { useMarvin } from '@/contexts/MarvinContext';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface IntakeSectionProps {
  title: string;
  description: string;
  acceptedTypes: string[];
  icon: React.ComponentType<{ className?: string }>;
  contentType: 'document' | 'meeting' | 'email';
}

export function IntakeSection({ title, description, acceptedTypes, icon: Icon, contentType }: IntakeSectionProps) {
  const { state, dispatch } = useMarvin();
  const { files } = state;
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState<string[]>([]);

  // Filter files by content type
  const relevantFiles = files.filter(file => {
    const fileExt = `.${file.type}`.toLowerCase();
    return acceptedTypes.some(type => type.toLowerCase() === fileExt);
  });

  const processFile = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topics = ['General'];
        if (file.name.toLowerCase().includes('meeting')) topics.push('Meetings');
        if (file.name.toLowerCase().includes('report')) topics.push('Reports');
        
        // File will be updated via ADD_FILE in the processing loop
        
        resolve();
      }, 2000 + Math.random() * 3000);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newProcessingIds: string[] = [];
    
    for (const file of acceptedFiles) {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      newProcessingIds.push(fileId);
      
      // Add file to processing state
      dispatch({
        type: 'ADD_FILE',
        payload: {
          id: fileId,
          name: file.name,
          type: file.name.split('.').pop() || 'unknown',
          size: file.size,
          status: 'processing' as const,
          content: '',
          topics: [],
          timestamp: new Date()
        }
      });
    }
    
    setProcessing(prev => [...prev, ...newProcessingIds]);
    
    // Process files
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileId = newProcessingIds[i];
        
        // Simulate processing
        setTimeout(() => {
          dispatch({
            type: 'UPDATE_FILE',
            payload: {
              id: fileId,
              updates: {
                status: 'processed' as const,
                content: `Processed content for ${file.name}`,
                topics: ['General']
              }
            }
          });
        }, 2000 + Math.random() * 3000);
      }
      
      toast({
        title: "Processing Started",
        description: `${acceptedFiles.length} ${contentType}(s) added to processing queue`,
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Some files failed to process",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setProcessing(prev => prev.filter(id => !newProcessingIds.includes(id)));
      }, 5000);
    }
  }, [dispatch, toast, contentType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[`*/*`] = [type];
      return acc;
    }, {} as Record<string, string[]>)
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 text-warning" />;
      case 'processed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-headline flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
              <div className="flex items-center gap-2 ml-auto">
                {processing.length > 0 && (
                  <Badge variant="secondary" className="h-6">
                    Processing {processing.length}
                  </Badge>
                )}
                {relevantFiles.length > 0 && (
                  <Badge variant="default" className="h-6">
                    {relevantFiles.length} files
                  </Badge>
                )}
              </div>
            </CardTitle>
            <p className="text-body text-muted-foreground">{description}</p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-4 ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-callout font-medium mb-1">
                {isDragActive ? `Drop ${contentType}s here` : `Upload ${contentType}s`}
              </h3>
              <p className="text-caption-2 text-muted-foreground mb-3">
                Accepted formats: {acceptedTypes.join(', ')}
              </p>
              <Button size="sm">Browse Files</Button>
            </div>

            {/* Recent Files */}
            {relevantFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-callout font-medium">Recent Files</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {relevantFiles.slice(0, 5).map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-callout font-medium truncate">{file.name}</p>
                        <p className="text-caption-2 text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB • {file.type}
                        </p>
                      </div>
                      <Badge variant={file.status === 'processed' ? 'default' : 'secondary'}>
                        {file.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}