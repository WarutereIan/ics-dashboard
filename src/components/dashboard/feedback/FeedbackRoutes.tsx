import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FeedbackSubmissionInterface } from './FeedbackSubmissionInterface';
import { FeedbackFormManagement } from './FeedbackFormManagement';
import { FeedbackSubmissionsView } from './FeedbackSubmissionsView';
import { FeedbackAnalytics } from './FeedbackAnalytics';

interface FeedbackRoutesProps {
  projectId: string;
  projectName?: string;
}

export function FeedbackRoutes({ projectId, projectName = "ICS Organization" }: FeedbackRoutesProps) {
  return (
    <Routes>
      <Route index element={<Navigate to="submit" replace />} />
      <Route 
        path="submit" 
        element={
          <FeedbackSubmissionInterface 
            projectId={projectId} 
            projectName={projectName} 
          />
        } 
      />
      <Route 
        path="forms" 
        element={
          <FeedbackFormManagement 
            projectId={projectId} 
            projectName={projectName} 
          />
        } 
      />
      <Route 
        path="submissions" 
        element={
          <FeedbackSubmissionsView 
            projectId={projectId} 
            projectName={projectName} 
          />
        } 
      />
      <Route 
        path="analytics" 
        element={
          <FeedbackAnalytics 
            projectId={projectId} 
            projectName={projectName} 
          />
        } 
      />
    </Routes>
  );
}
