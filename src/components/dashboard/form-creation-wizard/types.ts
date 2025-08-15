// PostgreSQL compatible data types
export type PostgreSQLDataType = 
  | 'TEXT'           // Variable length text
  | 'VARCHAR'        // Variable length text with limit
  | 'INTEGER'        // 32-bit integer
  | 'BIGINT'         // 64-bit integer
  | 'DECIMAL'        // Exact decimal number
  | 'REAL'           // 32-bit floating point
  | 'DOUBLE'         // 64-bit floating point
  | 'BOOLEAN'        // True/false
  | 'DATE'           // Date only
  | 'TIMESTAMP'      // Date and time
  | 'JSON'           // JSON data
  | 'JSONB'          // Binary JSON data
  | 'UUID'           // Universal unique identifier
  | 'ARRAY_TEXT'     // Array of text values
  | 'ARRAY_INTEGER'; // Array of integer values

// Question types supported by the form builder
export type QuestionType = 
  | 'SHORT_TEXT'          // Text input (single or multi-line)
  | 'NUMBER'              // Numeric input
  | 'EMAIL'               // Email validation
  | 'PHONE'               // Phone number
  | 'DATE'                // Date picker
  | 'DATETIME'            // Date and time picker
  | 'SINGLE_CHOICE'       // Radio buttons
  | 'MULTIPLE_CHOICE'     // Checkboxes
  | 'DROPDOWN'            // Select dropdown
  | 'LIKERT_SCALE'        // Likert scale (Strongly Disagree to Strongly Agree)
  | 'YES_NO'              // Simple yes/no
  | 'SLIDER'              // Range slider
  | 'IMAGE_UPLOAD'        // Image upload
  | 'VIDEO_UPLOAD'        // Video upload
  | 'AUDIO_UPLOAD'        // Audio upload
  | 'FILE_UPLOAD';        // File upload

// Validation rules for form fields
export interface ValidationRule {
  type: 'REQUIRED' | 'MIN_LENGTH' | 'MAX_LENGTH' | 'MIN_VALUE' | 'MAX_VALUE' | 'REGEX' | 'CUSTOM';
  value?: string | number;
  message: string;
}

// Base question interface
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  isRequired: boolean;
  validationRules: ValidationRule[];
  dataType: PostgreSQLDataType;
  order: number;
  conditional?: {
    dependsOn: string; // Question ID
    showWhen: string | number | boolean; // Value to match
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  };
  // Link to project activity
  linkedActivity?: {
    projectId: string;
    outcomeId: string;
    activityId: string;
    kpiContribution?: {
      kpiId: string;
      weight: number; // How much this question contributes to the KPI (0-1)
      aggregationType: 'SUM' | 'COUNT' | 'AVERAGE' | 'MIN' | 'MAX';
    };
  };
}

// Specific question types with their options
export interface ShortTextQuestion extends BaseQuestion {
  type: 'SHORT_TEXT';
  placeholder?: string;
}

export interface EmailQuestion extends BaseQuestion {
  type: 'EMAIL';
  placeholder?: string;
}

export interface PhoneQuestion extends BaseQuestion {
  type: 'PHONE';
  placeholder?: string;
}


export interface NumberQuestion extends BaseQuestion {
  type: 'NUMBER';
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  value: string | number;
  isOther?: boolean; // Allows custom text input
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'SINGLE_CHOICE';
  options: ChoiceOption[];
  displayType: 'RADIO' | 'DROPDOWN';
  allowOther?: boolean;
}

export interface YesNoQuestion extends BaseQuestion {
  type: 'YES_NO';
  options: ChoiceOption[];
  displayType: 'RADIO' | 'DROPDOWN';
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'MULTIPLE_CHOICE';
  options: ChoiceOption[];
  minSelections?: number;
  maxSelections?: number;
  allowOther?: boolean;
}

export interface DropdownQuestion extends BaseQuestion {
  type: 'DROPDOWN';
  options: ChoiceOption[];
  placeholder?: string;
  allowSearch?: boolean;
}



// Likert Scale Statement with individual configuration
export interface LikertScaleStatement {
  id: string;
  text: string;
  scaleType: '3_POINT' | '5_POINT' | '7_POINT';
  customLabels?: {
    negative?: string;
    neutral?: string;
    positive?: string;
  };
}

export interface LikertScaleQuestion extends BaseQuestion {
  type: 'LIKERT_SCALE';
  statements: LikertScaleStatement[];
  defaultScaleType: '3_POINT' | '5_POINT' | '7_POINT';
  defaultLabels: {
    negative: string;
    neutral?: string;
    positive: string;
  };
}

export interface DateQuestion extends BaseQuestion {
  type: 'DATE' | 'DATETIME';
  minDate?: Date;
  maxDate?: Date;
  defaultValue?: Date;
}





export interface SliderQuestion extends BaseQuestion {
  type: 'SLIDER';
  min: number;
  max: number;
  step: number;
  showValue?: boolean;
  prefix?: string;
  suffix?: string;
}

export interface ImageUploadQuestion extends BaseQuestion {
  type: 'IMAGE_UPLOAD';
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedFormats?: string[]; // e.g., ['jpg', 'jpeg', 'png', 'gif']
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  allowMultiple?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
  compressionQuality?: number; // 0-100
}

export interface VideoUploadQuestion extends BaseQuestion {
  type: 'VIDEO_UPLOAD';
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedFormats?: string[]; // e.g., ['mp4', 'avi', 'mov', 'wmv']
  maxDuration?: number; // in seconds
  minDuration?: number; // in seconds
  allowMultiple?: boolean;
  quality?: 'low' | 'medium' | 'high';
  autoCompress?: boolean;
}

export interface FileUploadQuestion extends BaseQuestion {
  type: 'FILE_UPLOAD';
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedFormats?: string[]; // e.g., ['pdf', 'doc', 'docx', 'txt']
  allowMultiple?: boolean;
  showPreview?: boolean;
  maxFileNameLength?: number;
}

export interface AudioUploadQuestion extends BaseQuestion {
  type: 'AUDIO_UPLOAD';
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedFormats?: string[]; // e.g., ['mp3', 'wav', 'aac', 'ogg']
  maxDuration?: number; // in seconds
  minDuration?: number; // in seconds
  allowMultiple?: boolean;
  quality?: 'low' | 'medium' | 'high';
  autoCompress?: boolean;
}

// Union type for all question types
export type FormQuestion = 
  | ShortTextQuestion
  | EmailQuestion
  | PhoneQuestion
  | NumberQuestion
  | SingleChoiceQuestion
  | YesNoQuestion
  | MultipleChoiceQuestion
  | DropdownQuestion
  | LikertScaleQuestion
  | DateQuestion
  | SliderQuestion
  | ImageUploadQuestion
  | VideoUploadQuestion
  | FileUploadQuestion
  | AudioUploadQuestion;

// Form section for organizing questions
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: FormQuestion[];
  conditional?: {
    dependsOn: string; // Question ID
    showWhen: string | number | boolean;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  };
}

// Form settings and configuration
export interface FormSettings {
  requireAuthentication: boolean;
  allowedRoles?: ('global-admin' | 'country-admin' | 'project-admin' | 'branch-admin' | 'viewer')[];
  customCss?: string;
  thankYouMessage: string;
  notificationEmails: string[];
  expiryDate?: Date;
}

// Main form definition
export interface Form {
  id: string;
  title: string;
  description?: string;
  projectId: string; // Which project this form belongs to
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  version: number;
  sections: FormSection[];
  settings: FormSettings;
  // Analytics and metadata
  responseCount: number;
  lastResponseAt?: Date;
  tags: string[];
  category?: string;
}

// Media attachment for file uploads
export interface MediaAttachment {
  id: string;
  questionId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: Date;
}

// Form response data
export interface FormResponse {
  id: string;
  formId: string;
  formVersion: number;
  respondentId?: string; // If authenticated
  respondentEmail?: string;
  startedAt: Date;
  submittedAt?: Date;
  isComplete: boolean;
  ipAddress?: string;
  userAgent?: string;
  source?: string; // How they accessed the form
  // The actual response data
  data: Record<string, any>; // Question ID -> response value
  // Media attachments for file upload questions
  attachments?: MediaAttachment[];
}

// Form analytics and reporting
export interface FormAnalytics {
  formId: string;
  totalViews: number;
  totalStarted: number;
  totalCompleted: number;
  completionRate: number;
  averageCompletionTime: number; // in seconds
  abandonmentPoints: { questionId: string; count: number; }[];
  responsesByDay: { date: string; count: number; }[];
  // Question-specific analytics
  questionAnalytics: {
    questionId: string;
    responseCount: number;
    skipCount: number;
    // For choice questions
    choiceDistribution?: { option: string; count: number; percentage: number; }[];
    // For numeric questions
    numericStats?: { min: number; max: number; average: number; median: number; };
    // For text questions
    textAnalytics?: { wordCount: number; commonWords: string[]; sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; };
  }[];
}

// Form template for reusability
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  previewImage?: string;
  sections: Omit<FormSection, 'id'>[];
  settings: FormSettings;
  usageCount: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

// Wizard state for form creation
export interface FormWizardState {
  currentStep: number;
  form: Partial<Form>;
  availableProjects: { id: string; name: string; }[];
  availableActivities: { 
    projectId: string; 
    outcomeId: string; 
    activityId: string; 
    activityName: string; 
    outcomeName: string; 
  }[];
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

// Integration with project activities
export interface ActivityKPIMapping {
  activityId: string;
  activityName: string;
  outcomeId: string;
  outcomeName: string;
  projectId: string;
  projectName: string;
  availableKPIs: {
    id: string;
    name: string;
    unit: string;
    target: number;
    dataType: PostgreSQLDataType;
  }[];
}

// Data export formats
export interface ExportOptions {
  format: 'CSV' | 'EXCEL' | 'JSON' | 'PDF' | 'SPSS';
  includeMetadata: boolean;
  dateRange?: { from: Date; to: Date; };
  questionIds?: string[]; // Specific questions to export
  respondentFilters?: {
    authenticated?: boolean;
    completedOnly?: boolean;
    source?: string;
  };
}

// Workflow and approval system
export interface FormWorkflow {
  id: string;
  formId: string;
  steps: {
    id: string;
    name: string;
    assignedTo: string[];
    requiredApprovals: number;
    currentApprovals: string[]; // User IDs who approved
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    comments?: string;
    dueDate?: Date;
  }[];
  currentStepIndex: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

// Form sharing and permissions
export interface FormPermissions {
  formId: string;
  permissions: {
    userId: string;
    role: 'VIEWER' | 'EDITOR' | 'ADMIN';
    canViewResponses: boolean;
    canExportData: boolean;
    canEditForm: boolean;
    canDeleteForm: boolean;
    canManagePermissions: boolean;
  }[];
  isPublic: boolean;
  allowAnonymousResponses: boolean;
  restrictedDomains?: string[]; // Email domains that can access
}
   

// Form sharing and permissions
export interface FormPermissions {
  formId: string;
  permissions: {
    userId: string;
    role: 'VIEWER' | 'EDITOR' | 'ADMIN';
    canViewResponses: boolean;
    canExportData: boolean;
    canEditForm: boolean;
    canDeleteForm: boolean;
    canManagePermissions: boolean;
  }[];
  isPublic: boolean;
  allowAnonymousResponses: boolean;
  restrictedDomains?: string[]; // Email domains that can access
}