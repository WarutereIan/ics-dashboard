import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { LikertScaleQuestion, LikertScaleStatement } from '../../form-creation-wizard/types';

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
  // Clean implementation - no migration needed
  const getScaleOptions = (scaleType: '3_POINT' | '5_POINT' | '7_POINT', customLabels?: any) => {
    switch (scaleType) {
              case '3_POINT':
          return [
            { value: '1', label: customLabels?.negative || question.defaultLabels.negative },
            { value: '2', label: customLabels?.neutral || question.defaultLabels.neutral || 'Neutral' },
            { value: '3', label: customLabels?.positive || question.defaultLabels.positive }
          ];
      case '5_POINT':
        return [
          { value: '1', label: 'Strongly disagree' },
          { value: '2', label: 'Disagree' },
          { value: '3', label: 'Neither agree nor disagree' },
          { value: '4', label: 'Agree' },
          { value: '5', label: 'Strongly agree' }
        ];
      case '7_POINT':
        return [
          { value: '1', label: 'Strongly disagree' },
          { value: '2', label: 'Disagree' },
          { value: '3', label: 'Somewhat disagree' },
          { value: '4', label: 'Neither agree nor disagree' },
          { value: '5', label: 'Somewhat agree' },
          { value: '6', label: 'Agree' },
          { value: '7', label: 'Strongly agree' }
        ];
      default:
        return [
          { value: '1', label: 'Strongly disagree' },
          { value: '2', label: 'Disagree' },
          { value: '3', label: 'Neither agree nor disagree' },
          { value: '4', label: 'Agree' },
          { value: '5', label: 'Strongly agree' }
        ];
    }
  };



  const handleStatementChange = (statementId: string, scaleValue: string) => {
    if (!onChange) return;
    
    const newValue = {
      ...value,
      [statementId]: scaleValue
    };
    onChange(newValue);
  };

  return (
    <BaseQuestionRenderer question={question} error={error} isPreviewMode={isPreviewMode}>
      <div className="space-y-8">
        {question.statements.map((statement: LikertScaleStatement, index: number) => {
          const scaleOptions = getScaleOptions(statement.scaleType, statement.customLabels);
          
          return (
            <div key={statement.id} className="space-y-4">
              {/* Statement */}
              <div className="text-sm font-medium text-gray-900">
                {statement.text}
              </div>
              
              {/* Scale Type Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {statement.scaleType.replace('_', '-')} Scale
                </span>
              </div>
              
              {/* Likert Scale */}
              <div className="flex justify-center">
                <RadioGroup
                  value={value[statement.id] || ''}
                  onValueChange={(scaleValue) => handleStatementChange(statement.id, scaleValue)}
                  disabled={isPreviewMode}
                  className="flex items-center gap-6"
                >
                  {scaleOptions.map((option) => (
                    <div key={option.value} className="flex flex-col items-center space-y-2">
                      <RadioGroupItem
                        value={option.value}
                        id={`${question.id}-${index}-${option.value}`}
                        disabled={isPreviewMode}
                        className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label 
                        htmlFor={`${question.id}-${index}-${option.value}`}
                        className={`text-xs text-center leading-tight cursor-pointer ${
                          isPreviewMode ? 'text-gray-400' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {option.label.split(' ').map((word: string, wordIndex: number) => (
                          <span key={wordIndex} className="block">
                            {word}
                          </span>
                        ))}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
    </BaseQuestionRenderer>
  );
}