import React, { createContext, useContext, useState } from 'react';
import { User, Project } from '@/types/dashboard';
import { mockUser, mockProjects } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

interface DashboardContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const storedUser = localStorage.getItem('ics-dashboard-user');
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  const [currentProject, setCurrentProject] = useState<Project | null>(
    mockProjects.find(p => p.id === 'mameb') || null
  );
  const [projects] = useState<Project[]>(mockProjects);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if user is undefined (after logout)
  React.useEffect(() => {
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