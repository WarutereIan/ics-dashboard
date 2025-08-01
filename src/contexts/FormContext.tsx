import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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