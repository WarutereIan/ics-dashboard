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

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link 
        to="/dashboard" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {index === pathSegments.length - 1 ? (
            <span className="text-foreground font-medium">
              {getBreadcrumbName(segment, index)}
            </span>
          ) : (
            <Link 
              to={getBreadcrumbPath(index)}
              className="hover:text-foreground transition-colors"
            >
              {getBreadcrumbName(segment, index)}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}