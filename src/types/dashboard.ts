export interface User {
  id: string;
  name: string;
  email: string;
  role: 'global-admin' | 'country-admin' | 'project-admin' | 'branch-admin' | 'viewer';
  accessibleProjects: string[];
  accessibleBranches: string[];
  accessibleCountries: string[];
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  country: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  progress: number;
  budget: number;
  spent: number;
}

export interface Outcome {
  id: string;
  projectId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
}

export interface SubActivity {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  dueDate?: string;
}

export interface Activity {
  id: string;
  outcomeId: string;
  title: string;
  description: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  responsible: string;
  subActivities?: SubActivity[];
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

// Visualization data types
export interface RadialGaugeData {
  type: 'radialGauge';
  value: number;
  target: number;
  unit: string;
  useColorCoding: boolean;
  data?: { month: string; value: number; }[];
  baseline?: number;
  improvement?: number;
}

export interface PieChartData {
  type: 'pieChart';
  data: { name: string; value: number; color: string; }[];
  innerRadius: number;
  interactive: boolean;
}

export interface StackedBarChartData {
  type: 'stackedBarChart';
  data: any[];
  stacks?: { dataKey: string; fill: string; name: string; }[];
}

export interface AreaChartData {
  type: 'areaChart';
  data: any[];
  showCumulative: boolean;
  milestones?: { x: string; label: string; }[];
}

export interface LineChartData {
  type: 'lineChart';
  data: any[];
  lines: { dataKey: string; color: string; name: string; }[];
  milestones?: { x: string; label: string; }[];
}

export interface BarChartData {
  type: 'barChart';
  data: any[];
  bars: { dataKey: string; fill: string; name: string; }[];
}

export interface BulletChartData {
  type: 'bulletChart';
  current: number;
  target: number;
  unit: string;
  qualitativeRanges: { poor: number; satisfactory: number; good: number; };
  comparative?: number;
}

export interface HeatmapCalendarData {
  type: 'heatmapCalendar';
  data: { date: string; value: number; }[];
}

export interface LikertScaleData {
  type: 'likertScale';
  data: {
    question: string;
    responses: {
      stronglyDisagree: number;
      disagree: number;
      neutral: number;
      agree: number;
      stronglyAgree: number;
    };
  }[];
}

export interface PieAndTrendData {
  type: 'pieAndTrend';
  pieData: { name: string; value: number; color: string; }[];
  trendData: { date: string; value: number; }[];
}

export interface ProgressBarData {
  type: 'progressBar';
  current: number;
  target: number;
  unit: string;
  breakdown: { name: string; value: number; }[];
}

export interface Output {
  id: string;
  outcomeId: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  activities: string[];
}

export interface Report {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'word' | 'other';
  size: string;
  uploadDate: string;
  description: string;
  category: 'quarterly' | 'annual' | 'monthly' | 'adhoc';
  status: 'draft' | 'final' | 'archived';
  uploadedBy: string;
  lastModified: string;
  lastModifiedBy: string;
  // New fields for progressive authorization
  projectId: string;
  currentAuthLevel: 'branch-admin' | 'project-admin' | 'country-admin' | 'global-admin' | 'approved';
  approvalWorkflow: ReportApprovalWorkflow;
  isPendingReview: boolean;
  currentReviewerId?: string;
  nextReviewerId?: string;
}

export interface ReportApprovalWorkflow {
  id: string;
  reportId: string;
  projectId: string;
  createdAt: string;
  createdBy: string;
  currentStep: number;
  totalSteps: number;
  steps: ReportApprovalStep[];
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'cancelled';
  finalApprovalDate?: string;
  finalApprovedBy?: string;
}

export interface ReportApprovalStep {
  id: string;
  stepNumber: number;
  requiredRole: 'branch-admin' | 'project-admin' | 'country-admin' | 'global-admin';
  assignedUserId?: string;
  assignedUserName?: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'skipped';
  submittedAt?: string;
  reviewedAt?: string;
  comments: ReportComment[];
  canSkip: boolean;
  isCurrentStep: boolean;
}

export interface ReportComment {
  id: string;
  stepId: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  timestamp: string;
  type: 'comment' | 'approval' | 'rejection' | 'request-changes';
  attachments?: ReportAttachment[];
}

export interface ReportAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'quarterly' | 'annual' | 'monthly' | 'adhoc';
  projectId?: string; // If null, template is available for all projects
  requiredAuthLevels: ('branch-admin' | 'project-admin' | 'country-admin' | 'global-admin')[];
  templateFile?: string;
  fields: ReportTemplateField[];
  createdAt: string;
  createdBy: string;
}

export interface ReportTemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[]; // For select fields
  defaultValue?: string;
}

export interface ReportNotification {
  id: string;
  userId: string;
  reportId: string;
  type: 'pending-review' | 'approved' | 'rejected' | 'comment-added' | 'workflow-completed';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type VisualizationData =
  | RadialGaugeData
  | PieChartData
  | StackedBarChartData
  | AreaChartData
  | LineChartData
  | BarChartData
  | BulletChartData
  | HeatmapCalendarData
  | LikertScaleData
  | PieAndTrendData
  | ProgressBarData;