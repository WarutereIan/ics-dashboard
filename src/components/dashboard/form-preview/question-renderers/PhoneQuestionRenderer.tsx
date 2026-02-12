import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseQuestionRenderer, BaseQuestionRendererProps } from './BaseQuestionRenderer';
import { PhoneQuestion } from '../../form-creation-wizard/types';

interface PhoneQuestionRendererProps extends BaseQuestionRendererProps {
  question: PhoneQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function PhoneQuestionRenderer({
  question,
  value = '',
  onChange,
  error,
  isPreviewMode
}: PhoneQuestionRendererProps) {
  const [localError, setLocalError] = React.useState<string | undefined>(error);

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Empty is valid if not required
    // Remove common formatting characters
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    // Check if it's all digits and has reasonable length (7-15 digits)
    return /^\d{7,15}$/.test(cleaned);
  };

  const formatPhone = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format based on length (basic formatting)
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    // For international numbers, just add + prefix if not present
    return digits.length > 10 ? `+${digits}` : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleChange = (newValue: string) => {
    // Allow user to type freely, but validate
    onChange?.(newValue);
    
    // Validate on change
    if (newValue && !validatePhone(newValue)) {
      setLocalError('Please enter a valid phone number');
    } else {
      setLocalError(undefined);
    }
  };

  const handleBlur = () => {
    if (value && !validatePhone(value)) {
      setLocalError('Please enter a valid phone number');
    } else {
      setLocalError(undefined);
    }
  };

  return (
    <BaseQuestionRenderer question={question} error={localError || error} isPreviewMode={isPreviewMode}>
      <Input
        type="tel"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={question.placeholder || '+1 (555) 123-4567'}
        className={isPreviewMode ? 'bg-blue-50 border-blue-200' : ''}
      />
    </BaseQuestionRenderer>
  );
}



