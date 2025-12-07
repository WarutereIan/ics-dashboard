import { apiClient } from '@/lib/api/client';

export interface WorkflowReportSummary {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  submittedAt: string;
  lastReviewAt?: string;
  completedAt?: string;
  approvalSteps?: Array<{ id: string; stepOrder: number; isCompleted: boolean; reviewerId: string }>
}

export interface WorkflowListResponse {
  reports: WorkflowReportSummary[];
  total: number;
}

class ReportWorkflowService {
  private baseUrl = '/reports/workflow';

  async getPendingReviews(projectId?: string): Promise<WorkflowListResponse> {
    const params = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const response = await apiClient.get<WorkflowListResponse>(`${this.baseUrl}/pending-reviews${params}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch pending reviews');
    }
    return response.data;
  }

  async getMyReports(projectId?: string, status?: string): Promise<WorkflowListResponse> {
    const query: string[] = [];
    if (projectId) query.push(`projectId=${encodeURIComponent(projectId)}`);
    if (status) query.push(`status=${encodeURIComponent(status)}`);
    const qs = query.length ? `?${query.join('&')}` : '';
    const response = await apiClient.get<WorkflowListResponse>(`${this.baseUrl}/my-reports${qs}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch my reports');
    }
    return response.data;
  }

  async getReportById(reportId: string): Promise<WorkflowReportSummary> {
    const response = await apiClient.get<WorkflowReportSummary>(`${this.baseUrl}/reports/${reportId}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch report workflow');
    }
    return response.data;
  }

  async getByFile(fileReportId: string): Promise<WorkflowReportSummary> {
    const response = await apiClient.get<WorkflowReportSummary>(`${this.baseUrl}/by-file/${fileReportId}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch workflow by file');
    }
    return response.data;
  }

  async review(reportId: string, action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'SKIP', comment?: string, reasoning?: string, skipToFinalApproval?: boolean): Promise<WorkflowReportSummary> {
    const payload: any = { reportId, action, comment, reasoning, skipToFinalApproval };
    const response = await apiClient.post<WorkflowReportSummary>(`${this.baseUrl}/review`, payload);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to submit review');
    }
    return response.data;
  }

  async addComment(reportId: string, content: string, isInternal?: boolean, replyToCommentId?: string): Promise<void> {
    const payload: any = { reportId, content, isInternal, replyToCommentId };
    const response = await apiClient.post<void>(`${this.baseUrl}/comments`, payload);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add comment');
    }
  }

  async resubmitWorkflow(reportId: string, fileIds?: string[]): Promise<WorkflowReportSummary> {
    const payload: any = { fileIds };
    const response = await apiClient.post<WorkflowReportSummary>(`${this.baseUrl}/reports/${reportId}/resubmit`, payload);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to resubmit workflow');
    }
    return response.data;
  }

  async cancelWorkflow(reportId: string, reason?: string): Promise<WorkflowReportSummary> {
    const payload: any = { reason };
    const response = await apiClient.post<WorkflowReportSummary>(`${this.baseUrl}/reports/${reportId}/cancel`, payload);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to cancel workflow');
    }
    return response.data;
  }

  async delegateReview(stepId: string, delegateToUserId: string, reason: string): Promise<void> {
    const payload = { delegateToUserId, reason };
    const response = await apiClient.post<void>(`${this.baseUrl}/steps/${stepId}/delegate`, payload);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delegate review');
    }
  }

  async escalateReview(reportId: string, escalationReason: string, escalateToUserId: string): Promise<WorkflowReportSummary> {
    const payload = { escalationReason, escalateToUserId };
    const response = await apiClient.post<WorkflowReportSummary>(`${this.baseUrl}/reports/${reportId}/escalate`, payload);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to escalate review');
    }
    return response.data;
  }

  async setStepDueDate(stepId: string, dueDate: Date): Promise<void> {
    const payload = { dueDate: dueDate.toISOString() };
    const response = await apiClient.put<void>(`${this.baseUrl}/steps/${stepId}/due-date`, payload);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set due date');
    }
  }

  async updateStatus(
    reportId: string,
    status: string,
    assignedTo?: string,
    reason?: string,
    details?: string
  ): Promise<WorkflowReportSummary> {
    const payload: any = { status, assignedTo, reason, details };
    const response = await apiClient.post<WorkflowReportSummary>(
      `${this.baseUrl}/reports/${reportId}/update-status`,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update status');
    }
    return response.data;
  }

  async startReview(stepId: string): Promise<void> {
    const response = await apiClient.post<{ success: boolean }>(`${this.baseUrl}/steps/${stepId}/start-review`, {});
    if (!response.success) {
      throw new Error(response.error || 'Failed to start review tracking');
    }
  }

  async requestInformation(
    reportId: string,
    requestedFrom: string,
    informationNeeded: string,
    deadline?: Date
  ): Promise<void> {
    const payload: any = { requestedFrom, informationNeeded, deadline: deadline?.toISOString() };
    const response = await apiClient.post<void>(`${this.baseUrl}/reports/${reportId}/request-information`, payload);
    if (!response.success) {
      throw new Error(response.error || 'Failed to request information');
    }
  }

  async conditionalApprove(reportId: string, conditions: string[], comment: string): Promise<WorkflowReportSummary> {
    const payload = { conditions, comment };
    const response = await apiClient.post<WorkflowReportSummary>(
      `${this.baseUrl}/reports/${reportId}/conditional-approve`,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to conditionally approve');
    }
    return response.data;
  }

  async createWorkflowVersion(reportId: string, checkpointNote: string): Promise<{ versionNumber: number; checkpointNote: string }> {
    const payload = { checkpointNote };
    const response = await apiClient.post<{ versionNumber: number; checkpointNote: string }>(
      `${this.baseUrl}/reports/${reportId}/create-version`,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create workflow version');
    }
    return response.data;
  }

  async returnToStep(reportId: string, returnToStepId: string, reason: string): Promise<WorkflowReportSummary> {
    const payload = { returnToStepId, reason };
    const response = await apiClient.post<WorkflowReportSummary>(
      `${this.baseUrl}/reports/${reportId}/return-to-step`,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to return to step');
    }
    return response.data;
  }

  async getWeightedApproval(reportId: string): Promise<{
    isApproved: boolean;
    totalWeight: number;
    approvedWeight: number;
    requiredWeight: number;
  }> {
    const response = await apiClient.get<{
      isApproved: boolean;
      totalWeight: number;
      approvedWeight: number;
      requiredWeight: number;
    }>(`${this.baseUrl}/reports/${reportId}/weighted-approval`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get weighted approval');
    }
    return response.data;
  }

  async bulkApprove(reportIds: string[], comment?: string): Promise<{ success: number; failed: number; errors: string[] }> {
    const payload = { reportIds, comment };
    const response = await apiClient.post<{ success: number; failed: number; errors: string[] }>(
      `${this.baseUrl}/bulk/approve`,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to bulk approve');
    }
    return response.data;
  }

  async bulkReject(reportIds: string[], reason: string): Promise<{ success: number; failed: number; errors: string[] }> {
    const payload = { reportIds, reason };
    const response = await apiClient.post<{ success: number; failed: number; errors: string[] }>(
      `${this.baseUrl}/bulk/reject`,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to bulk reject');
    }
    return response.data;
  }

  async bulkReassign(reportIds: string[], reassignToUserId: string, reason?: string): Promise<{ success: number; failed: number; errors: string[] }> {
    const payload = { reportIds, reassignToUserId, reason };
    const response = await apiClient.post<{ success: number; failed: number; errors: string[] }>(
      `${this.baseUrl}/bulk/reassign`,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to bulk reassign');
    }
    return response.data;
  }

  async getReviewerWorkload(projectId?: string, reviewerId?: string): Promise<{
    reviewers: Array<{
      reviewerId: string;
      reviewerName: string;
      pendingCount: number;
      completedCount: number;
      overdueCount: number;
      averageReviewTime: number;
      reports: Array<{
        reportId: string;
        reportName: string;
        stepOrder: number;
        dueDate?: Date;
        isOverdue: boolean;
        daysPending: number;
      }>;
    }>;
  }> {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (reviewerId) params.append('reviewerId', reviewerId);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<{
      reviewers: Array<{
        reviewerId: string;
        reviewerName: string;
        pendingCount: number;
        completedCount: number;
        overdueCount: number;
        averageReviewTime: number;
        reports: Array<{
          reportId: string;
          reportName: string;
          stepOrder: number;
          dueDate?: Date;
          isOverdue: boolean;
          daysPending: number;
        }>;
      }>;
    }>(`${this.baseUrl}/reviewer-workload${query}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get reviewer workload');
    }
    return response.data;
  }
}

export const reportWorkflowService = new ReportWorkflowService();


