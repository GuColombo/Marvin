import { useState, useEffect } from 'react';
import { AlertTriangle, DollarSign, Clock, CheckCircle, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToolUsageRequest, ToolPermission } from '@/lib/types';
import { costEstimator } from '@/lib/costEstimator';
import { apiAdapter } from '@/lib/apiAdapter';
import { useToast } from '@/hooks/use-toast';

interface ToolPermissionModalProps {
  request: ToolUsageRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (taskId: string, budgetCap: number) => void;
  onDeny: (taskId: string) => void;
}

export function ToolPermissionModal({ request, isOpen, onClose, onApprove, onDeny }: ToolPermissionModalProps) {
  const [budgetCap, setBudgetCap] = useState<number>(0);
  const [permissions, setPermissions] = useState<ToolPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (request) {
      setBudgetCap(request.totalEstimatedCost * 1.2); // 20% buffer
      loadPermissions();
    }
  }, [request]);

  const loadPermissions = async () => {
    try {
      const toolPermissions = await apiAdapter.getToolPermissions();
      setPermissions(toolPermissions);
    } catch (error) {
      console.error('Failed to load tool permissions:', error);
    }
  };

  const handleApprove = () => {
    if (!request) return;
    
    setLoading(true);
    onApprove(request.taskId, budgetCap);
    
    toast({
      title: 'Task Approved',
      description: `Budget cap set to $${budgetCap.toFixed(2)}`
    });
    
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleDeny = () => {
    if (!request) return;
    
    onDeny(request.taskId);
    toast({
      title: 'Task Denied',
      description: 'Tool usage request has been rejected'
    });
    onClose();
  };

  const getPermissionStatus = (toolId: string) => {
    const permission = permissions.find(p => p.toolId.includes(toolId.toLowerCase()));
    return permission || { enabled: false, askBeforeUsing: true, budgetCap: 0 };
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const getToolIcon = (toolName: string) => {
    if (toolName.toLowerCase().includes('gpt') || toolName.toLowerCase().includes('openai')) return '🤖';
    if (toolName.toLowerCase().includes('claude')) return '🧠';
    if (toolName.toLowerCase().includes('search')) return '🔍';
    if (toolName.toLowerCase().includes('email')) return '📧';
    if (toolName.toLowerCase().includes('calendar')) return '📅';
    return '🔧';
  };

  if (!request) return null;

  const budgetWarning = budgetCap < request.totalEstimatedCost;
  const budgetPercentage = (request.totalEstimatedCost / budgetCap) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Tool Permission Required
          </DialogTitle>
          <DialogDescription>
            The AI wants to use external tools to complete your request. Review the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-4 w-4" />
                Execution Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {request.tools.map((tool, index) => (
                  <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getToolIcon(tool.name)}</span>
                      <div>
                        <h4 className="font-medium">{tool.name}</h4>
                        <p className="text-sm text-muted-foreground">{tool.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(tool.estimatedCost)}</div>
                      <div className="text-xs text-muted-foreground">estimated</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost & Budget Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estimated Cost</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(request.totalEstimatedCost)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Budget Cap</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={budgetCap}
                    onChange={(e) => setBudgetCap(parseFloat(e.target.value) || 0)}
                    className={budgetWarning ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Usage</span>
                  <span>{budgetPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={Math.min(budgetPercentage, 100)} 
                  className={budgetPercentage > 100 ? 'bg-red-100' : ''} 
                />
                {budgetWarning && (
                  <p className="text-sm text-red-500">
                    ⚠️ Budget cap is below estimated cost. Task may be interrupted.
                  </p>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Execution will pause at 110% of budget cap for re-approval
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Tool Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {request.tools.map((tool) => {
                  const permission = getPermissionStatus(tool.id);
                  return (
                    <div key={tool.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{tool.name}</span>
                        <Badge variant={permission.enabled ? 'default' : 'secondary'}>
                          {permission.enabled ? 'Configured' : 'Not configured'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {permission.askBeforeUsing ? 'Ask before use' : 'Auto-approve'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {request.projectContext && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Project Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{request.projectContext}</p>
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              Requested at {new Date(request.timestamp).toLocaleTimeString()}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleDeny} disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Deny
              </Button>
              <Button 
                onClick={handleApprove} 
                disabled={loading || budgetCap <= 0}
                className="min-w-32"
              >
                {loading ? (
                  'Approving...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Run
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}