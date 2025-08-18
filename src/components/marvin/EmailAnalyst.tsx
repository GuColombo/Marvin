import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Users, Calendar, MessageSquare, TrendingUp, TrendingDown, Minus, MailOpen } from 'lucide-react';
import { IntakeSection } from './IntakeSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiAdapter } from '@/lib/apiAdapter';
import { EmailSummary, EmailDetail } from '@/lib/types';

export function EmailAnalyst() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  useEffect(() => {
    if (id) {
      loadEmailDetail(id);
    } else {
      setSelectedEmail(null);
    }
  }, [id]);

  const loadEmails = async () => {
    try {
      setLoading(true);
      const emailList = await apiAdapter.listEmails();
      setEmails(emailList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load emails',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmailDetail = async (emailId: string) => {
    try {
      setDetailLoading(true);
      const detail = await apiAdapter.getEmail(emailId);
      setSelectedEmail(detail);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load email details',
        variant: 'destructive'
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
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

  if (selectedEmail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/emails')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{selectedEmail.subject}</h1>
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
              <TabsTrigger value="thread">Email Thread</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="provenance">Provenance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Email Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEmail.messageCount} messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEmail.participants.length} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEmail.lastActivity.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(selectedEmail.insights.sentiment)}
                      <span className={`text-sm ${getSentimentColor(selectedEmail.insights.sentiment)}`}>
                        {selectedEmail.insights.sentiment}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Participants</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmail.participants.map((participant, index) => (
                        <Badge key={index} variant="outline">{participant}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => navigate(`/chat/new?context=email:${selectedEmail.id}`)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discuss in Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="thread">
              <Card>
                <CardHeader>
                  <CardTitle>Email Thread</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {selectedEmail.messages.map((message, index) => (
                        <div key={message.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium">{message.from}</div>
                              <div className="text-sm text-muted-foreground">
                                To: {message.to.join(', ')}
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              {message.timestamp.toLocaleString()}
                            </div>
                          </div>
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedEmail.insights.summary}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getSentimentIcon(selectedEmail.insights.sentiment)}
                        Sentiment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-lg font-medium ${getSentimentColor(selectedEmail.insights.sentiment)}`}>
                        {selectedEmail.insights.sentiment.charAt(0).toUpperCase() + 
                         selectedEmail.insights.sentiment.slice(1)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Overall tone of the email thread based on language analysis.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Action Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedEmail.insights.actionItems.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedEmail.insights.actionItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No action items identified.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
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
                        {selectedEmail.provenance.sourcePath}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Source Hash</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedEmail.provenance.sourceHash}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ingested At</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedEmail.provenance.ingestedAt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Processed At</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedEmail.provenance.processedAt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Confidence</label>
                      <Badge variant="outline">
                        {Math.round(selectedEmail.provenance.confidence * 100)}%
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
      <div>
        <h1 className="text-title-2 mb-2">Email Analyst</h1>
        <p className="text-body text-muted-foreground">
          Analyze email conversations, extract insights, and track communication patterns
        </p>
      </div>

      {/* Intake Section */}
      <IntakeSection
        title="Add Email Content"
        description="Upload email exports, mbox files, or conversation archives"
        acceptedTypes={['.eml', '.msg', '.mbox', '.pst']}
        icon={MailOpen}
        contentType="email"
      />

      <div className="flex items-center justify-between">
        <h2 className="text-headline font-semibold">Emails</h2>
        <div className="w-64">
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmails.map((email) => (
          <Card 
            key={email.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/emails/${email.id}`)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{email.subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {email.messageCount} messages
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {email.participants.length} people
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {email.lastActivity.toLocaleDateString()}
                </div>
                
                <div className="flex gap-2">
                  {email.hasActions && (
                    <Badge variant="outline" className="text-xs">
                      Actions
                    </Badge>
                  )}
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Participants:</p>
                  <p className="text-sm truncate">{email.participants.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No emails found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search terms.' : 'Connect your email to get started.'}
          </p>
        </div>
      )}
    </div>
  );
}