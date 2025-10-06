import React from 'react';
import { Slider } from '@/components/ui/slider';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { SliderQuestion } from '../../form-creation-wizard/types';

interface SliderQuestionRendererProps extends BaseQuestionRendererProps {
  question: SliderQuestion;
  value?: number;
  onChange?: (value: number) => void;
}

export function SliderQuestionRenderer({
  question,
  value = question.min,
  onChange,
  error,
  isPreviewMode
}: SliderQuestionRendererProps) {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <div className="space-y-4">
        {/* Current Value Display */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Current value:
          </span>
          <span className="text-lg font-bold">
            {question.prefix}{value}{question.suffix}
          </span>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[value]}
            onValueChange={handleChange}
            min={question.min}
            max={question.max}
            step={question.step}
            className="w-full"
          />
        </div>

        {/* Min/Max Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {question.prefix}{question.min}{question.suffix}
          </span>
          <span>
            {question.prefix}{question.max}{question.suffix}
          </span>
        </div>

        {/* Show Value Option */}
        {question.showValue && (
          <div className="text-center text-sm font-medium bg-gray-50 py-2 rounded">
            Selected: {question.prefix}{value}{question.suffix}
          </div>
        )}
      </div>
    </BaseQuestionRenderer>
  );
}