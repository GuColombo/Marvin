import { useState } from 'react';
import { Settings2, Folder, Bell, Shield, Palette, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export function Settings() {
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [watchFolder, setWatchFolder] = useState('/Users/Documents/Marvin-Watch');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-2 mb-2">Settings</h1>
        <p className="text-body text-muted-foreground">
          Configure Marvin's behavior and system preferences
        </p>
      </div>

      {/* File Processing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-headline flex items-center gap-2">
            <Folder className="h-5 w-5" />
            File Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-processing" className="text-callout font-medium">
                Automatic Processing
              </Label>
              <p className="text-caption-2 text-muted-foreground">
                Automatically process new files in watched folders
              </p>
            </div>
            <Switch
              id="auto-processing"
              checked={autoProcessing}
              onCheckedChange={setAutoProcessing}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="watch-folder" className="text-callout font-medium">
              Watch Folder
            </Label>
            <div className="flex gap-2">
              <Input
                id="watch-folder"
                value={watchFolder}
                onChange={(e) => setWatchFolder(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">Browse</Button>
            </div>
            <p className="text-caption-2 text-muted-foreground">
              Folder monitored for new files to process automatically
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-callout font-medium">Supported File Types</Label>
            <div className="flex flex-wrap gap-2">
              {['PDF', 'DOCX', 'TXT', 'MD', 'XLSX', 'PPTX'].map((type) => (
                <span key={type} className="px-2 py-1 bg-muted rounded text-caption-2 font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Behavior Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-headline flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            AI Behavior
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-callout font-medium">Response Style</Label>
              <Select defaultValue="balanced">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise & Direct</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="detailed">Detailed & Thorough</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-callout font-medium">Analysis Depth</Label>
              <Select defaultValue="strategic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surface">Surface Level</SelectItem>
                  <SelectItem value="strategic">Strategic Focus</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-callout font-medium">Proactivity Level</Label>
            <Select defaultValue="moderate">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reactive">Reactive Only</SelectItem>
                <SelectItem value="moderate">Moderate Suggestions</SelectItem>
                <SelectItem value="proactive">Highly Proactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-caption-2 text-muted-foreground">
              How often Marvin suggests actions or insights without being asked
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Privacy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-callout font-medium">
                  System Notifications
                </Label>
                <p className="text-caption-2 text-muted-foreground">
                  Desktop notifications for processing updates
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="error-alerts" className="text-callout font-medium">
                  Error Alerts
                </Label>
                <p className="text-caption-2 text-muted-foreground">
                  Immediate alerts for processing errors
                </p>
              </div>
              <Switch id="error-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-caption-1 font-medium">Offline Operation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-caption-1 font-medium">Local Data Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-caption-1 font-medium">Encrypted Memory</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>


      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}