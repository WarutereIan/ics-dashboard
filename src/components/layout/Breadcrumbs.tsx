import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbName = (segment: string, index: number) => {
    // Custom mapping for specific routes
    const mappings: Record<string, string> = {
      'dashboard': 'Dashboard',
      'project': 'Project',
      'outcome': 'Outcome',
      'activity': 'Activity',
      'reports': 'Reports',
      'mameb': 'MaMeb',
      'vacis': 'VACIS',
      'users': 'Users',
      'settings': 'Settings'
    };

    return mappings[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const getBreadcrumbPath = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };

  // For mobile, show only the last segment if there are many
  const shouldTruncate = pathSegments.length > 3;
  const displaySegments = shouldTruncate 
    ? [...pathSegments.slice(0, 1), '...', ...pathSegments.slice(-1)]
    : pathSegments;

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground min-w-0">
      <Link 
        to="/dashboard" 
        className="flex items-center hover:text-foreground transition-colors flex-shrink-0"
      >
        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
      </Link>
      
      {displaySegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          {segment === '...' ? (
            <span className="text-muted-foreground flex-shrink-0">...</span>
          ) : index === displaySegments.length - 1 ? (
            <span className="text-foreground font-medium truncate">
              {getBreadcrumbName(segment, index)}
            </span>
          ) : (
            <Link 
              to={getBreadcrumbPath(index)}
              className="hover:text-foreground transition-colors truncate flex-shrink-0"
            >
              {getBreadcrumbName(segment, index)}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}