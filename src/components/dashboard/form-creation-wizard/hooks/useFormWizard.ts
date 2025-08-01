import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { toast } from '@/hooks/use-toast';
import { 
  Form, 
  FormSection, 
  FormQuestion, 
  FormWizardState, 
  FormSettings,
  ActivityKPIMapping,
  QuestionType 
} from '../types';
import { 
  getAllProjectsData, 
  getProjectData 
} from '@/lib/projectDataManager';
import { v4 as uuidv4 } from 'uuid';

// Wizard steps
export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export function useFormWizard(formId?: string) {
  const navigate = useNavigate();
  const { user } = useDashboard();
  
  const [wizardState, setWizardState] = useState<FormWizardState>({
    currentStep: 0,
    form: {
      id: formId || uuidv4(),
      title: '',
      description: '',
      projectId: '',
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'DRAFT',
      version: 1,
      sections: [],
      settings: {
        requireAuthentication: false,
        allowedRoles: ['global-admin', 'country-admin', 'project-admin', 'branch-admin', 'viewer'],
        thankYouMessage: 'Thank you for your response!',
        notificationEmails: [],
      },
      responseCount: 0,
      tags: [],
    },
    availableProjects: [],
    availableActivities: [],
    isEditing: !!formId,
    hasUnsavedChanges: false,
  });

  const steps: WizardStep[] = [
    { id: 'basic-info', title: 'Basic Information', description: 'Form title, description, and project' },
    { id: 'sections', title: 'Form Structure', description: 'Organize your form into sections' },
    { id: 'questions', title: 'Add Questions', description: 'Create and configure form questions' },
    { id: 'activity-links', title: 'Activity Links', description: 'Link questions to project activities' },
    { id: 'settings', title: 'Form Settings', description: 'Configure form behavior and permissions' },
    { id: 'review', title: 'Review & Deploy', description: 'Review your form and deploy it' },
  ];

  // Load available projects and activities
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const projects = getAllProjectsData();
        const availableProjects = projects.map(p => ({ id: p.id, name: p.name }));
        
        // Load activities for all projects
        const allActivities: ActivityKPIMapping[] = [];
        for (const project of projects) {
          const projectData = getProjectData(project.id);
          if (projectData) {
            projectData.outcomes.forEach(outcome => {
              projectData.activities
                .filter(activity => activity.outcomeId === outcome.id)
                .forEach(activity => {
                  allActivities.push({
                    projectId: project.id,
                    outcomeId: outcome.id,
                    activityId: activity.id,
                    activityName: activity.title,
                    outcomeName: outcome.title,
                    projectName: project.name,
                    availableKPIs: [], // Will be loaded from KPI data
                  });
                });
            });
          }
        }

        setWizardState(prev => ({
          ...prev,
          availableProjects,
          availableActivities: allActivities,
        }));
      } catch (error) {
        console.error('Error loading project data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load project and activity data.",
          variant: "destructive",
        });
      }
    };

    loadProjectData();
  }, []);

  // Basic form information handlers
  const updateBasicInfo = useCallback((field: string, value: any) => {
    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value,
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, []);

  // Section management
  const addSection = useCallback(() => {
    const newSection: FormSection = {
      id: uuidv4(),
      title: `Section ${(wizardState.form.sections?.length || 0) + 1}`,
      description: '',
      order: (wizardState.form.sections?.length || 0) + 1,
      questions: [],
    };

    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        sections: [...(prev.form.sections || []), newSection],
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, [wizardState.form.sections]);

  const updateSection = useCallback((sectionId: string, updates: Partial<FormSection>) => {
    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        sections: prev.form.sections?.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
        ) || [],
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        sections: prev.form.sections?.filter(section => section.id !== sectionId) || [],
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, []);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    setWizardState(prev => {
      const sections = [...(prev.form.sections || [])];
      const [removed] = sections.splice(startIndex, 1);
      sections.splice(endIndex, 0, removed);
      
      // Update order values
      const reorderedSections = sections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      return {
        ...prev,
        form: {
          ...prev.form,
          sections: reorderedSections,
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      };
    });
  }, []);

  // Question management
  const addQuestion = useCallback((sectionId: string, questionType: QuestionType) => {
    const section = wizardState.form.sections?.find(s => s.id === sectionId);
    if (!section) return;

    const baseQuestion = {
      id: uuidv4(),
      type: questionType,
      title: '',
      description: '',
      isRequired: false,
      validationRules: [],
      order: section.questions.length + 1,
      dataType: getDefaultDataType(questionType),
    };

    // Create question with type-specific properties
    const newQuestion = createQuestionWithDefaults(baseQuestion, questionType);

    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        sections: prev.form.sections?.map(s =>
          s.id === sectionId 
            ? { ...s, questions: [...s.questions, newQuestion] }
            : s
        ) || [],
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, [wizardState.form.sections]);

  const updateQuestion = useCallback((sectionId: string, questionId: string, updates: Partial<FormQuestion>) => {
    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        sections: prev.form.sections?.map(section =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map(question =>
                  question.id === questionId ? { ...question, ...updates } as FormQuestion : question
                ),
              }
            : section
        ) || [],
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, []);

  const removeQuestion = useCallback((sectionId: string, questionId: string) => {
    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        sections: prev.form.sections?.map(section =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.filter(q => q.id !== questionId),
              }
            : section
        ) || [],
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, []);

  const duplicateQuestion = useCallback((sectionId: string, questionId: string) => {
    const section = wizardState.form.sections?.find(s => s.id === sectionId);
    const question = section?.questions.find(q => q.id === questionId);
    
    if (!question || !section) return;

    const duplicatedQuestion = {
      ...question,
      id: uuidv4(),
      title: `${question.title} (Copy)`,
      order: section.questions.length + 1,
    };

    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        sections: prev.form.sections?.map(s =>
          s.id === sectionId 
            ? { ...s, questions: [...s.questions, duplicatedQuestion] }
            : s
        ) || [],
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, [wizardState.form.sections]);

  // Activity linking
  const linkQuestionToActivity = useCallback((
    sectionId: string, 
    questionId: string, 
    activityMapping: ActivityKPIMapping
  ) => {
    updateQuestion(sectionId, questionId, {
      linkedActivity: {
        projectId: activityMapping.projectId,
        outcomeId: activityMapping.outcomeId,
        activityId: activityMapping.activityId,
      },
    });
  }, [updateQuestion]);

  // Settings management
  const updateSettings = useCallback((settings: Partial<FormSettings>) => {
    setWizardState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        settings: {
          ...prev.form.settings!,
          ...settings,
        },
        updatedAt: new Date(),
      },
      hasUnsavedChanges: true,
    }));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    if (wizardState.currentStep < steps.length - 1) {
      setWizardState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  }, [wizardState.currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (wizardState.currentStep > 0) {
      setWizardState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  }, [wizardState.currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setWizardState(prev => ({
        ...prev,
        currentStep: stepIndex,
      }));
    }
  }, [steps.length]);

  // Validation
  const validateCurrentStep = useCallback(() => {
    const currentStepId = steps[wizardState.currentStep].id;
    
    switch (currentStepId) {
      case 'basic-info':
        return !!(wizardState.form.title && wizardState.form.projectId);
      case 'sections':
        return (wizardState.form.sections?.length || 0) > 0;
      case 'questions':
        return wizardState.form.sections?.some(section => section.questions.length > 0) || false;
      default:
        return true;
    }
  }, [wizardState.currentStep, wizardState.form, steps]);

  // Save and deploy
  const saveDraft = useCallback(async () => {
    try {
      // Here you would save to your backend/storage
      console.log('Saving form draft:', wizardState.form);
      
      setWizardState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
      }));

      toast({
        title: "Draft Saved",
        description: "Your form has been saved as a draft.",
      });

      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save the form draft.",
        variant: "destructive",
      });
      return false;
    }
  }, [wizardState.form]);

  const publishForm = useCallback(async () => {
    try {
      // Validate form before publishing
      if (!validateForm()) {
        return false;
      }

      // Here you would publish to your backend
      console.log('Publishing form:', wizardState.form);

      setWizardState(prev => ({
        ...prev,
        form: {
          ...prev.form,
          status: 'PUBLISHED',
          updatedAt: new Date(),
        },
        hasUnsavedChanges: false,
      }));

      toast({
        title: "Form Published",
        description: `${wizardState.form.title} has been published successfully.`,
      });

      return true;
    } catch (error) {
      console.error('Error publishing form:', error);
      toast({
        title: "Publishing Failed",
        description: "Failed to publish the form.",
        variant: "destructive",
      });
      return false;
    }
  }, [wizardState.form]);

  const validateForm = useCallback(() => {
    const form = wizardState.form;
    
    if (!form.title) {
      toast({
        title: "Validation Error",
        description: "Form title is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.projectId) {
      toast({
        title: "Validation Error",
        description: "Please select a project for this form.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.sections || form.sections.length === 0) {
      toast({
        title: "Validation Error",
        description: "Form must have at least one section.",
        variant: "destructive",
      });
      return false;
    }

    const hasQuestions = form.sections.some(section => section.questions.length > 0);
    if (!hasQuestions) {
      toast({
        title: "Validation Error",
        description: "Form must have at least one question.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [wizardState.form]);

  return {
    wizardState,
    steps,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    
    // Basic info
    updateBasicInfo,
    
    // Sections
    addSection,
    updateSection,
    removeSection,
    reorderSections,
    
    // Questions
    addQuestion,
    updateQuestion,
    removeQuestion,
    duplicateQuestion,
    
    // Activity linking
    linkQuestionToActivity,
    
    // Settings
    updateSettings,
    
    // Save and deploy
    saveDraft,
    publishForm,
    validateForm,
    
    // Navigation helpers
    navigate,
  };
}

// Helper functions
function getDefaultDataType(questionType: QuestionType) {
  switch (questionType) {
    case 'SHORT_TEXT':
    case 'EMAIL':
    case 'PHONE':
      return 'TEXT';
    case 'NUMBER':
      return 'INTEGER';
    case 'DATE':
      return 'DATE';
    case 'DATETIME':
      return 'TIMESTAMP';
    case 'YES_NO':
    case 'SINGLE_CHOICE':
      return 'TEXT';
    case 'MULTIPLE_CHOICE':
      return 'ARRAY_TEXT';
    case 'SLIDER':
      return 'INTEGER';
    case 'LIKERT_SCALE':
      return 'JSON';
    default:
      return 'TEXT';
  }
}

function createQuestionWithDefaults(baseQuestion: any, questionType: QuestionType): FormQuestion {
  switch (questionType) {
    case 'SHORT_TEXT':
      return {
        ...baseQuestion,
        placeholder: 'Enter your response...',
      };
    

    case 'NUMBER':
      return {
        ...baseQuestion,
        placeholder: 'Enter a number',
        step: 1,
      };
    
    case 'SINGLE_CHOICE':
      return {
        ...baseQuestion,
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' },
        ],
        displayType: 'RADIO',
      };
    
    case 'MULTIPLE_CHOICE':
      return {
        ...baseQuestion,
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' },
        ],
      };
    
    case 'DROPDOWN':
      return {
        ...baseQuestion,
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' },
        ],
        placeholder: 'Select an option...',
      };
    

    case 'LIKERT_SCALE':
      return {
        ...baseQuestion,
        statements: ['Statement 1'],
        scaleType: '5_POINT',
        labels: {
          negative: 'Strongly Disagree',
          neutral: 'Neutral',
          positive: 'Strongly Agree',
        },
      };
    
    case 'YES_NO':
      return {
        ...baseQuestion,
        type: 'SINGLE_CHOICE',
        options: [
          { id: uuidv4(), label: 'Yes', value: 'yes' },
          { id: uuidv4(), label: 'No', value: 'no' },
        ],
        displayType: 'RADIO',
      };
    
    case 'DATE':
    case 'DATETIME':
      return {
        ...baseQuestion,
      };
    

    case 'SLIDER':
      return {
        ...baseQuestion,
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
      };
    
    default:
      return baseQuestion;
  }
}