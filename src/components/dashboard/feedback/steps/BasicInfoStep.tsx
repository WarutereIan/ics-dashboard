import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FeedbackForm, 
  FeedbackCategory, 
  DEFAULT_FEEDBACK_CATEGORIES 
} from '@/types/feedback';

interface BasicInfoStepProps {
  form: FeedbackForm;
  onUpdate: (updates: Partial<FeedbackForm>) => void;
  validationErrors: string[];
}

export function BasicInfoStep({ form, onUpdate, validationErrors }: BasicInfoStepProps) {
  const handleCategorySelect = (category: FeedbackCategory) => {
    onUpdate({ 
      category,
      settings: {
        ...form.settings,
        confidentialityLevel: category.defaultSensitivity
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Form Title *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g., Community Safety Incident Report"
          className={validationErrors.some(e => e.includes('title')) ? 'border-red-500' : ''}
        />
        <p className="text-sm text-gray-600">
          Choose a clear, descriptive title that stakeholders will understand
        </p>
      </div>

      {/* Form Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Form Description *</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe what this feedback form is for and when it should be used..."
          rows={4}
          className={validationErrors.some(e => e.includes('description')) ? 'border-red-500' : ''}
        />
        <p className="text-sm text-gray-600">
          Provide context about when and how this form should be used
        </p>
      </div>

      {/* Feedback Category Selection */}
      <div className="space-y-4">
        <div>
          <Label>Feedback Category *</Label>
          <p className="text-sm text-gray-600 mb-4">
            Select the type of feedback this form will collect. This determines default settings for priority, sensitivity, and escalation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_FEEDBACK_CATEGORIES.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all ${
                form.category?.id === category.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="flex gap-1">
                    <Badge 
                      variant={category.defaultPriority === 'CRITICAL' ? 'destructive' : 
                              category.defaultPriority === 'HIGH' ? 'destructive' :
                              category.defaultPriority === 'MEDIUM' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {category.defaultPriority}
                    </Badge>
                    <Badge 
                      variant={category.defaultSensitivity === 'SENSITIVE' ? 'destructive' :
                              category.defaultSensitivity === 'CONFIDENTIAL' ? 'default' :
                              category.defaultSensitivity === 'INTERNAL' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {category.defaultSensitivity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Escalation:</span>
                    <span className="font-medium">{category.escalationLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Immediate Notification:</span>
                    <span className={category.requiresImmediateNotification ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {category.requiresImmediateNotification ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Allowed Stakeholders:</span>
                    <span className="text-gray-600">{category.allowedStakeholders.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Basic Settings */}
      <div className="space-y-4">
        <Label>Basic Settings</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowAnonymous">Allow Anonymous Submissions</Label>
              <p className="text-sm text-gray-600">
                Stakeholders can submit feedback without providing their identity
              </p>
            </div>
            <Switch
              id="allowAnonymous"
              checked={form.allowAnonymous}
              onCheckedChange={(checked) => onUpdate({ allowAnonymous: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requireAuthentication">Require Authentication</Label>
              <p className="text-sm text-gray-600">
                Stakeholders must be logged in to submit feedback
              </p>
            </div>
            <Switch
              id="requireAuthentication"
              checked={form.requireAuthentication}
              onCheckedChange={(checked) => onUpdate({ requireAuthentication: checked })}
            />
          </div>
        </div>
      </div>

      {/* Selected Category Summary */}
      {form.category && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Selected Category: {form.category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Default Priority:</span>
                <p className="text-blue-800">{form.category.defaultPriority}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Sensitivity Level:</span>
                <p className="text-blue-800">{form.category.defaultSensitivity}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Escalation Level:</span>
                <p className="text-blue-800">{form.category.escalationLevel}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Immediate Alert:</span>
                <p className="text-blue-800">{form.category.requiresImmediateNotification ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
