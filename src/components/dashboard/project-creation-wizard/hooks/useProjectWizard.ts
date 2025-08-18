import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { toast } from '@/hooks/use-toast';

import { saveProject as saveProjectData, getProjectData, getProjectKPIsData } from '@/lib/projectDataManager';
import { 
  saveWizardDraft, 
  loadWizardDraft, 
  hasWizardDraft, 
  clearWizardDraft, 
  autoSaveWizardDraft, 
  clearAutoSaveTimeout 
} from '@/lib/localStorageUtils';
import { 
  ProjectFormData, 
  OutcomeFormData, 
  ActivityFormData, 
  KPIFormData, 
  WizardStep,
  WizardState 
} from '../types';

export function useProjectWizard() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useDashboard();
  const { addProject, updateProject, getProjectById, projects } = useProjects();
  const isEditMode = Boolean(projectId);
  
  // Store original project data for comparison in edit mode
  const [originalProjectData, setOriginalProjectData] = useState<any>(null);
  
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 0,
    projectData: {
      id: '',
      name: '',
      description: '',
      country: '',
      status: 'planning',
      startDate: undefined,
      endDate: undefined,
      budget: 0,
      backgroundInformation: '',
      mapData: undefined,
      theoryOfChange: undefined,
    },
    outcomes: [],
    activities: [],
    kpis: [],
  });

  const steps: WizardStep[] = [
    { id: 'project', title: 'Project Details', description: 'Basic project information' },
    { id: 'overview', title: 'Project Overview', description: 'Background, map, and theory of change' },
    { id: 'outcomes', title: 'Outcomes', description: 'Define project outcomes' },
    { id: 'activities', title: 'Activities', description: 'Add activities for each outcome' },
    { id: 'kpis', title: 'KPIs', description: 'Define key performance indicators' },
    { id: 'review', title: 'Review', description: isEditMode ? 'Review and update project' : 'Review and create project' },
  ];

  // Load existing project data when in edit mode or load draft for new projects
  useEffect(() => {
    if (isEditMode && projectId && user) {
      const project = getProjectById(projectId);
      
      if (project) {
        // Store original project data for comparison
        setOriginalProjectData({
          project: { ...project },
          outcomes: [],
          activities: [],
          kpis: []
        });
        
        // Load project basic info into local copy
        setWizardState(prev => ({
          ...prev,
          projectData: {
            id: project.id,
            name: project.name,
            description: project.description,
            country: project.country,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            budget: project.budget,
            backgroundInformation: project.backgroundInformation || '',
            mapData: project.mapData,
            theoryOfChange: project.theoryOfChange,
          }
        }));

        // Load outcomes, activities, and KPIs
        try {
          const projectData = getProjectData(projectId);
          const kpisData = getProjectKPIsData(projectId);

          if (projectData) {
            // Store original data for comparison
            setOriginalProjectData((prev: any) => ({
              ...prev,
              outcomes: [...projectData.outcomes],
              activities: [...projectData.activities],
              kpis: [...kpisData]
            }));
            
            // Load into local copy
            setWizardState(prev => ({
              ...prev,
              outcomes: projectData.outcomes.map((outcome: any) => ({
                id: outcome.id,
                title: outcome.title,
                description: outcome.description,
                target: outcome.target || 0,
                unit: outcome.unit || '',
              })),
              activities: projectData.activities.map((activity: any) => ({
                id: activity.id,
                outcomeId: activity.outcomeId,
                title: activity.title,
                description: activity.description,
                startDate: activity.startDate,
                endDate: activity.endDate,
                responsible: activity.responsible,
              })),
              kpis: kpisData.map((kpi: any) => ({
                id: kpi.outcomeId + '-' + kpi.name.toLowerCase().replace(/\s+/g, '-'),
                outcomeId: kpi.outcomeId,
                name: kpi.name,
                target: kpi.target,
                unit: kpi.unit,
                type: kpi.type,
              })),
            }));
          }
        } catch (error) {
          console.error('Error loading project data:', error);
          toast({
            title: "Error Loading Project",
            description: "Could not load project data for editing.",
            variant: "destructive",
          });
        }
      }
    } else if (!isEditMode) {
      // Load draft for new project creation
      const draft = loadWizardDraft();
      if (draft) {
        setWizardState(draft);
      }
    }
  }, [isEditMode, projectId, user, projects]);

  // Auto-save draft when wizard state changes (only for new projects)
  useEffect(() => {
    if (!isEditMode && wizardState.projectData.name) {
      autoSaveWizardDraft(wizardState);
    }
    
    // Cleanup auto-save timeout on unmount
    return () => {
      clearAutoSaveTimeout();
    };
  }, [wizardState, isEditMode]);

  // Generate project ID from name
  const generateProjectId = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  // Handle project data changes
  const handleProjectChange = (field: keyof ProjectFormData, value: any) => {
    setWizardState(prev => {
      const updated = { ...prev.projectData, [field]: value };
      // Only auto-generate ID for new projects, not when editing
      if (field === 'name' && !isEditMode) {
        updated.id = generateProjectId(value);
      }
      return {
        ...prev,
        projectData: updated,
      };
    });
  };

  // Outcome management functions
  const addOutcome = () => {
    const newOutcome: OutcomeFormData = {
      id: `${wizardState.projectData.id}-outcome-${wizardState.outcomes.length + 1}`,
      title: '',
      description: '',
      target: 0,
      unit: '',
    };
    setWizardState(prev => ({
      ...prev,
      outcomes: [...prev.outcomes, newOutcome],
    }));
  };

  const updateOutcome = (index: number, field: keyof OutcomeFormData, value: any) => {
    setWizardState(prev => {
      const updated = [...prev.outcomes];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        outcomes: updated,
      };
    });
  };

  const removeOutcome = (index: number) => {
    const outcomeId = wizardState.outcomes[index].id;
    setWizardState(prev => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index),
      activities: prev.activities.filter(activity => activity.outcomeId !== outcomeId),
      kpis: prev.kpis.filter(kpi => kpi.outcomeId !== outcomeId),
    }));
  };

  // Activity management functions
  const addActivity = (outcomeId: string) => {
    const outcomeIndex = wizardState.outcomes.findIndex(o => o.id === outcomeId);
    const activityCount = wizardState.activities.filter(a => a.outcomeId === outcomeId).length;
    const newActivity: ActivityFormData = {
      id: `${wizardState.projectData.id}-activity-${outcomeIndex + 1}.${activityCount + 1}`,
      outcomeId,
      title: '',
      description: '',
      responsible: '',
      startDate: undefined,
      endDate: undefined,
    };
    setWizardState(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity],
    }));
  };

  const updateActivity = (index: number, field: keyof ActivityFormData, value: any) => {
    setWizardState(prev => {
      const updated = [...prev.activities];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        activities: updated,
      };
    });
  };

  const removeActivity = (index: number) => {
    setWizardState(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  // KPI management functions
  const addKPI = (outcomeId: string) => {
    const newKPI: KPIFormData = {
      outcomeId,
      name: '',
      target: 0,
      unit: '',
      type: 'bar',
    };
    setWizardState(prev => ({
      ...prev,
      kpis: [...prev.kpis, newKPI],
    }));
  };

  const updateKPI = (index: number, field: keyof KPIFormData, value: any) => {
    setWizardState(prev => {
      const updated = [...prev.kpis];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        kpis: updated,
      };
    });
  };

  const removeKPI = (index: number) => {
    setWizardState(prev => ({
      ...prev,
      kpis: prev.kpis.filter((_, i) => i !== index),
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (wizardState.currentStep < steps.length - 1) {
      setWizardState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  };

  const prevStep = () => {
    if (wizardState.currentStep > 0) {
      setWizardState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  };

  // Safe navigation that warns about unsaved changes
  const safeNavigate = (path: string) => {
    if (isEditMode && hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.'
      );
      if (confirmed) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  // Save project
  const saveProject = async () => {
    try {
      const projectData = {
        id: wizardState.projectData.id,
        name: wizardState.projectData.name,
        description: wizardState.projectData.description,
        country: wizardState.projectData.country,
        status: wizardState.projectData.status,
        startDate: wizardState.projectData.startDate || new Date(),
        endDate: wizardState.projectData.endDate || new Date(),
        progress: 0,
        budget: wizardState.projectData.budget,
        spent: 0,
        backgroundInformation: wizardState.projectData.backgroundInformation,
        mapData: wizardState.projectData.mapData,
        theoryOfChange: wizardState.projectData.theoryOfChange,
      };

      // Convert form data to the expected format for project data manager
      const outcomes = wizardState.outcomes.map(outcome => ({
        id: outcome.id,
        projectId: wizardState.projectData.id,
        title: outcome.title,
        description: outcome.description,
        target: outcome.target,
        current: 0,
        unit: outcome.unit,
        progress: 0,
        status: 'on-track' as const,
      }));

      const activities = wizardState.activities.map(activity => ({
        id: activity.id,
        outcomeId: activity.outcomeId,
        title: activity.title,
        description: activity.description,
        progress: 0,
        status: 'not-started' as const,
        startDate: activity.startDate || new Date(),
        endDate: activity.endDate || new Date(),
        responsible: activity.responsible,
      }));

      const kpis = wizardState.kpis.map(kpi => ({
        outcomeId: kpi.outcomeId,
        name: kpi.name,
        value: 0,
        target: kpi.target,
        unit: kpi.unit,
        type: 'progress' as const,
      }));

      if (isEditMode) {
        // Update existing project
        await updateProject(wizardState.projectData.id, projectData);
        
        // Save project data (outcomes, activities, KPIs)
        const success = saveProjectData(projectData, outcomes, activities, kpis);
        
        if (success) {
          toast({
            title: "Project Updated Successfully",
            description: `${wizardState.projectData.name} has been updated with ${outcomes.length} outcomes, ${activities.length} activities, and ${kpis.length} KPIs.`,
          });
          navigate(`/dashboard/projects/${wizardState.projectData.id}`);
        } else {
          throw new Error('Failed to save project data');
        }
      } else {
        // Create new project
        const newProject = await addProject(projectData);
        
        // Save project data (outcomes, activities, KPIs)
        const success = saveProjectData(projectData, outcomes, activities, kpis);
        
        if (success) {
          toast({
            title: "Project Created Successfully",
            description: `${wizardState.projectData.name} has been created with ${outcomes.length} outcomes, ${activities.length} activities, and ${kpis.length} KPIs.`,
          });
          // Clear draft after successful save
          clearWizardDraft();
          navigate('/dashboard');
        } else {
          throw new Error('Failed to save project data');
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: isEditMode ? "Error Updating Project" : "Error Creating Project",
        description: "There was an error saving your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Save draft manually
  const saveDraft = () => {
    saveWizardDraft(wizardState);
    toast({
      title: "Draft Saved",
      description: "Your project draft has been saved successfully.",
    });
  };

  // Check if there are unsaved changes in edit mode
  const hasUnsavedChanges = () => {
    if (!isEditMode || !originalProjectData) return false;
    
    // Compare project data
    const originalProject = originalProjectData.project;
    const currentProject = wizardState.projectData;
    
    const projectChanged = 
      originalProject.name !== currentProject.name ||
      originalProject.description !== currentProject.description ||
      originalProject.country !== currentProject.country ||
      originalProject.status !== currentProject.status ||
      originalProject.budget !== currentProject.budget ||
      originalProject.backgroundInformation !== currentProject.backgroundInformation ||
      JSON.stringify(originalProject.mapData) !== JSON.stringify(currentProject.mapData) ||
      JSON.stringify(originalProject.theoryOfChange) !== JSON.stringify(currentProject.theoryOfChange);
    
    // Compare outcomes, activities, and KPIs
    const outcomesChanged = JSON.stringify(originalProjectData.outcomes) !== JSON.stringify(wizardState.outcomes);
    const activitiesChanged = JSON.stringify(originalProjectData.activities) !== JSON.stringify(wizardState.activities);
    const kpisChanged = JSON.stringify(originalProjectData.kpis) !== JSON.stringify(wizardState.kpis);
    
    return projectChanged || outcomesChanged || activitiesChanged || kpisChanged;
  };

  // Save edits (for edit mode) - now only saves when user completes the process
  const saveEdits = async () => {
    try {
      const projectData = {
        id: wizardState.projectData.id,
        name: wizardState.projectData.name,
        description: wizardState.projectData.description,
        country: wizardState.projectData.country,
        status: wizardState.projectData.status,
        startDate: wizardState.projectData.startDate || new Date(),
        endDate: wizardState.projectData.endDate || new Date(),
        progress: 0,
        budget: wizardState.projectData.budget,
        spent: 0,
        backgroundInformation: wizardState.projectData.backgroundInformation,
        mapData: wizardState.projectData.mapData,
        theoryOfChange: wizardState.projectData.theoryOfChange,
      };

      // Convert form data to the expected format for project data manager
      const outcomes = wizardState.outcomes.map(outcome => ({
        id: outcome.id,
        projectId: wizardState.projectData.id,
        title: outcome.title,
        description: outcome.description,
        target: outcome.target,
        current: 0,
        unit: outcome.unit,
        progress: 0,
        status: 'on-track' as const,
      }));

      const activities = wizardState.activities.map(activity => ({
        id: activity.id,
        outcomeId: activity.outcomeId,
        title: activity.title,
        description: activity.description,
        progress: 0,
        status: 'not-started' as const,
        startDate: activity.startDate || new Date(),
        endDate: activity.endDate || new Date(),
        responsible: activity.responsible,
      }));

      const kpis = wizardState.kpis.map(kpi => ({
        outcomeId: kpi.outcomeId,
        name: kpi.name,
        value: 0,
        target: kpi.target,
        unit: kpi.unit,
        type: 'progress' as const,
      }));

      // Update basic project data
      await updateProject(wizardState.projectData.id, projectData);

      // Save project data (outcomes, activities, KPIs)
      const success = saveProjectData(projectData, outcomes, activities, kpis);

      if (success) {
        // Update original data to reflect saved state
        setOriginalProjectData({
          project: { ...projectData },
          outcomes: [...outcomes],
          activities: [...activities],
          kpis: [...kpis]
        });
        
        toast({
          title: "Edits Saved",
          description: `Your project changes have been saved successfully with ${outcomes.length} outcomes, ${activities.length} activities, and ${kpis.length} KPIs.`,
        });
      } else {
        throw new Error('Failed to save project data');
      }
    } catch (error) {
      console.error('Error saving edits:', error);
      toast({
        title: "Error Saving Edits",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Clear draft
  const clearDraft = () => {
    clearWizardDraft();
    setWizardState({
      currentStep: 0,
      projectData: {
        id: '',
        name: '',
        description: '',
        country: '',
        status: 'planning',
        startDate: undefined,
        endDate: undefined,
        budget: 0,
        backgroundInformation: '',
        mapData: undefined,
        theoryOfChange: undefined,
      },
      outcomes: [],
      activities: [],
      kpis: [],
    });
    toast({
      title: "Draft Cleared",
      description: "Your project draft has been cleared.",
    });
  };

      return {
      wizardState,
      steps,
      isEditMode,
      handleProjectChange,
      addOutcome,
      updateOutcome,
      removeOutcome,
      addActivity,
      updateActivity,
      removeActivity,
      addKPI,
      updateKPI,
      removeKPI,
      nextStep,
      prevStep,
      saveProject,
      saveDraft,
      saveEdits,
      clearDraft,
      hasDraft: hasWizardDraft,
      hasUnsavedChanges,
      navigate: safeNavigate,
    };
}