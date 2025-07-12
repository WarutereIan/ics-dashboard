import React from 'react';
import { Calendar, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { useDashboard } from '@/contexts/DashboardContext';
import { mockOutcomes, mockActivities } from '@/lib/mockData';
import { format } from 'date-fns';

export function ProjectOverview() {
  const { currentProject } = useDashboard();

  if (!currentProject) {
    return <div>No project selected</div>;
  }

  const projectOutcomes = mockOutcomes.filter(outcome => outcome.projectId === currentProject.id);
  const recentActivities = mockActivities.slice(0, 3);

  // Data for outcome progress comparison
  const outcomeProgressData = [
    { name: 'Outcome 1', completed: 45, inProgress: 30, planned: 25 },
    { name: 'Outcome 2', completed: 68, inProgress: 20, planned: 12 },
    { name: 'Outcome 3', completed: 72, inProgress: 18, planned: 10 },
    { name: 'Outcome 4', completed: 60, inProgress: 25, planned: 15 },
    { name: 'Outcome 5', completed: 58, inProgress: 22, planned: 20 }
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
        <h1 className="text-3xl font-bold text-foreground">{currentProject.name}</h1>
        <p className="text-muted-foreground">{currentProject.description}</p>
      </div>

      {/* Project Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentProject.progress}%</div>
            <Progress value={currentProject.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget Utilization
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(currentProject.spent / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              of ${(currentProject.budget / 1000000).toFixed(1)}M budget
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Duration
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              5 years
            </div>
            <p className="text-xs text-muted-foreground">
              {format(currentProject.startDate, 'MMM yyyy')} - {format(currentProject.endDate, 'MMM yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(currentProject.status)}>
              {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Outcomes and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outcomes */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Outcomes</CardTitle>
            <CardDescription>Progress tracking with appropriate visualizations</CardDescription>
          </CardHeader>
          <CardContent>
            <StackedBarChart 
              data={outcomeProgressData} 
              height={300}
              colors={['#10B981', '#F59E0B', '#E5E7EB']}
            />
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest project activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
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
                    <span>{format(activity.endDate, 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Target vs actual performance across key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BulletChart
              current={1350}
              target={3000}
              title="Children with Rights Knowledge"
              unit="children"
              qualitativeRanges={{ poor: 1200, satisfactory: 2400, good: 3000 }}
            />
            <BulletChart
              current={4}
              target={5}
              title="Mentors Trained"
              unit="mentors"
              qualitativeRanges={{ poor: 2, satisfactory: 4, good: 5 }}
            />
            <BulletChart
              current={7}
              target={10}
              title="Child Rights Clubs"
              unit="clubs"
              qualitativeRanges={{ poor: 4, satisfactory: 7, good: 10 }}
            />
            <BulletChart
              current={72}
              target={100}
              title="Community Leaders Trained"
              unit="leaders"
              qualitativeRanges={{ poor: 40, satisfactory: 70, good: 100 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Risks and Issues */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Key Risks and Issues</CardTitle>
          <CardDescription>Current risks and mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { risk: 'Low community participation', impact: 'High', probability: 'Medium', mitigation: 'Enhanced community engagement strategies', status: 'monitoring' },
              { risk: 'School administration resistance', impact: 'Medium', probability: 'Low', mitigation: 'Stakeholder meetings and capacity building', status: 'resolved' },
              { risk: 'Child safety concerns', impact: 'High', probability: 'Low', mitigation: 'Robust safeguarding protocols implemented', status: 'monitoring' },
              { risk: 'Limited mentor availability', impact: 'Medium', probability: 'Medium', mitigation: 'Expanded recruitment and incentive programs', status: 'monitoring' }
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{item.risk}</h4>
                  <Badge variant={item.status === 'resolved' ? 'default' : 'destructive'}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Impact: </span>
                    <span className="font-medium">{item.impact}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Probability: </span>
                    <span className="font-medium">{item.probability}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mitigation: </span>
                    <span className="font-medium">{item.mitigation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}