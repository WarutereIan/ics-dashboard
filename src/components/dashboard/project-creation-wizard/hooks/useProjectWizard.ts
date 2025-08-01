import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { toast } from '@/hooks/use-toast';
import { saveProject as saveProjectData, getProjectData, getProjectKPIsData, getAllProjectsData } from '@/lib/projectDataManager';
import { getProjectOutcomes, getProjectActivities, getProjectKPIs } from '@/lib/icsData';
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
  const { refreshProjects, user, projects } = useDashboard();
  const isEditMode = Boolean(projectId);
  
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
    },
    outcomes: [],
    activities: [],
    kpis: [],
  });

  const steps: WizardStep[] = [
    { id: 'project', title: 'Project Details', description: 'Basic project information' },
    { id: 'outcomes', title: 'Outcomes', description: 'Define project outcomes' },
    { id: 'activities', title: 'Activities', description: 'Add activities for each outcome' },
    { id: 'kpis', title: 'KPIs', description: 'Define key performance indicators' },
    { id: 'review', title: 'Review', description: isEditMode ? 'Review and update project' : 'Review and create project' },
  ];

  // Load existing project data when in edit mode
  useEffect(() => {
    if (isEditMode && projectId && user) {
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        // Load project basic info
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
          }
        }));

        // Load outcomes, activities, and KPIs
        try {
          const outcomes = getProjectOutcomes(user, projectId);
          const activities = getProjectActivities(user, projectId);
          const kpis = getProjectKPIs(user, projectId);

          setWizardState(prev => ({
            ...prev,
            outcomes: outcomes.map((outcome: any) => ({
              id: outcome.id,
              title: outcome.title,
              description: outcome.description,
              target: outcome.target || 0,
              unit: outcome.unit || '',
            })),
            activities: activities.map((activity: any) => ({
              id: activity.id,
              outcomeId: activity.outcomeId,
              title: activity.title,
              description: activity.description,
              startDate: activity.startDate,
              endDate: activity.endDate,
              responsible: activity.responsible,
            })),
            kpis: kpis.map((kpi: any) => ({
              id: kpi.outcomeId + '-' + kpi.name.toLowerCase().replace(/\s+/g, '-'),
              outcomeId: kpi.outcomeId,
              name: kpi.name,
              target: kpi.target,
              unit: kpi.unit,
              type: kpi.type,
            })),
          }));
        } catch (error) {
          console.error('Error loading project data:', error);
          toast({
            title: "Error Loading Project",
            description: "Could not load project data for editing.",
            variant: "destructive",
          });
        }
      }
    }
  }, [isEditMode, projectId, user, projects]);

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

  // Save project
  const saveProject = () => {
    const project = {
      ...wizardState.projectData,
      startDate: wizardState.projectData.startDate || new Date(),
      endDate: wizardState.projectData.endDate || new Date(),
      progress: 0,
      spent: 0,
    };

    const projectOutcomes = wizardState.outcomes.map(outcome => ({
      ...outcome,
      projectId: wizardState.projectData.id,
      current: 0,
      progress: 0,
      status: 'on-track' as const,
    }));

    const projectActivities = wizardState.activities.map(activity => ({
      ...activity,
      progress: 0,
      status: 'not-started' as const,
      startDate: activity.startDate || new Date(),
      endDate: activity.endDate || new Date(),
    }));

    const projectKpis = wizardState.kpis.map(kpi => ({
      ...kpi,
      value: 0,
    }));

    // Save project using the data manager
    const success = saveProjectData(project, projectOutcomes, projectActivities, projectKpis);
    
    if (success) {
      toast({
        title: isEditMode ? "Project Updated Successfully" : "Project Created Successfully",
        description: isEditMode 
          ? `${wizardState.projectData.name} has been updated with ${wizardState.outcomes.length} outcomes, ${wizardState.activities.length} activities, and ${wizardState.kpis.length} KPIs.`
          : `${wizardState.projectData.name} has been created with ${wizardState.outcomes.length} outcomes, ${wizardState.activities.length} activities, and ${wizardState.kpis.length} KPIs.`,
      });
      
      // Refresh projects and navigate
      refreshProjects();
      if (isEditMode) {
        navigate(`/dashboard/projects/${wizardState.projectData.id}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: isEditMode ? "Error Updating Project" : "Error Creating Project",
        description: "There was an error saving your project. Please try again.",
        variant: "destructive",
      });
    }
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
    navigate,
  };
}