import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* General authenticated routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<GlobalOverview />} />
              <Route path="/dashboard/projects/:projectId" element={<ProjectOverview />} />
              <Route path="/dashboard/projects/:projectId/kpi" element={<KPIAnalytics />} />
              <Route path="/dashboard/projects/:projectId/outcomes" element={<OutcomesDetails />} />
              <Route path="/dashboard/projects/:projectId/outputs" element={<OutputsDetails />} />
              <Route path="/dashboard/projects/:projectId/activities" element={<Activities />} />
              <Route path="/dashboard/projects/:projectId/subactivities" element={<Subactivities />} />
              <Route path="/dashboard/projects/:projectId/reports" element={<Reports />} />
              <Route path="/dashboard/projects/:projectId/maps" element={<Maps />} />
              <Route path="/dashboard/projects/:projectId/media" element={<Media />} />
              {/* Admin-only routes */}
              <Route path="/dashboard/projects/:projectId/users" element={<ProtectedRoute roles={['global-admin', 'country-admin', 'project-admin']} />}> 
                <Route index element={<UserManagement />} />
              </Route>
              <Route path="/dashboard/projects/:projectId/settings" element={<ProtectedRoute roles={['global-admin', 'country-admin', 'project-admin']} />}> 
                <Route index element={<Settings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </DashboardProvider>
    </Router>
  );
}

export default App;