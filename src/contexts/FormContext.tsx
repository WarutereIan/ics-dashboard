import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Form, FormResponse } from '../components/dashboard/form-creation-wizard/types';

interface FormContextType {
  // Current form being edited/created
  currentForm: Form | null;
  setCurrentForm: (form: Form | Partial<Form> | null) => void;
  updateCurrentForm: (updates: Partial<Form>) => void;
  
  // Form responses for preview/testing
  formResponses: FormResponse[];
  addFormResponse: (response: FormResponse) => void;
  clearFormResponses: () => void;
  
  // Form preview state
  isPreviewMode: boolean;
  setIsPreviewMode: (mode: boolean) => void;
  
  // Form validation state
  formErrors: Record<string, string>;
  setFormErrors: (errors: Record<string, string>) => void;
  clearFormErrors: () => void;
  
  // Unsaved changes tracking
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Form response management
  getFormResponses: (formId: string) => FormResponse[];
  addFormResponseToStorage: (response: FormResponse) => void;
  deleteFormResponse: (formId: string, responseId: string) => void;
  getProjectForms: (projectId: string) => Form[];
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [currentForm, setCurrentFormState] = useState<Form | null>(null);
  const [formResponses, setFormResponses] = useState<FormResponse[]>([]);
  const [isPreviewMode, setIsPreviewModeState] = useState(false);
  const [formErrors, setFormErrorsState] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChangesState] = useState(false);
  
  // Form response management state
  const [allFormResponses, setAllFormResponses] = useState<Record<string, FormResponse[]>>({});
  const [projectForms, setProjectForms] = useState<Record<string, Form[]>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load form responses
      const storedResponses = localStorage.getItem('formResponses');
      if (storedResponses) {
        const parsedResponses = JSON.parse(storedResponses);
        // Convert date strings back to Date objects
        const processedResponses: Record<string, FormResponse[]> = {};
        Object.keys(parsedResponses).forEach(formId => {
          processedResponses[formId] = parsedResponses[formId].map((response: any) => ({
            ...response,
            startedAt: new Date(response.startedAt),
            submittedAt: response.submittedAt ? new Date(response.submittedAt) : undefined,
          }));
        });
        setAllFormResponses(processedResponses);
      }

      // Load project forms from both sources
      const storedForms = localStorage.getItem('projectForms');
      const legacyForms = localStorage.getItem('ics_forms_data');
      
      const processedForms: Record<string, Form[]> = {};
      
      // Load from projectForms (new format)
      if (storedForms) {
        const parsedForms = JSON.parse(storedForms);
        Object.keys(parsedForms).forEach(projectId => {
          processedForms[projectId] = parsedForms[projectId].map((form: any) => ({
            ...form,
            createdAt: new Date(form.createdAt),
            updatedAt: new Date(form.updatedAt),
            lastResponseAt: form.lastResponseAt ? new Date(form.lastResponseAt) : undefined,
            settings: {
              ...form.settings,
              expiryDate: form.settings?.expiryDate ? new Date(form.settings.expiryDate) : undefined,
            },
          }));
        });
      }
      
      // Load from ics_forms_data (legacy format) and merge
      if (legacyForms) {
        const parsedLegacyForms = JSON.parse(legacyForms);
        parsedLegacyForms.forEach((form: any) => {
          const processedForm = {
            ...form,
            createdAt: form.createdAt ? new Date(form.createdAt) : new Date(),
            updatedAt: form.updatedAt ? new Date(form.updatedAt) : new Date(),
            lastResponseAt: form.lastResponseAt ? new Date(form.lastResponseAt) : undefined,
            settings: {
              ...form.settings,
              expiryDate: form.settings?.expiryDate ? new Date(form.settings.expiryDate) : undefined,
            },
          };
          
          // Group by projectId
          const projectId = form.projectId;
          if (!processedForms[projectId]) {
            processedForms[projectId] = [];
          }
          
          // Check if form already exists (avoid duplicates)
          const existingIndex = processedForms[projectId].findIndex(f => f.id === form.id);
          if (existingIndex === -1) {
            processedForms[projectId].push(processedForm);
          } else {
            // Keep the more recent version
            const existing = processedForms[projectId][existingIndex];
            if (new Date(processedForm.updatedAt) > new Date(existing.updatedAt)) {
              processedForms[projectId][existingIndex] = processedForm;
            }
          }
        });
      }
      
      setProjectForms(processedForms);
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
  }, []);

  const setCurrentForm = useCallback((form: Form | Partial<Form> | null) => {
    if (form && 'id' in form && form.id) {
      // Ensure we have a complete form object
      const completeForm = form as Form;
      setCurrentFormState(completeForm);
      // Clear responses when switching forms
      setFormResponses([]);
      setFormErrorsState({});
    } else {
      setCurrentFormState(null);
    }
  }, []);

  const updateCurrentForm = useCallback((updates: Partial<Form>) => {
    setCurrentFormState(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const addFormResponse = useCallback((response: FormResponse) => {
    setFormResponses(prev => [...prev, response]);
  }, []);

  const clearFormResponses = useCallback(() => {
    setFormResponses([]);
  }, []);

  const setIsPreviewMode = useCallback((mode: boolean) => {
    setIsPreviewModeState(mode);
  }, []);

  const setFormErrors = useCallback((errors: Record<string, string>) => {
    setFormErrorsState(errors);
  }, []);

  const clearFormErrors = useCallback(() => {
    setFormErrorsState({});
  }, []);

  const setHasUnsavedChanges = useCallback((hasChanges: boolean) => {
    setHasUnsavedChangesState(hasChanges);
  }, []);

  // Form response management functions
  const getFormResponses = useCallback((formId: string): FormResponse[] => {
    return allFormResponses[formId] || [];
  }, [allFormResponses]);

  const addFormResponseToStorage = useCallback((response: FormResponse) => {
    setAllFormResponses(prev => {
      const updated = {
        ...prev,
        [response.formId]: [...(prev[response.formId] || []), response]
      };
      
      // Save to localStorage
      localStorage.setItem('formResponses', JSON.stringify(updated));
      
      // Update form statistics
      const formResponses = updated[response.formId];
      const completedResponses = formResponses.filter(r => r.isComplete);
      
      // Find the form and update its statistics
      setProjectForms(prevForms => {
        const updatedForms: Record<string, Form[]> = {};
        Object.keys(prevForms).forEach(projectId => {
          updatedForms[projectId] = prevForms[projectId].map(form => {
            if (form.id === response.formId) {
              return {
                ...form,
                responseCount: completedResponses.length,
                lastResponseAt: response.submittedAt || new Date(),
                updatedAt: new Date(),
              };
            }
            return form;
          });
        });
        
        // Save updated forms to localStorage
        localStorage.setItem('projectForms', JSON.stringify(updatedForms));
        return updatedForms;
      });
      
      return updated;
    });
  }, []);

  const deleteFormResponse = useCallback((formId: string, responseId: string) => {
    setAllFormResponses(prev => {
      const updated = {
        ...prev,
        [formId]: (prev[formId] || []).filter(r => r.id !== responseId)
      };
      
      // Save to localStorage
      localStorage.setItem('formResponses', JSON.stringify(updated));
      
      // Update form statistics
      const formResponses = updated[formId] || [];
      const completedResponses = formResponses.filter(r => r.isComplete);
      
      // Find the form and update its statistics
      setProjectForms(prevForms => {
        const updatedForms: Record<string, Form[]> = {};
        Object.keys(prevForms).forEach(projectId => {
          updatedForms[projectId] = prevForms[projectId].map(form => {
            if (form.id === formId) {
              return {
                ...form,
                responseCount: completedResponses.length,
                lastResponseAt: completedResponses.length > 0 
                  ? new Date(Math.max(...completedResponses.map(r => r.submittedAt?.getTime() || 0)))
                  : undefined,
                updatedAt: new Date(),
              };
            }
            return form;
          });
        });
        
        // Save updated forms to localStorage
        localStorage.setItem('projectForms', JSON.stringify(updatedForms));
        return updatedForms;
      });
      
      return updated;
    });
  }, []);

  const getProjectForms = useCallback((projectId: string): Form[] => {
    return projectForms[projectId] || [];
  }, [projectForms]);

  // Utility function to clean up duplicate forms
  const cleanupDuplicateForms = useCallback(() => {
    setProjectForms(prev => {
      const cleaned: Record<string, Form[]> = {};
      Object.keys(prev).forEach(projectId => {
        const forms = prev[projectId] || [];
        const uniqueForms = forms.filter((form, index, self) => 
          index === self.findIndex(f => f.id === form.id)
        );
        cleaned[projectId] = uniqueForms;
      });
      
      // Save cleaned data to localStorage
      localStorage.setItem('projectForms', JSON.stringify(cleaned));
      return cleaned;
    });
  }, []);

  const value: FormContextType = {
    currentForm,
    setCurrentForm,
    updateCurrentForm,
    formResponses,
    addFormResponse,
    clearFormResponses,
    isPreviewMode,
    setIsPreviewMode,
    formErrors,
    setFormErrors,
    clearFormErrors,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    getFormResponses,
    addFormResponseToStorage,
    deleteFormResponse,
    getProjectForms,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm(): FormContextType {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
} 