import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DateTimePicker } from '@/components/ui/date-time-picker';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Lock, 
  Users, 
  Bell, 
  Palette, 
  Calendar,
  Shield,
  Mail,
  Plus,
  X
} from 'lucide-react';
import { FormSettings } from './types';

interface SettingsStepProps {
  settings: FormSettings;
  onUpdateSettings: (settings: Partial<FormSettings>) => void;
}

export function SettingsStep({ settings, onUpdateSettings }: SettingsStepProps) {
  const addNotificationEmail = () => {
    const email = prompt('Enter email address for notifications:');
    if (email && email.includes('@')) {
      onUpdateSettings({
        notificationEmails: [...settings.notificationEmails, email]
      });
    }
  };

  const removeNotificationEmail = (emailToRemove: string) => {
    onUpdateSettings({
      notificationEmails: settings.notificationEmails.filter(email => email !== emailToRemove)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Form Settings & Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Configure how your form behaves, who can access it, and how responses are handled.
          </p>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="access" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Authentication</Label>
                    <p className="text-sm text-gray-500">Users must be logged in to access the form</p>
                  </div>
                  <Switch
                    checked={settings.requireAuthentication}
                    onCheckedChange={(checked) => onUpdateSettings({ requireAuthentication: checked })}
                  />
                </div>

                {/* Role-based Access Control - Only shown when authentication is required */}
                {settings.requireAuthentication && (
                  <div className="border rounded-lg p-4 bg-blue-50 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-blue-600" />
                      <Label className="text-base font-medium text-blue-900">User Role Access Control</Label>
                    </div>

                    {/* User Roles Selection */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Allowed User Roles</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'global-admin', label: 'Global Admin' },
                          { value: 'country-admin', label: 'Country Admin' },
                          { value: 'project-admin', label: 'Project Admin' },
                          { value: 'branch-admin', label: 'Branch Admin' },
                          { value: 'viewer', label: 'Viewer' }
                        ].map((role) => (
                          <div key={role.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role.value}`}
                              checked={settings.allowedRoles?.includes(role.value as any) || false}
                              onCheckedChange={(checked) => {
                                const currentRoles = settings.allowedRoles || [];
                                const newRoles = checked
                                  ? [...currentRoles, role.value as any]
                                  : currentRoles.filter(r => r !== role.value);
                                onUpdateSettings({ allowedRoles: newRoles });
                              }}
                            />
                            <Label htmlFor={`role-${role.value}`} className="text-sm">
                              {role.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Users must have one of the selected roles to access this form. 
                        Project, branch, and country access will be automatically determined by each user's permissions.
                      </p>
                    </div>
                  </div>
                )}

              </div>



              <div>
                <Label className="text-base">Form Expiry Date (optional)</Label>
                <DateTimePicker
                  date={settings.expiryDate}
                  onDateChange={(date) => onUpdateSettings({ expiryDate: date })}
                  placeholder="Select expiry date and time"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Form will automatically close after this date and time
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                User Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Default Behavior Features</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>✓ Progress bar is always shown</p>
                  <p>✓ Multiple responses are always allowed</p>
                  <p>✓ Save as draft is always enabled</p>
                  <p>✓ Response editing is always allowed</p>
                  <p>✓ Auto-save is always active</p>
                </div>
                <p className="text-xs text-blue-700 mt-2 italic">
                  These features are enabled by default to provide the best user experience.
                </p>
              </div>

              <div>
                <Label className="text-base">Thank You Message</Label>
                <Textarea
                  value={settings.thankYouMessage}
                  onChange={(e) => onUpdateSettings({ thankYouMessage: e.target.value })}
                  placeholder="Enter message to show after form submission..."
                  rows={3}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This message will be displayed to users after they submit the form
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base">Notification Recipients</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNotificationEmail}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Email
                  </Button>
                </div>

                {settings.notificationEmails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No notification emails configured</p>
                    <p className="text-sm text-gray-500">
                      Add email addresses to receive notifications when users submit responses
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settings.notificationEmails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{email}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotificationEmail(email)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Notification Triggers</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• New form submission</li>
                    <li>• Draft saved (if enabled)</li>
                    <li>• Response edited (if enabled)</li>
                    <li>• Form completion milestones</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base">Custom CSS (optional)</Label>
                <Textarea
                  value={settings.customCss || ''}
                  onChange={(e) => onUpdateSettings({ customCss: e.target.value || undefined })}
                  placeholder="Enter custom CSS to style your form..."
                  rows={6}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Add custom CSS to style your form. Use with caution as this can affect form functionality.
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Security & Privacy</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Data Collection</p>
                    <p className="text-xs text-gray-600 mt-1">
                      IP addresses and user agents are automatically collected for security purposes
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Data Retention</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Form responses are stored indefinitely unless manually deleted
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">GDPR Compliance</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Ensure you have proper consent for data collection if collecting personal information
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Integration Options</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default" className="text-xs">Active</Badge>
                      <p className="text-sm font-medium text-green-900">Project Activity Integration</p>
                    </div>
                    <p className="text-xs text-green-600">
                      Responses automatically update linked project activities and KPIs
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">Available</Badge>
                      <p className="text-sm font-medium text-blue-900">Real-time Analytics</p>
                    </div>
                    <p className="text-xs text-blue-600">
                      Response data is immediately available in project dashboards and reports
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">Current Settings Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Access</p>
              <p className="font-medium">
                {settings.requireAuthentication ? 'Authenticated Users' : 'Public Access'}
              </p>
              {settings.requireAuthentication && (
                <p className="text-xs text-gray-500 mt-1">
                  {settings.allowedRoles?.length || 0} roles allowed
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-600">Email Notifications</p>
              <p className="font-medium">{settings.notificationEmails.length} recipients</p>
            </div>

            <div>
              <p className="text-gray-600">Form Expiry</p>
              <p className="font-medium">{settings.expiryDate ? 'Set' : 'No expiry'}</p>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}