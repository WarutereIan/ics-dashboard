import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { reportWorkflowService } from '@/services/reportWorkflowService';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { ReportWorkflowDetail } from './ReportWorkflowDetail';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ReviewerWorkloadDashboardProps {
  projectId?: string;
}

export function ReviewerWorkloadDashboard({ projectId }: ReviewerWorkloadDashboardProps) {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const effectiveProjectId = projectId || routeProjectId;
  const { toast } = useToast();
  const [workload, setWorkload] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState<string>('all');
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  const loadWorkload = async () => {
    setLoading(true);
    try {
      const data = await reportWorkflowService.getReviewerWorkload(
        effectiveProjectId,
        selectedReviewer !== 'all' ? selectedReviewer : undefined
      );
      setWorkload(data);
    } catch (e: any) {
      toast({
        title: 'Failed to Load Workload',
        description: e?.message || 'Failed to load reviewer workload data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkload();
  }, [effectiveProjectId, selectedReviewer]);

  if (loading && !workload) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading workload data...</p>
        </CardContent>
      </Card>
    );
  }

  const reviewers = workload?.reviewers || [];
  const totalPending = reviewers.reduce((sum: number, r: any) => sum + r.pendingCount, 0);
  const totalOverdue = reviewers.reduce((sum: number, r: any) => sum + r.overdueCount, 0);
  const totalCompleted = reviewers.reduce((sum: number, r: any) => sum + r.completedCount, 0);
  const avgReviewTime = reviewers.length > 0
    ? reviewers.reduce((sum: number, r: any) => sum + r.averageReviewTime, 0) / reviewers.length
    : 0;

  return (
    <div className="space-y-6">
      <Dialog open={!!openReportId} onOpenChange={(o) => !o && setOpenReportId(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {openReportId && (
            <ReportWorkflowDetail 
              reportId={openReportId} 
              onClose={() => setOpenReportId(null)}
              onChanged={loadWorkload}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Reviewers</p>
                <p className="text-2xl font-bold">{reviewers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold">{totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{totalOverdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Review Time</p>
                <p className="text-2xl font-bold">{avgReviewTime.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviewer Workload</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviewers</SelectItem>
                  {reviewers.map((r: any) => (
                    <SelectItem key={r.reviewerId} value={r.reviewerId}>
                      {r.reviewerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadWorkload}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reviewers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviewer workload data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Overdue</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Avg Review Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewers.map((reviewer: any) => {
                    const workloadPercent = reviewer.completedCount + reviewer.pendingCount > 0
                      ? (reviewer.pendingCount / (reviewer.completedCount + reviewer.pendingCount)) * 100
                      : 0;
                    const isOverloaded = workloadPercent > 80;
                    const isBottleneck = reviewer.pendingCount > 10 || reviewer.overdueCount > 5;

                    return (
                      <TableRow key={reviewer.reviewerId}>
                        <TableCell className="font-medium">{reviewer.reviewerName}</TableCell>
                        <TableCell>
                          <Badge variant={reviewer.pendingCount > 0 ? 'default' : 'secondary'}>
                            {reviewer.pendingCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reviewer.overdueCount > 0 ? (
                            <Badge variant="destructive">{reviewer.overdueCount}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{reviewer.completedCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {reviewer.averageReviewTime > 0
                              ? `${reviewer.averageReviewTime.toFixed(1)}h`
                              : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isBottleneck && (
                            <Badge variant="destructive" className="mr-2">Bottleneck</Badge>
                          )}
                          {isOverloaded && !isBottleneck && (
                            <Badge variant="default" className="mr-2">High Load</Badge>
                          )}
                          {!isOverloaded && !isBottleneck && (
                            <Badge variant="secondary">Normal</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Reports by Reviewer */}
      {selectedReviewer !== 'all' && reviewers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Pending Reports - {reviewers.find((r: any) => r.reviewerId === selectedReviewer)?.reviewerName || 'Unknown'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const reviewer = reviewers.find((r: any) => r.reviewerId === selectedReviewer);
              if (!reviewer || reviewer.reports.length === 0) {
                return <p className="text-muted-foreground text-center py-4">No pending reports</p>;
              }

              return (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Step</TableHead>
                        <TableHead>Days Pending</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewer.reports.map((report: any) => (
                        <TableRow key={report.reportId}>
                          <TableCell className="font-medium">{report.reportName}</TableCell>
                          <TableCell>Step {report.stepOrder}</TableCell>
                          <TableCell>{report.daysPending} days</TableCell>
                          <TableCell>
                            {report.dueDate ? (
                              <span className={report.isOverdue ? 'text-red-600 font-medium' : ''}>
                                {new Date(report.dueDate).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">No due date</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {report.isOverdue ? (
                              <Badge variant="destructive">Overdue</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setOpenReportId(report.reportId)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


