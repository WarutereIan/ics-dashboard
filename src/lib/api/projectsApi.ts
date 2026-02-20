import { Project } from '@/types/dashboard';
import { apiClient, APIResponse } from './client';
import { config } from '@/config/env';

export interface PublicProjectOption {
  id: string;
  name: string;
}

export const projectsApi = {
  /** Public endpoint: project id/name list for feedback form dropdown (no auth required). */
  async getPublicProjectList(): Promise<PublicProjectOption[]> {
    const url = `${config.API_BASE_URL}/projects/public`;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  },

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>('/projects');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch projects');
  },

  // Get project by ID
  async getProjectById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch project');
  },

  // Get projects by country
  async getProjectsByCountry(country: string): Promise<Project[]> {
    const response = await apiClient.get<Project[]>(`/projects/country/${encodeURIComponent(country)}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch projects by country');
  },

  // Create new project
  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', {
      ...projectData,
      startDate: projectData.startDate.toISOString(),
      endDate: projectData.endDate.toISOString(),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create project');
  },

  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const updateData: any = { ...updates };
    
    // Convert dates to ISO strings if they exist
    if (updates.startDate) {
      updateData.startDate = updates.startDate.toISOString();
    }
    if (updates.endDate) {
      updateData.endDate = updates.endDate.toISOString();
    }

    const response = await apiClient.patch<Project>(`/projects/${id}`, updateData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update project');
  },

  // Delete project
  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/projects/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to delete project');
  },

  // Archive project
  async archiveProject(id: string): Promise<Project> {
    const response = await apiClient.post<Project>(`/projects/${id}/archive`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to archive project');
  },

  // Restore project
  async restoreProject(id: string): Promise<Project> {
    const response = await apiClient.post<Project>(`/projects/${id}/restore`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to restore project');
  },
};
