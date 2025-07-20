import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/erika/AppSidebar";
import { FileIngestion } from "@/components/erika/FileIngestion";
import { TopicClassification } from "@/components/erika/TopicClassification";
import { BehaviorConfiguration } from "@/components/erika/BehaviorConfiguration";
import { QueryInterface } from "@/components/erika/QueryInterface";
import { MemoryViewer } from "@/components/erika/MemoryViewer";
import { AskErika } from "@/components/erika/AskErika";
import { ErikaProvider } from "@/contexts/ErikaContext";

const Index = () => {
  const [activeModule, setActiveModule] = useState('ingestion');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'ingestion':
        return <FileIngestion />;
      case 'classification':
        return <TopicClassification />;
      case 'behavior':
        return <BehaviorConfiguration />;
      case 'query':
        return <QueryInterface />;
      case 'memory':
        return <MemoryViewer />;
      case 'ask':
        return <AskErika />;
      default:
        return <FileIngestion />;
    }
  };

  return (
    <ErikaProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeModule={activeModule} setActiveModule={setActiveModule} />
          <main className="flex-1 p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              {renderActiveModule()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ErikaProvider>
  );
};

export default Index;