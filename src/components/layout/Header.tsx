import React from 'react';
import { Bars3Icon, BellIcon, WifiIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from './Breadcrumbs';
import { ProjectSwitcher } from './ProjectSwitcher';
import { UserMenu } from './UserMenu';
import { useDashboard } from '@/contexts/DashboardContext';
import { useForm } from '@/contexts/FormContext';

export function Header() {
  const { setSidebarOpen } = useDashboard();
  const { isOnline, syncStatus } = useForm();

  return (
    <header className="bg-background border-b border-border mobile-header">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        {/* Left side - Menu button and breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="min-w-0 flex-1">
            <Breadcrumbs />
          </div>
        </div>
        
        {/* Right side - Notifications and user menu */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Offline indicator */}
          {!isOnline && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs">
              <WifiIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}
          
          {/* Pending sync indicator */}
          {isOnline && syncStatus.pendingItems > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs">
              <span>{syncStatus.pendingItems} pending</span>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 sm:h-9 sm:w-9"
          >
            <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
}