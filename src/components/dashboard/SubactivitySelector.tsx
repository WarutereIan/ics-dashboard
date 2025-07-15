import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { getProjectSubActivities } from '@/lib/icsData';
import { User } from '@/types/dashboard';

interface SubactivitySelectorProps {
  user: User;
  projectId: string;
  activityId: string | undefined;
  value: string | undefined;
  onSelect: (subActivityId: string) => void;
}

export function SubactivitySelector({ user, projectId, activityId, value, onSelect }: SubactivitySelectorProps) {
  let subActivities = getProjectSubActivities(user, projectId);
  if (activityId) subActivities = subActivities.filter((sa: any) => sa.parentId === activityId);
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