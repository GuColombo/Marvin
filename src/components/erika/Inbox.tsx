import { useState, useCallback } from 'react';
import { Upload, File, Clock, CheckCircle, AlertCircle, Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { useErika } from '@/contexts/ErikaContext';

export function Inbox() {
  const { state, dispatch } = useErika();
  const { files } = state;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      dispatch({
        type: 'ADD_FILE',
        payload: {
          id: Date.now().toString(),
          name: file.name,
          type: file.name.split('.').pop() || 'unknown',
          size: file.size,
          status: 'processing',
          content: '',
          topics: []
        }
      });
    });
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 text-warning" />;
      case 'processed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">Inbox</h1>
        <p className="text-body text-muted-foreground">
          Drop files here for processing, or monitor folder watching activity
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-headline font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Drop files to process'}
            </h3>
            <p className="text-body text-muted-foreground mb-4">
              Drag and drop documents, or click to browse
            </p>
            <Button>Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* File Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-headline flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Processing Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {getStatusIcon(file.status)}
                <div className="flex-1">
                  <h3 className="text-callout font-medium">{file.name}</h3>
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
        </CardContent>
      </Card>
    </div>
  );
}