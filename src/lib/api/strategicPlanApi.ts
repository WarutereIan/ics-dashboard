import { supabase } from '@/lib/supabaseClient';

export interface StrategicKPI {
  currentValue: number;
  targetValue: number;
  unit: string;
  type: string;
}

export interface StrategicActivityLink {
  projectId: string;
  projectName: string;
  activityId: string;
  activityTitle: string;
  contribution: number;
  status: 'contributing' | 'at-risk' | 'not-contributing';
}

export interface StrategicSubGoal {
  id: string;
  title: string;
  description: string;
  kpi: StrategicKPI;
  activityLinks: StrategicActivityLink[];
}

export interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  targetOutcome: string;
  subgoals: StrategicSubGoal[];
}

export interface StrategicPlan {
  id: string;
  title: string;
  description?: string;
  version: string;
  startYear: number;
  endYear: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  goals: StrategicGoal[];
}

class StrategicPlanApi {
  private baseUrl = '/strategic-plan';
  // Declarations to satisfy TS; implementations are attached below on prototype
  public createStrategicPlanForExistingId!: (
    planId: string,
    data: StrategicGoal[],
    startYear?: number,
    endYear?: number,
  ) => Promise<StrategicPlan>;
  public hydratePlans!: (plans: any[]) => Promise<StrategicPlan[]>;

  async createStrategicPlan(data: StrategicGoal[], startYear?: number, endYear?: number): Promise<StrategicPlan> {
    // 1) Create plan row
    const planId = crypto.randomUUID();
    const now = new Date().toISOString();
    const { error: planErr } = await (supabase as any)
      .from('strategic_plans')
      .insert({
        id: planId,
        title: 'ICS Strategic Plan',
        description: 'Organizational strategic plan',
        version: '1.0',
      startYear: startYear || new Date().getFullYear(), 
        endYear: endYear || new Date().getFullYear() + 4,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
      });
    if (planErr) throw planErr;

    // 2) Insert goals
    for (let goalIndex = 0; goalIndex < data.length; goalIndex++) {
      const goal = data[goalIndex];
      const goalId = crypto.randomUUID();
      const { error: gErr } = await (supabase as any)
        .from('strategic_goals')
        .insert({
          id: goalId,
          strategicPlanId: planId,
          title: goal.title,
          description: goal.description,
          priority: goal.priority?.toUpperCase() || 'MEDIUM',
          targetOutcome: goal.targetOutcome,
          order: goalIndex,
          createdAt: now,
          updatedAt: now,
          createdBy: 'system',
          updatedBy: 'system',
        });
      if (gErr) throw gErr;

      // 3) Insert subgoals
      for (let subIndex = 0; subIndex < (goal.subgoals || []).length; subIndex++) {
        const sub = goal.subgoals[subIndex];
        const subId = crypto.randomUUID();
        const { error: sErr } = await (supabase as any)
          .from('strategic_subgoals')
          .insert({
            id: subId,
            strategicGoalId: goalId,
            title: sub.title,
            description: sub.description,
            order: subIndex,
            createdAt: now,
            updatedAt: now,
            createdBy: 'system',
            updatedBy: 'system',
          });
        if (sErr) throw sErr;

        // 3a) KPI (single, optional)
        if (sub.kpi) {
          const { error: kErr } = await (supabase as any)
            .from('strategic_kpis')
            .insert({
              id: crypto.randomUUID(),
              strategicSubGoalId: subId,
              currentValue: sub.kpi.currentValue,
              targetValue: sub.kpi.targetValue,
              unit: sub.kpi.unit,
              type: sub.kpi.type,
              createdAt: now,
              updatedAt: now,
              createdBy: 'system',
              updatedBy: 'system',
            });
          if (kErr) throw kErr;
        }

        // 3b) Activity links
        const links = (sub.activityLinks || []).map(l => ({
          id: crypto.randomUUID(),
          strategicSubGoalId: subId,
          projectId: l.projectId,
          projectName: l.projectName,
          activityId: l.activityId,
          activityTitle: l.activityTitle,
          contribution: l.contribution,
          status: l.status?.toUpperCase().replace('-', '_') || 'CONTRIBUTING',
          createdAt: now,
          updatedAt: now,
          createdBy: 'system',
          updatedBy: 'system',
        }));
        if (links.length) {
          const { error: alErr } = await (supabase as any)
            .from('strategic_activity_links')
            .insert(links);
          if (alErr) throw alErr;
        }
      }
    }

    return await this.getStrategicPlan(planId);
  }

  async updateStrategicPlan(id: string, data: StrategicGoal[], startYear?: number, endYear?: number): Promise<StrategicPlan> {
    const now = new Date().toISOString();
    // Update plan basic fields
    const { error: upErr } = await (supabase as any)
      .from('strategic_plans')
      .update({
        startYear: startYear ?? undefined,
        endYear: endYear ?? undefined,
        updatedAt: now,
        updatedBy: 'system',
      })
      .eq('id', id);
    if (upErr) throw upErr;

    // Replace all children: delete existing goals (cascade removes sub tables)
    const { error: delErr } = await (supabase as any)
      .from('strategic_goals')
      .delete()
      .eq('strategicPlanId', id);
    if (delErr) throw delErr;

    // Re-insert children
    const creator = (StrategicPlanApi.prototype as any).createStrategicPlanForExistingId as (
      planId: string,
      d: StrategicGoal[],
      sy?: number,
      ey?: number,
    ) => Promise<StrategicPlan>;
    return await creator(id, data, startYear, endYear);
  }

  async getStrategicPlans(): Promise<StrategicPlan[]> {
    const { data: plans, error } = await (supabase as any)
      .from('strategic_plans')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    const hydrator = (StrategicPlanApi.prototype as any).hydratePlans as ((plans: any[]) => Promise<StrategicPlan[]>);
    return await hydrator(plans || []);
  }

  async getActiveStrategicPlan(): Promise<StrategicPlan | null> {
    const { data, error } = await (supabase as any)
      .from('strategic_plans')
      .select('*')
      .eq('isActive', true)
      .order('updatedAt', { ascending: false })
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return null;
    const hydrator = (StrategicPlanApi.prototype as any).hydratePlans as ((plans: any[]) => Promise<StrategicPlan[]>);
    const [plan] = await hydrator([data[0]]);
    return plan || null;
  }

  async getStrategicPlan(id: string): Promise<StrategicPlan> {
    const { data, error } = await (supabase as any)
      .from('strategic_plans')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    const hydrator = (StrategicPlanApi.prototype as any).hydratePlans as ((plans: any[]) => Promise<StrategicPlan[]>);
    const [plan] = await hydrator([data]);
    return plan;
  }

  async activateStrategicPlan(id: string): Promise<StrategicPlan> {
    // Deactivate others
    const { error: e1 } = await (supabase as any)
      .from('strategic_plans')
      .update({ isActive: false, updatedAt: new Date().toISOString(), updatedBy: 'system' })
      .neq('id', id);
    if (e1) throw e1;

    // Activate selected
    const { data, error } = await (supabase as any)
      .from('strategic_plans')
      .update({ isActive: true, updatedAt: new Date().toISOString(), updatedBy: 'system' })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return mapPlanFromDb(data);
  }

  async getStrategicPlansByYearRange(startYear: number, endYear: number): Promise<StrategicPlan[]> {
    const { data, error } = await (supabase as any)
      .from('strategic_plans')
      .select('*')
      .gte('startYear', startYear)
      .lte('endYear', endYear)
      .order('startYear', { ascending: true });
    if (error) throw error;
    const hydrator = (StrategicPlanApi.prototype as any).hydratePlans as ((plans: any[]) => Promise<StrategicPlan[]>);
    return await hydrator(data || []);
  }

  async deleteStrategicPlan(id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('strategic_plans')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}

export const strategicPlanApi = new StrategicPlanApi();

// Mapper: DB row -> StrategicPlan type
function mapPlanFromDb(row: any): StrategicPlan {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    version: row.version,
    startYear: row.startYear,
    endYear: row.endYear,
    isActive: !!row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    goals: row.goals || [],
  } as StrategicPlan;
}

// Helpers to re-insert children for an existing plan id
async function insertGoalsForPlan(
  planId: string,
  goals: StrategicGoal[],
): Promise<void> {
  const now = new Date().toISOString();
  for (let goalIndex = 0; goalIndex < goals.length; goalIndex++) {
    const goal = goals[goalIndex];
    const goalId = crypto.randomUUID();
    const { error: gErr } = await (supabase as any)
      .from('strategic_goals')
      .insert({
        id: goalId,
        strategicPlanId: planId,
        title: goal.title,
        description: goal.description,
        priority: goal.priority?.toUpperCase() || 'MEDIUM',
        targetOutcome: goal.targetOutcome,
        order: goalIndex,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
      });
    if (gErr) throw gErr;

    for (let subIndex = 0; subIndex < (goal.subgoals || []).length; subIndex++) {
      const sub = goal.subgoals[subIndex];
      const subId = crypto.randomUUID();
      const { error: sErr } = await (supabase as any)
        .from('strategic_subgoals')
        .insert({
          id: subId,
          strategicGoalId: goalId,
          title: sub.title,
          description: sub.description,
          order: subIndex,
          createdAt: now,
          updatedAt: now,
          createdBy: 'system',
          updatedBy: 'system',
        });
      if (sErr) throw sErr;

      if (sub.kpi) {
        const { error: kErr } = await (supabase as any)
          .from('strategic_kpis')
          .insert({
            id: crypto.randomUUID(),
            strategicSubGoalId: subId,
            currentValue: sub.kpi.currentValue,
            targetValue: sub.kpi.targetValue,
            unit: sub.kpi.unit,
            type: sub.kpi.type,
            createdAt: now,
            updatedAt: now,
            createdBy: 'system',
            updatedBy: 'system',
          });
        if (kErr) throw kErr;
      }

      const links = (sub.activityLinks || []).map(l => ({
        id: crypto.randomUUID(),
        strategicSubGoalId: subId,
        projectId: l.projectId,
        projectName: l.projectName,
        activityId: l.activityId,
        activityTitle: l.activityTitle,
        contribution: l.contribution,
        status: l.status?.toUpperCase().replace('-', '_') || 'CONTRIBUTING',
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
      }));
      if (links.length) {
        const { error: alErr } = await (supabase as any)
          .from('strategic_activity_links')
          .insert(links);
        if (alErr) throw alErr;
      }
    }
  }
}

// For update path when id already exists
// Attach helpers as concrete methods so 'this.hydratePlans' exists
StrategicPlanApi.prototype.createStrategicPlanForExistingId = async function (
  this: any,
  planId: string,
  data: StrategicGoal[],
  startYear?: number,
  endYear?: number,
): Promise<StrategicPlan> {
  await insertGoalsForPlan(planId, data);
  return await this.getStrategicPlan(planId);
};

// Hydrate plans with nested goals/subgoals/kpis/activityLinks
StrategicPlanApi.prototype.hydratePlans = async function (
  this: any,
  plans: any[],
): Promise<StrategicPlan[]> {
  if (plans.length === 0) return [];
  const planIds = plans.map(p => p.id);
  const { data: goals, error: gErr } = await (supabase as any)
    .from('strategic_goals')
    .select('*')
    .in('strategicPlanId', planIds)
    .order('order', { ascending: true });
  if (gErr) throw gErr;

  const goalIds = (goals || []).map((g: any) => g.id);
  const { data: subgoals, error: sErr } = await (supabase as any)
    .from('strategic_subgoals')
    .select('*')
    .in('strategicGoalId', goalIds)
    .order('order', { ascending: true });
  if (sErr) throw sErr;

  const subIds = (subgoals || []).map((s: any) => s.id);
  const [{ data: kpis }, { data: links }] = await Promise.all([
    (supabase as any).from('strategic_kpis').select('*').in('strategicSubGoalId', subIds),
    (supabase as any).from('strategic_activity_links').select('*').in('strategicSubGoalId', subIds),
  ]);

  // assemble
  const subByGoal: Record<string, any[]> = {};
  (subgoals || []).forEach((s: any) => {
    subByGoal[s.strategicGoalId] = subByGoal[s.strategicGoalId] || [];
    const kpi = (kpis || []).find((k: any) => k.strategicSubGoalId === s.id);
    const activityLinks = (links || []).filter((l: any) => l.strategicSubGoalId === s.id).map((l: any) => ({
      projectId: l.projectId,
      projectName: l.projectName,
      activityId: l.activityId,
      activityTitle: l.activityTitle,
      contribution: l.contribution,
      status: (l.status || 'CONTRIBUTING').toLowerCase().replace('_', '-') as any,
    }));
    subByGoal[s.strategicGoalId].push({
      id: s.id,
      title: s.title,
      description: s.description,
      order: s.order,
      kpi: kpi
        ? {
            currentValue: kpi.currentValue,
            targetValue: kpi.targetValue,
            unit: kpi.unit,
            type: kpi.type,
          }
        : undefined,
      activityLinks,
    });
  });

  const goalsByPlan: Record<string, any[]> = {};
  (goals || []).forEach((g: any) => {
    goalsByPlan[g.strategicPlanId] = goalsByPlan[g.strategicPlanId] || [];
    goalsByPlan[g.strategicPlanId].push({
      id: g.id,
      title: g.title,
      description: g.description,
      priority: (g.priority || 'MEDIUM').toLowerCase() as any,
      targetOutcome: g.targetOutcome,
      order: g.order,
      subgoals: subByGoal[g.id] || [],
    });
  });

  return plans.map(p => ({
    ...mapPlanFromDb(p),
    goals: goalsByPlan[p.id] || [],
  }));
};
