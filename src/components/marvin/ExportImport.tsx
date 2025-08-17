import { useState } from 'react';
import { Download, Upload, FileJson, Database, Archive, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMarvin } from '@/contexts/MarvinContext';

export function ExportImport() {
  const { state } = useMarvin();
  const { files } = state;
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedExportItems, setSelectedExportItems] = useState({
    files: true,
    memory: true,
    topics: true,
    configuration: true,
    logs: false
  });

  const exportOptions = [
    {
      id: 'files',
      label: 'Processed Files',
      description: 'All uploaded files and their extracted content',
      icon: FileJson,
      count: files.length
    },
    {
      id: 'memory',
      label: 'Memory Database',
      description: 'Vector embeddings and semantic indexes',
      icon: Database,
      count: files.length
    },
    {
      id: 'topics',
      label: 'Topic Classifications',
      description: 'All identified topics and their relationships',
      icon: Archive,
      count: new Set(files.flatMap(f => f.topics || [])).size
    },
    {
      id: 'configuration',
      label: 'System Configuration',
      description: 'AI behavior settings and preferences',
      icon: CheckCircle,
      count: 1
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    setIsExporting(false);
    // In real implementation, would trigger file download
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">Export & Import</h1>
        <p className="text-body text-muted-foreground">
          Backup your data or migrate between Marvin instances
        </p>
      </div>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <div className="space-y-6">
            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-headline flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={option.id}
                        checked={selectedExportItems[option.id as keyof typeof selectedExportItems]}
                        onCheckedChange={(checked) =>
                          setSelectedExportItems(prev => ({
                            ...prev,
                            [option.id]: checked
                          }))
                        }
                      />
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Label htmlFor={option.id} className="text-callout font-semibold cursor-pointer">
                              {option.label}
                            </Label>
                            <Badge variant="secondary" className="text-xs">
                              {option.count} items
                            </Badge>
                          </div>
                          <p className="text-caption-2 text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Export Progress */}
            {isExporting && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary animate-pulse" />
                      <span className="text-callout font-medium">Exporting data...</span>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                    <p className="text-caption-2 text-muted-foreground">
                      Creating backup archive: {exportProgress}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-headline">Export Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-callout">
                    <span className="text-muted-foreground">Selected Items</span>
                    <span className="font-medium">
                      {Object.values(selectedExportItems).filter(Boolean).length} categories
                    </span>
                  </div>
                  <div className="flex justify-between text-callout">
                    <span className="text-muted-foreground">Total Files</span>
                    <span className="font-medium">{files.length} files</span>
                  </div>
                  <div className="flex justify-between text-callout">
                    <span className="text-muted-foreground">Estimated Size</span>
                    <span className="font-medium">~{Math.round(files.length * 0.5)} MB</span>
                  </div>
                  <div className="flex justify-between text-callout">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium">Encrypted ZIP Archive</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button onClick={handleExport} disabled={isExporting} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Export Data'}
                  </Button>
                  <Button variant="outline">
                    <FileJson className="h-4 w-4 mr-2" />
                    Export Config Only
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import">
          <div className="space-y-6">
            {/* Import Area */}
            <Card>
              <CardHeader>
                <CardTitle className="text-headline flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-headline font-semibold mb-2">
                    Drop Marvin backup file here
                  </h3>
                  <p className="text-body text-muted-foreground mb-4">
                    Or click to browse for .marvin backup files
                  </p>
                  <Button>Browse Files</Button>
                </div>
              </CardContent>
            </Card>

            {/* Import Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-headline">Import Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox id="merge-data" defaultChecked />
                    <div>
                      <Label htmlFor="merge-data" className="text-callout font-medium cursor-pointer">
                        Merge with existing data
                      </Label>
                      <p className="text-caption-2 text-muted-foreground">
                        Combine imported data with current database
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox id="overwrite-config" />
                    <div>
                      <Label htmlFor="overwrite-config" className="text-callout font-medium cursor-pointer">
                        Overwrite configuration
                      </Label>
                      <p className="text-caption-2 text-muted-foreground">
                        Replace current settings with imported configuration
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox id="backup-current" defaultChecked />
                    <div>
                      <Label htmlFor="backup-current" className="text-callout font-medium cursor-pointer">
                        Backup current data first
                      </Label>
                      <p className="text-caption-2 text-muted-foreground">
                        Create a backup before importing (recommended)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-headline">Recent Imports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-callout">No imports yet</p>
                  <p className="text-caption-2">Import history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}