import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { LikertScaleQuestion } from '../../form-creation-wizard/types';

interface LikertScaleQuestionRendererProps extends BaseQuestionRendererProps {
  question: LikertScaleQuestion;
  value?: Record<string, string>; // statement index -> scale value
  onChange?: (value: Record<string, string>) => void;
}

export function LikertScaleQuestionRenderer({
  question,
  value = {},
  onChange,
  error,
  isPreviewMode
}: LikertScaleQuestionRendererProps) {
  const getScaleOptions = () => {
    switch (question.scaleType) {
      case '3_POINT':
        return [
          { value: '1', label: question.labels.negative },
          { value: '2', label: question.labels.neutral || 'Neutral' },
          { value: '3', label: question.labels.positive }
        ];
      case '5_POINT':
        return [
          { value: '1', label: question.labels.negative },
          { value: '2', label: 'Somewhat Disagree' },
          { value: '3', label: question.labels.neutral || 'Neutral' },
          { value: '4', label: 'Somewhat Agree' },
          { value: '5', label: question.labels.positive }
        ];
      case '7_POINT':
        return [
          { value: '1', label: question.labels.negative },
          { value: '2', label: 'Mostly Disagree' },
          { value: '3', label: 'Somewhat Disagree' },
          { value: '4', label: question.labels.neutral || 'Neutral' },
          { value: '5', label: 'Somewhat Agree' },
          { value: '6', label: 'Mostly Agree' },
          { value: '7', label: question.labels.positive }
        ];
    }
  };

  const scaleOptions = getScaleOptions();

  const handleStatementChange = (statementIndex: number, scaleValue: string) => {
    if (!onChange) return;
    
    const newValue = {
      ...value,
      [statementIndex]: scaleValue
    };
    onChange(newValue);
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <div className="space-y-6">
        {/* Scale Header */}
        <div className="grid grid-cols-[1fr,repeat(auto,minmax(0,1fr))] gap-2 text-xs text-center font-medium border-b pb-2">
          <div></div> {/* Empty cell for statement column */}
          {scaleOptions.map((option) => (
            <div key={option.value} className="px-1">
              {option.label}
            </div>
          ))}
        </div>

        {/* Statements */}
        {question.statements.map((statement, index) => (
          <div key={index} className="grid grid-cols-[1fr,repeat(auto,minmax(0,1fr))] gap-2 items-center py-2">
            <div className="text-sm font-medium pr-4">
              {statement}
            </div>
            <RadioGroup
              value={value[index] || ''}
              onValueChange={(scaleValue) => handleStatementChange(index, scaleValue)}
              disabled={isPreviewMode}
              className="flex justify-center gap-2"
            >
              {scaleOptions.map((option) => (
                <div key={option.value} className="flex justify-center">
                  <RadioGroupItem
                    value={option.value}
                    id={`${question.id}-${index}-${option.value}`}
                    disabled={isPreviewMode}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </BaseQuestionRenderer>
  );
}