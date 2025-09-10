import { apiClient } from '@/lib/api/client';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

class AuthService {
  private baseUrl = '/auth';

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await apiClient.post<ChangePasswordResponse>(`${this.baseUrl}/change-password`, data);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to change password');
    }
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/profile`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get profile');
    }
    return response.data;
  }
}

export const authService = new AuthService();
