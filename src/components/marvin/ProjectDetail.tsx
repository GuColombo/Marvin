import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, Target, FileText, MessageSquare, Download, Play, MoreHorizontal, Kanban, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, ProjectTask } from '@/lib/types';
import { apiAdapter } from '@/lib/apiAdapter';
import { useToast } from '@/hooks/use-toast';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdate: (project: Project) => void;
}

export function ProjectDetail({ project, onBack, onUpdate }: ProjectDetailProps) {
  const [currentView, setCurrentView] = useState<'gantt' | 'kanban'>('gantt');
  const [tasks, setTasks] = useState<ProjectTask[]>(project.timeline || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    const colors = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'blocked': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors['not-started'];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const updateTaskStatus = async (taskId: string, status: ProjectTask['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status, progress: status === 'completed' ? 100 : task.progress, lastUpdate: new Date() }
        : task
    );
    
    setTasks(updatedTasks);
    
    const updatedProject = { ...project, timeline: updatedTasks, lastActivity: new Date() };
    await apiAdapter.saveProject(updatedProject);
    onUpdate(updatedProject);
    
    toast({
      title: 'Task Updated',
      description: `Task marked as ${status}`
    });
  };

  const addNewTask = () => {
    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: 'Task description',
      status: 'not-started',
      priority: 'medium',
      dependencies: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: 0,
      artifacts: [],
      lastUpdate: new Date()
    };
    
    setTasks([...tasks, newTask]);
  };

  const exportToICS = () => {
    const milestones = tasks.filter(task => task.priority === 'critical' || task.status === 'completed');
    
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Marvin//Project Timeline//EN\n';
    
    milestones.forEach(task => {
      const startDate = task.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = task.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `DTSTART:${startDate}\n`;
      icsContent += `DTEND:${endDate}\n`;
      icsContent += `SUMMARY:${task.title}\n`;
      icsContent += `DESCRIPTION:${task.description}\n`;
      icsContent += `UID:${task.id}@marvin.local\n`;
      icsContent += `END:VEVENT\n`;
    });
    
    icsContent += 'END:VCALENDAR';
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}-milestones.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Milestones exported to calendar file'
    });
  };

  const runIngestionForProject = async () => {
    setLoading(true);
    try {
      const result = await apiAdapter.runIngestionNow();
      toast({
        title: 'Success',
        description: result.status,
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Ingestion Error',
        description: 'Failed to run ingestion',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const overallProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0;

  const tasksByStatus = {
    'not-started': tasks.filter(t => t.status === 'not-started'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'completed': tasks.filter(t => t.status === 'completed'),
    'blocked': tasks.filter(t => t.status === 'blocked')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Progress</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="font-medium">Team</span>
            </div>
            <div className="text-2xl font-bold">{project.stakeholders.length}</div>
            <div className="text-sm text-muted-foreground">stakeholders</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Tasks</span>
            </div>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">total tasks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Artifacts</span>
            </div>
            <div className="text-2xl font-bold">{project.artifacts.length}</div>
            <div className="text-sm text-muted-foreground">documents</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Timeline</CardTitle>
                <div className="flex gap-2">
                  <Select value={currentView} onValueChange={(value: any) => setCurrentView(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gantt">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Gantt
                        </div>
                      </SelectItem>
                      <SelectItem value="kanban">
                        <div className="flex items-center gap-2">
                          <Kanban className="h-4 w-4" />
                          Kanban
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={addNewTask}>
                    Add Task
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToICS}>
                    <Download className="h-4 w-4 mr-2" />
                    Export ICS
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentView === 'gantt' ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Select value={task.status} onValueChange={(value: any) => updateTaskStatus(task.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="blocked">Blocked</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Start:</span>
                          <div>
                            {(() => {
                              const startDate = (task as any).start || task.startDate;
                              return startDate ? new Date(startDate).toLocaleDateString() : 'Not set';
                            })()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End:</span>
                          <div>
                            {(() => {
                              const endDate = (task as any).end || task.endDate;
                              return endDate ? new Date(endDate).toLocaleDateString() : 'Not set';
                            })()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Assignee:</span>
                          <div>{(task as any).owner || task.assignee || 'Unassigned'}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                    <div key={status} className="space-y-3">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        {status.replace('-', ' ')}
                        <Badge variant="secondary">{statusTasks.length}</Badge>
                      </h4>
                      <div className="space-y-2">
                        {statusTasks.map((task) => (
                          <Card key={task.id} className="p-3">
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">{task.title}</h5>
                              <p className="text-xs text-muted-foreground">{task.description}</p>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                              <Progress value={task.progress} className="h-1" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => {/* Start chat with context */}}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chat in Context
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Brief
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={runIngestionForProject}
                disabled={loading}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Ingestion Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stakeholders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="text-sm">{stakeholder}</div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {project.artifacts.map((artifact) => (
                    <div key={artifact.id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{artifact.title}</div>
                      <div className="text-muted-foreground">{artifact.summary}</div>
                      <div className="flex gap-1 mt-1">
                        {artifact.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}