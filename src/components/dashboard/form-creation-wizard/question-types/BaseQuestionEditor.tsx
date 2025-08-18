import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Copy, Settings, Link, ChevronDown, ChevronRight } from 'lucide-react';
import { FormQuestion, ActivityKPIMapping, QuestionType } from '../types';
import { AddNextQuestionModal } from '../AddNextQuestionModal';

interface BaseQuestionEditorProps {
  question: FormQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
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
  children,
  sectionId,
  onAddQuestion,
}: BaseQuestionEditorProps) {
  const [isOpen, setIsOpen] = useState(true);
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
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <Badge variant="outline">{question.type.replace('_', ' ')}</Badge>
                {question.isRequired && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
                {question.linkedActivity && (
                  <Badge variant="secondary" className="text-xs">
                    <Link className="w-3 h-3 mr-1" />
                    Linked to Activity
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
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                title="Delete question"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
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
                <Label>Link to Project Activity (optional)</Label>
                {linkedActivity ? (
                  <div className="p-3 bg-blue-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{linkedActivity.projectName}</p>
                        <p className="text-sm text-gray-600">{linkedActivity.outcomeName}</p>
                        <p className="text-sm text-blue-600">{linkedActivity.activityName}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate({ linkedActivity: undefined })}
                      >
                        Unlink
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Select onValueChange={(value) => {
                    const activity = availableActivities.find(a => a.activityId === value);
                    if (activity) {
                      onLinkToActivity(activity);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an activity to link this question..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableActivities.map((activity) => (
                        <SelectItem key={activity.activityId} value={activity.activityId}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{activity.projectName}</span>
                            <span className="text-sm text-gray-600">
                              {activity.outcomeName} → {activity.activityName}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-gray-500">
                  Linking questions to activities helps track progress toward your project KPIs.
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