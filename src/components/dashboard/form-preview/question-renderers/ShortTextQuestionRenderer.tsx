import React from 'react';
import { Textarea } from '@/components/ui/textarea';
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
      <Textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={question.placeholder || 'Enter your response...'}
        disabled={isPreviewMode}
        className={`min-h-[100px] ${isPreviewMode ? 'bg-gray-50' : ''}`}
        rows={4}
      />
    </BaseQuestionRenderer>
  );
}