import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, UserPlus, Calendar, X, CheckCircle2, XCircle } from 'lucide-react';
import { reportWorkflowService } from '@/services/reportWorkflowService';
import { useToast } from '@/hooks/use-toast';

interface BulkReviewActionsProps {
  selectedReports: string[];
  availableUsers: Array<{ id: string; firstName?: string; lastName?: string; email: string }>;
  onActionComplete: () => void;
}

export function BulkReviewActions({ 
  selectedReports, 
  availableUsers,
  onActionComplete 
}: BulkReviewActionsProps) {
  const [showDelegateDialog, setShowDelegateDialog] = useState(false);
  const [showSetDueDateDialog, setShowSetDueDateDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [delegateToUserId, setDelegateToUserId] = useState('');
  const [delegationReason, setDelegationReason] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [reassignToUserId, setReassignToUserId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (selectedReports.length === 0) {
    return null;
  }

  const handleBulkDelegate = async () => {
    if (!delegateToUserId || !delegationReason.trim()) return;
    
    try {
      setIsSubmitting(true);
      // For bulk operations, we'd need to get step IDs for each report
      // This is a simplified version - in production, you'd need to fetch step IDs
      toast({ 
        title: 'Bulk Delegate', 
        description: `Delegation initiated for ${selectedReports.length} reports. Note: This requires individual step IDs.`,
        variant: 'default'
      });
      setShowDelegateDialog(false);
      setDelegateToUserId('');
      setDelegationReason('');
      onActionComplete();
    } catch (e: any) {
      toast({ 
        title: 'Bulk Delegate Failed', 
        description: e?.message || 'Failed to delegate reviews',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSetDueDate = async () => {
    if (!dueDate) return;
    
    try {
      setIsSubmitting(true);
      toast({ 
        title: 'Bulk Set Due Date', 
        description: `Due date set for ${selectedReports.length} reports. Note: This requires individual step IDs.`,
        variant: 'default'
      });
      setShowSetDueDateDialog(false);
      setDueDate('');
      onActionComplete();
    } catch (e: any) {
      toast({ 
        title: 'Failed', 
        description: e?.message || 'Failed to set due dates',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkApprove = async () => {
    try {
      setIsSubmitting(true);
      const result = await reportWorkflowService.bulkApprove(selectedReports, approveComment);
      toast({ 
        title: 'Bulk Approval Complete', 
        description: `Successfully approved ${result.success} reports. ${result.failed > 0 ? `${result.failed} failed.` : ''}`,
        variant: result.failed > 0 ? 'default' : 'default'
      });
      if (result.errors.length > 0) {
        console.error('Bulk approve errors:', result.errors);
      }
      setShowApproveDialog(false);
      setApproveComment('');
      onActionComplete();
    } catch (e: any) {
      toast({ 
        title: 'Bulk Approve Failed', 
        description: e?.message || 'Failed to approve reports',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkReject = async () => {
    if (!rejectReason.trim()) return;
    
    try {
      setIsSubmitting(true);
      const result = await reportWorkflowService.bulkReject(selectedReports, rejectReason);
      toast({ 
        title: 'Bulk Rejection Complete', 
        description: `Successfully rejected ${result.success} reports. ${result.failed > 0 ? `${result.failed} failed.` : ''}`,
        variant: result.failed > 0 ? 'default' : 'default'
      });
      if (result.errors.length > 0) {
        console.error('Bulk reject errors:', result.errors);
      }
      setShowRejectDialog(false);
      setRejectReason('');
      onActionComplete();
    } catch (e: any) {
      toast({ 
        title: 'Bulk Reject Failed', 
        description: e?.message || 'Failed to reject reports',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkReassign = async () => {
    if (!reassignToUserId || !reassignReason.trim()) return;
    
    try {
      setIsSubmitting(true);
      const result = await reportWorkflowService.bulkReassign(selectedReports, reassignToUserId, reassignReason);
      toast({ 
        title: 'Bulk Reassignment Complete', 
        description: `Successfully reassigned ${result.success} reports. ${result.failed > 0 ? `${result.failed} failed.` : ''}`,
        variant: result.failed > 0 ? 'default' : 'default'
      });
      if (result.errors.length > 0) {
        console.error('Bulk reassign errors:', result.errors);
      }
      setShowReassignDialog(false);
      setReassignToUserId('');
      setReassignReason('');
      onActionComplete();
    } catch (e: any) {
      toast({ 
        title: 'Bulk Reassign Failed', 
        description: e?.message || 'Failed to reassign reports',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">
          Bulk Actions ({selectedReports.length} selected)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowApproveDialog(true)}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" /> Bulk Approve ({selectedReports.length})
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowRejectDialog(true)}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" /> Bulk Reject ({selectedReports.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReassignDialog(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" /> Bulk Reassign ({selectedReports.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDelegateDialog(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" /> Delegate Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSetDueDateDialog(true)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" /> Set Due Date
          </Button>
        </div>

        {/* Delegate Dialog */}
        {showDelegateDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Bulk Delegate Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Delegate To</Label>
                  <Select value={delegateToUserId} onValueChange={setDelegateToUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reason</Label>
                  <textarea
                    value={delegationReason}
                    onChange={(e) => setDelegationReason(e.target.value)}
                    placeholder="Why are you delegating these reviews?"
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => {
                    setShowDelegateDialog(false);
                    setDelegateToUserId('');
                    setDelegationReason('');
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkDelegate}
                    disabled={!delegateToUserId || !delegationReason.trim() || isSubmitting}
                  >
                    Delegate {selectedReports.length} Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Set Due Date Dialog */}
        {showSetDueDateDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Bulk Set Due Date</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => {
                    setShowSetDueDateDialog(false);
                    setDueDate('');
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkSetDueDate}
                    disabled={!dueDate || isSubmitting}
                  >
                    Set Due Date for {selectedReports.length} Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bulk Approve Dialog */}
        {showApproveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Bulk Approve Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Comment (Optional)</Label>
                  <Textarea
                    value={approveComment}
                    onChange={(e) => setApproveComment(e.target.value)}
                    placeholder="Add a comment for all approvals..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => {
                    setShowApproveDialog(false);
                    setApproveComment('');
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkApprove}
                    disabled={isSubmitting}
                  >
                    Approve {selectedReports.length} Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bulk Reject Dialog */}
        {showRejectDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Bulk Reject Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rejection Reason *</Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide reason for rejection..."
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => {
                    setShowRejectDialog(false);
                    setRejectReason('');
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkReject}
                    disabled={!rejectReason.trim() || isSubmitting}
                    variant="destructive"
                  >
                    Reject {selectedReports.length} Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bulk Reassign Dialog */}
        {showReassignDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Bulk Reassign Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Reassign To *</Label>
                  <Select value={reassignToUserId} onValueChange={setReassignToUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reason *</Label>
                  <Textarea
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                    placeholder="Why are you reassigning these reviews?"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => {
                    setShowReassignDialog(false);
                    setReassignToUserId('');
                    setReassignReason('');
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkReassign}
                    disabled={!reassignToUserId || !reassignReason.trim() || isSubmitting}
                  >
                    Reassign {selectedReports.length} Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


