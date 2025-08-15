import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Project } from '@/types/dashboard';
import { mockUser, mockProjects } from '@/lib/mockData';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const storedUser = localStorage.getItem('ics-dashboard-user');
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  
  // Initialize with mock projects, will be updated by ProjectsContext
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  
  const [currentProject, setCurrentProject] = useState<Project | null>(
    projects[0] || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update current project based on URL
  useEffect(() => {
    const pathMatch = location.pathname.match(/\/dashboard\/projects\/([^\/]+)/);
    if (pathMatch) {
      const projectIdFromUrl = pathMatch[1];
      const projectFromUrl = projects.find(p => p.id === projectIdFromUrl);
      if (projectFromUrl && currentProject?.id !== projectFromUrl.id) {
        console.log('Updating current project from URL:', projectIdFromUrl, 'to:', projectFromUrl.name);
        setCurrentProject(projectFromUrl);
      }
    }
  }, [location.pathname, projects, currentProject?.id]);

  // Function to refresh projects from localStorage
  const refreshProjects = () => {
    const storedProjects = localStorage.getItem('ics-dashboard-projects');
    if (storedProjects) {
      try {
        const parsed = JSON.parse(storedProjects);
        const projectsWithDates = parsed.map((project: any) => ({
          ...project,
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate)
        }));
        setProjects(projectsWithDates);
      } catch (error) {
        console.error('Error refreshing projects:', error);
      }
    }
  };

  // Listen for localStorage changes from ProjectsContext
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ics-dashboard-projects' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const projectsWithDates = parsed.map((project: any) => ({
            ...project,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate)
          }));
          setProjects(projectsWithDates);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Redirect to login if user is undefined (after logout)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);



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