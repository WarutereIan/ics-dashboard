import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/contexts/ProjectsContext';
import { User, Activity, Outcome } from '@/types/dashboard';

interface ActivitySelectorProps {
  user: User;
  projectId: string;
  outputId?: string;
  outcomeId?: string;
  value: string | undefined;
  onSelect: (activityId: string) => void;
}

export function ActivitySelector({ user, projectId, outputId, outcomeId, value, onSelect }: ActivitySelectorProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { getProjectActivities, getProjectOutputs, getProjectOutcomes } = useProjects();

  useEffect(() => {
    const loadActivities = async () => {
      if (projectId) {
        try {
          let activitiesData = await getProjectActivities(projectId);
          
          // If outputId is provided, filter activities by those linked to the output
          if (outputId) {
            const outputs = await getProjectOutputs(projectId);
            const output = outputs.find((o: any) => o.id === outputId);
            if (output && output.activities) {
              activitiesData = activitiesData.filter((a: any) => output.activities.includes(a.id));
            }
          } else if (outcomeId) {
            // If outcomeId is provided, filter activities by those linked to the outcome
            activitiesData = activitiesData.filter((a: Activity) => a.outcomeId === outcomeId);
          }
          
          setActivities(activitiesData);
        } catch (error) {
          console.error('Error loading activities:', error);
        }
      }
    };

    loadActivities();
  }, [projectId, outputId, outcomeId, getProjectActivities, getProjectOutputs, getProjectOutcomes]);

  if (!activities || activities.length <= 1) return null;
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select activity..." />
      </SelectTrigger>
      <SelectContent>
        {activities.map((activity: Activity) => (
          <SelectItem key={activity.id} value={activity.id}>
            {activity.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 