import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Bell, Shield, AlertTriangle } from 'lucide-react';
import { 
  FeedbackForm, 
  FeedbackSensitivity, 
  EscalationRule, 
  EscalationLevel 
} from '@/types/feedback';

interface SettingsStepProps {
  form: FeedbackForm;
  onUpdate: (updates: Partial<FeedbackForm>) => void;
  validationErrors: string[];
}

export function SettingsStep({ form, onUpdate, validationErrors }: SettingsStepProps) {
  const [newEmail, setNewEmail] = useState('');
  const [newEscalationRule, setNewEscalationRule] = useState<Partial<EscalationRule>>({
    condition: '',
    escalationLevel: 'PROJECT',
    notificationEmails: [],
    responseTime: 24
  });

  const addNotificationEmail = () => {
    if (newEmail.trim() && !form.settings.notificationEmails.includes(newEmail.trim())) {
      onUpdate({
        settings: {
          ...form.settings,
          notificationEmails: [...form.settings.notificationEmails, newEmail.trim()]
        }
      });
      setNewEmail('');
    }
  };

  const removeNotificationEmail = (email: string) => {
    onUpdate({
      settings: {
        ...form.settings,
        notificationEmails: form.settings.notificationEmails.filter(e => e !== email)
      }
    });
  };

  const addEscalationRule = () => {
    if (newEscalationRule.condition && newEscalationRule.escalationLevel) {
      const rule: EscalationRule = {
        id: `rule_${Date.now()}`,
        condition: newEscalationRule.condition,
        escalationLevel: newEscalationRule.escalationLevel,
        notificationEmails: newEscalationRule.notificationEmails || [],
        responseTime: newEscalationRule.responseTime || 24
      };

      onUpdate({
        settings: {
          ...form.settings,
          escalationRules: [...form.settings.escalationRules, rule]
        }
      });

      setNewEscalationRule({
        condition: '',
        escalationLevel: 'PROJECT',
        notificationEmails: [],
        responseTime: 24
      });
    }
  };

  const removeEscalationRule = (ruleId: string) => {
    onUpdate({
      settings: {
        ...form.settings,
        escalationRules: form.settings.escalationRules.filter(rule => rule.id !== ruleId)
      }
    });
  };

  const getSensitivityColor = (sensitivity: FeedbackSensitivity) => {
    switch (sensitivity) {
      case 'SENSITIVE':
        return 'destructive';
      case 'CONFIDENTIAL':
        return 'default';
      case 'INTERNAL':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getEscalationColor = (level: EscalationLevel) => {
    switch (level) {
      case 'EMERGENCY':
        return 'destructive';
      case 'NATIONAL':
        return 'default';
      case 'REGIONAL':
        return 'secondary';
      case 'PROJECT':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Emails *</Label>
            <p className="text-sm text-gray-600">
              Email addresses that will receive notifications when feedback is submitted
            </p>
            
            <div className="flex gap-2">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@example.com"
                type="email"
                onKeyPress={(e) => e.key === 'Enter' && addNotificationEmail()}
              />
              <Button onClick={addNotificationEmail} disabled={!newEmail.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {form.settings.notificationEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.settings.notificationEmails.map((email) => (
                  <Badge key={email} variant="outline" className="flex items-center gap-1">
                    {email}
                    <button
                      onClick={() => removeNotificationEmail(email)}
                      className="ml-1 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoAssignPriority">Auto-assign Priority</Label>
                <p className="text-sm text-gray-600">
                  Automatically assign priority based on feedback category
                </p>
              </div>
              <Switch
                id="autoAssignPriority"
                checked={form.settings.autoAssignPriority}
                onCheckedChange={(checked) => onUpdate({
                  settings: { ...form.settings, autoAssignPriority: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoEscalate">Auto-escalate</Label>
                <p className="text-sm text-gray-600">
                  Automatically escalate based on priority and rules
                </p>
              </div>
              <Switch
                id="autoEscalate"
                checked={form.settings.autoEscalate}
                onCheckedChange={(checked) => onUpdate({
                  settings: { ...form.settings, autoEscalate: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidentiality Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Confidentiality Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Confidentiality Level</Label>
            <Select
              value={form.settings.confidentialityLevel}
              onValueChange={(value: FeedbackSensitivity) => onUpdate({
                settings: { ...form.settings, confidentialityLevel: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public - Can be shared openly</SelectItem>
                <SelectItem value="INTERNAL">Internal - Project team only</SelectItem>
                <SelectItem value="CONFIDENTIAL">Confidential - Limited access</SelectItem>
                <SelectItem value="SENSITIVE">Sensitive - Admin only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              Current level: <Badge variant={getSensitivityColor(form.settings.confidentialityLevel)}>
                {form.settings.confidentialityLevel}
              </Badge>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="responseRequired">Response Required</Label>
              <p className="text-sm text-gray-600">
                Require a response to all feedback submissions
              </p>
            </div>
            <Switch
              id="responseRequired"
              checked={form.settings.responseRequired}
              onCheckedChange={(checked) => onUpdate({
                settings: { ...form.settings, responseRequired: checked }
              })}
            />
          </div>

          {form.settings.responseRequired && (
            <div className="space-y-2">
              <Label htmlFor="responseDeadline">Response Deadline (hours)</Label>
              <Input
                id="responseDeadline"
                type="number"
                value={form.settings.responseDeadline || ''}
                onChange={(e) => onUpdate({
                  settings: { 
                    ...form.settings, 
                    responseDeadline: parseInt(e.target.value) || undefined 
                  }
                })}
                placeholder="24"
                min="1"
                max="168"
              />
              <p className="text-sm text-gray-600">
                Number of hours within which a response is required
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Escalation Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Define rules for automatically escalating feedback based on priority, content, or other conditions
          </p>

          {/* Existing Rules */}
          {form.settings.escalationRules.length > 0 && (
            <div className="space-y-3">
              {form.settings.escalationRules.map((rule) => (
                <div key={rule.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getEscalationColor(rule.escalationLevel)}>
                        {rule.escalationLevel}
                      </Badge>
                      <span className="text-sm font-medium">{rule.condition}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEscalationRule(rule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600">
                    Response time: {rule.responseTime} hours
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Rule */}
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <h4 className="font-medium mb-3">Add New Escalation Rule</h4>
            <div className="space-y-3">
              <div>
                <Label>Condition</Label>
                <Input
                  value={newEscalationRule.condition}
                  onChange={(e) => setNewEscalationRule({
                    ...newEscalationRule,
                    condition: e.target.value
                  })}
                  placeholder="e.g., priority = 'CRITICAL'"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Escalation Level</Label>
                  <Select
                    value={newEscalationRule.escalationLevel}
                    onValueChange={(value: EscalationLevel) => setNewEscalationRule({
                      ...newEscalationRule,
                      escalationLevel: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROJECT">Project Level</SelectItem>
                      <SelectItem value="REGIONAL">Regional Level</SelectItem>
                      <SelectItem value="NATIONAL">National Level</SelectItem>
                      <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Response Time (hours)</Label>
                  <Input
                    type="number"
                    value={newEscalationRule.responseTime}
                    onChange={(e) => setNewEscalationRule({
                      ...newEscalationRule,
                      responseTime: parseInt(e.target.value) || 24
                    })}
                    min="1"
                    max="168"
                  />
                </div>
              </div>
              
              <Button 
                onClick={addEscalationRule}
                disabled={!newEscalationRule.condition || !newEscalationRule.escalationLevel}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Escalation Rule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800">
              <p className="font-medium mb-2">Please fix the following issues:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
