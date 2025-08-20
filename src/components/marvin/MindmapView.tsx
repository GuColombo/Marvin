import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Filter, Maximize2, Download, RefreshCcw } from 'lucide-react';
import { apiAdapter } from '@/lib/apiAdapter';
import { MindmapNode, MindmapEdge } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface MindmapFilters {
  type: string[];
  dateRange: string;
  tags: string[];
  minScore: number;
}

export function MindmapView() {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<Network | null>(null);
  const [nodes, setNodes] = useState<MindmapNode[]>([]);
  const [edges, setEdges] = useState<MindmapEdge[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [filters, setFilters] = useState<MindmapFilters>({
    type: [],
    dateRange: 'all',
    tags: [],
    minScore: 0
  });
  const [clusterBy, setClusterBy] = useState<'project' | 'topic' | 'type'>('topic');
  const { toast } = useToast();

  useEffect(() => {
    loadMindmapData();
  }, []);

  useEffect(() => {
    if (networkRef.current && nodes.length > 0) {
      initializeNetwork();
    }
  }, [nodes, edges, clusterBy]);

  const loadMindmapData = async () => {
    setLoading(true);
    try {
      const data = await apiAdapter.getMindmapData('project');
      if (data.nodes.length === 0) {
        generateMockData();
      } else {
        setNodes(data.nodes);
        setEdges(data.edges);
      }
    } catch (error) {
      console.error('Failed to load mindmap data:', error);
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockNodes: MindmapNode[] = [
      {
        id: 'topic-strategy',
        label: 'Strategic Planning',
        type: 'topic',
        size: 30,
        color: '#3b82f6',
        metadata: { artifactCount: 15, tags: ['strategy', 'planning'] }
      },
      {
        id: 'topic-finance',
        label: 'Financial Analysis',
        type: 'topic',
        size: 25,
        color: '#10b981',
        metadata: { artifactCount: 12, tags: ['finance', 'analysis'] }
      },
      {
        id: 'project-expansion',
        label: 'Market Expansion',
        type: 'project',
        size: 35,
        color: '#f59e0b',
        metadata: { artifactCount: 20, projectId: 'proj-1', tags: ['expansion', 'market'] }
      },
      {
        id: 'artifact-q4-plan',
        label: 'Q4 Business Plan',
        type: 'artifact',
        size: 20,
        color: '#ef4444',
        metadata: { artifactCount: 8, tags: ['planning', 'q4'] }
      },
      {
        id: 'entity-competitor-a',
        label: 'Competitor Analysis',
        type: 'entity',
        size: 15,
        color: '#8b5cf6',
        metadata: { artifactCount: 6, tags: ['competitive', 'analysis'] }
      }
    ];

    const mockEdges: MindmapEdge[] = [
      {
        id: 'edge-1',
        from: 'topic-strategy',
        to: 'project-expansion',
        type: 'reference',
        weight: 0.8,
        metadata: { confidence: 0.9 }
      },
      {
        id: 'edge-2',
        from: 'project-expansion',
        to: 'artifact-q4-plan',
        type: 'co-mention',
        weight: 0.9,
        metadata: { confidence: 0.85 }
      },
      {
        id: 'edge-3',
        from: 'topic-finance',
        to: 'artifact-q4-plan',
        type: 'reference',
        weight: 0.7,
        metadata: { confidence: 0.8 }
      },
      {
        id: 'edge-4',
        from: 'entity-competitor-a',
        to: 'project-expansion',
        type: 'temporal',
        weight: 0.6,
        metadata: { confidence: 0.75 }
      }
    ];

    setNodes(mockNodes);
    setEdges(mockEdges);
  };

  const initializeNetwork = () => {
    if (!networkRef.current) return;

    const visNodes = new DataSet(
      nodes.map(node => ({
        id: node.id,
        label: node.label,
        size: node.size,
        color: node.color || getTypeColor(node.type),
        shape: getNodeShape(node.type),
        font: { size: 14, color: '#ffffff' },
        chosen: true
      }))
    );

    const visEdges = new DataSet(
      edges.map(edge => ({
        id: edge.id,
        from: edge.from,
        to: edge.to,
        width: edge.weight * 5,
        color: getEdgeColor(edge.type),
        arrows: { to: { enabled: true, scaleFactor: 0.5 } }
      }))
    );

    const options = {
      nodes: {
        borderWidth: 2,
        borderColor: '#ffffff',
        shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 10 }
      },
      edges: {
        smooth: { enabled: true, type: 'continuous', roundness: 0.2 },
        shadow: { enabled: true, color: 'rgba(0,0,0,0.1)', size: 5 }
      },
      physics: {
        stabilization: { iterations: 100 },
        barnesHut: {
          gravitationalConstant: -30000,
          centralGravity: 0.1,
          springLength: 200,
          springConstant: 0.05
        }
      },
      interaction: {
        selectConnectedEdges: false,
        hover: true,
        multiselect: true
      },
      layout: {
        improvedLayout: true
      }
    };

    if (networkInstance.current) {
      networkInstance.current.destroy();
    }

    networkInstance.current = new Network(networkRef.current, { nodes: visNodes, edges: visEdges }, options);

    networkInstance.current.on('selectNode', (params) => {
      setSelectedNodes(params.nodes);
    });

    networkInstance.current.on('deselectNode', () => {
      setSelectedNodes([]);
    });

    networkInstance.current.on('doubleClick', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        handleNodePreview(nodeId);
      }
    });
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      topic: '#3b82f6',
      entity: '#10b981',
      artifact: '#f59e0b',
      project: '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  const getNodeShape = (type: string): string => {
    const shapes: Record<string, string> = {
      topic: 'dot',
      entity: 'square',
      artifact: 'diamond',
      project: 'star'
    };
    return shapes[type] || 'dot';
  };

  const getEdgeColor = (type: string): string => {
    const colors = {
      reference: '#3b82f6',
      'co-mention': '#10b981',
      temporal: '#f59e0b',
      dependency: '#ef4444'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const handleNodePreview = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      toast({
        title: node.label,
        description: `${node.type} • ${node.metadata.artifactCount || 0} artifacts`
      });
    }
  };

  const handleClusterChange = (value: 'project' | 'topic' | 'type') => {
    setClusterBy(value);
    if (networkInstance.current) {
      const options = {
        groups: generateClusterGroups(value)
      };
      networkInstance.current.setOptions(options);
    }
  };

  const generateClusterGroups = (clusterBy: string) => {
    const groups: Record<string, any> = {};
    nodes.forEach(node => {
      let groupKey: string = node.type;
      if (clusterBy === 'project' && node.metadata.projectId) {
        groupKey = node.metadata.projectId;
      } else if (clusterBy === 'topic' && node.metadata.tags && node.metadata.tags.length > 0) {
        groupKey = node.metadata.tags[0];
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          color: getTypeColor(node.type),
          shape: getNodeShape(node.type)
        };
      }
    });
    return groups;
  };

  const handleReindexSelected = async () => {
    if (selectedNodes.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select nodes to re-index',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await apiAdapter.reindexSelection(selectedNodes);
      toast({
        title: 'Success',
        description: `${result.status} - ${result.pathsProcessed} paths processed`,
        variant: 'default'
      });
      await loadMindmapData();
    } catch (error) {
      toast({
        title: 'Reindex Error',
        description: 'Failed to re-index selected nodes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Knowledge Graph
              <Badge variant="secondary">
                {nodes.length} nodes • {edges.length} connections
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedNodes.length > 0 && (
                <Badge variant="outline">
                  {selectedNodes.length} selected
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleReindexSelected}
                disabled={loading || selectedNodes.length === 0}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Re-index Selected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Cluster by:</span>
            </div>
            <Select value={clusterBy} onValueChange={handleClusterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="topic">Topic</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div 
            ref={networkRef} 
            className="w-full h-96 border rounded-lg bg-background"
            style={{ minHeight: '400px' }}
          />

          <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500" />
                  <span>Entities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rotate-45" />
                  <span>Artifacts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
                  <span>Projects</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Interactions</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Click: Select node</div>
                <div>Shift+Click: Multi-select</div>
                <div>Double-click: Preview</div>
                <div>Drag: Reposition</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Statistics</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Nodes: {nodes.length}/1000</div>
                <div>Connections: {edges.length}</div>
                <div>Clusters: {new Set(nodes.map(n => n.type)).size}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Performance</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Rendering: Fast</div>
                <div>Physics: Enabled</div>
                <div>Clustering: Active</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}