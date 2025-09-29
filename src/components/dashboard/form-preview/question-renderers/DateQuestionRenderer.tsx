import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { DateQuestion } from '../../form-creation-wizard/types';
import { DatePicker } from '@/components/ui/date-picker';
import { DateTimePicker } from '@/components/ui/date-time-picker';

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
  const handleDateChange = (date: Date | undefined) => {
    onChange?.(date);
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      {question.type === 'DATETIME' ? (
        <DateTimePicker
          date={value}
          onDateChange={handleDateChange}
          placeholder="Select date and time"
          disabled={isPreviewMode}
          minDate={question.minDate}
          maxDate={question.maxDate}
        />
      ) : (
        <DatePicker
          date={value}
          onDateChange={handleDateChange}
          placeholder="Select date"
          disabled={isPreviewMode}
          minDate={question.minDate}
          maxDate={question.maxDate}
        />
      )}
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