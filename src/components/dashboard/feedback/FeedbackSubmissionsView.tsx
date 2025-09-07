import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
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
  AlertCircle
} from 'lucide-react';
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

  // Mock data for feedback submissions
  const mockSubmissions = [
    {
      id: '1',
      title: 'Water quality concern in community center',
      type: 'General',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      submitter: 'John Doe',
      submitterEmail: 'john@example.com',
      isAnonymous: false,
      submittedAt: '2024-01-15T10:30:00Z',
      assignedTo: 'Sarah Wilson',
      description: 'Residents are reporting discolored water from the community center taps...'
    },
    {
      id: '2',
      title: 'Safety incident at playground',
      type: 'Safety',
      priority: 'CRITICAL',
      status: 'SUBMITTED',
      submitter: 'Anonymous',
      submitterEmail: null,
      isAnonymous: true,
      submittedAt: '2024-01-14T15:45:00Z',
      assignedTo: null,
      description: 'Broken equipment at the playground poses safety risk to children...'
    },
    {
      id: '3',
      title: 'Staff member was very helpful',
      type: 'Staff',
      priority: 'LOW',
      status: 'RESOLVED',
      submitter: 'Maria Garcia',
      submitterEmail: 'maria@example.com',
      isAnonymous: false,
      submittedAt: '2024-01-13T09:15:00Z',
      assignedTo: 'Mike Johnson',
      description: 'The program coordinator was extremely helpful in explaining the new services...'
    },
    {
      id: '4',
      title: 'Emergency: Gas leak reported',
      type: 'Emergency',
      priority: 'CRITICAL',
      status: 'ESCALATED',
      submitter: 'Emergency Services',
      submitterEmail: 'emergency@city.gov',
      isAnonymous: false,
      submittedAt: '2024-01-12T22:30:00Z',
      assignedTo: 'Emergency Team',
      description: 'Gas leak detected near the community center. Immediate evacuation required...'
    },
    {
      id: '5',
      title: 'Suggestion for better scheduling',
      type: 'General',
      priority: 'MEDIUM',
      status: 'ACKNOWLEDGED',
      submitter: 'Anonymous',
      submitterEmail: null,
      isAnonymous: true,
      submittedAt: '2024-01-11T14:20:00Z',
      assignedTo: 'Program Manager',
      description: 'Would be helpful to have evening classes for working parents...'
    }
  ];

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
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
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
  };

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewSubmission = (submissionId: string) => {
    setSelectedSubmission(submissionId);
  };

  const handleBackToList = () => {
    setSelectedSubmission(null);
  };

  const handleExportSubmissions = () => {
    console.log('Export submissions');
  };

  // Show detailed view if a submission is selected
  if (selectedSubmission) {
    return (
      <FeedbackSubmissionDetail 
        submissionId={selectedSubmission} 
        onBack={handleBackToList} 
      />
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
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{mockSubmissions.length}</p>
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
                <p className="text-2xl font-bold">{mockSubmissions.filter(s => s.status === 'SUBMITTED').length}</p>
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
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{mockSubmissions.filter(s => s.status === 'IN_PROGRESS').length}</p>
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
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{mockSubmissions.filter(s => s.status === 'RESOLVED').length}</p>
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
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold">{mockSubmissions.filter(s => s.priority === 'CRITICAL').length}</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <User className="w-4 h-4" />
                        {submission.isAnonymous ? 'Anonymous' : submission.submitter}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      {submission.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
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
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No submissions found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
