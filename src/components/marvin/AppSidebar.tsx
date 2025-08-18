import { 
  Database, 
  FileText, 
  Search, 
  TrendingUp, 
  Settings,
  Activity,
  Info,
  FileSearch,
  Download,
  Upload,
  MessageCircle,
  CalendarDays,
  Mail,
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
import { useMarvin } from "@/contexts/MarvinContext";
import { useNavigate, useLocation } from "react-router-dom";

interface AppSidebarProps {}

const modules = [
  { id: 'chat', name: 'Chat Mode', icon: MessageCircle, description: 'AI assistant with context', route: '/chat' },
  { id: 'meetings', name: 'Meeting Analyst', icon: CalendarDays, description: 'Meeting analysis & insights', route: '/meetings' },
  { id: 'files', name: 'File Analyst', icon: FileSearch, description: 'Document analysis & search', route: '/files' },
  { id: 'emails', name: 'Email Analyst', icon: Mail, description: 'Email conversation analysis', route: '/emails' },
  { id: 'kb', name: 'Knowledge Base', icon: Brain, description: 'Indexed knowledge & search', route: '/kb' },
  { id: 'digest', name: 'Digest View', icon: FileText, description: 'Summaries & insights', route: '/digest' },
  { id: 'query', name: 'Query Terminal', icon: Search, description: 'Natural language queries', route: '/query' },
  { id: 'mckinsey', name: 'Consultant Mode', icon: TrendingUp, description: 'Strategic frameworks', route: '/consultant' },
];

export function AppSidebar({}: AppSidebarProps) {
  const { state } = useMarvin();
  const { files } = state;
  const navigate = useNavigate();
  const location = useLocation();
  
  const processingCount = files.filter(f => f.status === 'processing').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <Sidebar className="sidebar-nav border-r border-sidebar-border" collapsible="offcanvas">
      <SidebarContent className="p-4">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-caption-1 font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = location.pathname === module.route || 
                  (module.route !== '/' && location.pathname.startsWith(module.route));
                
                return (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton 
                      onClick={() => navigate(module.route)}
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

      </SidebarContent>
    </Sidebar>
  );
}