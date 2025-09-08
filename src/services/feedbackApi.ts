const API_BASE_URL = 'http://localhost:3000/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class FeedbackApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/feedback${endpoint}`;
    
    console.log(`🌐 API Request: ${options?.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`📡 API Response: ${response.status} ${response.statusText} for ${endpoint}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        console.error(`❌ API Error Response:`, result);
        throw new Error(result.message || 'API request failed');
      }

      console.log(`✅ API Success for ${endpoint}:`, result.data);
      return result.data;
    } catch (error) {
      console.error(`💥 API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Forms
  async getForms(projectId?: string) {
    const params = projectId ? `?projectId=${projectId}` : '';
    return this.request(`/forms${params}`);
  }

  async getFormById(id: string) {
    return this.request(`/forms/${id}`);
  }

  async createForm(data: any) {
    return this.request('/forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateForm(id: string, data: any) {
    return this.request(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteForm(id: string) {
    return this.request(`/forms/${id}`, {
      method: 'DELETE',
    });
  }

  // Submissions
  async getSubmissions(projectId?: string, formId?: string) {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (formId) params.append('formId', formId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/submissions${query}`);
  }

  async getSubmissionById(id: string) {
    return this.request(`/submissions/${id}`);
  }

  async createSubmission(data: any) {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubmissionStatus(id: string, data: { status: string; assignedTo?: string }) {
    return this.request(`/submissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSubmission(id: string) {
    return this.request(`/submissions/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  async getCategoryById(id: string) {
    return this.request(`/categories/${id}`);
  }

  // Communications and Notes
  async addCommunication(submissionId: string, data: any) {
    return this.request(`/submissions/${submissionId}/communications`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addNote(submissionId: string, data: any) {
    return this.request(`/submissions/${submissionId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalytics(projectId?: string, formId?: string) {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (formId) params.append('formId', formId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/analytics${query}`);
  }

  async getFormAnalytics(formId: string) {
    return this.request(`/forms/${formId}/analytics`);
  }
}

export const feedbackApi = new FeedbackApiService();






