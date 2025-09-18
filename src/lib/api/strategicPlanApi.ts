import { apiClient } from './client';

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

  async createStrategicPlan(data: StrategicGoal[], startYear?: number, endYear?: number): Promise<StrategicPlan> {
    // Transform frontend data to backend format
    const transformedGoals = data.map(goal => ({
      ...goal,
      priority: goal.priority.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
      subgoals: goal.subgoals.map(subGoal => ({
        ...subGoal,
        activityLinks: subGoal.activityLinks.map(activity => ({
          ...activity,
          status: activity.status.toUpperCase().replace('-', '_') as 'CONTRIBUTING' | 'AT_RISK' | 'NOT_CONTRIBUTING'
        }))
      }))
    }));

    const response = await apiClient.post(`${this.baseUrl}/from-frontend`, { 
      goals: transformedGoals, 
      startYear: startYear || new Date().getFullYear(), 
      endYear: endYear || new Date().getFullYear() + 4
    });
    return response.data as StrategicPlan;
  }

  async updateStrategicPlan(id: string, data: StrategicGoal[], startYear?: number, endYear?: number): Promise<StrategicPlan> {
    // Transform frontend data to backend format
    const transformedGoals = data.map(goal => ({
      ...goal,
      priority: goal.priority.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
      subgoals: goal.subgoals.map(subGoal => ({
        ...subGoal,
        activityLinks: subGoal.activityLinks.map(activity => ({
          ...activity,
          status: activity.status.toUpperCase().replace('-', '_') as 'CONTRIBUTING' | 'AT_RISK' | 'NOT_CONTRIBUTING'
        }))
      }))
    }));

    const response = await apiClient.patch(`${this.baseUrl}/${id}/from-frontend`, { 
      goals: transformedGoals,
      startYear: startYear || new Date().getFullYear(),
      endYear: endYear || new Date().getFullYear() + 4
    });
    return response.data as StrategicPlan;
  }

  async getStrategicPlans(): Promise<StrategicPlan[]> {
    const response = await apiClient.get(this.baseUrl);
    return response.data as StrategicPlan[];
  }

  async getActiveStrategicPlan(): Promise<StrategicPlan | null> {
    const response = await apiClient.get(`${this.baseUrl}/active`);
    return response.data as StrategicPlan | null;
  }

  async getStrategicPlan(id: string): Promise<StrategicPlan> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data as StrategicPlan;
  }

  async activateStrategicPlan(id: string): Promise<StrategicPlan> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/activate`);
    return response.data as StrategicPlan;
  }

  async getStrategicPlansByYearRange(startYear: number, endYear: number): Promise<StrategicPlan[]> {
    const response = await apiClient.get(`${this.baseUrl}/by-year-range?startYear=${startYear}&endYear=${endYear}`);
    return response.data as StrategicPlan[];
  }

  async deleteStrategicPlan(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const strategicPlanApi = new StrategicPlanApi();
