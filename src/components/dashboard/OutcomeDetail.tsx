import React from 'react';
import { useParams } from 'react-router-dom';
import { Target, TrendingUp, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { TimelineChart } from '@/components/visualizations/TimelineChart';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { PieChart } from '@/components/visualizations/PieChart';
import { AreaChart } from '@/components/visualizations/AreaChart';
import { mockOutcomes, mockActivities } from '@/lib/mockData';

// Import the detailed outputs data
const outcome1Outputs = [
  { id: 'output-1.1', title: '% of children who report improved knowledge on their rights', target: 80, current: 65, unit: '%' },
  { id: 'output-1.2', title: '% of children actively using safe platforms', target: 70, current: 45, unit: '%' },
  { id: 'output-1.3', title: '# of mentors trained on life skills education', target: 5, current: 4, unit: 'mentors' },
  { id: 'output-1.4', title: '# of children participating in life skills education', target: 3000, current: 1350, unit: 'children' },
  { id: 'output-1.5', title: '# of clubs created or strengthened', target: 10, current: 7, unit: 'clubs' },
  { id: 'output-1.6', title: '# of children in club activities', target: 2500, current: 980, unit: 'children' },
  { id: 'output-1.7', title: '# of learners sensitized on speak out boxes', target: 3000, current: 2100, unit: 'learners' },
  { id: 'output-1.8', title: '% using child-friendly reporting mechanisms', target: 60, current: 42, unit: '%' },
  { id: 'output-1.9', title: '# of incidents reported through speak out boxes', target: 50, current: 23, unit: 'incidents' }
];

export function OutcomeDetail() {
  const { outcomeId } = useParams();
  const outcome = mockOutcomes.find(o => o.id === `outcome-${outcomeId}`);
  const relatedActivities = mockActivities.filter(a => a.outcomeId === `outcome-${outcomeId}`);

  if (!outcome) {
    return <div>Outcome not found</div>;
  }

  const performanceData = [
    { date: '2023-01', value: 150, cumulative: 150 },
    { date: '2023-02', value: 180, cumulative: 330 },
    { date: '2023-03', value: 220, cumulative: 550 },
    { date: '2023-04', value: 195, cumulative: 745 },
    { date: '2023-05', value: 240, cumulative: 985 },
    { date: '2023-06', value: 210, cumulative: 1195 },
    { date: '2023-07', value: 155, cumulative: 1350 },
    { date: '2023-08', value: 0, cumulative: 1350 },
    { date: '2023-09', value: 0, cumulative: 1350 },
    { date: '2023-10', value: 0, cumulative: 1350 },
    { date: '2023-11', value: 0, cumulative: 1350 },
    { date: '2023-12', value: 0, cumulative: 1350 }
  ];

  // Data for reporting mechanism utilization (Output 1.8)
  const reportingUtilizationData = [
    { name: 'Using Reporting Mechanisms', value: 42 },
    { name: 'Not Using', value: 58 }
  ];

  // Data for mentor training progress (Output 1.3)
  const mentorTrainingData = [
    { date: '2023-01', value: 0, cumulative: 0 },
    { date: '2023-02', value: 1, cumulative: 1 },
    { date: '2023-03', value: 1, cumulative: 2 },
    { date: '2023-04', value: 1, cumulative: 3 },
    { date: '2023-05', value: 1, cumulative: 4 },
    { date: '2023-06', value: 0, cumulative: 4 },
    { date: '2023-07', value: 0, cumulative: 4 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'behind':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{outcome.title}</h1>
        <p className="text-muted-foreground mt-2">{outcome.description}</p>
      </div>

      {/* Outcome Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{outcome.current}</div>
            <p className="text-xs text-muted-foreground">
              of {outcome.target} {outcome.unit}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{outcome.progress}%</div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(outcome.status)}>
              {outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1).replace('-', ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activities
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{relatedActivities.length}</div>
            <p className="text-xs text-muted-foreground">related activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Progress Towards Target</CardTitle>
            <CardDescription>Visual representation of outcome achievement</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <RadialGauge 
              value={outcome.progress} 
              size={180} 
              thickness={12}
              unit="%" 
              primaryColor="#14B8A6"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Children Participation Timeline</CardTitle>
            <CardDescription>Monthly enrollment in life skills education</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart 
              data={performanceData} 
              height={250} 
              areaColor="#14B8A6"
              showCumulative={true}
            />
          </CardContent>
        </Card>
      </div>

      {/* Related Activities */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Related Activities</CardTitle>
          <CardDescription>Activities contributing to this outcome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatedActivities.map((activity) => (
              <div key={activity.id} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{activity.title}</h4>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{activity.progress}%</span>
                  </div>
                  <Progress value={activity.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Responsible: {activity.responsible}</span>
                    <span>Due: {activity.endDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Outputs and Indicators</CardTitle>
          <CardDescription>Key performance indicators with appropriate visualizations</CardDescription>
        </CardHeader>
        <CardContent>
          {outcomeId === '1' ? (
            <div className="space-y-8">
              {/* Percentage-based outputs - Radial Gauges */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Knowledge and Engagement Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <RadialGauge 
                      value={65}
                      size={120}
                      thickness={8}
                      unit="%"
                      primaryColor="#14B8A6"
                    />
                    <div className="mt-3">
                      <h5 className="font-medium text-foreground">Children with Rights Knowledge</h5>
                      <p className="text-sm text-muted-foreground">Output 1.1</p>
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <RadialGauge 
                      value={45}
                      size={120}
                      thickness={8}
                      unit="%"
                      primaryColor="#3B82F6"
                    />
                    <div className="mt-3">
                      <h5 className="font-medium text-foreground">Using Safe Platforms</h5>
                      <p className="text-sm text-muted-foreground">Output 1.2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Count-based outputs - Bullet Charts */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Training and Participation Targets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BulletChart
                    current={4}
                    target={5}
                    title="Mentors Trained"
                    unit="mentors"
                    qualitativeRanges={{ poor: 2, satisfactory: 4, good: 5 }}
                  />
                  <BulletChart
                    current={1350}
                    target={3000}
                    title="Children in Life Skills Education"
                    unit="children"
                    qualitativeRanges={{ poor: 1200, satisfactory: 2400, good: 3000 }}
                  />
                  <BulletChart
                    current={7}
                    target={10}
                    title="Child Rights Clubs"
                    unit="clubs"
                    qualitativeRanges={{ poor: 4, satisfactory: 7, good: 10 }}
                  />
                  <BulletChart
                    current={980}
                    target={2500}
                    title="Children in Club Activities"
                    unit="children"
                    qualitativeRanges={{ poor: 1000, satisfactory: 2000, good: 2500 }}
                  />
                </div>
              </div>

              {/* Utilization metrics - Pie Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Reporting Mechanism Utilization</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Child-Friendly Reporting Usage (Output 1.8)</h5>
                    <PieChart 
                      data={reportingUtilizationData}
                      height={200}
                      showLegend={true}
                      innerRadius={40}
                    />
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Mentor Training Progress (Output 1.3)</h5>
                    <AreaChart 
                      data={mentorTrainingData}
                      height={200}
                      areaColor="#F97316"
                      showCumulative={false}
                    />
                  </Card>
                </div>
              </div>

              {/* Additional metrics */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Awareness and Reporting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BulletChart
                    current={2100}
                    target={3000}
                    title="Learners Sensitized on Speak Out Boxes"
                    unit="learners"
                    qualitativeRanges={{ poor: 1500, satisfactory: 2400, good: 3000 }}
                  />
                  <BulletChart
                    current={23}
                    target={50}
                    title="Incidents Reported"
                    unit="incidents"
                    qualitativeRanges={{ poor: 20, satisfactory: 35, good: 50 }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Primary Indicator', current: 68, target: 100, unit: '%' },
                { name: 'Secondary Indicator', current: 45, target: 60, unit: 'units' },
                { name: 'Impact Measure', current: 87, target: 100, unit: '%' }
              ].map((kpi, index) => (
                <div key={index} className="text-center">
                  <RadialGauge 
                    value={(kpi.current / kpi.target) * 100}
                    size={120}
                    thickness={8}
                    showValue={false}
                    primaryColor="#3B82F6"
                  />
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground">{kpi.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {kpi.current} / {kpi.target} {kpi.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}