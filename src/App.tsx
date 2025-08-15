import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { FormProvider } from '@/contexts/FormContext';
import { ReportProvider } from '@/contexts/ReportContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlobalOverview } from '@/components/dashboard/GlobalOverview';
import { ProjectOverview } from '@/components/dashboard/ProjectOverview';
import { KPIAnalytics } from '@/components/dashboard/KPIAnalytics';
import Login from '@/components/auth/Login';
import { OutcomesDetails } from '@/components/dashboard/OutcomesDetails';
import { OutputsDetails } from '@/components/dashboard/OutputsDetails';
import { Reports } from '@/components/dashboard/Reports';
import { Maps } from '@/components/dashboard/Maps';
import { Media } from '@/components/dashboard/Media';
import { UserManagement } from '@/components/dashboard/UserManagement';
import { Settings } from '@/components/dashboard/Settings';
import { Activities } from '@/components/dashboard/Activities';
import { Subactivities } from '@/components/dashboard/Subactivities';
import { ProjectCreationWizard } from '@/components/dashboard/ProjectCreationWizard';
import { FormRoutes } from '@/components/dashboard/FormRoutes';
import { GoalDetails } from '@/components/dashboard/GoalDetails';
import { PublicFormFiller } from '@/components/public/PublicFormFiller';
import { PublicLanding } from '@/components/public/PublicLanding';
// New all-outcomes and all-outputs pages will be created as OutcomesDetails and OutputsDetails

function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { user } = useDashboard();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <Router>
      <DashboardProvider>
        <FormProvider>
          <ReportProvider>
            <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PublicLanding />} />
        
        {/* Public form filling routes */}
        <Route path="/fill/:formId" element={<PublicFormFiller />} />
        <Route path="/embed/:formId" element={<PublicFormFiller isEmbedded={true} />} />
        
        {/* General authenticated routes */}
        <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<GlobalOverview />} />
              {/* Organizational Goals routes */}
              <Route path="/dashboard/goals/:goalId" element={<GoalDetails />} />
              <Route path="/dashboard/goals/:goalId/subgoals/:subGoalId" element={<GoalDetails />} />
              {/* Admin-only project creation */}
              <Route path="/dashboard/projects/create" element={<ProtectedRoute roles={['global-admin', 'country-admin', 'project-admin']} />}>
                <Route index element={<ProjectCreationWizard />} />
              </Route>
              <Route path="/dashboard/projects/:projectId/edit" element={<ProtectedRoute roles={['global-admin', 'country-admin', 'project-admin']} />}>
                <Route index element={<ProjectCreationWizard />} />
              </Route>
              <Route path="/dashboard/projects/:projectId" element={<ProjectOverview />} />
              <Route path="/dashboard/projects/:projectId/kpi" element={<KPIAnalytics />} />
              <Route path="/dashboard/projects/:projectId/outcomes" element={<OutcomesDetails />} />
              <Route path="/dashboard/projects/:projectId/outputs" element={<OutputsDetails />} />
              <Route path="/dashboard/projects/:projectId/activities" element={<Activities />} />
              <Route path="/dashboard/projects/:projectId/subactivities" element={<Subactivities />} />
              <Route path="/dashboard/projects/:projectId/reports" element={<Reports />} />
              <Route path="/dashboard/projects/:projectId/maps" element={<Maps />} />
              <Route path="/dashboard/projects/:projectId/media" element={<Media />} />
              {/* Project Forms - nested routing */}
              <Route path="/dashboard/projects/:projectId/forms/*" element={<FormRoutes />} />
              {/* Admin-only routes */}
              <Route path="/dashboard/admin/users" element={<ProtectedRoute roles={['global-admin']} />}> 
                <Route index element={<UserManagement />} />
              </Route>
              <Route path="/dashboard/admin/settings" element={<ProtectedRoute roles={['global-admin']} />}> 
                <Route index element={<Settings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
          </ReportProvider>
        </FormProvider>
      </DashboardProvider>
    </Router>
  );
}

export default App;