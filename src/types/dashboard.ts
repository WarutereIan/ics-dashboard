export interface User {
  id: string;
  name: string;
  email: string;
  role: 'global-admin' | 'country-admin' | 'project-admin' | 'branch-admin';
  accessibleProjects: string[];
  accessibleBranches: string[];
  accessibleCountries: string[];
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  country: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  progress: number;
  budget: number;
  spent: number;
}

export interface Outcome {
  id: string;
  projectId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
}

export interface Activity {
  id: string;
  outcomeId: string;
  title: string;
  description: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  responsible: string;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

// Visualization data types
export interface RadialGaugeData {
  type: 'radialGauge';
  value: number;
  target: number;
  unit: string;
  useColorCoding: boolean;
  data?: { month: string; value: number; }[];
  baseline?: number;
  improvement?: number;
}

export interface PieChartData {
  type: 'pieChart';
  data: { name: string; value: number; color: string; }[];
  innerRadius: number;
  interactive: boolean;
}

export interface StackedBarChartData {
  type: 'stackedBarChart';
  data: any[];
  stacks?: { dataKey: string; fill: string; name: string; }[];
}

export interface AreaChartData {
  type: 'areaChart';
  data: any[];
  showCumulative: boolean;
  milestones?: { x: string; label: string; }[];
}

export interface LineChartData {
  type: 'lineChart';
  data: any[];
  lines: { dataKey: string; color: string; name: string; }[];
  milestones?: { x: string; label: string; }[];
}

export interface BarChartData {
  type: 'barChart';
  data: any[];
  bars: { dataKey: string; fill: string; name: string; }[];
}

export interface BulletChartData {
  type: 'bulletChart';
  current: number;
  target: number;
  unit: string;
  qualitativeRanges: { poor: number; satisfactory: number; good: number; };
  comparative?: number;
}

export interface HeatmapCalendarData {
  type: 'heatmapCalendar';
  data: { date: string; value: number; }[];
}

export interface LikertScaleData {
  type: 'likertScale';
  data: {
    question: string;
    responses: {
      stronglyDisagree: number;
      disagree: number;
      neutral: number;
      agree: number;
      stronglyAgree: number;
    };
  }[];
}

export interface PieAndTrendData {
  type: 'pieAndTrend';
  pieData: { name: string; value: number; color: string; }[];
  trendData: { date: string; value: number; }[];
}

export interface ProgressBarData {
  type: 'progressBar';
  current: number;
  target: number;
  unit: string;
  breakdown: { name: string; value: number; }[];
}

export type VisualizationData =
  | RadialGaugeData
  | PieChartData
  | StackedBarChartData
  | AreaChartData
  | LineChartData
  | BarChartData
  | BulletChartData
  | HeatmapCalendarData
  | LikertScaleData
  | PieAndTrendData
  | ProgressBarData;