import { User } from '@/types/dashboard';

export interface PermissionContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Backend role definitions (matching auth-seed.ts)
export const ROLE_DEFINITIONS = {
  'global-admin': { level: 1, description: 'ICT Support/ICS SP Administrator - Full System Access' },
  'director-africa': { level: 2, description: 'Director Africa - All Organizational Data, KPIs, Finance, Cross-Regional Analytics' },
  'meal-coordinator': { level: 2, description: 'MEAL Coordinator - All Organizational Data, KPIs, Finance, Cross-Regional Analytics' },
  'finance-operations-manager': { level: 2, description: 'Finance and Operations Manager/HR - All Organizational Data, KPIs, Finance, Cross-Regional Analytics' },
  'coordinator-tanzania': { level: 3, description: 'Coordinator Tanzania - Regional Aggregates, Cross-Country Data, Performance Metrics' },
  'coordinator-cote-divoire': { level: 3, description: 'Coordinator Côte d\'Ivoire - Regional Aggregates, Cross-Country Data, Performance Metrics' },
  'project-coordinator': { level: 4, description: 'Project Coordinator - All ICS Project Data, Budget, Team Management, Component Coordination' },
  'project-officer': { level: 5, description: 'Project Officer - Project-specific data and activities' },
  'finance-officer': { level: 6, description: 'Finance Officer - All Organizational Data, KPIs, Finance, Cross-Regional Analytics' },
  'meal-officer': { level: 6, description: 'MEAL Officer - Metrics, QA, Tool Results, Assessment Data, Performance Indicators' },
  'communications': { level: 6, description: 'Communications - Regional Aggregates, Cross-Country Data, Performance Metrics' },
} as const;

// Backend permission definitions (matching auth-seed.ts)
export const PERMISSION_DEFINITIONS = {
  // User Management
  'users:create': { resource: 'users', action: 'create', scope: 'global' },
  'users:read': { resource: 'users', action: 'read', scope: 'global' },
  'users:update': { resource: 'users', action: 'update', scope: 'global' },
  'users:delete': { resource: 'users', action: 'delete', scope: 'global' },
  'users:read-own': { resource: 'users', action: 'read', scope: 'own' },
  'users:update-own': { resource: 'users', action: 'update', scope: 'own' },
  'users:create-project': { resource: 'users', action: 'create', scope: 'project' },
  'users:read-project': { resource: 'users', action: 'read', scope: 'project' },
  'users:update-project': { resource: 'users', action: 'update', scope: 'project' },
  'users:delete-project': { resource: 'users', action: 'delete', scope: 'project' },

  // Project Management
  'projects:create': { resource: 'projects', action: 'create', scope: 'global' },
  'projects:read': { resource: 'projects', action: 'read', scope: 'global' },
  'projects:update': { resource: 'projects', action: 'update', scope: 'global' },
  'projects:delete': { resource: 'projects', action: 'delete', scope: 'global' },
  'projects:read-regional': { resource: 'projects', action: 'read', scope: 'regional' },
  'projects:update-regional': { resource: 'projects', action: 'update', scope: 'regional' },
  'projects:read-project': { resource: 'projects', action: 'read', scope: 'project' },
  'projects:update-project': { resource: 'projects', action: 'update', scope: 'project' },

  // Finance Management
  'finance:read': { resource: 'finance', action: 'read', scope: 'global' },
  'finance:update': { resource: 'finance', action: 'update', scope: 'global' },
  'finance:read-regional': { resource: 'finance', action: 'read', scope: 'regional' },
  'finance:update-regional': { resource: 'finance', action: 'update', scope: 'regional' },
  'finance:read-project': { resource: 'finance', action: 'read', scope: 'project' },
  'finance:update-project': { resource: 'finance', action: 'update', scope: 'project' },

  // KPI Management
  'kpis:read': { resource: 'kpis', action: 'read', scope: 'global' },
  'kpis:update': { resource: 'kpis', action: 'update', scope: 'global' },
  'kpis:read-regional': { resource: 'kpis', action: 'read', scope: 'regional' },
  'kpis:update-regional': { resource: 'kpis', action: 'update', scope: 'regional' },
  'kpis:read-project': { resource: 'kpis', action: 'read', scope: 'project' },
  'kpis:update-project': { resource: 'kpis', action: 'update', scope: 'project' },

  // Reports Management
  'reports:create': { resource: 'reports', action: 'create', scope: 'global' },
  'reports:read': { resource: 'reports', action: 'read', scope: 'global' },
  'reports:update': { resource: 'reports', action: 'update', scope: 'global' },
  'reports:delete': { resource: 'reports', action: 'delete', scope: 'global' },
  'reports:read-regional': { resource: 'reports', action: 'read', scope: 'regional' },
  'reports:create-regional': { resource: 'reports', action: 'create', scope: 'regional' },
  'reports:read-project': { resource: 'reports', action: 'read', scope: 'project' },
  'reports:create-project': { resource: 'reports', action: 'create', scope: 'project' },
  'reports:update-project': { resource: 'reports', action: 'update', scope: 'project' },
  'reports:delete-project': { resource: 'reports', action: 'delete', scope: 'project' },

  // Analytics
  'analytics:read': { resource: 'analytics', action: 'read', scope: 'global' },
  'analytics:read-regional': { resource: 'analytics', action: 'read', scope: 'regional' },
  'analytics:read-project': { resource: 'analytics', action: 'read', scope: 'project' },

  // Kobo Data Management (new)
  'kobo:read': { resource: 'kobo', action: 'read', scope: 'global' },
  'kobo:update': { resource: 'kobo', action: 'update', scope: 'global' },
  'kobo:read-regional': { resource: 'kobo', action: 'read', scope: 'regional' },
  'kobo:update-regional': { resource: 'kobo', action: 'update', scope: 'regional' },
  'kobo:read-project': { resource: 'kobo', action: 'read', scope: 'project' },
  'kobo:update-project': { resource: 'kobo', action: 'update', scope: 'project' },
} as const;

// Role-based permission mappings (matching auth-seed.ts)
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  'global-admin': Object.keys(PERMISSION_DEFINITIONS), // All permissions

  'director-africa': [
    'users:read', 'users:create', 'users:update',
    'projects:read', 'projects:update',
    'finance:read', 'finance:update',
    'kpis:read', 'kpis:update',
    'reports:read', 'reports:create', 'reports:update',
    'analytics:read'
  ],

  'meal-coordinator': [
    'users:read',
    'projects:read',
    'kpis:read', 'kpis:update',
    'reports:read', 'reports:create', 'reports:update',
    'analytics:read'
  ],

  'finance-operations-manager': [
    'users:read', 'users:create', 'users:update',
    'projects:read',
    'finance:read', 'finance:update',
    'kpis:read',
    'reports:read', 'reports:create',
    'analytics:read'
  ],

  'coordinator-tanzania': [
    // Restrict to Projects and User Management within country scope
    'projects:read-regional', 'projects:update-regional',
    'users:read-regional', 'users:create-regional', 'users:update-regional'
  ],

  'coordinator-cote-divoire': [
    // Restrict to Projects and User Management within country scope
    'projects:read-regional', 'projects:update-regional',
    'users:read-regional', 'users:create-regional', 'users:update-regional'
  ],

  'project-coordinator': [
    'users:read-project', 'users:create-project', 'users:update-project', 'users:delete-project',
    'projects:read-project', 'projects:update-project',
    'finance:read-project', 'finance:update-project',
    'kpis:read-project', 'kpis:update-project',
    'reports:read-project', 'reports:create-project', 'reports:update-project', 'reports:delete-project',
    'analytics:read-project',
    'kobo:read-project', 'kobo:update-project'
  ],

  'project-officer': [
    'users:read-own', 'users:update-own',
    'users:read-project',
    'projects:read-project',
    'finance:read-project',
    'kpis:read-project',
    'reports:read-project', 'reports:create-project',
    'analytics:read-project',
    'kobo:read-project'
  ],

  'finance-officer': [
    'users:read',
    'finance:read', 'finance:update',
    'kpis:read',
    'reports:read', 'reports:create'
  ],

  'meal-officer': [
    'kpis:read', 'kpis:update',
    'reports:read', 'reports:create'
  ],

  'communications': [
    'projects:read-regional',
    'reports:read-regional',
    'analytics:read-regional'
  ],
} as const;

/**
 * Enhanced permission manager that matches backend granular structure
 */
export class EnhancedPermissionManager {
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
   * Get user's highest role level
   */
  getUserHighestLevel(): number {
    const { user } = this.context;
    
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return 999; // No access
    }

    const levels = user.roles
      .filter(role => role.isActive)
      .map(role => ROLE_DEFINITIONS[role.roleName as keyof typeof ROLE_DEFINITIONS]?.level || 999);
    
    return Math.min(...levels);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const { user } = this.context;
    
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }

    // Global admin has all permissions
    if (this.isGlobalAdmin()) {
      return true;
    }

    // Honor server-provided direct permissions if present
    const directPermissions = (user as any).permissions as string[] | undefined;
    if (Array.isArray(directPermissions) && directPermissions.includes(permission)) {
      return true;
    }

    // Check if any of user's roles have this permission
    for (const role of user.roles) {
      if (!role.isActive) continue;
      
      const rolePermissions = ROLE_PERMISSIONS[role.roleName as keyof typeof ROLE_PERMISSIONS];
      if (rolePermissions && rolePermissions.includes(permission)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if user has permission for a specific resource and action
   */
  hasResourcePermission(resource: string, action: string, scope: string = 'global'): boolean {
    // First check direct permission without scope suffix
    const direct = this.hasPermission(`${resource}:${action}`);
    if (direct) return true;

    // Then check with scope suffix if provided
    const scoped = scope !== 'global' ? this.hasPermission(`${resource}:${action}-${scope}`) : false;
    return scoped;
  }

  /**
   * Check if user can access a specific project
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
    const projectRole = user.roles.find(role => role.projectId === projectId && role.isActive);
    if (projectRole) {
      const hasAccess = this.checkRoleAccess(projectRole, accessLevel);
      console.log(`🔐 Project ${projectId} role-based access: ${hasAccess ? 'GRANTED' : 'DENIED'} (role: ${projectRole.roleName}, level: ${projectRole.level})`);
      return hasAccess;
    }

    // Check for regional/global permissions
    const hasGlobalAccess = this.hasResourcePermission('projects', 'read', 'global');
    const hasRegionalAccess = this.hasResourcePermission('projects', 'read', 'regional');
    
    if (hasGlobalAccess || hasRegionalAccess) {
      console.log(`🔐 Global/Regional access granted for project ${projectId}`);
      return true;
    }

    console.log(`🔐 No access found for project ${projectId} - user has no applicable roles`);
    return false;
  }

  /**
   * Check if a role grants the required access level
   */
  private checkRoleAccess(role: { roleName: string; level: number }, accessLevel: 'read' | 'write' | 'admin'): boolean {
    const roleDefinition = ROLE_DEFINITIONS[role.roleName as keyof typeof ROLE_DEFINITIONS];
    if (!roleDefinition) return false;
    
    switch (accessLevel) {
      case 'admin':
        return roleDefinition.level <= 3; // Level 1-3 can admin
      case 'write':
        return roleDefinition.level <= 4; // Level 1-4 can write
      case 'read':
        return roleDefinition.level <= 6; // All levels can read
      default:
        return false;
    }
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

  /**
   * Check if user can access a specific project component
   */
  canAccessProjectComponent(projectId: string, component: 'kpis' | 'reports' | 'finance' | 'kobo' | 'analytics', action: 'read' | 'write' = 'read'): boolean {
    // First check if user can access the project at all
    if (!this.canAccessProject(projectId, 'read')) {
      return false;
    }

    // Check for component-specific permissions
    const hasProjectPermission = this.hasResourcePermission(component, action, 'project');
    const hasRegionalPermission = this.hasResourcePermission(component, action, 'regional');
    const hasGlobalPermission = this.hasResourcePermission(component, action, 'global');

    return hasProjectPermission || hasRegionalPermission || hasGlobalPermission;
  }

  /**
   * Get user's accessible countries/regions
   */
  getAccessibleCountries(): string[] {
    const { user } = this.context;
    
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return [];
    }

    if (this.isGlobalAdmin()) {
      return ['all']; // Global admin sees all
    }

    const countries = new Set<string>();
    
    for (const role of user.roles) {
      if (!role.isActive) continue;
      
      if (role.country) {
        countries.add(role.country);
      }
      
      // Regional coordinators have access to their region
      if (role.roleName === 'coordinator-tanzania') {
        countries.add('Tanzania');
      } else if (role.roleName === 'coordinator-cote-divoire') {
        countries.add('Côte d\'Ivoire');
      }
    }

    return Array.from(countries);
  }

  /**
   * Check if user can manage users
   */
  canManageUsers(scope: 'global' | 'regional' | 'project' = 'global'): boolean {
    return this.hasResourcePermission('users', 'create', scope) || 
           this.hasResourcePermission('users', 'update', scope) ||
           this.hasResourcePermission('users', 'delete', scope);
  }

  /**
   * Check if user can create projects
   */
  canCreateProjects(): boolean {
    return this.hasResourcePermission('projects', 'create', 'global');
  }

  /**
   * Check if user can manage project data
   */
  canManageProjectData(projectId: string): boolean {
    return this.canAccessProject(projectId, 'write');
  }
}

/**
 * Hook to create an enhanced permission manager with current auth context
 */
export function createEnhancedPermissionManager(authContext: PermissionContext): EnhancedPermissionManager {
  return new EnhancedPermissionManager(authContext);
}

