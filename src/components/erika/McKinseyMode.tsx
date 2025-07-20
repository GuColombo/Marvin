import { useState } from 'react';
import { TrendingUp, FileText, Download, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function McKinseyMode() {
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const frameworks = [
    { id: 'swot', name: 'SWOT Analysis', description: 'Strengths, Weaknesses, Opportunities, Threats' },
    { id: 'bcg', name: 'BCG Matrix', description: 'Portfolio planning and strategic analysis' },
    { id: '7s', name: 'McKinsey 7S', description: 'Strategy, Structure, Systems, Skills, Style, Staff, Shared Values' },
    { id: 'rapid', name: 'RAPID Decision', description: 'Recommend, Agree, Perform, Input, Decide' },
    { id: 'pestle', name: 'PESTLE Analysis', description: 'Political, Economic, Social, Technological, Legal, Environmental' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">McKinsey Mode</h1>
        <p className="text-body text-muted-foreground">
          Apply strategic frameworks to your data for executive-level analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-headline">Configure Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-callout font-medium mb-2 block">Framework</label>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategic framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework.id} value={framework.id}>
                      <div>
                        <div className="font-medium">{framework.name}</div>
                        <div className="text-caption-2 text-muted-foreground">{framework.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedFramework && (
              <div className="space-y-4">
                <Button className="w-full" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Run Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-headline">Available Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {frameworks.map((framework) => (
                <div key={framework.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h3 className="text-callout font-medium">{framework.name}</h3>
                  <p className="text-caption-2 text-muted-foreground">{framework.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}