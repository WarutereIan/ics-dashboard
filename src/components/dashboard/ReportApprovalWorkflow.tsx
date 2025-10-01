import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ChatBubbleLeftIcon, UserIcon, ExclamationTriangleIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { SkipForward, BadgeCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Report, 
  ReportApprovalWorkflow, 
  ReportApprovalStep, 
  ReportComment 
} from '@/types/dashboard';
import { 
  getCurrentStep, 
  getAuthLevelDisplayName, 
  canSkipStep,
  canUserApproveAtLevel 
} from '@/lib/reportWorkflowUtils';
import { useReport } from '@/contexts/ReportContext';
import { useAuth } from '@/contexts/AuthContext';

interface ReportApprovalWorkflowProps {
  report: Report;
}

export function ReportApprovalWorkflowComponent({ report }: ReportApprovalWorkflowProps) {
  const { user } = useAuth();
  const { 
    approveReportStep, 
    rejectReportStep, 
    addCommentToReportStep, 
    skipReportStep 
  } = useReport();
  
  const [comment, setComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [skipReason, setSkipReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string>('');

  if (!user) return null;

  const currentStep = getCurrentStep(report.approvalWorkflow);
  const canUserReview = currentStep && 
    currentStep.assignedUserId === user.id && 
    currentStep.status === 'in-review' &&
    canUserApproveAtLevel(user, currentStep.requiredRole);

  const getStepStatusIcon = (step: ReportApprovalStep) => {
    switch (step.status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'skipped':
        return <SkipForward className="h-5 w-5 text-orange-500" />;
      case 'in-review':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepStatusBadge = (step: ReportApprovalStep) => {
    const variants: Record<string, string> = {
      'pending': 'bg-gray-100 text-gray-800',
      'in-review': 'bg-emerald-100 text-emerald-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-emerald-100 text-emerald-800',
      'skipped': 'bg-lime-100 text-orange-800'
    };
    return variants[step.status] || variants.pending;
  };

  const handleApprove = () => {
    if (currentStep) {
      approveReportStep(report.id, currentStep.id, user.id, `${user.firstName} ${user.lastName}`, comment);
      setComment('');
    }
  };

  const handleReject = () => {
    if (currentStep && rejectionReason.trim()) {
      rejectReportStep(report.id, currentStep.id, user.id, `${user.firstName} ${user.lastName}`, rejectionReason);
      setRejectionReason('');
      setShowRejectDialog(false);
    }
  };

  const handleSkip = () => {
    if (currentStep && skipReason.trim()) {
      skipReportStep(report.id, currentStep.id, user.id, `${user.firstName} ${user.lastName}`, skipReason);
      setSkipReason('');
      setShowSkipDialog(false);
    }
  };

  const handleAddComment = (stepId: string) => {
    if (comment.trim()) {
      addCommentToReportStep(report.id, stepId, user.id, `${user.firstName} ${user.lastName}`, user.roles[0]?.roleName || 'user', comment);
      setComment('');
      setShowCommentDialog(false);
    }
  };

  const canSkipCurrentStep = currentStep && canSkipStep(user, currentStep.requiredRole);

  return (
    <div className="space-y-6">
      {/* Workflow Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5" />
            Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <p className="font-medium">
                {report.approvalWorkflow.status === 'approved' ? 'Fully Approved' :
                 report.approvalWorkflow.status === 'rejected' ? 'Rejected' :
                 `Pending ${getAuthLevelDisplayName(report.currentAuthLevel)} Review`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="font-medium">
                Step {report.approvalWorkflow.currentStep} of {report.approvalWorkflow.totalSteps}
              </p>
            </div>
          </div>

          {/* Current Step Actions */}
          {canUserReview && (
            <div className="bg-emerald-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <ExclamationTriangleIcon className="h-4 w-4 text-emerald-600" />
                <h4 className="font-medium text-emerald-900">Action Required</h4>
              </div>
              <p className="text-sm text-emerald-800 mb-3">
                This report requires your review and approval as {getAuthLevelDisplayName(currentStep.requiredRole)}.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Report</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Reason for Rejection</label>
                        <Textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Please provide a reason for rejecting this report..."
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject}>
                          Reject Report
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {canSkipCurrentStep && (
                  <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <SkipForward className="h-4 w-4 mr-2" />
                        Skip
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Skip Approval Step</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Reason for Skipping</label>
                          <Textarea
                            value={skipReason}
                            onChange={(e) => setSkipReason(e.target.value)}
                            placeholder="Please provide a reason for skipping this approval step..."
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowSkipDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSkip}>
                            Skip Step
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Comment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Comment</label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add your comment..."
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleAddComment(currentStep.id)}>
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {/* Approval Steps */}
          <div className="space-y-4">
            {report.approvalWorkflow.steps.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStepStatusIcon(step)}
                    <div>
                      <h4 className="font-medium">
                        Step {step.stepNumber}: {getAuthLevelDisplayName(step.requiredRole)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.assignedUserName || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStepStatusBadge(step)}>
                    {step.status}
                  </Badge>
                </div>

                {/* Step Details */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium">{step.status}</span>
                  </div>
                  {step.submittedAt && (
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="ml-2">
                        {new Date(step.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {step.reviewedAt && (
                    <div>
                      <span className="text-muted-foreground">Reviewed:</span>
                      <span className="ml-2">
                        {new Date(step.reviewedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Comments */}
                {step.comments.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <ChatBubbleLeftIcon className="h-4 w-4" />
                      Comments ({step.comments.length})
                    </h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {step.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <Badge variant="outline" className="text-xs">
                                {getAuthLevelDisplayName(comment.userRole)}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
                          {comment.type !== 'comment' && (
                            <Badge 
                              variant={comment.type === 'approval' ? 'default' : 'destructive'}
                              className="mt-1 text-xs"
                            >
                              {comment.type}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Comment Button */}
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveStepId(step.id);
                      setShowCommentDialog(true);
                    }}
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Summary */}
          {report.approvalWorkflow.status === 'approved' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Workflow Completed</h4>
              </div>
              <p className="text-sm text-green-800 mt-1">
                This report has been fully approved and is ready for use.
              </p>
              {report.approvalWorkflow.finalApprovalDate && (
                <p className="text-xs text-green-700 mt-2">
                  Final approval: {new Date(report.approvalWorkflow.finalApprovalDate).toLocaleDateString()} 
                  by {report.approvalWorkflow.finalApprovedBy}
                </p>
              )}
            </div>
          )}

          {report.approvalWorkflow.status === 'rejected' && (
            <div className="mt-6 bg-emerald-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium text-red-900">Workflow Rejected</h4>
              </div>
              <p className="text-sm text-emerald-800 mt-1">
                This report has been rejected and requires resubmission.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Default export for easier importing
export default ReportApprovalWorkflowComponent;
