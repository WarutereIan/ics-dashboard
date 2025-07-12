import React from 'react';
import { Home, Target, Activity, FileText, Flag, Folder, Users, Settings, Circle, CheckCircle2 } from 'lucide-react';
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
          
          {/* Outcome 1: Children's Rights & Empowerment */}
          <NavGroup 
            title="Outcome 1: Children's Rights & Empowerment" 
            defaultExpanded={false}
            href={`/project/${currentProject.id}/outcome/1`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="pl-4 space-y-2">
              <NavGroup title="Outputs" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.1`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.1: Children's knowledge on rights
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.2`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.2: Safe platforms engagement
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.3`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.3: Mentors trained
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.4`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.4: Children in life skills education
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.5`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.5: Clubs created/strengthened
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.6`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.6: Children in club activities
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.7`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.7: Learners sensitized on speak out boxes
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.8`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.8: Learners using reporting mechanisms
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/output/1.9`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.9: Incidents reported through speak out boxes
                </NavItem>
              </NavGroup>
              
              <NavGroup title="Activities" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/1/activity/1.1`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.1: Mentor Training
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/activity/1.2`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.2: Child Rights Clubs
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/activity/1.3`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.3: Reporting Mechanisms
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/activity/1.4`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.4: Child-Friendly Messages
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/activity/1.5`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.5: Children's Participation
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/1/activity/1.6`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  1.6: Media Campaigns
                </NavItem>
              </NavGroup>
            </div>
          </NavGroup>

          {/* Outcome 2: Parent-Teacher Collaboration */}
          <NavGroup 
            title="Outcome 2: Parent-Teacher Collaboration" 
            defaultExpanded={false}
            href={`/project/${currentProject.id}/outcome/2`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="pl-4 space-y-2">
              <NavGroup title="Outputs" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/2/output/2.1`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  2.1: Parents trained in skilful parenting
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/2/output/2.2`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  2.2: Parents with improved positive parenting knowledge
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/2/output/2.3`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  2.3: Parents participating in school activities
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/2/output/2.4`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  2.4: Collaborative initiatives launched
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/2/output/2.5`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  2.5: Community awareness sessions held
                </NavItem>
              </NavGroup>
              
              <NavGroup title="Activities" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/2/activity/2.1`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  2.1: Parenting Training
                </NavItem>
              </NavGroup>
            </div>
          </NavGroup>

          {/* Outcome 3: Community Leaders Engagement */}
          <NavGroup 
            title="Outcome 3: Community Leaders Engagement" 
            defaultExpanded={false}
            href={`/project/${currentProject.id}/outcome/3`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="pl-4 space-y-2">
              <NavGroup title="Outputs" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/3/output/3.1`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  3.1: Parents reporting positive influence from leaders
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/3/output/3.2`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  3.2: Community and religious leaders mapped
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/3/output/3.3`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  3.3: Leaders trained on child rights
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/3/output/3.4`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  3.4: Parents reached through community awareness
                </NavItem>
              </NavGroup>
              
              <NavGroup title="Activities" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/3/activity/3.1`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  3.1: Community Leaders Training
                </NavItem>
              </NavGroup>
            </div>
          </NavGroup>

          {/* Outcome 4: School Capacity & Resources */}
          <NavGroup 
            title="Outcome 4: School Capacity & Resources" 
            defaultExpanded={false}
            href={`/project/${currentProject.id}/outcome/4`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="pl-4 space-y-2">
              <NavGroup title="Outputs" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/4/output/4.1`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  4.1: Club patrons trained
                </NavItem>
                <NavItem href={`/project/${currentProject.id}/outcome/4/output/4.2`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  4.2: Teachers and staff trained on child protection
                </NavItem>
              </NavGroup>
              
              <NavGroup title="Activities" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/4/activity/4.1`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  4.1: School Capacity Building
                </NavItem>
              </NavGroup>
            </div>
          </NavGroup>

          {/* Outcome 5: Government & CSO Collaboration */}
          <NavGroup 
            title="Outcome 5: Government & CSO Collaboration" 
            defaultExpanded={false}
            href={`/project/${currentProject.id}/outcome/5`}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="pl-4 space-y-2">
              <NavGroup title="Outputs" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/5/output/5.1`} icon={<CheckCircle2 className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  5.1: Stakeholder review meetings conducted
                </NavItem>
              </NavGroup>
              
              <NavGroup title="Activities" defaultExpanded={false}>
                <NavItem href={`/project/${currentProject.id}/outcome/5/activity/5.1`} icon={<Activity className="w-3 h-3" />} onClick={() => setSidebarOpen(false)}>
                  5.1: Stakeholder Engagement
                </NavItem>
              </NavGroup>
            </div>
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