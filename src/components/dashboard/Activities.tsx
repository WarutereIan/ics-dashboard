import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { getProjectActivities } from '@/lib/icsData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function Activities() {
  const { user, currentProject } = useDashboard();
  if (!user || !currentProject) return null;
  const activities = user ? getProjectActivities(user, currentProject.id) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Project Activities</h1>
        <p className="text-muted-foreground">All activities tracked for this project, with key details.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{activity.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{activity.status.replace('-', ' ')}</Badge>
                <span className="text-xs text-muted-foreground">{activity.startDate ? new Date(activity.startDate).toLocaleDateString() : 'No start'} - {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : 'No end'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">{activity.description || 'No description provided.'}</p>
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">Progress:</span>
                <Progress value={activity.progress} className="h-2 mt-1" />
                <span className="text-xs text-muted-foreground ml-2">{activity.progress}%</span>
              </div>
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">Person in Charge:</span>
                <span className="ml-2 text-sm text-foreground">{activity.responsible || 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">Area of Implementation:</span>
                <span className="ml-2 text-sm text-foreground">(Not specified)</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 