import React from 'react';
import { FeedbackResolutionDashboard } from './FeedbackResolutionDashboard';

interface FeedbackAnalyticsProps {
  projectId: string;
  projectName?: string;
}

export function FeedbackAnalytics({ projectId, projectName = "ICS Organization" }: FeedbackAnalyticsProps) {
  return <FeedbackResolutionDashboard projectId={projectId} />;
}
