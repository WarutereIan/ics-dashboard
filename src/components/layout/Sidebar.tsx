import React from 'react';
import { Home, Target, Activity, FileText, Flag, Folder, Users, Settings } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { NavGroup } from './NavGroup';
import { NavItem } from './NavItem';
import { useDashboard } from '@/contexts/DashboardContext';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, currentProject, sidebarOpen, setSidebarOpen } = useDashboard();

  const SidebarContent = () => (
    <div className="p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">MEAL Dashboard</h2>
        <p className="text-sm text-muted-foreground">ICS Organization</p>
      </div>

      {user.role === 'global-admin' && (
        <>
          <NavGroup title="Dashboard">
            <NavItem href="/dashboard" icon={<Home />} onClick={() => setSidebarOpen(false)}>
              Global Overview
            </NavItem>
          </NavGroup>
          <NavGroup title="Countries">
            <NavItem href="/country/kenya" icon={<Flag />} onClick={() => setSidebarOpen(false)}>
              Kenya
            </NavItem>
            <NavItem href="/country/tanzania" icon={<Flag />} onClick={() => setSidebarOpen(false)}>
              Tanzania
            </NavItem>
          </NavGroup>
          <NavGroup title="Projects">
            <NavItem href="/project/mameb" icon={<Folder />} onClick={() => setSidebarOpen(false)}>
              MaMeb
            </NavItem>
            <NavItem href="/project/vacis" icon={<Folder />} onClick={() => setSidebarOpen(false)}>
              VACIS
            </NavItem>
          </NavGroup>
        </>
      )}

      {(user.role === 'project-admin' || user.role === 'branch-admin') && currentProject && (
        <>
          <NavGroup title="Dashboard">
            <NavItem href={`/project/${currentProject.id}`} icon={<Home />} onClick={() => setSidebarOpen(false)}>
              Project Overview
            </NavItem>
          </NavGroup>
          <NavGroup title="Outcomes">
            <NavItem href={`/project/${currentProject.id}/outcome/1`} icon={<Target />} onClick={() => setSidebarOpen(false)}>
              Children's Rights & Empowerment
            </NavItem>
            <NavItem href={`/project/${currentProject.id}/outcome/2`} icon={<Target />} onClick={() => setSidebarOpen(false)}>
              Parent-Teacher Collaboration
            </NavItem>
            <NavItem href={`/project/${currentProject.id}/outcome/3`} icon={<Target />} onClick={() => setSidebarOpen(false)}>
              Community Leaders Engagement
            </NavItem>
            <NavItem href={`/project/${currentProject.id}/outcome/4`} icon={<Target />} onClick={() => setSidebarOpen(false)}>
              School Capacity & Resources
            </NavItem>
            <NavItem href={`/project/${currentProject.id}/outcome/5`} icon={<Target />} onClick={() => setSidebarOpen(false)}>
              Government & CSO Collaboration
            </NavItem>
          </NavGroup>
          <NavGroup title="Activities">
            <NavItem href={`/project/${currentProject.id}/activity/1.1`} icon={<Activity />} onClick={() => setSidebarOpen(false)}>
              Mentor Training
            </NavItem>
            <NavItem href={`/project/${currentProject.id}/activity/1.2`} icon={<Activity />} onClick={() => setSidebarOpen(false)}>
              Child Rights Clubs
            </NavItem>
            <NavItem href={`/project/${currentProject.id}/activity/1.3`} icon={<Activity />} onClick={() => setSidebarOpen(false)}>
              Reporting Mechanisms
            </NavItem>
            <NavItem href={`/project/${currentProject.id}/activity/2.1`} icon={<Activity />} onClick={() => setSidebarOpen(false)}>
              Parenting Training
            </NavItem>
          </NavGroup>
          <NavGroup title="Reports">
            <NavItem href={`/project/${currentProject.id}/reports`} icon={<FileText />} onClick={() => setSidebarOpen(false)}>
              Project Reports
            </NavItem>
          </NavGroup>
        </>
      )}

      <NavGroup title="Administration">
        <NavItem href="/users" icon={<Users />} onClick={() => setSidebarOpen(false)}>
          Users
        </NavItem>
        <NavItem href="/settings" icon={<Settings />} onClick={() => setSidebarOpen(false)}>
          Settings
        </NavItem>
      </NavGroup>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex-1 bg-card border-r border-border overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full bg-card overflow-y-auto">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}