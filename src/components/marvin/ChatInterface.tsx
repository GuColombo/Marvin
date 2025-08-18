import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Paperclip, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiAdapter } from '@/lib/apiAdapter';
import { ChatThread, ChatMessage, ContextAttachment } from '@/lib/types';

export function ChatInterface() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachments, setAttachments] = useState<ContextAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadId) {
      loadThread(threadId);
    } else {
      setCurrentThread(null);
    }
  }, [threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThread?.messages]);

  const loadThread = async (id: string) => {
    try {
      setLoading(true);
      const thread = await apiAdapter.getChatThread(id);
      setCurrentThread(thread);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load chat thread',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewThread = async () => {
    try {
      const { id } = await apiAdapter.createChatThread();
      navigate(`/chat/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive'
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isStreaming) return;

    let thread = currentThread;
    
    // Create new thread if none exists
    if (!thread) {
      try {
        const { id } = await apiAdapter.createChatThread();
        thread = {
          id,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          messages: [],
          lastActivity: new Date(),
          isPinned: false
        };
        setCurrentThread(thread);
        navigate(`/chat/${id}`, { replace: true });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to create chat thread',
          variant: 'destructive'
        });
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    // Add user message immediately
    const updatedThread = {
      ...thread,
      messages: [...thread.messages, userMessage],
      lastActivity: new Date()
    };
    setCurrentThread(updatedThread);

    const currentMessage = message;
    const currentAttachments = attachments.map(a => a.id);
    setMessage('');
    setAttachments([]);
    setIsStreaming(true);

    // Create assistant message placeholder
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      citations: []
    };

    try {
      // Stream the response
      const stream = apiAdapter.sendChatMessage(thread.id, currentMessage, currentAttachments);
      
      for await (const delta of stream) {
        if (delta.type === 'content') {
          assistantMessage.content += delta.content || '';
          setCurrentThread(prev => prev ? {
            ...prev,
            messages: [
              ...prev.messages.slice(0, -1),
              assistantMessage,
              ...prev.messages.slice(-1)
            ]
          } : prev);
        } else if (delta.type === 'citation' && delta.citation) {
          assistantMessage.citations = [...(assistantMessage.citations || []), delta.citation];
          setCurrentThread(prev => prev ? {
            ...prev,
            messages: [
              ...prev.messages.slice(0, -1),
              assistantMessage,
              ...prev.messages.slice(-1)
            ]
          } : prev);
        } else if (delta.type === 'done') {
          break;
        }
      }

      // Add the complete assistant message
      setCurrentThread(prev => prev ? {
        ...prev,
        messages: [...prev.messages, assistantMessage],
        lastActivity: new Date()
      } : prev);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Chat Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {currentThread?.title || 'New Chat'}
          </h2>
          <Button onClick={createNewThread} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {currentThread?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {msg.attachments.map((attachment) => (
                      <Badge key={attachment.id} variant="secondary" className="mr-2">
                        {attachment.title}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <div className="flex flex-wrap gap-1">
                      {msg.citations.map((citation) => (
                        <Badge key={citation.id} variant="outline" className="text-xs">
                          {citation.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isStreaming && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl p-4 bg-muted">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Marvin is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {!currentThread && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md space-y-4">
              <h3 className="text-xl font-semibold">Welcome to Marvin Chat</h3>
              <p className="text-muted-foreground">
                Start a conversation with Marvin. Ask questions about your meetings, files, or get insights from your knowledge base.
              </p>
              <Button onClick={createNewThread}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border p-4">
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <Badge 
                key={attachment.id} 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setAttachments(prev => prev.filter(a => a.id !== attachment.id))}
              >
                {attachment.title} ×
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="mb-2"
            onClick={() => {
              // TODO: Open context picker
              toast({
                title: 'Context Picker',
                description: 'Context picker will be implemented next'
              });
            }}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Marvin..."
              className="min-h-[60px] max-h-32 resize-none"
              disabled={isStreaming}
            />
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!message.trim() || isStreaming}
            size="icon"
            className="mb-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}