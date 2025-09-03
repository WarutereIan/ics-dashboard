import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/contexts/ProjectsContext';
import { User, Outcome } from '@/types/dashboard';

interface OutcomeSelectorProps {
  user: User;
  projectId: string;
  value: string | undefined;
  onSelect: (outcomeId: string) => void;
}

export function OutcomeSelector({ user, projectId, value, onSelect }: OutcomeSelectorProps) {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const { getProjectOutcomes } = useProjects();

  useEffect(() => {
    const loadOutcomes = async () => {
      if (projectId) {
        try {
          const outcomesData = await getProjectOutcomes(projectId);
          setOutcomes(outcomesData);
        } catch (error) {
          console.error('Error loading outcomes:', error);
        }
      }
    };

    loadOutcomes();
  }, [projectId, getProjectOutcomes]);

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