export { BaseQuestionEditor } from './BaseQuestionEditor';
export { ShortTextQuestionEditor } from './ShortTextQuestionEditor';
export { SingleChoiceQuestionEditor } from './SingleChoiceQuestionEditor';
export { MultipleChoiceQuestionEditor } from './MultipleChoiceQuestionEditor';
export { NumberQuestionEditor } from './NumberQuestionEditor';
export { DateQuestionEditor } from './DateQuestionEditor';
export { LikertScaleQuestionEditor } from './LikertScaleQuestionEditor';
export { LocationQuestionEditor } from './LocationQuestionEditor';
export { MediaUploadQuestionEditor } from './MediaUploadQuestionEditor';

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

  LIKERT_SCALE: 'Likert Scale',
  YES_NO: 'Yes/No',
  SLIDER: 'Slider',
  LOCATION: 'Location',
  IMAGE_UPLOAD: 'Image Upload',
  VIDEO_UPLOAD: 'Video Upload',
  AUDIO_UPLOAD: 'Audio Upload',
  FILE_UPLOAD: 'File Upload',
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

  LIKERT_SCALE: 'Agreement scale (Strongly Disagree to Strongly Agree)',
  YES_NO: 'Simple yes/no question',
  SLIDER: 'Range slider for numeric values',
  LOCATION: 'GPS location capture with accuracy and address lookup',
  IMAGE_UPLOAD: 'Upload images with size and format restrictions',
  VIDEO_UPLOAD: 'Upload videos with duration and quality settings',
  AUDIO_UPLOAD: 'Upload audio files with duration and quality settings',
  FILE_UPLOAD: 'Upload documents and files with format restrictions',
};

export const QUESTION_TYPE_CATEGORIES = {
  'Text Input': ['SHORT_TEXT', 'EMAIL', 'PHONE'],
  'Numeric Input': ['NUMBER', 'SLIDER'],
  'Date & Time': ['DATE', 'DATETIME'],
  'Choice Questions': ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'YES_NO'],
  'Location & Media': ['LOCATION', 'IMAGE_UPLOAD', 'VIDEO_UPLOAD', 'AUDIO_UPLOAD', 'FILE_UPLOAD'],
  'Advanced': ['LIKERT_SCALE'],
} as const;
