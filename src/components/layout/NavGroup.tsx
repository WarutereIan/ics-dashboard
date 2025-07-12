import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function NavGroup({ title, children, defaultExpanded = true }: NavGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent rounded-lg transition-colors"
      >
        <span>{title}</span>
        {expanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      <div className={cn(
        'mt-2 space-y-1 overflow-hidden transition-all duration-200',
        expanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
      )}>
        {children}
      </div>
    </div>
  );
}