import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/marvin/AppSidebar";
import { TopBar } from "@/components/marvin/TopBar";
import { LoginPage } from "@/components/marvin/LoginPage";

import { Knowledgebase } from "@/components/marvin/Knowledgebase";
import { ProjectsView } from "@/components/marvin/ProjectsView";
import { ToolsAccess } from "@/components/marvin/ToolsAccess";
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
import { ChatInterface } from "@/components/marvin/ChatInterface";
import { MeetingAnalyst } from "@/components/marvin/MeetingAnalyst";
import { EmailAnalyst } from "@/components/marvin/EmailAnalyst";
import { IntakeSection } from "@/components/marvin/IntakeSection";
import { MarvinProvider } from "@/contexts/MarvinContext";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useLocation } from "react-router-dom";
import { Upload } from "lucide-react";

const Index = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const params = useParams();
  const location = useLocation();

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
    const path = location.pathname;
    
    // Route-based rendering
    if (path.startsWith('/chat')) {
      return <ChatInterface />;
    }
    if (path.startsWith('/knowledge-base')) {
      return <Knowledgebase />;
    }
    if (path.startsWith('/projects')) {
      return <ProjectsView />;
    }
    if (path.startsWith('/consultant-mode')) {
      return <ConsultantMode />;
    }
    if (path.startsWith('/tools-access')) {
      return <ToolsAccess />;
    }
    if (path.startsWith('/meetings')) {
      return <MeetingAnalyst />;
    }
    if (path.startsWith('/files')) {
      return <FileInspector />;
    }
    if (path.startsWith('/emails')) {
      return <EmailAnalyst />;
    }
    if (path === '/query') {
      return <QueryInterface />;
    }
    if (path === '/settings') {
      return <Settings />;
    }
    if (path === '/behavior') {
      return <BehaviorConfiguration />;
    }
    if (path === '/export') {
      return <ExportImport />;
    }
    if (path === '/profile') {
      return <ProfileSettings />;
    }
    if (path === '/about') {
      return <AboutMarvin />;
    }
    if (path === '/version-history') {
      return <VersionHistory />;
    }
    if (path === '/whats-new') {
      return <WhatsNew />;
    }
    if (path === '/system-status') {
      return <SystemLogs />;
    }
    
    // Default to Chat for root path
    return <ChatInterface />;
  };

  return (
    <MarvinProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
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