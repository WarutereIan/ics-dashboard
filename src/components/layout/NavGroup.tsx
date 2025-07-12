import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  href?: string;
  onClick?: () => void;
}

export function NavGroup({ title, children, defaultExpanded = true, href, onClick }: NavGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const navigate = useNavigate();

  const handleTitleClick = () => {
    if (onClick) {
      onClick();
    }
    if (href) {
      navigate(href);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className="mb-4">
      {/* Title Text */}
      <div className="px-3 py-2 text-sm font-semibold">
        {(href || onClick) ? (
          <button
            onClick={handleTitleClick}
            className="text-left text-slate-800 font-medium hover:text-blue-600 transition-colors"
          >
            {title}
          </button>
        ) : (
          <span className="text-slate-800 font-medium">{title}</span>
        )}
      </div>

      {/* Expand/Collapse Button */}
      <div className="w-full px-3 py-1">
        <button
          onClick={handleExpandClick}
          className="w-full flex items-center justify-center hover:bg-slate-100 rounded transition-colors py-1"
        >
          {expanded ? (
            <ChevronDown className="w-3 h-3 text-slate-600" />
          ) : (
            <ChevronRight className="w-3 h-3 text-slate-600" />
          )}
        </button>
      </div>

      {/* Children Content */}
      <div className={cn(
        'mt-2 space-y-1 overflow-hidden transition-all duration-200',
        expanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
      )}>
        {children}
      </div>
    </div>
  );
}