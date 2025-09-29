import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Form, FormResponse, FormQuestion } from '../components/dashboard/form-creation-wizard/types';
import { 
  StoredMediaFile, 
  MediaMetadata,
  storeMediaFile,
  getStoredMediaFiles,
  getMediaFilesByProject,
  getMediaFilesByForm,
  deleteMediaFile,
  updateMediaFileMetadata,
  searchMediaFiles,
  exportMediaFiles,
  importMediaFiles,
  getProjectMediaStats,
  createMediaMetadata
} from '../lib/mediaStorage';
import { Project } from '../types/dashboard';

// Offline queue types
interface OfflineQueueItem {
  id: string;
  type: 'form_response' | 'form_create' | 'form_update' | 'form_delete' | 'media_upload' | 'media_delete';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

interface OfflineSyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingItems: number;
  failedItems: number;
  syncProgress: number;
}

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
  
  // Media management
  uploadMediaFile: (
    file: File,
    project: Project,
    form: Form,
    questionId: string,
    questionTitle: string,
    uploadedBy: string,
    mediaType: 'image' | 'video' | 'audio' | 'file',
    location?: { latitude: number; longitude: number; accuracy?: number; address?: string },
    tags?: string[],
    description?: string
  ) => Promise<StoredMediaFile>;
  getMediaFiles: (projectId?: string, formId?: string) => StoredMediaFile[];
  getProjectMediaFiles: (projectId: string) => StoredMediaFile[];
  getFormMediaFiles: (formId: string) => StoredMediaFile[];
  searchMediaFiles: (query: string) => StoredMediaFile[];
  removeMediaFile: (fileId: string) => boolean;
  updateMediaFileMetadata: (fileId: string, updates: Partial<MediaMetadata>) => StoredMediaFile | null;
  getProjectMediaStats: (projectId: string) => any;
  exportProjectMedia: (projectId?: string) => string;
  importProjectMedia: (importData: string) => boolean;
  refreshMediaFiles: () => void;
  
  // Offline support
  isOnline: boolean;
  syncStatus: OfflineSyncStatus;
  addToOfflineQueue: (type: OfflineQueueItem['type'], data: any) => void;
  processOfflineQueue: () => Promise<void>;
  retryFailedItems: () => Promise<void>;
  clearOfflineQueue: () => void;
  getOfflineQueue: () => OfflineQueueItem[];
  getFailedItems: () => OfflineQueueItem[];
  
  // Conditional question utilities
  getConditionalQuestions: (form: Form) => FormQuestion[];
  getConditionalResponses: (response: FormResponse, questionId: string) => Record<string, any>;
  validateConditionalQuestions: (form: Form, responses: Record<string, any>) => Record<string, string>;
  getFormStatistics: (form: Form) => { totalQuestions: number; conditionalQuestions: number; totalOptions: number };
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
  
  // Media management state
  const [mediaFiles, setMediaFiles] = useState<StoredMediaFile[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  
  // Offline support state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<OfflineSyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    pendingItems: 0,
    failedItems: 0,
    syncProgress: 0
  });

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
          processedForms[projectId] = parsedForms[projectId].map((form: any) => {
            // Migrate form structure to include conditional question properties
            const migratedForm = {
              ...form,
              createdAt: new Date(form.createdAt),
              updatedAt: new Date(form.updatedAt),
              lastResponseAt: form.lastResponseAt ? new Date(form.lastResponseAt) : undefined,
              settings: {
                ...form.settings,
                expiryDate: form.settings?.expiryDate ? new Date(form.settings.expiryDate) : undefined,
              },
              sections: form.sections?.map((section: any) => ({
                ...section,
                questions: section.questions?.map((question: any) => {
                                  if ((question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && question.options) {
                  return {
                    ...question,
                    options: question.options.map((option: any) => ({
                      ...option,
                      hasConditionalQuestions: option.hasConditionalQuestions ?? false,
                      conditionalQuestions: option.conditionalQuestions ?? []
                    }))
                  };
                }
                  return question;
                }) || []
              })) || []
            };
            return migratedForm;
          });
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
            sections: form.sections?.map((section: any) => ({
              ...section,
              questions: section.questions?.map((question: any) => {
                if ((question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && question.options) {
                  return {
                    ...question,
                    options: question.options.map((option: any) => ({
                      ...option,
                      hasConditionalQuestions: option.hasConditionalQuestions ?? false,
                      conditionalQuestions: option.conditionalQuestions ?? []
                    }))
                  };
                }
                return question;
              }) || []
            })) || []
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

      // Load media files
      try {
        const storedMediaFiles = getStoredMediaFiles();
        setMediaFiles(storedMediaFiles);
      } catch (error) {
        console.error('Error loading media files:', error);
      }

      // Load offline queue
      try {
        const storedQueue = localStorage.getItem('offlineQueue');
        if (storedQueue) {
          const parsedQueue = JSON.parse(storedQueue);
          setOfflineQueue(parsedQueue);
          // Update sync status manually to avoid circular dependency
          const pendingItems = parsedQueue.filter((item: any) => item.retryCount < item.maxRetries).length;
          const failedItems = parsedQueue.filter((item: any) => item.retryCount >= item.maxRetries).length;
          setSyncStatus(prev => ({
            ...prev,
            pendingItems,
            failedItems
          }));
        }
      } catch (error) {
        console.error('Error loading offline queue:', error);
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
  }, []);

  // Online/offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      // Process offline queue when coming back online
      // We'll handle this in a separate useEffect after methods are defined
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

    // Add to offline queue if offline
    if (!isOnline) {
      // Create queue item directly to avoid circular dependency
      const queueItem = {
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'form_response' as const,
        data: response,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: 3
      };

      setOfflineQueue(prev => {
        const newQueue = [...prev, queueItem];
        localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
        // Update sync status manually to avoid circular dependency
        const pendingItems = newQueue.filter(item => item.retryCount < item.maxRetries).length;
        const failedItems = newQueue.filter(item => item.retryCount >= item.maxRetries).length;
        setSyncStatus(prevStatus => ({
          ...prevStatus,
          pendingItems,
          failedItems
        }));
        return newQueue;
      });
    }
  }, [isOnline]);

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

  // Media management methods
  const uploadMediaFile = useCallback(async (
    file: File,
    project: Project,
    form: Form,
    questionId: string,
    questionTitle: string,
    uploadedBy: string,
    mediaType: 'image' | 'video' | 'audio' | 'file',
    location?: { latitude: number; longitude: number; accuracy?: number; address?: string },
    tags?: string[],
    description?: string
  ): Promise<StoredMediaFile> => {
    setIsMediaLoading(true);
    try {
      const metadata = createMediaMetadata(
        file,
        project,
        form,
        questionId,
        questionTitle,
        uploadedBy,
        mediaType,
        location,
        tags,
        description
      );
      
      const storedFile = await storeMediaFile(file, metadata);
      
      // Update local state
      setMediaFiles(prev => [...prev, storedFile]);
      
      // Add to offline queue if offline
      if (!isOnline) {
        // Create queue item directly to avoid circular dependency
        const queueItem = {
          id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'media_upload' as const,
          data: {
            file: storedFile,
            metadata,
            project,
            form
          },
          timestamp: Date.now(),
          retryCount: 0,
          maxRetries: 3
        };

        setOfflineQueue(prev => {
          const newQueue = [...prev, queueItem];
          localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
          // Update sync status manually to avoid circular dependency
          const pendingItems = newQueue.filter(item => item.retryCount < item.maxRetries).length;
          const failedItems = newQueue.filter(item => item.retryCount >= item.maxRetries).length;
          setSyncStatus(prevStatus => ({
            ...prevStatus,
            pendingItems,
            failedItems
          }));
          return newQueue;
        });
      }
      
      return storedFile;
    } catch (error) {
      console.error('Error uploading media file:', error);
      throw error;
    } finally {
      setIsMediaLoading(false);
    }
  }, [isOnline]);

  const getMediaFiles = useCallback((projectId?: string, formId?: string): StoredMediaFile[] => {
    if (projectId && formId) {
      return mediaFiles.filter(file => 
        file.metadata.projectId === projectId && file.metadata.formId === formId
      );
    } else if (projectId) {
      return getMediaFilesByProject(projectId);
    } else if (formId) {
      return getMediaFilesByForm(formId);
    }
    return mediaFiles;
  }, [mediaFiles]);

  const getProjectMediaFiles = useCallback((projectId: string): StoredMediaFile[] => {
    return getMediaFilesByProject(projectId);
  }, []);

  const getFormMediaFiles = useCallback((formId: string): StoredMediaFile[] => {
    return getMediaFilesByForm(formId);
  }, []);

  const searchMediaFiles = useCallback((query: string): StoredMediaFile[] => {
    return searchMediaFiles(query);
  }, []);

  const removeMediaFile = useCallback((fileId: string): boolean => {
    const success = deleteMediaFile(fileId);
    if (success) {
      setMediaFiles(prev => prev.filter(file => file.id !== fileId));
    }
    return success;
  }, []);

  const updateMediaFileMetadata = useCallback((fileId: string, updates: Partial<MediaMetadata>): StoredMediaFile | null => {
    const updatedFile = updateMediaFileMetadata(fileId, updates);
    if (updatedFile) {
      setMediaFiles(prev => prev.map(file => 
        file.id === fileId ? updatedFile : file
      ));
    }
    return updatedFile;
  }, []);

  const getProjectMediaStats = useCallback((projectId: string) => {
    return getProjectMediaStats(projectId);
  }, []);

  const exportProjectMedia = useCallback((projectId?: string): string => {
    return exportMediaFiles(projectId);
  }, []);

  const importProjectMedia = useCallback((importData: string): boolean => {
    const success = importMediaFiles(importData);
    if (success) {
      // Reload media files after import
      const storedMediaFiles = getStoredMediaFiles();
      setMediaFiles(storedMediaFiles);
    }
    return success;
  }, []);

  const refreshMediaFiles = useCallback(() => {
    const storedMediaFiles = getStoredMediaFiles();
    setMediaFiles(storedMediaFiles);
  }, []);

  // Offline support methods - moved up to avoid circular dependencies
  const updateSyncStatus = useCallback((queue: OfflineQueueItem[]) => {
    const pendingItems = queue.filter(item => item.retryCount < item.maxRetries).length;
    const failedItems = queue.filter(item => item.retryCount >= item.maxRetries).length;
    
    setSyncStatus(prev => ({
      ...prev,
      pendingItems,
      failedItems
    }));
  }, []);

  const saveOfflineQueue = useCallback((queue: OfflineQueueItem[]) => {
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
    updateSyncStatus(queue);
  }, [updateSyncStatus]);

  const addToOfflineQueue = useCallback((type: OfflineQueueItem['type'], data: any) => {
    const queueItem: OfflineQueueItem = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };

    setOfflineQueue(prev => {
      const newQueue = [...prev, queueItem];
      saveOfflineQueue(newQueue);
      return newQueue;
    });
  }, [saveOfflineQueue]);

  const processOfflineQueue = useCallback(async () => {
    if (!isOnline || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncProgress: 0 }));

    try {
      const itemsToProcess = offlineQueue.filter(item => item.retryCount < item.maxRetries);
      
      for (let i = 0; i < itemsToProcess.length; i++) {
        const item = itemsToProcess[i];
        
        try {
          // Simulate API call based on item type
          await simulateApiCall(item);
          
          // Remove successful item from queue
          setOfflineQueue(prev => {
            const newQueue = prev.filter(qItem => qItem.id !== item.id);
            saveOfflineQueue(newQueue);
            return newQueue;
          });
          
          // Update progress
          setSyncStatus(prev => ({ 
            ...prev, 
            syncProgress: ((i + 1) / itemsToProcess.length) * 100 
          }));
          
        } catch (error) {
          console.error(`Failed to process offline item ${item.id}:`, error);
          
          // Increment retry count
          setOfflineQueue(prev => {
            const newQueue = prev.map(qItem => 
              qItem.id === item.id 
                ? { ...qItem, retryCount: qItem.retryCount + 1 }
                : qItem
            );
            saveOfflineQueue(newQueue);
            return newQueue;
          });
        }
      }
      
      setSyncStatus(prev => ({ 
        ...prev, 
        isSyncing: false, 
        lastSyncTime: new Date(),
        syncProgress: 100
      }));
      
    } catch (error) {
      console.error('Error processing offline queue:', error);
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [isOnline, syncStatus.isSyncing, offlineQueue, saveOfflineQueue]);

  const simulateApiCall = useCallback(async (item: OfflineQueueItem): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate occasional failures
    if (Math.random() < 0.1) {
      throw new Error('Simulated API failure');
    }
    
    // Process based on item type
    switch (item.type) {
      case 'form_response':
        // Simulate form response submission
        console.log('Submitting form response:', item.data);
        break;
      case 'form_create':
        // Simulate form creation
        console.log('Creating form:', item.data);
        break;
      case 'form_update':
        // Simulate form update
        console.log('Updating form:', item.data);
        break;
      case 'form_delete':
        // Simulate form deletion
        console.log('Deleting form:', item.data);
        break;
      case 'media_upload':
        // Simulate media upload
        console.log('Uploading media:', item.data);
        break;
      case 'media_delete':
        // Simulate media deletion
        console.log('Deleting media:', item.data);
        break;
      default:
        console.log('Unknown offline item type:', item.type);
    }
  }, []);

  const retryFailedItems = useCallback(async () => {
    const failedItems = offlineQueue.filter(item => item.retryCount >= item.maxRetries);
    
    setOfflineQueue(prev => {
      const newQueue = prev.map(item => 
        failedItems.some(failed => failed.id === item.id)
          ? { ...item, retryCount: 0 }
          : item
      );
      saveOfflineQueue(newQueue);
      return newQueue;
    });
    
    // Process queue again
    await processOfflineQueue();
  }, [offlineQueue, processOfflineQueue, saveOfflineQueue]);

  const clearOfflineQueue = useCallback(() => {
    setOfflineQueue([]);
    localStorage.removeItem('offlineQueue');
    setSyncStatus(prev => ({ 
      ...prev, 
      pendingItems: 0, 
      failedItems: 0 
    }));
  }, []);

  const getOfflineQueue = useCallback(() => {
    return offlineQueue;
  }, [offlineQueue]);

  const getFailedItems = useCallback(() => {
    return offlineQueue.filter(item => item.retryCount >= item.maxRetries);
  }, [offlineQueue]);

  // Conditional question utilities
  const getConditionalQuestions = useCallback((form: Form): FormQuestion[] => {
    const conditionalQuestions: FormQuestion[] = [];
    
    form.sections.forEach(section => {
      section.questions.forEach(question => {
        if ((question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && question.options) {
          question.options.forEach(option => {
            if (option.hasConditionalQuestions && option.conditionalQuestions) {
              conditionalQuestions.push(...option.conditionalQuestions);
            }
          });
        }
      });
    });
    
    return conditionalQuestions;
  }, []);

  const getConditionalResponses = useCallback((response: FormResponse, questionId: string): Record<string, any> => {
    const conditionalResponses: Record<string, any> = {};
    
    // Find the parent question
    const parentQuestion = response.data[questionId];
    if (!parentQuestion) return conditionalResponses;
    
    // Find the form to get question structure
    const form = Object.values(projectForms).flat().find(f => f.id === response.formId);
    if (!form) return conditionalResponses;
    
    // Find the question and its options
    const question = form.sections.flatMap(s => s.questions).find(q => q.id === questionId);
    if (!question || (question.type !== 'SINGLE_CHOICE' && question.type !== 'MULTIPLE_CHOICE') || !question.options) return conditionalResponses;
    
    // Find the selected option
    const selectedOption = question.options.find(opt => opt.value.toString() === parentQuestion.toString());
    if (!selectedOption || !selectedOption.hasConditionalQuestions || !selectedOption.conditionalQuestions) {
      return conditionalResponses;
    }
    
    // Extract conditional responses
    selectedOption.conditionalQuestions.forEach(conditionalQuestion => {
      const conditionalValue = response.data[conditionalQuestion.id];
      if (conditionalValue !== undefined) {
        conditionalResponses[conditionalQuestion.id] = conditionalValue;
      }
    });
    
    return conditionalResponses;
  }, [projectForms]);

  const validateConditionalQuestions = useCallback((form: Form, responses: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    form.sections.forEach(section => {
      section.questions.forEach(question => {
        if ((question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && question.options) {
          const selectedValue = responses[question.id];
          
          question.options.forEach(option => {
            if (option.hasConditionalQuestions && option.conditionalQuestions) {
              let shouldValidate = false;
              
              if (question.type === 'SINGLE_CHOICE') {
                // For single choice, validate if this option is selected
                shouldValidate = option.value.toString() === selectedValue?.toString();
              } else if (question.type === 'MULTIPLE_CHOICE') {
                // For multiple choice, validate if this option is in the selected array
                shouldValidate = Array.isArray(selectedValue) && selectedValue.includes(option.value.toString());
              }
              
              if (shouldValidate) {
                // Validate conditional questions
                option.conditionalQuestions.forEach(conditionalQuestion => {
                  if (conditionalQuestion.isRequired) {
                    const conditionalValue = responses[conditionalQuestion.id];
                    if (conditionalValue === undefined || conditionalValue === '' || conditionalValue === null ||
                        (Array.isArray(conditionalValue) && conditionalValue.length === 0)) {
                      errors[conditionalQuestion.id] = 'This field is required';
                    }
                  }
                });
              }
            }
          });
        }
      });
    });
    
    return errors;
  }, []);

  const getFormStatistics = useCallback((form: Form) => {
    let totalQuestions = 0;
    let conditionalQuestions = 0;
    let totalOptions = 0;
    
    form.sections.forEach(section => {
      section.questions.forEach(question => {
        totalQuestions++;
        
        if ((question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && question.options) {
          totalOptions += question.options.length;
          
          question.options.forEach(option => {
            if (option.hasConditionalQuestions && option.conditionalQuestions) {
              conditionalQuestions += option.conditionalQuestions.length;
            }
          });
        }
      });
    });
    
    return { totalQuestions, conditionalQuestions, totalOptions };
  }, []);

  // Handle online event to process queue after methods are defined
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0 && !syncStatus.isSyncing) {
      processOfflineQueue();
    }
  }, [isOnline, offlineQueue.length, syncStatus.isSyncing, processOfflineQueue]);

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
    // Media management
    uploadMediaFile,
    getMediaFiles,
    getProjectMediaFiles,
    getFormMediaFiles,
    searchMediaFiles,
    removeMediaFile,
    updateMediaFileMetadata,
    getProjectMediaStats,
    exportProjectMedia,
    importProjectMedia,
    refreshMediaFiles,
    // Offline support
    isOnline,
    syncStatus,
    addToOfflineQueue,
    processOfflineQueue,
    retryFailedItems,
    clearOfflineQueue,
    getOfflineQueue,
    getFailedItems,
    // Conditional question utilities
    getConditionalQuestions,
    getConditionalResponses,
    validateConditionalQuestions,
    getFormStatistics,
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