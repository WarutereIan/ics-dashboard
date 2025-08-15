import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  Calendar,
  User,
  Badge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Report } from '@/types/dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { useNavigate } from 'react-router-dom';

interface PendingReviewsProps {
  projectId?: string;
}

export function PendingReviews({ projectId }: PendingReviewsProps) {
  const { user } = useDashboard();
  const navigate = useNavigate();

  if (!user) return null;

  // Mock data for now - will be replaced with actual context data
  const pendingReviews: Report[] = [];
  const submittedPendingReview: Report[] = [];

  const getAuthLevelDisplayName = (level: string): string => {
    const displayNames: Record<string, string> = {
      'branch-admin': 'Branch Administrator',
      'project-admin': 'Project Administrator', 
      'country-admin': 'Country Administrator',
      'global-admin': 'Global Administrator'
    };
    return displayNames[level] || level;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      'quarterly': 'bg-purple-100 text-purple-800',
      'annual': 'bg-indigo-100 text-indigo-800',
      'monthly': 'bg-green-100 text-green-800',
      'adhoc': 'bg-gray-100 text-gray-800'
    };
    return variants[category as keyof typeof variants] || variants.adhoc;
  };

  const handleViewReport = (report: Report) => {
    // Mock navigation for now
    console.log('Navigate to report:', report.id);
  };

  if (pendingReviews.length === 0 && submittedPendingReview.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Pending Reviews</h3>
          <p className="text-muted-foreground">
            You have no reports pending your review or approval.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Reviews for User */}
      {pendingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pending Your Review ({pendingReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReviews.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <BadgeComponent className={getCategoryBadge(report.category)}>
                            {report.category}
                          </BadgeComponent>
                          <BadgeComponent className={getStatusBadge(report.approvalWorkflow.status)}>
                            {report.approvalWorkflow.status}
                          </BadgeComponent>
                          <BadgeComponent className="bg-blue-100 text-blue-800">
                            {getAuthLevelDisplayName(report.currentAuthLevel)}
                          </BadgeComponent>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleViewReport(report)}
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Submitted by: {report.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Uploaded: {new Date(report.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Step {report.approvalWorkflow.currentStep} of {report.approvalWorkflow.totalSteps}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>
                        {report.approvalWorkflow.steps.reduce((total: number, step: any) => total + step.comments.length, 0)} comments
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Submitted by User Pending Review */}
      {submittedPendingReview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Your Submitted Reports Pending Review ({submittedPendingReview.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submittedPendingReview.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <BadgeComponent className={getCategoryBadge(report.category)}>
                            {report.category}
                          </BadgeComponent>
                          <BadgeComponent className={getStatusBadge(report.approvalWorkflow.status)}>
                            {report.approvalWorkflow.status}
                          </BadgeComponent>
                          <BadgeComponent className="bg-orange-100 text-orange-800">
                            Pending {getAuthLevelDisplayName(report.currentAuthLevel)}
                          </BadgeComponent>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleViewReport(report)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Submitted: {new Date(report.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Step {report.approvalWorkflow.currentStep} of {report.approvalWorkflow.totalSteps}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Current reviewer: {report.currentReviewerId || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>
                        {report.approvalWorkflow.steps.reduce((total: number, step: any) => total + step.comments.length, 0)} comments
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Your Review</p>
                <p className="text-2xl font-bold">{pendingReviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Your Reports Pending</p>
                <p className="text-2xl font-bold">{submittedPendingReview.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{pendingReviews.length + submittedPendingReview.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
