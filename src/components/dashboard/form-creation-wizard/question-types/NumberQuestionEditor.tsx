import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { NumberQuestion, ActivityKPIMapping, FormQuestion } from '../types';

interface NumberQuestionEditorProps {
  question: NumberQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
}

export function NumberQuestionEditor(props: NumberQuestionEditorProps) {
  const { question, onUpdate } = props;

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-4 block">Question Configuration</Label>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`min-${question.id}`}>Minimum Value</Label>
              <Input
                id={`min-${question.id}`}
                type="number"
                value={question.min ?? ''}
                onChange={(e) => onUpdate({ min: e.target.value ? parseFloat(e.target.value) : undefined } as Partial<FormQuestion>)}
                placeholder="No minimum"
              />
            </div>
            
            <div>
              <Label htmlFor={`max-${question.id}`}>Maximum Value</Label>
              <Input
                id={`max-${question.id}`}
                type="number"
                value={question.max ?? ''}
                onChange={(e) => onUpdate({ max: e.target.value ? parseFloat(e.target.value) : undefined } as Partial<FormQuestion>)}
                placeholder="No maximum"
              />
            </div>

            <div>
              <Label htmlFor={`step-${question.id}`}>Step Size</Label>
              <Input
                id={`step-${question.id}`}
                type="number"
                value={question.step ?? ''}
                onChange={(e) => onUpdate({ step: e.target.value ? parseFloat(e.target.value) : undefined } as Partial<FormQuestion>)}
                placeholder="1"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor={`placeholder-${question.id}`}>Placeholder Text</Label>
            <Input
              id={`placeholder-${question.id}`}
              value={question.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value } as Partial<FormQuestion>)}
              placeholder="e.g., Enter amount..."
            />
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-lg bg-white">
          <Label className="text-sm font-medium mb-2 block text-blue-600">Preview</Label>
          <div className="space-y-2">
            <Label className="font-medium">
              {question.title || 'Question Title'}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            <Input 
              type="number"
              placeholder={question.placeholder || 'Enter a number...'}
              min={question.min}
              max={question.max}
              step={question.step}
              disabled
              className="bg-gray-50"
            />
            {(question.min !== undefined || question.max !== undefined) && (
              <p className="text-xs text-gray-500">
                {question.min !== undefined && question.max !== undefined
                  ? `Value must be between ${question.min} and ${question.max}`
                  : question.min !== undefined
                  ? `Minimum value: ${question.min}`
                  : `Maximum value: ${question.max}`
                }
                {question.step && question.step !== 1 && ` (step: ${question.step})`}
              </p>
            )}
          </div>
        </div>

        {/* KPI Integration Notice */}
        {question.linkedActivity && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800">KPI Integration</p>
            <p className="text-xs text-green-600">
              This numeric response can be automatically aggregated for KPI calculations.
              Configure the aggregation method (SUM, COUNT, AVERAGE, etc.) in the activity linking settings.
            </p>
          </div>
        )}

        {/* Data Information */}
       {/*  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Database Storage</p>
            <p className="text-xs text-gray-600">
              {question.step && question.step !== 1 
                ? 'This will be stored as DECIMAL in PostgreSQL for precision'
                : 'This will be stored as INTEGER in PostgreSQL'
              }
            </p>
          </div>
          <Badge variant="outline">
            {question.step && question.step !== 1 ? 'DECIMAL' : 'INTEGER'}
          </Badge>
        </div> */}
      </div>
    </BaseQuestionEditor>
  );
}