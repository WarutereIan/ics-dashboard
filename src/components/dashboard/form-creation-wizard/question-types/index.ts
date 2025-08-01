export { BaseQuestionEditor } from './BaseQuestionEditor';
export { ShortTextQuestionEditor } from './ShortTextQuestionEditor';
export { SingleChoiceQuestionEditor } from './SingleChoiceQuestionEditor';
export { MultipleChoiceQuestionEditor } from './MultipleChoiceQuestionEditor';
export { NumberQuestionEditor } from './NumberQuestionEditor';
export { DateQuestionEditor } from './DateQuestionEditor';

// Question type mapping for dynamic rendering
import { QuestionType } from '../types';

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  SHORT_TEXT: 'Text Input',
  NUMBER: 'Number Input',
  EMAIL: 'Email',
  PHONE: 'Phone Number',
  DATE: 'Date',
  DATETIME: 'Date & Time',
  SINGLE_CHOICE: 'Single Choice',
  MULTIPLE_CHOICE: 'Multiple Choice',
  DROPDOWN: 'Dropdown',
  LIKERT_SCALE: 'Likert Scale',
  YES_NO: 'Yes/No',
  SLIDER: 'Slider',
};

export const QUESTION_TYPE_DESCRIPTIONS: Record<QuestionType, string> = {
  SHORT_TEXT: 'Text input for names, descriptions, and general text responses',
  NUMBER: 'Numeric input with validation and constraints',
  EMAIL: 'Email input with built-in validation',
  PHONE: 'Phone number input with formatting',
  DATE: 'Date picker for selecting dates',
  DATETIME: 'Date and time picker',
  SINGLE_CHOICE: 'Radio buttons or dropdown for one selection',
  MULTIPLE_CHOICE: 'Checkboxes for multiple selections',
  DROPDOWN: 'Select dropdown menu',
  LIKERT_SCALE: 'Agreement scale (Strongly Disagree to Strongly Agree)',
  YES_NO: 'Simple yes/no question',
  SLIDER: 'Range slider for numeric values',
};

export const QUESTION_TYPE_CATEGORIES = {
  'Text Input': ['SHORT_TEXT', 'EMAIL', 'PHONE'],
  'Numeric Input': ['NUMBER', 'SLIDER'],
  'Date & Time': ['DATE', 'DATETIME'],
  'Choice Questions': ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'DROPDOWN', 'YES_NO'],
  'Advanced': ['LIKERT_SCALE'],
} as const;