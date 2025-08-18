import { useState } from 'react';
import { FileText, Eye, Tag, Calendar, FileType, Hash, ChevronRight, Upload } from 'lucide-react';
import { IntakeSection } from './IntakeSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMarvin } from '@/contexts/MarvinContext';

export function FileInspector() {
  const { state } = useMarvin();
  const { files } = state;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const selectedFileData = selectedFile ? files.find(f => f.id === selectedFile) : null;

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': case 'doc': return '📝';
      case 'xlsx': case 'xls': return '📊';
      case 'pptx': case 'ppt': return '📈';
      case 'txt': case 'md': return '📃';
      default: return '📁';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">File Analyst</h1>
        <p className="text-body text-muted-foreground">
          Analyze documents, extract insights, and search through your knowledge base
        </p>
      </div>

      {/* Intake Section */}
      <IntakeSection
        title="Add Documents"
        description="Upload documents, PDFs, text files, or presentations"
        acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.md', '.ppt', '.pptx']}
        icon={Upload}
        contentType="document"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="p-4 space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                      selectedFile === file.id ? 'bg-primary/5 border-primary' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-callout font-medium truncate">{file.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={file.status === 'processed' ? 'default' : 'secondary'} className="text-xs">
                            {file.status}
                          </Badge>
                          <span className="text-caption-2 text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                {files.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-callout">No files processed yet</p>
                    <p className="text-caption-2">Upload documents using the intake section above</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* File Details */}
        <div className="lg:col-span-2">
          {selectedFileData ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-headline flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(selectedFileData.type)}</span>
                      {selectedFileData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-callout font-medium">File Type</Label>
                        <div className="flex items-center gap-2">
                          <FileType className="h-4 w-4 text-muted-foreground" />
                          <span className="text-callout">{selectedFileData.type.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-callout font-medium">Size</Label>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="text-callout">{formatFileSize(selectedFileData.size)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-callout font-medium">Status</Label>
                        <Badge variant={selectedFileData.status === 'processed' ? 'default' : 'secondary'}>
                          {selectedFileData.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-callout font-medium">Processed</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-callout">
                            {selectedFileData.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-callout font-medium">Quick Actions</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Tag className="h-4 w-4 mr-2" />
                          Retag
                        </Button>
                        <Button variant="outline" size="sm">
                          Reprocess
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-headline">Extracted Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full rounded border p-4">
                      {selectedFileData.content ? (
                        <pre className="text-caption-1 whitespace-pre-wrap">
                          {selectedFileData.content}
                        </pre>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-callout">No content extracted yet</p>
                          <p className="text-caption-2">File may still be processing</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topics">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-headline">Topic Classification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedFileData.topics && selectedFileData.topics.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedFileData.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-callout">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-callout">No topics identified</p>
                          <p className="text-caption-2">Topics will appear after processing</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metadata">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-headline">File Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-callout text-muted-foreground">File ID</span>
                          <span className="text-callout font-mono">{selectedFileData.id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-callout text-muted-foreground">Original Name</span>
                          <span className="text-callout">{selectedFileData.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-callout text-muted-foreground">File Size</span>
                          <span className="text-callout">{formatFileSize(selectedFileData.size)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-callout text-muted-foreground">MIME Type</span>
                          <span className="text-callout">{selectedFileData.type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-callout text-muted-foreground">Processing Status</span>
                          <span className="text-callout">{selectedFileData.status}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-callout text-muted-foreground">Last Modified</span>
                          <span className="text-callout">
                            {selectedFileData.timestamp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-headline font-semibold mb-2">Select a file to inspect</h3>
                <p className="text-body text-muted-foreground">
                  Choose a file from the list to view detailed analysis and metadata
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <label className={className}>{children}</label>;
  }
}