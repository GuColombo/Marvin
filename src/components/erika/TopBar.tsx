import { useState } from 'react';
import { Search, Bell, Settings, Brain, Activity, Sliders, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
      'inspector': 'File Inspector',
      'export': 'Export & Import',
      'behavior': 'Behavior Console',
      'settings': 'Settings',
      'about': 'About Erika',
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
      {/* Left Section - Sidebar Toggle, Branding & Module */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="mr-2" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-headline font-semibold">ERIKA</h1>
              <p className="text-caption-2 text-muted-foreground">Executive Intelligence</p>
            </div>
            <div className="text-muted-foreground">•</div>
            <div>
              <h2 className="text-title-3 font-medium">{getModuleTitle(activeModule)}</h2>
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

      {/* Right Section - Notifications and Settings */}
      <div className="flex items-center gap-3">
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
          <DropdownMenuContent align="end" className="w-80 bg-background border shadow-lg z-50">
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
          <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg z-50">
            {/* System Status Section */}
            <div className="p-3 border-b">
              <h3 className="text-callout font-semibold mb-2">System Status</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-caption-2">
                  <span className="text-muted-foreground">Files Indexed</span>
                  <span className="font-medium">{totalFiles}</span>
                </div>
                <div className="flex justify-between text-caption-2">
                  <span className="text-muted-foreground">Processing</span>
                  <span className="font-medium">{processingCount}</span>
                </div>
                <div className="flex justify-between text-caption-2">
                  <span className="text-muted-foreground">Topics</span>
                  <span className="font-medium">{new Set(files.flatMap(f => f.topics || [])).size}</span>
                </div>
              </div>
            </div>
            
            {/* Settings Items */}
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Sliders className="mr-2 h-4 w-4" />
              Behavior Console
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Info className="mr-2 h-4 w-4" />
              About Erika
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}