import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function Subactivities() {
  const { user } = useAuth();
  const { currentProject } = useDashboard();
  const { getProjectSubActivities } = useProjects();
  const [subactivities, setSubactivities] = useState<any[]>([]);

  useEffect(() => {
    const loadSubactivities = async () => {
      if (user && currentProject) {
        try {
          const subactivitiesData = await getProjectSubActivities(currentProject.id);
          setSubactivities(subactivitiesData);
        } catch (error) {
          console.error('Error loading subactivities:', error);
        }
      }
    };

    loadSubactivities();
  }, [user, currentProject, getProjectSubActivities]);

  if (!user || !currentProject) return null;

  if (!subactivities.length) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Project Subactivities</h1>
        <p className="text-muted-foreground">No subactivities found for this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Project Subactivities</h1>
        <p className="text-muted-foreground">All subactivities tracked for this project, with key details.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subactivities.map((sub) => (
          <Card key={sub.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{sub.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{sub.status.replace('-', ' ')}</Badge>
                <span className="text-xs text-muted-foreground">{sub.dueDate ? new Date(sub.dueDate).toLocaleDateString() : 'No due date'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">{sub.description || 'No description provided.'}</p>
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">Progress:</span>
                <Progress value={sub.progress} className="h-2 mt-1" />
                <span className="text-xs text-muted-foreground ml-2">{sub.progress}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 