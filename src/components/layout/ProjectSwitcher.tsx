import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDashboard } from '@/contexts/DashboardContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function ProjectSwitcher() {
  const { currentProject, setCurrentProject } = useDashboard();
  const { user } = useAuth();
  const { projects, isLoading, getAllProjectsForUser } = useProjects();
  if (!user) return null;
  const [open, setOpen] = React.useState(false);

  // Use unified API for permission-aware project list
  const accessibleProjects = user ? getAllProjectsForUser() : [];

  if (isLoading || accessibleProjects.length <= 1) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentProject?.name || "Select project..."}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {accessibleProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    // Find the full project object from ProjectsContext
                    const fullProject = projects.find(p => p.id === project.id);
                    if (fullProject) setCurrentProject(fullProject);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentProject?.id === project.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <div className="font-medium">{project.name}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}