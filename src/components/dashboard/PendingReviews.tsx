import React from 'react';
import { ClockIcon, ExclamationTriangleIcon, DocumentTextIcon, EyeIcon, CheckCircleIcon, XCircleIcon, ChatBubbleLeftIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { Badge } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Report } from '@/types/dashboard';
import { reportWorkflowService } from '@/services/reportWorkflowService';
import { reportService } from '@/services/reportService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ReportWorkflowDetail } from './ReportWorkflowDetail';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PendingReviewsProps {
  projectId?: string;
}

export function PendingReviews({ projectId }: PendingReviewsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) return null;

  const [pendingReviews, setPendingReviews] = React.useState<any[]>([]);
  const [submittedPendingReview, setSubmittedPendingReview] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [openDetailId, setOpenDetailId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pending, mine] = await Promise.all([
          reportWorkflowService.getPendingReviews(projectId),
          reportWorkflowService.getMyReports(projectId, 'PENDING'),
        ]);
        console.log('pending', pending);
        console.log('mine', mine);
        const pendingNormalized = (pending.reports || []).map((r: any) => ({ ...r, workflowStatus: r.status }));
        const mineNormalized = (mine.reports || []).map((r: any) => ({ ...r, workflowStatus: r.status }));
        setPendingReviews(pendingNormalized);
        setSubmittedPendingReview(mineNormalized);
      } catch (e) {
        console.error('Failed to load workflow lists:', e);
        setPendingReviews([]);
        setSubmittedPendingReview([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

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
      'in-progress': 'bg-emerald-100 text-emerald-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-emerald-100 text-emerald-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      'quarterly': 'bg-emerald-100 text-purple-800',
      'annual': 'bg-indigo-100 text-indigo-800',
      'monthly': 'bg-green-100 text-green-800',
      'adhoc': 'bg-gray-100 text-gray-800'
    };
    return variants[category as keyof typeof variants] || variants.adhoc;
  };

  const handleViewReport = async (report: any) => {
    try {
      if (!projectId) throw new Error('Missing projectId');
      await reportService.downloadReportFile(projectId, report.id);
    } catch (e: any) {
      toast({ title: 'Download Failed', description: e?.message || 'Unable to download report', variant: 'destructive' });
    }
  };

  const handleOpenReview = (report: any) => {
    setOpenDetailId(report.id);
  };

  const handleReview = async (reportId: string, action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES') => {
    try {
      await reportWorkflowService.review(reportId, action);
      toast({ title: 'Success', description: `Review submitted: ${action}` });
      // Refresh lists
      const [pending, mine] = await Promise.all([
        reportWorkflowService.getPendingReviews(projectId),
        reportWorkflowService.getMyReports(projectId, 'PENDING'),
      ]);
      setPendingReviews(pending.reports || []);
      setSubmittedPendingReview(mine.reports || []);
    } catch (e: any) {
      toast({ title: 'Review Failed', description: e?.message || 'Unable to submit review', variant: 'destructive' });
    }
  };

  if (!loading && pendingReviews.length === 0 && submittedPendingReview.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
      <Dialog open={!!openDetailId} onOpenChange={(o) => !o && setOpenDetailId(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="sr-only" id="report-dialog-title">Report Review</div>
          <div className="sr-only" id="report-dialog-desc">Review report details and take action</div>
          {openDetailId && (
            <ReportWorkflowDetail 
              reportId={openDetailId} 
              onClose={() => setOpenDetailId(null)}
              onChanged={async () => {
                // Reload both pending reviews and submitted reports
                try {
                  const [pending, mine] = await Promise.all([
                    reportWorkflowService.getPendingReviews(projectId),
                    reportWorkflowService.getMyReports(projectId, 'PENDING'),
                  ]);
                  const pendingNormalized = (pending.reports || []).map((r: any) => ({ ...r, workflowStatus: r.status }));
                  const mineNormalized = (mine.reports || []).map((r: any) => ({ ...r, workflowStatus: r.status }));
                  setPendingReviews(pendingNormalized);
                  setSubmittedPendingReview(mineNormalized);
                } catch (e) {
                  console.error('Failed to reload reports after status change:', e);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Pending Reviews for User */}
      {pendingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
              Pending Your Review ({pendingReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReviews.map((report) => {
                const status = (report.status || report.workflowStatus || '').toString().toLowerCase();
                const category = (report.category || '').toString().toLowerCase();
                const steps = Array.isArray(report.approvalSteps) ? report.approvalSteps : [];
                const totalSteps = steps.length || 1;
                const currentStepIndex = steps.findIndex((s: any) => !s.isCompleted);
                const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : totalSteps;
                return (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <DocumentTextIcon className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">{report.name || 'Report'}</h4>
                        <p className="text-sm text-muted-foreground">{report.description || ''}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <BadgeComponent className={getCategoryBadge(category)}>
                            {category || 'adhoc'}
                          </BadgeComponent>
                          <BadgeComponent className={getStatusBadge(status)}>
                            {status || 'pending'}
                          </BadgeComponent>
                          <BadgeComponent className="bg-emerald-100 text-emerald-800">
                            Pending Step {currentStep}
                          </BadgeComponent>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleViewReport(report)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        onClick={() => handleOpenReview(report)}
                        size="sm"
                        className="gap-2"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Review
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Submitted: {report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>Step {currentStep} of {totalSteps}</span>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Submitted by User Pending Review */}
      {submittedPendingReview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-500" />
              Your Submitted Reports Pending Review ({submittedPendingReview.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submittedPendingReview.map((report) => {
                const status = (report.status || report.workflowStatus || '').toString().toLowerCase();
                const category = (report.category || '').toString().toLowerCase();
                const steps = Array.isArray(report.approvalSteps) ? report.approvalSteps : [];
                const totalSteps = steps.length || 1;
                const currentStepIndex = steps.findIndex((s: any) => !s.isCompleted);
                const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : totalSteps;
                return (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <DocumentTextIcon className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">{report.name || 'Report'}</h4>
                        <p className="text-sm text-muted-foreground">{report.description || ''}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <BadgeComponent className={getCategoryBadge(category)}>
                            {category || 'adhoc'}
                          </BadgeComponent>
                          <BadgeComponent className={getStatusBadge(status)}>
                            {status || 'pending'}
                          </BadgeComponent>
                          <BadgeComponent className="bg-lime-100 text-orange-800">
                            Pending Step {currentStep}
                          </BadgeComponent>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleViewReport(report)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        onClick={() => handleOpenReview(report)}
                        size="sm"
                        className="gap-2"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Review
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Submitted: {report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>Step {currentStep} of {totalSteps}</span>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
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
              <ClockIcon className="h-5 w-5 text-blue-500" />
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
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
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
