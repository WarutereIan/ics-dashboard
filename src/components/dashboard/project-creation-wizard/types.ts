export interface ProjectFormData {
  id: string;
  name: string;
  description: string;
  country: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: number;
  // New fields for project overview
  backgroundInformation?: string;
  mapData?: ProjectMapFormData;
  theoryOfChange?: TheoryOfChangeFormData;
}

export interface ProjectMapFormData {
  type: 'data-visualization';
  title: string;
  description: string;
  mapProvider: 'openstreetmap' | 'google-maps';
  visualizationType: 'markers' | 'heatmap' | 'choropleth';
  center?: { lat: number; lng: number };
  zoom?: number;
  dataSource: 'form-responses';
}

export interface TheoryOfChangeFormData {
  type: 'image' | 'text';
  content: string;
  description?: string;
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