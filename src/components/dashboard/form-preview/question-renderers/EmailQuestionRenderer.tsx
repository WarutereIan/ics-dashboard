import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { EmailQuestion } from '../../form-creation-wizard/types';

interface EmailQuestionRendererProps extends BaseQuestionRendererProps {
  question: EmailQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function EmailQuestionRenderer({
  question,
  value = '',
  onChange,
  error,
  isPreviewMode
}: EmailQuestionRendererProps) {
  const [localError, setLocalError] = React.useState<string | undefined>(error);

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Empty is valid if not required
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (newValue: string) => {
    onChange?.(newValue);
    
    // Validate on change
    if (newValue && !validateEmail(newValue)) {
      setLocalError('Please enter a valid email address');
    } else {
      setLocalError(undefined);
    }
  };

  const handleBlur = () => {
    if (value && !validateEmail(value)) {
      setLocalError('Please enter a valid email address');
    } else {
      setLocalError(undefined);
    }
  };

  return (
    <BaseQuestionRenderer question={question} error={localError || error} isPreviewMode={isPreviewMode}>
      <Input
        type="email"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={question.placeholder || 'example@email.com'}
        className={isPreviewMode ? 'bg-blue-50 border-blue-200' : ''}
      />
    </BaseQuestionRenderer>
  );
}



