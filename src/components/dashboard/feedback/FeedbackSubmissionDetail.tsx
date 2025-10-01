import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatBubbleLeftRightIcon, ExclamationTriangleIcon, UsersIcon, CalendarIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, DocumentTextIcon, EyeIcon, FlagIcon, ArrowLeftIcon, PhoneIcon } from '@heroicons/react/24/outline';

import { FeedbackResolutionWorkflow } from './FeedbackResolutionWorkflow';
import { FeedbackStatusTracker } from './FeedbackStatusTracker';
import { useFeedback } from '@/contexts/FeedbackContext';
import { FeedbackSubmission } from '@/types/feedback';

interface FeedbackSubmissionDetailProps {
  submissionId: string;
  onBack: () => void;
}

export function FeedbackSubmissionDetail({ submissionId, onBack }: FeedbackSubmissionDetailProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [resolutionNote, setResolutionNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [submission, setSubmission] = useState<FeedbackSubmission | null>(null);
  
  const { getSubmissionById, loading } = useFeedback();

  useEffect(() => {
    if (submissionId) {
      const foundSubmission = getSubmissionById(submissionId);
      setSubmission(foundSubmission || null);
    }
  }, [submissionId, getSubmissionById]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading submission details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!submission) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Submission not found</p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Submissions
          </Button>
        </div>
      </div>
    );
  }

  // Transform submission data for display
  const displayData = {
    id: submission.id,
    title: submission.data?.title || `${submission.category?.name || 'Feedback'} Submission`,
    type: submission.category?.name || 'General',
    priority: submission.priority,
    status: submission.status,
    submitter: submission.isAnonymous ? 'Anonymous' : (submission.submitterName || 'Unknown'),
    submitterEmail: submission.submitterEmail,
    isAnonymous: submission.isAnonymous,
    submittedAt: submission.submittedAt,
    assignedTo: submission.assignedTo,
    assignedAt: submission.assignedAt,
    description: submission.data?.description || submission.data?.feedback || submission.data?.details || 'No description provided',
    location: submission.data?.location || 'Not specified',
    attachments: submission.attachments || [],
    data: submission.data,
    communications: submission.communications || [],
    internalNotes: submission.internalNotes || []
  };


  const getPriorityColor = (priority: string) => {
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
  };

  const getStatusColor = (status: string) => {
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
  };

  const getStatusIcon = (status: string) => {
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
        return <FlagIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getActionIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'ACKNOWLEDGED':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircleIcon className="w-4 h-4" />;
      case 'ESCALATED':
        return <FlagIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = () => {
    console.log('Updating status to:', newStatus);
    console.log('Resolution note:', resolutionNote);
    console.log('Assign to:', assignTo);
  };


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Submissions
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{displayData.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={getPriorityColor(displayData.priority)}>
                {displayData.priority} Priority
              </Badge>
              <Badge variant={getStatusColor(displayData.status)} className="flex items-center gap-1">
                {getStatusIcon(displayData.status)}
                {displayData.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Assigned to: <strong>{displayData.assignedTo}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Submitted: {new Date(displayData.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">
                <FlagIcon className="w-4 h-4 mr-2" />
                Escalate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="resolution">Resolution</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submission Details */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="mt-1 text-sm">{displayData.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="mt-1 text-sm">{displayData.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitter</label>
                  <p className="mt-1 text-sm">
                    {displayData.isAnonymous ? 'Anonymous' : displayData.submitter}
                    {!displayData.isAnonymous && (
                      <span className="text-gray-500 ml-2">({displayData.submitterEmail})</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted At</label>
                  <p className="mt-1 text-sm">{new Date(displayData.submittedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Form Data */}
            <Card>
              <CardHeader>
                <CardTitle>Form Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(displayData.data).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="mt-1 text-sm">{String(value)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Attachments */}
          {displayData.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {displayData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{file.filename}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>


        <TabsContent value="resolution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resolution Workflow */}
            <div>
              <FeedbackResolutionWorkflow
                submissionId={displayData.id}
                currentStatus={displayData.status}
                assignedTo={displayData.assignedTo}
                onStatusUpdate={(status, notes, assignTo) => {
                  console.log('Status update:', { status, notes, assignTo });
                  // Here you would typically make an API call to update the status
                }}
              />
            </div>

            {/* Status Tracker */}
            <div>
              <FeedbackStatusTracker
                statusHistory={(submission.statusHistory || []).map(entry => ({
                  id: entry.id,
                  status: entry.status,
                  previousStatus: entry.previousStatus,
                  timestamp: entry.createdAt,
                  user: entry.changedBy,
                  changedByName: entry.changedByName,
                  reason: entry.reason,
                  details: entry.details,
                  assignee: entry.assignedTo
                }))}
                currentStatus={displayData.status}
                assignedTo={displayData.assignedTo}
                submittedAt={new Date(displayData.submittedAt).toISOString()}
                resolvedAt={displayData.status === 'RESOLVED' ? (submission.resolvedAt ? new Date(submission.resolvedAt).toISOString() : (displayData.assignedAt ? new Date(displayData.assignedAt).toISOString() : undefined)) : undefined}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
            {(displayData.internalNotes || []).map((note) => (
              <div key={note.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-gray-100 rounded-full">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Internal Note</span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-1">by {note.authorName}</p>
                </div>
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
