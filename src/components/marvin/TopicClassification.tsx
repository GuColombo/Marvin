import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMarvin, Topic } from '@/contexts/MarvinContext';
import { useToast } from '@/hooks/use-toast';

export function TopicClassification() {
  const { state, dispatch } = useErika();
  const { toast } = useToast();
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({ name: '', keywords: '' });
  const [editData, setEditData] = useState({ name: '', keywords: '' });

  const handleAddTopic = () => {
    if (!newTopic.name.trim()) return;

    const topic: Topic = {
      id: Date.now().toString(),
      name: newTopic.name,
      keywords: newTopic.keywords.split(',').map(k => k.trim()).filter(k => k),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };

    dispatch({ type: 'ADD_TOPIC', payload: topic });
    setNewTopic({ name: '', keywords: '' });
    toast({
      title: "Topic added",
      description: `Topic "${topic.name}" has been created.`,
    });
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic.id);
    setEditData({
      name: topic.name,
      keywords: topic.keywords.join(', ')
    });
  };

  const handleSaveEdit = () => {
    if (!editData.name.trim() || !editingTopic) return;

    dispatch({
      type: 'UPDATE_TOPIC',
      payload: {
        id: editingTopic,
        updates: {
          name: editData.name,
          keywords: editData.keywords.split(',').map(k => k.trim()).filter(k => k)
        }
      }
    });

    setEditingTopic(null);
    toast({
      title: "Topic updated",
      description: "Topic has been successfully updated.",
    });
  };

  const handleDeleteTopic = (topicId: string, topicName: string) => {
    if (topicName === 'General') {
      toast({
        title: "Cannot delete",
        description: "The General topic cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: 'DELETE_TOPIC', payload: topicId });
    toast({
      title: "Topic deleted",
      description: `Topic "${topicName}" has been deleted.`,
    });
  };

  const getTopicStats = (topicName: string) => {
    return state.files.filter(file => file.topics.includes(topicName)).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Topic Classification</h1>
        <p className="text-muted-foreground">Manage topics and keywords for automatic file classification</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Topic</CardTitle>
          <CardDescription>Create a new topic with associated keywords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Topic Name</label>
              <Input
                placeholder="e.g., Strategy"
                value={newTopic.name}
                onChange={(e) => setNewTopic(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Keywords (comma-separated)</label>
              <Input
                placeholder="e.g., strategic, plan, vision, goals"
                value={newTopic.keywords}
                onChange={(e) => setNewTopic(prev => ({ ...prev, keywords: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
              />
            </div>
          </div>
          <Button onClick={handleAddTopic} disabled={!newTopic.name.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Topic
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Topics</CardTitle>
          <CardDescription>Manage your topic library and classification rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.topics.map((topic) => (
              <div key={topic.id} className="border rounded-lg p-4">
                {editingTopic === topic.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Topic name"
                      />
                      <Input
                        value={editData.keywords}
                        onChange={(e) => setEditData(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="Keywords (comma-separated)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingTopic(null)}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{topic.name}</h3>
                        <Badge variant="secondary">{getTopicStats(topic.name)} files</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {topic.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {topic.keywords.length === 0 && (
                          <span className="text-sm text-muted-foreground">No keywords defined</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditTopic(topic)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteTopic(topic.id, topic.name)}
                        disabled={topic.name === 'General'}
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