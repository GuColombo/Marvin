import { useState, useEffect } from 'react';
import { Key, Shield, Eye, EyeOff, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToolPermission } from '@/lib/types';
import { apiAdapter } from '@/lib/apiAdapter';
import { useToast } from '@/hooks/use-toast';

export function ToolsAccess() {
  const [permissions, setPermissions] = useState<ToolPermission[]>([]);
  const [editingTool, setEditingTool] = useState<string | null>(null);
  const [newTool, setNewTool] = useState<Partial<ToolPermission>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const toolPermissions = await apiAdapter.getToolPermissions();
      if (toolPermissions.length === 0) {
        const defaultTools = createDefaultTools();
        for (const tool of defaultTools) {
          await apiAdapter.saveToolPermission(tool);
        }
        setPermissions(defaultTools);
      } else {
        setPermissions(toolPermissions);
      }
    } catch (error) {
      console.error('Failed to load tool permissions:', error);
    }
  };

  const createDefaultTools = (): ToolPermission[] => [
    {
      toolId: 'openai-gpt4',
      enabled: true,
      askBeforeUsing: true,
      budgetCap: 50.0,
      scopes: ['chat', 'analysis', 'generation'],
      totalSpent: 0,
      lastUsed: undefined
    },
    {
      toolId: 'microsoft-graph',
      enabled: false,
      askBeforeUsing: true,
      budgetCap: 20.0,
      scopes: ['email', 'calendar', 'files'],
      totalSpent: 0,
      lastUsed: undefined
    },
    {
      toolId: 'google-workspace',
      enabled: false,
      askBeforeUsing: true,
      budgetCap: 30.0,
      scopes: ['gmail', 'drive', 'calendar'],
      totalSpent: 0,
      lastUsed: undefined
    },
    {
      toolId: 'anthropic-claude',
      enabled: false,
      askBeforeUsing: true,
      budgetCap: 40.0,
      scopes: ['chat', 'analysis'],
      totalSpent: 0,
      lastUsed: undefined
    }
  ];

  const savePermission = async (permission: ToolPermission) => {
    try {
      await apiAdapter.saveToolPermission(permission);
      setPermissions(permissions.map(p => p.toolId === permission.toolId ? permission : p));
      setEditingTool(null);
      toast({
        title: 'Tool Updated',
        description: `Settings for ${permission.toolId} have been saved`
      });
    } catch (error) {
      toast({
        title: 'Save Error',
        description: 'Failed to save tool settings',
        variant: 'destructive'
      });
    }
  };

  const addNewTool = async () => {
    if (!newTool.toolId) {
      toast({
        title: 'Validation Error',
        description: 'Tool ID is required',
        variant: 'destructive'
      });
      return;
    }

    const permission: ToolPermission = {
      toolId: newTool.toolId,
      enabled: newTool.enabled ?? false,
      askBeforeUsing: newTool.askBeforeUsing ?? true,
      budgetCap: newTool.budgetCap ?? 10.0,
      scopes: newTool.scopes ?? [],
      apiKey: newTool.apiKey,
      totalSpent: 0,
      lastUsed: undefined
    };

    try {
      await apiAdapter.saveToolPermission(permission);
      setPermissions([...permissions, permission]);
      setNewTool({});
      setShowAddDialog(false);
      toast({
        title: 'Tool Added',
        description: `${permission.toolId} has been added`
      });
    } catch (error) {
      toast({
        title: 'Add Error',
        description: 'Failed to add new tool',
        variant: 'destructive'
      });
    }
  };

  const deleteTool = async (toolId: string) => {
    setPermissions(permissions.filter(p => p.toolId !== toolId));
    toast({
      title: 'Tool Removed',
      description: `${toolId} has been removed`
    });
  };

  const toggleApiKeyVisibility = (toolId: string) => {
    setShowApiKey(prev => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const getToolIcon = (toolId: string) => {
    if (toolId.includes('openai')) return '🤖';
    if (toolId.includes('microsoft')) return '📧';
    if (toolId.includes('google')) return '📄';
    if (toolId.includes('anthropic')) return '🧠';
    return '🔧';
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tools Access & Permissions</h2>
          <p className="text-muted-foreground">
            Manage API keys, permissions, and budget controls for external tools
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tool</DialogTitle>
              <DialogDescription>
                Configure access settings for a new external tool or service
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="toolId">Tool ID</Label>
                <Input
                  id="toolId"
                  placeholder="e.g., openai-gpt4, microsoft-graph"
                  value={newTool.toolId || ''}
                  onChange={(e) => setNewTool({ ...newTool, toolId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter API key or secret"
                  value={newTool.apiKey || ''}
                  onChange={(e) => setNewTool({ ...newTool, apiKey: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="budgetCap">Budget Cap</Label>
                <Input
                  id="budgetCap"
                  type="number"
                  placeholder="10.00"
                  value={newTool.budgetCap || ''}
                  onChange={(e) => setNewTool({ ...newTool, budgetCap: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="scopes">Scopes (comma-separated)</Label>
                <Input
                  id="scopes"
                  placeholder="chat, analysis, generation"
                  value={newTool.scopes?.join(', ') || ''}
                  onChange={(e) => setNewTool({ 
                    ...newTool, 
                    scopes: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newTool.enabled || false}
                  onCheckedChange={(checked) => setNewTool({ ...newTool, enabled: checked })}
                />
                <Label htmlFor="enabled">Enable tool</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="askBefore"
                  checked={newTool.askBeforeUsing ?? true}
                  onCheckedChange={(checked) => setNewTool({ ...newTool, askBeforeUsing: checked })}
                />
                <Label htmlFor="askBefore">Ask before using</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addNewTool}>Add Tool</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {permissions.map((permission) => (
          <Card key={permission.toolId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getToolIcon(permission.toolId)}</span>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {permission.toolId}
                      {permission.enabled ? (
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Budget: {formatCurrency(permission.totalSpent)} / {formatCurrency(permission.budgetCap || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingTool === permission.toolId ? (
                    <>
                      <Button size="sm" onClick={() => savePermission(permission)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingTool(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingTool(permission.toolId)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteTool(permission.toolId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingTool === permission.toolId ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          type={showApiKey[permission.toolId] ? 'text' : 'password'}
                          value={permission.apiKey || ''}
                          onChange={(e) => {
                            const updated = { ...permission, apiKey: e.target.value };
                            setPermissions(permissions.map(p => p.toolId === permission.toolId ? updated : p));
                          }}
                          placeholder="Enter API key"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleApiKeyVisibility(permission.toolId)}
                        >
                          {showApiKey[permission.toolId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Budget Cap</Label>
                      <Input
                        type="number"
                        value={permission.budgetCap || ''}
                        onChange={(e) => {
                          const updated = { ...permission, budgetCap: parseFloat(e.target.value) };
                          setPermissions(permissions.map(p => p.toolId === permission.toolId ? updated : p));
                        }}
                        placeholder="Budget cap in USD"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Scopes</Label>
                    <Textarea
                      value={permission.scopes.join(', ')}
                      onChange={(e) => {
                        const scopes = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                        const updated = { ...permission, scopes };
                        setPermissions(permissions.map(p => p.toolId === permission.toolId ? updated : p));
                      }}
                      placeholder="Enter scopes separated by commas"
                    />
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={(checked) => {
                          const updated = { ...permission, enabled: checked };
                          setPermissions(permissions.map(p => p.toolId === permission.toolId ? updated : p));
                        }}
                      />
                      <Label>Enable tool</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={permission.askBeforeUsing}
                        onCheckedChange={(checked) => {
                          const updated = { ...permission, askBeforeUsing: checked };
                          setPermissions(permissions.map(p => p.toolId === permission.toolId ? updated : p));
                        }}
                      />
                      <Label>Ask before using</Label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="font-medium">
                        {permission.enabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Permission:</span>
                      <div className="font-medium">
                        {permission.askBeforeUsing ? 'Ask before use' : 'Auto-approve'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <div className="font-medium">
                        {formatCurrency(permission.budgetCap || 0)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last used:</span>
                      <div className="font-medium">
                        {permission.lastUsed ? new Date(permission.lastUsed).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground text-sm">Scopes:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {permission.scopes.map((scope) => (
                        <Badge key={scope} variant="outline">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground text-sm">API Key:</span>
                    <div className="font-mono text-sm">
                      {permission.apiKey ? '••••••••••••••••' : 'Not configured'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {permissions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">No tools configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first tool to start managing API access and permissions
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tool
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}