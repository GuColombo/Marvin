import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="marvin-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Index />} />
              <Route path="/chat/:threadId" element={<Index />} />
              <Route path="/knowledge-base" element={<Index />} />
              <Route path="/knowledge-base/:id" element={<Index />} />
              <Route path="/projects" element={<Index />} />
              <Route path="/projects/:id" element={<Index />} />
              <Route path="/consultant-mode" element={<Index />} />
              <Route path="/meetings" element={<Index />} />
              <Route path="/meetings/:id" element={<Index />} />
              <Route path="/files" element={<Index />} />
              <Route path="/files/:id" element={<Index />} />
              <Route path="/emails" element={<Index />} />
              <Route path="/emails/:id" element={<Index />} />
              <Route path="/tools-access" element={<Index />} />
              <Route path="/query" element={<Index />} />
              <Route path="/settings" element={<Index />} />
              <Route path="/behavior" element={<Index />} />
              <Route path="/export" element={<Index />} />
              <Route path="/profile" element={<Index />} />
              <Route path="/about" element={<Index />} />
              <Route path="/version-history" element={<Index />} />
              <Route path="/whats-new" element={<Index />} />
              <Route path="/system-status" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
