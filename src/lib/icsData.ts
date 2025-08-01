import { User, Outcome, Activity, Report } from '@/types/dashboard';
import { aaclOutcomes, aaclActivities, aaclKPIs } from './aaclData';
import { cdwOutcomes, cdwActivities, cdwKPIs } from './cdwData';
import { kuimarishaOutcomes, kuimarishaActivities, kuimarishaKPIs } from './kuimarishaData';
import { npppOutcomes, npppActivities, npppKPIs } from './npppData';
import { vacisKeOutcomes, vacisKeActivities, vacisKeOutputs, vacisKeKPIs } from './vacisKeData';
import { vacisTzOutcomes, vacisTzActivities, vacisTzOutputs, vacisTzKPIs } from './vacisTzData';
import { mamebOutcomes, mamebActivities, mamebOutputs, mamebSubActivities, mamebKPIs } from './mamebData';
import { 
  getAllProjectsData, 
  getProjectData, 
  getProjectKPIsData,
  projectExists 
} from './projectDataManager';

// Map projectId to data
const projectData: Record<string, { outcomes: Outcome[]; activities: Activity[]; outputs?: any[]; subActivities?: any[] }> = {
  'aacl': { outcomes: aaclOutcomes, activities: aaclActivities },
  'cdw': { outcomes: cdwOutcomes, activities: cdwActivities },
  'kuimarisha': { outcomes: kuimarishaOutcomes, activities: kuimarishaActivities },
  'nppp': { outcomes: npppOutcomes, activities: npppActivities },
  'vacis-ke': { outcomes: vacisKeOutcomes, activities: vacisKeActivities, outputs: vacisKeOutputs },
  'vacis-tz': { outcomes: vacisTzOutcomes, activities: vacisTzActivities, outputs: vacisTzOutputs },
  'mameb': { outcomes: mamebOutcomes, activities: mamebActivities, outputs: mamebOutputs, subActivities: mamebSubActivities },
};

// List of all project IDs (static + dynamic)
function getAllProjectIds(): string[] {
  const staticProjectIds = Object.keys(projectData);
  const dynamicProjects = getAllProjectsData();
  const dynamicProjectIds = dynamicProjects.map(p => p.id);
  
  // Combine and deduplicate
  return Array.from(new Set([...staticProjectIds, ...dynamicProjectIds]));
}

// Permission check: can user access this project?
function canAccessProject(user: User, projectId: string): boolean {
  if (user.role === 'global-admin') return true;
  if (user.role === 'country-admin') return user.accessibleProjects.includes(projectId);
  if (user.role === 'project-admin') return user.accessibleProjects.includes(projectId);
  if (user.role === 'branch-admin') return user.accessibleProjects.includes(projectId);
  if (user.role === 'viewer') return user.accessibleProjects.includes(projectId);
  return false;
}

// Get all accessible project IDs for a user
export function getAccessibleProjectIds(user: User): string[] {
  const allProjectIds = getAllProjectIds();
  if (user.role === 'global-admin') return allProjectIds;
  return allProjectIds.filter(pid => canAccessProject(user, pid));
}

// Get all outcomes for a project, with permission check
export function getProjectOutcomes(user: User, projectId: string): Outcome[] {
  if (!canAccessProject(user, projectId)) return [];
  
  // Check static data first
  if (projectData[projectId]?.outcomes) {
    return projectData[projectId].outcomes;
  }
  
  // Check dynamic data
  const dynamicProjectData = getProjectData(projectId);
  return dynamicProjectData?.outcomes || [];
}

// Get all activities for a project, with permission check
export function getProjectActivities(user: User, projectId: string): Activity[] {
  if (!canAccessProject(user, projectId)) return [];
  
  // Check static data first
  if (projectData[projectId]?.activities) {
    return projectData[projectId].activities;
  }
  
  // Check dynamic data
  const dynamicProjectData = getProjectData(projectId);
  return dynamicProjectData?.activities || [];
}

// Note: Activities for vacis-ke and vacis-tz include subActivities arrays for detailed tracking.
// All getProjectActivities calls for these projects will return activities with subActivities.
// Get all projects (IDs and basic info) accessible to the user
export function getAllProjects(user: User): { id: string; name: string }[] {
  const accessibleIds = getAccessibleProjectIds(user);
  const projects = [];
  
  // Add static projects
  for (const id of accessibleIds) {
    if (projectData[id]) {
      projects.push({
        id,
        name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      });
    }
  }
  
  // Add dynamic projects
  const dynamicProjects = getAllProjectsData();
  for (const project of dynamicProjects) {
    if (accessibleIds.includes(project.id)) {
      projects.push({
        id: project.id,
        name: project.name,
      });
    }
  }
  
  return projects;
}

export function getProjectOutputs(user: User, projectId: string) {
  if (!getAccessibleProjectIds(user).includes(projectId)) return [];
  
  // Check static data first
  const staticProject = projectData[projectId];
  if (staticProject?.outputs) return staticProject.outputs;
  
  // Check dynamic data
  const dynamicProjectData = getProjectData(projectId);
  if (dynamicProjectData?.outputs) return dynamicProjectData.outputs;
  
  // Synthesize outputs for projects that don't have them
  // For now, return an empty array (or you could synthesize from activities if needed)
  return [];
}

export function getProjectSubActivities(user: User, projectId: string) {
  if (!getAccessibleProjectIds(user).includes(projectId)) return [];
  
  // Check static data first
  const staticProject = projectData[projectId];
  if (staticProject?.subActivities) return staticProject.subActivities;
  
  // Check dynamic data
  const dynamicProjectData = getProjectData(projectId);
  if (dynamicProjectData?.subActivities) return dynamicProjectData.subActivities;
  
  // Synthesize subActivities from activities if not present
  const activities = getProjectActivities(user, projectId);
  return activities.flatMap(a => a.subActivities || []);
}

// Unified KPI fetcher
export function getProjectKPIs(user: User, projectId: string) {
  if (!getAccessibleProjectIds(user).includes(projectId)) return [];
  
  // Check static KPIs first
  if (projectId === 'mameb') return mamebKPIs;
  if (projectId === 'vacis-ke') return vacisKeKPIs;
  if (projectId === 'vacis-tz') return vacisTzKPIs;
  if (projectId === 'nppp') return npppKPIs;
  if (projectId === 'kuimarisha') return kuimarishaKPIs;
  if (projectId === 'cdw') return cdwKPIs;
  if (projectId === 'aacl') return aaclKPIs;
  
  // Check dynamic KPIs
  const dynamicKPIs = getProjectKPIsData(projectId);
  return dynamicKPIs;
}

// Per-project sample reports
const projectReports: Record<string, Report[]> = {
  'aacl': [
    {
      id: 'aacl-1',
      name: 'AACL Q1 Progress Report.pdf',
      type: 'pdf',
      size: '2.1 MB',
      uploadDate: '2024-01-10',
      description: 'Progress report for AACL project covering outcomes: "Improved Access to Clean Water" and activities: "Well Construction".',
      category: 'quarterly',
      status: 'final',
      uploadedBy: 'Alice Johnson',
      lastModified: '2024-01-12',
      lastModifiedBy: 'Alice Johnson',
    },
    {
      id: 'aacl-2',
      name: 'AACL Beneficiary List.xlsx',
      type: 'excel',
      size: '1.2 MB',
      uploadDate: '2024-01-15',
      description: 'List of beneficiaries for AACL project activities.',
      category: 'adhoc',
      status: 'final',
      uploadedBy: 'Bob Smith',
      lastModified: '2024-01-16',
      lastModifiedBy: 'Bob Smith',
    },
  ],
  'cdw': [
    {
      id: 'cdw-1',
      name: 'CDW Annual Report 2023.pdf',
      type: 'pdf',
      size: '3.0 MB',
      uploadDate: '2024-01-20',
      description: 'Annual report for CDW project, referencing outcomes: "Community Health Improvement" and activities: "Health Workshops".',
      category: 'annual',
      status: 'final',
      uploadedBy: 'Carol Lee',
      lastModified: '2024-01-22',
      lastModifiedBy: 'Carol Lee',
    },
  ],
  'kuimarisha': [
    {
      id: 'kuimarisha-1',
      name: 'Kuimarisha Monthly Activity Report - March.docx',
      type: 'word',
      size: '900 KB',
      uploadDate: '2024-03-31',
      description: 'March activity report for Kuimarisha project, covering activities: "Training Sessions" and outcomes: "Increased Farmer Yields".',
      category: 'monthly',
      status: 'draft',
      uploadedBy: 'David Kim',
      lastModified: '2024-04-01',
      lastModifiedBy: 'David Kim',
    },
  ],
  'nppp': [
    {
      id: 'nppp-1',
      name: 'NPPP Q2 Progress Report.pdf',
      type: 'pdf',
      size: '2.5 MB',
      uploadDate: '2024-04-10',
      description: 'Q2 progress report for NPPP project, referencing outcomes: "Improved Nutrition" and activities: "School Feeding".',
      category: 'quarterly',
      status: 'final',
      uploadedBy: 'Eve Wang',
      lastModified: '2024-04-12',
      lastModifiedBy: 'Eve Wang',
    },
  ],
  'vacis-ke': [
    {
      id: 'vacis-ke-1',
      name: 'VACIS-KE Annual Report 2023.pdf',
      type: 'pdf',
      size: '2.8 MB',
      uploadDate: '2024-01-18',
      description: 'Annual report for VACIS-KE project, covering outcomes: "Vaccination Coverage" and activities: "Mobile Clinics".',
      category: 'annual',
      status: 'final',
      uploadedBy: 'Faith Otieno',
      lastModified: '2024-01-20',
      lastModifiedBy: 'Faith Otieno',
    },
  ],
  'vacis-tz': [
    {
      id: 'vacis-tz-1',
      name: 'VACIS-TZ Q3 Progress Report.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadDate: '2024-07-10',
      description: 'Q3 progress report for VACIS-TZ project, referencing outcomes: "Expanded Immunization" and activities: "Community Outreach".',
      category: 'quarterly',
      status: 'final',
      uploadedBy: 'Grace Mushi',
      lastModified: '2024-07-12',
      lastModifiedBy: 'Grace Mushi',
    },
  ],
  'mameb': [
    {
      id: 'mameb-1',
      name: 'MAMEB Monthly Report - February.docx',
      type: 'word',
      size: '1.1 MB',
      uploadDate: '2024-02-28',
      description: 'February report for MAMEB project, covering activities: "Microenterprise Training" and outcomes: "Increased Household Income".',
      category: 'monthly',
      status: 'final',
      uploadedBy: 'Helen Njeri',
      lastModified: '2024-03-01',
      lastModifiedBy: 'Helen Njeri',
    },
  ],
};

export function getProjectReports(user: User, projectId: string): Report[] {
  if (!getAccessibleProjectIds(user).includes(projectId)) return [];
  return projectReports[projectId] || [];
} 