import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { ShortTextQuestion, ActivityKPIMapping, FormQuestion } from '../types';

interface ShortTextQuestionEditorProps {
  question: ShortTextQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
  onLinkToActivities: (activityMappings: ActivityKPIMapping[]) => void;
}

export function ShortTextQuestionEditor(props: ShortTextQuestionEditorProps) {
  const { question, onUpdate } = props;

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-2 block">Question Configuration</Label>
          
          <div>
            <Label htmlFor={`placeholder-${question.id}`}>Placeholder Text</Label>
            <Input
              id={`placeholder-${question.id}`}
              value={question.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value } as Partial<FormQuestion>)}
              placeholder="e.g., Enter your response..."
            />
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-lg bg-white">
          <Label className="text-sm font-medium mb-2 block text-emerald-600">Preview</Label>
          <div className="space-y-2">
            <Label className="font-medium">
              {question.title || 'Question Title'}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <Textarea 
              placeholder={question.placeholder || 'Enter your response...'}
              disabled
              className="bg-gray-50 min-h-[100px]"
              rows={4}
            />
          </div>
        </div>

        {/* Data Information */}
      {/*   <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Database Storage</p>
            <p className="text-xs text-gray-600">
              This will be stored as TEXT in PostgreSQL
            </p>
          </div>
          <Badge variant="outline">TEXT</Badge>
        </div> */}
      </div>
    </BaseQuestionEditor>
  );
}