import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { projectId } = useParams();
  const { user, projects } = useDashboard();
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(undefined);
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [selectedSubactivity, setSelectedSubactivity] = useState<string | undefined>(undefined);

  if (!user) return null;
  if (!projectId) {
    return <div>No project selected</div>;
  }

  // Get project details for title and other info
  const currentProject = projects.find(p => p.id === projectId);
  const projectName = currentProject?.name || projectId.toUpperCase();

  // Hierarchy data using projectId from URL
  const outcomes = user ? getProjectOutcomes(user, projectId) : [];
  const outputs = user
    ? (selectedOutcome
        ? getProjectOutputs(user, projectId).filter((o: any) => o.outcomeId === selectedOutcome)
        : getProjectOutputs(user, projectId))
    : [];
  const activities = user
    ? (selectedOutcome
    ? getProjectActivities(user, projectId).filter((a: any) => outputs.some((o: any) => o.activities?.includes(a.id)))
        : selectedOutput
      ? getProjectActivities(user, projectId).filter((a: any) => {
              return outputs.some((o: any) => o.id === selectedOutput && o.activities?.includes(a.id));
        })
          : getProjectActivities(user, projectId))
    : [];
  const subactivities = user
    ? (selectedActivity
    ? getProjectSubActivities(user, projectId).filter((sa: any) => sa.parentId === selectedActivity)
        : getProjectSubActivities(user, projectId))
    : [];

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
  let summaryTitle = currentProject?.name || projectName;
  let summaryDescription = currentProject?.description || 'Project details not available';
  let summaryProgress = currentProject?.progress || 0;
  let summaryStatus: 'planning' | 'active' | 'completed' | 'on-hold' = currentProject?.status || 'active';

  // Map outcome status to allowed summaryStatus values
  const mapOutcomeStatus = (status: string): 'planning' | 'active' | 'completed' | 'on-hold' => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'on-track':
      case 'at-risk':
      case 'behind':
        return 'active';
      default:
        return 'active';
    }
  };

  // Map activity status to allowed summaryStatus values
  const mapActivityStatus = (status: string): 'planning' | 'active' | 'completed' | 'on-hold' => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'on-hold':
        return 'on-hold';
      case 'not-started':
        return 'planning';
      case 'in-progress':
        return 'active';
      default:
        return 'active';
    }
  };

  if (selectedOutcome) {
    const outcome = outcomes.find((o: any) => o.id === selectedOutcome);
    if (outcome) {
      summaryTitle = outcome.title;
      summaryDescription = outcome.description;
      summaryProgress = outcome.progress;
      summaryStatus = mapOutcomeStatus(outcome.status);
    }
  }
  if (selectedOutput) {
    const output = outputs.find((o: any) => o.id === selectedOutput);
    if (output) {
      summaryTitle = output.title;
      summaryDescription = output.description;
      summaryProgress = Math.round((output.current / output.target) * 100);
      summaryStatus = mapOutcomeStatus(output.status);
    }
  }
  if (selectedActivity) {
    const activity = activities.find((a: any) => a.id === selectedActivity);
    if (activity) {
      summaryTitle = activity.title;
      summaryDescription = activity.description;
      summaryProgress = activity.progress;
      summaryStatus = mapActivityStatus(activity.status);
    }
  }
  if (selectedSubactivity) {
    const subActivity = subactivities.find((sa: any) => sa.id === selectedSubactivity);
    if (subActivity) {
      summaryTitle = subActivity.title;
      summaryDescription = subActivity.description;
      summaryProgress = subActivity.progress;
      summaryStatus = mapActivityStatus(subActivity.status);
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
        <h1 className="text-3xl font-bold text-foreground">{projectName}</h1>
        <p className="text-muted-foreground">{currentProject?.description || 'Project overview and details'}</p>
      </div>

      {/* Hierarchy Selectors */}
      <div className="flex flex-wrap gap-4 mb-4">
        {user && (
        <OutcomeSelector
          user={user}
          projectId={projectId}
          value={selectedOutcome}
          onSelect={handleSelectOutcome}
        />
        )}
        {user && (
        <OutputSelector
          user={user}
          projectId={projectId}
          outcomeId={selectedOutcome}
          value={selectedOutput}
          onSelect={handleSelectOutput}
        />
        )}
        {user && (
        <ActivitySelector
          user={user}
          projectId={projectId}
          outputId={selectedOutput}
          outcomeId={selectedOutcome}
          value={selectedActivity}
          onSelect={handleSelectActivity}
        />
        )}
        {user && (
        <SubactivitySelector
          user={user}
          projectId={projectId}
          activityId={selectedActivity}
          value={selectedSubactivity}
          onSelect={handleSelectSubactivity}
        />
        )}
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
              {currentProject?.startDate && currentProject?.endDate 
                ? `${format(currentProject.startDate, 'MMM yyyy')} - ${format(currentProject.endDate, 'MMM yyyy')}`
                : 'Dates not available'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations and other content can be added here, using the selected hierarchy level */}
    </div>
  );
}