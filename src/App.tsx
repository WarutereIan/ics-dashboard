import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from '@/contexts/DashboardContext';
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
// New all-outcomes and all-outputs pages will be created as OutcomesDetails and OutputsDetails

function App() {
  return (
    <Router>
      <DashboardProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<GlobalOverview />} />
            <Route path="/dashboard/projects/:projectId" element={<ProjectOverview />} />
            <Route path="/dashboard/projects/:projectId/kpi" element={<KPIAnalytics />} />
            <Route path="/dashboard/projects/:projectId/outcomes" element={<OutcomesDetails />} />
            <Route path="/dashboard/projects/:projectId/outputs" element={<OutputsDetails />} />
           
            <Route path="/dashboard/projects/:projectId/reports" element={<Reports />} />
            <Route path="/dashboard/projects/:projectId/maps" element={<Maps />} />
            <Route path="/dashboard/projects/:projectId/media" element={<Media />} />
            <Route path="/dashboard/admin/users" element={<UserManagement />} /> {/* Global admin only */}
            <Route path="/country/:countryId" element={<div>Country View</div>} />
            <Route path="/dashboard/admin/settings" element={<Settings />} />
          </Route>
        </Routes>
      </DashboardProvider>
    </Router>
  );
}

export default App;