import React from 'react';
import { FormQuestion } from '../form-creation-wizard/types';
import {
  ShortTextQuestionRenderer,
  NumberQuestionRenderer,
  SingleChoiceQuestionRenderer,
  MultipleChoiceQuestionRenderer,

  LikertScaleQuestionRenderer,
  DateQuestionRenderer,
  SliderQuestionRenderer,
  LocationQuestionRenderer,
  MediaUploadQuestionRenderer
} from './question-renderers';

interface QuestionRendererProps {
  question: FormQuestion;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  isPreviewMode?: boolean;
  conditionalValues?: Record<string, any>; // Values for conditional questions
  onConditionalChange?: (questionId: string, value: any) => void; // Handler for conditional question changes
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  error,
  isPreviewMode = false,
  conditionalValues = {},
  onConditionalChange
}: QuestionRendererProps) {
  switch (question.type) {
    case 'SHORT_TEXT':
      return (
        <ShortTextQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'NUMBER':
      return (
        <NumberQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'SINGLE_CHOICE':
      console.log('🔍 QuestionRenderer - SingleChoice:', {
        questionId: question.id,
        questionTitle: question.title,
        conditionalValues: conditionalValues,
        onConditionalChange: !!onConditionalChange,
        hasConditionalQuestions: question.options?.some(opt => opt.hasConditionalQuestions)
      });
      return (
        <SingleChoiceQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
          conditionalValues={conditionalValues}
          onConditionalChange={onConditionalChange}
        />
      );

    case 'MULTIPLE_CHOICE':
      console.log('🔍 QuestionRenderer - MultipleChoice:', {
        questionId: question.id,
        questionTitle: question.title,
        conditionalValues: conditionalValues,
        onConditionalChange: !!onConditionalChange,
        hasConditionalQuestions: question.options?.some(opt => opt.hasConditionalQuestions)
      });
      return (
        <MultipleChoiceQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
          conditionalValues={conditionalValues}
          onConditionalChange={onConditionalChange}
        />
      );



    case 'LIKERT_SCALE':
      return (
        <LikertScaleQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'DATE':
    case 'DATETIME':
      return (
        <DateQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'SLIDER':
      return (
        <SliderQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'LOCATION':
      return (
        <LocationQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          disabled={false}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'IMAGE_UPLOAD':
    case 'VIDEO_UPLOAD':
    case 'AUDIO_UPLOAD':
    case 'FILE_UPLOAD':
      return (
        <MediaUploadQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          disabled={false}
        />
      );

    default:
      return (
        <div className="p-4 border rounded-lg bg-red-50">
          <p className="text-red-800 font-medium">Unsupported Question Type</p>
          <p className="text-red-600 text-sm">
            Question type "{(question as any).type}" is not supported in the preview.
          </p>
        </div>
      );
  }
}