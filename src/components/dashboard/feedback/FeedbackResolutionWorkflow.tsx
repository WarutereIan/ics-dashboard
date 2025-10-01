import React, { useState } from 'react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, FlagIcon, ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/24/outline';


interface FeedbackResolutionWorkflowProps {
  submissionId: string;
  currentStatus: string;
  assignedTo?: string;
  onStatusUpdate: (status: string, notes: string, assignTo?: string) => void;
}

export function FeedbackResolutionWorkflow({ 
  submissionId, 
  currentStatus, 
  assignedTo,
  onStatusUpdate
}: FeedbackResolutionWorkflowProps) {
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignTo, setAssignTo] = useState(assignedTo || '');
  
  const { updateSubmissionStatus, addNote } = useFeedback();

  const statusOptions = [
    { value: 'SUBMITTED', label: 'Submitted', icon: ClockIcon, color: 'secondary' },
    { value: 'ACKNOWLEDGED', label: 'Acknowledged', icon: ChatBubbleLeftRightIcon, color: 'default' },
    { value: 'IN_PROGRESS', label: 'In Progress', icon: ExclamationCircleIcon, color: 'default' },
    { value: 'RESOLVED', label: 'Resolved', icon: CheckCircleIcon, color: 'default' },
    { value: 'CLOSED', label: 'Closed', icon: XCircleIcon, color: 'outline' },
    { value: 'ESCALATED', label: 'Escalated', icon: FlagIcon, color: 'destructive' }
  ];

  const assigneeOptions = [
    { value: 'sarah-wilson', label: 'Sarah Wilson - Infrastructure Team' },
    { value: 'mike-johnson', label: 'Mike Johnson - Health Services' },
    { value: 'emergency-team', label: 'Emergency Response Team' },
    { value: 'admin-team', label: 'Administration Team' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const currentStatusInfo = getStatusInfo(currentStatus);

  const handleStatusUpdate = async () => {
    if (newStatus) {
      try {
        // Update status via context
        await updateSubmissionStatus(submissionId, newStatus, assignTo || undefined);
        
        // Add note if provided
        if (resolutionNotes.trim()) {
          await addNote(submissionId, {
            content: resolutionNotes,
            authorId: 'current-user', // In real app, get from auth context
            authorName: 'Current User',
            isInternal: true
          });
        }
        
        // Call parent callback
        onStatusUpdate(newStatus, resolutionNotes, assignTo);
        
        // Reset form
        setNewStatus('');
        setResolutionNotes('');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };


  const getNextStatusOptions = () => {
    const currentIndex = statusOptions.findIndex(option => option.value === currentStatus);
    return statusOptions.slice(currentIndex + 1);
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentStatusInfo.icon className="w-5 h-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={currentStatusInfo.color as any}>
                {currentStatusInfo.label}
              </Badge>
              {assignedTo && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4" />
                  Assigned to: {assignedTo}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {getNextStatusOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Assign To</label>
              <Select value={assignTo} onValueChange={setAssignTo}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assigneeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Resolution Notes</label>
            <Textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Add notes about the status update or resolution..."
              className="mt-1"
              rows={3}
            />
          </div>
          <Button onClick={handleStatusUpdate} disabled={!newStatus}>
            Update Status
          </Button>
        </CardContent>
      </Card>


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setNewStatus('ACKNOWLEDGED');
                setResolutionNotes('Submission acknowledged and under review.');
              }}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              Acknowledge
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewStatus('IN_PROGRESS');
                setResolutionNotes('Work has begun on resolving this issue.');
              }}
            >
              <ExclamationCircleIcon className="w-4 h-4 mr-2" />
              Start Work
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewStatus('RESOLVED');
                setResolutionNotes('Issue has been resolved successfully.');
              }}
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Mark Resolved
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
