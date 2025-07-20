import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/erika/AppSidebar";
import { TopBar } from "@/components/erika/TopBar";
import { Inbox } from "@/components/erika/Inbox";
import { MemoryViewer } from "@/components/erika/MemoryViewer";
import { DigestView } from "@/components/erika/DigestView";
import { QueryInterface } from "@/components/erika/QueryInterface";
import { ConsultantMode } from "@/components/erika/ConsultantMode";
import { BehaviorConfiguration } from "@/components/erika/BehaviorConfiguration";
import { SystemLogs } from "@/components/erika/SystemLogs";
import { AboutErika } from "@/components/erika/AboutErika";
import { Settings } from "@/components/erika/Settings";
import { FileInspector } from "@/components/erika/FileInspector";
import { ExportImport } from "@/components/erika/ExportImport";
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
        return <ConsultantMode />;
      case 'inspector':
        return <FileInspector />;
      case 'export':
        return <ExportImport />;
      case 'behavior':
        return <BehaviorConfiguration />;
      case 'settings':
        return <Settings />;
      case 'about':
        return <AboutErika />;
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
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar activeModule={activeModule} />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto w-full">
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