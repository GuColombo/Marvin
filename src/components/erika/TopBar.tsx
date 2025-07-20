import { Bell, Settings, Brain, Sliders, Info, Activity, User, CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress as ProgressBar } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useErika } from '@/contexts/ErikaContext';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function TopBar({ activeModule, setActiveModule }: TopBarProps) {
  const { state } = useErika();
  const { user, logout } = useAuth();
  const { files } = state;
  
  const processingCount = files.filter(f => f.status === 'processing').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const totalFiles = files.length;

  // Mock logs data (in real app, this would come from context)
  const logs = [
    { id: 1, type: 'info', message: 'File processing initiated: Q3_Strategy.pdf', timestamp: '2024-01-15 14:32:15' },
    { id: 2, type: 'success', message: 'Classification complete: Document tagged as "Strategy"', timestamp: '2024-01-15 14:32:45' },
    { id: 3, type: 'warning', message: 'Low confidence score (67%) for topic classification', timestamp: '2024-01-15 14:33:02' },
    { id: 4, type: 'error', message: 'Failed to process corrupted file: damaged_doc.pdf', timestamp: '2024-01-15 14:33:18' }
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-3 w-3 text-primary" />;
      case 'success': return <CheckCircle className="h-3 w-3 text-success" />;
      case 'warning': return <AlertCircle className="h-3 w-3 text-warning" />;
      case 'error': return <AlertCircle className="h-3 w-3 text-destructive" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };


  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left Section - Sidebar Toggle, About, Branding & Module */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="mr-2" />
        
        {/* About Erika */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 bg-background border shadow-lg z-50">
            <DropdownMenuLabel>About Erika</DropdownMenuLabel>
            <div className="p-3 border-b">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-callout font-semibold">ERIKA</h3>
                  <p className="text-caption-2 text-muted-foreground">Executive Intelligence v2.1.0</p>
                </div>
              </div>
              <p className="text-caption-2 text-muted-foreground">
                Privacy-first AI assistant for document analysis and strategic insights.
              </p>
            </div>
            <DropdownMenuItem onClick={() => setActiveModule('about')}>
              <Info className="mr-2 h-4 w-4" />
              Full Documentation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveModule('version-history')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Version History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveModule('whats-new')}>
              <Activity className="mr-2 h-4 w-4" />
              What's New
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-headline font-semibold">ERIKA</h1>
              <p className="text-caption-2 text-muted-foreground">Executive Intelligence</p>
            </div>
          </div>
        </div>
      </div>


      {/* Right Section - System Status, Settings, Notifications, User Avatar */}
      <div className="flex items-center gap-3">
        {/* System Status & Logs */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Activity className="h-4 w-4" />
              {(processingCount > 0 || errorCount > 0) && (
                <div className={`absolute top-0 right-0 h-2 w-2 rounded-full ${
                  errorCount > 0 ? 'bg-destructive' : 'bg-primary'
                }`}></div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 bg-background border shadow-lg z-50">
            <DropdownMenuLabel>System Status & Activity</DropdownMenuLabel>
            
            {/* Current Processing */}
            <div className="p-3 border-b">
              <h4 className="text-caption-1 font-semibold mb-2">Current Processing</h4>
              {processingCount > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader className="h-3 w-3 text-primary animate-spin" />
                    <span className="text-caption-2">Processing Q3_Strategy.pdf - 80% complete</span>
                  </div>
                  <ProgressBar value={80} className="h-2" />
                </div>
              ) : (
                <p className="text-caption-2 text-muted-foreground">No active processing</p>
              )}
            </div>

            {/* System Stats */}
            <div className="p-3 border-b">
              <h4 className="text-caption-1 font-semibold mb-2">System Overview</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-callout font-medium">{totalFiles}</div>
                  <div className="text-caption-2 text-muted-foreground">Files</div>
                </div>
                <div>
                  <div className="text-callout font-medium">{processingCount}</div>
                  <div className="text-caption-2 text-muted-foreground">Processing</div>
                </div>
                <div>
                  <div className="text-callout font-medium">{new Set(files.flatMap(f => f.topics || [])).size}</div>
                  <div className="text-caption-2 text-muted-foreground">Topics</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Logs */}
            <div className="p-3">
              <h4 className="text-caption-1 font-semibold mb-2">Recent Activity</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {logs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-xs">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-caption-2 truncate">{log.message}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="h-2 w-2 text-muted-foreground" />
                        <span className="text-caption-2 text-muted-foreground">{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* System Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg z-50">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setActiveModule('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              General Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveModule('behavior')}>
              <Sliders className="mr-2 h-4 w-4" />
              Behavior Console
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <div className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full"></div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-background border shadow-lg z-50">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuItem className="p-3">
              <div>
                <p className="text-caption-1 font-medium">New files detected</p>
                <p className="text-caption-2 text-muted-foreground">5 files added to processing queue</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3">
              <div>
                <p className="text-caption-1 font-medium">Classification complete</p>
                <p className="text-caption-2 text-muted-foreground">Q3 Strategy doc tagged and indexed</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3">
              <div>
                <p className="text-caption-1 font-medium">Query ready</p>
                <p className="text-caption-2 text-muted-foreground">Consultant analysis available for review</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg z-50">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setActiveModule('profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveModule('export')}>
              <Settings className="mr-2 h-4 w-4" />
              Data Export & Import
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <Brain className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}