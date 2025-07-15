import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { Progress } from '@/components/ui/progress';

// MAMEB KPIs grouped by outcome (from projectKPIs.md)
const mamebKPIData = [
  {
    outcome: 'Outcome 1: Children’s Rights & Participation',
    kpis: [
      { name: '% of children who report improved knowledge on their rights and responsibilities', value: 78, target: 90, unit: '%', type: 'radialGauge' },
      { name: '% of children actively using safe platforms to engage on their rights', value: 62, target: 80, unit: '%', type: 'radialGauge' },
      { name: '# of mentors trained on life skills value-based education', value: 14, target: 20, unit: 'mentors', type: 'bar' },
      { name: '# of children participating in life skills value-based education', value: 1200, target: 2000, unit: 'children', type: 'bar' },
      { name: '# of clubs created or strengthened', value: 8, target: 10, unit: 'clubs', type: 'progress' },
      { name: '# of children actively participating in club activities', value: 950, target: 1500, unit: 'children', type: 'bar' },
      { name: '# of learners sensitized on speak out boxes', value: 2100, target: 3000, unit: 'learners', type: 'bar' },
      { name: '% of learners utilizing child-friendly reporting mechanisms', value: 42, target: 60, unit: '%', type: 'radialGauge' },
      { name: '# of incidences reported through speak out boxes', value: 23, target: 50, unit: 'incidents', type: 'bar' },
    ]
  },
  {
    outcome: 'Outcome 2: Parent & Community Engagement',
    kpis: [
      { name: '# Parents trained and graduated from Skilful parenting training', value: 320, target: 500, unit: 'parents', type: 'bar' },
      { name: '% of parents/caregivers with improved knowledge on positive parenting', value: 68, target: 85, unit: '%', type: 'radialGauge' },
      { name: '# of collaborative initiatives launched by parents, caregivers, and teachers', value: 12, target: 20, unit: 'initiatives', type: 'progress' },
      { name: '# of community awareness sessions held', value: 18, target: 30, unit: 'sessions', type: 'bar' },
    ]
  },
  {
    outcome: 'Outcome 3: Community & Religious Leaders',
    kpis: [
      { name: 'Proportion of parents reporting positive influence from community and religious leaders', value: 67, target: 85, unit: '%', type: 'radialGauge' },
      { name: '# of community and religious leaders trained', value: 45, target: 60, unit: 'leaders', type: 'bar' },
      { name: '# parents reached through community awareness', value: 1200, target: 2000, unit: 'parents', type: 'bar' },
    ]
  },
  {
    outcome: 'Outcome 4: School & Staff Capacity',
    kpis: [
      { name: '# club patrons trained', value: 10, target: 15, unit: 'patrons', type: 'progress' },
      { name: '# of teachers and staff trained on child protection', value: 32, target: 50, unit: 'staff', type: 'bar' },
    ]
  },
  {
    outcome: 'Outcome 5: Stakeholder Engagement',
    kpis: [
      { name: '# of stakeholder review meetings conducted', value: 7, target: 12, unit: 'meetings', type: 'progress' },
    ]
  },
];

export function KPIAnalytics() {
  return (
    <div className="space-y-8">
        <div>
        <h1 className="text-3xl font-bold text-foreground">MAMEB KPI Analytics</h1>
        <p className="text-muted-foreground">Key performance indicators for MAMEB, grouped by outcome</p>
      </div>
      {mamebKPIData.map((outcome, i) => (
        <Card key={i} className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>{outcome.outcome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outcome.kpis.map((kpi, j) => (
                <Card key={j} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">{kpi.name}</CardTitle>
          </CardHeader>
          <CardContent>
                    {kpi.type === 'radialGauge' && (
                      <RadialGauge value={kpi.value} size={120} unit={kpi.unit} primaryColor="#3B82F6" />
                    )}
                    {kpi.type === 'bar' && (
                      <StackedBarChart
                        data={[
                          { name: kpi.name, Actual: kpi.value, Target: kpi.target }
                        ]}
                        height={120}
                        colors={["#3B82F6", "#E5E7EB"]}
                      />
                    )}
                    {kpi.type === 'progress' && (
                      <div className="w-full">
                        <div className="mb-2 text-sm font-medium">{kpi.value} / {kpi.target} {kpi.unit}</div>
                        <Progress value={(kpi.value / kpi.target) * 100} />
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