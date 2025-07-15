import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Target, Activity, Users, Settings, Folder, Circle, CheckCircle2, Flag, FileText } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  getAllProjects,
  getProjectOutcomes,
  getProjectOutputs,
  getProjectActivities,
  getProjectSubActivities,
} from '@/lib/icsData';

export function ProSidebar() {
  const { user } = useDashboard();
  const location = useLocation();
  const projects = getAllProjects(user).filter(project => {
    // Only include projects with data stores (i.e., outcomes available)
    try {
      return getProjectOutcomes(user, project.id).length > 0;
    } catch {
      return false;
    }
  });

  return (
    <Sidebar width="270px" backgroundColor="rgb(249,249,249,0.7)">
      {/* Organization Logo/Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 12px 0' }}>
        <img
          src="/logo.png"
          alt="Organization Logo"
          style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 8 }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>IDMS Dashboard</span>
      </div>
      <Menu>
        <MenuItem icon={<Target />} component={<Link to="/dashboard" />}>Organization Goals</MenuItem>
        <SubMenu label="Projects" icon={<Folder />}>
          {projects.map(project => (
            <SubMenu key={project.id} label={project.name.toUpperCase()}>
              <MenuItem component={<Link to={`/dashboard/projects/${project.id}/kpi`} />}>KPI Analytics</MenuItem>
              {/* Outcomes */}
              {getProjectOutcomes(user, project.id).length > 0 && (
                <MenuItem component={<Link to={`/dashboard/projects/${project.id}/outcomes`} />}>Outcomes</MenuItem>
              )}
              {/* Outputs (conditional) */}
              {getProjectOutputs(user, project.id).length > 0 && (
                <MenuItem component={<Link to={`/dashboard/projects/${project.id}/outputs`} />}>Outputs</MenuItem>
              )}
              {/* Activities (always shown) */}
              <MenuItem component={<Link to={`/dashboard/projects/${project.id}/activities`} />}>Activities</MenuItem>
              {/* Subactivities (conditional) */}
              {getProjectSubActivities(user, project.id).length > 0 && (
                <MenuItem component={<Link to={`/dashboard/projects/${project.id}/subactivities`} />}>Subactivities</MenuItem>
              )}
              <MenuItem component={<Link to={`/dashboard/projects/${project.id}/reports`} />}>Reports</MenuItem>
              <MenuItem component={<Link to={`/dashboard/projects/${project.id}/maps`} />}>Maps</MenuItem>
              <MenuItem component={<Link to={`/dashboard/projects/${project.id}/media`} />}>Media</MenuItem>
            </SubMenu>
          ))}
        </SubMenu>
        {/* Admin section, if user is admin */}
        {user?.role?.includes('admin') && (
          <SubMenu label="Administration" icon={<Settings />}>
            <MenuItem component={<Link to="/dashboard/admin/users" />}>User Management</MenuItem>
            <MenuItem component={<Link to="/dashboard/admin/settings" />}>Settings</MenuItem>
          </SubMenu>
        )}
      </Menu>
    </Sidebar>
  );
} 