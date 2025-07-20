import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/erika/AppSidebar";
import { TopBar } from "@/components/erika/TopBar";
import { Inbox } from "@/components/erika/Inbox";
import { MemoryViewer } from "@/components/erika/MemoryViewer";
import { DigestView } from "@/components/erika/DigestView";
import { QueryInterface } from "@/components/erika/QueryInterface";
import { McKinseyMode } from "@/components/erika/McKinseyMode";
import { BehaviorConfiguration } from "@/components/erika/BehaviorConfiguration";
import { SystemLogs } from "@/components/erika/SystemLogs";
import { ErikaProvider } from "@/contexts/ErikaContext";

const Index = () => {
  const [activeModule, setActiveModule] = useState('inbox');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'inbox':
        return <Inbox />;
      case 'memory':
        return <MemoryViewer />;
      case 'digest':
        return <DigestView />;
      case 'query':
        return <QueryInterface />;
      case 'mckinsey':
        return <McKinseyMode />;
      case 'behavior':
        return <BehaviorConfiguration />;
      case 'logs':
        return <SystemLogs />;
      default:
        return <Inbox />;
    }
  };

  return (
    <ErikaProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar activeModule={activeModule} setActiveModule={setActiveModule} />
          <div className="flex-1 flex flex-col">
            <TopBar activeModule={activeModule} />
            <main className="flex-1 p-8">
              <div className="max-w-7xl mx-auto">
                {renderActiveModule()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErikaProvider>
  );
};

export default Index;