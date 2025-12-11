import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { ShortTextQuestion } from '../../form-creation-wizard/types';

interface ShortTextQuestionRendererProps extends BaseQuestionRendererProps {
  question: ShortTextQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function ShortTextQuestionRenderer({
  question,
  value = '',
  onChange,
  error,
  isPreviewMode
}: ShortTextQuestionRendererProps) {
  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={question.placeholder || 'Enter your response...'}
        className={isPreviewMode ? 'bg-blue-50 border-blue-200' : ''}
      />
    </BaseQuestionRenderer>
  );
}