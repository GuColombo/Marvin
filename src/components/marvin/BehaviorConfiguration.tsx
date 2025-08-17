import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMarvin, BehaviorRule } from '@/contexts/MarvinContext';
import { useToast } from '@/hooks/use-toast';

export function BehaviorConfiguration() {
  const { state, dispatch } = useMarvin();
  const { toast } = useToast();
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({ name: '', condition: '', action: '' });
  const [editData, setEditData] = useState({ name: '', condition: '', action: '' });

  const handleAddRule = () => {
    if (!newRule.name.trim() || !newRule.condition.trim() || !newRule.action.trim()) return;

    const rule: BehaviorRule = {
      id: Date.now().toString(),
      name: newRule.name,
      condition: newRule.condition,
      action: newRule.action,
      enabled: true
    };

    dispatch({ type: 'ADD_BEHAVIOR_RULE', payload: rule });
    setNewRule({ name: '', condition: '', action: '' });
    toast({
      title: "Rule added",
      description: `Behavior rule "${rule.name}" has been created.`,
    });
  };

  const handleEditRule = (rule: BehaviorRule) => {
    setEditingRule(rule.id);
    setEditData({
      name: rule.name,
      condition: rule.condition,
      action: rule.action
    });
  };

  const handleSaveEdit = () => {
    if (!editData.name.trim() || !editData.condition.trim() || !editData.action.trim() || !editingRule) return;

    dispatch({
      type: 'UPDATE_BEHAVIOR_RULE',
      payload: {
        id: editingRule,
        updates: editData
      }
    });

    setEditingRule(null);
    toast({
      title: "Rule updated",
      description: "Behavior rule has been successfully updated.",
    });
  };

  const handleDeleteRule = (ruleId: string, ruleName: string) => {
    dispatch({ type: 'DELETE_BEHAVIOR_RULE', payload: ruleId });
    toast({
      title: "Rule deleted",
      description: `Rule "${ruleName}" has been deleted.`,
    });
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    dispatch({
      type: 'UPDATE_BEHAVIOR_RULE',
      payload: {
        id: ruleId,
        updates: { enabled: !enabled }
      }
    });
  };

  const presetRules = [
    { name: 'Executive Summary', condition: 'document_type=summary', action: 'apply_executive_format' },
    { name: 'Remove Filler Words', condition: 'all_outputs', action: 'remove_filler_words' },
    { name: 'Strategic Framework', condition: 'topic=strategy', action: 'apply_mece_structure' },
    { name: 'Financial Precision', condition: 'topic=finance', action: 'use_precise_numbers' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Behavior Configuration</h1>
        <p className="text-muted-foreground">Define rules that govern Marvin's output formatting and behavior</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Rule</CardTitle>
          <CardDescription>Create a new behavior rule to control Marvin's responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Rule Name</label>
            <Input
              placeholder="e.g., Executive Tone"
              value={newRule.name}
              onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Condition</label>
            <Input
              placeholder="e.g., all_outputs, topic=strategy, document_type=summary"
              value={newRule.condition}
              onChange={(e) => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Action</label>
            <Textarea
              placeholder="e.g., Use executive language, avoid casual terms, structure responses with clear hierarchy"
              value={newRule.action}
              onChange={(e) => setNewRule(prev => ({ ...prev, action: e.target.value }))}
            />
          </div>
          <Button 
            onClick={handleAddRule} 
            disabled={!newRule.name.trim() || !newRule.condition.trim() || !newRule.action.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Presets</CardTitle>
          <CardDescription>Add common behavior rules with one click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presetRules.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 justify-start"
                onClick={() => setNewRule({
                  name: preset.name,
                  condition: preset.condition,
                  action: preset.action
                })}
              >
                <div className="text-left">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-muted-foreground">{preset.condition}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Rules</CardTitle>
          <CardDescription>Manage your behavior rules and their execution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.behaviorRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                {editingRule === rule.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Rule name"
                    />
                    <Input
                      value={editData.condition}
                      onChange={(e) => setEditData(prev => ({ ...prev, condition: e.target.value }))}
                      placeholder="Condition"
                    />
                    <Textarea
                      value={editData.action}
                      onChange={(e) => setEditData(prev => ({ ...prev, action: e.target.value }))}
                      placeholder="Action"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingRule(null)}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant={rule.enabled ? "default" : "secondary"}>
                          {rule.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div><strong>Condition:</strong> {rule.condition}</div>
                        <div><strong>Action:</strong> {rule.action}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleToggleRule(rule.id, rule.enabled)}
                      >
                        {rule.enabled ? (
                          <ToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditRule(rule)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteRule(rule.id, rule.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}