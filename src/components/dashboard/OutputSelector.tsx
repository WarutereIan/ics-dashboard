import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { getProjectOutputs } from '@/lib/icsData';
import { User } from '@/types/dashboard';

interface OutputSelectorProps {
  user: User;
  projectId: string;
  outcomeId?: string;
  value: string | undefined;
  onSelect: (outputId: string) => void;
}

export function OutputSelector({ user, projectId, outcomeId, value, onSelect }: OutputSelectorProps) {
  let outputs = getProjectOutputs(user, projectId);
  if (outcomeId) outputs = outputs.filter((o: any) => o.outcomeId === outcomeId);
  if (!outputs || outputs.length <= 1) return null;
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select output..." />
      </SelectTrigger>
      <SelectContent>
        {outputs.map((output: any) => (
          <SelectItem key={output.id} value={output.id}>
            {output.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 