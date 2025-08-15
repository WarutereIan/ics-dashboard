import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { getProjectActivities, getProjectOutcomes } from '@/lib/icsData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function Activities() {
  const { projectId } = useParams();
  const { user, projects } = useDashboard();
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(undefined);

  if (!user) return null;
  if (!projectId) {
    return <div>No project selected</div>;
  }

  // Get project details for title
  const project = projects.find(p => p.id === projectId);
  const projectName = project?.name || projectId.toUpperCase();

  // Get data for the current project using projectId from URL
  const outcomes = getProjectOutcomes(user, projectId);
  const allActivities = getProjectActivities(user, projectId);

  // Filter activities by selected outcome if one is selected
  const filteredActivities = selectedOutcome
    ? allActivities.filter((activity: any) => activity.outcomeId === selectedOutcome)
    : allActivities;

  // Check if current project has activity data available
  if (!allActivities || allActivities.length === 0) {
    return (
      <div className="flex flex-col space-y-8 overflow-x-hidden w-full">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{projectName} Activities</h1>
          <p className="text-muted-foreground">
            No activities available for {projectName} project.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>Activity data is not available for this project yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col space-y-8 overflow-x-hidden w-full">
      {/* Header with outcome filter */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 w-full">
        <div className="flex-1 min-w-0 lg:max-w-[70%]">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">{projectName} Activities</h1>
          <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mt-1">
            All activities tracked for {projectName}, with key details and progress.
          </p>
        </div>
        {outcomes.length > 0 && (
          <div className="w-full lg:w-auto lg:max-w-[280px] lg:flex-shrink-0">
            <label className="block text-sm font-medium text-muted-foreground mb-1 lg:text-right">
              Filter by Outcome
            </label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={selectedOutcome || ''}
              onChange={e => setSelectedOutcome(e.target.value || undefined)}
            >
              <option value="">All Outcomes</option>
              {outcomes.map((outcome: any) => (
                <option key={outcome.id} value={outcome.id} title={outcome.title}>
                  {outcome.title.length > 50 ? `${outcome.title.substring(0, 47)}...` : outcome.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 w-full max-w-full">
        {filteredActivities.map((activity: any) => (
          <Card key={activity.id} className="transition-all duration-200 hover:shadow-md w-full min-w-0 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-base md:text-lg font-semibold break-words line-clamp-2">{activity.title}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status.replace('-', ' ')}
                </Badge>
                {activity.startDate && activity.endDate && (
                  <span className="text-xs text-muted-foreground break-words">
                    {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-w-0">
              <p className="mb-4 text-sm text-muted-foreground break-words line-clamp-3">
                {activity.description || 'No description provided.'}
              </p>
              
              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Progress</span>
                  <span className="text-xs text-muted-foreground">{activity.progress}%</span>
                </div>
                <Progress value={activity.progress} className="h-2" />
              </div>

              {/* Person in Charge */}
              {activity.responsible && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Person in Charge:</span>
                  <span className="ml-2 text-sm text-foreground break-words">
                    {activity.responsible}
                  </span>
                </div>
              )}

              {/* Subactivities count if available */}
              {activity.subActivities && activity.subActivities.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Subactivities:</span>
                  <span className="ml-2 text-sm text-foreground">
                    {activity.subActivities.length} items
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show message if no activities for selected outcome */}
      {selectedOutcome && filteredActivities.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground p-8">
              <p className="text-base md:text-lg mb-2">No activities available for the selected outcome.</p>
              <p className="text-sm">Try selecting a different outcome or view all activities.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no activities at all */}
      {filteredActivities.length === 0 && !selectedOutcome && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground p-8">
              <p className="text-base md:text-lg mb-2">No activities found for this project.</p>
              <p className="text-sm">Activities will appear here once they are added to the project.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 