import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Settings,
  Link,
  Users,
  BarChart3,
  Calendar,
  Globe,
  Share2,
  Download
} from 'lucide-react';
import { Form } from './types';

interface ReviewStepProps {
  form: Partial<Form>;
  onPublish: () => Promise<boolean>;
}

export function ReviewStep({ form, onPublish }: ReviewStepProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  // Calculate form statistics
  const totalSections = form.sections?.length || 0;
  const totalQuestions = form.sections?.reduce((total, section) => total + section.questions.length, 0) || 0;
  const linkedQuestions = form.sections?.reduce((total, section) => 
    total + section.questions.filter(q => {
      const linkedActivities = q.linkedActivities || (q.linkedActivity ? [q.linkedActivity] : []);
      return linkedActivities.length > 0;
    }).length, 0) || 0;
  const requiredQuestions = form.sections?.reduce((total, section) => 
    total + section.questions.filter(q => q.isRequired).length, 0) || 0;

  // Validation checks
  const validationChecks = [
    {
      id: 'title',
      label: 'Form has a title',
      passed: !!form.title,
      severity: 'error' as const,
    },
    {
      id: 'project',
      label: 'Form is linked to a project',
      passed: !!form.projectId,
      severity: 'error' as const,
    },
    {
      id: 'sections',
      label: 'Form has at least one section',
      passed: totalSections > 0,
      severity: 'error' as const,
    },
    {
      id: 'questions',
      label: 'Form has at least one question',
      passed: totalQuestions > 0,
      severity: 'error' as const,
    },
    {
      id: 'description',
      label: 'Form has a description',
      passed: !!form.description,
      severity: 'warning' as const,
    },
    {
      id: 'activity-links',
      label: 'At least one question is linked to an activity',
      passed: linkedQuestions > 0,
      severity: 'warning' as const,
    },
    {
      id: 'notifications',
      label: 'Email notifications are configured',
      passed: (form.settings?.notificationEmails?.length || 0) > 0,
      severity: 'info' as const,
    },
  ];

  const errors = validationChecks.filter(check => check.severity === 'error' && !check.passed);
  const warnings = validationChecks.filter(check => check.severity === 'warning' && !check.passed);
  const canPublish = errors.length === 0;

  const handlePublish = async () => {
    if (!canPublish) return;
    
    setIsPublishing(true);
    try {
      await onPublish();
    } finally {
      setIsPublishing(false);
    }
  };

  const QuestionPreview = ({ question, sectionTitle }: { question: any, sectionTitle: string }) => (
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
          {(question.linkedActivities?.length > 0 || question.linkedActivity) && (
            <Badge variant="secondary" className="text-xs">
              <Link className="w-3 h-3 mr-1" />
              Linked
            </Badge>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Section: {sectionTitle}
        {(question.linkedActivities?.length > 0 || question.linkedActivity) && (
          <span className="ml-2">• Linked to activity</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Review & Publish Form
            </div>
            <Badge variant={form.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {form.status || 'DRAFT'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Review your form configuration and publish it to start collecting responses.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalSections}</p>
              <p className="text-xs text-blue-700">Sections</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{totalQuestions}</p>
              <p className="text-xs text-green-700">Questions</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{linkedQuestions}</p>
              <p className="text-xs text-purple-700">Linked to Activities</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{requiredQuestions}</p>
              <p className="text-xs text-orange-700">Required</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Pre-publish Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Errors */}
            {errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <p className="font-medium text-red-900 mb-2">
                    {errors.length} error{errors.length > 1 ? 's' : ''} must be fixed before publishing:
                  </p>
                  <ul className="text-sm text-red-800 space-y-1">
                    {errors.map((error) => (
                      <li key={error.id}>• {error.label}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <p className="font-medium text-orange-900 mb-2">
                    {warnings.length} recommendation{warnings.length > 1 ? 's' : ''}:
                  </p>
                  <ul className="text-sm text-orange-800 space-y-1">
                    {warnings.map((warning) => (
                      <li key={warning.id}>• {warning.label}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Success */}
            {canPublish && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <p className="font-medium text-green-900">
                    Form is ready to publish! All required validations have passed.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Validation Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {validationChecks.map((check) => (
                <div key={check.id} className="flex items-center gap-2 text-sm">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full ${
                      check.severity === 'error' ? 'bg-red-500' : 
                      check.severity === 'warning' ? 'bg-orange-500' : 'bg-gray-400'
                    }`} />
                  )}
                  <span className={check.passed ? 'text-green-700' : 'text-gray-600'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Preview Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Form Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Title</p>
                  <p className="text-lg font-semibold">{form.title || 'Untitled Form'}</p>
                </div>
                
                {form.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <p className="text-sm">{form.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Project</p>
                    <p className="text-sm">{form.projectId || 'Not selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-sm">{form.category || 'Uncategorized'}</p>
                  </div>
                </div>

                {form.tags && form.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {form.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Questions ({totalQuestions})</CardTitle>
            </CardHeader>
            <CardContent>
              {form.sections && form.sections.length > 0 ? (
                <div className="space-y-6">
                  {form.sections.map((section) => (
                    <div key={section.id}>
                      <div className="mb-3">
                        <h4 className="font-medium text-lg">{section.title}</h4>
                        {section.description && (
                          <p className="text-sm text-gray-600">{section.description}</p>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {section.questions.map((question) => (
                          <QuestionPreview
                            key={question.id}
                            question={question}
                            sectionTitle={section.title}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No questions added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium">Access Control</h5>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Authentication Required:</span>
                      <Badge variant={form.settings?.requireAuthentication ? 'default' : 'secondary'}>
                        {form.settings?.requireAuthentication ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    
                    {form.settings?.requireAuthentication && (
                      <div className="flex justify-between">
                        <span>Allowed Roles:</span>
                        <div className="flex flex-wrap gap-1">
                          {form.settings?.allowedRoles?.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">User Experience</h5>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800 space-y-1">
                      <p>✓ Progress bar enabled</p>
                      <p>✓ Multiple responses allowed</p>
                      <p>✓ Save as draft enabled</p>
                      <p>✓ Response editing allowed</p>
                      <p>✓ Auto-save enabled</p>
                    </div>
                    <p className="text-xs text-green-700 mt-2 italic">
                      Default features for optimal user experience
                    </p>
                  </div>
                </div>
              </div>

              {form.settings?.notificationEmails && form.settings.notificationEmails.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h5 className="font-medium mb-2">Email Notifications</h5>
                  <div className="flex flex-wrap gap-1">
                    {form.settings.notificationEmails.map((email, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {email}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Deployment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Form URL</h5>
                  <p className="text-sm text-blue-700 font-mono">
                    https://forms.yourorganization.org/f/{form.id}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    This URL will be available after publishing
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm">Sharing Options</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Direct link sharing</li>
                      <li>• QR code generation</li>
                      <li>• Email distribution</li>
                      <li>• Social media sharing</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm">Analytics</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Real-time response tracking</li>
                      <li>• Completion analytics</li>
                      <li>• Activity progress updates</li>
                      <li>• KPI contributions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Publish Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Button
              onClick={handlePublish}
              disabled={!canPublish || isPublishing}
              size="lg"
              className="px-8"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Publish Form
                </>
              )}
            </Button>
          </div>
          
          {!canPublish && (
            <p className="text-center text-sm text-red-600 mt-2">
              Please fix the validation errors above before publishing
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}