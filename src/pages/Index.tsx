import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/erika/AppSidebar";
import { TopBar } from "@/components/erika/TopBar";
import { LoginPage } from "@/components/erika/LoginPage";
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
import { ProfileSettings } from "@/components/erika/ProfileSettings";
import { VersionHistory } from "@/components/erika/VersionHistory";
import { WhatsNew } from "@/components/erika/WhatsNew";
import { ErikaProvider } from "@/contexts/ErikaContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [activeModule, setActiveModule] = useState('inbox');

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

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
      case 'profile':
        return <ProfileSettings />;
      case 'version-history':
        return <VersionHistory />;
      case 'whats-new':
        return <WhatsNew />;
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
            <TopBar activeModule={activeModule} setActiveModule={setActiveModule} />
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