# Migration Guide: From icsData.ts to ProjectsContext

## Overview
This guide documents the migration from hardcoded project data in `icsData.ts` to centralized API-based data management in `ProjectsContext`.

## What's Changed

### ✅ **Migrated Functions**

| Old Function (icsData.ts) | New Function (ProjectsContext) | Status |
|---------------------------|--------------------------------|---------|
| `getAllProjects(user)` | `getAllProjectsForUser(user)` | ✅ Migrated |
| `getAccessibleProjectIds(user)` | `getAccessibleProjectIds(user)` | ✅ Migrated |
| `getProjectOutcomes(user, projectId)` | `getProjectOutcomes(user, projectId)` | ✅ Migrated |
| `getProjectActivities(user, projectId)` | `getProjectActivities(user, projectId)` | ✅ Migrated |
| `getProjectOutputs(user, projectId)` | `getProjectOutputs(user, projectId)` | ✅ Migrated |
| `getProjectSubActivities(user, projectId)` | `getProjectSubActivities(user, projectId)` | ✅ Migrated |
| `getProjectKPIs(user, projectId)` | `getProjectKPIs(user, projectId)` | ✅ Migrated |
| `getProjectReports(user, projectId)` | `getProjectReports(user, projectId)` | ✅ Migrated |

### 🔄 **Updated Components**

| Component | Changes | Status |
|-----------|---------|---------|
| `ProSidebar.tsx` | Uses ProjectsContext functions | ✅ Updated |
| `ProjectSwitcher.tsx` | Uses ProjectsContext functions | ✅ Updated |
| `DashboardContext.tsx` | Removed project management | ✅ Updated |

## How to Update Your Code

### Before (Old Way)
```typescript
import { getAllProjects, getProjectOutcomes } from '@/lib/icsData';

// In component
const accessibleProjects = getAllProjects(user);
const outcomes = getProjectOutcomes(user, projectId);
```

### After (New Way)
```typescript
import { useProjects } from '@/contexts/ProjectsContext';

// In component
const { getAllProjectsForUser, getProjectOutcomes } = useProjects();
const accessibleProjects = getAllProjectsForUser(user);
const outcomes = getProjectOutcomes(user, projectId);
```

## API Integration Status

### ✅ **Ready for API**
- Project CRUD operations
- Permission checking
- Project listing

### 🚧 **Pending API Implementation**
- Outcomes management
- Activities management
- Outputs management
- Sub-activities management
- KPIs management
- Reports management

### 📋 **API Endpoints Needed**
```
GET    /projects/:id/outcomes
POST   /projects/:id/outcomes
PATCH  /projects/:id/outcomes/:outcomeId
DELETE /projects/:id/outcomes/:outcomeId

GET    /projects/:id/activities
POST   /projects/:id/activities
PATCH  /projects/:id/activities/:activityId
DELETE /projects/:id/activities/:activityId

GET    /projects/:id/outputs
GET    /projects/:id/sub-activities
GET    /projects/:id/kpis
GET    /projects/:id/reports
```

## Benefits of Migration

1. **Centralized Data Management**: All project data flows through ProjectsContext
2. **API-Ready**: Functions are designed to work with backend APIs
3. **Permission-Aware**: Built-in access control for all operations
4. **Type Safety**: Full TypeScript support maintained
5. **Real-time Updates**: Changes reflect immediately across components
6. **Error Handling**: Consistent error handling across all operations

## Next Steps

1. **Backend API Development**: Implement the missing API endpoints
2. **Data Migration**: Move hardcoded data to database
3. **Testing**: Verify all functions work with real API data
4. **Cleanup**: Remove icsData.ts once migration is complete

## Temporary Behavior

Until the backend APIs are implemented, the migrated functions return empty arrays. This ensures the application continues to work while the backend is being developed.

## Support

If you encounter issues during migration:
1. Check that you're using the new ProjectsContext functions
2. Verify that the component is wrapped in ProjectsProvider
3. Ensure proper error handling for API calls
4. Check the browser console for any errors
