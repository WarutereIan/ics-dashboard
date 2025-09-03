import { config } from '@/config/env';

const API_BASE_URL = config.API_BASE_URL;

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class APIClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('ics-auth-token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth header if token exists
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      // Handle 401 - redirect to login or refresh token
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('ics-auth-token');
        localStorage.removeItem('ics-refresh-token');
        
        // Trigger auth context to handle logout
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }
    } catch (error: any) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Helper method for file uploads
  async upload<T>(endpoint: string, formData: FormData): Promise<APIResponse<T>> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('ics-auth-token');
        localStorage.removeItem('ics-refresh-token');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error.message || 'Upload failed',
      };
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export for use in other API modules
export default apiClient;
