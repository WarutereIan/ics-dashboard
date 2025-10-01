import { Project } from '@/types/dashboard';
import { supabase } from '@/lib/supabaseClient';

export const projectsApi = {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await (supabase as any)
      .from('projects')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapProjectFromDb);
  },

  // Get project by ID
  async getProjectById(id: string): Promise<Project> {
    const { data, error } = await (supabase as any)
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return mapProjectFromDb(data);
  },

  // Get projects by country
  async getProjectsByCountry(country: string): Promise<Project[]> {
    const { data, error } = await (supabase as any)
      .from('projects')
      .select('*')
      .eq('country', country)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapProjectFromDb);
  },

  // Create new project
  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    const payload: any = {
      id: crypto.randomUUID(),
      name: projectData.name,
      description: projectData.description,
      country: projectData.country,
      status: projectData.status as any,
      startDate: projectData.startDate.toISOString(),
      endDate: projectData.endDate.toISOString(),
      progress: projectData.progress ?? 0,
      budget: projectData.budget ?? 0,
      spent: projectData.spent ?? 0,
      backgroundInformation: projectData.backgroundInformation ?? null,
      mapData: projectData.mapData as any,
      theoryOfChange: projectData.theoryOfChange as any,
      createdBy: 'system',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('projects')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return mapProjectFromDb(data);
  },

  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const updateData: any = {
      name: updates.name,
      description: updates.description,
      country: updates.country,
      status: updates.status as any,
      startDate: updates.startDate ? updates.startDate.toISOString() : undefined,
      endDate: updates.endDate ? updates.endDate.toISOString() : undefined,
      progress: updates.progress,
      budget: updates.budget,
      spent: updates.spent,
      backgroundInformation: updates.backgroundInformation,
      mapData: updates.mapData as any,
      theoryOfChange: updates.theoryOfChange as any,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return mapProjectFromDb(data);
  },

  // Delete project
  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    const { error } = await (supabase as any)
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Deleted' };
  },
};

function mapProjectFromDb(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    country: row.country,
    status: row.status,
    startDate: new Date(row.startDate),
    endDate: new Date(row.endDate),
    progress: row.progress,
    budget: row.budget,
    spent: row.spent,
    backgroundInformation: row.backgroundInformation ?? undefined,
    mapData: row.mapData ?? undefined,
    theoryOfChange: row.theoryOfChange ?? undefined,
    createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    createdBy: row.createdBy ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
  } as Project;
}
