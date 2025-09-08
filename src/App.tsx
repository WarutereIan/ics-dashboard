import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { FormProvider } from '@/contexts/FormContext';
import { ReportProvider } from '@/contexts/ReportContext';
import { ProjectsProvider } from '@/contexts/ProjectsContext';
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
import Financial from '@/components/dashboard/Financial';
import { UserManagement } from '@/components/dashboard/UserManagement';
import { Settings } from '@/components/dashboard/Settings';
import { Activities } from '@/components/dashboard/Activities';
import { Subactivities } from '@/components/dashboard/Subactivities';
import { ProjectCreationWizard } from '@/components/dashboard/ProjectCreationWizard';
import { FormRoutes } from '@/components/dashboard/FormRoutes';
import { GoalDetails } from '@/components/dashboard/GoalDetails';
import { PublicFormFiller } from '@/components/public/PublicFormFiller';
import { PublicLanding } from '@/components/public/PublicLanding';
import { ProjectsApiTest } from '@/components/dashboard/ProjectsApiTest';
import { FeedbackRoutes } from '@/components/dashboard/feedback/FeedbackRoutes';
import { FeedbackSubmissionInterface } from '@/components/dashboard/feedback/FeedbackSubmissionInterface';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
// New all-outcomes and all-outputs pages will be created as OutcomesDetails and OutputsDetails

function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && user?.roles) {
    const userRoles = user.roles.map(r => r.roleName);
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <Outlet />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes - no context providers that require auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          
          {/* Public form filling routes - need FormProvider for form functionality */}
          <Route path="/fill/:formId" element={
            <FormProvider>
              <PublicFormFiller />
            </FormProvider>
          } />
          <Route path="/embed/:formId" element={
            <FormProvider>
              <PublicFormFiller isEmbedded={true} />
            </FormProvider>
          } />
          
          {/* Public feedback submission route */}
          <Route path="/feedback/submit" element={
            <FeedbackProvider projectId="organization">
              <FeedbackSubmissionInterface 
                projectId="organization" 
                projectName="ICS Organization" 
              />
            </FeedbackProvider>
          } />
          
          {/* Authenticated routes - wrapped in dashboard context providers */}
          <Route path="/dashboard/*" element={
            <DashboardProvider>
              <ProjectsProvider>
                <FormProvider>
                  <ReportProvider>
                    <Routes>
                      <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                          <Route index element={<GlobalOverview />} />
                          <Route path="api-test" element={<ProjectsApiTest />} />
                          {/* Organizational Goals routes */}
                          <Route path="goals/:goalId" element={<GoalDetails />} />
                          <Route path="goals/:goalId/subgoals/:subGoalId" element={<GoalDetails />} />
                          {/* Organization routes */}
                          <Route path="feedback/*" element={<FeedbackRoutes projectId="organization" projectName="ICS Organization" />} />
                          {/* Admin-only project creation */}
                          <Route path="projects/create" element={<ProtectedRoute roles={['global-admin', 'country-admin', 'project-admin']} />}>
                            <Route index element={<ProjectCreationWizard />} />
                          </Route>
                          <Route path="projects/:projectId/edit" element={<ProtectedRoute roles={['global-admin', 'country-admin', 'project-admin']} />}>
                            <Route index element={<ProjectCreationWizard />} />
                          </Route>
                          <Route path="projects/:projectId" element={<ProjectOverview />} />
                          <Route path="projects/:projectId/kpi" element={<KPIAnalytics />} />
                          <Route path="projects/:projectId/outcomes" element={<OutcomesDetails />} />
                          <Route path="projects/:projectId/outputs" element={<OutputsDetails />} />
                          <Route path="projects/:projectId/activities" element={<Activities />} />
                          <Route path="projects/:projectId/subactivities" element={<Subactivities />} />
                          <Route path="projects/:projectId/reports" element={<Reports />} />
                          <Route path="projects/:projectId/maps" element={<Maps />} />
                          <Route path="projects/:projectId/financial" element={<Financial />} />
                          <Route path="projects/:projectId/media" element={<Media />} />
                          {/* Project Forms - nested routing */}
                          <Route path="projects/:projectId/forms/*" element={<FormRoutes />} />
                          {/* Admin-only routes */}
                          <Route path="admin/users" element={<ProtectedRoute roles={['global-admin']} />}> 
                            <Route index element={<UserManagement />} />
                          </Route>
                          <Route path="admin/settings" element={<ProtectedRoute roles={['global-admin']} />}> 
                            <Route index element={<Settings />} />
                          </Route>
                        </Route>
                      </Route>
                    </Routes>
                  </ReportProvider>
                </FormProvider>
              </ProjectsProvider>
            </DashboardProvider>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;