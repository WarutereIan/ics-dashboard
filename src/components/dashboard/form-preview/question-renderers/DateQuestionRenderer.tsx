import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { DateQuestion } from '../../form-creation-wizard/types';

interface DateQuestionRendererProps extends BaseQuestionRendererProps {
  question: DateQuestion;
  value?: Date;
  onChange?: (value: Date | undefined) => void;
}

export function DateQuestionRenderer({
  question,
  value,
  onChange,
  error,
  isPreviewMode
}: DateQuestionRendererProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      onChange?.(new Date(newValue));
    } else {
      onChange?.(undefined);
    }
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    
    if (question.type === 'DATETIME') {
      // Format as datetime-local (YYYY-MM-DDTHH:MM)
      return date.toISOString().slice(0, 16);
    } else {
      // Format as date (YYYY-MM-DD)
      return date.toISOString().slice(0, 10);
    }
  };

  const getInputType = () => {
    return question.type === 'DATETIME' ? 'datetime-local' : 'date';
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <Input
        type={getInputType()}
        value={formatDateForInput(value)}
        onChange={handleChange}
        min={question.minDate ? formatDateForInput(question.minDate) : undefined}
        max={question.maxDate ? formatDateForInput(question.maxDate) : undefined}
        disabled={isPreviewMode}
        className={isPreviewMode ? 'bg-gray-50' : ''}
      />
      {(question.minDate || question.maxDate) && (
        <p className="text-xs text-gray-500 mt-1">
          {question.minDate && question.maxDate ? (
            `Date must be between ${question.minDate.toLocaleDateString()} and ${question.maxDate.toLocaleDateString()}`
          ) : question.minDate ? (
            `Date must be after ${question.minDate.toLocaleDateString()}`
          ) : question.maxDate ? (
            `Date must be before ${question.maxDate.toLocaleDateString()}`
          ) : null}
        </p>
      )}
    </BaseQuestionRenderer>
  );
}