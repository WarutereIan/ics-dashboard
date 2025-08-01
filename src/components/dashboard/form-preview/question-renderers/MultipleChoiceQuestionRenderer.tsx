import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { MultipleChoiceQuestion } from '../../form-creation-wizard/types';

interface MultipleChoiceQuestionRendererProps extends BaseQuestionRendererProps {
  question: MultipleChoiceQuestion;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function MultipleChoiceQuestionRenderer({
  question,
  value = [],
  onChange,
  error,
  isPreviewMode
}: MultipleChoiceQuestionRendererProps) {
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    let newValue = [...value];
    
    if (checked) {
      // Add the option if it's not already selected
      if (!newValue.includes(optionValue)) {
        newValue.push(optionValue);
      }
    } else {
      // Remove the option
      newValue = newValue.filter(v => v !== optionValue);
    }

    onChange(newValue);
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <div className="space-y-3">
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${question.id}-${option.id}`}
              checked={value.includes(option.value.toString())}
              onCheckedChange={(checked) => 
                handleOptionChange(option.value.toString(), checked as boolean)
              }
              disabled={isPreviewMode}
            />
            <Label 
              htmlFor={`${question.id}-${option.id}`}
              className={`text-sm ${isPreviewMode ? 'text-gray-500' : 'cursor-pointer'}`}
            >
              {option.label}
            </Label>
          </div>
        ))}
        
        {/* Selection limits info */}
        {(question.minSelections || question.maxSelections) && (
          <p className="text-xs text-gray-500 mt-2">
            {question.minSelections && question.maxSelections ? (
              `Select ${question.minSelections}-${question.maxSelections} options`
            ) : question.minSelections ? (
              `Select at least ${question.minSelections} option${question.minSelections > 1 ? 's' : ''}`
            ) : question.maxSelections ? (
              `Select up to ${question.maxSelections} option${question.maxSelections > 1 ? 's' : ''}`
            ) : null}
          </p>
        )}
      </div>
    </BaseQuestionRenderer>
  );
}