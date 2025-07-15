import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { getProjectOutcomes } from '@/lib/icsData';
import { User } from '@/types/dashboard';

interface OutcomeSelectorProps {
  user: User;
  projectId: string;
  value: string | undefined;
  onSelect: (outcomeId: string) => void;
}

export function OutcomeSelector({ user, projectId, value, onSelect }: OutcomeSelectorProps) {
  const outcomes = getProjectOutcomes(user, projectId);
  if (!outcomes || outcomes.length <= 1) return null;
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select outcome..." />
      </SelectTrigger>
      <SelectContent>
        {outcomes.map(outcome => (
          <SelectItem key={outcome.id} value={outcome.id}>
            {outcome.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 