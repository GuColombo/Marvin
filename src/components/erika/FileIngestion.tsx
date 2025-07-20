import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useErika, ProcessedFile } from '@/contexts/ErikaContext';
import { useToast } from '@/hooks/use-toast';

export function FileIngestion() {
  const { state, dispatch } = useErika();
  const { toast } = useToast();
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);

  const processFile = async (file: File): Promise<ProcessedFile> => {
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const content = await file.text().catch(() => `Simulated content for ${file.name}`);
    
    // Simple topic classification based on filename and content
    const topics = [];
    const lowerContent = content.toLowerCase();
    const lowerName = file.name.toLowerCase();
    
    state.topics.forEach(topic => {
      const matchesKeywords = topic.keywords.some(keyword => 
        lowerContent.includes(keyword) || lowerName.includes(keyword)
      );
      if (matchesKeywords) {
        topics.push(topic.name);
      }
    });
    
    if (topics.length === 0) {
      topics.push('General');
    }

    return {
      id: Date.now().toString() + Math.random(),
      name: file.name,
      content,
      topics,
      timestamp: new Date(),
      status: 'processed',
      type: file.type || 'unknown',
      size: file.size
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const fileIds = acceptedFiles.map(() => Date.now().toString() + Math.random());
    setProcessingFiles(fileIds);

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      try {
        const processedFile = await processFile(file);
        dispatch({ type: 'ADD_FILE', payload: processedFile });
        toast({
          title: "File processed",
          description: `${file.name} has been successfully processed.`,
        });
      } catch (error) {
        toast({
          title: "Processing error",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setProcessingFiles([]);
  }, [dispatch, state.topics, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const recentFiles = state.files.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">File Ingestion</h1>
        <p className="text-muted-foreground">Upload and process files for Erika's analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supports .txt, .docx, .pdf, .csv, .md, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <Button variant="outline">Browse Files</Button>
              </div>
            )}
          </div>

          {processingFiles.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">Processing Files...</h3>
              {processingFiles.map((fileId, index) => (
                <div key={fileId} className="space-y-2">
                  <Progress value={undefined} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
          <CardDescription>Recently processed files</CardDescription>
        </CardHeader>
        <CardContent>
          {recentFiles.length === 0 ? (
            <p className="text-muted-foreground">No files processed yet</p>
          ) : (
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.topics.join(', ')} • {new Date(file.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {file.status === 'processed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : file.status === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
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