import { User } from '@/types/dashboard';

import { config } from '@/config/env';

const API_BASE_URL = config.API_BASE_URL;

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class AuthAPI {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: data.message || `HTTP ${response.status}` 
        };
      }
    } catch (error: any) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error.message || 'Network error occurred' 
      };
    }
  }

  async login(email: string, password: string): Promise<APIResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(token: string): Promise<APIResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async refreshToken(refreshToken: string): Promise<APIResponse<RefreshResponse>> {
    return this.request<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getProfile(token: string): Promise<User> {
    const response = await this.request<User>('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to get user profile');
    }
  }

  async updateProfile(updates: Partial<User>, token: string): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to update profile');
    }
  }

  async changePassword(
    currentPassword: string, 
    newPassword: string, 
    token: string
  ): Promise<void> {
    const response = await this.request<void>('/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  }

  // Utility method to check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Consider expired if can't parse
    }
  }

  // Utility method to get user info from token
  getUserFromToken(token: string): Partial<User> | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      return {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
}

export const authAPI = new AuthAPI();
