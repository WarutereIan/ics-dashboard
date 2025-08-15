import { Report, User } from '@/types/dashboard';
import { createApprovalWorkflow } from './reportWorkflowUtils';

// Mock users for testing
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Branch Admin',
    email: 'john.branch@example.com',
    role: 'branch-admin',
    accessibleProjects: ['project-1', 'project-2'],
    accessibleBranches: ['branch-1'],
    accessibleCountries: ['KE']
  },
  {
    id: 'user-2',
    name: 'Sarah Project Admin',
    email: 'sarah.project@example.com',
    role: 'project-admin',
    accessibleProjects: ['project-1', 'project-2', 'project-3'],
    accessibleBranches: ['branch-1', 'branch-2'],
    accessibleCountries: ['KE', 'TZ']
  },
  {
    id: 'user-3',
    name: 'Michael Country Admin',
    email: 'michael.country@example.com',
    role: 'country-admin',
    accessibleProjects: ['project-1', 'project-2', 'project-3', 'project-4'],
    accessibleBranches: ['branch-1', 'branch-2', 'branch-3'],
    accessibleCountries: ['KE', 'TZ', 'CI']
  },
  {
    id: 'user-4',
    name: 'Lisa Global Admin',
    email: 'lisa.global@example.com',
    role: 'global-admin',
    accessibleProjects: ['project-1', 'project-2', 'project-3', 'project-4', 'project-5'],
    accessibleBranches: ['branch-1', 'branch-2', 'branch-3', 'branch-4'],
    accessibleCountries: ['KE', 'TZ', 'CI']
  }
];

// Create mock reports with approval workflows
export const createMockReports = (): Report[] => {
  const reports: Report[] = [];

  // Report 1: In progress at branch admin level
  const workflow1 = createApprovalWorkflow('report-1', 'project-1', 'user-1', mockUsers);
  reports.push({
    id: 'report-1',
    name: 'Q1 Financial Report - MaMEB Project',
    type: 'pdf',
    size: '2.5 MB',
    uploadDate: '2024-01-15T10:30:00Z',
    description: 'Quarterly financial report for MaMEB project covering Q1 2024',
    category: 'quarterly',
    status: 'draft',
    uploadedBy: 'John Branch Admin',
    lastModified: '2024-01-15T10:30:00Z',
    lastModifiedBy: 'John Branch Admin',
    projectId: 'project-1',
    currentAuthLevel: 'branch-admin',
    approvalWorkflow: workflow1,
    isPendingReview: true,
    currentReviewerId: 'user-1',
    nextReviewerId: 'user-2'
  });

  // Report 2: Approved by branch admin, pending project admin
  const workflow2 = createApprovalWorkflow('report-2', 'project-2', 'user-1', mockUsers);
  workflow2.steps[0].status = 'approved';
  workflow2.steps[0].reviewedAt = '2024-01-14T15:45:00Z';
  workflow2.steps[0].isCurrentStep = false;
  workflow2.steps[1].status = 'in-review';
  workflow2.steps[1].isCurrentStep = true;
  workflow2.currentStep = 2;
  
  reports.push({
    id: 'report-2',
    name: 'Annual Progress Report - VACIS Project',
    type: 'excel',
    size: '1.8 MB',
    uploadDate: '2024-01-10T09:15:00Z',
    description: 'Annual progress report for VACIS project with detailed metrics',
    category: 'annual',
    status: 'draft',
    uploadedBy: 'John Branch Admin',
    lastModified: '2024-01-14T15:45:00Z',
    lastModifiedBy: 'John Branch Admin',
    projectId: 'project-2',
    currentAuthLevel: 'project-admin',
    approvalWorkflow: workflow2,
    isPendingReview: true,
    currentReviewerId: 'user-2',
    nextReviewerId: 'user-3'
  });

  // Report 3: Fully approved
  const workflow3 = createApprovalWorkflow('report-3', 'project-3', 'user-2', mockUsers);
  workflow3.steps.forEach(step => {
    step.status = 'approved';
    step.reviewedAt = '2024-01-12T14:20:00Z';
    step.isCurrentStep = false;
  });
  workflow3.status = 'approved';
  workflow3.currentStep = 4;
  workflow3.finalApprovalDate = '2024-01-12T14:20:00Z';
  workflow3.finalApprovedBy = 'Lisa Global Admin';
  
  reports.push({
    id: 'report-3',
    name: 'Monthly Operations Report - CDW Project',
    type: 'word',
    size: '3.2 MB',
    uploadDate: '2024-01-05T11:00:00Z',
    description: 'Monthly operations report for CDW project with operational insights',
    category: 'monthly',
    status: 'final',
    uploadedBy: 'Sarah Project Admin',
    lastModified: '2024-01-12T14:20:00Z',
    lastModifiedBy: 'Lisa Global Admin',
    projectId: 'project-3',
    currentAuthLevel: 'approved',
    approvalWorkflow: workflow3,
    isPendingReview: false,
    currentReviewerId: undefined,
    nextReviewerId: undefined
  });

  // Report 4: Rejected at country admin level
  const workflow4 = createApprovalWorkflow('report-4', 'project-4', 'user-3', mockUsers);
  workflow4.steps[0].status = 'approved';
  workflow4.steps[0].reviewedAt = '2024-01-13T16:30:00Z';
  workflow4.steps[0].isCurrentStep = false;
  workflow4.steps[1].status = 'approved';
  workflow4.steps[1].reviewedAt = '2024-01-13T17:00:00Z';
  workflow4.steps[1].isCurrentStep = false;
  workflow4.steps[2].status = 'rejected';
  workflow4.steps[2].reviewedAt = '2024-01-13T18:15:00Z';
  workflow4.steps[2].isCurrentStep = false;
  workflow4.status = 'rejected';
  
  reports.push({
    id: 'report-4',
    name: 'Ad-hoc Security Assessment - NPPP Project',
    type: 'pdf',
    size: '4.1 MB',
    uploadDate: '2024-01-08T13:45:00Z',
    description: 'Ad-hoc security assessment report for NPPP project',
    category: 'adhoc',
    status: 'draft',
    uploadedBy: 'Michael Country Admin',
    lastModified: '2024-01-13T18:15:00Z',
    lastModifiedBy: 'Michael Country Admin',
    projectId: 'project-4',
    currentAuthLevel: 'country-admin',
    approvalWorkflow: workflow4,
    isPendingReview: false,
    currentReviewerId: undefined,
    nextReviewerId: undefined
  });

  return reports;
};

export const mockReports = createMockReports();
