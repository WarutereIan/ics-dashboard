import { apiClient } from './client';

// Types matching backend DTOs and entities
export interface CreateProjectFinancialDataDto {
  projectId: string;
  year: number;
  projectName: string;
  totalBudget?: number;
}

export interface UpdateProjectFinancialDataDto {
  projectName?: string;
  totalBudget?: number;
}

export interface CreateActivityFinancialDataDto {
  activityId: string;
  activityTitle: string;
  year: number;
  q1Cost?: number;
  q2Cost?: number;
  q3Cost?: number;
  q4Cost?: number;
  totalAnnualBudget?: number;
  notes?: string;
}

export interface UpdateActivityFinancialDataDto {
  activityTitle?: string;
  q1Cost?: number;
  q2Cost?: number;
  q3Cost?: number;
  q4Cost?: number;
  totalAnnualBudget?: number;
  notes?: string;
}

export interface ProjectFinancialData {
  id: string;
  projectId: string;
  year: number;
  projectName: string;
  totalBudget: number;
  totalSpent: number;
  variance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityFinancialData {
  id: string;
  activityId: string;
  activityTitle: string;
  year: number;
  q1Cost: number;
  q2Cost: number;
  q3Cost: number;
  q4Cost: number;
  totalAnnualBudget: number;
  totalAnnualCost: number;
  variance: number;
  notes?: string;
  createdAt: Date;
  lastUpdated: Date;
}

export interface QuarterlyFinancialData {
  budget: number;
  spent: number;
  variance: number;
}

export interface FinancialSummary {
  projectId: string;
  year: number;
  totalBudget: number;
  totalSpent: number;
  totalVariance: number;
  byQuarter: {
    q1: QuarterlyFinancialData;
    q2: QuarterlyFinancialData;
    q3: QuarterlyFinancialData;
    q4: QuarterlyFinancialData;
  };
  activityCount: number;
  lastUpdated: Date;
}

// Project Financial Data API
export const financialApi = {
  // Project Financial Data
  async createProjectFinancialData(data: CreateProjectFinancialDataDto): Promise<ProjectFinancialData> {
    const url = `/financial/projects/${data.projectId}`;
    console.log('🌐 API Call: Creating project financial data');
    console.log('📡 Request URL:', url);
    console.log('📦 Request payload:', JSON.stringify(data, null, 2));
    
    try {
      const response = await apiClient.post(url, data);
      console.log('✅ API Response received for project financial data:', response);
      return response.data as ProjectFinancialData;
    } catch (error: any) {
      console.error('❌ API Error in createProjectFinancialData:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  },

  async getProjectFinancialData(projectId: string, year?: number): Promise<ProjectFinancialData[]> {
    const url = year 
      ? `/financial/projects/${projectId}?year=${year}`
      : `/financial/projects/${projectId}`;
    const response = await apiClient.get(url);
    if (response.success && response.data) {
      return response.data as ProjectFinancialData[];
    }
    throw new Error(response.error || 'Failed to fetch project financial data');
  },

  async getProjectFinancialDataById(id: string): Promise<ProjectFinancialData> {
    const response = await apiClient.get(`/financial/projects/data/${id}`);
    if (response.success && response.data) {
      return response.data as ProjectFinancialData;
    }
    throw new Error(response.error || 'Failed to fetch project financial data by ID');
  },

  async updateProjectFinancialData(id: string, data: UpdateProjectFinancialDataDto): Promise<ProjectFinancialData> {
    const response = await apiClient.put(`/financial/projects/data/${id}`, data);
    return response.data as ProjectFinancialData;
  },

  async deleteProjectFinancialData(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/financial/projects/data/${id}`);
    return response.data as { message: string };
  },

  // Activity Financial Data
  async createActivityFinancialData(data: CreateActivityFinancialDataDto): Promise<ActivityFinancialData> {
    const url = `/financial/activities`;
    console.log('🌐 API Call: Creating activity financial data');
    console.log('📡 Request URL:', url);
    console.log('📦 Request payload:', JSON.stringify(data, null, 2));
    
    try {
      const response = await apiClient.post(url, data);
      console.log('✅ API Response received:', response);
      return response.data as ActivityFinancialData;
    } catch (error: any) {
      console.error('❌ API Error in createActivityFinancialData:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  },

  async getActivityFinancialData(activityId: string, year?: number): Promise<ActivityFinancialData[]> {
    const url = year 
      ? `/financial/activities/${activityId}?year=${year}`
      : `/financial/activities/${activityId}`;
    const response = await apiClient.get(url);
    return response.data as ActivityFinancialData[];
  },

  async updateActivityFinancialData(id: string, data: UpdateActivityFinancialDataDto): Promise<ActivityFinancialData> {
    const response = await apiClient.put(`/financial/activities/data/${id}`, data);
    return response.data as ActivityFinancialData;
  },

  async deleteActivityFinancialData(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/financial/activities/data/${id}`);

      return response.data as { message: string };
  },

  // Financial Summary and Analytics
  async getFinancialSummary(projectId: string, year: number): Promise<FinancialSummary> {
    const response = await apiClient.get(`/financial/projects/${projectId}/summary/${year}`);
    if (response.success && response.data) {
      return response.data as FinancialSummary;
    }
    throw new Error(response.error || 'Failed to fetch financial summary');
  },

  async getProjectFinancialYears(projectId: string): Promise<{ years: number[] }> {
    const response = await apiClient.get(`/financial/projects/${projectId}/years`);
    return response.data as { years: number[] };
  },

  // Health check
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await apiClient.get('/financial/health');
    return response.data as { status: string; timestamp: string };
  },
};
