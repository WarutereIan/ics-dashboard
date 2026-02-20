// Feedback system types and classifications

/** ICS SOP feedback categories 1–8; 3–5 = programmatic (30d), 6–7 = sensitive (72h) */
export type SopCategory = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const SOP_CATEGORY_LABELS: Record<SopCategory, string> = {
  1: 'Appreciation for services or support',
  2: 'Request for information',
  3: 'Request for assistance',
  4: 'Minor dissatisfaction or suggestion for improvement',
  5: 'Major dissatisfaction or suggestion for improvement',
  6: 'Safeguarding / child protection / PSEA',
  7: 'Breach of code of conduct and HR policies',
  8: 'Allegations out of ICS SP scope',
};

/** Full descriptions from Feedback Complaint Recording Form (SOP) for category selection. */
export const SOP_CATEGORY_DESCRIPTIONS: Record<SopCategory, string> = {
  1: 'Appreciation for services or support',
  2: 'Request for information',
  3: 'Request for assistance',
  4: 'Minor dissatisfaction with activities (e.g., missing items from kits, lack of follow-up, etc.)',
  5: 'Major dissatisfaction with activities (e.g., poor quality items, beneficiary selection issues, safety of children/adults being put at risk, e.g. unsafe construction site, etc.)',
  6: 'Breaches Safeguarding, child protection and prevention of sexual abuse and exploitation (PSEA) (verbal, physical or sexual abuse, sexual exploitation of beneficiaries, etc.)',
  7: 'Breach of code of conduct and HR Policies (e.g. allegations of inappropriate behaviour or misconduct by ICS or partner staff or representatives including fraud, theft, corruption (e.g., misappropriation of goods, requests for payment))',
  8: 'Allegations out of ICS SP scope',
};

/** Map SOP category (1–8) to backend category ID from seed. */
export const SOP_CATEGORY_TO_CATEGORY_ID: Record<SopCategory, string> = {
  1: 'general_feedback',
  2: 'request_information',
  3: 'request_assistance',
  4: 'minor_dissatisfaction',
  5: 'major_dissatisfaction',
  6: 'safety_incident',
  7: 'staff_feedback',
  8: 'out_of_scope',
};

/** Programmatic (3–5): close within 30 days. Sensitive (6–7): close within 72 hours. */
export const SOP_CLOSURE_30_DAYS_HOURS = 30 * 24;
export const SOP_CLOSURE_72_HOURS = 72;

export function isSensitiveSopCategory(sopCategory: number | null | undefined): boolean {
  return sopCategory === 6 || sopCategory === 7;
}

export function isProgrammaticSopCategory(sopCategory: number | null | undefined): boolean {
  return sopCategory === 3 || sopCategory === 4 || sopCategory === 5;
}

/** True if submission is not closed/resolved and past its closure due date. */
export function isOverdueForClosure(
  status: string,
  closureDueDate: Date | string | null
): boolean {
  if (status === 'CLOSED' || status === 'RESOLVED' || closureDueDate == null) return false;
  return new Date(closureDueDate) < new Date();
}

export function getSopClosureDeadlineHours(sopCategory: number | null | undefined): number | null {
  if (sopCategory == null) return null;
  if (sopCategory === 6 || sopCategory === 7) return SOP_CLOSURE_72_HOURS;
  if (sopCategory >= 1 && sopCategory <= 5) return SOP_CLOSURE_30_DAYS_HOURS;
  return null; // e.g. 8 = out of scope
}

/** Due date for closure from submission receipt (submittedAt). */
export function getClosureDueDate(
  submittedAt: Date | string,
  sopCategory: number | null | undefined,
  closureDeadlineHours?: number | null
): Date | null {
  const hours = closureDeadlineHours ?? getSopClosureDeadlineHours(sopCategory);
  if (hours == null) return null;
  const t = typeof submittedAt === 'string' ? new Date(submittedAt) : submittedAt;
  const due = new Date(t.getTime() + hours * 60 * 60 * 1000);
  return due;
}

export type FeedbackType = 
  | 'GENERAL'           // General feedback about the program
  | 'ISSUE'             // Reporting an issue or problem
  | 'EMERGENCY'         // Emergency situation requiring immediate attention
  | 'COMPLAINT'         // Formal complaint
  | 'SUGGESTION'        // Improvement suggestion
  | 'STAFF_FEEDBACK'    // Feedback about program staff
  | 'COMMUNITY_CONCERN' // Community-related concerns
  | 'SAFETY_INCIDENT'   // Safety-related incidents
  | 'RESOURCE_ISSUE'    // Issues with resources or materials
  | 'PROCESS_FEEDBACK'; // Feedback about program processes

export type FeedbackPriority = 
  | 'LOW'       // Can be addressed in normal timeframe
  | 'MEDIUM'    // Should be addressed within a few days
  | 'HIGH'      // Urgent, should be addressed within 24 hours
  | 'CRITICAL'; // Emergency, immediate attention required

export type FeedbackStatus = 
  | 'SUBMITTED'     // Initial submission
  | 'ACKNOWLEDGED'  // Received and acknowledged
  | 'IN_PROGRESS'   // Being worked on
  | 'RESOLVED'      // Issue resolved
  | 'CLOSED'        // Feedback closed
  | 'ESCALATED';    // Escalated to higher level

export type FeedbackSensitivity = 
  | 'PUBLIC'      // Can be shared openly
  | 'INTERNAL'    // Internal to project team
  | 'CONFIDENTIAL' // Confidential, limited access
  | 'SENSITIVE';   // Highly sensitive, admin only

export type EscalationLevel = 
  | 'NONE'        // No escalation needed
  | 'PROJECT'     // Escalate to project admin
  | 'REGIONAL'    // Escalate to regional manager
  | 'NATIONAL'    // Escalate to national office
  | 'EMERGENCY';  // Emergency escalation

export interface FeedbackCategory {
  id: string;
  name: string;
  description: string;
  type: FeedbackType;
  defaultPriority: FeedbackPriority;
  defaultSensitivity: FeedbackSensitivity;
  escalationLevel: EscalationLevel;
  requiresImmediateNotification: boolean;
  allowedStakeholders: string[]; // Types of stakeholders who can submit this feedback
  /** ICS SOP category 1–8 */
  sopCategory?: number | null;
  /** Closure deadline in hours from receipt (72 for sensitive 6–7, 720 for 1–5) */
  closureDeadlineHours?: number | null;
}

export interface FeedbackForm {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  isActive: boolean;
  allowAnonymous: boolean;
  requireAuthentication: boolean;
  sections: FeedbackFormSection[];
  settings: FeedbackFormSettings;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FeedbackFormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: FeedbackQuestion[];
}

export interface FeedbackQuestion {
  id: string;
  sectionId: string;
  type: FeedbackQuestionType;
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
  config: any;
  conditional?: any;
}

export type FeedbackQuestionType = 
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'NUMBER'
  | 'EMAIL'
  | 'PHONE'
  | 'DATE'
  | 'DATETIME'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'YES_NO'
  | 'LIKERT_SCALE'
  | 'LOCATION'
  | 'IMAGE_UPLOAD'
  | 'FILE_UPLOAD'
  | 'STAKEHOLDER_TYPE'    // Special question type for stakeholder identification
  | 'PRIORITY_SELECTION'  // Special question type for priority selection
  | 'ESCALATION_LEVEL';   // Special question type for escalation level

export interface FeedbackFormSettings {
  allowAnonymous: boolean;
  requireAuthentication: boolean;
  autoAssignPriority: boolean;
  autoEscalate: boolean;
  notificationEmails: string[];
  escalationRules: EscalationRule[];
  confidentialityLevel: FeedbackSensitivity;
  responseRequired: boolean;
  responseDeadline?: number; // Hours
}

export interface EscalationRule {
  id: string;
  condition: string; // e.g., "priority = 'CRITICAL'"
  escalationLevel: EscalationLevel;
  notificationEmails: string[];
  responseTime: number; // Hours
}

export interface FeedbackSubmission {
  id: string;
  formId: string;
  projectId: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  sensitivity: FeedbackSensitivity;
  escalationLevel: EscalationLevel;
  
  // Submitter information
  submitterId?: string; // If authenticated
  submitterEmail?: string;
  submitterName?: string;
  stakeholderType?: string;
  isAnonymous: boolean;
  
  // Submission data
  data: any; // Form responses
  attachments: FeedbackAttachment[];
  
  // Status and workflow
  status: FeedbackStatus;
  assignedTo?: string;
  assignedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  
  // Timestamps
  submittedAt: Date;
  updatedAt: Date;
  
  // Communication
  communications: FeedbackCommunication[];
  internalNotes: FeedbackNote[];
  statusHistory: FeedbackStatusHistory[];
}

export interface FeedbackStatusHistory {
  id: string;
  submissionId: string;
  status: FeedbackStatus;
  previousStatus?: FeedbackStatus;
  changedBy: string;
  changedByName: string;
  reason?: string;
  details?: string;
  assignedTo?: string;
  createdAt: Date;
}

export interface FeedbackAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface FeedbackCommunication {
  id: string;
  type: 'EMAIL' | 'SMS' | 'INTERNAL_NOTE' | 'PUBLIC_RESPONSE';
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  sentBy?: string;
  sentTo?: string;
  sentAt: Date;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
}

export interface FeedbackNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface StakeholderType {
  id: string;
  name: string;
  description: string;
  canSubmitAnonymous: boolean;
  allowedFeedbackTypes: FeedbackType[];
  defaultSensitivity: FeedbackSensitivity;
}

// Default stakeholder types
export const DEFAULT_STAKEHOLDER_TYPES: StakeholderType[] = [
  {
    id: 'community_member',
    name: 'Community Member',
    description: 'Local community member participating in or affected by the program',
    canSubmitAnonymous: true,
    allowedFeedbackTypes: ['GENERAL', 'ISSUE', 'COMPLAINT', 'SUGGESTION', 'COMMUNITY_CONCERN', 'SAFETY_INCIDENT'],
    defaultSensitivity: 'PUBLIC'
  },
  {
    id: 'program_beneficiary',
    name: 'Program Beneficiary',
    description: 'Direct beneficiary of the program services',
    canSubmitAnonymous: true,
    allowedFeedbackTypes: ['GENERAL', 'ISSUE', 'COMPLAINT', 'SUGGESTION', 'STAFF_FEEDBACK', 'RESOURCE_ISSUE'],
    defaultSensitivity: 'INTERNAL'
  },
  {
    id: 'observer',
    name: 'Observer',
    description: 'External observer monitoring program implementation',
    canSubmitAnonymous: false,
    allowedFeedbackTypes: ['GENERAL', 'ISSUE', 'SUGGESTION', 'PROCESS_FEEDBACK'],
    defaultSensitivity: 'CONFIDENTIAL'
  },
  {
    id: 'partner_organization',
    name: 'Partner Organization',
    description: 'Partner organization working with the program',
    canSubmitAnonymous: false,
    allowedFeedbackTypes: ['GENERAL', 'ISSUE', 'SUGGESTION', 'PROCESS_FEEDBACK', 'RESOURCE_ISSUE'],
    defaultSensitivity: 'INTERNAL'
  },
  {
    id: 'government_official',
    name: 'Government Official',
    description: 'Government official involved in or overseeing the program',
    canSubmitAnonymous: false,
    allowedFeedbackTypes: ['GENERAL', 'ISSUE', 'COMPLAINT', 'SUGGESTION', 'PROCESS_FEEDBACK'],
    defaultSensitivity: 'CONFIDENTIAL'
  }
];

// Default feedback categories (aligned with ICS SOP; backend seed may add more)
export const DEFAULT_FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  { id: 'general_feedback', name: 'General Feedback', description: 'General comments, suggestions, or observations', type: 'GENERAL', defaultPriority: 'LOW', defaultSensitivity: 'PUBLIC', escalationLevel: 'NONE', requiresImmediateNotification: false, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization'], sopCategory: 1, closureDeadlineHours: SOP_CLOSURE_30_DAYS_HOURS },
  { id: 'request_information', name: 'Request for Information', description: 'Request for information', type: 'GENERAL', defaultPriority: 'LOW', defaultSensitivity: 'PUBLIC', escalationLevel: 'NONE', requiresImmediateNotification: false, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization', 'government_official'], sopCategory: 2, closureDeadlineHours: SOP_CLOSURE_30_DAYS_HOURS },
  { id: 'request_assistance', name: 'Request for Assistance', description: 'Request for assistance', type: 'ISSUE', defaultPriority: 'MEDIUM', defaultSensitivity: 'INTERNAL', escalationLevel: 'NONE', requiresImmediateNotification: false, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization'], sopCategory: 3, closureDeadlineHours: SOP_CLOSURE_30_DAYS_HOURS },
  { id: 'minor_dissatisfaction', name: 'Minor Dissatisfaction or Suggestion', description: 'Minor dissatisfaction or suggestions for improvement', type: 'SUGGESTION', defaultPriority: 'LOW', defaultSensitivity: 'INTERNAL', escalationLevel: 'NONE', requiresImmediateNotification: false, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization'], sopCategory: 4, closureDeadlineHours: SOP_CLOSURE_30_DAYS_HOURS },
  { id: 'major_dissatisfaction', name: 'Major Dissatisfaction or Suggestion', description: 'Major dissatisfaction or suggestions for improvement', type: 'COMPLAINT', defaultPriority: 'HIGH', defaultSensitivity: 'INTERNAL', escalationLevel: 'PROJECT', requiresImmediateNotification: false, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization', 'government_official'], sopCategory: 5, closureDeadlineHours: SOP_CLOSURE_30_DAYS_HOURS },
  { id: 'safety_incident', name: 'Safeguarding / Child Protection / PSEA', description: 'Safeguarding, child protection, PSEA', type: 'SAFETY_INCIDENT', defaultPriority: 'HIGH', defaultSensitivity: 'CONFIDENTIAL', escalationLevel: 'PROJECT', requiresImmediateNotification: true, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization'], sopCategory: 6, closureDeadlineHours: SOP_CLOSURE_72_HOURS },
  { id: 'staff_feedback', name: 'Breach of Code of Conduct and HR Policies', description: 'Breach of code of conduct and HR policies', type: 'STAFF_FEEDBACK', defaultPriority: 'MEDIUM', defaultSensitivity: 'CONFIDENTIAL', escalationLevel: 'PROJECT', requiresImmediateNotification: false, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer'], sopCategory: 7, closureDeadlineHours: SOP_CLOSURE_72_HOURS },
  { id: 'out_of_scope', name: 'Allegations Out of ICS SP Scope', description: 'Allegations out of ICS SP scope', type: 'GENERAL', defaultPriority: 'LOW', defaultSensitivity: 'CONFIDENTIAL', escalationLevel: 'NONE', requiresImmediateNotification: false, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization', 'government_official'], sopCategory: 8, closureDeadlineHours: undefined },
  { id: 'emergency_report', name: 'Emergency Report', description: 'Emergency situations', type: 'EMERGENCY', defaultPriority: 'CRITICAL', defaultSensitivity: 'SENSITIVE', escalationLevel: 'EMERGENCY', requiresImmediateNotification: true, allowedStakeholders: ['community_member', 'program_beneficiary', 'observer', 'partner_organization', 'government_official'], sopCategory: 6, closureDeadlineHours: SOP_CLOSURE_72_HOURS },
  { id: 'resource_issue', name: 'Resource Issue', description: 'Issues with resources, materials, or facilities', type: 'RESOURCE_ISSUE', defaultPriority: 'MEDIUM', defaultSensitivity: 'INTERNAL', escalationLevel: 'PROJECT', requiresImmediateNotification: false, allowedStakeholders: ['program_beneficiary', 'partner_organization'], sopCategory: 4, closureDeadlineHours: SOP_CLOSURE_30_DAYS_HOURS },
  { id: 'process_feedback', name: 'Process Feedback', description: 'Feedback about program processes', type: 'PROCESS_FEEDBACK', defaultPriority: 'LOW', defaultSensitivity: 'INTERNAL', escalationLevel: 'NONE', requiresImmediateNotification: false, allowedStakeholders: ['observer', 'partner_organization', 'government_official'], sopCategory: 4, closureDeadlineHours: SOP_CLOSURE_30_DAYS_HOURS },
];
