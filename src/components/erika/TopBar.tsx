import { useState } from 'react';
import { Search, Bell, Settings, Brain, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useErika } from '@/contexts/ErikaContext';

interface TopBarProps {
  activeModule: string;
}

export function TopBar({ activeModule }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useErika();
  const { files } = state;
  
  const processingCount = files.filter(f => f.status === 'processing').length;
  const totalFiles = files.length;
  
  const getModuleTitle = (module: string) => {
    const titles = {
      'inbox': 'Inbox',
      'memory': 'Memory',
      'digest': 'Digest View',
      'query': 'Query Terminal',
      'mckinsey': 'Consultant Mode',
      'behavior': 'Behavior Console',
      'logs': 'System Logs'
    };
    return titles[module as keyof typeof titles] || 'Erika';
  };

  const getStatusColor = () => {
    if (processingCount > 0) return 'bg-warning';
    if (totalFiles > 0) return 'bg-success';
    return 'bg-muted-foreground';
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left Section - Module Title and Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-headline font-semibold">{getModuleTitle(activeModule)}</h1>
            <div className="flex items-center gap-2 text-caption-2 text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              {processingCount > 0 ? (
                <span>Processing {processingCount} files...</span>
              ) : (
                <span>{totalFiles} files indexed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across all memory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 search-input"
          />
        </div>
      </div>

      {/* Right Section - Status and Settings */}
      <div className="flex items-center gap-3">
        {/* Activity Indicator */}
        <Button variant="ghost" size="sm" className="relative">
          <Activity className="h-4 w-4" />
          {processingCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {processingCount}
            </Badge>
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h3 className="text-callout font-semibold">Notifications</h3>
            </div>
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

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Behavior Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>System Status</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>About Erika</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}