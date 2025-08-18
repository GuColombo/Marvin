import { useState, useEffect } from 'react';
import { 
  Settings2, 
  Folder, 
  Bell, 
  Shield, 
  Mail, 
  Video, 
  Plus, 
  Trash2, 
  FolderOpen,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiAdapter } from '@/lib/apiAdapter';
import { SystemConfig, WatchPath } from '@/lib/types';

export function Settings() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const systemConfig = await apiAdapter.getSystemConfig();
      setConfig(systemConfig);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      await apiAdapter.updateSystemConfig({
        ...config,
        lastUpdated: new Date()
      });
      toast({
        title: "Settings Saved",
        description: "Configuration has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addWatchPath = () => {
    if (!config) return;
    
    const newPath: WatchPath = {
      id: `path-${Date.now()}`,
      path: '',
      type: 'files',
      enabled: true,
      autoProcess: true,
      supportedFormats: ['pdf', 'docx', 'txt', 'md'],
      status: 'inactive'
    };
    
    setConfig({
      ...config,
      watchPaths: [...config.watchPaths, newPath]
    });
  };

  const removeWatchPath = (id: string) => {
    if (!config) return;
    
    setConfig({
      ...config,
      watchPaths: config.watchPaths.filter(path => path.id !== id)
    });
  };

  const updateWatchPath = (id: string, updates: Partial<WatchPath>) => {
    if (!config) return;
    
    setConfig({
      ...config,
      watchPaths: config.watchPaths.map(path => 
        path.id === id ? { ...path, ...updates } : path
      )
    });
  };

  const resetToDefaults = () => {
    // Reset to default configuration
    loadConfig();
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults"
    });
  };

  const getStatusIcon = (status: 'active' | 'error' | 'inactive') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getConnectionStatusBadge = (status: 'connected' | 'disconnected' | 'error') => {
    const variants = {
      connected: 'default',
      disconnected: 'secondary', 
      error: 'destructive'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading || !config) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-title-2 mb-2">Settings</h1>
          <p className="text-body text-muted-foreground">
            Loading configuration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-2 mb-2">Settings</h1>
          <p className="text-body text-muted-foreground">
            Configure Marvin's behavior and system preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="processing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="emails">Email</TabsTrigger>
          <TabsTrigger value="ai">AI Behavior</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* File Processing Tab */}
        <TabsContent value="processing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Watch Paths Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-callout font-medium">Watch Paths</Label>
                  <p className="text-caption-2 text-muted-foreground">
                    Folders monitored for new files and content
                  </p>
                </div>
                <Button onClick={addWatchPath} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Path
                </Button>
              </div>

              <div className="space-y-4">
                {config.watchPaths.map((path) => (
                  <Card key={path.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(path.status)}
                          <Badge variant={path.type === 'files' ? 'default' : 'secondary'}>
                            {path.type}
                          </Badge>
                          <span className="text-sm font-medium">{path.path || 'New Path'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={path.enabled}
                            onCheckedChange={(enabled) => updateWatchPath(path.id, { enabled })}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWatchPath(path.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Path</Label>
                          <div className="flex gap-2">
                            <Input
                              value={path.path}
                              onChange={(e) => updateWatchPath(path.id, { path: e.target.value })}
                              placeholder="/path/to/folder"
                            />
                            <Button variant="outline" size="sm">
                              <FolderOpen className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={path.type}
                            onValueChange={(type: 'files' | 'meetings') => 
                              updateWatchPath(path.id, { type })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="files">Files & Documents</SelectItem>
                              <SelectItem value="meetings">Meeting Recordings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={path.autoProcess}
                              onCheckedChange={(autoProcess) => 
                                updateWatchPath(path.id, { autoProcess })
                              }
                            />
                            <Label>Auto-process new files</Label>
                          </div>
                        </div>
                        {path.lastScanned && (
                          <span className="text-caption-2 text-muted-foreground">
                            Last scanned: {path.lastScanned.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Supported Formats</Label>
                        <div className="flex flex-wrap gap-2">
                          {path.supportedFormats.map((format) => (
                            <span
                              key={format}
                              className="px-2 py-1 bg-muted rounded text-caption-2 font-medium"
                            >
                              {format.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {path.errorMessage && (
                        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-caption-2 text-destructive">
                          {path.errorMessage}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline flex items-center gap-2">
                <Video className="h-5 w-5" />
                Meeting & Recording Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Auto Transcription</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Automatically transcribe meeting recordings
                    </p>
                  </div>
                  <Switch
                    checked={config.meetingConfig.autoTranscription}
                    onCheckedChange={(autoTranscription) =>
                      setConfig({
                        ...config,
                        meetingConfig: { ...config.meetingConfig, autoTranscription }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Process Recordings</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Extract insights from meeting recordings
                    </p>
                  </div>
                  <Switch
                    checked={config.meetingConfig.processRecordings}
                    onCheckedChange={(processRecordings) =>
                      setConfig({
                        ...config,
                        meetingConfig: { ...config.meetingConfig, processRecordings }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Extract Actions</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Automatically identify action items
                    </p>
                  </div>
                  <Switch
                    checked={config.meetingConfig.extractActions}
                    onCheckedChange={(extractActions) =>
                      setConfig({
                        ...config,
                        meetingConfig: { ...config.meetingConfig, extractActions }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Calendar Sync</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Sync with calendar for meeting context
                    </p>
                  </div>
                  <Switch
                    checked={config.meetingConfig.calendarSync}
                    onCheckedChange={(calendarSync) =>
                      setConfig({
                        ...config,
                        meetingConfig: { ...config.meetingConfig, calendarSync }
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Supported Recording Formats</Label>
                <div className="flex flex-wrap gap-2">
                  {config.meetingConfig.supportedFormats.map((format) => (
                    <span
                      key={format}
                      className="px-2 py-1 bg-muted rounded text-caption-2 font-medium"
                    >
                      {format.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {config.meetingConfig.calendarSync && (
                <div className="space-y-2">
                  <Label>Calendar Provider</Label>
                  <Select
                    value={config.meetingConfig.calendarProvider || 'outlook'}
                    onValueChange={(calendarProvider: 'outlook' | 'google') =>
                      setConfig({
                        ...config,
                        meetingConfig: { ...config.meetingConfig, calendarProvider }
                      })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                      <SelectItem value="google">Google Calendar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="emails" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-callout font-medium">Email Processing</Label>
                  <p className="text-caption-2 text-muted-foreground">
                    Enable email analysis and insights
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getConnectionStatusBadge(config.emailConfig.connectionStatus)}
                  <Switch
                    checked={config.emailConfig.enabled}
                    onCheckedChange={(enabled) =>
                      setConfig({
                        ...config,
                        emailConfig: { ...config.emailConfig, enabled }
                      })
                    }
                  />
                </div>
              </div>

              {config.emailConfig.enabled && (
                <>
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Email Provider</Label>
                      <Select
                        value={config.emailConfig.provider}
                        onValueChange={(provider: 'outlook' | 'gmail' | 'custom') =>
                          setConfig({
                            ...config,
                            emailConfig: { ...config.emailConfig, provider }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="custom">Custom IMAP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Sync Frequency (minutes)</Label>
                      <Select
                        value={config.emailConfig.syncFrequency.toString()}
                        onValueChange={(value) =>
                          setConfig({
                            ...config,
                            emailConfig: { 
                              ...config.emailConfig, 
                              syncFrequency: parseInt(value) 
                            }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Monitored Folders</Label>
                    <div className="flex flex-wrap gap-2">
                      {config.emailConfig.folders.map((folder) => (
                        <span
                          key={folder}
                          className="px-2 py-1 bg-muted rounded text-caption-2 font-medium"
                        >
                          {folder}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Test Connection
                    </Button>
                    <Button variant="outline" size="sm">
                      Configure Access
                    </Button>
                  </div>

                  {config.emailConfig.lastSync && (
                    <p className="text-caption-2 text-muted-foreground">
                      Last sync: {config.emailConfig.lastSync.toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Behavior Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                AI Behavior Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Response Style</Label>
                  <Select
                    value={config.aiBehaviorConfig.responseStyle}
                    onValueChange={(responseStyle: 'concise' | 'balanced' | 'detailed') =>
                      setConfig({
                        ...config,
                        aiBehaviorConfig: { ...config.aiBehaviorConfig, responseStyle }
                      })
                    }
                  >
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
                  <Label>Analysis Depth</Label>
                  <Select
                    value={config.aiBehaviorConfig.analysisDepth}
                    onValueChange={(analysisDepth: 'surface' | 'strategic' | 'comprehensive') =>
                      setConfig({
                        ...config,
                        aiBehaviorConfig: { ...config.aiBehaviorConfig, analysisDepth }
                      })
                    }
                  >
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

                <div className="space-y-2">
                  <Label>Proactivity Level</Label>
                  <Select
                    value={config.aiBehaviorConfig.proactivityLevel}
                    onValueChange={(proactivityLevel: 'reactive' | 'moderate' | 'proactive') =>
                      setConfig({
                        ...config,
                        aiBehaviorConfig: { ...config.aiBehaviorConfig, proactivityLevel }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reactive">Reactive Only</SelectItem>
                      <SelectItem value="moderate">Moderate Suggestions</SelectItem>
                      <SelectItem value="proactive">Highly Proactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Confidence Threshold</Label>
                  <Select
                    value={config.aiBehaviorConfig.confidenceThreshold.toString()}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        aiBehaviorConfig: { 
                          ...config.aiBehaviorConfig, 
                          confidenceThreshold: parseFloat(value) 
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.6">60% - Lower threshold</SelectItem>
                      <SelectItem value="0.8">80% - Balanced</SelectItem>
                      <SelectItem value="0.9">90% - High confidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-callout font-medium">Proactive Suggestions</Label>
                  <p className="text-caption-2 text-muted-foreground">
                    Enable AI to make proactive suggestions and insights
                  </p>
                </div>
                <Switch
                  checked={config.aiBehaviorConfig.suggestionsEnabled}
                  onCheckedChange={(suggestionsEnabled) =>
                    setConfig({
                      ...config,
                      aiBehaviorConfig: { ...config.aiBehaviorConfig, suggestionsEnabled }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">System Notifications</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Desktop notifications for system events
                    </p>
                  </div>
                  <Switch
                    checked={config.notificationConfig.systemNotifications}
                    onCheckedChange={(systemNotifications) =>
                      setConfig({
                        ...config,
                        notificationConfig: { ...config.notificationConfig, systemNotifications }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Error Alerts</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Immediate alerts for processing errors
                    </p>
                  </div>
                  <Switch
                    checked={config.notificationConfig.errorAlerts}
                    onCheckedChange={(errorAlerts) =>
                      setConfig({
                        ...config,
                        notificationConfig: { ...config.notificationConfig, errorAlerts }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Processing Updates</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Notifications when files are processed
                    </p>
                  </div>
                  <Switch
                    checked={config.notificationConfig.processingUpdates}
                    onCheckedChange={(processingUpdates) =>
                      setConfig({
                        ...config,
                        notificationConfig: { ...config.notificationConfig, processingUpdates }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Email Digest</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Regular summary emails of activity
                    </p>
                  </div>
                  <Switch
                    checked={config.notificationConfig.emailDigest}
                    onCheckedChange={(emailDigest) =>
                      setConfig({
                        ...config,
                        notificationConfig: { ...config.notificationConfig, emailDigest }
                      })
                    }
                  />
                </div>
              </div>

              {config.notificationConfig.emailDigest && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Digest Frequency</Label>
                    <Select
                      value={config.notificationConfig.digestFrequency}
                      onValueChange={(digestFrequency: 'daily' | 'weekly' | 'monthly') =>
                        setConfig({
                          ...config,
                          notificationConfig: { ...config.notificationConfig, digestFrequency }
                        })
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-headline flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Local Encryption</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Encrypt data stored locally on device
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <Switch
                      checked={config.privacyConfig.encryptLocal}
                      onCheckedChange={(encryptLocal) =>
                        setConfig({
                          ...config,
                          privacyConfig: { ...config.privacyConfig, encryptLocal }
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Auto Backup</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Automatically backup configuration and data
                    </p>
                  </div>
                  <Switch
                    checked={config.privacyConfig.autoBackup}
                    onCheckedChange={(autoBackup) =>
                      setConfig({
                        ...config,
                        privacyConfig: { ...config.privacyConfig, autoBackup }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-callout font-medium">Usage Telemetry</Label>
                    <p className="text-caption-2 text-muted-foreground">
                      Share anonymous usage data to improve Marvin
                    </p>
                  </div>
                  <Switch
                    checked={config.privacyConfig.allowTelemetry}
                    onCheckedChange={(allowTelemetry) =>
                      setConfig({
                        ...config,
                        privacyConfig: { ...config.privacyConfig, allowTelemetry }
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Select
                    value={config.privacyConfig.dataRetention.toString()}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        privacyConfig: { 
                          ...config.privacyConfig, 
                          dataRetention: parseInt(value) 
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="0">Never delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.privacyConfig.autoBackup && config.privacyConfig.backupLocation && (
                  <div className="space-y-2">
                    <Label>Backup Location</Label>
                    <div className="flex gap-2">
                      <Input
                        value={config.privacyConfig.backupLocation}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            privacyConfig: { 
                              ...config.privacyConfig, 
                              backupLocation: e.target.value 
                            }
                          })
                        }
                        placeholder="/path/to/backup/folder"
                      />
                      <Button variant="outline" size="sm">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-caption-1 font-medium">Offline Operation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-caption-1 font-medium">Local Data Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-caption-1 font-medium">End-to-End Encryption</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Backup
                </Button>
                <Button variant="destructive" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Actions */}
      <div className="flex justify-between items-center pt-6">
        <div className="text-caption-2 text-muted-foreground">
          Last updated: {config.lastUpdated.toLocaleString()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveConfig} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}