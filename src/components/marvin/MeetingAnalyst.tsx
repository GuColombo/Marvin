import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, MessageSquare, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiAdapter } from '@/lib/apiAdapter';
import { MeetingSummary, MeetingDetail } from '@/lib/types';

export function MeetingAnalyst() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<MeetingSummary[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, []);

  useEffect(() => {
    if (id) {
      loadMeetingDetail(id);
    } else {
      setSelectedMeeting(null);
    }
  }, [id]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const meetingList = await apiAdapter.listMeetings();
      setMeetings(meetingList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load meetings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMeetingDetail = async (meetingId: string) => {
    try {
      setDetailLoading(true);
      const detail = await apiAdapter.getMeeting(meetingId);
      setSelectedMeeting(detail);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load meeting details',
        variant: 'destructive'
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportActions = () => {
    if (!selectedMeeting) return;
    
    const actionsText = selectedMeeting.actions.map(action => 
      `- ${action.description} (Owner: ${action.owner}, Due: ${action.dueDate?.toLocaleDateString() || 'TBD'}, Status: ${action.status})`
    ).join('\n');
    
    const content = `# ${selectedMeeting.title} - Action Items\n\n${actionsText}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMeeting.title}-actions.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (selectedMeeting) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/meetings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{selectedMeeting.title}</h1>
        </div>

        {detailLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="provenance">Provenance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedMeeting.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedMeeting.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedMeeting.participants.length} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedMeeting.status === 'processed' ? 'default' : 'secondary'}>
                        {selectedMeeting.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Participants</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeeting.participants.map((participant, index) => (
                        <Badge key={index} variant="outline">{participant}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => navigate(`/chat/new?context=meeting:${selectedMeeting.id}`)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discuss in Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedMeeting.insights.goals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Decisions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedMeeting.insights.decisions.map((decision, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{decision}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-amber-600">Risks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedMeeting.insights.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-600">Timelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedMeeting.insights.timelines.map((timeline, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{timeline}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="actions">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Action Items</CardTitle>
                  <Button onClick={exportActions} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedMeeting.actions.map((action) => (
                      <div key={action.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{action.description}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Owner: {action.owner}</span>
                              {action.dueDate && (
                                <span>Due: {action.dueDate.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={
                              action.status === 'completed' ? 'default' : 
                              action.status === 'in-progress' ? 'secondary' : 'outline'
                            }
                          >
                            {action.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {selectedMeeting.transcript.map((segment) => (
                        <div key={segment.id} className="border-l-2 border-muted pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{segment.speaker}</span>
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(segment.timestamp / 60)}:
                              {(segment.timestamp % 60).toString().padStart(2, '0')}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(segment.confidence * 100)}%
                            </Badge>
                          </div>
                          <p className="text-sm">{segment.text}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="provenance">
              <Card>
                <CardHeader>
                  <CardTitle>Data Provenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Source Path</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedMeeting.provenance.sourcePath}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">File Hash</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedMeeting.provenance.sourceHash}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ingested At</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedMeeting.provenance.ingestedAt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Processed At</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedMeeting.provenance.processedAt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Confidence</label>
                      <Badge variant="outline">
                        {Math.round(selectedMeeting.provenance.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meeting Analyst</h1>
        <div className="w-64">
          <Input
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeetings.map((meeting) => (
          <Card 
            key={meeting.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/meetings/${meeting.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{meeting.title}</CardTitle>
                <Badge variant={meeting.status === 'processed' ? 'default' : 'secondary'}>
                  {meeting.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {meeting.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meeting.duration}m
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {meeting.participants.length} participants
                </div>
                
                <div className="flex gap-2">
                  {meeting.hasTranscript && (
                    <Badge variant="outline" className="text-xs">
                      Transcript
                    </Badge>
                  )}
                  {meeting.hasActions && (
                    <Badge variant="outline" className="text-xs">
                      Actions
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No meetings found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search terms.' : 'Upload meeting recordings to get started.'}
          </p>
        </div>
      )}
    </div>
  );
}