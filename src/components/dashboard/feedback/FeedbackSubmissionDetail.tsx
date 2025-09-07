import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
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
  FileText,
  Eye,
  Flag
} from 'lucide-react';
import { FeedbackResolutionWorkflow } from './FeedbackResolutionWorkflow';
import { FeedbackStatusTracker } from './FeedbackStatusTracker';

interface FeedbackSubmissionDetailProps {
  submissionId: string;
  onBack: () => void;
}

export function FeedbackSubmissionDetail({ submissionId, onBack }: FeedbackSubmissionDetailProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [resolutionNote, setResolutionNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [assignTo, setAssignTo] = useState('');

  // Mock submission data
  const mockSubmission = {
    id: submissionId,
    title: 'Water quality concern in community center',
    type: 'General',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    submitter: 'John Doe',
    submitterEmail: 'john@example.com',
    isAnonymous: false,
    submittedAt: '2024-01-15T10:30:00Z',
    assignedTo: 'Sarah Wilson',
    assignedAt: '2024-01-15T11:00:00Z',
    description: 'Residents are reporting discolored water from the community center taps. The water has a brownish tint and unusual smell. This has been ongoing for the past 3 days and affects approximately 50 families who use the center daily.',
    location: 'Community Center - Main Building',
    attachments: [
      { name: 'water_sample_photo.jpg', type: 'image', size: '2.3 MB' },
      { name: 'complaint_log.pdf', type: 'document', size: '156 KB' }
    ],
    data: {
      stakeholderType: 'community_member',
      overallRating: '2',
      programArea: 'infrastructure',
      impact: 'negative',
      suggestions: 'Please test water quality and provide alternative water source while investigation is ongoing.'
    },
    communications: [
      {
        id: '1',
        type: 'email',
        direction: 'outbound',
        content: 'Thank you for reporting this issue. We have assigned it to our infrastructure team for immediate investigation.',
        sentBy: 'Sarah Wilson',
        sentAt: '2024-01-15T11:15:00Z',
        status: 'delivered'
      },
      {
        id: '2',
        type: 'internal_note',
        direction: 'inbound',
        content: 'Water quality test scheduled for tomorrow morning. Will coordinate with local health department.',
        sentBy: 'Mike Johnson',
        sentAt: '2024-01-15T14:30:00Z',
        status: 'read'
      }
    ],
    resolutionHistory: [
      {
        id: '1',
        status: 'SUBMITTED',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'System',
        details: 'Feedback submission received'
      },
      {
        id: '2',
        status: 'ACKNOWLEDGED',
        timestamp: '2024-01-15T11:00:00Z',
        user: 'Sarah Wilson',
        details: 'Assigned to infrastructure team'
      },
      {
        id: '3',
        status: 'IN_PROGRESS',
        timestamp: '2024-01-15T11:15:00Z',
        user: 'Sarah Wilson',
        details: 'Initial response sent to submitter'
      }
    ]
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
        return <Flag className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <MessageSquare className="w-4 h-4" />;
      case 'ACKNOWLEDGED':
        return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      case 'ESCALATED':
        return <Flag className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mockSubmission.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={getPriorityColor(mockSubmission.priority)}>
                {mockSubmission.priority} Priority
              </Badge>
              <Badge variant={getStatusColor(mockSubmission.status)} className="flex items-center gap-1">
                {getStatusIcon(mockSubmission.status)}
                {mockSubmission.status.replace('_', ' ')}
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
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Assigned to: <strong>{mockSubmission.assignedTo}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Submitted: {new Date(mockSubmission.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">
                <Flag className="w-4 h-4 mr-2" />
                Escalate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
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
                  <p className="mt-1 text-sm">{mockSubmission.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="mt-1 text-sm">{mockSubmission.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitter</label>
                  <p className="mt-1 text-sm">
                    {mockSubmission.isAnonymous ? 'Anonymous' : mockSubmission.submitter}
                    {!mockSubmission.isAnonymous && (
                      <span className="text-gray-500 ml-2">({mockSubmission.submitterEmail})</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted At</label>
                  <p className="mt-1 text-sm">{new Date(mockSubmission.submittedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Form Data */}
            <Card>
              <CardHeader>
                <CardTitle>Form Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockSubmission.data).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="mt-1 text-sm">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Attachments */}
          {mockSubmission.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockSubmission.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubmission.communications.map((comm) => (
                  <div key={comm.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={comm.direction === 'outbound' ? 'default' : 'secondary'}>
                          {comm.direction === 'outbound' ? 'Sent' : 'Received'}
                        </Badge>
                        <span className="text-sm font-medium">{comm.sentBy}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(comm.sentAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{comm.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resolution Workflow */}
            <div>
              <FeedbackResolutionWorkflow
                submissionId={mockSubmission.id}
                currentStatus={mockSubmission.status}
                assignedTo={mockSubmission.assignedTo}
                onStatusUpdate={(status, notes, assignTo) => {
                  console.log('Status update:', { status, notes, assignTo });
                  // Here you would typically make an API call to update the status
                }}
              />
            </div>

            {/* Status Tracker */}
            <div>
              <FeedbackStatusTracker
                statusHistory={mockSubmission.resolutionHistory}
                currentStatus={mockSubmission.status}
                assignedTo={mockSubmission.assignedTo}
                submittedAt={mockSubmission.submittedAt}
                resolvedAt={mockSubmission.status === 'RESOLVED' ? mockSubmission.assignedAt : undefined}
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
            {mockSubmission.resolutionHistory.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getActionIcon(entry.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{entry.status.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{entry.details}</p>
                  <p className="text-xs text-gray-500 mt-1">by {entry.user}</p>
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
