import { apiClient } from '@/lib/api/client';
import { saveAs } from 'file-saver';

export interface ReportUploadData {
  title?: string;
  description?: string;
  category?: string;
  reportType?: string;
  activityId?: string;
  reportFrequency?: 'monthly' | 'quarterly' | 'annual' | 'adhoc';
}

export interface ReportFile {
  id: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  fileSize: string;
  status: string;
  createdAt: string;
}

export interface ReportUploadResponse {
  success: boolean;
  data: ReportFile;
  error?: string;
}

export interface ReportListResponse {
  success: boolean;
  data: ReportFile[];
  error?: string;
}

class ReportService {
  private baseUrl = '/projects';

  async uploadReportFile(
    projectId: string,
    file: File,
    reportData: ReportUploadData
  ): Promise<ReportUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', reportData.title || file.name);
    formData.append('description', reportData.description || `Uploaded report: ${file.name}`);
    formData.append('category', reportData.category || 'adhoc');
    formData.append('reportType', reportData.reportType || 'ADHOC');
    if (reportData.activityId) {
      formData.append('activityId', reportData.activityId);
    }
    if (reportData.reportFrequency) {
      formData.append('reportFrequency', reportData.reportFrequency);
    }


    const response = await apiClient.upload<ReportUploadResponse>(
      `${this.baseUrl}/${projectId}/reports/upload`,
      formData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to upload report file');
    }

    return response.data;
  }

  async getReports(projectId: string): Promise<ReportListResponse> {
    const response = await apiClient.get<ReportFile[]>(
      `${this.baseUrl}/${projectId}/reports`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch reports');
    }

    return { success: true, data: response.data };
  }

  async getReport(projectId: string, reportId: string): Promise<ReportFile> {
    const response = await apiClient.get<ReportFile>(
      `${this.baseUrl}/${projectId}/reports/${reportId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch report');
    }

    return response.data;
  }

  async downloadReportFile(projectId: string, reportId: string): Promise<void> {
    // Get the auth token for the download request
    const token = apiClient.getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the download request directly with fetch to handle blob response
    const response = await fetch(`${apiClient.getBaseUrl()}${this.baseUrl}/${projectId}/reports/download/${reportId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle auth error
        localStorage.removeItem('ics-auth-token');
        localStorage.removeItem('ics-refresh-token');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Authentication required');
      }
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = `report-${reportId}`;
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch) {
        fileName = fileNameMatch[1];
      }
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Use file-saver to download the file with proper filename
    saveAs(blob, fileName);
  }

  async deleteReportFile(projectId: string, reportId: string): Promise<void> {
    const response = await apiClient.delete(
      `${this.baseUrl}/${projectId}/reports/${reportId}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete report file');
    }
  }
}

export const reportService = new ReportService();
