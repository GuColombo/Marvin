import { useState, useEffect } from 'react';
import { Upload, Palette, Image, Type, Save, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BrandAssets, DocumentTemplate } from '@/lib/templateManager';
import { templateManager } from '@/lib/templateManager';
import { useToast } from '@/hooks/use-toast';

export function TemplatesBranding() {
  const [branding, setBranding] = useState<BrandAssets>(templateManager.getBrandAssets());
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Partial<DocumentTemplate>>({});
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const allTemplates = templateManager.getTemplates();
    setTemplates(allTemplates);
  };

  const handleBrandingChange = (field: keyof BrandAssets, value: any) => {
    const updated = { ...branding, [field]: value };
    setBranding(updated);
  };

  const saveBranding = () => {
    templateManager.setBrandAssets(branding);
    toast({
      title: 'Branding Saved',
      description: 'Brand assets have been updated successfully'
    });
  };

  const handleFileUpload = (field: 'logo' | 'watermark', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleBrandingChange(field, result);
      
      if (field === 'logo') {
        setLogoPreview(result);
      } else {
        setWatermarkPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const createTemplate = () => {
    if (!editingTemplate.name || !editingTemplate.type) {
      toast({
        title: 'Validation Error',
        description: 'Template name and type are required',
        variant: 'destructive'
      });
      return;
    }

    const newTemplate = templateManager.addTemplate({
      name: editingTemplate.name,
      type: editingTemplate.type as DocumentTemplate['type'],
      category: editingTemplate.category as DocumentTemplate['category'] || 'custom',
      description: editingTemplate.description || '',
      frameworkIds: editingTemplate.frameworkIds || [],
      tokens: editingTemplate.tokens || []
    });

    setTemplates([...templates, newTemplate]);
    setEditingTemplate({});
    setShowTemplateDialog(false);
    
    toast({
      title: 'Template Created',
      description: `${newTemplate.name} has been created`
    });
  };

  const deleteTemplate = (templateId: string) => {
    if (templateManager.deleteTemplate(templateId)) {
      setTemplates(templates.filter(t => t.id !== templateId));
      toast({
        title: 'Template Deleted',
        description: 'Template has been removed'
      });
    }
  };

  const previewTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
  };

  const availableTokens = templateManager.getAvailableTokens();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Templates & Branding</h3>
          <p className="text-muted-foreground">
            Manage brand assets and document templates for professional deliverables
          </p>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">Brand Assets</TabsTrigger>
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Visual Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Logo</Label>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </label>
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('logo', file);
                      }}
                    />
                  </div>
                  {(logoPreview || branding.logo) && (
                    <div className="mt-2 p-2 border rounded">
                      <img 
                        src={logoPreview || (branding.logo as string)} 
                        alt="Logo preview" 
                        className="max-h-20 object-contain"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Watermark</Label>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="watermark-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Watermark
                      </label>
                    </Button>
                    <input
                      id="watermark-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('watermark', file);
                      }}
                    />
                  </div>
                  {(watermarkPreview || branding.watermark) && (
                    <div className="mt-2 p-2 border rounded">
                      <img 
                        src={watermarkPreview || (branding.watermark as string)} 
                        alt="Watermark preview" 
                        className="max-h-20 object-contain opacity-50"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="color"
                        value={branding.colors.primary}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          primary: e.target.value
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.colors.primary}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          primary: e.target.value
                        })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="color"
                        value={branding.colors.secondary}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          secondary: e.target.value
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.colors.secondary}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          secondary: e.target.value
                        })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Accent Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="color"
                        value={branding.colors.accent}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          accent: e.target.value
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.colors.accent}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          accent: e.target.value
                        })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="color"
                        value={branding.colors.background}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          background: e.target.value
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.colors.background}
                        onChange={(e) => handleBrandingChange('colors', {
                          ...branding.colors,
                          background: e.target.value
                        })}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Heading Font</Label>
                  <Select
                    value={branding.fonts.heading}
                    onValueChange={(value) => handleBrandingChange('fonts', {
                      ...branding.fonts,
                      heading: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Calibri">Calibri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Body Font</Label>
                  <Select
                    value={branding.fonts.body}
                    onValueChange={(value) => handleBrandingChange('fonts', {
                      ...branding.fonts,
                      body: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Calibri">Calibri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded" style={{ 
                  backgroundColor: branding.colors.background,
                  color: branding.colors.text 
                }}>
                  <h3 
                    className="text-xl font-bold mb-2" 
                    style={{ 
                      color: branding.colors.primary,
                      fontFamily: branding.fonts.heading 
                    }}
                  >
                    Sample Heading
                  </h3>
                  <p 
                    className="mb-3" 
                    style={{ fontFamily: branding.fonts.body }}
                  >
                    This is a preview of how your branding will appear in generated documents.
                  </p>
                  <div 
                    className="inline-block px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: branding.colors.accent }}
                  >
                    Accent Element
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveBranding}>
              <Save className="h-4 w-4 mr-2" />
              Save Brand Assets
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Document Templates</h4>
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Design a custom document template with your branding
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Template Name</Label>
                    <Input
                      value={editingTemplate.name || ''}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select 
                      value={editingTemplate.type || ''} 
                      onValueChange={(value: any) => setEditingTemplate({ ...editingTemplate, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="word">Word Document</SelectItem>
                        <SelectItem value="powerpoint">PowerPoint Presentation</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select 
                      value={editingTemplate.category || ''} 
                      onValueChange={(value: any) => setEditingTemplate({ ...editingTemplate, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingTemplate.description || ''}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                      placeholder="Describe the template purpose"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createTemplate}>Create Template</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge variant="secondary">{template.category}</Badge>
                        {template.isBuiltIn && <Badge>Built-in</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <div className="flex gap-2">
                        {template.tokens.slice(0, 3).map((token) => (
                          <Badge key={token} variant="outline" className="text-xs">
                            {token}
                          </Badge>
                        ))}
                        {template.tokens.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tokens.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => previewTemplate(template)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!template.isBuiltIn && (
                        <Button size="sm" variant="outline" onClick={() => deleteTemplate(template.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name} Preview</DialogTitle>
              <DialogDescription>
                Template structure and available tokens
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Available Tokens:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTemplate.tokens.map((token) => (
                      <div key={token} className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{token}</code>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Compatible Frameworks:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedTemplate.frameworkIds.map((fwId) => (
                      <Badge key={fwId} variant="outline">{fwId}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}