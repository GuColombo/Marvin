import { useState } from 'react';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useErika } from '@/contexts/ErikaContext';

export function QueryInterface() {
  const { state } = useErika();
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [results, setResults] = useState(state.files);

  const handleSearch = () => {
    let filtered = state.files;

    // Filter by query
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      filtered = filtered.filter(file => 
        searchTerms.some(term => 
          file.name.toLowerCase().includes(term) ||
          file.content.toLowerCase().includes(term) ||
          file.topics.some(topic => topic.toLowerCase().includes(term))
        )
      );
    }

    // Filter by topic
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(file => file.topics.includes(selectedTopic));
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (dateFilter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(file => new Date(file.timestamp) >= cutoff);
    }

    setResults(filtered);
  };

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    
    const terms = searchQuery.toLowerCase().split(' ');
    let highlighted = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });
    
    return highlighted;
  };

  const getPreviewText = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Query Interface</h1>
        <p className="text-muted-foreground">Search and filter through processed files</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific content across your processed files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search content, filenames, or topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {state.topics.map(topic => (
                    <SelectItem key={topic.id} value={topic.name}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={() => {
              setQuery('');
              setSelectedTopic('all');
              setDateFilter('all');
              setResults(state.files);
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results ({results.length})</CardTitle>
          <CardDescription>
            {query && `Search results for "${query}"`}
            {selectedTopic !== 'all' && ` in ${selectedTopic}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {state.files.length === 0 ? 'No files processed yet' : 'No results found'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 
                        className="font-medium mb-1"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(file.name, query) 
                        }}
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{new Date(file.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>{file.type}</span>
                        <span>•</span>
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {file.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div 
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(getPreviewText(file.content), query) 
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Query Statistics</CardTitle>
          <CardDescription>Overview of your content library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{state.files.length}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{state.topics.length}</div>
              <div className="text-sm text-muted-foreground">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {state.files.reduce((acc, file) => acc + file.content.split(' ').length, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(state.files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(1)}MB
              </div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}