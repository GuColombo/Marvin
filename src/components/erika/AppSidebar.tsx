import { 
  Inbox, 
  Database, 
  FileText, 
  Search, 
  TrendingUp, 
  Settings,
  Activity,
  Brain
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useErika } from "@/contexts/ErikaContext";

interface AppSidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const modules = [
  { id: 'inbox', name: 'Inbox', icon: Inbox, description: 'File ingestion & processing' },
  { id: 'memory', name: 'Memory', icon: Database, description: 'All indexed files & topics' },
  { id: 'digest', name: 'Digest View', icon: FileText, description: 'Summaries & insights' },
  { id: 'query', name: 'Query Terminal', icon: Search, description: 'Natural language queries' },
  { id: 'mckinsey', name: 'McKinsey Mode', icon: TrendingUp, description: 'Strategic frameworks' },
  { id: 'behavior', name: 'Behavior Console', icon: Settings, description: 'AI configuration' },
  { id: 'logs', name: 'System Logs', icon: Activity, description: 'Processing activity' },
];

export function AppSidebar({ activeModule, setActiveModule }: AppSidebarProps) {
  const { state } = useErika();
  const { files } = state;
  
  const processingCount = files.filter(f => f.status === 'processing').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <Sidebar className="w-72 sidebar-nav">
      <SidebarContent className="p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-headline font-semibold">ERIKA</h1>
              <p className="text-caption-2 text-muted-foreground">Executive Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-caption-1 font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;
                
                return (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full justify-start h-12 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'sidebar-item-active shadow-sm' 
                          : 'sidebar-item-inactive'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-callout font-medium truncate">{module.name}</span>
                            {module.id === 'inbox' && processingCount > 0 && (
                              <Badge variant="secondary" className="ml-2 h-5 text-xs">
                                {processingCount}
                              </Badge>
                            )}
                            {module.id === 'logs' && errorCount > 0 && (
                              <Badge variant="destructive" className="ml-2 h-5 text-xs">
                                {errorCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-caption-2 text-muted-foreground truncate">{module.description}</p>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="text-callout font-semibold mb-3">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-caption-2">
              <span className="text-muted-foreground">Files Indexed</span>
              <span className="font-medium">{files.length}</span>
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
      </SidebarContent>
    </Sidebar>
  );
}