import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Link, 
  Unlink, 
  Target, 
  TrendingUp, 
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { Form, FormQuestion, ActivityKPIMapping } from './types';

interface ActivityLinksStepProps {
  form: Partial<Form>;
  availableActivities: ActivityKPIMapping[];
  onLinkQuestionToActivity: (sectionId: string, questionId: string, activityMapping: ActivityKPIMapping) => void;
  onLinkQuestionToActivities: (sectionId: string, questionId: string, activityMappings: ActivityKPIMapping[]) => void;
  onUpdateQuestion: (sectionId: string, questionId: string, updates: Partial<FormQuestion>) => void;
}

type AggregationType = 'SUM' | 'COUNT' | 'AVERAGE' | 'MIN' | 'MAX';

export function ActivityLinksStep({
  form,
  availableActivities,
  onLinkQuestionToActivity,
  onLinkQuestionToActivities,
  onUpdateQuestion,
}: ActivityLinksStepProps) {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Get all questions from all sections
  const allQuestions = form.sections?.flatMap(section => 
    section.questions.map(question => ({
      ...question,
      sectionId: section.id,
      sectionTitle: section.title
    }))
  ) || [];

  const linkedQuestions = allQuestions.filter(q => q.linkedActivity || (q.linkedActivities && q.linkedActivities.length > 0));
  const unlinkedQuestions = allQuestions.filter(q => !q.linkedActivity && (!q.linkedActivities || q.linkedActivities.length === 0));

  const getActivityById = (activityId: string) => {
    return availableActivities.find(a => a.activityId === activityId);
  };

  const linkQuestion = (question: any, activityId: string) => {
    const activity = availableActivities.find(a => a.activityId === activityId);
    if (activity) {
      onLinkQuestionToActivity(question.sectionId, question.id, activity);
    }
  };

  const unlinkQuestion = (question: any) => {
    onUpdateQuestion(question.sectionId, question.id, { 
      linkedActivity: undefined,
      linkedActivities: []
    });
  };

  const updateKPIContribution = (question: any, updates: any) => {
    // For now, update the first linked activity's KPI contribution
    // TODO: Consider if we need to handle multiple KPI contributions
    const linkedActivities = question.linkedActivities || 
      (question.linkedActivity ? [question.linkedActivity] : []);
    
    if (linkedActivities.length > 0) {
      const updatedActivities = linkedActivities.map((activity: any, index: number) => {
        if (index === 0) {
          return {
            ...activity,
            kpiContribution: {
              ...activity.kpiContribution,
              ...updates,
            }
          };
        }
        return activity;
      });
      
      onUpdateQuestion(question.sectionId, question.id, {
        linkedActivities: updatedActivities,
        linkedActivity: undefined // Clear legacy
      });
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'NUMBER':
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'SINGLE_CHOICE':
      case 'MULTIPLE_CHOICE':
        return <Target className="w-4 h-4 text-green-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const isNumericQuestion = (type: string) => {
    return ['NUMBER', 'SLIDER'].includes(type);
  };

  const canContributeToKPI = (question: any) => {
    return isNumericQuestion(question.type) || 
           ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'YES_NO'].includes(question.type);
  };

  if (allQuestions.length === 0) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">No Questions Available</p>
              <p className="text-sm text-orange-700">
                Please go back and add questions to your form before setting up activity links.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Activity & KPI Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Link your form questions to project activities to automatically track progress toward KPIs.
            Numeric questions can contribute directly to KPI calculations.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{linkedQuestions.length}</p>
              <p className="text-sm text-blue-700">Linked Questions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{unlinkedQuestions.length}</p>
              <p className="text-sm text-gray-700">Unlinked Questions</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {linkedQuestions.filter(q => {
                  const linkedActivities = q.linkedActivities || (q.linkedActivity ? [q.linkedActivity] : []);
                  return linkedActivities.some(activity => !!activity.kpiContribution);
                }).length}
              </p>
              <p className="text-sm text-green-700">Contributing to KPIs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Link Section */}
      {unlinkedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Link Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Select Activities</Label>
                <MultiSelect
                  options={availableActivities.map((activity) => ({
                    value: activity.activityId,
                    label: `${activity.projectName} - ${activity.activityName}`,
                    description: `${activity.outcomeName} → ${activity.activityName}`
                  }))}
                  value={selectedActivities}
                  onChange={setSelectedActivities}
                  placeholder="Choose activities to link questions..."
                />
              </div>
            </div>

            {selectedActivities.length > 0 && (
              <div className="space-y-2">
                <Label>Unlinked Questions</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {unlinkedQuestions.map((question) => (
                    <div key={question.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {getQuestionTypeIcon(question.type)}
                        <span className="text-sm font-medium">{question.title}</span>
                        <Badge variant="outline" className="text-xs">{question.sectionTitle}</Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const activitiesToLink = selectedActivities
                            .map(activityId => availableActivities.find(a => a.activityId === activityId))
                            .filter(Boolean) as ActivityKPIMapping[];
                          onLinkQuestionToActivities(question.sectionId, question.id, activitiesToLink);
                        }}
                      >
                        <Link className="w-4 h-4 mr-1" />
                        Link to {selectedActivities.length} {selectedActivities.length === 1 ? 'Activity' : 'Activities'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Linked Questions Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Linked Questions ({linkedQuestions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No questions linked yet</p>
              <p className="text-sm text-gray-500">
                Use the quick link section above to start linking questions to activities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedQuestions.map((question) => {
                // Handle both single and multiple activity links
                const linkedActivities = question.linkedActivities || 
                  (question.linkedActivity ? [question.linkedActivity] : []);
                
                const hasKPIContribution = linkedActivities.some(activity => !!activity.kpiContribution);
                
                return (
                  <Card key={question.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {/* Question Info */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getQuestionTypeIcon(question.type)}
                            <div>
                              <p className="font-medium">{question.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {question.type.replace('_', ' ')}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {question.sectionTitle}
                                </Badge>
                                {hasKPIContribution && (
                                  <Badge variant="default" className="text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    KPI Linked
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => unlinkQuestion(question)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Unlink className="w-4 h-4 mr-1" />
                            Unlink
                          </Button>
                        </div>

                        {/* Activity Info */}
                        {linkedActivities.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-900">
                              {linkedActivities.length === 1 ? 'Linked Activity' : `Linked Activities (${linkedActivities.length})`}
                            </p>
                            {linkedActivities.map((linkedActivity, index) => {
                              const activity = getActivityById(linkedActivity.activityId);
                              return activity ? (
                                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-700">{activity.projectName}</p>
                                  <p className="text-xs text-blue-600">
                                    {activity.outcomeName} → {activity.activityName}
                                  </p>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}

                        {/* KPI Configuration */}
                        {canContributeToKPI(question) && (
                          <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <p className="text-sm font-medium text-green-900">KPI Contribution</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Aggregation Method</Label>
                                <Select
                                  value={linkedActivities[0]?.kpiContribution?.aggregationType || 'COUNT'}
                                  onValueChange={(value: AggregationType) =>
                                    updateKPIContribution(question, { aggregationType: value })
                                  }
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="COUNT">Count Responses</SelectItem>
                                    {isNumericQuestion(question.type) && (
                                      <>
                                        <SelectItem value="SUM">Sum Values</SelectItem>
                                        <SelectItem value="AVERAGE">Average Values</SelectItem>
                                        <SelectItem value="MIN">Minimum Value</SelectItem>
                                        <SelectItem value="MAX">Maximum Value</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs">Weight (0-1)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={question.linkedActivity?.kpiContribution?.weight || 1}
                                  onChange={(e) =>
                                    updateKPIContribution(question, { 
                                      weight: parseFloat(e.target.value) || 1 
                                    })
                                  }
                                  className="h-8"
                                />
                              </div>
                            </div>

                            <p className="text-xs text-green-600 mt-2">
                              This question will automatically contribute to the activity's KPI calculations
                              using the {question.linkedActivity?.kpiContribution?.aggregationType || 'COUNT'} method.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Benefits of Activity Integration
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Automatic Progress Tracking:</strong> Form responses update activity progress in real-time</li>
            <li>• <strong>KPI Calculations:</strong> Numeric responses contribute directly to KPI measurements</li>
            <li>• <strong>Data Consistency:</strong> Eliminates manual data entry and reduces errors</li>
            <li>• <strong>Comprehensive Reporting:</strong> Link form data to project outcomes and impact</li>
            <li>• <strong>Real-time Dashboards:</strong> See immediate updates in project dashboards</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}