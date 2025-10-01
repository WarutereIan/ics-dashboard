import { Outcome, Activity, Report } from '@/types/dashboard';
import { supabase } from '@/lib/supabaseClient';

// DTO interfaces that match backend expectations
export interface CreateOutcomeDto {
  title: string;
  description?: string;
  target?: number;
  current?: number;
  unit?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ON_TRACK' | 'AT_RISK' | 'BEHIND';
  progress?: number;
}

export interface CreateActivityDto {
  outcomeId: string;
  title: string;
  description?: string;
  responsible?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'NOT_STARTED' | 'IN_PROGRESS';
  startDate?: string;
  endDate?: string;
  progress?: number;
  budget?: number;
  spent?: number;
}

export interface CreateKPIDto {
  outcomeId?: string;
  name: string;
  title?: string;
  description?: string;
  target?: number;
  current?: number;
  unit?: string;
  type?: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}

export const projectDataApi = {
  // Get project outcomes
  async getProjectOutcomes(projectId: string): Promise<Outcome[]> {
    const { data, error } = await (supabase as any)
      .from('outcomes')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapOutcomeFromDb);
  },

  // Get project activities
  async getProjectActivities(projectId: string): Promise<Activity[]> {
    const { data, error } = await (supabase as any)
      .from('activities')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapActivityFromDb);
  },

  // Get project outputs
  async getProjectOutputs(projectId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('outputs')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Get project sub-activities
  async getProjectSubActivities(projectId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('sub_activities')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Get project KPIs
  async getProjectKPIs(projectId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('kpis')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Get project reports
  async getProjectReports(projectId: string): Promise<Report[]> {
    const { data, error } = await (supabase as any)
      .from('reports')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapReportFromDb);
  },

  // Create project outcome
  async createProjectOutcome(projectId: string, outcomeData: CreateOutcomeDto): Promise<Outcome> {
    const payload = {
      id: crypto.randomUUID(),
      projectId,
      title: outcomeData.title,
      description: outcomeData.description || null,
      target: outcomeData.target || null,
      current: outcomeData.current || null,
      unit: outcomeData.unit || null,
      status: outcomeData.status || 'PLANNING',
      progress: outcomeData.progress || 0,
      createdBy: 'system',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('outcomes')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return mapOutcomeFromDb(data);
  },

  // Create project activity
  async createProjectActivity(projectId: string, activityData: CreateActivityDto): Promise<Activity> {
    const payload = {
      id: crypto.randomUUID(),
      projectId,
      outcomeId: activityData.outcomeId,
      title: activityData.title,
      description: activityData.description || null,
      responsible: activityData.responsible || null,
      status: activityData.status || 'NOT_STARTED',
      startDate: activityData.startDate || null,
      endDate: activityData.endDate || null,
      progress: activityData.progress || 0,
      budget: activityData.budget || null,
      spent: activityData.spent || null,
      createdBy: 'system',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('activities')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return mapActivityFromDb(data);
  },

  // Update project outcome
  async updateProjectOutcome(projectId: string, outcomeId: string, updates: Partial<Outcome>): Promise<Outcome> {
    const updateData = {
      title: updates.title,
      description: updates.description,
      target: updates.target,
      current: updates.current,
      unit: updates.unit,
      status: updates.status,
      progress: updates.progress,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('outcomes')
      .update(updateData)
      .eq('id', outcomeId)
      .eq('projectId', projectId)
      .select('*')
      .single();
    if (error) throw error;
    return mapOutcomeFromDb(data);
  },

  // Update project activity
  async updateProjectActivity(projectId: string, activityId: string, updates: Partial<Activity>): Promise<Activity> {
    const updateData = {
      title: updates.title,
      description: updates.description,
      responsible: updates.responsible,
      status: updates.status,
      startDate: updates.startDate ? updates.startDate.toISOString() : undefined,
      endDate: updates.endDate ? updates.endDate.toISOString() : undefined,
      progress: updates.progress,
      budget: (updates as any).budget,
      spent: (updates as any).spent,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('activities')
      .update(updateData)
      .eq('id', activityId)
      .eq('projectId', projectId)
      .select('*')
      .single();
    if (error) throw error;
    return mapActivityFromDb(data);
  },

  // Delete project outcome
  async deleteProjectOutcome(projectId: string, outcomeId: string): Promise<{ success: boolean; message: string }> {
    const { error } = await (supabase as any)
      .from('outcomes')
      .delete()
      .eq('id', outcomeId)
      .eq('projectId', projectId);
    if (error) throw error;
    return { success: true, message: 'Outcome deleted successfully' };
  },

  // Delete project activity
  async deleteProjectActivity(projectId: string, activityId: string): Promise<{ success: boolean; message: string }> {
    const { error } = await (supabase as any)
      .from('activities')
      .delete()
      .eq('id', activityId)
      .eq('projectId', projectId);
    if (error) throw error;
    return { success: true, message: 'Activity deleted successfully' };
  },

  // Create project KPI
  async createProjectKPI(projectId: string, kpiData: CreateKPIDto): Promise<any> {
    const payload = {
      id: crypto.randomUUID(),
      projectId,
      outcomeId: kpiData.outcomeId || null,
      name: kpiData.name,
      title: kpiData.title || null,
      description: kpiData.description || null,
      target: kpiData.target || null,
      current: kpiData.current || null,
      unit: kpiData.unit || null,
      type: kpiData.type || null,
      frequency: kpiData.frequency || null,
      createdBy: 'system',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('kpis')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  // Update project KPI
  async updateProjectKPI(projectId: string, kpiId: string, updates: any): Promise<any> {
    const updateData = {
      ...updates,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('kpis')
      .update(updateData)
      .eq('id', kpiId)
      .eq('projectId', projectId)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  // Delete project KPI
  async deleteProjectKPI(projectId: string, kpiId: string): Promise<{ success: boolean; message: string }> {
    const { error } = await (supabase as any)
      .from('kpis')
      .delete()
      .eq('id', kpiId)
      .eq('projectId', projectId);
    if (error) throw error;
    return { success: true, message: 'KPI deleted successfully' };
  },
};

// Helper functions to map database rows to frontend types
function mapOutcomeFromDb(row: any): Outcome {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description,
    target: row.target,
    current: row.current,
    unit: row.unit,
    status: row.status,
    progress: row.progress,
  };
}

function mapActivityFromDb(row: any): Activity {
  return {
    id: row.id,
    outcomeId: row.outcomeId,
    title: row.title,
    description: row.description,
    progress: row.progress,
    status: row.status,
    startDate: row.startDate ? new Date(row.startDate) : new Date(),
    endDate: row.endDate ? new Date(row.endDate) : new Date(),
    responsible: row.responsible,
  };
}

function mapReportFromDb(row: any): Report {
  return {
    id: row.id,
    name: row.name || row.title || 'Untitled Report',
    type: row.type || 'other',
    size: row.size || '0',
    uploadDate: row.uploadDate || row.createdAt || new Date().toISOString(),
    description: row.description || '',
    category: row.category || 'adhoc',
    status: row.status || 'draft',
    uploadedBy: row.uploadedBy || row.createdBy || 'system',
    lastModified: row.lastModified || row.updatedAt || new Date().toISOString(),
    lastModifiedBy: row.lastModifiedBy || row.updatedBy || 'system',
    projectId: row.projectId,
    currentAuthLevel: row.currentAuthLevel || 'global-admin',
    approvalWorkflow: row.approvalWorkflow || {
      id: crypto.randomUUID(),
      reportId: row.id,
      projectId: row.projectId,
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      status: 'pending',
    },
    isPendingReview: row.isPendingReview || false,
  };
}
