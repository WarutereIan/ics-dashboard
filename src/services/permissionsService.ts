import { apiClient } from '@/lib/api/client';
import type { Permission } from './userManagementService';

class PermissionsService {
  private baseUrl = '/api/v1/permissions';

  async getAllPermissions(params: { resource?: string; scope?: string; action?: string } = {}): Promise<Permission[]> {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, String(value));
      }
    });
    const endpoint = queryString.toString() ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    const response = await apiClient.get<Permission[]>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch permissions');
    }
    return response.data;
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const response = await apiClient.get<string[]>(`${this.baseUrl}/roles/${roleId}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch role permissions');
    }
    return response.data;
  }

  async assignRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const response = await apiClient.post(`${this.baseUrl}/roles/${roleId}/assign`, { permissionIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to assign role permissions');
    }
  }

  async removeRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const response = await apiClient.delete(`${this.baseUrl}/roles/${roleId}/remove`, { permissionIds });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove role permissions');
    }
  }
}

export const permissionsService = new PermissionsService();


