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
}

export const reportWorkflowService = new ReportWorkflowService();


