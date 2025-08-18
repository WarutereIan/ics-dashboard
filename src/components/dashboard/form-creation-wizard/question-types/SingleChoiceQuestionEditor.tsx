import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { ConditionalQuestionsEditor } from './ConditionalQuestionsEditor';
import { SingleChoiceQuestion, ActivityKPIMapping, ChoiceOption, FormQuestion, QuestionType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create questions with proper defaults
function createQuestionWithDefaults(baseQuestion: any, questionType: QuestionType): FormQuestion {
  switch (questionType) {
    case 'SHORT_TEXT':
      return {
        ...baseQuestion,
        placeholder: 'Enter your response...',
      };
    
    case 'NUMBER':
      return {
        ...baseQuestion,
        placeholder: 'Enter a number',
        step: 1,
      };
    
    case 'SINGLE_CHOICE':
      return {
        ...baseQuestion,
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1', hasConditionalQuestions: false, conditionalQuestions: [] },
          { id: uuidv4(), label: 'Option 2', value: 'option2', hasConditionalQuestions: false, conditionalQuestions: [] },
        ],
        displayType: 'RADIO',
      };
    
    case 'MULTIPLE_CHOICE':
      return {
        ...baseQuestion,
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' },
        ],
      };
    
    case 'LIKERT_SCALE':
      return {
        ...baseQuestion,
        statements: [
          {
            id: uuidv4(),
            text: 'Statement 1',
            scaleType: '5_POINT'
          }
        ],
        defaultScaleType: '5_POINT',
        defaultLabels: {
          negative: 'Strongly Disagree',
          neutral: 'Neutral',
          positive: 'Strongly Agree',
        },
      };
    
    case 'YES_NO':
      return {
        ...baseQuestion,
        type: 'SINGLE_CHOICE',
        options: [
          { id: uuidv4(), label: 'Yes', value: 'yes', hasConditionalQuestions: false, conditionalQuestions: [] },
          { id: uuidv4(), label: 'No', value: 'no', hasConditionalQuestions: false, conditionalQuestions: [] },
        ],
        displayType: 'RADIO',
      };
    
    case 'DATE':
    case 'DATETIME':
      return {
        ...baseQuestion,
      };
    
    case 'LOCATION':
      return {
        ...baseQuestion,
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        allowManualInput: true,
        captureAddress: false,
        showMap: false,
      };

    case 'IMAGE_UPLOAD':
      return {
        ...baseQuestion,
        maxFiles: 10,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        allowMultiple: true,
        previewSize: 'medium',
        compressionQuality: 80,
      };

    case 'VIDEO_UPLOAD':
      return {
        ...baseQuestion,
        maxFiles: 4,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedFormats: ['mp4', 'avi', 'mov', 'wmv', 'webm'],
        allowMultiple: true,
        quality: 'medium',
        autoCompress: true,
      };

    case 'AUDIO_UPLOAD':
      return {
        ...baseQuestion,
        maxFiles: 3,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedFormats: ['mp3', 'wav', 'aac', 'ogg', 'm4a'],
        allowMultiple: true,
        quality: 'medium',
        autoCompress: true,
      };

    case 'FILE_UPLOAD':
      return {
        ...baseQuestion,
        maxFiles: 5,
        maxFileSize: 25 * 1024 * 1024, // 25MB
        allowedFormats: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
        allowMultiple: true,
        showPreview: true,
      };
    
    default:
      return baseQuestion;
  }
}

interface SingleChoiceQuestionEditorProps {
  question: SingleChoiceQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
}

export function SingleChoiceQuestionEditor(props: SingleChoiceQuestionEditorProps) {
  const { question, onUpdate } = props;

  const addOption = () => {
    const newOption: ChoiceOption = {
      id: uuidv4(),
      label: `Option ${question.options.length + 1}`,
      value: `option_${question.options.length + 1}`,
    };
    
    onUpdate({
      options: [...question.options, newOption]
    } as Partial<FormQuestion>);
  };

  const updateOption = (optionId: string, updates: Partial<ChoiceOption>) => {
    onUpdate({
      options: question.options.map(option =>
        option.id === optionId ? { ...option, ...updates } : option
      )
    } as Partial<FormQuestion>);
  };

  const removeOption = (optionId: string) => {
    if (question.options.length > 2) {
      onUpdate({
        options: question.options.filter(option => option.id !== optionId)
      } as Partial<FormQuestion>);
    }
  };

  const moveOption = (optionId: string, direction: 'up' | 'down') => {
    const currentIndex = question.options.findIndex(option => option.id === optionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < question.options.length - 1)
    ) {
      const newOptions = [...question.options];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newOptions[currentIndex], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[currentIndex]];
      onUpdate({ options: newOptions } as Partial<FormQuestion>);
    }
  };

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-4 block">Question Configuration</Label>
          
          <div className="space-y-4">
            {/* Display Type */}
            <div>
              <Label>Display Type</Label>
              <Select 
                value={question.displayType} 
                onValueChange={(value: 'RADIO' | 'DROPDOWN') => onUpdate({ displayType: value } as Partial<FormQuestion>)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RADIO">Radio Buttons</SelectItem>
                  <SelectItem value="DROPDOWN">Dropdown Menu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Allow Other Option */}
            <div className="flex items-center justify-between">
              <Label>Allow "Other" option with text input</Label>
              <Switch
                checked={question.allowOther || false}
                onCheckedChange={(checked) => onUpdate({ allowOther: checked } as Partial<FormQuestion>)}
              />
            </div>

            {/* Options Management */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Answer Options</Label>
               
              </div>

              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2 p-2 border rounded">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) => updateOption(option.id, { label: e.target.value })}
                        placeholder="Option label"
                      />
                      <Input
                        value={option.value}
                        onChange={(e) => updateOption(option.id, { value: e.target.value })}
                        placeholder="Option value"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOption(option.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOption(option.id, 'down')}
                        disabled={index === question.options.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                        disabled={question.options.length <= 2}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Questions Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium">Conditional Questions (Optional)</Label>
                <Badge variant="outline" className="text-xs">
                  Add questions that appear when specific options are selected
                </Badge>
              </div>
              
              <div className="space-y-4">
                {question.options.map((option) => (
                  <div key={option.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        When "{option.label}" is selected:
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {(option.conditionalQuestions?.length || 0)} question{(option.conditionalQuestions?.length || 0) !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <ConditionalQuestionsEditor
                      optionId={option.id}
                      optionLabel={option.label}
                      conditionalQuestions={option.conditionalQuestions || []}
                      availableActivities={props.availableActivities}
                      onUpdateConditionalQuestions={(questions) => {
                        updateOption(option.id, { 
                          conditionalQuestions: questions,
                          hasConditionalQuestions: questions.length > 0
                        });
                      }}
                      onLinkQuestionToActivity={(questionId, activityMapping) => {
                        // This would need to be handled at the form level
                        // For now, we'll just update the question directly
                        const updatedQuestions = (option.conditionalQuestions || []).map(q =>
                          q.id === questionId ? { ...q, linkedActivity: activityMapping } : q
                        );
                        updateOption(option.id, { 
                          conditionalQuestions: updatedQuestions,
                          hasConditionalQuestions: updatedQuestions.length > 0
                        });
                      }}
                      sectionId={`conditional-${option.id}`}
                      onAddQuestion={(sectionId, questionType) => {
                        // Add the new question to the conditional questions
                        const newQuestion = createQuestionWithDefaults({
                          id: uuidv4(),
                          type: questionType,
                          title: '',
                          description: '',
                          isRequired: false,
                          validationRules: [],
                          dataType: 'TEXT',
                          order: (option.conditionalQuestions || []).length,
                          linkedActivity: undefined,
                        }, questionType);
                        
                        const updatedQuestions = [...(option.conditionalQuestions || []), newQuestion];
                        updateOption(option.id, { 
                          conditionalQuestions: updatedQuestions,
                          hasConditionalQuestions: updatedQuestions.length > 0
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-lg bg-white">
          <Label className="text-sm font-medium mb-2 block text-blue-600">Preview</Label>
          <div className="space-y-2">
            <Label className="font-medium">
              {question.title || 'Question Title'}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            
                         {question.displayType === 'RADIO' ? (
               <div className="space-y-3">
                 {question.options.map((option) => (
                   <div key={option.id} className="flex items-center space-x-2">
                     <input
                       type="radio"
                       id={`preview-${option.id}`}
                       name={`preview-${question.id}`}
                       value={String(option.value)}
                       className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                     />
                     <Label htmlFor={`preview-${option.id}`}>{option.label}</Label>
                   </div>
                 ))}
                 {question.allowOther && (
                   <div className="flex items-center space-x-2">
                     <input
                       type="radio"
                       id="preview-other"
                       name={`preview-${question.id}`}
                       value="other"
                       className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                     />
                     <Label htmlFor="preview-other">Other:</Label>
                     <Input placeholder="Please specify..." className="flex-1" />
                   </div>
                 )}
               </div>
             ) : (
               <Select>
                 <SelectTrigger>
                   <SelectValue placeholder="Select an option..." />
                 </SelectTrigger>
                 <SelectContent>
                   {question.options.map((option) => (
                     <SelectItem key={option.id} value={String(option.value)}>
                       {option.label}
                     </SelectItem>
                   ))}
                   {question.allowOther && (
                     <SelectItem value="other">Other (specify)</SelectItem>
                   )}
                 </SelectContent>
               </Select>
             )}
          </div>
        </div>

        {/* Data Information */}
       {/*  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Database Storage</p>
            <p className="text-xs text-gray-600">
              Selected option value will be stored as TEXT in PostgreSQL
            </p>
          </div>
          <Badge variant="outline">TEXT</Badge>
        </div> */}
      </div>
    </BaseQuestionEditor>
  );
}