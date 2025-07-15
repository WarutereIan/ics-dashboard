import React, { useState } from 'react';
import { Calendar, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { useDashboard } from '@/contexts/DashboardContext';
import { getProjectOutcomes, getProjectOutputs, getProjectActivities, getProjectSubActivities } from '@/lib/icsData';
import { OutcomeSelector } from './OutcomeSelector';
import { OutputSelector } from './OutputSelector';
import { ActivitySelector } from './ActivitySelector';
import { SubactivitySelector } from './SubactivitySelector';
import { format } from 'date-fns';

export function ProjectOverview() {
  const { currentProject, user } = useDashboard();
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(undefined);
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [selectedSubactivity, setSelectedSubactivity] = useState<string | undefined>(undefined);

  if (!currentProject) {
    return <div>No project selected</div>;
  }

  // Hierarchy data
  const outcomes = getProjectOutcomes(user, currentProject.id);
  const outputs = selectedOutcome ? getProjectOutputs(user, currentProject.id).filter((o: any) => o.outcomeId === selectedOutcome) : getProjectOutputs(user, currentProject.id);
  const activities = selectedOutput
    ? getProjectActivities(user, currentProject.id).filter((a: any) => outputs.some((o: any) => o.activities?.includes(a.id)))
    : selectedOutcome
      ? getProjectActivities(user, currentProject.id).filter((a: any) => {
          const outcome = outcomes.find((o: any) => o.id === selectedOutcome);
          return outcome && (outcome as any).activities && (outcome as any).activities.includes(a.id);
        })
      : getProjectActivities(user, currentProject.id);
  const subActivities = selectedActivity
    ? getProjectSubActivities(user, currentProject.id).filter((sa: any) => sa.parentId === selectedActivity)
    : getProjectSubActivities(user, currentProject.id);

  // Reset lower levels when a higher level changes
  const handleSelectOutcome = (outcomeId: string) => {
    setSelectedOutcome(outcomeId);
    setSelectedOutput(undefined);
    setSelectedActivity(undefined);
    setSelectedSubactivity(undefined);
  };
  const handleSelectOutput = (outputId: string) => {
    setSelectedOutput(outputId);
    setSelectedActivity(undefined);
    setSelectedSubactivity(undefined);
  };
  const handleSelectActivity = (activityId: string) => {
    setSelectedActivity(activityId);
    setSelectedSubactivity(undefined);
  };
  const handleSelectSubactivity = (subActivityId: string) => {
    setSelectedSubactivity(subActivityId);
  };

  // Determine what to show in summary/visualization based on deepest selection
  let summaryTitle = currentProject.name;
  let summaryDescription = currentProject.description;
  let summaryProgress = currentProject.progress;
  let summaryStatus = currentProject.status;
  if (selectedOutcome) {
    const outcome = outcomes.find((o: any) => o.id === selectedOutcome);
    if (outcome) {
      summaryTitle = outcome.title;
      summaryDescription = outcome.description;
      summaryProgress = outcome.progress;
      summaryStatus = outcome.status;
    }
  }
  if (selectedOutput) {
    const output = outputs.find((o: any) => o.id === selectedOutput);
    if (output) {
      summaryTitle = output.title;
      summaryDescription = output.description;
      summaryProgress = Math.round((output.current / output.target) * 100);
      summaryStatus = output.status;
    }
  }
  if (selectedActivity) {
    const activity = activities.find((a: any) => a.id === selectedActivity);
    if (activity) {
      summaryTitle = activity.title;
      summaryDescription = activity.description;
      summaryProgress = activity.progress;
      summaryStatus = activity.status;
    }
  }
  if (selectedSubactivity) {
    const subActivity = subActivities.find((sa: any) => sa.id === selectedSubactivity);
    if (subActivity) {
      summaryTitle = subActivity.title;
      summaryDescription = subActivity.description;
      summaryProgress = subActivity.progress;
      summaryStatus = subActivity.status;
    }
  }

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

      {/* Hierarchy Selectors */}
      <div className="flex flex-wrap gap-4 mb-4">
        <OutcomeSelector
          user={user}
          projectId={currentProject.id}
          value={selectedOutcome}
          onSelect={handleSelectOutcome}
        />
        <OutputSelector
          user={user}
          projectId={currentProject.id}
          outcomeId={selectedOutcome}
          value={selectedOutput}
          onSelect={handleSelectOutput}
        />
        <ActivitySelector
          user={user}
          projectId={currentProject.id}
          outputId={selectedOutput}
          outcomeId={selectedOutcome}
          value={selectedActivity}
          onSelect={handleSelectActivity}
        />
        <SubactivitySelector
          user={user}
          projectId={currentProject.id}
          activityId={selectedActivity}
          value={selectedSubactivity}
          onSelect={handleSelectSubactivity}
        />
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summaryProgress}%</div>
            <Progress value={summaryProgress} className="mt-2" />
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
            <Badge className={getStatusColor(summaryStatus)}>
              {summaryStatus?.charAt(0).toUpperCase() + summaryStatus?.slice(1)}
            </Badge>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Title
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summaryTitle}</div>
            <p className="text-xs text-muted-foreground">{summaryDescription}</p>
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
              {format(currentProject.startDate, 'MMM yyyy')} - {format(currentProject.endDate, 'MMM yyyy')}
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations and other content can be added here, using the selected hierarchy level */}
    </div>
  );
}