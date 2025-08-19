import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Users, Target, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/lib/types';
import { apiAdapter } from '@/lib/apiAdapter';
import { ProjectDetail } from './ProjectDetail';

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastActivity');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectList = await apiAdapter.listProjects();
      if (projectList.length === 0) {
        const mockProjects = createMockProjects();
        for (const project of mockProjects) {
          await apiAdapter.saveProject(project);
        }
        setProjects(mockProjects);
      } else {
        setProjects(projectList);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMockProjects = (): Project[] => [
    {
      id: 'proj-market-expansion',
      name: 'Market Expansion Initiative',
      description: 'Strategic expansion into European markets with focus on Germany and France',
      status: 'active',
      tags: ['strategy', 'international', 'growth'],
      stakeholders: ['Sarah Chen (PM)', 'Marcus Weber (Lead)', 'Elena Rodriguez (Strategy)'],
      objectives: [
        'Complete market analysis by Q1 end',
        'Establish partnerships in target regions',
        'Launch pilot program in Q2'
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-10'),
      lastActivity: new Date('2024-02-10'),
      timeline: [
        {
          id: 'task-1',
          title: 'Market Research & Analysis',
          description: 'Comprehensive analysis of German and French markets',
          status: 'completed',
          priority: 'high',
          assignee: 'Elena Rodriguez',
          dependencies: [],
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-01'),
          progress: 100,
          artifacts: ['market-analysis-de', 'competitive-landscape-fr'],
          lastUpdate: new Date('2024-02-01')
        },
        {
          id: 'task-2',
          title: 'Partnership Development',
          description: 'Identify and engage potential local partners',
          status: 'in-progress',
          priority: 'high',
          assignee: 'Marcus Weber',
          dependencies: ['task-1'],
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-15'),
          progress: 60,
          artifacts: ['partner-outreach-list'],
          lastUpdate: new Date('2024-02-10')
        }
      ],
      artifacts: [
        {
          id: 'art-1',
          type: 'file',
          sourceId: 'doc-market-analysis',
          title: 'European Market Analysis',
          summary: 'Comprehensive analysis of market opportunities and challenges',
          tags: ['analysis', 'market', 'europe'],
          addedAt: new Date('2024-01-20'),
          relevanceScore: 0.95
        }
      ]
    },
    {
      id: 'proj-digital-transformation',
      name: 'Digital Transformation Program',
      description: 'Modernize core business processes and technology infrastructure',
      status: 'active',
      tags: ['technology', 'process', 'modernization'],
      stakeholders: ['David Kim (CTO)', 'Anna Petrov (Process)', 'James Wilson (IT)'],
      objectives: [
        'Migrate legacy systems to cloud',
        'Implement new CRM platform',
        'Automate key business processes'
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-08'),
      lastActivity: new Date('2024-02-08'),
      timeline: [],
      artifacts: []
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'lastActivity':
      default:
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    }
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const createNewProject = async () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: 'New Project',
      description: 'Project description',
      status: 'active',
      tags: [],
      stakeholders: [],
      objectives: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivity: new Date(),
      timeline: [],
      artifacts: []
    };

    try {
      await apiAdapter.saveProject(newProject);
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)}
        onUpdate={(updatedProject) => {
          setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
          setSelectedProject(updatedProject);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your strategic initiatives and track progress
          </p>
        </div>
        <Button onClick={createNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastActivity">Recent Activity</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {sortedProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{project.stakeholders.length} stakeholders</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>{project.objectives.length} objectives</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Updated {new Date(project.lastActivity).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-muted-foreground mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {sortedProjects.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No projects found</h3>
                  <p className="text-sm">
                    {searchQuery ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}