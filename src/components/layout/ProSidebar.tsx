import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  FolderIcon, 
  CheckCircleIcon, 
  FlagIcon, 
  DocumentTextIcon, 
  PlusIcon, 
  ClipboardDocumentListIcon, 
  XMarkIcon, 
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon, 
  CircleStackIcon, 
  BookOpenIcon, 
  PencilIcon,
  InformationCircleIcon,
  MapIcon,
  PhotoIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { createEnhancedPermissionManager } from '@/lib/permissions';


export function ProSidebar() {
  const { setSidebarOpen } = useDashboard();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  
  // Always call hooks in the same order
  const projectsContext = useProjects();
  
  // Create enhanced permission manager
  const permissionManager = createEnhancedPermissionManager({
    user,
    isAuthenticated,
    isLoading: authLoading
  });
  
  const { 
    projects, 
    isLoading,
    getAllProjectsForUser,
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
  const isRegionalCoordinator = () => {
    const roleNames = (user?.roles || []).map(r => r.roleName);
    return roleNames.includes('coordinator-tanzania') || roleNames.includes('coordinator-cote-divoire');
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Get accessible projects for the current user
  const accessibleProjects = getAllProjectsForUser();

  try {
    return (
      <Sidebar 
        width="270px"
        backgroundColor="#f8fafc"
        rootStyles={{
          borderRight: '1px solid #e2e8f0',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">DIMES</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseSidebar}
                className="md:hidden"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto">
            <Menu>
              {/* Global Overview */}
             <SubMenu 
            label="Global" 
            icon={<UsersIcon className="h-4 w-4" />}
            className="text-sm"
            >
              <MenuItem 
            icon={<FlagIcon className="h-4 w-4" />} 
            component={<Link to="/dashboard" onClick={handleCloseSidebar} />}
            className="text-sm"
          >
            Goals
          </MenuItem>
            {isAdmin() && (
              <SubMenu 
                label="Strategic Plan" 
                icon={<BookOpenIcon className="h-4 w-4" />}
                className="text-sm"
              >
                <MenuItem 
                  component={<Link to="/dashboard/strategic-plan/create" onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Create Organizational Plan
                </MenuItem>
                <MenuItem 
                  component={<Link to="/dashboard/strategic-plan/edit" onClick={handleCloseSidebar} />}
                  className="text-sm"
                >
                  Edit Organizational Plan
                </MenuItem>
              </SubMenu>
            )}
            <SubMenu 
              label="Feedback & Submissions" 
              icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
              className="text-sm"
            >
              <MenuItem 
                component={<Link to="/dashboard/feedback" onClick={handleCloseSidebar} />}
                className="text-sm"
              >
                Submit Feedback
              </MenuItem>
              
              <MenuItem 
                component={<Link to="/dashboard/feedback/submissions" onClick={handleCloseSidebar} />}
                className="text-sm"
              >
                View Submissions
              </MenuItem>
             
            </SubMenu>
          </SubMenu>

              {/* Projects Section */}
              <SubMenu 
                label="Projects" 
                icon={<FolderIcon className="h-4 w-4" />}
                className="text-sm"
              >
                {/* Create Project (admin only) */}
                {isAdmin() && (
                  <MenuItem 
                    icon={<PlusIcon className="h-4 w-4" />} 
                    component={<Link to="/dashboard/projects/create" onClick={handleCloseSidebar} />}
                    className="text-sm"
                  >
                    Create Project
                  </MenuItem>
                )}
                
                {/* Projects List */}
                {isLoading ? (
                  <MenuItem className="text-sm text-gray-500">
                    Loading projects...
                  </MenuItem>
                ) : accessibleProjects.length === 0 ? (
                  <MenuItem className="text-sm text-gray-500">
                    No projects available
                  </MenuItem>
                ) : (
                  (isRegionalCoordinator() 
                    ? accessibleProjects.filter((project: any) => {
                        const country = ((project && (project as any).country) ? (project as any).country : '').toLowerCase();
                        const rcTz = (user?.roles || []).some(r => r.roleName === 'coordinator-tanzania');
                        const rcCi = (user?.roles || []).some(r => r.roleName === 'coordinator-cote-divoire');
                        if (rcTz) return country.includes('tanzania') || country.includes('tz');
                        if (rcCi) return country.includes('côte') || country.includes('cote') || country.includes('ivoire');
                        return true;
                      })
                    : accessibleProjects
                  ).map(project => {
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
                        {/* Background */}
                        <MenuItem 
                          component={<Link to={`/dashboard/projects/${project.id}`} onClick={handleCloseSidebar} />}
                          className="text-sm"
                          icon={<InformationCircleIcon className="h-4 w-4" />}
                        >
                          Background
                        </MenuItem>
                        
                        {/* ToC Tracker */}
                        <SubMenu 
                          label="ToC Tracker" 
                          icon={<ChartBarIcon className="h-4 w-4" />}
                          className="text-sm"
                        >
                          {/* Outcomes - Check for project read permissions */}
                          {permissionManager.canAccessProject(project.id, 'read') && (
                            <MenuItem 
                              component={<Link to={`/dashboard/projects/${project.id}/outcomes`} onClick={handleCloseSidebar} />}
                              className="text-sm"
                            >
                              Outcomes
                            </MenuItem>
                          )}
                          
                          {/* Outputs - Check for project read permissions */}
                          {permissionManager.canAccessProject(project.id, 'read') && (
                            <MenuItem 
                              component={<Link to={`/dashboard/projects/${project.id}/outputs`} onClick={handleCloseSidebar} />}
                              className="text-sm"
                            >
                              Outputs
                            </MenuItem>
                          )}
                          
                          {/* Activities - Check for project read permissions */}
                          {permissionManager.canAccessProject(project.id, 'read') && (
                            <MenuItem 
                              component={<Link to={`/dashboard/projects/${project.id}/activities`} onClick={handleCloseSidebar} />}
                              className="text-sm"
                            >
                              Activities
                            </MenuItem>
                          )}
                          
                          {/* Subactivities - Check for project read permissions */}
                          {permissionManager.canAccessProject(project.id, 'read') && (
                            <MenuItem 
                              component={<Link to={`/dashboard/projects/${project.id}/subactivities`} onClick={handleCloseSidebar} />}
                              className="text-sm"
                            >
                              Sub-activities
                            </MenuItem>
                          )}
                        </SubMenu>
                        
                        {/* KPI Tracker */}
                        {permissionManager.canAccessProjectComponent(project.id, 'kpis', 'read') && (
                          <MenuItem 
                            component={<Link to={`/dashboard/projects/${project.id}/kpi`} onClick={handleCloseSidebar} />}
                            className="text-sm"
                            icon={<DocumentChartBarIcon className="h-4 w-4" />}
                          >
                            KPI Tracker
                          </MenuItem>
                        )}
                        
                        {/* Forms Management */}
                        {permissionManager.canAccessProject(project.id, 'read') && (
                          <MenuItem 
                            component={<Link to={`/dashboard/projects/${project.id}/forms`} onClick={handleCloseSidebar} />}
                            className="text-sm"
                            icon={<DocumentTextIcon className="h-4 w-4" />}
                          >
                            Forms Management
                          </MenuItem>
                        )}
                        
                        {/* Budget Tracker */}
                        {permissionManager.canAccessProjectComponent(project.id, 'finance', 'read') && (
                          <MenuItem 
                            component={<Link to={`/dashboard/projects/${project.id}/financial`} onClick={handleCloseSidebar} />}
                            className="text-sm"
                            icon={<CurrencyDollarIcon className="h-4 w-4" />}
                          >
                            Budget Tracker
                          </MenuItem>
                        )}
                        
                        {/* Media */}
                        {permissionManager.canAccessProject(project.id, 'read') && (
                          <MenuItem 
                            component={<Link to={`/dashboard/projects/${project.id}/media`} onClick={handleCloseSidebar} />}
                            className="text-sm"
                            icon={<PhotoIcon className="h-4 w-4" />}
                          >
                            Media
                          </MenuItem>
                        )}
                        
                        {/* Reports */}
                        {permissionManager.canAccessProjectComponent(project.id, 'reports', 'read') && (
                          <MenuItem 
                            component={<Link to={`/dashboard/projects/${project.id}/reports`} onClick={handleCloseSidebar} />}
                            className="text-sm"
                            icon={<DocumentTextIcon className="h-4 w-4" />}
                          >
                            Reports
                          </MenuItem>
                        )}
                        
                        {/* Data Imports */}
                        <SubMenu 
                          label="Data Imports" 
                          icon={<CircleStackIcon className="h-4 w-4" />}
                          className="text-sm"
                        >
                          {/* Kobo Data - Check for kobo permissions */}
                          {permissionManager.canAccessProjectComponent(project.id, 'kobo', 'read') && (
                            <MenuItem 
                              component={<Link to={`/dashboard/projects/${project.id}/kobo-data`} onClick={handleCloseSidebar} />}
                              className="text-sm"
                            >
                              Kobo
                            </MenuItem>
                          )}
                        </SubMenu>
                        
                        {/* Maps */}
                        {permissionManager.canAccessProject(project.id, 'read') && (
                          <MenuItem 
                            component={<Link to={`/dashboard/projects/${project.id}/maps`} onClick={handleCloseSidebar} />}
                            className="text-sm"
                            icon={<MapIcon className="h-4 w-4" />}
                          >
                            Maps
                          </MenuItem>
                        )}
                        
                        {/* Edit Project (admin only) */}
                        {isAdmin() && (
                          <MenuItem 
                            component={<Link to={`/dashboard/projects/${project.id}/edit`} onClick={handleCloseSidebar} />}
                            className="text-sm"
                            icon={<PencilIcon className="h-4 w-4" />}
                          >
                            Edit Project
                          </MenuItem>
                        )}
                      </SubMenu>
                    );
                  })
                )}
              </SubMenu>
              
              {/* Admin section - Check for user management permissions */}
              {(permissionManager.canManageUsers('global') || isRegionalCoordinator()) && (
                <SubMenu 
                  label="Administration" 
                  icon={<Cog6ToothIcon className="h-4 w-4" />}
                  className="text-sm"
                >
                  {(permissionManager.hasResourcePermission('users', 'read', 'global') || isRegionalCoordinator()) && (
                    <MenuItem 
                      component={<Link to="/dashboard/admin/users" onClick={handleCloseSidebar} />}
                      className="text-sm"
                      icon={<UsersIcon className="h-4 w-4" />}
                    >
                      User Management
                    </MenuItem>
                  )}
                  {isAdmin() && (
                    <MenuItem 
                      component={<Link to="/dashboard/admin/settings" onClick={handleCloseSidebar} />}
                      className="text-sm"
                      icon={<Cog6ToothIcon className="h-4 w-4" />}
                    >
                      System Settings
                    </MenuItem>
                  )}
                </SubMenu>
              )}
            </Menu>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Logged in as: {user.firstName} {user.lastName}</p>
              <p>Role: {user.roles?.[0]?.roleName || 'No role assigned'}</p>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  } catch (error) {
    console.error('Error rendering sidebar:', error);
    return (
      <div className="w-[270px] bg-gray-50 border-r border-gray-200 h-screen flex items-center justify-center">
        <div className="text-center text-sm text-red-500">
          <p>Error loading sidebar</p>
          <p className="text-xs mt-1">Please refresh the page</p>
        </div>
      </div>
    );
  }
}