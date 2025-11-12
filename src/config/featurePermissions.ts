export type FeatureKey =
  | 'userManagement'
  | 'projectManagement'
  | 'forms'
  | 'finance'
  | 'kpis'
  | 'reports'
  | 'analytics';

export type PermissionString = string; // e.g., 'users:read', 'projects:update-project'

// Scaffold mapping of high-level features to the permissions they require.
// We will refine this list together feature-by-feature.
export const featurePermissions: Record<FeatureKey, PermissionString[]> = {
  userManagement: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'users:read-project',
    'users:create-project',
    'users:update-project',
    'users:delete-project',
  ],
  projectManagement: [
    'projects:read',
    'projects:create',
    'projects:update',
    'projects:delete',
    'projects:read-project',
    'projects:update-project',
    'projects:read-regional',
    'projects:update-regional',
  ],
  // NOTE: Forms-specific permissions are not present in the current seed set.
  // Until they exist, gate Forms UI via related project/report permissions where appropriate.
  forms: [
    'forms:read-project',
    'forms:create-project',
    'forms:update-project',
    'forms:delete-project',
    'forms:responses-read-project',
    'forms:responses-update-project',
    'forms:responses-delete-project',
    'forms:responses-export-project',
  ],
  finance: [
    'finance:read',
    'finance:update',
    'finance:read-project',
    'finance:update-project',
    'finance:read-regional',
    'finance:update-regional',
  ],
  kpis: [
    'kpis:read',
    'kpis:update',
    'kpis:read-project',
    'kpis:update-project',
    'kpis:read-regional',
    'kpis:update-regional',
  ],
  reports: [
    'reports:read',
    'reports:create',
    'reports:update',
    'reports:delete',
    'reports:read-project',
    'reports:create-project',
    'reports:update-project',
    'reports:delete-project',
    'reports:read-regional',
    'reports:create-regional',
  ],
  analytics: [
    'analytics:read',
    'analytics:read-project',
    'analytics:read-regional',
  ],
};

export function hasPermissionsForFeature(
  userPermissionNames: PermissionString[],
  feature: FeatureKey,
): boolean {
  const required = featurePermissions[feature] || [];
  return required.some((perm) => userPermissionNames.includes(perm));
}

// Detailed matrix per feature/submenu and scope/action for project-level control
export type FeatureMatrix = Record<
  FeatureKey,
  {
    // Global-level menu gating
    menu?: PermissionString[];
    // Submenus and operations, project-scoped where applicable
    submenus?: Record<
      string,
      {
        view?: PermissionString[];
        create?: PermissionString[];
        edit?: PermissionString[];
        delete?: PermissionString[];
        export?: PermissionString[];
      }
    >;
  }
>;

export const featurePermissionMatrix: FeatureMatrix = {
  userManagement: {
    menu: ['users:read'],
    submenus: {
      team: {
        view: ['users:read-project'],
        create: ['users:create-project'],
        edit: ['users:update-project'],
        delete: ['users:delete-project'],
      },
    },
  },
  projectManagement: {
    menu: ['projects:read'],
    submenus: {
      overview: { view: ['projects:read-project'] },
      settings: { edit: ['projects:update-project'] },
      regional: { view: ['projects:read-regional'], edit: ['projects:update-regional'] },
    },
  },
  forms: {
    menu: ['forms:read-project'],
    submenus: {
      formDesign: {
        view: ['forms:read-project'],
        create: ['forms:create-project'],
        edit: ['forms:update-project'],
        delete: ['forms:delete-project'],
      },
      responses: {
        view: ['forms:responses-read-project'],
        edit: ['forms:responses-update-project'],
        delete: ['forms:responses-delete-project'],
        export: ['forms:responses-export-project'],
      },
    },
  },
  finance: {
    menu: ['finance:read'],
    submenus: {
      projectFinance: { view: ['finance:read-project'], edit: ['finance:update-project'] },
      regionalFinance: { view: ['finance:read-regional'], edit: ['finance:update-regional'] },
    },
  },
  kpis: {
    menu: ['kpis:read'],
    submenus: {
      projectKPIs: { view: ['kpis:read-project'], edit: ['kpis:update-project'] },
      regionalKPIs: { view: ['kpis:read-regional'], edit: ['kpis:update-regional'] },
    },
  },
  reports: {
    menu: ['reports:read'],
    submenus: {
      projectReports: {
        view: ['reports:read-project'],
        create: ['reports:create-project'],
        edit: ['reports:update-project'],
        delete: ['reports:delete-project'],
      },
      regionalReports: {
        view: ['reports:read-regional'],
        create: ['reports:create-regional'],
      },
      globalReports: {
        view: ['reports:read'],
        create: ['reports:create'],
        edit: ['reports:update'],
        delete: ['reports:delete'],
      },
    },
  },
  analytics: {
    menu: ['analytics:read'],
    submenus: {
      dashboards: { view: ['analytics:read-project', 'analytics:read-regional'] },
    },
  },
};



