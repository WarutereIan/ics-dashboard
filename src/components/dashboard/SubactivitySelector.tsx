import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/contexts/ProjectsContext';
import { User } from '@/types/dashboard';

interface SubactivitySelectorProps {
  user: User;
  projectId: string;
  activityId: string | undefined;
  value: string | undefined;
  onSelect: (subActivityId: string) => void;
}

export function SubactivitySelector({ user, projectId, activityId, value, onSelect }: SubactivitySelectorProps) {
  const [subActivities, setSubActivities] = useState<any[]>([]);
  const { getProjectSubActivities } = useProjects();

  useEffect(() => {
    const loadSubActivities = async () => {
      if (projectId) {
        try {
          let subActivitiesData = await getProjectSubActivities(projectId);
          if (activityId) subActivitiesData = subActivitiesData.filter((sa: any) => sa.parentId === activityId);
          setSubActivities(subActivitiesData);
        } catch (error) {
          console.error('Error loading sub-activities:', error);
        }
      }
    };

    loadSubActivities();
  }, [projectId, activityId, getProjectSubActivities]);

  if (!subActivities || subActivities.length <= 1) return null;
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select sub-activity..." />
      </SelectTrigger>
      <SelectContent>
        {subActivities.map((subActivity: any) => (
          <SelectItem key={subActivity.id} value={subActivity.id}>
            {subActivity.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 