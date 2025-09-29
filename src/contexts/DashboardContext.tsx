import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types/dashboard';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { projectsApi } from '@/lib/api/projectsApi';

interface DashboardContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load and set current project based on URL
  useEffect(() => {
    const loadCurrentProject = async () => {
      const pathMatch = location.pathname.match(/\/dashboard\/projects\/([^\/]+)/);
      if (pathMatch) {
        const projectIdFromUrl = pathMatch[1];
        console.log('Project ID from URL:', projectIdFromUrl);
        
        try {
          // Load the project data from API
          const projectData = await projectsApi.getProjectById(projectIdFromUrl);
          console.log('Loaded project data:', projectData);
          setCurrentProject(projectData);
        } catch (error) {
          console.error('Error loading project:', error);
          setCurrentProject(null);
        }
      } else {
        // No project in URL, clear current project
        setCurrentProject(null);
      }
    };

    loadCurrentProject();
  }, [location.pathname]);

  // Redirect to login if not authenticated and user is trying to access dashboard
  useEffect(() => {
    if (!isAuthenticated && location.pathname.startsWith('/dashboard')) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, location.pathname]);



  return (
    <DashboardContext.Provider value={{
      currentProject,
      setCurrentProject,
      sidebarOpen,
      setSidebarOpen,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}