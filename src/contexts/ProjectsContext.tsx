import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, User, Outcome, Activity, Report } from '@/types/dashboard';
import { projectsApi } from '@/lib/api/projectsApi';
import { projectDataApi } from '@/lib/api/projectDataApi';
import { useAuth } from './AuthContext';
import { createEnhancedPermissionManager } from '@/lib/permissions';

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectById: (id: string) => Project | null;
  getProjectsByCountry: (country: string) => Project[];
  refreshProjects: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  
  // Permission and access control functions
  canAccessProject: (projectId: string) => boolean;
  getAccessibleProjectIds: () => string[];
  getAllProjectsForUser: () => { id: string; name: string }[];
  
  // Project data functions (migrated from icsData.ts)
  getProjectOutcomes: (projectId: string) => Promise<Outcome[]>;
  getProjectActivities: (projectId: string) => Promise<Activity[]>;
  getProjectOutputs: (projectId: string) => Promise<any[]>;
  getProjectSubActivities: (projectId: string) => Promise<any[]>;
  getProjectKPIs: (projectId: string) => Promise<any[]>;
  getProjectReports: (projectId: string) => Promise<Report[]>;
  
  // Data refresh trigger for UI components
  dataRefreshTrigger: number;
  triggerDataRefresh: () => void;
  clearProjectCache: (projectId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Cache for project data to prevent unnecessary re-fetches
  const [projectDataCache, setProjectDataCache] = useState<Map<string, { data: any[], timestamp: number }>>(new Map());

  // Create enhanced permission manager with current auth context
  const permissionManager = createEnhancedPermissionManager({
    user,
    isAuthenticated,
    isLoading: authLoading
  });

  // Debug user state
  useEffect(() => {
    console.log(`👤 ProjectsContext user state: authenticated=${isAuthenticated}, loading=${authLoading}, user=${user ? 'present' : 'null'}`);
    if (user) {
      console.log(`👤 User roles:`, user.roles?.map(r => `${r.roleName}(level:${r.level})`).join(', ') || 'none');
      console.log(`👤 Is global admin:`, permissionManager.isGlobalAdmin());
    }
  }, [user, isAuthenticated, authLoading, permissionManager]);

  // Load projects from API
  const loadProjects = useCallback(async () => {
    // Don't make API calls if not authenticated
    if (!isAuthenticated) {
      console.log('ProjectsContext - loadProjects called but user not authenticated, skipping');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('ProjectsContext - making API call to getAllProjects');
      const projectsData = await projectsApi.getAllProjects();
      
      // Convert date strings back to Date objects
      const projectsWithDates = projectsData.map((project: any) => ({
        ...project,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        createdAt: project.createdAt ? new Date(project.createdAt) : undefined,
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : undefined,
      }));
      
      setProjects(projectsWithDates);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initialize projects from API - only when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('ProjectsContext - loading projects (user is authenticated)');
      loadProjects();
    } else {
      console.log('ProjectsContext - skipping project load (not authenticated or still loading)');
      setIsLoading(false);
    }
  }, [loadProjects, isAuthenticated, authLoading]);

  // Add a new project
  const addProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    try {
      setError(null);
      const newProject = await projectsApi.createProject(projectData);
      
      // Convert date strings back to Date objects
      const projectWithDates = {
        ...newProject,
        startDate: new Date(newProject.startDate),
        endDate: new Date(newProject.endDate),
        createdAt: newProject.createdAt ? new Date(newProject.createdAt) : undefined,
        updatedAt: newProject.updatedAt ? new Date(newProject.updatedAt) : undefined,
      };
      
      setProjects(prev => [...prev, projectWithDates]);
      return projectWithDates;
    } catch (err) {
      console.error('Error adding project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update an existing project
  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
    try {
      setError(null);
      const updatedProject = await projectsApi.updateProject(id, updates);
      
      // Convert date strings back to Date objects
      const projectWithDates = {
        ...updatedProject,
        startDate: new Date(updatedProject.startDate),
        endDate: new Date(updatedProject.endDate),
        createdAt: updatedProject.createdAt ? new Date(updatedProject.createdAt) : undefined,
        updatedAt: updatedProject.updatedAt ? new Date(updatedProject.updatedAt) : undefined,
      };
      
      setProjects(prev => prev.map(project => 
        project.id === id ? projectWithDates : project
      ));
      
      return projectWithDates;
    } catch (err) {
      console.error('Error updating project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a project
  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await projectsApi.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get project by ID
  const getProjectById = (id: string): Project | null => {
    return projects.find(project => project.id === id) || null;
  };

  // Get projects by country
  const getProjectsByCountry = (country: string): Project[] => {
    return projects.filter(project => 
      project.country.toLowerCase() === country.toLowerCase()
    );
  };

  // Refresh projects from API
  const refreshProjects = useCallback(async (): Promise<void> => {
    await loadProjects();
  }, [loadProjects]);

  // Permission and access control functions
  const canAccessProject = (projectId: string): boolean => {
    const hasAccess = permissionManager.canAccessProject(projectId, 'read');
    console.log(`🔐 Access check for project ${projectId}: ${hasAccess ? 'GRANTED' : 'DENIED'}`);
    return hasAccess;
  };

  const getAccessibleProjectIds = (): string[] => {
    if (!user) return [];
    const allProjectIds = projects.map(p => p.id);
    return permissionManager.getAccessibleProjectIds(allProjectIds);
  };

  const getAllProjectsForUser = (): { id: string; name: string }[] => {
    const accessibleIds = getAccessibleProjectIds();
    return projects
      .filter(project => accessibleIds.includes(project.id))
      .map(project => ({
        id: project.id,
        name: project.name,
      }));
  };

  // Project data functions (migrated from icsData.ts)
  const getProjectOutcomes = useCallback(async (projectId: string): Promise<Outcome[]> => {
    if (!canAccessProject(projectId)) return [];
    
    const cacheKey = `outcomes-${projectId}`;
    const cached = projectDataCache.get(cacheKey);
    const now = Date.now();
    
    // Return cached data if it's less than 30 seconds old
    if (cached && (now - cached.timestamp) < 30000) {
      console.log(`📦 Using cached outcomes for project ${projectId} (${cached.data.length} items)`);
      return cached.data;
    }
    
    try {
      console.log(`🔄 Fetching outcomes for project ${projectId} (refresh trigger: ${dataRefreshTrigger})`);
      const result = await projectDataApi.getProjectOutcomes(projectId);
      console.log(`✅ Fetched ${result.length} outcomes for project ${projectId}`);
      
      // Cache the result
      setProjectDataCache(prev => new Map(prev.set(cacheKey, { data: result, timestamp: now })));
      
      return result;
    } catch (error) {
      console.error('Error fetching project outcomes:', error);
      return [];
    }
  }, [dataRefreshTrigger, canAccessProject, projectDataCache]);

  const getProjectActivities = useCallback(async (projectId: string): Promise<Activity[]> => {
    if (!canAccessProject(projectId)) return [];
    
    const cacheKey = `activities-${projectId}`;
    const cached = projectDataCache.get(cacheKey);
    const now = Date.now();
    
    // Return cached data if it's less than 30 seconds old
    if (cached && (now - cached.timestamp) < 30000) {
      console.log(`📦 Using cached activities for project ${projectId} (${cached.data.length} items)`);
      return cached.data;
    }
    
    try {
      console.log(`🔄 Fetching activities for project ${projectId} (refresh trigger: ${dataRefreshTrigger})`);
      const result = await projectDataApi.getProjectActivities(projectId);
      console.log(`✅ Fetched ${result.length} activities for project ${projectId}`);
      
      // Cache the result
      setProjectDataCache(prev => new Map(prev.set(cacheKey, { data: result, timestamp: now })));
      
      return result;
    } catch (error) {
      console.error('Error fetching project activities:', error);
      return [];
    }
  }, [dataRefreshTrigger, canAccessProject, projectDataCache]);

  const getProjectOutputs = useCallback(async (projectId: string): Promise<any[]> => {
    if (!canAccessProject(projectId)) return [];
    
    try {
      return await projectDataApi.getProjectOutputs(projectId);
    } catch (error) {
      console.error('Error fetching project outputs:', error);
      return [];
    }
  }, []);

  const getProjectSubActivities = useCallback(async (projectId: string): Promise<any[]> => {
    if (!canAccessProject(projectId)) return [];
    
    try {
      console.log(`🔄 Fetching sub-activities for project ${projectId} (refresh trigger: ${dataRefreshTrigger})`);
      const result = await projectDataApi.getProjectSubActivities(projectId);
      console.log(`✅ Fetched ${result.length} sub-activities for project ${projectId}`);
      return result;
    } catch (error) {
      console.error('Error fetching project sub-activities:', error);
      return [];
    }
  }, [dataRefreshTrigger]);

  const getProjectKPIs = useCallback(async (projectId: string): Promise<any[]> => {
    if (!canAccessProject(projectId)) return [];
    
    const cacheKey = `kpis-${projectId}`;
    const cached = projectDataCache.get(cacheKey);
    const now = Date.now();
    
    // Return cached data if it's less than 30 seconds old
    if (cached && (now - cached.timestamp) < 30000) {
      console.log(`📦 Using cached KPIs for project ${projectId} (${cached.data.length} items)`);
      return cached.data;
    }
    
    try {
      console.log(`🔄 Fetching KPIs for project ${projectId} (refresh trigger: ${dataRefreshTrigger})`);
      const result = await projectDataApi.getProjectKPIs(projectId);
      console.log(`✅ Fetched ${result.length} KPIs for project ${projectId}`);
      
      // Cache the result
      setProjectDataCache(prev => new Map(prev.set(cacheKey, { data: result, timestamp: now })));
      
      return result;
    } catch (error) {
      console.error('Error fetching project KPIs:', error);
      return [];
    }
  }, [dataRefreshTrigger, canAccessProject, projectDataCache]);

  const getProjectReports = useCallback(async (projectId: string): Promise<Report[]> => {
    if (!canAccessProject(projectId)) return [];
    
    try {
      return await projectDataApi.getProjectReports(projectId);
    } catch (error) {
      console.error('Error fetching project reports:', error);
      return [];
    }
  }, []);

  // Clear cache for a specific project when data is updated
  const clearProjectCache = useCallback((projectId: string) => {
    setProjectDataCache(prev => {
      const newCache = new Map(prev);
      // Remove all cache entries for this project
      for (const [key, value] of newCache.entries()) {
        if (key.includes(projectId)) {
          newCache.delete(key);
        }
      }
      return newCache;
    });
  }, []);

  // Trigger data refresh for UI components
  const triggerDataRefresh = useCallback(() => {
    const newTrigger = dataRefreshTrigger + 1;
    console.log(`🔄 Triggering data refresh for all project components: ${dataRefreshTrigger} -> ${newTrigger}`);
    setDataRefreshTrigger(newTrigger);
  }, [dataRefreshTrigger]);

  const value: ProjectsContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByCountry,
    refreshProjects,
    isLoading,
    error,
    canAccessProject,
    getAccessibleProjectIds,
    getAllProjectsForUser,
    getProjectOutcomes,
    getProjectActivities,
    getProjectOutputs,
    getProjectSubActivities,
    getProjectKPIs,
    getProjectReports,
    dataRefreshTrigger,
    triggerDataRefresh,
    clearProjectCache,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    console.error('useProjects called outside of ProjectsProvider. Component hierarchy should be: App > AuthProvider > DashboardProvider > ProjectsProvider > [your component]');
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
