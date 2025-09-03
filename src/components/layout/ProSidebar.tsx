import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Target, Activity, Users, Settings, Folder, Circle, CheckCircle2, Flag, FileText, Plus, ClipboardList, X, DollarSign } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { createPermissionManager } from '@/lib/permissions';


export function ProSidebar() {
  const { setSidebarOpen } = useDashboard();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  
  // Always call hooks in the same order
  const projectsContext = useProjects();
  
  // Create permission manager
  const permissionManager = createPermissionManager({
    user,
    isAuthenticated,
    isLoading: authLoading
  });
  
  const { 
    projects, 
    isLoading,
  } = projectsContext;
  
  // Early return if auth is loading
  if (authLoading) {
    return (
      <div className="w-[270px] bg-gray-50 border-r border-gray-200 h-screen flex items-center justify-center">
        <div className="text-center text-sm text-gray-500">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Early return if user is not loaded or doesn't exist
  if (!user) {
    return (
      <div className="w-[270px] bg-gray-50 border-r border-gray-200 h-screen flex items-center justify-center">
        <div className="text-center text-sm text-gray-500">
          <p>Loading user...</p>
        </div>
      </div>
    );
  }
  
  // Use centralized permission manager
  const isAdmin = () => permissionManager.isGlobalAdmin();

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  try {
    return (
      <Sidebar 
        width="270px" 
        backgroundColor="rgb(249,249,249,0.95)"
        className="border-r border-gray-200 h-screen md:h-auto flex flex-col"
      >
      {/* Mobile close button */}
      <div className="flex justify-end p-4 md:hidden flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCloseSidebar}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Organization Logo/Header */}
      <div className="flex flex-col items-center px-4 pb-6 flex-shrink-0">
        <img
          src="/logo.png"
          alt="Organization Logo"
          className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="font-bold text-lg md:text-xl text-center leading-tight">
          IDMS Dashboard
        </span>
      </div>

      {/* Scrollable menu container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Menu className="px-2">
          <MenuItem 
            icon={<Target className="h-4 w-4" />} 
            component={<Link to="/dashboard" onClick={handleCloseSidebar} />}
            className="text-sm"
          >
            Organization Goals
          </MenuItem>
          
          <SubMenu 
            label="Projects" 
            icon={<Folder className="h-4 w-4" />}
            className="text-sm"
          >
            {/* Create Project option for admins */}
            {isAdmin() && (
              <MenuItem 
                icon={<Plus className="h-4 w-4" />} 
                component={<Link to="/dashboard/projects/create" onClick={handleCloseSidebar} />}
                className="text-sm"
              >
                Create Project
              </MenuItem>
            )}
            
            {isLoading ? (
              <MenuItem className="text-sm text-gray-500">
                Loading projects...
              </MenuItem>
            ) : projects.length === 0 ? (
              <MenuItem className="text-sm text-gray-500">
                No projects available
              </MenuItem>
            ) : (
              projects.map(project => {
                // Safety check for project object
                if (!project || !project.id || !project.name) {
                  console.warn('Invalid project object:', project);
                  return null;
                }
                
                return (
                <SubMenu 
                  key={project.id} 
                  label={project.name.toUpperCase()}
                  className="text-sm"
                >
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Overview
                </MenuItem>
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}/kpi`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  KPI Analytics
                </MenuItem>
                
                {/* Outcomes */}
                {user && (
                  <MenuItem 
                    component={<Link to={`/dashboard/projects/${project.id}/outcomes`} onClick={handleCloseSidebar} />}
                    className="text-sm"
                  >
                    Outcomes
                  </MenuItem>
                )}
                
                {/* Outputs (conditional) */}
                {user && (
                  <MenuItem 
                    component={<Link to={`/dashboard/projects/${project.id}/outputs`} onClick={handleCloseSidebar} />}
                    className="text-sm"
                  >
                    Outputs
                  </MenuItem>
                )}
                
                {/* Activities (always shown) */}
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}/activities`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Activities
                </MenuItem>
                
                {/* Subactivities (conditional) */}
                {user && (
                  <MenuItem 
                    component={<Link to={`/dashboard/projects/${project.id}/subactivities`} onClick={handleCloseSidebar} />}
                    className="text-sm"
                  >
                    Subactivities
                  </MenuItem>
                )}
                
                {/* Forms for data collection */}
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}/forms`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Forms
                </MenuItem>
                
                {/* Financial tracking */}
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}/financial`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Financial
                </MenuItem>
                
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}/reports`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Reports
                </MenuItem>
                
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}/maps`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Maps
                </MenuItem>
                
                <MenuItem 
                  component={<Link to={`/dashboard/projects/${project.id}/media`} onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Media
                </MenuItem>
                
                {/* Edit Project option for admins */}
                {isAdmin() && (
                  <MenuItem 
                    component={<Link to={`/dashboard/projects/${project.id}/edit`} onClick={handleCloseSidebar} />}
                    className="text-sm"
                  >
                    Edit Project
                  </MenuItem>
                )}
              </SubMenu>
                );
              })
            )}
          </SubMenu>
          
          {/* Admin section, if user is admin */}
          {isAdmin() && (
            <SubMenu 
              label="Administration" 
              icon={<Settings className="h-4 w-4" />}
              className="text-sm"
            >
              <MenuItem 
                component={<Link to="/dashboard/admin/users" onClick={handleCloseSidebar} />}
                className="text-sm"
              >
                User Management
              </MenuItem>
              <MenuItem 
                component={<Link to="/dashboard/admin/settings" onClick={handleCloseSidebar} />}
                className="text-sm"
              >
                Settings
              </MenuItem>
            </SubMenu>
          )}
        </Menu>
      </div>
    </Sidebar>
    );
  } catch (error) {
    console.error('Error rendering ProSidebar:', error);
    return (
      <div className="w-[270px] bg-gray-50 border-r border-gray-200 h-screen flex items-center justify-center">
        <div className="text-center text-sm text-gray-500">
          <p>Error loading sidebar</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-500 underline"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }
} 