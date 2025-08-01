import React from 'react';
import { FormQuestion } from '../form-creation-wizard/types';
import {
  ShortTextQuestionRenderer,
  NumberQuestionRenderer,
  SingleChoiceQuestionRenderer,
  MultipleChoiceQuestionRenderer,
  DropdownQuestionRenderer,
  LikertScaleQuestionRenderer,
  DateQuestionRenderer,
  SliderQuestionRenderer
} from './question-renderers';

interface QuestionRendererProps {
  question: FormQuestion;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  isPreviewMode?: boolean;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  error,
  isPreviewMode = false
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
      return (
        <SingleChoiceQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'MULTIPLE_CHOICE':
      return (
        <MultipleChoiceQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'DROPDOWN':
      return (
        <DropdownQuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          isPreviewMode={isPreviewMode}
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