import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Pin, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiAdapter } from '@/lib/apiAdapter';
import { ChatThread } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ChatSidebar() {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const { toast } = useToast();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      setLoading(true);
      const threadList = await apiAdapter.listChatThreads();
      setThreads(threadList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load chat threads',
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
      // Refresh threads list
      loadThreads();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive'
      });
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const pinnedThreads = filteredThreads.filter(t => t.isPinned);
  const unpinnedThreads = filteredThreads.filter(t => !t.isPinned);

  if (loading) {
    return (
      <div className="w-80 border-r border-border bg-muted/30 p-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button onClick={createNewThread} className="w-full mb-4">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Pinned Chats */}
          {pinnedThreads.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Pin className="h-3 w-3" />
                Pinned
              </div>
              <div className="space-y-1">
                {pinnedThreads.map((thread) => (
                  <ChatThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === threadId}
                    onClick={() => navigate(`/chat/${thread.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Chats */}
          {unpinnedThreads.length > 0 && (
            <div>
              {pinnedThreads.length > 0 && (
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Recent
                </div>
              )}
              <div className="space-y-1">
                {unpinnedThreads.map((thread) => (
                  <ChatThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === threadId}
                    onClick={() => navigate(`/chat/${thread.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredThreads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? 'No chats found' : 'No chats yet'}
              </p>
              {!searchQuery && (
                <Button 
                  variant="ghost" 
                  onClick={createNewThread}
                  className="mt-2"
                >
                  Start your first chat
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ChatThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onClick: () => void;
}

function ChatThreadItem({ thread, isActive, onClick }: ChatThreadItemProps) {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const previewText = lastMessage ? 
    (lastMessage.role === 'user' ? 'You: ' : 'Marvin: ') + lastMessage.content.slice(0, 60) + '...' :
    'New conversation';

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent group",
        isActive && "bg-accent border border-accent-foreground/20"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{thread.title}</h4>
            {thread.isPinned && (
              <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {previewText}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {thread.lastActivity.toLocaleDateString()}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 h-6 w-6 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Show thread menu
          }}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}