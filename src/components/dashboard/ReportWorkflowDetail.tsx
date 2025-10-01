import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, XCircleIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';

import { reportWorkflowService } from '@/services/reportWorkflowService';
import { useToast } from '@/hooks/use-toast';
import { log } from 'console';

interface ReportWorkflowDetailProps {
  reportId: string;
  onClose: () => void;
  onChanged?: () => void;
}

export function ReportWorkflowDetail({ reportId, onClose, onChanged }: ReportWorkflowDetailProps) {
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('details');
  const [report, setReport] = React.useState<any>(null);
  const [note, setNote] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasActed, setHasActed] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await reportWorkflowService.getReportById(reportId);
        setReport(data);
        console.log(data);

      } finally {
        setLoading(false);
        
      }
    };
    load();
  }, [reportId]);

  const refetchWorkflow = async () => {
    try {
      const data = await reportWorkflowService.getReportById(reportId);
      setReport(data);
    } catch (e) {
      console.error('Failed to refresh workflow detail:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const steps = Array.isArray(report.approvalSteps) ? report.approvalSteps : [];
  const totalSteps = steps.length || 1;
  const currentIndex = steps.findIndex((s: any) => !s.isCompleted);
  const currentStep = currentIndex >= 0 ? currentIndex + 1 : totalSteps;

  const statusColor = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'APPROVED') return 'default';
    if (s === 'REJECTED') return 'destructive';
    if (s === 'PENDING' || s === 'IN_REVIEW') return 'secondary';
    return 'outline';
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <DialogTitle>Report Review</DialogTitle>
      <DialogDescription>Review report details and take action</DialogDescription>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate" title={report.name || 'Report'}>
            {report.name || 'Report'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={statusColor(report.status)} className="uppercase">{(report.status || 'PENDING').replace('_', ' ')}</Badge>
            <Badge variant="outline">Step {currentStep} of {totalSteps}</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sticky top-0 bg-white z-10">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{report.description || 'No description'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Take Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Request changes note</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Provide details on what changes are required..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={async () => {
                    if (hasActed || isSubmitting) return;
                    try {
                      setIsSubmitting(true);
                      await reportWorkflowService.review(report.id, 'APPROVE');
                      setHasActed(true);
                      toast({ title: 'Approved', description: 'Your approval was recorded.' });
                      setActiveTab('history');
                      await refetchWorkflow();
                      onChanged?.();
                    } catch (e: any) {
                      toast({ title: 'Action failed', description: e?.message || 'Unable to approve report', variant: 'destructive' });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting || hasActed}
                  className="gap-2"
                >
                  <CheckCircleIcon className="h-4 w-4" /> Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={async () => {
                    if (hasActed || isSubmitting) return;
                    try {
                      setIsSubmitting(true);
                      await reportWorkflowService.review(report.id, 'REJECT');
                      setHasActed(true);
                      toast({ title: 'Rejected', description: 'Your rejection was recorded.' });
                      setActiveTab('history');
                      await refetchWorkflow();
                      onChanged?.();
                    } catch (e: any) {
                      toast({ title: 'Action failed', description: e?.message || 'Unable to reject report', variant: 'destructive' });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting || hasActed}
                  className="gap-2"
                >
                  <XCircleIcon className="h-4 w-4" /> Reject
                </Button>
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    if (hasActed || isSubmitting) return;
                    try {
                      setIsSubmitting(true);
                      await reportWorkflowService.review(report.id, 'REQUEST_CHANGES', note);
                      setHasActed(true);
                      toast({ title: 'Changes requested', description: 'Your request for changes was recorded.' });
                      setActiveTab('history');
                      await refetchWorkflow();
                      onChanged?.();
                    } catch (e: any) {
                      toast({ title: 'Action failed', description: e?.message || 'Unable to request changes', variant: 'destructive' });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="gap-2" 
                  disabled={!note.trim() || isSubmitting || hasActed}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" /> Request Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Review Steps & Audit</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[50vh] overflow-auto">
              <div className="space-y-3">
                {steps.map((s: any) => (
                  <div key={s.id} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>Step {s.stepOrder}</span>
                      </div>
                      <Badge variant={s.isCompleted ? 'default' : 'secondary'}>{s.isCompleted ? 'Completed' : 'Pending'}</Badge>
                    </div>
                    {s.reviewer && (
                      <div className="text-xs text-muted-foreground mt-1">Reviewer: {`${s.reviewer.firstName || ''} ${s.reviewer.lastName || ''}`.trim() || s.reviewer.email}</div>
                    )}
                    {s.action && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Action:</span> {s.action}
                        {s.comment && (<div className="text-muted-foreground mt-1">Comment: {s.comment}</div>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


