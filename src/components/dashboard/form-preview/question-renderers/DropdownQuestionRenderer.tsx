import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { DropdownQuestion } from '../../form-creation-wizard/types';

interface DropdownQuestionRendererProps extends BaseQuestionRendererProps {
  question: DropdownQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function DropdownQuestionRenderer({
  question,
  value,
  onChange,
  error,
  isPreviewMode
}: DropdownQuestionRendererProps) {
  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <Select
        value={value || ''}
        onValueChange={onChange}
        disabled={isPreviewMode}
      >
        <SelectTrigger className={isPreviewMode ? 'bg-gray-50' : ''}>
          <SelectValue placeholder={question.placeholder || 'Select an option...'} />
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