import { Project } from '@/types/dashboard';
import { apiClient, APIResponse } from './client';

export const projectsApi = {
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
};
