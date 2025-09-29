import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FeedbackForm, 
  FeedbackSensitivity, 
  EscalationLevel 
} from '@/types/feedback';
import { 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Shield, 
  Users,
  HelpCircle 
} from 'lucide-react';

interface ReviewStepProps {
  form: FeedbackForm;
  onUpdate: (updates: Partial<FeedbackForm>) => void;
  validationErrors: string[];
}

export function ReviewStep({ form, onUpdate, validationErrors }: ReviewStepProps) {
  const totalSections = form.sections.length;
  const totalQuestions = form.sections.reduce((total, section) => total + section.questions.length, 0);
  const requiredQuestions = form.sections.reduce((total, section) => 
    total + section.questions.filter(q => q.isRequired).length, 0);

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

  const QuestionPreview = ({ question }: { question: any }) => (
    <div className="p-3 border rounded-lg bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="font-medium text-sm">{question.title}</p>
          {question.description && (
            <p className="text-xs text-gray-600 mt-1">{question.description}</p>
          )}
        </div>
        <div className="flex gap-1 ml-2">
          <Badge variant="outline" className="text-xs">
            {question.type.replace('_', ' ')}
          </Badge>
          {question.isRequired && (
            <Badge variant="destructive" className="text-xs">Required</Badge>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Form Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Feedback Form Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalSections}</p>
              <p className="text-xs text-blue-700">Sections</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{totalQuestions}</p>
              <p className="text-xs text-green-700">Questions</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{requiredQuestions}</p>
              <p className="text-xs text-purple-700">Required</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {form.category?.allowedStakeholders.length || 0}
              </p>
              <p className="text-xs text-orange-700">Stakeholder Types</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-lg">{form.title}</h4>
              <p className="text-gray-600">{form.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Category:</span>
                  <Badge variant="outline">{form.category?.name}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Sensitivity:</span>
                  <Badge variant={getSensitivityColor(form.settings.confidentialityLevel)}>
                    {form.settings.confidentialityLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Escalation:</span>
                  <Badge variant={getEscalationColor(form.category?.escalationLevel || 'NONE')}>
                    {form.category?.escalationLevel || 'NONE'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Notifications:</span>
                  <span className="text-sm text-gray-600">
                    {form.settings.notificationEmails.length} email{form.settings.notificationEmails.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Anonymous:</span>
                  <Badge variant={form.allowAnonymous ? 'default' : 'secondary'}>
                    {form.allowAnonymous ? 'Allowed' : 'Not Allowed'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Auto-escalate:</span>
                  <Badge variant={form.settings.autoEscalate ? 'default' : 'secondary'}>
                    {form.settings.autoEscalate ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Preview */}
      {form.sections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {form.sections.map((section, sectionIndex) => (
                <div key={section.id}>
                  <h4 className="font-medium mb-2">
                    Section {sectionIndex + 1}: {section.title}
                  </h4>
                  {section.description && (
                    <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                  )}
                  <div className="space-y-2">
                    {section.questions.map((question) => (
                      <QuestionPreview key={question.id} question={question} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Escalation Rules */}
      {form.settings.escalationRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Escalation Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {form.settings.escalationRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{rule.condition}</span>
                    <p className="text-sm text-gray-600">
                      Escalate to {rule.escalationLevel} within {rule.responseTime} hours
                    </p>
                  </div>
                  <Badge variant={getEscalationColor(rule.escalationLevel)}>
                    {rule.escalationLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800">
              <p className="font-medium mb-2">Please fix the following issues before publishing:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ready to Publish */}
      {validationErrors.length === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-green-800 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-medium mb-2">Ready to Publish!</h3>
              <p className="text-sm">
                Your feedback form is complete and ready to be published. 
                Stakeholders will be able to submit feedback using this form.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
