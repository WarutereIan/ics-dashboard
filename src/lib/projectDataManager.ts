import { Project, Outcome, Activity } from '@/types/dashboard';

// Storage keys
const STORAGE_KEYS = {
  PROJECTS: 'ics-dashboard-projects',
  PROJECT_DATA: 'ics-dashboard-project-data',
  PROJECT_KPIS: 'ics-dashboard-project-kpis',
};

// Interface for project data structure
interface ProjectData {
  outcomes: Outcome[];
  activities: Activity[];
  outputs?: any[];
  subActivities?: any[];
}

interface KPIData {
  outcomeId: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  type: 'bar' | 'progress';
}

// Get all projects (including dynamic ones)
export function getAllProjectsData(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Get project data (outcomes, activities, etc.)
export function getProjectData(projectId: string): ProjectData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECT_DATA);
    const projectDataMap = stored ? JSON.parse(stored) : {};
    return projectDataMap[projectId] || null;
  } catch (error) {
    console.error('Error loading project data:', error);
    return null;
  }
}

// Get project KPIs
export function getProjectKPIsData(projectId: string): KPIData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECT_KPIS);
    const kpiDataMap = stored ? JSON.parse(stored) : {};
    return kpiDataMap[projectId] || [];
  } catch (error) {
    console.error('Error loading project KPIs:', error);
    return [];
  }
}

// Save a new project
export function saveProject(
  project: Project,
  outcomes: Outcome[],
  activities: Activity[],
  kpis: KPIData[]
): boolean {
  try {
    // Save project to projects list
    const projects = getAllProjectsData();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    // Save project data (outcomes, activities)
    const projectDataMap = getStoredProjectDataMap();
    projectDataMap[project.id] = {
      outcomes,
      activities,
      outputs: [],
      subActivities: [],
    };
    localStorage.setItem(STORAGE_KEYS.PROJECT_DATA, JSON.stringify(projectDataMap));

    // Save KPIs
    const kpiDataMap = getStoredKPIDataMap();
    kpiDataMap[project.id] = kpis;
    localStorage.setItem(STORAGE_KEYS.PROJECT_KPIS, JSON.stringify(kpiDataMap));

    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
}

// Update project data
export function updateProject(
  projectId: string,
  updates: Partial<Project>
): boolean {
  try {
    const projects = getAllProjectsData();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex >= 0) {
      projects[projectIndex] = { ...projects[projectIndex], ...updates };
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
}

// Delete a project and all its data
export function deleteProject(projectId: string): boolean {
  try {
    // Remove from projects list
    const projects = getAllProjectsData();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filteredProjects));

    // Remove project data
    const projectDataMap = getStoredProjectDataMap();
    delete projectDataMap[projectId];
    localStorage.setItem(STORAGE_KEYS.PROJECT_DATA, JSON.stringify(projectDataMap));

    // Remove KPIs
    const kpiDataMap = getStoredKPIDataMap();
    delete kpiDataMap[projectId];
    localStorage.setItem(STORAGE_KEYS.PROJECT_KPIS, JSON.stringify(kpiDataMap));

    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

// Helper functions
function getStoredProjectDataMap(): Record<string, ProjectData> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECT_DATA);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading project data map:', error);
    return {};
  }
}

function getStoredKPIDataMap(): Record<string, KPIData[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECT_KPIS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading KPI data map:', error);
    return {};
  }
}

// Add outcome to existing project
export function addOutcomeToProject(projectId: string, outcome: Outcome): boolean {
  try {
    const projectData = getProjectData(projectId);
    if (!projectData) return false;

    projectData.outcomes.push(outcome);
    
    const projectDataMap = getStoredProjectDataMap();
    projectDataMap[projectId] = projectData;
    localStorage.setItem(STORAGE_KEYS.PROJECT_DATA, JSON.stringify(projectDataMap));
    
    return true;
  } catch (error) {
    console.error('Error adding outcome:', error);
    return false;
  }
}

// Add activity to existing project
export function addActivityToProject(projectId: string, activity: Activity): boolean {
  try {
    const projectData = getProjectData(projectId);
    if (!projectData) return false;

    projectData.activities.push(activity);
    
    const projectDataMap = getStoredProjectDataMap();
    projectDataMap[projectId] = projectData;
    localStorage.setItem(STORAGE_KEYS.PROJECT_DATA, JSON.stringify(projectDataMap));
    
    return true;
  } catch (error) {
    console.error('Error adding activity:', error);
    return false;
  }
}

// Add KPI to existing project
export function addKPIToProject(projectId: string, kpi: KPIData): boolean {
  try {
    const kpis = getProjectKPIsData(projectId);
    kpis.push(kpi);
    
    const kpiDataMap = getStoredKPIDataMap();
    kpiDataMap[projectId] = kpis;
    localStorage.setItem(STORAGE_KEYS.PROJECT_KPIS, JSON.stringify(kpiDataMap));
    
    return true;
  } catch (error) {
    console.error('Error adding KPI:', error);
    return false;
  }
}

// Check if project exists
export function projectExists(projectId: string): boolean {
  const projects = getAllProjectsData();
  return projects.some(p => p.id === projectId);
}

// Get project by ID
export function getProjectById(projectId: string): Project | null {
  const projects = getAllProjectsData();
  return projects.find(p => p.id === projectId) || null;
}

// Initialize with default data if needed
export function initializeProjectData(): void {
  // This function can be called on app startup to ensure
  // default projects are available if no custom projects exist
  const existingProjects = getAllProjectsData();
  if (existingProjects.length === 0) {
    // Could initialize with some default projects if needed
    console.log('No existing projects found in localStorage');
  }
}

// Clear all project data (for testing/reset purposes)
export function clearAllProjectData(): void {
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.PROJECT_DATA);
  localStorage.removeItem(STORAGE_KEYS.PROJECT_KPIS);
}

// Export types for use elsewhere
export type { ProjectData, KPIData };