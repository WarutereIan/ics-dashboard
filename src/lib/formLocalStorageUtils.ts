import { FormWizardState } from '@/components/dashboard/form-creation-wizard/types';
import { Form } from '@/components/dashboard/form-creation-wizard/types';

const FORM_WIZARD_DRAFT_KEY = 'ics_form_wizard_draft';
const FORM_WIZARD_DRAFT_TIMESTAMP_KEY = 'ics_form_wizard_draft_timestamp';
const FORM_PREVIEW_DATA_KEY = 'ics_form_preview_data';
const FORM_MANAGEMENT_FILTERS_KEY = 'ics_form_management_filters';

// Save form wizard state to localStorage
export const saveFormWizardDraft = (wizardState: FormWizardState): void => {
  try {
    // Convert dates to ISO strings for localStorage storage
    const serializedState = {
      ...wizardState,
      form: {
        ...wizardState.form,
        createdAt: wizardState.form.createdAt?.toISOString(),
        updatedAt: wizardState.form.updatedAt?.toISOString(),
        lastResponseAt: wizardState.form.lastResponseAt?.toISOString(),
        settings: {
          ...wizardState.form.settings,
          expiryDate: wizardState.form.settings?.expiryDate?.toISOString(),
        },
        sections: wizardState.form.sections?.map(section => ({
          ...section,
          questions: section.questions.map(question => ({
            ...question,
            // Handle date-specific question types
            ...(question.type === 'DATE' || question.type === 'DATETIME' ? {
              minDate: question.minDate?.toISOString(),
              maxDate: question.maxDate?.toISOString(),
              defaultValue: question.defaultValue?.toISOString(),
            } : {}),
          })),
        })),
      },
    };

    localStorage.setItem(FORM_WIZARD_DRAFT_KEY, JSON.stringify(serializedState));
    localStorage.setItem(FORM_WIZARD_DRAFT_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving form wizard draft to localStorage:', error);
  }
};

// Load form wizard state from localStorage
export const loadFormWizardDraft = (): FormWizardState | null => {
  try {
    const draftData = localStorage.getItem(FORM_WIZARD_DRAFT_KEY);
    if (!draftData) return null;

    const parsedState = JSON.parse(draftData);
    
    // Convert ISO strings back to Date objects
    const restoredState: FormWizardState = {
      ...parsedState,
      form: {
        ...parsedState.form,
        createdAt: parsedState.form.createdAt ? new Date(parsedState.form.createdAt) : undefined,
        updatedAt: parsedState.form.updatedAt ? new Date(parsedState.form.updatedAt) : undefined,
        lastResponseAt: parsedState.form.lastResponseAt ? new Date(parsedState.form.lastResponseAt) : undefined,
        settings: {
          ...parsedState.form.settings,
          expiryDate: parsedState.form.settings?.expiryDate ? new Date(parsedState.form.settings.expiryDate) : undefined,
        },
        sections: parsedState.form.sections?.map((section: any) => ({
          ...section,
          questions: section.questions.map((question: any) => ({
            ...question,
            // Handle date-specific question types
            ...(question.type === 'DATE' || question.type === 'DATETIME' ? {
              minDate: question.minDate ? new Date(question.minDate) : undefined,
              maxDate: question.maxDate ? new Date(question.maxDate) : undefined,
              defaultValue: question.defaultValue ? new Date(question.defaultValue) : undefined,
            } : {}),
          })),
        })),
      },
    };

    return restoredState;
  } catch (error) {
    console.error('Error loading form wizard draft from localStorage:', error);
    return null;
  }
};

// Check if form wizard draft exists
export const hasFormWizardDraft = (): boolean => {
  return localStorage.getItem(FORM_WIZARD_DRAFT_KEY) !== null;
};

// Clear form wizard draft
export const clearFormWizardDraft = (): void => {
  localStorage.removeItem(FORM_WIZARD_DRAFT_KEY);
  localStorage.removeItem(FORM_WIZARD_DRAFT_TIMESTAMP_KEY);
};

// Get form wizard draft age in milliseconds
export const getFormWizardDraftAge = (): number | null => {
  const timestamp = localStorage.getItem(FORM_WIZARD_DRAFT_TIMESTAMP_KEY);
  if (!timestamp) return null;
  
  const draftTime = parseInt(timestamp, 10);
  return Date.now() - draftTime;
};

// Format form wizard draft age for display
export const formatFormWizardDraftAge = (ageMs: number): string => {
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

// Auto-save form wizard state (throttled to avoid excessive writes)
let formWizardAutoSaveTimeout: NodeJS.Timeout | null = null;
export const autoSaveFormWizardDraft = (wizardState: FormWizardState, delay: number = 2000): void => {
  if (formWizardAutoSaveTimeout) {
    clearTimeout(formWizardAutoSaveTimeout);
  }
  
  formWizardAutoSaveTimeout = setTimeout(() => {
    saveFormWizardDraft(wizardState);
  }, delay);
};

// Clear form wizard auto-save timeout
export const clearFormWizardAutoSaveTimeout = (): void => {
  if (formWizardAutoSaveTimeout) {
    clearTimeout(formWizardAutoSaveTimeout);
    formWizardAutoSaveTimeout = null;
  }
};

// Form Preview Data Management
export interface FormPreviewData {
  formId: string;
  responses: Record<string, any>;
  currentSection: number;
  isComplete: boolean;
  startedAt: Date;
  lastActivityAt: Date;
}

// Save form preview data
export const saveFormPreviewData = (formId: string, previewData: Omit<FormPreviewData, 'formId'>): void => {
  try {
    const key = `${FORM_PREVIEW_DATA_KEY}_${formId}`;
    const serializedData = {
      ...previewData,
      startedAt: previewData.startedAt.toISOString(),
      lastActivityAt: previewData.lastActivityAt.toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(serializedData));
  } catch (error) {
    console.error('Error saving form preview data to localStorage:', error);
  }
};

// Load form preview data
export const loadFormPreviewData = (formId: string): FormPreviewData | null => {
  try {
    const key = `${FORM_PREVIEW_DATA_KEY}_${formId}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    const parsedData = JSON.parse(data);
    return {
      ...parsedData,
      startedAt: new Date(parsedData.startedAt),
      lastActivityAt: new Date(parsedData.lastActivityAt),
    };
  } catch (error) {
    console.error('Error loading form preview data from localStorage:', error);
    return null;
  }
};

// Clear form preview data
export const clearFormPreviewData = (formId: string): void => {
  const key = `${FORM_PREVIEW_DATA_KEY}_${formId}`;
  localStorage.removeItem(key);
};

// Form Management Filters
export interface FormManagementFilters {
  status: string[];
  projectId: string[];
  searchTerm: string;
  dateRange: { from: Date | null; to: Date | null };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Save form management filters
export const saveFormManagementFilters = (filters: FormManagementFilters): void => {
  try {
    const serializedFilters = {
      ...filters,
      dateRange: {
        from: filters.dateRange.from?.toISOString() || null,
        to: filters.dateRange.to?.toISOString() || null,
      },
    };
    localStorage.setItem(FORM_MANAGEMENT_FILTERS_KEY, JSON.stringify(serializedFilters));
  } catch (error) {
    console.error('Error saving form management filters to localStorage:', error);
  }
};

// Load form management filters
export const loadFormManagementFilters = (): FormManagementFilters | null => {
  try {
    const data = localStorage.getItem(FORM_MANAGEMENT_FILTERS_KEY);
    if (!data) return null;

    const parsedFilters = JSON.parse(data);
    return {
      ...parsedFilters,
      dateRange: {
        from: parsedFilters.dateRange.from ? new Date(parsedFilters.dateRange.from) : null,
        to: parsedFilters.dateRange.to ? new Date(parsedFilters.dateRange.to) : null,
      },
    };
  } catch (error) {
    console.error('Error loading form management filters from localStorage:', error);
    return null;
  }
};

// Clear form management filters
export const clearFormManagementFilters = (): void => {
  localStorage.removeItem(FORM_MANAGEMENT_FILTERS_KEY);
};

// Get default form management filters
export const getDefaultFormManagementFilters = (): FormManagementFilters => ({
  status: [],
  projectId: [],
  searchTerm: '',
  dateRange: { from: null, to: null },
  sortBy: 'updatedAt',
  sortOrder: 'desc',
});

// Forms Storage Management
const FORMS_STORAGE_KEY = 'ics_forms_data';

// Save forms to localStorage
export const saveForms = (forms: Form[]): void => {
  try {
    const serializedForms = forms.map(form => ({
      ...form,
      createdAt: form.createdAt?.toISOString(),
      updatedAt: form.updatedAt?.toISOString(),
      lastResponseAt: form.lastResponseAt?.toISOString(),
      settings: {
        ...form.settings,
        expiryDate: form.settings?.expiryDate?.toISOString(),
      },
    }));
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(serializedForms));
  } catch (error) {
    console.error('Error saving forms to localStorage:', error);
  }
};

// Load forms from localStorage
export const loadForms = (): Form[] => {
  try {
    const data = localStorage.getItem(FORMS_STORAGE_KEY);
    if (!data) return [];

    const parsedForms = JSON.parse(data);
    const forms = parsedForms.map((form: any) => ({
      ...form,
      createdAt: form.createdAt ? new Date(form.createdAt) : new Date(),
      updatedAt: form.updatedAt ? new Date(form.updatedAt) : new Date(),
      lastResponseAt: form.lastResponseAt ? new Date(form.lastResponseAt) : undefined,
      settings: {
        ...form.settings,
        expiryDate: form.settings?.expiryDate ? new Date(form.settings.expiryDate) : undefined,
      },
    }));

    // Remove duplicates based on form ID (keep the most recent one)
    const uniqueForms = forms.reduce((acc: Form[], form: Form) => {
      const existingIndex = acc.findIndex(f => f.id === form.id);
      if (existingIndex === -1) {
        acc.push(form);
      } else {
        // Keep the more recent form
        const existing = acc[existingIndex];
        if (new Date(form.updatedAt) > new Date(existing.updatedAt)) {
          acc[existingIndex] = form;
        }
      }
      return acc;
    }, []);

    // If we found duplicates, save the cleaned up version
    if (uniqueForms.length !== forms.length) {
      console.warn(`Found ${forms.length - uniqueForms.length} duplicate forms, cleaned up to ${uniqueForms.length} unique forms`);
      saveForms(uniqueForms);
    }

    return uniqueForms;
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

// Get forms by project ID
export const getFormsByProject = (projectId: string): Form[] => {
  const allForms = loadForms();
  return allForms.filter(form => form.projectId === projectId);
};

// Get form by ID across all projects
export const getFormById = (formId: string): Form | null => {
  const allForms = loadForms();
  return allForms.find(form => form.id === formId) || null;
};

// Add a new form
export const addForm = (form: Form): void => {
  const forms = loadForms();
  // Check if form already exists to prevent duplicates
  const existingFormIndex = forms.findIndex(f => f.id === form.id);
  if (existingFormIndex !== -1) {
    // Update existing form instead of adding duplicate
    forms[existingFormIndex] = { ...forms[existingFormIndex], ...form, updatedAt: new Date() };
  } else {
    // Add new form
    forms.unshift(form);
  }
  saveForms(forms);
};

// Update an existing form
export const updateForm = (formId: string, updatedForm: Partial<Form>): void => {
  const forms = loadForms();
  const index = forms.findIndex(form => form.id === formId);
  if (index !== -1) {
    forms[index] = { ...forms[index], ...updatedForm, updatedAt: new Date() };
    saveForms(forms);
  }
};

// Delete a form
export const deleteForm = (formId: string): void => {
  const forms = loadForms();
  const filteredForms = forms.filter(form => form.id !== formId);
  saveForms(filteredForms);
};

// Duplicate a form
export const duplicateForm = (form: Form): Form => {
  const duplicatedForm: Form = {
    ...form,
    id: `${form.id}-copy-${Date.now()}`,
    title: `${form.title} (Copy)`,
    status: 'DRAFT',
    responseCount: 0,
    lastResponseAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };
  
  addForm(duplicatedForm);
  return duplicatedForm;
};
