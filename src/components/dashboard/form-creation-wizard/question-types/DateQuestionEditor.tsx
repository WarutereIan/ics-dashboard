import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { DateQuestion, ActivityKPIMapping } from '../types';

interface DateQuestionEditorProps {
  question: DateQuestion;
  onUpdate: (updates: Partial<DateQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
}

export function DateQuestionEditor(props: DateQuestionEditorProps) {
  const { question, onUpdate } = props;

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return question.type === 'DATETIME' 
      ? date.toISOString().slice(0, 16)
      : date.toISOString().slice(0, 10);
  };

  const handleDateChange = (field: 'minDate' | 'maxDate' | 'defaultValue', value: string) => {
    onUpdate({
      [field]: value ? new Date(value) : undefined
    });
  };

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-4 block">Question Configuration</Label>
          
          <div className="space-y-4">
            {/* Date Type Selection */}
            <div>
              <Label>Date Input Type</Label>
              <Select 
                value={question.type} 
                onValueChange={(value: 'DATE' | 'DATETIME') => onUpdate({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DATE">Date Only</SelectItem>
                  <SelectItem value="DATETIME">Date and Time</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {question.type === 'DATE' 
                  ? 'Users will select only the date (e.g., 2024-01-15)'
                  : 'Users will select both date and time (e.g., 2024-01-15 14:30)'
                }
              </p>
            </div>

            {/* Date Constraints */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`minDate-${question.id}`}>Minimum Date</Label>
                <Input
                  id={`minDate-${question.id}`}
                  type={question.type === 'DATETIME' ? 'datetime-local' : 'date'}
                  value={formatDateForInput(question.minDate)}
                  onChange={(e) => handleDateChange('minDate', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Earliest date users can select
                </p>
              </div>
              
              <div>
                <Label htmlFor={`maxDate-${question.id}`}>Maximum Date</Label>
                <Input
                  id={`maxDate-${question.id}`}
                  type={question.type === 'DATETIME' ? 'datetime-local' : 'date'}
                  value={formatDateForInput(question.maxDate)}
                  onChange={(e) => handleDateChange('maxDate', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Latest date users can select
                </p>
              </div>
            </div>

            {/* Default Value */}
            <div>
              <Label htmlFor={`defaultValue-${question.id}`}>Default Value (optional)</Label>
              <Input
                id={`defaultValue-${question.id}`}
                type={question.type === 'DATETIME' ? 'datetime-local' : 'date'}
                value={formatDateForInput(question.defaultValue)}
                onChange={(e) => handleDateChange('defaultValue', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pre-populate the field with this value
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <Label className="mb-2 block">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  onClick={() => onUpdate({ defaultValue: new Date() })}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    onUpdate({ defaultValue: tomorrow });
                  }}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    onUpdate({ defaultValue: nextWeek });
                  }}
                >
                  Next Week
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  onClick={() => onUpdate({ defaultValue: undefined })}
                >
                  Clear Default
                </button>
              </div>
            </div>
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
            
            <div className="relative">
              <Input 
                type={question.type === 'DATETIME' ? 'datetime-local' : 'date'}
                value={formatDateForInput(question.defaultValue)}
                min={formatDateForInput(question.minDate)}
                max={formatDateForInput(question.maxDate)}
                disabled
                className="bg-gray-50"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {(question.minDate || question.maxDate) && (
              <p className="text-xs text-gray-500">
                {question.minDate && question.maxDate
                  ? `Date must be between ${question.minDate.toLocaleDateString()} and ${question.maxDate.toLocaleDateString()}`
                  : question.minDate
                  ? `Date must be after ${question.minDate.toLocaleDateString()}`
                  : `Date must be before ${question.maxDate!.toLocaleDateString()}`
                }
              </p>
            )}
          </div>
        </div>

        {/* KPI Integration Notice */}
        {question.linkedActivity && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800">KPI Integration</p>
            <p className="text-xs text-green-600">
              Date responses can be used for timeline analysis and activity completion tracking.
              Consider using COUNT aggregation for milestone tracking.
            </p>
          </div>
        )}

        {/* Data Information */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Database Storage</p>
            <p className="text-xs text-gray-600">
              {question.type === 'DATETIME'
                ? 'This will be stored as TIMESTAMP in PostgreSQL (with time zone)'
                : 'This will be stored as DATE in PostgreSQL (date only)'
              }
            </p>
          </div>
          <Badge variant="outline">
            {question.type === 'DATETIME' ? 'TIMESTAMP' : 'DATE'}
          </Badge>
        </div>
      </div>
    </BaseQuestionEditor>
  );
}