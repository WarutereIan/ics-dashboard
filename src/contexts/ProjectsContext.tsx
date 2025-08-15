import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types/dashboard';
import { mockProjects } from '@/lib/mockData';

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectById: (id: string) => Project | null;
  getProjectsByCountry: (country: string) => Project[];
  refreshProjects: () => void;
  isLoading: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

// Local storage key for projects
const PROJECTS_STORAGE_KEY = 'ics-dashboard-projects';

// Helper function to generate unique project ID
const generateProjectId = (name: string): string => {
  const timestamp = Date.now();
  const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${sanitizedName}-${timestamp}`;
};

// Helper function to load projects from localStorage
const loadProjectsFromStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((project: any) => ({
        ...project,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate)
      }));
    }
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
  }
  return [];
};

// Helper function to save projects to localStorage
const saveProjectsToStorage = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
};

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize projects from localStorage or mock data
  useEffect(() => {
    const initializeProjects = () => {
      setIsLoading(true);
      try {
        const storedProjects = loadProjectsFromStorage();
        
        if (storedProjects.length === 0) {
          // If no stored projects, initialize with mock projects
          const initialProjects = mockProjects.map(project => ({
            ...project,
            id: project.id || generateProjectId(project.name)
          }));
          setProjects(initialProjects);
          saveProjectsToStorage(initialProjects);
        } else {
          setProjects(storedProjects);
        }
      } catch (error) {
        console.error('Error initializing projects:', error);
        // Fallback to mock projects
        setProjects(mockProjects);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProjects();
  }, []);

  // Add a new project
  const addProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    try {
      const newProject: Project = {
        ...projectData,
        id: generateProjectId(projectData.name),
        status: projectData.status || 'active',
        progress: projectData.progress || 0,
        budget: projectData.budget || 0,
        spent: projectData.spent || 0
      };

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);

      // Trigger storage event for other tabs/windows
      window.dispatchEvent(new StorageEvent('storage', {
        key: PROJECTS_STORAGE_KEY,
        newValue: JSON.stringify(updatedProjects)
      }));

      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw new Error('Failed to add project');
    }
  };

  // Update an existing project
  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
    try {
      const updatedProjects = projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      );
      
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);

      // Trigger storage event for other tabs/windows
      window.dispatchEvent(new StorageEvent('storage', {
        key: PROJECTS_STORAGE_KEY,
        newValue: JSON.stringify(updatedProjects)
      }));

      const updatedProject = updatedProjects.find(p => p.id === id);
      if (!updatedProject) {
        throw new Error('Project not found');
      }

      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  };

  // Delete a project
  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);

      // Trigger storage event for other tabs/windows
      window.dispatchEvent(new StorageEvent('storage', {
        key: PROJECTS_STORAGE_KEY,
        newValue: JSON.stringify(updatedProjects)
      }));

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
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

  // Refresh projects from localStorage
  const refreshProjects = () => {
    const storedProjects = loadProjectsFromStorage();
    setProjects(storedProjects);
  };

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROJECTS_STORAGE_KEY && e.newValue) {
        try {
          const updatedProjects = JSON.parse(e.newValue);
          setProjects(updatedProjects.map((project: any) => ({
            ...project,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate)
          })));
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: ProjectsContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByCountry,
    refreshProjects,
    isLoading
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
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
