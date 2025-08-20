import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Calendar, Mail, FolderOpen, Plus, Trash2, Clock, Settings } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { apiAdapter } from '@/lib/apiAdapter';
import type { WatchListResponse, WatchAddRequest, ScheduleUpdateRequest } from '@/lib/schemas';

export function IngestionManager() {
  const [uploading, setUploading] = useState(false);
  const [watchPaths, setWatchPaths] = useState<WatchListResponse['paths']>([]);
  const [newWatchPath, setNewWatchPath] = useState('');
  const [newWatchType, setNewWatchType] = useState<'files' | 'meetings'>('files');
  const [meetingInterval, setMeetingInterval] = useState(30);
  const [meetingStart, setMeetingStart] = useState('08:20');
  const [meetingEnd, setMeetingEnd] = useState('20:50');
  const [filesInterval, setFilesInterval] = useState(60);
  const [filesStart, setFilesStart] = useState('09:00');
  const [filesEnd, setFilesEnd] = useState('18:00');

  const handleFileUpload = async (files: File[], type: 'email' | 'calendar' | 'files') => {
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const result = await apiAdapter.uploadFiles(files, type);
      toast.success(`Uploaded ${result.files_saved} files successfully (Run ID: ${result.run_id})`);
      
      const paths = files.map(f => f.name);
      await apiAdapter.ingestCommit({
        paths,
        collection: type
      });
      toast.success('Files ingested into knowledge base');
    } catch (error) {
      toast.error('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const emailDropzone = useDropzone({
    onDrop: (files) => handleFileUpload(files, 'email'),
    accept: { 'message/*': ['.eml', '.msg'], 'application/*': ['.mbox'] }
  });

  const calendarDropzone = useDropzone({
    onDrop: (files) => handleFileUpload(files, 'calendar'),
    accept: { 'text/calendar': ['.ics'], 'application/*': ['.vcs'] }
  });

  const filesDropzone = useDropzone({
    onDrop: (files) => handleFileUpload(files, 'files'),
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/*': ['.txt', '.md', '.csv']
    }
  });

  const loadWatchPaths = async () => {
    try {
      const result = await apiAdapter.listWatchers();
      setWatchPaths(result.paths);
    } catch (error) {
      toast.error('Failed to load watch paths');
    }
  };

  const addWatchPath = async () => {
    if (!newWatchPath.trim()) return;
    
    try {
      const request: WatchAddRequest = {
        path: newWatchPath,
        type: newWatchType
      };
      const result = await apiAdapter.addWatcher(request);
      toast.success(`Added watch path: ${newWatchPath}`);
      setNewWatchPath('');
      await loadWatchPaths();
    } catch (error) {
      toast.error('Failed to add watch path');
    }
  };

  const removeWatchPath = async (id: string) => {
    try {
      await apiAdapter.removeWatcher({ id });
      toast.success('Watch path removed');
      await loadWatchPaths();
    } catch (error) {
      toast.error('Failed to remove watch path');
    }
  };

  const updateMeetingSchedule = async () => {
    try {
      const request: ScheduleUpdateRequest = {
        target: 'meetings',
        intervalMinutes: meetingInterval,
        window: { start: meetingStart, end: meetingEnd }
      };
      await apiAdapter.updateSchedule(request);
      toast.success('Meeting schedule updated');
    } catch (error) {
      toast.error('Failed to update schedule');
    }
  };

  const updateFilesSchedule = async () => {
    try {
      const request: ScheduleUpdateRequest = {
        target: 'files',
        intervalMinutes: filesInterval,
        window: { start: filesStart, end: filesEnd }
      };
      await apiAdapter.updateSchedule(request);
      toast.success('Files schedule updated');
    } catch (error) {
      toast.error('Failed to update schedule');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Data Ingestion</h2>
        <p className="text-muted-foreground">Upload files and configure automated ingestion</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="watchers">Watch Paths</TabsTrigger>
          <TabsTrigger value="schedule">Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Files
                </CardTitle>
                <CardDescription>Upload .eml, .msg, or .mbox files</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...emailDropzone.getRootProps()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                >
                  <input {...emailDropzone.getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop email files here, or click to browse
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendar Files
                </CardTitle>
                <CardDescription>Upload .ics or .vcs calendar files</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...calendarDropzone.getRootProps()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                >
                  <input {...calendarDropzone.getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop calendar files here, or click to browse
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Files
                </CardTitle>
                <CardDescription>Upload PDF, Word, or text documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...filesDropzone.getRootProps()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                >
                  <input {...filesDropzone.getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop documents here, or click to browse
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="watchers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Watch Paths
              </CardTitle>
              <CardDescription>
                Configure paths to automatically monitor for new files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="/path/to/watch"
                  value={newWatchPath}
                  onChange={(e) => setNewWatchPath(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={newWatchType}
                  onChange={(e) => setNewWatchType(e.target.value as 'files' | 'meetings')}
                  className="px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="files">Files</option>
                  <option value="meetings">Meetings</option>
                </select>
                <Button onClick={addWatchPath}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {watchPaths.map((path) => (
                  <div key={path.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{path.path}</span>
                      <Badge variant="secondary">{path.type}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWatchPath(path.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={loadWatchPaths} variant="outline">
                Refresh Watch Paths
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Meeting Processing
                </CardTitle>
                <CardDescription>Configure automated meeting ingestion schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meeting-interval">Check Interval (minutes)</Label>
                  <Input
                    id="meeting-interval"
                    type="number"
                    value={meetingInterval}
                    onChange={(e) => setMeetingInterval(Number(e.target.value))}
                    min={1}
                    max={1440}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="meeting-start">Start Time</Label>
                    <Input
                      id="meeting-start"
                      type="time"
                      value={meetingStart}
                      onChange={(e) => setMeetingStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meeting-end">End Time</Label>
                    <Input
                      id="meeting-end"
                      type="time"
                      value={meetingEnd}
                      onChange={(e) => setMeetingEnd(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={updateMeetingSchedule} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Meeting Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  File Processing
                </CardTitle>
                <CardDescription>Configure automated file ingestion schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="files-interval">Check Interval (minutes)</Label>
                  <Input
                    id="files-interval"
                    type="number"
                    value={filesInterval}
                    onChange={(e) => setFilesInterval(Number(e.target.value))}
                    min={1}
                    max={1440}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="files-start">Start Time</Label>
                    <Input
                      id="files-start"
                      type="time"
                      value={filesStart}
                      onChange={(e) => setFilesStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="files-end">End Time</Label>
                    <Input
                      id="files-end"
                      type="time"
                      value={filesEnd}
                      onChange={(e) => setFilesEnd(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={updateFilesSchedule} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Files Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}