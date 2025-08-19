import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { ToolPermissionModal } from './ToolPermissionModal';
import { apiAdapter } from '@/lib/apiAdapter';
import { useToast } from '@/hooks/use-toast';

interface ChatEnhancementsProps {
  onProjectContextChange?: (enabled: boolean, projectId?: string) => void;
}

export function ChatEnhancements({ onProjectContextChange }: ChatEnhancementsProps) {
  const [useProjectContext, setUseProjectContext] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [pendingToolRequest, setPendingToolRequest] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectList = await apiAdapter.listProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleProjectContextToggle = (enabled: boolean) => {
    setUseProjectContext(enabled);
    onProjectContextChange?.(enabled, enabled ? selectedProject : undefined);
  };

  const handleProjectSelection = (projectId: string) => {
    setSelectedProject(projectId);
    onProjectContextChange?.(useProjectContext, projectId);
  };

  const handleToolPermissionRequest = (request: any) => {
    setPendingToolRequest(request);
    setShowPermissionModal(true);
  };

  const handleApproveToolUsage = (taskId: string, budgetCap: number) => {
    toast({
      title: 'Tools Approved',
      description: `Task ${taskId} approved with budget cap of $${budgetCap.toFixed(2)}`
    });
    setShowPermissionModal(false);
    setPendingToolRequest(null);
  };

  const handleDenyToolUsage = (taskId: string) => {
    toast({
      title: 'Tools Denied',
      description: `Task ${taskId} has been cancelled`
    });
    setShowPermissionModal(false);
    setPendingToolRequest(null);
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Chat Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-project-context"
              checked={useProjectContext}
              onCheckedChange={handleProjectContextToggle}
            />
            <Label htmlFor="use-project-context">
              Use current Project context
            </Label>
          </div>

          {useProjectContext && (
            <div className="space-y-2">
              <Label>Select Project</Label>
              <div className="grid gap-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProject === project.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => handleProjectSelection(project.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedProject === project.id && (
                        <Badge>Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToolPermissionRequest({
                taskId: 'demo-task',
                tools: [
                  { id: 'gpt-4', name: 'OpenAI GPT-4', purpose: 'Generate strategic analysis', estimatedCost: 2.50 },
                  { id: 'search', name: 'Web Search', purpose: 'Find market data', estimatedCost: 0.10 }
                ],
                totalEstimatedCost: 2.60,
                projectContext: selectedProject ? projects.find(p => p.id === selectedProject)?.name : undefined,
                timestamp: new Date()
              })}
            >
              Demo Tool Permission
            </Button>
          </div>
        </CardContent>
      </Card>

      <ToolPermissionModal
        request={pendingToolRequest}
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onApprove={handleApproveToolUsage}
        onDeny={handleDenyToolUsage}
      />
    </>
  );
}