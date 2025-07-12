import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlobalOverview } from '@/components/dashboard/GlobalOverview';
import { ProjectOverview } from '@/components/dashboard/ProjectOverview';
import { OutcomeDetail } from '@/components/dashboard/OutcomeDetail';

function App() {
  return (
    <DashboardProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<GlobalOverview />} />
            <Route path="/project/:projectId" element={<ProjectOverview />} />
            <Route path="/project/:projectId/outcome/:outcomeId" element={<OutcomeDetail />} />
            <Route path="/project/:projectId/outcome/:outcomeId" element={<OutcomeDetail />} />
            <Route path="/project/:projectId/activity/:activityId" element={<div>Activity Detail View</div>} />
            <Route path="/project/:projectId/reports" element={<div>Reports View</div>} />
            <Route path="/country/:countryId" element={<div>Country View</div>} />
            <Route path="/users" element={<div>Users Management</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </Router>
    </DashboardProvider>
  );
}

export default App;