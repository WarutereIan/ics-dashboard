import { 
  User, 
  Report, 
  ReportApprovalWorkflow, 
  ReportApprovalStep, 
  ReportComment, 
  ReportNotification,
  ReportTemplate 
} from '@/types/dashboard';

// Define the authorization hierarchy
export const AUTH_HIERARCHY = {
  'viewer': 0,
  'branch-admin': 1,
  'project-admin': 2,
  'country-admin': 3,
  'global-admin': 4
} as const;

// Define the approval chain for reports
export const APPROVAL_CHAIN = [
  'branch-admin',
  'project-admin', 
  'country-admin',
  'global-admin'
] as const;

/**
 * Get the next authorization level in the chain
 */
export function getNextAuthLevel(currentLevel: string): string | null {
  const currentIndex = APPROVAL_CHAIN.indexOf(currentLevel as any);
  if (currentIndex === -1 || currentIndex === APPROVAL_CHAIN.length - 1) {
    return null;
  }
  return APPROVAL_CHAIN[currentIndex + 1];
}

/**
 * Get the previous authorization level in the chain
 */
export function getPreviousAuthLevel(currentLevel: string): string | null {
  const currentIndex = APPROVAL_CHAIN.indexOf(currentLevel as any);
  if (currentIndex <= 0) {
    return null;
  }
  return APPROVAL_CHAIN[currentIndex - 1];
}

/**
 * Check if a user can approve at a specific level
 */
export function canUserApproveAtLevel(user: User, level: string): boolean {
  const userLevel = AUTH_HIERARCHY[user.role];
  const requiredLevel = AUTH_HIERARCHY[level as keyof typeof AUTH_HIERARCHY];
  return userLevel >= requiredLevel;
}

/**
 * Get users who can review at a specific level for a project
 */
export function getUsersForAuthLevel(
  users: User[], 
  level: string, 
  projectId: string
): User[] {
  return users.filter(user => {
    // User must have the required role or higher
    if (!canUserApproveAtLevel(user, level)) {
      return false;
    }
    
    // User must have access to the project
    if (!user.accessibleProjects.includes(projectId)) {
      return false;
    }
    
    return true;
  });
}

/**
 * Create a new approval workflow for a report
 */
export function createApprovalWorkflow(
  reportId: string,
  projectId: string,
  createdBy: string,
  users: User[]
): ReportApprovalWorkflow {
  const steps: ReportApprovalStep[] = APPROVAL_CHAIN.map((level, index) => {
    const availableUsers = getUsersForAuthLevel(users, level, projectId);
    const assignedUser = availableUsers.length > 0 ? availableUsers[0] : undefined;
    
    return {
      id: `${reportId}-step-${index + 1}`,
      stepNumber: index + 1,
      requiredRole: level,
      assignedUserId: assignedUser?.id,
      assignedUserName: assignedUser?.name,
      status: index === 0 ? 'in-review' : 'pending',
      submittedAt: index === 0 ? new Date().toISOString() : undefined,
      comments: [],
      canSkip: false,
      isCurrentStep: index === 0
    };
  });

  return {
    id: `${reportId}-workflow`,
    reportId,
    projectId,
    createdAt: new Date().toISOString(),
    createdBy,
    currentStep: 1,
    totalSteps: steps.length,
    steps,
    status: 'in-progress'
  };
}

/**
 * Get the current step of a workflow
 */
export function getCurrentStep(workflow: ReportApprovalWorkflow): ReportApprovalStep | null {
  return workflow.steps.find(step => step.isCurrentStep) || null;
}

/**
 * Get the next step of a workflow
 */
export function getNextStep(workflow: ReportApprovalWorkflow): ReportApprovalStep | null {
  const currentStep = getCurrentStep(workflow);
  if (!currentStep) return null;
  
  const nextStepIndex = currentStep.stepNumber;
  return workflow.steps.find(step => step.stepNumber === nextStepIndex) || null;
}

/**
 * Approve a step in the workflow
 */
export function approveStep(
  workflow: ReportApprovalWorkflow,
  stepId: string,
  userId: string,
  userName: string,
  comment?: string
): ReportApprovalWorkflow {
  const updatedSteps = workflow.steps.map(step => {
    if (step.id === stepId) {
      const newComment: ReportComment = {
        id: `${stepId}-comment-${Date.now()}`,
        stepId,
        userId,
        userName,
        userRole: step.requiredRole,
        comment: comment || 'Approved',
        timestamp: new Date().toISOString(),
        type: 'approval'
      };

      return {
        ...step,
        status: 'approved' as const,
        reviewedAt: new Date().toISOString(),
        comments: [...step.comments, newComment],
        isCurrentStep: false
      };
    }
    return step;
  });

  // Find the next step to activate
  const currentStep = updatedSteps.find(step => step.id === stepId);
  if (currentStep) {
    const nextStepIndex = updatedSteps.findIndex(step => step.stepNumber === currentStep.stepNumber + 1);
    if (nextStepIndex !== -1) {
      updatedSteps[nextStepIndex] = {
        ...updatedSteps[nextStepIndex],
        status: 'in-review' as const,
        isCurrentStep: true,
        submittedAt: new Date().toISOString()
      };
    } else {
      // All steps completed
      return {
        ...workflow,
        steps: updatedSteps,
        currentStep: workflow.totalSteps,
        status: 'approved',
        finalApprovalDate: new Date().toISOString(),
        finalApprovedBy: userName
      };
    }
  }

  return {
    ...workflow,
    steps: updatedSteps,
    currentStep: (currentStep?.stepNumber || 0) + 1
  };
}

/**
 * Reject a step in the workflow
 */
export function rejectStep(
  workflow: ReportApprovalWorkflow,
  stepId: string,
  userId: string,
  userName: string,
  comment: string
): ReportApprovalWorkflow {
  const updatedSteps = workflow.steps.map(step => {
    if (step.id === stepId) {
      const newComment: ReportComment = {
        id: `${stepId}-comment-${Date.now()}`,
        stepId,
        userId,
        userName,
        userRole: step.requiredRole,
        comment,
        timestamp: new Date().toISOString(),
        type: 'rejection'
      };

      return {
        ...step,
        status: 'rejected' as const,
        reviewedAt: new Date().toISOString(),
        comments: [...step.comments, newComment],
        isCurrentStep: false
      };
    }
    return step;
  });

  return {
    ...workflow,
    steps: updatedSteps,
    status: 'rejected'
  };
}

/**
 * Add a comment to a step
 */
export function addCommentToStep(
  workflow: ReportApprovalWorkflow,
  stepId: string,
  userId: string,
  userName: string,
  userRole: string,
  comment: string,
  type: 'comment' | 'request-changes' = 'comment'
): ReportApprovalWorkflow {
  const updatedSteps = workflow.steps.map(step => {
    if (step.id === stepId) {
      const newComment: ReportComment = {
        id: `${stepId}-comment-${Date.now()}`,
        stepId,
        userId,
        userName,
        userRole,
        comment,
        timestamp: new Date().toISOString(),
        type
      };

      return {
        ...step,
        comments: [...step.comments, newComment]
      };
    }
    return step;
  });

  return {
    ...workflow,
    steps: updatedSteps
  };
}

/**
 * Get pending reviews for a user
 */
export function getPendingReviewsForUser(
  reports: Report[],
  userId: string,
  userRole: string
): Report[] {
  return reports.filter(report => {
    const currentStep = getCurrentStep(report.approvalWorkflow);
    if (!currentStep) return false;
    
    return (
      currentStep.assignedUserId === userId &&
      currentStep.status === 'in-review' &&
      canUserApproveAtLevel({ role: userRole } as User, currentStep.requiredRole)
    );
  });
}

/**
 * Get reports submitted by a user that are pending review
 */
export function getSubmittedReportsPendingReview(
  reports: Report[],
  userId: string
): Report[] {
  return reports.filter(report => 
    report.approvalWorkflow.createdBy === userId &&
    report.approvalWorkflow.status === 'in-progress'
  );
}

/**
 * Create a notification for a pending review
 */
export function createPendingReviewNotification(
  report: Report,
  reviewerId: string
): ReportNotification {
  const currentStep = getCurrentStep(report.approvalWorkflow);
  
  return {
    id: `notification-${Date.now()}`,
    userId: reviewerId,
    reportId: report.id,
    type: 'pending-review',
    title: `Report Review Required: ${report.name}`,
    message: `A report "${report.name}" requires your review and approval at the ${currentStep?.requiredRole} level.`,
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: `/dashboard/projects/${report.projectId}/reports/${report.id}`
  };
}

/**
 * Get the authorization level display name
 */
export function getAuthLevelDisplayName(level: string): string {
  const displayNames = {
    'branch-admin': 'Branch Administrator',
    'project-admin': 'Project Administrator', 
    'country-admin': 'Country Administrator',
    'global-admin': 'Global Administrator'
  };
  return displayNames[level as keyof typeof displayNames] || level;
}

/**
 * Check if a user can skip a step (only higher level users can skip lower level approvals)
 */
export function canSkipStep(user: User, stepRole: string): boolean {
  const userLevel = AUTH_HIERARCHY[user.role];
  const stepLevel = AUTH_HIERARCHY[stepRole as keyof typeof AUTH_HIERARCHY];
  return userLevel > stepLevel;
}

/**
 * Skip a step in the workflow
 */
export function skipStep(
  workflow: ReportApprovalWorkflow,
  stepId: string,
  userId: string,
  userName: string,
  reason: string
): ReportApprovalWorkflow {
  const updatedSteps = workflow.steps.map(step => {
    if (step.id === stepId) {
      const newComment: ReportComment = {
        id: `${stepId}-comment-${Date.now()}`,
        stepId,
        userId,
        userName,
        userRole: step.requiredRole,
        comment: `Step skipped: ${reason}`,
        timestamp: new Date().toISOString(),
        type: 'comment'
      };

      return {
        ...step,
        status: 'skipped' as const,
        reviewedAt: new Date().toISOString(),
        comments: [...step.comments, newComment],
        isCurrentStep: false
      };
    }
    return step;
  });

  // Find the next step to activate
  const currentStep = updatedSteps.find(step => step.id === stepId);
  if (currentStep) {
    const nextStep = updatedSteps.find(step => step.stepNumber === currentStep.stepNumber + 1);
    if (nextStep) {
      nextStep.status = 'in-review';
      nextStep.isCurrentStep = true;
      nextStep.submittedAt = new Date().toISOString();
    }
  }

  return {
    ...workflow,
    steps: updatedSteps,
    currentStep: (currentStep?.stepNumber || 0) + 1
  };
}
