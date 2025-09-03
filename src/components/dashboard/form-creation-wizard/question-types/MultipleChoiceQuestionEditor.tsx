import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { ConditionalQuestionsEditor } from './ConditionalQuestionsEditor';
import { MultipleChoiceQuestion, ActivityKPIMapping, ChoiceOption, FormQuestion, QuestionType } from '../types';
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
          { id: uuidv4(), label: 'Option 1', value: 'option1', hasConditionalQuestions: false, conditionalQuestions: [] },
          { id: uuidv4(), label: 'Option 2', value: 'option2', hasConditionalQuestions: false, conditionalQuestions: [] },
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

interface MultipleChoiceQuestionEditorProps {
  question: MultipleChoiceQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
}

export function MultipleChoiceQuestionEditor(props: MultipleChoiceQuestionEditorProps) {
  const { question, onUpdate } = props;
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [otherText, setOtherText] = React.useState('');

  // Ensure options array exists and has at least default options
  const safeOptions = question.options || [
    { id: uuidv4(), label: 'Option 1', value: 'option1', hasConditionalQuestions: false, conditionalQuestions: [] },
    { id: uuidv4(), label: 'Option 2', value: 'option2', hasConditionalQuestions: false, conditionalQuestions: [] },
  ];

  // Initialize options if they don't exist
  if (!question.options || question.options.length === 0) {
    onUpdate({
      options: safeOptions
    } as Partial<FormQuestion>);
  }

  const addOption = () => {
    const newOption: ChoiceOption = {
      id: uuidv4(),
      label: `Option ${safeOptions.length + 1}`,
      value: `option_${safeOptions.length + 1}`,
      hasConditionalQuestions: false,
      conditionalQuestions: [],
    };
    
    onUpdate({
      options: [...safeOptions, newOption]
    } as Partial<FormQuestion>);
  };

  const updateOption = (optionId: string, updates: Partial<ChoiceOption>) => {
    onUpdate({
      options: safeOptions.map(option =>
        option.id === optionId ? { ...option, ...updates } : option
      )
    } as Partial<FormQuestion>);
  };

  const removeOption = (optionId: string) => {
    if (safeOptions.length > 2) {
      onUpdate({
        options: safeOptions.filter(option => option.id !== optionId)
      } as Partial<FormQuestion>);
    }
  };

  const moveOption = (optionId: string, direction: 'up' | 'down') => {
    const currentIndex = safeOptions.findIndex(option => option.id === optionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < safeOptions.length - 1)
    ) {
      const newOptions = [...safeOptions];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newOptions[currentIndex], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[currentIndex]];
      onUpdate({ options: newOptions } as Partial<FormQuestion>);
    }
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => {
      const isSelected = prev.includes(optionId);
      if (isSelected) {
        return prev.filter(id => id !== optionId);
      } else {
        // Check if we're within the selection limits
        if (question.maxSelections && prev.length >= question.maxSelections) {
          return prev; // Don't add if we've reached the maximum
        }
        return [...prev, optionId];
      }
    });
  };

  const handleOtherToggle = (checked: boolean) => {
    if (checked) {
      if (question.maxSelections && selectedOptions.length >= question.maxSelections) {
        return; // Don't add if we've reached the maximum
      }
      setSelectedOptions(prev => [...prev, 'other']);
    } else {
      setSelectedOptions(prev => prev.filter(id => id !== 'other'));
      setOtherText('');
    }
  };

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-4 block">Question Configuration</Label>
          
          <div className="space-y-4">
            {/* Selection Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`minSelections-${question.id}`}>Minimum Selections</Label>
                <Input
                  id={`minSelections-${question.id}`}
                  type="number"
                  value={question.minSelections || ''}
                  onChange={(e) => onUpdate({ minSelections: parseInt(e.target.value) || undefined } as Partial<FormQuestion>)}
                  placeholder="No minimum"
                  min="0"
                  max="20"
                />
              </div>
              
              <div>
                <Label htmlFor={`maxSelections-${question.id}`}>Maximum Selections</Label>
                <Input
                  id={`maxSelections-${question.id}`}
                  type="number"
                  value={question.maxSelections || ''}
                  onChange={(e) => onUpdate({ maxSelections: parseInt(e.target.value) || undefined } as Partial<FormQuestion>)}
                  placeholder="No maximum"
                  min="1"
                  max="20"
                />
              </div>
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-2">
                {safeOptions.map((option, index) => (
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
                        disabled={index === safeOptions.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                        disabled={safeOptions.length <= 2}
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
                {safeOptions.map((option) => (
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
            
                         <div className="space-y-2">
               {safeOptions.map((option) => (
                 <div key={option.id} className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id={`preview-${option.id}`}
                     checked={selectedOptions.includes(option.id)}
                     onChange={() => handleOptionToggle(option.id)}
                     className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                   />
                   <Label htmlFor={`preview-${option.id}`}>{option.label}</Label>
                 </div>
               ))}
               {question.allowOther && (
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="preview-other"
                     checked={selectedOptions.includes('other')}
                     onChange={(e) => handleOtherToggle(e.target.checked)}
                     className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                   />
                   <Label htmlFor="preview-other">Other:</Label>
                   <Input 
                     placeholder="Please specify..." 
                     className="flex-1" 
                     value={otherText}
                     onChange={(e) => setOtherText(e.target.value)}
                     disabled={!selectedOptions.includes('other')}
                   />
                 </div>
               )}
             </div>

                         {(question.minSelections || question.maxSelections) && (
               <div className="mt-2 space-y-1">
                 <p className="text-xs text-gray-500">
                   {question.minSelections && question.maxSelections
                     ? `Select between ${question.minSelections} and ${question.maxSelections} options`
                     : question.minSelections
                     ? `Select at least ${question.minSelections} option${question.minSelections > 1 ? 's' : ''}`
                     : `Select up to ${question.maxSelections} option${question.maxSelections! > 1 ? 's' : ''}`
                   }
                 </p>
                 <p className="text-xs font-medium">
                   Selected: {selectedOptions.length} option{selectedOptions.length !== 1 ? 's' : ''}
                   {question.maxSelections && ` / ${question.maxSelections} max`}
                 </p>
                 {question.minSelections && selectedOptions.length < question.minSelections && (
                   <p className="text-xs text-red-500">
                     Please select at least {question.minSelections} option{question.minSelections > 1 ? 's' : ''}
                   </p>
                 )}
               </div>
             )}
          </div>
        </div>

        {/* Data Information */}
      {/*   <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Database Storage</p>
            <p className="text-xs text-gray-600">
              Selected option values will be stored as ARRAY_TEXT in PostgreSQL
            </p>
          </div>
          <Badge variant="outline">ARRAY_TEXT</Badge>
        </div> */}
      </div>
    </BaseQuestionEditor>
  );
}