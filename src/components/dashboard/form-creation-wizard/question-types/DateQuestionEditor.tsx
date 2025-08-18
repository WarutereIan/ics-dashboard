import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { DateQuestion, ActivityKPIMapping, FormQuestion } from '../types';
import { DatePicker } from '@/components/ui/date-picker';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface DateQuestionEditorProps {
  question: DateQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
}

export function DateQuestionEditor(props: DateQuestionEditorProps) {
  const { question, onUpdate } = props;

  const handleDateChange = (field: 'minDate' | 'maxDate' | 'defaultValue', date: Date | undefined) => {
    onUpdate({
      [field]: date
    } as Partial<FormQuestion>);
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
                onValueChange={(value: 'DATE' | 'DATETIME') => onUpdate({ type: value } as Partial<FormQuestion>)}
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
                {question.type === 'DATETIME' ? (
                  <DateTimePicker
                    date={question.minDate}
                    onDateChange={(date) => handleDateChange('minDate', date)}
                    placeholder="Select minimum date and time"
                    minDate={undefined}
                    maxDate={question.maxDate}
                  />
                ) : (
                  <DatePicker
                    date={question.minDate}
                    onDateChange={(date) => handleDateChange('minDate', date)}
                    placeholder="Select minimum date"
                    minDate={undefined}
                    maxDate={question.maxDate}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Earliest date users can select
                </p>
              </div>
              
              <div>
                <Label htmlFor={`maxDate-${question.id}`}>Maximum Date</Label>
                {question.type === 'DATETIME' ? (
                  <DateTimePicker
                    date={question.maxDate}
                    onDateChange={(date) => handleDateChange('maxDate', date)}
                    placeholder="Select maximum date and time"
                    minDate={question.minDate}
                    maxDate={undefined}
                  />
                ) : (
                  <DatePicker
                    date={question.maxDate}
                    onDateChange={(date) => handleDateChange('maxDate', date)}
                    placeholder="Select maximum date"
                    minDate={question.minDate}
                    maxDate={undefined}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Latest date users can select
                </p>
              </div>
            </div>

            {/* Default Value */}
            <div>
              <Label htmlFor={`defaultValue-${question.id}`}>Default Value (optional)</Label>
              {question.type === 'DATETIME' ? (
                <DateTimePicker
                  date={question.defaultValue}
                  onDateChange={(date) => handleDateChange('defaultValue', date)}
                  placeholder="Select default date and time"
                  minDate={question.minDate}
                  maxDate={question.maxDate}
                />
              ) : (
                <DatePicker
                  date={question.defaultValue}
                  onDateChange={(date) => handleDateChange('defaultValue', date)}
                  placeholder="Select default date"
                  minDate={question.minDate}
                  maxDate={question.maxDate}
                />
              )}
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
                  onClick={() => onUpdate({ defaultValue: new Date() } as Partial<FormQuestion>)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    onUpdate({ defaultValue: tomorrow } as Partial<FormQuestion>);
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
                    onUpdate({ defaultValue: nextWeek } as Partial<FormQuestion>);
                  }}
                >
                  Next Week
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  onClick={() => onUpdate({ defaultValue: undefined } as Partial<FormQuestion>)}
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
              {question.type === 'DATETIME' ? (
                <DateTimePicker
                  date={question.defaultValue}
                  onDateChange={() => {}} // Read-only in preview
                  placeholder="Select date and time"
                  disabled={true}
                  minDate={question.minDate}
                  maxDate={question.maxDate}
                />
              ) : (
                <DatePicker
                  date={question.defaultValue}
                  onDateChange={() => {}} // Read-only in preview
                  placeholder="Select date"
                  disabled={true}
                  minDate={question.minDate}
                  maxDate={question.maxDate}
                />
              )}
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
      {/*   <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
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
        </div> */}
      </div>
    </BaseQuestionEditor>
  );
}