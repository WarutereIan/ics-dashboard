import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { AreaChart } from '@/components/visualizations/AreaChart';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { PieChart } from '@/components/visualizations/PieChart';
import { Progress } from '@/components/ui/progress';

// Example strategic goals and subgoals (replace with parsed data from organisationPlan.md)
const strategicGoals = [
  {
    title: 'Strategic Goal 1: Safe, stable and nurturing family environments',
    subgoals: [
      {
        title: '1.1: 2,000,000 parents and caregivers have access to platforms and services',
        kpi: { value: 1200000, target: 2000000, unit: 'parents', type: 'radialGauge' },
      },
      {
        title: '1.2: 500,000 families have access to household economic strengthening opportunities',
        kpi: { value: 320000, target: 500000, unit: 'families', type: 'progressBar' },
      },
    ],
  },
  {
    title: 'Strategic Goal 2: Safe, non-violent and inclusive communities and schools',
    subgoals: [
      {
        title: '2.1: 50% community structures and child protection mechanisms supported',
        kpi: { value: 38, target: 50, unit: '%', type: 'radialGauge' },
      },
      {
        title: '2.2: 10 public schools per region per year supported to be safe',
        kpi: { value: 7, target: 10, unit: 'schools', type: 'bulletChart' },
      },
    ],
  },
  {
    title: 'Strategic Goal 3: Supportive and responsive laws, policies and services for children',
    subgoals: [
      {
        title: '3.1: Influence government to align and implement existing policies',
        kpi: { value: 6, target: 10, unit: 'policies', type: 'bulletChart' },
      },
      {
        title: '3.2: Quality and responsive government services for children and families',
        kpi: { value: 70, target: 100, unit: '%', type: 'radialGauge' },
      },
    ],
  },
  {
    title: 'Strategic Goal 4: Sustainable organizational development',
    subgoals: [
      {
        title: '4.1: 100% of processes, systems and structures are standardized and strengthened',
        kpi: { value: 82, target: 100, unit: '%', type: 'radialGauge' },
      },
      {
        title: '4.2: USD 10 million resource mobilized per year per country',
        kpi: { value: 7.5, target: 10, unit: 'million USD', type: 'bulletChart' },
      },
    ],
  },
];

export function GlobalOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization Strategic Goals</h1>
        <p className="text-muted-foreground">Key performance indicators for each strategic goal and subgoal</p>
      </div>
      {strategicGoals.map((goal, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>{goal.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goal.subgoals.map((sub, j) => (
                <Card key={j} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">{sub.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sub.kpi.type === 'radialGauge' && (
                      <RadialGauge value={sub.kpi.value / sub.kpi.target * 100} size={120} unit={sub.kpi.unit} primaryColor="#3B82F6" />
                    )}
                    {sub.kpi.type === 'progressBar' && (
                      <div className="w-full">
                        <div className="mb-2 text-sm font-medium">{sub.kpi.value.toLocaleString()} / {sub.kpi.target.toLocaleString()} {sub.kpi.unit}</div>
                        <Progress value={Math.round((sub.kpi.value / sub.kpi.target) * 100)} />
                      </div>
                    )}
                    {sub.kpi.type === 'bulletChart' && (
                      <div className="w-full">
                        <div className="mb-2 flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">{sub.title}</span>
                          <span className="text-xs text-muted-foreground">{sub.kpi.value} / {sub.kpi.target} {sub.kpi.unit}</span>
                        </div>
                        <div className="relative h-4 w-full rounded-full bg-gray-200 overflow-hidden">
                          {/* Poor range */}
                          <div className="absolute left-0 top-0 h-4 bg-red-400" style={{ width: `${(sub.kpi.target * 0.5) / (sub.kpi.target * 1.2) * 100}%` }} />
                          {/* Satisfactory range */}
                          <div className="absolute left-0 top-0 h-4 bg-yellow-400" style={{ left: `${(sub.kpi.target * 0.5) / (sub.kpi.target * 1.2) * 100}%`, width: `${(sub.kpi.target * 0.3) / (sub.kpi.target * 1.2) * 100}%` }} />
                          {/* Good range */}
                          <div className="absolute left-0 top-0 h-4 bg-green-400" style={{ left: `${(sub.kpi.target * 0.8) / (sub.kpi.target * 1.2) * 100}%`, width: `${(sub.kpi.target * 0.2) / (sub.kpi.target * 1.2) * 100}%` }} />
                          {/* Current value marker */}
                          <div className="absolute top-0 h-4 w-1 bg-blue-600" style={{ left: `calc(${(sub.kpi.value / (sub.kpi.target * 1.2)) * 100}% - 2px)` }} />
                          {/* Target marker */}
                          <div className="absolute top-0 h-4 w-1 bg-gray-800" style={{ left: `calc(${(sub.kpi.target / (sub.kpi.target * 1.2)) * 100}% - 2px)` }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span className="text-foreground font-medium">Target: {sub.kpi.target}</span>
                          <span>{Math.round(sub.kpi.target * 1.2)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}