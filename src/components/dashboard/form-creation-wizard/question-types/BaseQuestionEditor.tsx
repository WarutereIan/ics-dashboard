import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { TrashIcon, Cog6ToothIcon, ChevronDownIcon, ChevronRightIcon, XMarkIcon, ClipboardDocumentIcon, LinkIcon } from '@heroicons/react/24/outline';

import { FormQuestion, ActivityKPIMapping, QuestionType } from '../types';
import { AddNextQuestionModal } from '../AddNextQuestionModal';

interface BaseQuestionEditorProps {
  question: FormQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
  onLinkToActivities: (activityMappings: ActivityKPIMapping[]) => void;
  children?: React.ReactNode; // Question-specific configuration
  sectionId?: string; // Section ID for adding next question
  onAddQuestion?: (sectionId: string, questionType: QuestionType) => void; // Function to add next question
}

export function BaseQuestionEditor({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
  availableActivities,
  onLinkToActivity,
  onLinkToActivities,
  children,
  sectionId,
  onAddQuestion,
}: BaseQuestionEditorProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Get linked activities (support both new and legacy formats)
  const linkedActivities = question.linkedActivities || 
    (question.linkedActivity ? [question.linkedActivity] : []);
  
  const linkedActivityMappings = linkedActivities.map(linkedActivity => 
    availableActivities.find(activity => activity.activityId === linkedActivity.activityId)
  ).filter(Boolean) as ActivityKPIMapping[];
  
  // Legacy support for single activity
  const linkedActivity = availableActivities.find(
    activity => activity.activityId === question.linkedActivity?.activityId
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto hover:bg-gray-100"
                  >
                    {isOpen ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <Badge variant="outline">{question.type.replace('_', ' ')}</Badge>
                {question.isRequired && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
                {linkedActivityMappings.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <LinkIcon className="w-3 h-3 mr-1" />
                    {linkedActivityMappings.length === 1 ? 'Linked to Activity' : `Linked to ${linkedActivityMappings.length} Activities`}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`title-${question.id}`}>Question Title *</Label>
                  <Input
                    id={`title-${question.id}`}
                    value={question.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Enter your question..."
                    className="font-medium"
                  />
                </div>

                {isOpen && (
                  <div>
                    <Label htmlFor={`description-${question.id}`}>Description (optional)</Label>
                    <Textarea
                      id={`description-${question.id}`}
                      value={question.description || ''}
                      onChange={(e) => onUpdate({ description: e.target.value })}
                      placeholder="Add additional context or instructions..."
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onDuplicate}
                title="Duplicate question"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                title="Delete question"
                className="text-emerald-600 hover:text-emerald-700"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Question-specific configuration */}
            {children}

            {/* Common settings */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`required-${question.id}`}>Required Question</Label>
                <Switch
                  id={`required-${question.id}`}
                  checked={question.isRequired}
                  onCheckedChange={(checked) => onUpdate({ isRequired: checked })}
                />
              </div>

              {/* Activity Linking */}
              <div className="space-y-2">
                <Label>Link to Project Activities (optional)</Label>
                
                {/* Display linked activities */}
                {linkedActivityMappings.length > 0 && (
                  <div className="space-y-2">
                    {linkedActivityMappings.map((activity) => (
                      <div key={activity.activityId} className="p-3 bg-emerald-50 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{activity.projectName}</p>
                            <p className="text-sm text-gray-600">{activity.outcomeName}</p>
                            <p className="text-sm text-emerald-600">{activity.activityName}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedActivities = linkedActivityMappings
                                .filter(a => a.activityId !== activity.activityId);
                              onLinkToActivities(updatedActivities);
                            }}
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                 {/* Add new activities */}
                 <MultiSelect
                   options={availableActivities
                     .filter(activity => !linkedActivityMappings.find(a => a.activityId === activity.activityId))
                     .map((activity) => ({
                       value: activity.activityId,
                       label: `${activity.projectName} - ${activity.activityName}`,
                       description: `${activity.outcomeName} → ${activity.activityName}`
                     }))}
                   value={[]}
                   onChange={(selectedActivityIds) => {
                     const newActivities = selectedActivityIds
                       .map(activityId => availableActivities.find(a => a.activityId === activityId))
                       .filter(Boolean) as ActivityKPIMapping[];
                     
                     const updatedActivities = [
                       ...linkedActivityMappings,
                       ...newActivities
                     ];
                     onLinkToActivities(updatedActivities);
                   }}
                   placeholder="Select activities to link this question..."
                 />
                
                <p className="text-xs text-gray-500">
                  Linking questions to activities helps track progress toward your project KPIs. You can link to multiple activities if the question applies to several.
                </p>
              </div>

                           </div>
           </CardContent>
         </CollapsibleContent>

         {/* Add Next Question Button - Always visible */}
         {sectionId && onAddQuestion && (
           <div className="relative">
             <div className="flex justify-center -mt-6">
               <AddNextQuestionModal 
                 sectionId={sectionId} 
                 onAddQuestion={onAddQuestion} 
               />
             </div>
           </div>
         )}
       </Card>
     </Collapsible>
   );
 }