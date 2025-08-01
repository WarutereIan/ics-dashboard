import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { NumberQuestion } from '../../form-creation-wizard/types';

interface NumberQuestionRendererProps extends BaseQuestionRendererProps {
  question: NumberQuestion;
  value?: number;
  onChange?: (value: number | undefined) => void;
}

export function NumberQuestionRenderer({
  question,
  value,
  onChange,
  error,
  isPreviewMode
}: NumberQuestionRendererProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '') {
      onChange?.(undefined);
    } else {
      const numValue = Number(newValue);
      if (!isNaN(numValue)) {
        onChange?.(numValue);
      }
    }
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <Input
        type="number"
        value={value !== undefined ? value.toString() : ''}
        onChange={handleChange}
        placeholder={question.placeholder || 'Enter a number...'}
        min={question.min}
        max={question.max}
        step={question.step || 1}
        disabled={isPreviewMode}
        className={isPreviewMode ? 'bg-gray-50' : ''}
      />
    </BaseQuestionRenderer>
  );
}