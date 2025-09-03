import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Form, FormResponse } from '../components/dashboard/form-creation-wizard/types';
import { formsApi, CreateFormDto, CreateFormResponseDto } from '../lib/api/formsApi';
import { toast } from '@/hooks/use-toast';

// Simplified context interface focused on API integration
interface FormContextType {
  // Current form being edited/created
  currentForm: Form | null;
  setCurrentForm: (form: Form | Partial<Form> | null) => void;
  updateCurrentForm: (updates: Partial<Form>) => void;
  
  // Form management
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  createForm: (projectId: string, formData: CreateFormDto) => Promise<Form | null>;
  updateForm: (projectId: string, formId: string, updates: Partial<Form>) => Promise<Form | null>;
  deleteForm: (projectId: string, formId: string) => Promise<boolean>;
  duplicateForm: (projectId: string, formId: string) => Promise<Form | null>;
  
  // Form loading
  loadForm: (projectId: string, formId: string) => Promise<Form | null>;
  loadProjectForms: (projectId: string) => Promise<Form[]>;
  
  // Form responses
  submitFormResponse: (responseData: CreateFormResponseDto) => Promise<FormResponse | null>;
  loadFormResponses: (projectId: string, formId: string) => Promise<FormResponse[]>;
  
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
  
  // Offline support (simplified)
  isOnline: boolean;
  offlineFormsCount: number;
  syncOfflineData: () => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [currentForm, setCurrentFormState] = useState<Form | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewModeState] = useState(false);
  const [formErrors, setFormErrorsState] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChangesState] = useState(false);
  
  // Offline support state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline queue from localStorage on mount
  useEffect(() => {
    try {
      const storedQueue = localStorage.getItem('formOfflineQueue');
      if (storedQueue) {
        setOfflineQueue(JSON.parse(storedQueue));
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }, []);

  // Save offline queue to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('formOfflineQueue', JSON.stringify(offlineQueue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }, [offlineQueue]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineData();
    }
  }, [isOnline]);

  const setCurrentForm = useCallback((form: Form | Partial<Form> | null) => {
    setCurrentFormState(form as Form | null);
    setHasUnsavedChangesState(false);
  }, []);

  const updateCurrentForm = useCallback((updates: Partial<Form>) => {
    setCurrentFormState(prev => prev ? { ...prev, ...updates } : null);
    setHasUnsavedChangesState(true);
  }, []);

  const setFormErrors = useCallback((errors: Record<string, string>) => {
    setFormErrorsState(errors);
  }, []);

  const clearFormErrors = useCallback(() => {
    setFormErrorsState({});
  }, []);

  const setIsPreviewMode = useCallback((mode: boolean) => {
    setIsPreviewModeState(mode);
  }, []);

  const setHasUnsavedChanges = useCallback((hasChanges: boolean) => {
    setHasUnsavedChangesState(hasChanges);
  }, []);

  // Add item to offline queue
  const addToOfflineQueue = useCallback((type: string, data: any) => {
    const queueItem = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };
    setOfflineQueue(prev => [...prev, queueItem]);
  }, []);

  // CRUD Operations
  const createForm = useCallback(async (projectId: string, formData: CreateFormDto): Promise<Form | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isOnline) {
        addToOfflineQueue('form_create', { ...formData, projectId });
        toast({
          title: "Offline Mode",
          description: "Form will be created when you're back online",
        });
        return null;
      }

      const form = await formsApi.createForm(projectId, formData);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      return form;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create form';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Add to offline queue as fallback
      addToOfflineQueue('form_create', { ...formData, projectId });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isOnline, addToOfflineQueue]);

  const updateForm = useCallback(async (projectId: string, formId: string, updates: Partial<Form>): Promise<Form | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isOnline) {
        addToOfflineQueue('form_update', { ...updates, projectId, id: formId });
        toast({
          title: "Offline Mode",
          description: "Changes will be saved when you're back online",
        });
        return null;
      }

      const form = await formsApi.updateForm(projectId, formId, updates);
      setHasUnsavedChangesState(false);
      toast({
        title: "Success",
        description: "Form updated successfully",
      });
      return form;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update form';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Add to offline queue as fallback
      addToOfflineQueue('form_update', { ...updates, projectId, id: formId });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isOnline, addToOfflineQueue]);

  const deleteForm = useCallback(async (projectId: string, formId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isOnline) {
        addToOfflineQueue('form_delete', { projectId, id: formId });
        toast({
          title: "Offline Mode",
          description: "Form will be deleted when you're back online",
        });
        return false;
      }

      await formsApi.deleteForm(projectId, formId);
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete form';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Add to offline queue as fallback
      addToOfflineQueue('form_delete', { projectId, id: formId });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isOnline, addToOfflineQueue]);

  const duplicateForm = useCallback(async (projectId: string, formId: string): Promise<Form | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isOnline) {
        toast({
          title: "Offline Mode",
          description: "Cannot duplicate forms while offline",
          variant: "destructive",
        });
        return null;
      }

      const form = await formsApi.duplicateForm(projectId, formId);
      toast({
        title: "Success",
        description: "Form duplicated successfully",
      });
      return form;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate form';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Form Loading
  const loadForm = useCallback(async (projectId: string, formId: string): Promise<Form | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const form = await formsApi.getForm(projectId, formId);
      setCurrentForm(form);
      return form;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load form';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrentForm]);

  const loadProjectForms = useCallback(async (projectId: string): Promise<Form[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const forms = await formsApi.getProjectForms(projectId);
      return forms;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load project forms';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Form Responses
  const submitFormResponse = useCallback(async (responseData: CreateFormResponseDto): Promise<FormResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isOnline) {
        addToOfflineQueue('form_response', responseData);
        toast({
          title: "Offline Mode",
          description: "Response will be submitted when you're back online",
        });
        return null;
      }

      const response = await formsApi.submitResponse(responseData);
      toast({
        title: "Success",
        description: "Response submitted successfully",
      });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit response';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Add to offline queue as fallback
      addToOfflineQueue('form_response', responseData);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isOnline, addToOfflineQueue]);

  const loadFormResponses = useCallback(async (projectId: string, formId: string): Promise<FormResponse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const responses = await formsApi.getFormResponses(projectId, formId);
      return responses;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load form responses';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Offline Sync
  const syncOfflineData = useCallback(async (): Promise<void> => {
    if (!isOnline || offlineQueue.length === 0) return;

    setLoading(true);
    
    try {
      const result = await formsApi.syncOfflineData(offlineQueue);
      
      if (result.success) {
        setOfflineQueue([]);
        toast({
          title: "Sync Complete",
          description: "All offline data has been synced successfully",
        });
      } else {
        setOfflineQueue(result.failedItems);
        toast({
          title: "Partial Sync",
          description: `${offlineQueue.length - result.failedItems.length} items synced, ${result.failedItems.length} failed`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error syncing offline data:', err);
      toast({
        title: "Sync Failed",
        description: "Failed to sync offline data. Will retry later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isOnline, offlineQueue]);

  const contextValue: FormContextType = {
    currentForm,
    setCurrentForm,
    updateCurrentForm,
    loading,
    error,
    createForm,
    updateForm,
    deleteForm,
    duplicateForm,
    loadForm,
    loadProjectForms,
    submitFormResponse,
    loadFormResponses,
    isPreviewMode,
    setIsPreviewMode,
    formErrors,
    setFormErrors,
    clearFormErrors,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isOnline,
    offlineFormsCount: offlineQueue.length,
    syncOfflineData,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}
