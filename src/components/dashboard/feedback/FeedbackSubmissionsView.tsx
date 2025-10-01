import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, EyeIcon, ChatBubbleLeftRightIcon, ExclamationTriangleIcon, UsersIcon, CalendarIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';

import { FeedbackSubmissionDetail } from './FeedbackSubmissionDetail';

interface FeedbackSubmissionsViewProps {
  projectId: string;
  projectName?: string;
}

export function FeedbackSubmissionsView({ projectId, projectName = "ICS Organization" }: FeedbackSubmissionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  
  const { submissions, loading, updateSubmissionStatus, refreshSubmissions } = useFeedback();

  // Fetch submissions when component mounts
  useEffect(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  // Memoized transformation of submissions to prevent recalculation on every render
  const transformedSubmissions = useMemo(() => {
    return submissions.map(submission => ({
      id: submission.id,
      title: submission.data?.title || 'Feedback Submission',
      type: submission.category?.name || 'General',
      priority: submission.priority,
      status: submission.status,
      submitter: submission.isAnonymous ? 'Anonymous' : (submission.submitterName || 'Unknown'),
      submitterEmail: submission.submitterEmail,
      isAnonymous: submission.isAnonymous,
      submittedAt: submission.submittedAt,
      assignedTo: submission.assignedTo,
      description: submission.data?.description || submission.data?.feedback || submission.data?.details || 'No description provided'
    }));
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
        return <ClockIcon className="w-4 h-4" />;
      case 'ACKNOWLEDGED':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircleIcon className="w-4 h-4" />;
      case 'ESCALATED':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'General':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'Safety':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'Emergency':
        return <PhoneIcon className="w-4 h-4" />;
      case 'Staff':
        return <UsersIcon className="w-4 h-4" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
    }
  }, []);

  // Use real submissions data
  const allSubmissions = transformedSubmissions;
  
  // Memoized filtered submissions to prevent recalculation on every render
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter(submission => {
      const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [allSubmissions, searchTerm, statusFilter, priorityFilter]);

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

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Feedback Submissions</h1>
            <p className="text-gray-600 mt-2">
              View and manage feedback submissions for {projectName}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
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
            View and manage feedback submissions for {projectName}
          </p>
        </div>
        <Button onClick={handleExportSubmissions} variant="outline" className="flex items-center gap-2">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-emerald-600" />
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
                <ClockIcon className="w-5 h-5 text-yellow-600" />
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
              <div className="p-2 bg-lime-100 rounded-lg">
                <ExclamationCircleIcon className="w-5 h-5 text-lime-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{allSubmissions.filter(s => s.status === 'IN_PROGRESS').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{allSubmissions.filter(s => s.status === 'RESOLVED').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold">{allSubmissions.filter(s => s.priority === 'CRITICAL').length}</p>
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
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {transformedSubmissions.length === 0 
                  ? "No feedback submissions have been received yet." 
                  : "No submissions match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(submission.type)}
                        <h3 className="text-lg font-semibold">{submission.title}</h3>
                      </div>
                      <Badge variant={getPriorityColor(submission.priority)}>
                        {submission.priority}
                      </Badge>
                      <Badge variant={getStatusColor(submission.status)} className="flex items-center gap-1">
                        {getStatusIcon(submission.status)}
                        {submission.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{submission.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {submission.isAnonymous ? 'Anonymous' : submission.submitter}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      {submission.assignedTo && (
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          Assigned to: {submission.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewSubmission(submission.id)}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
