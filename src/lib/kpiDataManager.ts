import { mamebKPIs } from './mamebData';
import { vacisKeKPIs } from './vacisKeData';
import { vacisTzKPIs } from './vacisTzData';
import { cdwKPIs } from './cdwData';
import { kuimarishaKPIs } from './kuimarishaData';
// import { npppKPIs } from './npppData'; // Temporarily excluded due to structure mismatch
// import { aaclKPIs } from './aaclData'; // Temporarily excluded due to structure mismatch

export interface KPIData {
  outcomeId: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  type: 'radialGauge' | 'bar' | 'progress';
}

export interface OutcomeKPIGroup {
  outcome: string;
  kpis: KPIData[];
}

// Map project IDs to their KPI data (only include projects that have KPI data with correct structure)
const projectKPIMap: Record<string, KPIData[]> = {
  'mameb': mamebKPIs as KPIData[],
  'vacis-ke': vacisKeKPIs as KPIData[],
  'vacis-tz': vacisTzKPIs as KPIData[],
  'cdw': cdwKPIs as KPIData[],
  'kuimarisha': kuimarishaKPIs as KPIData[],
  // 'nppp': npppKPIs as KPIData[], // Temporarily excluded
  // 'aacl': aaclKPIs as KPIData[], // Temporarily excluded
};

// Map project IDs to their outcome names for grouping
const projectOutcomeMap: Record<string, Record<string, string>> = {
  'mameb': {
    'outcome-1': "Children's Rights & Participation",
    'outcome-2': 'Parent & Community Engagement',
    'outcome-3': 'Community & Religious Leaders',
    'outcome-4': 'School & Staff Capacity',
    'outcome-5': 'Stakeholder Engagement',
  },
  'vacis-ke': {
    'vaciske-outcome-1': 'Families in Kenya have increased access to evidence-based gender transformative parenting programmes',
    'vaciske-outcome-2': 'Policies and evidence-based models and practices to address violence in and around schools',
    'vaciske-outcome-3': 'Social and gender norms that perpetuate violence against children and young women identified and shifted',
    'vaciske-outcome-4': 'ICS SP organizational capacity is strengthened to facilitate mission driven actions',
  },
  'vacis-tz': {
    'vacistz-outcome-1': 'Families in Tanzania have increased access to evidence-based gender transformative parenting programmes',
    'vacistz-outcome-2': 'Policies and evidence-based models and practices to address violence in and around schools',
    'vacistz-outcome-3': 'Social and gender norms that perpetuate violence against children and young women identified and shifted',
    'vacistz-outcome-4': 'ICS SP organizational capacity is strengthened to facilitate mission driven actions',
  },
  // Add other projects as needed - these will be populated as more project data becomes available
};

/**
 * Get KPI data for a specific project
 */
export function getProjectKPIs(projectId: string): KPIData[] {
  return projectKPIMap[projectId] || [];
}

/**
 * Get KPI data grouped by outcomes for a specific project
 */
export function getProjectKPIsGroupedByOutcome(projectId: string): OutcomeKPIGroup[] {
  const kpis = getProjectKPIs(projectId);
  const outcomeMap = projectOutcomeMap[projectId] || {};
  
  // Group KPIs by outcome
  const groupedKPIs: Record<string, KPIData[]> = {};
  
  kpis.forEach(kpi => {
    if (!groupedKPIs[kpi.outcomeId]) {
      groupedKPIs[kpi.outcomeId] = [];
    }
    groupedKPIs[kpi.outcomeId].push(kpi);
  });
  
  // Convert to array format with outcome names
  return Object.entries(groupedKPIs).map(([outcomeId, kpis]) => ({
    outcome: outcomeMap[outcomeId] || outcomeId,
    kpis
  }));
}

/**
 * Get available project IDs that have KPI data
 */
export function getAvailableProjectIds(): string[] {
  return Object.keys(projectKPIMap);
}

/**
 * Check if a project has KPI data available
 */
export function hasProjectKPIs(projectId: string): boolean {
  return projectId in projectKPIMap;
} 