import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  FileText
} from 'lucide-react';

interface FeedbackFormDetailsProps {
  formId: string;
  onBack: () => void;
}

export function FeedbackFormDetails({ formId, onBack }: FeedbackFormDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock form data
  const mockForm = {
    id: formId,
    title: 'General Feedback Form',
    description: 'Collect general feedback from community members about programs and services',
    category: 'General',
    priority: 'LOW',
    status: 'active',
    submissions: 45,
    lastModified: '2024-01-15',
    createdBy: 'Admin User',
    fields: [
      { id: '1', name: 'stakeholderType', label: 'Stakeholder Type', type: 'select', required: true },
      { id: '2', name: 'overallRating', label: 'Overall Rating', type: 'rating', required: true },
      { id: '3', name: 'programArea', label: 'Program Area', type: 'select', required: false },
      { id: '4', name: 'impact', label: 'Impact Assessment', type: 'select', required: true },
      { id: '5', name: 'suggestions', label: 'Suggestions for Improvement', type: 'textarea', required: false }
    ]
  };

  // Mock submissions data for this form
  const mockSubmissions = [
    {
      id: '1',
      title: 'Water quality concern in community center',
      submitter: 'John Doe',
      submitterEmail: 'john@example.com',
      isAnonymous: false,
      submittedAt: '2024-01-15T10:30:00Z',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedTo: 'Sarah Wilson',
      data: {
        stakeholderType: 'community_member',
        overallRating: '2',
        programArea: 'infrastructure',
        impact: 'negative',
        suggestions: 'Please test water quality and provide alternative water source while investigation is ongoing.'
      }
    },
    {
      id: '2',
      title: 'Great community program',
      submitter: 'Jane Smith',
      submitterEmail: 'jane@example.com',
      isAnonymous: false,
      submittedAt: '2024-01-14T14:20:00Z',
      status: 'RESOLVED',
      priority: 'LOW',
      assignedTo: 'Mike Johnson',
      data: {
        stakeholderType: 'community_member',
        overallRating: '5',
        programArea: 'education',
        impact: 'positive',
        suggestions: 'Keep up the excellent work!'
      }
    },
    {
      id: '3',
      title: 'Need more accessibility features',
      submitter: 'Anonymous',
      submitterEmail: '',
      isAnonymous: true,
      submittedAt: '2024-01-13T09:15:00Z',
      status: 'ACKNOWLEDGED',
      priority: 'MEDIUM',
      assignedTo: 'Admin Team',
      data: {
        stakeholderType: 'community_member',
        overallRating: '3',
        programArea: 'accessibility',
        impact: 'neutral',
        suggestions: 'Please add wheelchair ramps and better signage.'
      }
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

  // Calculate analytics
  const analytics = {
    totalSubmissions: mockSubmissions.length,
    resolvedSubmissions: mockSubmissions.filter(s => s.status === 'RESOLVED').length,
    inProgressSubmissions: mockSubmissions.filter(s => s.status === 'IN_PROGRESS').length,
    averageRating: mockSubmissions.reduce((sum, s) => sum + parseInt(s.data.overallRating), 0) / mockSubmissions.length,
    stakeholderTypes: {
      community_member: mockSubmissions.filter(s => s.data.stakeholderType === 'community_member').length,
      staff: mockSubmissions.filter(s => s.data.stakeholderType === 'staff').length,
      partner: mockSubmissions.filter(s => s.data.stakeholderType === 'partner').length
    },
    impactDistribution: {
      positive: mockSubmissions.filter(s => s.data.impact === 'positive').length,
      negative: mockSubmissions.filter(s => s.data.impact === 'negative').length,
      neutral: mockSubmissions.filter(s => s.data.impact === 'neutral').length
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mockForm.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={getPriorityColor(mockForm.priority)}>
                {mockForm.priority} Priority
              </Badge>
              <Badge variant={getStatusColor(mockForm.status)}>
                {mockForm.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{analytics.totalSubmissions}</p>
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
                <p className="text-2xl font-bold">{analytics.resolvedSubmissions}</p>
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
                <p className="text-2xl font-bold">{analytics.inProgressSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="fields">Form Fields</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Information */}
            <Card>
              <CardHeader>
                <CardTitle>Form Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="mt-1 text-sm">{mockForm.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="mt-1 text-sm">{mockForm.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created By</label>
                  <p className="mt-1 text-sm">{mockForm.createdBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Modified</label>
                  <p className="mt-1 text-sm">{mockForm.lastModified}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="mt-1 text-sm">{mockForm.status}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSubmissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center gap-3 p-2 border rounded">
                      <div className="p-1 bg-gray-100 rounded">
                        {getStatusIcon(submission.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{submission.title}</p>
                        <p className="text-xs text-gray-500">
                          {submission.isAnonymous ? 'Anonymous' : submission.submitter} • {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getPriorityColor(submission.priority)} className="text-xs">
                        {submission.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubmissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{submission.title}</h3>
                          <Badge variant={getPriorityColor(submission.priority)}>
                            {submission.priority}
                          </Badge>
                          <Badge variant={getStatusColor(submission.status)} className="flex items-center gap-1">
                            {getStatusIcon(submission.status)}
                            {submission.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {submission.isAnonymous ? 'Anonymous submission' : `Submitted by ${submission.submitter}`}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Assigned to: {submission.assignedTo}
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            Rating: {submission.data.overallRating}/5
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stakeholder Types */}
            <Card>
              <CardHeader>
                <CardTitle>Stakeholder Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.stakeholderTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / analytics.totalSubmissions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impact Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.impactDistribution).map(([impact, count]) => (
                    <div key={impact} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{impact}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              impact === 'positive' ? 'bg-green-600' :
                              impact === 'negative' ? 'bg-red-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${(count / analytics.totalSubmissions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = mockSubmissions.filter(s => parseInt(s.data.overallRating) === rating).length;
                  return (
                    <div key={rating} className="flex items-center justify-between">
                      <span className="text-sm">{rating} stars</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(count / analytics.totalSubmissions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockForm.fields.map((field) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{field.label}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={field.required ? 'default' : 'secondary'}>
                          {field.required ? 'Required' : 'Optional'}
                        </Badge>
                        <Badge variant="outline">
                          {field.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Field name: {field.name}</p>
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
