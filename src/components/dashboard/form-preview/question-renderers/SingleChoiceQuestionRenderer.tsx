import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { SingleChoiceQuestion } from '../../form-creation-wizard/types';

interface SingleChoiceQuestionRendererProps extends BaseQuestionRendererProps {
  question: SingleChoiceQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function SingleChoiceQuestionRenderer({
  question,
  value,
  onChange,
  error,
  isPreviewMode
}: SingleChoiceQuestionRendererProps) {
  if (question.displayType === 'DROPDOWN') {
    return (
      <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
        <Select
          value={value || ''}
          onValueChange={onChange}
          disabled={isPreviewMode}
        >
          <SelectTrigger className={isPreviewMode ? 'bg-gray-50' : ''}>
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option) => (
              <SelectItem key={option.id} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </BaseQuestionRenderer>
    );
  }

  // Radio button display
  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <div className="space-y-3">
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${question.id}-${option.id}`}
              name={question.id}
              value={option.value.toString()}
              checked={value === option.value.toString()}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={isPreviewMode}
              className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <Label 
              htmlFor={`${question.id}-${option.id}`}
              className={`text-sm ${isPreviewMode ? 'text-gray-500' : 'cursor-pointer'}`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </BaseQuestionRenderer>
  );
}