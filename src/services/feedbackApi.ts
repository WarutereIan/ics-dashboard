const API_BASE_URL = 'http://localhost:3000/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class FeedbackApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('ics-auth-token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options?: RequestInit, requireAuth: boolean = true): Promise<T> {
    const url = `${API_BASE_URL}/feedback${endpoint}`;
    
    console.log(`🌐 API Request: ${options?.method || 'GET'} ${url}`);
    
    const headers = {
      'Content-Type': 'application/json',
      ...(requireAuth ? this.getAuthHeaders() : {}),
      ...options?.headers,
    };
    
    try {
      const response = await fetch(url, {
        headers,
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
    return this.request(`/forms${params}`, {}, false); // Public endpoint
  }

  async getFormById(id: string) {
    return this.request(`/forms/${id}`, {}, false); // Public endpoint
  }

  async createForm(data: any) {
    return this.request('/forms', {
      method: 'POST',
      body: JSON.stringify(data),
    }); // Protected endpoint (requireAuth defaults to true)
  }

  async updateForm(id: string, data: any) {
    return this.request(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }); // Protected endpoint
  }

  async deleteForm(id: string) {
    return this.request(`/forms/${id}`, {
      method: 'DELETE',
    }); // Protected endpoint
  }

  // Submissions
  async getSubmissions(projectId?: string, formId?: string) {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (formId) params.append('formId', formId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/submissions${query}`); // Protected endpoint
  }

  async getSubmissionById(id: string) {
    return this.request(`/submissions/${id}`); // Protected endpoint
  }

  async createSubmission(data: any) {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false); // Public endpoint for feedback submission
  }

  async updateSubmissionStatus(id: string, data: { status: string; assignedTo?: string }) {
    return this.request(`/submissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }); // Protected endpoint
  }

  async deleteSubmission(id: string) {
    return this.request(`/submissions/${id}`, {
      method: 'DELETE',
    }); // Protected endpoint
  }

  // Categories
  async getCategories() {
    return this.request('/categories', {}, false); // Public endpoint
  }

  async getCategoryById(id: string) {
    return this.request(`/categories/${id}`); // Protected endpoint
  }

  // Communications and Notes
  async addCommunication(submissionId: string, data: any) {
    return this.request(`/submissions/${submissionId}/communications`, {
      method: 'POST',
      body: JSON.stringify(data),
    }); // Protected endpoint
  }

  async addNote(submissionId: string, data: any) {
    return this.request(`/submissions/${submissionId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }); // Protected endpoint
  }

  // Analytics
  async getAnalytics(projectId?: string, formId?: string) {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (formId) params.append('formId', formId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/analytics${query}`); // Protected endpoint
  }

  async getFormAnalytics(formId: string) {
    return this.request(`/forms/${formId}/analytics`); // Protected endpoint
  }
}

export const feedbackApi = new FeedbackApiService();










