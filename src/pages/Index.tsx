import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/marvin/AppSidebar";
import { TopBar } from "@/components/marvin/TopBar";
import { LoginPage } from "@/components/marvin/LoginPage";
import { Inbox } from "@/components/marvin/Inbox";
import { MemoryViewer } from "@/components/marvin/MemoryViewer";
import { DigestView } from "@/components/marvin/DigestView";
import { QueryInterface } from "@/components/marvin/QueryInterface";
import { ConsultantMode } from "@/components/marvin/ConsultantMode";
import { BehaviorConfiguration } from "@/components/marvin/BehaviorConfiguration";
import { SystemLogs } from "@/components/marvin/SystemLogs";
import { AboutMarvin } from "@/components/marvin/AboutMarvin";
import { Settings } from "@/components/marvin/Settings";
import { FileInspector } from "@/components/marvin/FileInspector";
import { ExportImport } from "@/components/marvin/ExportImport";
import { ProfileSettings } from "@/components/marvin/ProfileSettings";
import { VersionHistory } from "@/components/marvin/VersionHistory";
import { WhatsNew } from "@/components/marvin/WhatsNew";
import { MarvinProvider } from "@/contexts/MarvinContext";
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
        return <AboutMarvin />;
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
    <MarvinProvider>
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
    </MarvinProvider>
  );
};

export default Index;