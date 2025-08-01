import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Link, 
  QrCode, 
  Share2, 
  Copy, 
  Download, 
  Mail,
  Smartphone,
  Monitor,
  Eye,
  Settings,
  BarChart3,
  Users
} from 'lucide-react';
import { Form } from '../types';
import { FormPreview } from '../../form-preview/FormPreview';
import { toast } from '@/hooks/use-toast';

interface FormDeploymentProps {
  form: Form;
  onUpdateForm: (updates: Partial<Form>) => void;
}

export function FormDeployment({ form, onUpdateForm }: FormDeploymentProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  // Generate form URL (this would be your actual domain)
  const formUrl = `https://forms.yourorganization.org/f/${form.id}`;
  const previewUrl = `/dashboard/projects/${form.projectId}/forms/preview/${form.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formUrl)}`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Please fill out: ${form.title}`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease fill out this form: ${form.title}\n\n${form.description || ''}\n\nForm link: ${formUrl}\n\nThank you!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const EmbedCode = () => {
    const embedCode = `<iframe src="${formUrl}?embed=true" width="100%" height="600" frameborder="0"></iframe>`;
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Embed Code</Label>
          <div className="relative">
            <Input
              value={embedCode}
              readOnly
              className="font-mono text-sm pr-20"
            />
            <Button
              size="sm"
              variant="outline"
              className="absolute right-1 top-1"
              onClick={() => copyToClipboard(embedCode, "Embed code")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Copy this code to embed the form in your website or application
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Form Status and Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Form Deployment
            </div>
            <Badge variant={form.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {form.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{form.responseCount || 0}</p>
                <p className="text-sm text-gray-600">Total Responses</p>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {form.lastResponseAt ? new Date(form.lastResponseAt).toLocaleDateString() : 'None'}
                </p>
                <p className="text-sm text-gray-600">Last Response</p>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  v{form.version || 1}
                </p>
                <p className="text-sm text-gray-600">Form Version</p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Options */}
      <Tabs defaultValue="share" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="embed">Embed</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Share Tab */}
        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Your Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Direct Link */}
              <div>
                <Label>Direct Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={formUrl}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(formUrl, "Form URL")}
                  >
                    {copiedUrl ? 'Copied!' : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={shareViaEmail}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(formUrl, "Form URL")}
                  className="flex items-center gap-2"
                >
                  <Link className="w-4 h-4" />
                  Copy Link
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embed Tab */}
        <TabsContent value="embed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Embed in Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmbedCode />
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Code Tab */}
        <TabsContent value="qr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code for form" 
                    className="mx-auto border rounded"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Scan this QR code with a mobile device to access the form
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrCodeUrl;
                      link.download = `${form.title}-qr-code.png`;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(formUrl, "Form URL")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Deployment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Access</Label>
                    <p className="text-xs text-gray-500">Allow anyone with the link to access the form</p>
                  </div>
                  <Switch 
                    checked={!form.settings?.requireAuthentication}
                    onCheckedChange={(checked) => 
                      onUpdateForm({
                        settings: {
                          ...form.settings!,
                          requireAuthentication: !checked
                        }
                      })
                    }
                  />
                </div>

                {/* Role-based Access Control Display */}
                {form.settings?.requireAuthentication && (
                  <div className="border rounded-lg p-3 bg-amber-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600" />
                      <Label className="text-sm font-medium text-amber-900">Access Control Active</Label>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium">Allowed Roles: </span>
                        <span>{form.settings?.allowedRoles?.map(role => 
                          role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                        ).join(', ') || 'All roles'}</span>
                      </div>
                      
                      <div className="text-amber-700">
                        Project, branch, and country access will be automatically determined by each user's permissions.
                      </div>
                    </div>
                    
                    <p className="text-xs text-amber-700 italic">
                      Access control settings can be modified in the form settings step.
                    </p>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Responsive Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(previewUrl, '_blank')}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Open Full Preview
            </Button>
          </div>
          
          <div className="border rounded-lg bg-white max-h-[500px] overflow-y-auto">
            {form.sections && form.sections.length > 0 ? (
              <div className="p-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-gray-600">
                      {form.description}
                    </p>
                  )}
                </div>
                
                {/* Show first few questions as preview */}
                <div className="space-y-6">
                  {form.sections.slice(0, 1).map(section => (
                    section.questions.slice(0, 3).map(question => (
                      <div key={question.id} className="space-y-2">
                        <Label className="text-sm font-medium">
                          {question.title}
                          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {question.description && (
                          <p className="text-xs text-gray-500">{question.description}</p>
                        )}
                        <div className="text-sm text-gray-400">
                          [{question.type.replace('_', ' ').toLowerCase()} question preview]
                        </div>
                      </div>
                    ))
                  ))}
                  
                  {form.sections.length > 1 || form.sections[0]?.questions.length > 3 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      ... and {(form.sections.reduce((total, s) => total + s.questions.length, 0)) - 3} more questions
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No questions have been added to this form yet.</p>
                <p className="text-sm mt-2">Add sections and questions to see the preview.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}