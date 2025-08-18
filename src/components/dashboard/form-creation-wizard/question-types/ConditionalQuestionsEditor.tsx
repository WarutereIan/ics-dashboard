import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChevronDown, ChevronRight, Trash2, Copy } from 'lucide-react';
import { FormQuestion, QuestionType, ActivityKPIMapping } from '../types';
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
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' },
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
          { id: uuidv4(), label: 'Yes', value: 'yes' },
          { id: uuidv4(), label: 'No', value: 'no' },
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
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_CATEGORIES,
  BaseQuestionEditor,
  ShortTextQuestionEditor,
  SingleChoiceQuestionEditor,
  MultipleChoiceQuestionEditor,
  NumberQuestionEditor,
  DateQuestionEditor,
  LikertScaleQuestionEditor,
  LocationQuestionEditor,
  MediaUploadQuestionEditor,
} from './index';

interface ConditionalQuestionsEditorProps {
  optionId: string;
  optionLabel: string;
  conditionalQuestions: FormQuestion[];
  availableActivities: ActivityKPIMapping[];
  onUpdateConditionalQuestions: (questions: FormQuestion[]) => void;
  onLinkQuestionToActivity: (questionId: string, activityMapping: ActivityKPIMapping) => void;
  sectionId?: string; // Section ID for adding next question within conditionals
  onAddQuestion?: (sectionId: string, questionType: QuestionType) => void; // Function to add next question
}

export function ConditionalQuestionsEditor({
  optionId,
  optionLabel,
  conditionalQuestions,
  availableActivities,
  onUpdateConditionalQuestions,
  onLinkQuestionToActivity,
  sectionId,
  onAddQuestion,
}: ConditionalQuestionsEditorProps) {
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('SHORT_TEXT');
  const [isOpen, setIsOpen] = useState(false);

  const addConditionalQuestion = (questionType: QuestionType) => {
    const baseQuestion = {
      id: uuidv4(),
      type: questionType,
      title: '',
      description: '',
      isRequired: false,
      validationRules: [],
      dataType: 'TEXT',
      order: conditionalQuestions.length,
      linkedActivity: undefined,
    };

    const newQuestion = createQuestionWithDefaults(baseQuestion, questionType);
    onUpdateConditionalQuestions([...conditionalQuestions, newQuestion]);
  };

  // Function to handle adding questions within the conditional section
  const handleAddQuestionInConditional = (conditionalSectionId: string, questionType: QuestionType) => {
    // For conditional questions, we add them to the current conditional questions array
    addConditionalQuestion(questionType);
  };

  const updateConditionalQuestion = (questionId: string, updates: Partial<FormQuestion>) => {
    const updatedQuestions = conditionalQuestions.map(q =>
      q.id === questionId ? { ...q, ...updates } as FormQuestion : q
    );
    onUpdateConditionalQuestions(updatedQuestions);
  };

  const removeConditionalQuestion = (questionId: string) => {
    const updatedQuestions = conditionalQuestions.filter(q => q.id !== questionId);
    onUpdateConditionalQuestions(updatedQuestions);
  };

  const duplicateConditionalQuestion = (questionId: string) => {
    const questionToDuplicate = conditionalQuestions.find(q => q.id === questionId);
    if (questionToDuplicate) {
      const duplicatedQuestion: FormQuestion = {
        ...questionToDuplicate,
        id: uuidv4(),
        title: `${questionToDuplicate.title} (Copy)`,
        order: conditionalQuestions.length,
      };
      onUpdateConditionalQuestions([...conditionalQuestions, duplicatedQuestion]);
    }
  };

  const renderConditionalQuestionEditor = (question: FormQuestion) => {
    const commonProps = {
      question,
      onUpdate: (updates: Partial<FormQuestion>) => updateConditionalQuestion(question.id, updates),
      onDelete: () => removeConditionalQuestion(question.id),
      onDuplicate: () => duplicateConditionalQuestion(question.id),
      availableActivities,
      onLinkToActivity: (activityMapping: ActivityKPIMapping) => 
        onLinkQuestionToActivity(question.id, activityMapping),
      sectionId: `conditional-${optionId}`, // Use a unique section ID for conditional questions
      onAddQuestion: handleAddQuestionInConditional, // Pass the conditional add function
    };

    switch (question.type) {
      case 'SHORT_TEXT':
      case 'EMAIL':
      case 'PHONE':
        return <ShortTextQuestionEditor {...commonProps} question={question as any} />;
      case 'SINGLE_CHOICE':
      case 'YES_NO':
        return <SingleChoiceQuestionEditor {...commonProps} question={question as any} />;
      case 'MULTIPLE_CHOICE':
        return <MultipleChoiceQuestionEditor {...commonProps} question={question} />;
      case 'NUMBER':
        return <NumberQuestionEditor {...commonProps} question={question} />;
      case 'DATE':
      case 'DATETIME':
        return <DateQuestionEditor {...commonProps} question={question} />;
      case 'LIKERT_SCALE':
        return <LikertScaleQuestionEditor {...commonProps} question={question as any} />;
      case 'LOCATION':
        return <LocationQuestionEditor {...commonProps} question={question as any} />;
      case 'IMAGE_UPLOAD':
      case 'VIDEO_UPLOAD':
      case 'AUDIO_UPLOAD':
      case 'FILE_UPLOAD':
        return <MediaUploadQuestionEditor {...commonProps} question={question} />;
      default:
        return <BaseQuestionEditor {...commonProps} />;
    }
  };

    return (
    <div onClick={(e) => e.stopPropagation()}>
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Conditional Questions
              </Badge>
              <span className="text-sm font-medium text-blue-900">
                When "{optionLabel}" is selected
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {conditionalQuestions.length} question{conditionalQuestions.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>

        {isOpen && (
          <CardContent className="space-y-4">
            {/* Add Conditional Question */}
            <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <Plus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900">Add Conditional Question</h4>
                    <p className="text-sm text-blue-700">
                      Add a question that appears when "{optionLabel}" is selected
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Question Type</label>
                      <Select value={selectedQuestionType} onValueChange={(value: QuestionType) => setSelectedQuestionType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(QUESTION_TYPE_CATEGORIES).map(([category, types]) => (
                            <React.Fragment key={category}>
                              <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                                {category}
                              </div>
                              {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {QUESTION_TYPE_LABELS[type]}
                                </SelectItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        onClick={() => addConditionalQuestion(selectedQuestionType)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conditional Questions List */}
            {conditionalQuestions.length === 0 ? (
              <Card className="border-dashed border-2 border-blue-300">
                <CardContent className="pt-4">
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-blue-600 mb-1">No conditional questions yet</p>
                    <p className="text-sm text-blue-500">
                      Add questions that will appear when this option is selected
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {conditionalQuestions.map((question, index) => (
                  <div key={question.id} className="relative">
                    {/* Question Number Badge */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                    {renderConditionalQuestionEditor(question)}
                  </div>
                ))}
              </div>
                         )}
           </CardContent>
         )}
       </Card>
     </div>
   );
 }
