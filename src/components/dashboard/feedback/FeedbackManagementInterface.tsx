import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChatBubbleLeftRightIcon, MagnifyingGlassIcon, FunnelIcon, EyeIcon, ClockIcon, ExclamationTriangleIcon, CheckCircleIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

import { FeedbackSubmission, FeedbackForm } from '@/types/feedback';

interface FeedbackManagementInterfaceProps {
  projectId: string;
  submissions: FeedbackSubmission[];
  forms: FeedbackForm[];
}

export function FeedbackManagementInterface({ 
  projectId, 
  submissions, 
  forms 
}: FeedbackManagementInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.data && 
      Object.values(submission.data).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'default';
      case 'ACKNOWLEDGED':
        return 'secondary';
      case 'IN_PROGRESS':
        return 'default';
      case 'RESOLVED':
        return 'default';
      case 'CLOSED':
        return 'secondary';
      case 'ESCALATED':
        return 'destructive';
      default:
        return 'outline';
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'ACKNOWLEDGED':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <ClockIcon className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'CLOSED':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'ESCALATED':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-600">
                {submissions.length === 0 
                  ? "No feedback has been submitted yet" 
                  : "No submissions match your current filters"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(submission.status)}
                            <span className="font-medium">
                              {submission.category.name} Feedback
                            </span>
                          </div>
                          <Badge variant={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                          <Badge variant={getPriorityColor(submission.priority)}>
                            {submission.priority}
                          </Badge>
                          {submission.isAnonymous && (
                            <Badge variant="outline">Anonymous</Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {submission.data && Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium capitalize">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {submission.submittedAt.toLocaleDateString()}
                          </div>
                          {submission.submitterName && (
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              {submission.submitterName}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <ExclamationTriangleIcon className="w-3 h-3" />
                            {submission.escalationLevel}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Respond
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'ACKNOWLEDGED').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.priority === 'HIGH' || s.priority === 'CRITICAL').length}
                </p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'RESOLVED' || s.status === 'CLOSED').length}
                </p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
