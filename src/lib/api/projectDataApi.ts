import { Outcome, Activity, Report } from '@/types/dashboard';
import { apiClient, APIResponse } from './client';

// DTO interfaces that match backend expectations
export interface CreateOutcomeDto {
  title: string;
  description?: string;
  target?: number;
  current?: number;
  unit?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ON_TRACK' | 'AT_RISK' | 'BEHIND';
  progress?: number;
}

export interface CreateActivityDto {
  outcomeId: string;
  title: string;
  description?: string;
  responsible?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'NOT_STARTED' | 'IN_PROGRESS';
  startDate?: string;
  endDate?: string;
  progress?: number;
  budget?: number;
  spent?: number;
}

export interface CreateKPIDto {
  outcomeId?: string;
  name: string;
  title?: string;
  description?: string;
  target?: number;
  current?: number;
  unit?: string;
  type?: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}

export const projectDataApi = {
  // Get project outcomes
  async getProjectOutcomes(projectId: string): Promise<Outcome[]> {
    const response = await apiClient.get<Outcome[]>(`/projects/${projectId}/outcomes`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch project outcomes');
  },

  // Get project activities
  async getProjectActivities(projectId: string): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>(`/projects/${projectId}/activities`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch project activities');
  },

  // Get project outputs
  async getProjectOutputs(projectId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/projects/${projectId}/outputs`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch project outputs');
  },

  // Get project sub-activities
  async getProjectSubActivities(projectId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/projects/${projectId}/sub-activities`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch project sub-activities');
  },

  // Get project KPIs
  async getProjectKPIs(projectId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/projects/${projectId}/kpis`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch project KPIs');
  },

  // Get project reports
  async getProjectReports(projectId: string): Promise<Report[]> {
    const response = await apiClient.get<Report[]>(`/projects/${projectId}/reports`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch project reports');
  },

  // Create project outcome
  async createProjectOutcome(projectId: string, outcomeData: CreateOutcomeDto): Promise<Outcome> {
    const response = await apiClient.post<Outcome>(`/projects/${projectId}/outcomes`, outcomeData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create project outcome');
  },

  // Create project activity
  async createProjectActivity(projectId: string, activityData: CreateActivityDto): Promise<Activity> {
    const response = await apiClient.post<Activity>(`/projects/${projectId}/activities`, activityData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create project activity');
  },

  // Update project outcome
  async updateProjectOutcome(projectId: string, outcomeId: string, updates: Partial<Outcome>): Promise<Outcome> {
    const response = await apiClient.patch<Outcome>(`/projects/${projectId}/outcomes/${outcomeId}`, updates);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update project outcome');
  },

  // Update project activity
  async updateProjectActivity(projectId: string, activityId: string, updates: Partial<Activity>): Promise<Activity> {
    const response = await apiClient.patch<Activity>(`/projects/${projectId}/activities/${activityId}`, updates);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update project activity');
  },

  // Delete project outcome
  async deleteProjectOutcome(projectId: string, outcomeId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/projects/${projectId}/outcomes/${outcomeId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to delete project outcome');
  },

  // Delete project activity
  async deleteProjectActivity(projectId: string, activityId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/projects/${projectId}/activities/${activityId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to delete project activity');
  },

  // Create project KPI
  async createProjectKPI(projectId: string, kpiData: CreateKPIDto): Promise<any> {
    const response = await apiClient.post<any>(`/projects/${projectId}/kpis`, kpiData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create project KPI');
  },

  // Update project KPI
  async updateProjectKPI(projectId: string, kpiId: string, updates: any): Promise<any> {
    const response = await apiClient.patch<any>(`/projects/${projectId}/kpis/${kpiId}`, updates);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update project KPI');
  },

  // Delete project KPI
  async deleteProjectKPI(projectId: string, kpiId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/projects/${projectId}/kpis/${kpiId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to delete project KPI');
  },
};
