import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { LikertScaleQuestion, LikertScaleStatement, ActivityKPIMapping, FormQuestion } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface LikertScaleQuestionEditorProps {
  question: LikertScaleQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
}

export function LikertScaleQuestionEditor(props: LikertScaleQuestionEditorProps) {
  const { question, onUpdate } = props;
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const getScaleOptions = (scaleType: '3_POINT' | '5_POINT' | '7_POINT' | undefined, customLabels?: any) => {
    const safeScaleType = scaleType || '5_POINT';
    
    switch (safeScaleType) {
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

  const addStatement = () => {
    const newStatement: LikertScaleStatement = {
      id: uuidv4(),
      text: `Statement ${question.statements.length + 1}`,
      scaleType: question.defaultScaleType || '5_POINT'
    };
    onUpdate({
      statements: [...question.statements, newStatement]
    } as Partial<FormQuestion>);
  };

  const updateStatement = (index: number, value: string) => {
    const newStatements = [...question.statements];
    newStatements[index] = { ...newStatements[index], text: value };
    onUpdate({
      statements: newStatements
    } as Partial<FormQuestion>);
  };

  const updateStatementScaleType = (index: number, scaleType: '3_POINT' | '5_POINT' | '7_POINT') => {
    const newStatements = [...question.statements];
    newStatements[index] = { ...newStatements[index], scaleType };
    onUpdate({
      statements: newStatements
    } as Partial<FormQuestion>);
  };

  const updateStatementCustomLabels = (index: number, customLabels: any) => {
    const newStatements = [...question.statements];
    newStatements[index] = { 
      ...newStatements[index], 
      customLabels: { ...newStatements[index].customLabels, ...customLabels }
    };
    onUpdate({
      statements: newStatements
    } as Partial<FormQuestion>);
  };

  const removeStatement = (index: number) => {
    if (question.statements.length > 1) {
      const newStatements = question.statements.filter((_, i) => i !== index);
      onUpdate({
        statements: newStatements
      } as Partial<FormQuestion>);
      
      // Remove the selection for this statement
      const newSelectedOptions = { ...selectedOptions };
      delete newSelectedOptions[index];
      setSelectedOptions(newSelectedOptions);
    }
  };

  const moveStatement = (index: number, direction: 'up' | 'down') => {
    const newStatements = [...question.statements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newStatements.length) {
      [newStatements[index], newStatements[targetIndex]] = [newStatements[targetIndex], newStatements[index]];
      onUpdate({
        statements: newStatements
      } as Partial<FormQuestion>);
      
      // Update selections
      const newSelectedOptions = { ...selectedOptions };
      const temp = newSelectedOptions[index];
      newSelectedOptions[index] = newSelectedOptions[targetIndex];
      newSelectedOptions[targetIndex] = temp;
      setSelectedOptions(newSelectedOptions);
    }
  };

  const handleStatementChange = (statementIndex: number, scaleValue: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [statementIndex]: scaleValue
    }));
  };



  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-4 block">Default Scale Configuration</Label>
          
          <div className="space-y-4">
            {/* Default Scale Type */}
            <div>
              <Label>Default Scale Type (for new statements)</Label>
                             <Select 
                 value={question.defaultScaleType} 
                 onValueChange={(value: '3_POINT' | '5_POINT' | '7_POINT') => 
                   onUpdate({ defaultScaleType: value } as Partial<FormQuestion>)
                 }
               >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3_POINT">3-Point Scale</SelectItem>
                  <SelectItem value="5_POINT">5-Point Scale</SelectItem>
                  <SelectItem value="7_POINT">7-Point Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Default Custom Labels (for 3-point scale) */}
                                      {question.defaultScaleType === '3_POINT' && (
               <div className="grid grid-cols-3 gap-4">
                 <div>
                   <Label>Default Negative Label</Label>
                   <Input
                     value={question.defaultLabels.negative}
                     onChange={(e) => onUpdate({ 
                       defaultLabels: { ...question.defaultLabels, negative: e.target.value } 
                     } as Partial<FormQuestion>)}
                     placeholder="e.g., Disagree"
                   />
                 </div>
                 <div>
                   <Label>Default Neutral Label</Label>
                   <Input
                     value={question.defaultLabels.neutral || ''}
                     onChange={(e) => onUpdate({ 
                       defaultLabels: { ...question.defaultLabels, neutral: e.target.value } 
                     } as Partial<FormQuestion>)}
                     placeholder="e.g., Neutral"
                   />
                 </div>
                 <div>
                   <Label>Default Positive Label</Label>
                   <Input
                     value={question.defaultLabels.positive}
                     onChange={(e) => onUpdate({ 
                       defaultLabels: { ...question.defaultLabels, positive: e.target.value } 
                     } as Partial<FormQuestion>)}
                     placeholder="e.g., Agree"
                   />
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Statements Management */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-sm font-medium">Statements</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStatement}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Statement
            </Button>
          </div>

                     <div className="space-y-4">
             {question.statements.map((statement: LikertScaleStatement, index: number) => (
              <div key={statement.id} className="p-4 border rounded bg-white space-y-3">
                {/* Statement Header */}
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-sm font-medium text-gray-500">Statement {index + 1}</span>
                </div>
                
                {/* Statement Text */}
                <div>
                  <Label className="text-sm">Statement Text</Label>
                  <Input
                    value={statement.text}
                    onChange={(e) => updateStatement(index, e.target.value)}
                    placeholder={`Statement ${index + 1}`}
                  />
                </div>

                {/* Scale Type Configuration */}
                <div>
                  <Label className="text-sm">Scale Type</Label>
                  <Select 
                    value={statement.scaleType} 
                    onValueChange={(value: '3_POINT' | '5_POINT' | '7_POINT') => 
                      updateStatementScaleType(index, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3_POINT">3-Point Scale</SelectItem>
                      <SelectItem value="5_POINT">5-Point Scale</SelectItem>
                      <SelectItem value="7_POINT">7-Point Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Labels for 3-point scale */}
                {statement.scaleType === '3_POINT' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-sm">Negative Label</Label>
                      <Input
                        value={statement.customLabels?.negative || ''}
                        onChange={(e) => updateStatementCustomLabels(index, { negative: e.target.value })}
                                                 placeholder={question.defaultLabels.negative}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Neutral Label</Label>
                      <Input
                        value={statement.customLabels?.neutral || ''}
                        onChange={(e) => updateStatementCustomLabels(index, { neutral: e.target.value })}
                                                 placeholder={question.defaultLabels.neutral || 'Neutral'}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Positive Label</Label>
                      <Input
                        value={statement.customLabels?.positive || ''}
                        onChange={(e) => updateStatementCustomLabels(index, { positive: e.target.value })}
                                                 placeholder={question.defaultLabels.positive}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStatement(index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStatement(index, 'down')}
                                         disabled={index === question.statements.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStatement(index)}
                                         disabled={question.statements.length <= 1}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-lg bg-white">
          <Label className="text-sm font-medium mb-4 block text-blue-600">Preview</Label>
                     <div className="space-y-6">
             {question.statements.map((statement: LikertScaleStatement, index: number) => {
              const scaleOptions = getScaleOptions(statement.scaleType || '5_POINT', statement.customLabels);
              
              return (
                <div key={statement.id} className="space-y-4">
                  {/* Statement */}
                  <div className="text-sm font-medium text-gray-900">
                    {statement.text || `Statement ${index + 1}`}
                  </div>
                  
                  {/* Scale Type Badge */}
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {(statement.scaleType || '5_POINT').replace('_', '-')} Scale
                    </span>
                  </div>
                  
                  {/* Likert Scale */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-7 gap-4 w-full max-w-4xl">
                      {scaleOptions.map((option) => (
                        <div key={option.value} className="flex flex-col items-center space-y-1">
                          <input
                            type="radio"
                            id={`preview-${index}-${option.value}`}
                            name={`preview-${index}`}
                            value={option.value}
                            checked={selectedOptions[index] === option.value}
                            onChange={(e) => handleStatementChange(index, e.target.value)}
                            className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          />
                          <Label 
                            htmlFor={`preview-${index}-${option.value}`}
                            className="text-xs text-center leading-tight cursor-pointer text-gray-700 hover:text-gray-900"
                          >
                            {option.label.split(' ').map((word: string, wordIndex: number) => (
                              <span key={wordIndex} className="block">
                                {word}
                              </span>
                            ))}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Information */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Database Storage</p>
            <p className="text-xs text-gray-600">
              Each statement response will be stored as INTEGER in PostgreSQL
            </p>
          </div>
          <Badge variant="outline">INTEGER</Badge>
        </div>
      </div>
    </BaseQuestionEditor>
  );
}




