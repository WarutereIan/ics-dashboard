import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { MultipleChoiceQuestion } from '../../form-creation-wizard/types';
import { QuestionRenderer } from '../QuestionRenderer';

interface MultipleChoiceQuestionRendererProps extends BaseQuestionRendererProps {
  question: MultipleChoiceQuestion;
  value?: string[];
  onChange?: (value: string[]) => void;
  conditionalValues?: Record<string, any>; // Values for conditional questions
  onConditionalChange?: (questionId: string, value: any) => void; // Handler for conditional question changes
}

export function MultipleChoiceQuestionRenderer({
  question,
  value = [],
  onChange,
  error,
  isPreviewMode,
  conditionalValues = {},
  onConditionalChange
}: MultipleChoiceQuestionRendererProps) {
  const [otherText, setOtherText] = useState('');

  // Extract "other" value from the value array if it exists
  const otherValue = value.find(v => v.startsWith('other:'));
  const otherValueText = otherValue ? otherValue.replace('other:', '') : '';
  
  // Initialize otherText if we have a value
  React.useEffect(() => {
    if (otherValueText && !otherText) {
      setOtherText(otherValueText);
    }
  }, [otherValueText, otherText]);
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    let newValue = [...value];
    
    if (checked) {
      // Check if we're at the maximum limit
      if (question.maxSelections && newValue.length >= question.maxSelections) {
        // Don't add if we've reached the maximum
        return;
      }
      
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

  const handleOtherToggle = (checked: boolean) => {
    if (!onChange) return;

    let newValue = [...value];
    
    if (checked) {
      // Check if we're at the maximum limit
      if (question.maxSelections && newValue.length >= question.maxSelections) {
        return;
      }
      
      // Add "other" option
      const otherOption = otherText ? `other:${otherText}` : 'other:';
      if (!newValue.includes(otherOption)) {
        newValue.push(otherOption);
      }
    } else {
      // Remove "other" option
      newValue = newValue.filter(v => !v.startsWith('other:'));
      setOtherText('');
    }

    onChange(newValue);
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    
    if (!onChange) return;

    // Update the "other" value in the array
    let newValue = [...value];
    const otherIndex = newValue.findIndex(v => v.startsWith('other:'));
    
    if (otherIndex !== -1) {
      newValue[otherIndex] = `other:${text}`;
      onChange(newValue);
    }
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = value.includes(option.value.toString());
          const isDisabled = isPreviewMode || !!(
            question.maxSelections && 
            !isSelected && 
            value.length >= question.maxSelections
          );
          
          return (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${question.id}-${option.id}`}
                  checked={isSelected}
                  onChange={(e) => handleOptionChange(option.value.toString(), e.target.checked)}
                  disabled={isDisabled}
                  className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <Label 
                  htmlFor={`${question.id}-${option.id}`}
                  className={`text-sm ${
                    isPreviewMode || isDisabled ? 'text-gray-500' : 'cursor-pointer'
                  }`}
                >
                  {option.label}
                </Label>
              </div>
              
              {/* Conditional Questions */}
              {option.hasConditionalQuestions && 
               option.conditionalQuestions && 
               isSelected && (
                <div className="ml-6 mt-3 p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
                  <div className="text-sm font-medium text-blue-700 mb-3">
                    Additional questions for "{option.label}":
                  </div>
                  <div className="space-y-4">
                    {option.conditionalQuestions.map((conditionalQuestion) => (
                      <QuestionRenderer
                        key={conditionalQuestion.id}
                        question={conditionalQuestion}
                        value={conditionalValues[conditionalQuestion.id]}
                        onChange={(value) => onConditionalChange?.(conditionalQuestion.id, value)}
                        error={undefined}
                        isPreviewMode={isPreviewMode}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Other option */}
        {question.allowOther && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${question.id}-other`}
              checked={value.some(v => v.startsWith('other:'))}
              onChange={(e) => handleOtherToggle(e.target.checked)}
              disabled={isPreviewMode || !!(
                question.maxSelections && 
                !value.some(v => v.startsWith('other:')) && 
                value.length >= question.maxSelections
              )}
              className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <Label 
              htmlFor={`${question.id}-other`}
              className={`text-sm ${
                isPreviewMode || !!(question.maxSelections && !value.some(v => v.startsWith('other:')) && value.length >= question.maxSelections) 
                  ? 'text-gray-500' 
                  : 'cursor-pointer'
              }`}
            >
              Other:
            </Label>
            <Input 
              placeholder="Please specify..." 
              className="flex-1" 
              value={otherText}
              onChange={(e) => handleOtherTextChange(e.target.value)}
              disabled={isPreviewMode || !value.some(v => v.startsWith('other:'))}
            />
          </div>
        )}
        
        {/* Selection limits info */}
        {(question.minSelections || question.maxSelections) && (
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>
              {question.minSelections && question.maxSelections ? (
                `Select ${question.minSelections}-${question.maxSelections} options`
              ) : question.minSelections ? (
                `Select at least ${question.minSelections} option${question.minSelections > 1 ? 's' : ''}`
              ) : question.maxSelections ? (
                `Select up to ${question.maxSelections} option${question.maxSelections > 1 ? 's' : ''}`
              ) : null}
            </p>
            <p className="font-medium">
              Selected: {value.length} option{value.length !== 1 ? 's' : ''}
              {question.maxSelections && ` / ${question.maxSelections} max`}
            </p>
            {question.minSelections && value.length < question.minSelections && (
              <p className="text-red-500">
                Please select at least {question.minSelections} option{question.minSelections > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </BaseQuestionRenderer>
  );
}
