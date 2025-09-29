import { WizardState } from '@/components/dashboard/project-creation-wizard/types';

const PROJECT_WIZARD_DRAFT_KEY = 'ics_project_wizard_draft';
const PROJECT_WIZARD_DRAFT_TIMESTAMP_KEY = 'ics_project_wizard_draft_timestamp';

// Save wizard state to localStorage
export const saveWizardDraft = (wizardState: WizardState): void => {
  try {
    // Convert dates to ISO strings for localStorage storage
    const serializedState = {
      ...wizardState,
      projectData: {
        ...wizardState.projectData,
        startDate: wizardState.projectData.startDate?.toISOString(),
        endDate: wizardState.projectData.endDate?.toISOString(),
      },
      activities: wizardState.activities.map(activity => ({
        ...activity,
        startDate: activity.startDate?.toISOString(),
        endDate: activity.endDate?.toISOString(),
      })),
    };

    localStorage.setItem(PROJECT_WIZARD_DRAFT_KEY, JSON.stringify(serializedState));
    localStorage.setItem(PROJECT_WIZARD_DRAFT_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving wizard draft to localStorage:', error);
  }
};

// Load wizard state from localStorage
export const loadWizardDraft = (): WizardState | null => {
  try {
    const draftData = localStorage.getItem(PROJECT_WIZARD_DRAFT_KEY);
    if (!draftData) return null;

    const parsedState = JSON.parse(draftData);
    
    // Convert ISO strings back to Date objects
    const restoredState: WizardState = {
      ...parsedState,
      projectData: {
        ...parsedState.projectData,
        startDate: parsedState.projectData.startDate ? new Date(parsedState.projectData.startDate) : undefined,
        endDate: parsedState.projectData.endDate ? new Date(parsedState.projectData.endDate) : undefined,
      },
      activities: parsedState.activities.map((activity: any) => ({
        ...activity,
        startDate: activity.startDate ? new Date(activity.startDate) : undefined,
        endDate: activity.endDate ? new Date(activity.endDate) : undefined,
      })),
    };

    return restoredState;
  } catch (error) {
    console.error('Error loading wizard draft from localStorage:', error);
    return null;
  }
};

// Check if draft exists
export const hasWizardDraft = (): boolean => {
  return localStorage.getItem(PROJECT_WIZARD_DRAFT_KEY) !== null;
};

// Clear wizard draft
export const clearWizardDraft = (): void => {
  localStorage.removeItem(PROJECT_WIZARD_DRAFT_KEY);
  localStorage.removeItem(PROJECT_WIZARD_DRAFT_TIMESTAMP_KEY);
};

// Get draft age in milliseconds
export const getDraftAge = (): number | null => {
  const timestamp = localStorage.getItem(PROJECT_WIZARD_DRAFT_TIMESTAMP_KEY);
  if (!timestamp) return null;
  
  const draftTime = parseInt(timestamp, 10);
  return Date.now() - draftTime;
};

// Format draft age for display
export const formatDraftAge = (ageMs: number): string => {
  const minutes = Math.floor(ageMs / (1000 * 60));
  const hours = Math.floor(ageMs / (1000 * 60 * 60));
  const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'just now';
  }
};

// Auto-save wizard state (throttled to avoid excessive writes)
let autoSaveTimeout: NodeJS.Timeout | null = null;
export const autoSaveWizardDraft = (wizardState: WizardState, delay: number = 2000): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(() => {
    saveWizardDraft(wizardState);
  }, delay);
};

// Clear auto-save timeout
export const clearAutoSaveTimeout = (): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
};
