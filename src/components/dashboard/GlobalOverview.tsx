import React from 'react';
import { TrendingUp, Users, MapPin, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { AreaChart } from '@/components/visualizations/AreaChart';
import { BulletChart } from '@/components/visualizations/BulletChart';

export function GlobalOverview() {
  const kpiData = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Activity
    },
    {
      title: 'Countries',
      value: '8',
      change: '+1',
      changeType: 'positive' as const,
      icon: MapPin
    },
    {
      title: 'Beneficiaries',
      value: '2.4M',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Budget Utilization',
      value: '72%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  const projectProgressData = [
    { name: 'Kenya', planning: 2, active: 4, completed: 1 },
    { name: 'Tanzania', planning: 1, active: 2, completed: 2 },
    { name: 'Uganda', planning: 3, active: 1, completed: 0 },
    { name: 'Ethiopia', planning: 1, active: 3, completed: 1 }
  ];

  const performanceData = [
    { date: '2023-01', value: 450, cumulative: 450 },
    { date: '2023-02', value: 520, cumulative: 970 },
    { date: '2023-03', value: 480, cumulative: 1450 },
    { date: '2023-04', value: 610, cumulative: 2060 },
    { date: '2023-05', value: 550, cumulative: 2610 },
    { date: '2023-06', value: 670, cumulative: 3280 },
    { date: '2023-07', value: 730, cumulative: 4010 },
    { date: '2023-08', value: 690, cumulative: 4700 },
    { date: '2023-09', value: 780, cumulative: 5480 },
    { date: '2023-10', value: 840, cumulative: 6320 },
    { date: '2023-11', value: 810, cumulative: 7130 },
    { date: '2023-12', value: 890, cumulative: 8020 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Global Overview</h1>
        <p className="text-muted-foreground">Organization-wide performance and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className={`text-xs ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Global project completion rate</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <RadialGauge value={78} size={150} unit="%" primaryColor="#3B82F6" />
          </CardContent>
        </Card>

        {/* Project Status by Country */}
        <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Project Status by Country</CardTitle>
            <CardDescription>Distribution of project phases across countries</CardDescription>
          </CardHeader>
          <CardContent>
            <StackedBarChart data={projectProgressData} height={250} />
          </CardContent>
        </Card>
      </div>

      {/* Performance Timeline */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
          <CardDescription>Cumulative beneficiary reach across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart 
            data={performanceData} 
            height={300} 
            areaColor="#3B82F6"
            showCumulative={true}
          />
        </CardContent>
      </Card>

      {/* Global KPIs */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Global Performance Indicators</CardTitle>
          <CardDescription>Organization-wide targets and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BulletChart
              current={8020}
              target={10000}
              title="Total Beneficiaries Reached"
              unit="people"
              qualitativeRanges={{ poor: 6000, satisfactory: 8000, good: 10000 }}
            />
            <BulletChart
              current={72}
              target={100}
              title="Budget Utilization"
              unit="%"
              qualitativeRanges={{ poor: 50, satisfactory: 75, good: 100 }}
            />
            <BulletChart
              current={89}
              target={100}
              title="Project Milestones Achieved"
              unit="%"
              qualitativeRanges={{ poor: 70, satisfactory: 85, good: 100 }}
            />
            <BulletChart
              current={156}
              target={200}
              title="Community Leaders Trained"
              unit="leaders"
              qualitativeRanges={{ poor: 100, satisfactory: 150, good: 200 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates from projects worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { project: 'MaMeb Kenya', activity: 'Child rights clubs formation completed in 2 schools', time: '2 hours ago', status: 'completed' },
              { project: 'MaMeb Kenya', activity: 'Mentor training session conducted', time: '5 hours ago', status: 'completed' },
              { project: 'MaMeb Kenya', activity: 'Speak out boxes installed in 3 schools', time: '1 day ago', status: 'completed' },
              { project: 'MaMeb Kenya', activity: 'Community leaders training session', time: '2 days ago', status: 'completed' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">{item.project}</p>
                  <p className="text-sm text-muted-foreground">{item.activity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status === 'completed' ? 'Completed' : 'In Progress'}
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