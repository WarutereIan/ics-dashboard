import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Download,
  Eye,
  MessageSquare,
  AlertTriangle,
  Phone,
  Users,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { FeedbackSubmissionDetail } from './FeedbackSubmissionDetail';
import {
  getClosureDueDate,
  isSensitiveSopCategory,
  isProgrammaticSopCategory,
  isOverdueForClosure,
  SOP_CATEGORY_LABELS,
  type SopCategory,
} from '@/types/feedback';

interface FeedbackSubmissionsViewProps {
  projectId: string;
  projectName?: string;
}

export function FeedbackSubmissionsView({ projectId, projectName = "ICS Organization" }: FeedbackSubmissionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sopFilter, setSopFilter] = useState<string>('all'); // 'all' | 'sensitive' | 'programmatic' | '1'..'8'
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  
  const { submissions, loading, updateSubmissionStatus, refreshSubmissions } = useFeedback();

  // Fetch submissions when component mounts
  useEffect(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  // Memoized transformation of submissions to prevent recalculation on every render
  const transformedSubmissions = useMemo(() => {
    return submissions.map(submission => {
      const sopCat = submission.category?.sopCategory;
      const due = getClosureDueDate(
        submission.submittedAt,
        sopCat,
        submission.category?.closureDeadlineHours
      );
      return {
        id: submission.id,
        title: submission.data?.title || 'Feedback Submission',
        type: submission.category?.name || 'General',
        priority: submission.priority,
        status: submission.status,
        submitter: submission.isAnonymous ? 'Anonymous' : (submission.submitterName || 'Unknown'),
        submitterEmail: submission.submitterEmail,
        stakeholderType: submission.stakeholderType,
        isAnonymous: submission.isAnonymous,
        submittedAt: submission.submittedAt,
        assignedTo: submission.assignedTo,
        description: submission.data?.description || submission.data?.feedback || submission.data?.details || 'No description provided',
        sopCategory: sopCat,
        closureDueDate: due,
        isSensitive: isSensitiveSopCategory(sopCat),
        isProgrammatic: isProgrammaticSopCategory(sopCat),
        isOverdue: isOverdueForClosure(submission.status, due),
      };
    });
  }, [submissions]);


  // Memoized utility functions
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'outline';
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'secondary';
      case 'ACKNOWLEDGED':
        return 'default';
      case 'IN_PROGRESS':
        return 'default';
      case 'RESOLVED':
        return 'default';
      case 'CLOSED':
        return 'outline';
      case 'ESCALATED':
        return 'destructive';
      default:
        return 'outline';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="w-4 h-4" />;
      case 'ACKNOWLEDGED':
        return <MessageSquare className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      case 'ESCALATED':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'General':
        return <MessageSquare className="w-4 h-4" />;
      case 'Safety':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Emergency':
        return <Phone className="w-4 h-4" />;
      case 'Staff':
        return <Users className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  }, []);

  // Use real submissions data
  const allSubmissions = transformedSubmissions;
  
  // Memoized filtered submissions (SOP-aligned filters)
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter(submission => {
      const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
      const matchesSop =
        sopFilter === 'all' ||
        (sopFilter === 'sensitive' && submission.isSensitive) ||
        (sopFilter === 'programmatic' && submission.isProgrammatic) ||
        (sopFilter !== 'all' && submission.sopCategory != null && String(submission.sopCategory) === sopFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesSop;
    });
  }, [allSubmissions, searchTerm, statusFilter, priorityFilter, sopFilter]);

  // Memoized event handlers
  const handleViewSubmission = useCallback((submissionId: string) => {
    setSelectedSubmission(submissionId);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedSubmission(null);
  }, []);

  const handleExportSubmissions = useCallback(() => {
    console.log('Export submissions');
  }, []);

  // Show detailed view if a submission is selected
  if (selectedSubmission) {
    return (
      <FeedbackSubmissionDetail 
        submissionId={selectedSubmission} 
        onBack={handleBackToList} 
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feedback submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Submissions</h1>
          <p className="text-gray-600 mt-2">
            View and manage feedback submissions for {projectName}. Categorized by ICS SOP: sensitive (6–7) close within 72 hours; categories 1–5 close within 30 days.
          </p>
        </div>
        <Button onClick={handleExportSubmissions} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* SOP-aligned Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{allSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{allSubmissions.filter(s => s.status === 'SUBMITTED').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sensitive (72h)</p>
                <p className="text-2xl font-bold">
                  {allSubmissions.filter(s => s.isSensitive && s.status !== 'CLOSED' && s.status !== 'RESOLVED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{allSubmissions.filter(s => s.isOverdue).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved / Closed</p>
                <p className="text-2xl font-bold">
                  {allSubmissions.filter(s => s.status === 'RESOLVED' || s.status === 'CLOSED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sopFilter} onValueChange={setSopFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="SOP category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SOP categories</SelectItem>
                <SelectItem value="sensitive">Sensitive (72h closure)</SelectItem>
                <SelectItem value="programmatic">Programmatic (30d closure)</SelectItem>
                {(Object.keys(SOP_CATEGORY_LABELS) as unknown as SopCategory[]).map((key) => (
                  <SelectItem key={key} value={String(key)}>
                    SOP {key}: {SOP_CATEGORY_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {transformedSubmissions.length === 0
                  ? 'No feedback submissions have been received yet.'
                  : 'No submissions match your current filters.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Title / Description</TableHead>
                  <TableHead className="min-w-[200px]">SOP category</TableHead>
                  <TableHead className="whitespace-nowrap">Priority</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Submitter</TableHead>
                  <TableHead className="whitespace-nowrap">Submitted</TableHead>
                  <TableHead className="whitespace-nowrap">Due by</TableHead>
                  <TableHead className="whitespace-nowrap">Assigned</TableHead>
                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className={
                      submission.isOverdue
                        ? 'border-l-4 border-l-red-400 bg-red-50/50 hover:bg-red-50/70'
                        : ''
                    }
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{submission.title}</p>
                        <p className="text-muted-foreground text-xs line-clamp-2 mt-0.5">
                          {submission.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {submission.sopCategory != null ? (
                        <div className="space-y-1">
                          <Badge
                            variant={submission.isSensitive ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            SOP {submission.sopCategory}
                            {submission.isSensitive ? ' (Sensitive)' : ''}
                          </Badge>
                          <p className="text-muted-foreground text-xs max-w-[240px]">
                            {SOP_CATEGORY_LABELS[submission.sopCategory as SopCategory]}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{submission.type || '—'}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(submission.priority)}>{submission.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(submission.status)} className="inline-flex items-center gap-1">
                        {getStatusIcon(submission.status)}
                        {submission.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span>{submission.isAnonymous ? 'Anonymous' : submission.submitter}</span>
                      {submission.stakeholderType === 'community_facilitator' && (
                        <Badge variant="outline" className="ml-1.5 text-xs">Community facilitator</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {submission.closureDueDate != null &&
                      submission.status !== 'CLOSED' &&
                      submission.status !== 'RESOLVED' ? (
                        <span
                          className={
                            submission.isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                          }
                        >
                          {new Date(submission.closureDueDate).toLocaleString()}
                          {submission.isSensitive && ' (72h)'}
                        </span>
                      ) : (
                        '—'
                      )}
                      {submission.isOverdue && (
                        <Badge variant="destructive" className="ml-1 text-xs">
                          Overdue
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {submission.assignedTo || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSubmission(submission.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
