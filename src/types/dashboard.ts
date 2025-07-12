export interface User {
  id: string;
  name: string;
  email: string;
  role: 'global-admin' | 'country-admin' | 'project-admin' | 'branch-admin';
  accessibleProjects: string[];
  accessibleBranches: string[];
  accessibleCountries: string[];
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  country: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  progress: number;
  budget: number;
  spent: number;
}

export interface Outcome {
  id: string;
  projectId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
}

export interface Activity {
  id: string;
  outcomeId: string;
  title: string;
  description: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  responsible: string;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}