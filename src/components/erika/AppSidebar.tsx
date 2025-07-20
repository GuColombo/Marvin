import { 
  Upload, 
  Tags, 
  Settings, 
  Search, 
  Database, 
  MessageSquare,
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

interface AppSidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const modules = [
  { id: 'ingestion', name: 'File Ingestion', icon: Upload },
  { id: 'classification', name: 'Classification', icon: Tags },
  { id: 'behavior', name: 'Behavior Config', icon: Settings },
  { id: 'query', name: 'Query Interface', icon: Search },
  { id: 'memory', name: 'Memory Viewer', icon: Database },
  { id: 'ask', name: 'Ask Erika', icon: MessageSquare },
];

export function AppSidebar({ activeModule, setActiveModule }: AppSidebarProps) {
  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            ERIKA System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveModule(module.id)}
                      isActive={activeModule === module.id}
                      className="w-full justify-start"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{module.name}</span>
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