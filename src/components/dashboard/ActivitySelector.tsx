import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { getProjectActivities, getProjectOutputs, getProjectOutcomes } from '@/lib/icsData';
import { User } from '@/types/dashboard';

interface ActivitySelectorProps {
  user: User;
  projectId: string;
  outputId?: string;
  outcomeId?: string;
  value: string | undefined;
  onSelect: (activityId: string) => void;
}

export function ActivitySelector({ user, projectId, outputId, outcomeId, value, onSelect }: ActivitySelectorProps) {
  let activities = getProjectActivities(user, projectId);
  // If outputId is provided, filter activities by those linked to the output
  if (outputId) {
    const outputs = getProjectOutputs(user, projectId);
    const output = outputs.find((o: any) => o.id === outputId);
    if (output && output.activities) {
      activities = activities.filter((a: any) => output.activities.includes(a.id));
    }
  } else if (outcomeId) {
    // If outcomeId is provided, filter activities by those linked to the outcome
    const outcomes = getProjectOutcomes(user, projectId);
    const outcome = outcomes.find((o: any) => o.id === outcomeId);
    // The Outcome type does not have 'activities', but the data does
    if (outcome && (outcome as any).activities) {
      activities = activities.filter((a: any) => (outcome as any).activities.includes(a.id));
    }
  }
  if (!activities || activities.length <= 1) return null;
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select activity..." />
      </SelectTrigger>
      <SelectContent>
        {activities.map((activity: any) => (
          <SelectItem key={activity.id} value={activity.id}>
            {activity.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 