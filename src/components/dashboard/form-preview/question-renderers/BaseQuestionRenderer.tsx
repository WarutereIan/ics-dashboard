import React from 'react';
import { Label } from '@/components/ui/label';
import { FormQuestion } from '../../form-creation-wizard/types';

export interface BaseQuestionRendererProps {
  question: FormQuestion;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  isPreviewMode?: boolean;
}

export function BaseQuestionRenderer({
  question,
  children,
  error,
  isPreviewMode
}: BaseQuestionRendererProps & { children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {/* Question Title and Description */}
      <div>
        <Label className="text-base font-medium">
          {question.title}
          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {question.description && (
          <p className="text-sm text-gray-600 mt-1">{question.description}</p>
        )}
      </div>

      {/* Question Input */}
      <div>
        {children}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-emerald-600">{error}</p>
      )}

      {/* Preview Mode Indicator */}
      {isPreviewMode && (
        <p className="text-xs text-emerald-600 italic">
          Preview mode - responses will not be saved
        </p>
      )}
    </div>
  );
}