import { apiClient } from '@/lib/api/client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  roles: UserRole[];
  projectAccess: ProjectAccess[];
}

export interface UserRole {
  id: string;
  roleName: string;
  roleDescription?: string;
  level: number;
  projectId?: string;
  projectName?: string;
  country?: string;
  isActive: boolean;
}

export interface ProjectAccess {
  projectId: string;
  projectName: string;
  accessLevel: 'read' | 'write' | 'admin';
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  level: number;
  isActive: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  scope: string;
  isActive: boolean;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleAssignments?: RoleAssignment[];
}

export interface RoleAssignment {
  roleId: string;
  projectId?: string;
  country?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  newPassword?: string;
  roleAssignments?: RoleAssignment[];
}

export interface QueryUsersRequest {
  search?: string;
  isActive?: boolean;
  projectId?: string;
  country?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class UserManagementService {
  private baseUrl = '/users';

  // User CRUD operations
  async getUsers(params: QueryUsersRequest = {}): Promise<UsersResponse> {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });
    const endpoint = queryString.toString() ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await apiClient.get<UsersResponse>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch users');
    }
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseUrl}/${userId}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch user');
    }
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>(this.baseUrl, userData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create user');
    }
    return response.data;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`${this.baseUrl}/${userId}`, userData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update user');
    }
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await apiClient.delete(`${this.baseUrl}/${userId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete user');
    }
  }

  // Role management
  async getAvailableRoles(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>(`${this.baseUrl}/roles/available`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch roles');
    }
    return response.data;
  }

  async getAvailableProjectRoles(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>(`${this.baseUrl}/projects/roles/available`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch project roles');
    }
    return response.data;
  }

  // Project user management
  async getProjectUsers(projectId: string, params: QueryUsersRequest = {}): Promise<UsersResponse> {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });
    const endpoint = queryString.toString() 
      ? `${this.baseUrl}/projects/${projectId}?${queryString}` 
      : `${this.baseUrl}/projects/${projectId}`;
    
    const response = await apiClient.get<UsersResponse>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch project users');
    }
    return response.data;
  }

  async createProjectUser(projectId: string, userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>(`${this.baseUrl}/projects/${projectId}`, userData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create project user');
    }
    return response.data;
  }

  async updateProjectUser(projectId: string, userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`${this.baseUrl}/projects/${projectId}/${userId}`, userData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update project user');
    }
    return response.data;
  }

  async removeUserFromProject(projectId: string, userId: string): Promise<void> {
    const response = await apiClient.delete(`${this.baseUrl}/projects/${projectId}/${userId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove user from project');
    }
  }

  // Utility methods
  async updateProjectAccessLevel(userId: string, projectId: string, accessLevel: 'read' | 'write' | 'admin'): Promise<void> {
    // This would need to be implemented in the backend as a separate endpoint
    // For now, we'll use the update user endpoint
    await this.updateUser(userId, {
      // This is a placeholder - the actual implementation would need a dedicated endpoint
    });
  }
}

export const userManagementService = new UserManagementService();
