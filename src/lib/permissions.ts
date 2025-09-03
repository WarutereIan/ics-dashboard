import { User } from '@/types/dashboard';

export interface PermissionContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Centralized permission utility for consistent access control across the app
 */
export class PermissionManager {
  private context: PermissionContext;

  constructor(context: PermissionContext) {
    this.context = context;
  }

  /**
   * Check if current user is a global admin
   */
  isGlobalAdmin(): boolean {
    const { user, isLoading } = this.context;
    
    if (isLoading) {
      console.log('🔐 Auth loading - global admin check deferred');
      return false;
    }

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }

    return user.roles.some(role => role.roleName === 'global-admin');
  }

  /**
   * Check if user has access to a specific project
   */
  canAccessProject(projectId: string, accessLevel: 'read' | 'write' | 'admin' = 'read'): boolean {
    const { user, isAuthenticated, isLoading } = this.context;

    // If auth is still loading, grant temporary access to prevent blocking
    if (isLoading) {
      console.log(`🔐 Auth loading - temporary access granted for project ${projectId}`);
      return true;
    }

    // If not authenticated, deny access
    if (!isAuthenticated) {
      console.log(`🔐 Not authenticated - access denied for project ${projectId}`);
      return false;
    }

    if (!user) {
      console.log(`🔐 No user object - access denied for project ${projectId}`);
      return false;
    }

    // Global admin has access to everything
    if (this.isGlobalAdmin()) {
      console.log(`🔐 Global admin access granted for project ${projectId}`);
      return true;
    }

    if (!user.roles || !Array.isArray(user.roles)) {
      console.log(`🔐 No roles array - access denied for project ${projectId}`);
      return false;
    }

    // Check for project-specific roles
    const projectRole = user.roles.find(role => role.projectId === projectId);
    if (projectRole) {
      const hasAccess = this.checkRoleAccess(projectRole, accessLevel);
      console.log(`🔐 Project ${projectId} role-based access: ${hasAccess ? 'GRANTED' : 'DENIED'} (role: ${projectRole.roleName}, level: ${projectRole.level})`);
      return hasAccess;
    }

    // Fallback: allow read access if user has any roles (for development/testing)
    if (user.roles.length > 0 && accessLevel === 'read') {
      console.log(`🔐 Fallback read access granted for project ${projectId} - user has roles: ${user.roles.map(r => r.roleName).join(', ')}`);
      return true;
    }

    console.log(`🔐 No access found for project ${projectId} - user has no applicable roles`);
    return false;
  }

  /**
   * Check if a role grants the required access level
   */
  private checkRoleAccess(role: { roleName: string; level: number }, accessLevel: 'read' | 'write' | 'admin'): boolean {
    const roleName = role.roleName.toLowerCase();
    
    switch (accessLevel) {
      case 'admin':
        return roleName.includes('admin') && role.level >= 3;
      case 'write':
        return (roleName.includes('admin') || roleName.includes('write')) && role.level >= 2;
      case 'read':
        return role.level >= 1; // Any active role grants read access
      default:
        return false;
    }
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const { user } = this.context;
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }
    return user.permissions.includes(permission);
  }

  /**
   * Get all accessible project IDs for the current user
   */
  getAccessibleProjectIds(projectIds: string[]): string[] {
    if (this.isGlobalAdmin()) {
      return projectIds;
    }
    
    return projectIds.filter(projectId => this.canAccessProject(projectId, 'read'));
  }
}

/**
 * Hook to create a permission manager with current auth context
 */
export function createPermissionManager(authContext: PermissionContext): PermissionManager {
  return new PermissionManager(authContext);
}
