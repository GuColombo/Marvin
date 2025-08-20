import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCcw, Eye, Calendar, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiAdapter } from '@/lib/apiAdapter';
import { useToast } from '@/hooks/use-toast';
import { DigestView } from './DigestView';
import { MindmapView } from './MindmapView';

interface SearchFilters {
  type: string[];
  dateRange: string;
  tags: string[];
}

export function Knowledgebase() {
  const [activeTab, setActiveTab] = useState('search');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    dateRange: 'all',
    tags: []
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await apiAdapter.kbSearch({ 
        query,
        filters: {}
      });
      setSearchResults(results.results);
    } catch (error) {
      toast({
        title: 'Search Error',
        description: 'Failed to search knowledge base',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReindex = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select items to re-index',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await apiAdapter.reindexSelection(selectedItems);
      toast({
        title: 'Success',
        description: `${result.status} - ${result.pathsProcessed} paths processed`,
        variant: 'default'
      });
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: 'Reindex Error',
        description: 'Failed to re-index selected items',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const availableTypes = ['meeting', 'file', 'email', 'note'];
  const availableTags = ['strategy', 'finance', 'operations', 'urgent', 'review'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Search, explore, and visualize your organizational knowledge
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Knowledge Explorer
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <Badge variant="secondary">
                  {selectedItems.length} selected
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleReindex}
                disabled={loading || selectedItems.length === 0}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Re-index Selection
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search knowledge base..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={filters.type[0] || 'all'} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, type: value === 'all' ? [] : [value] }))
              }>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {availableTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.dateRange} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, dateRange: value }))
              }>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="quarter">This quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="digest">Digest</TabsTrigger>
          <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.title}</h4>
                           <Badge variant="outline">
                             {item.source}
                           </Badge>
                           <Badge variant="secondary">
                             Score: {(item.score * 100).toFixed(0)}%
                           </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.snippet}
                        </p>
                         <div className="flex items-center gap-4 text-xs text-muted-foreground">
                           <div className="flex items-center gap-1">
                             <Calendar className="h-3 w-3" />
                             Source: {item.source}
                           </div>
                         </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{item.title}</DialogTitle>
                             <DialogDescription>
                               {item.source} • Score: {(item.score * 100).toFixed(0)}%
                             </DialogDescription>
                           </DialogHeader>
                           <ScrollArea className="max-h-96">
                             <div className="space-y-4">
                               <p>{item.snippet}</p>
                             </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No results found</h3>
                  <p className="text-sm">
                    {query ? 'Try adjusting your search terms or filters' : 'Enter a search query to find knowledge items'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="digest">
          <DigestView />
        </TabsContent>

        <TabsContent value="mindmap">
          <MindmapView />
        </TabsContent>
      </Tabs>
    </div>
  );
}