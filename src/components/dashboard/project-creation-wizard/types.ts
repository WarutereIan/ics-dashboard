export interface ProjectFormData {
  id: string;
  name: string;
  description: string;
  country: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: number;
}

export interface OutcomeFormData {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
}

export interface ActivityFormData {
  id: string;
  outcomeId: string;
  title: string;
  description: string;
  responsible: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface KPIFormData {
  outcomeId: string;
  name: string;
  target: number;
  unit: string;
  type: 'bar' | 'progress';
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export interface WizardState {
  currentStep: number;
  projectData: ProjectFormData;
  outcomes: OutcomeFormData[];
  activities: ActivityFormData[];
  kpis: KPIFormData[];
}