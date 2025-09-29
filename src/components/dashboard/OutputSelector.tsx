import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/contexts/ProjectsContext';
import { User } from '@/types/dashboard';

interface OutputSelectorProps {
  user: User;
  projectId: string;
  outcomeId?: string;
  value: string | undefined;
  onSelect: (outputId: string) => void;
}

export function OutputSelector({ user, projectId, outcomeId, value, onSelect }: OutputSelectorProps) {
  const [outputs, setOutputs] = useState<any[]>([]);
  const { getProjectOutputs } = useProjects();

  useEffect(() => {
    const loadOutputs = async () => {
      if (projectId) {
        try {
          let outputsData = await getProjectOutputs(projectId);
          if (outcomeId) outputsData = outputsData.filter((o: any) => o.outcomeId === outcomeId);
          setOutputs(outputsData);
        } catch (error) {
          console.error('Error loading outputs:', error);
        }
      }
    };

    loadOutputs();
  }, [projectId, outcomeId, getProjectOutputs]);

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