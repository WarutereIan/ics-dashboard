import React, { createContext, useContext, useState } from 'react';
import { User, Project } from '@/types/dashboard';
import { mockUser, mockProjects } from '@/lib/mockData';

interface DashboardContextType {
  user: User;
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>(mockUser);
  const [currentProject, setCurrentProject] = useState<Project | null>(
    mockProjects.find(p => p.id === 'mameb') || null
  );
  const [projects] = useState<Project[]>(mockProjects);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{
      user,
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