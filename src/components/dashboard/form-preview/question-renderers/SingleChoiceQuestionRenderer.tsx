import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { SingleChoiceQuestion, FormQuestion } from '../../form-creation-wizard/types';
import { QuestionRenderer } from '../QuestionRenderer';

interface SingleChoiceQuestionRendererProps extends BaseQuestionRendererProps {
  question: SingleChoiceQuestion;
  value?: string;
  onChange?: (value: string) => void;
  conditionalValues?: Record<string, any>; // Values for conditional questions
  onConditionalChange?: (questionId: string, value: any) => void; // Handler for conditional question changes
}

export function SingleChoiceQuestionRenderer({
  question,
  value,
  onChange,
  error,
  isPreviewMode,
  conditionalValues = {},
  onConditionalChange
}: SingleChoiceQuestionRendererProps) {
  if (question.displayType === 'DROPDOWN') {
    // Find the selected option to check for conditional questions
    const selectedOption = question.options?.find(option => option.value.toString() === value);
    
    return (
      <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
        <div className="space-y-3">
          <Select
            value={value || ''}
            onValueChange={onChange}
            disabled={isPreviewMode}
          >
            <SelectTrigger className={isPreviewMode ? 'bg-gray-50' : ''}>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              )) || (
                <SelectItem value="no-options" disabled>
                  No options available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {/* Conditional Questions for Dropdown */}
          {selectedOption && 
           selectedOption.hasConditionalQuestions && 
           selectedOption.conditionalQuestions && 
           selectedOption.conditionalQuestions.length > 0 && (
            <div className="mt-3 p-4 border-l-4 border-l-blue-500 bg-emerald-50 rounded-r-lg">
              <div className="text-sm font-medium text-emerald-700 mb-3">
                Additional questions for "{selectedOption.label}":
              </div>
              <div className="space-y-4">
                {selectedOption.conditionalQuestions.map((conditionalQuestion) => (
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
      </BaseQuestionRenderer>
    );
  }

  // Radio button display
  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <div className="space-y-3">
        {question.options && question.options.length > 0 ? (
          question.options.map((option) => (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${question.id}-${option.id}`}
                  name={question.id}
                  value={option.value.toString()}
                  checked={value === option.value.toString()}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={isPreviewMode}
                  className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <Label 
                  htmlFor={`${question.id}-${option.id}`}
                  className={`text-sm ${isPreviewMode ? 'text-gray-500' : 'cursor-pointer'}`}
                >
                  {option.label}
                </Label>
              </div>
              
              {/* Conditional Questions */}
              {option.hasConditionalQuestions && 
               option.conditionalQuestions && 
               value === option.value.toString() && (
                <div className="ml-6 mt-3 p-4 border-l-4 border-l-blue-500 bg-emerald-50 rounded-r-lg">
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
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">
            No options available for this question.
          </div>
        )}
      </div>
    </BaseQuestionRenderer>
  );
}