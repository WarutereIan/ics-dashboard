import { Report, User } from '@/types/dashboard';
import { createApprovalWorkflow } from './reportWorkflowUtils';
import { v4 as uuidv4 } from 'uuid';

// TODO: Replace with actual user management API calls
export const mockUsers: User[] = [];

// Mock reports for testing (using UUIDs)
const reportId = uuidv4();
const workflowId = uuidv4();

export const mockReports: Report[] = [
  {
    id: reportId,
    name: 'Monthly Activity Report - January 2024',
    type: 'pdf',
    size: '2.5 MB',
    uploadDate: new Date('2024-01-15').toISOString(),
    description: 'Summary of activities for January 2024',
    category: 'monthly',
    status: 'draft',
    uploadedBy: 'Test User',
    lastModified: new Date('2024-01-15').toISOString(),
    lastModifiedBy: 'Test User',
    projectId: 'mameb', // This should also be a UUID when project IDs are migrated
    currentAuthLevel: 'branch-admin',
    isPendingReview: true,
    approvalWorkflow: {
      id: workflowId,
      reportId: reportId,
      projectId: 'mameb', // This should also be a UUID when project IDs are migrated
      createdAt: new Date('2024-01-15').toISOString(),
      createdBy: 'Test User',
      currentStep: 1,
      totalSteps: 2,
      steps: [],
      status: 'pending'
    }
  }
];