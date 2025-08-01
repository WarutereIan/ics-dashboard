import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Project } from '@/types/dashboard';
import { mockUser, mockProjects } from '@/lib/mockData';
import { getAllProjectsData } from '@/lib/projectDataManager';
import { useNavigate } from 'react-router-dom';

interface DashboardContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  refreshProjects: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('ics-dashboard-user');
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  
  // Combine static and dynamic projects (deduplicated)
  const [projects, setProjects] = useState<Project[]>(() => {
    const dynamicProjects = getAllProjectsData();
    const projectMap = new Map<string, Project>();
    
    // Add mock projects first
    mockProjects.forEach(project => {
      projectMap.set(project.id, project);
    });
    
    // Add dynamic projects (won't overwrite existing ones)
    dynamicProjects.forEach(project => {
      if (!projectMap.has(project.id)) {
        projectMap.set(project.id, project);
      }
    });
    
    return Array.from(projectMap.values());
  });
  
  const [currentProject, setCurrentProject] = useState<Project | null>(
    projects[0] || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to refresh projects from localStorage
  const refreshProjects = () => {
    const dynamicProjects = getAllProjectsData();
    const projectMap = new Map<string, Project>();
    
    // Add mock projects first
    mockProjects.forEach(project => {
      projectMap.set(project.id, project);
    });
    
    // Add dynamic projects (won't overwrite existing ones)
    dynamicProjects.forEach(project => {
      if (!projectMap.has(project.id)) {
        projectMap.set(project.id, project);
      }
    });
    
    setProjects(Array.from(projectMap.values()));
  };

  // Redirect to login if user is undefined (after logout)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Listen for localStorage changes to update projects
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ics-dashboard-projects') {
        refreshProjects();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <DashboardContext.Provider value={{
      user,
      setUser,
      currentProject,
      projects,
      setCurrentProject,
      sidebarOpen,
      setSidebarOpen,
      refreshProjects,
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