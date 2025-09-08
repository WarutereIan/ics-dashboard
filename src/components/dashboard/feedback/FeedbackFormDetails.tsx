import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, BarChart3, MessageSquare, Clock } from 'lucide-react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { FeedbackForm, FeedbackSubmission } from '@/types/feedback';

const FeedbackFormDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms, submissions, loading } = useFeedback();
  const [form, setForm] = useState<FeedbackForm | null>(null);
  const [formSubmissions, setFormSubmissions] = useState<FeedbackSubmission[]>([]);

  // Mock forms for fallback when API data isn't available
  const mockForms: FeedbackForm[] = [
    {
      id: '1',
      projectId: 'organization',
      title: 'General Feedback Form',
      description: 'Collect general feedback from community members',
      category: { name: 'General' } as any,
      isActive: true,
      allowAnonymous: true,
      requireAuthentication: false,
      sections: [],
      settings: {} as any,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      createdBy: 'system'
    },
    {
      id: '2',
      projectId: 'organization', 
      title: 'Safety Incident Report',
      description: 'Report safety concerns and incidents',
      category: { name: 'Safety' } as any,
      isActive: true,
      allowAnonymous: true,
      requireAuthentication: false,
      sections: [],
      settings: {} as any,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      createdBy: 'system'
    },
    {
      id: '3',
      projectId: 'organization',
      title: 'Emergency Report Form', 
      description: 'Report emergency situations',
      category: { name: 'Emergency' } as any,
      isActive: true,
      allowAnonymous: true,
      requireAuthentication: false,
      sections: [],
      settings: {} as any,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      createdBy: 'system'
    },
    {
      id: '4',
      projectId: 'organization',
      title: 'Staff Feedback Form',
      description: 'Feedback about program staff',
      category: { name: 'Staff' } as any,
      isActive: false,
      allowAnonymous: false,
      requireAuthentication: true,
      sections: [],
      settings: {} as any,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      createdBy: 'system'
    }
  ];

  console.log('FeedbackFormDetails mounted with id:', id);
  console.log('Available forms:', forms);
  console.log('Loading state:', loading);

  useEffect(() => {
    if (id) {
      console.log('Looking for form with id:', id);
      // Try to find in real forms first, fallback to mock
      const allForms = forms.length > 0 ? forms : mockForms;
      const foundForm = allForms.find(f => f.id === id);
      console.log('Found form:', foundForm);
      setForm(foundForm || null);
      
      if (foundForm && submissions) {
        const relatedSubmissions = submissions.filter(s => s.formId === foundForm.id);
        setFormSubmissions(relatedSubmissions);
      }
    }
  }, [id, forms, submissions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading form details...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Form not found</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/feedback/management')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Management
          </Button>
        </div>
      </div>
    );
  }

  const totalSubmissions = formSubmissions.length;
  const resolvedSubmissions = formSubmissions.filter(s => s.status === 'RESOLVED').length;
  const pendingSubmissions = formSubmissions.filter(s => s.status === 'SUBMITTED' || s.status === 'ACKNOWLEDGED').length;
  const inProgressSubmissions = formSubmissions.filter(s => s.status === 'IN_PROGRESS').length;

  // Calculate analytics
  const analytics = {
    responseRate: totalSubmissions > 0 ? ((resolvedSubmissions / totalSubmissions) * 100).toFixed(1) : '0',
    averageResolutionTime: '2.3 days', // Mock data
    satisfactionScore: '4.2/5', // Mock data
    priorityDistribution: {
      high: formSubmissions.filter(s => s.priority === 'HIGH').length,
      medium: formSubmissions.filter(s => s.priority === 'MEDIUM').length,
      low: formSubmissions.filter(s => s.priority === 'LOW').length,
      critical: formSubmissions.filter(s => s.priority === 'CRITICAL').length,
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/feedback/management')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600">{form.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={form.isActive ? 'default' : 'secondary'}>
            {form.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="outline">
            {form.category?.name || 'General'}
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedSubmissions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{inProgressSubmissions}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">{pendingSubmissions}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="form-structure">Form Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-900">{form.category?.name || 'General'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-gray-900">{form.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900">{new Date(form.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900">{new Date(form.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Response Rate</label>
                  <p className="text-2xl font-bold text-green-600">{analytics.responseRate}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Avg. Resolution Time</label>
                  <p className="text-gray-900">{analytics.averageResolutionTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Satisfaction Score</label>
                  <p className="text-gray-900">{analytics.satisfactionScore}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest feedback submissions for this form</CardDescription>
            </CardHeader>
            <CardContent>
              {formSubmissions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No submissions yet</p>
              ) : (
                <div className="space-y-4">
                  {formSubmissions.slice(0, 10).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {submission.isAnonymous ? 'Anonymous' : submission.submitterName || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          submission.priority === 'CRITICAL' ? 'destructive' :
                          submission.priority === 'HIGH' ? 'destructive' :
                          submission.priority === 'MEDIUM' ? 'default' : 'secondary'
                        }>
                          {submission.priority}
                        </Badge>
                        <Badge variant={
                          submission.status === 'RESOLVED' ? 'default' :
                          submission.status === 'CLOSED' ? 'default' :
                          submission.status === 'IN_PROGRESS' ? 'secondary' : 'outline'
                        }>
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High Priority</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${totalSubmissions > 0 ? (analytics.priorityDistribution.high / totalSubmissions) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{analytics.priorityDistribution.high}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Medium Priority</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${totalSubmissions > 0 ? (analytics.priorityDistribution.medium / totalSubmissions) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{analytics.priorityDistribution.medium}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Low Priority</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${totalSubmissions > 0 ? (analytics.priorityDistribution.low / totalSubmissions) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{analytics.priorityDistribution.low}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Critical Priority</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${totalSubmissions > 0 ? (analytics.priorityDistribution.critical / totalSubmissions) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{analytics.priorityDistribution.critical}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{totalSubmissions}</div>
                    <div className="text-sm text-gray-600">Total Submissions</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resolved</span>
                      <span className="font-medium text-green-600">{resolvedSubmissions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>In Progress</span>
                      <span className="font-medium text-yellow-600">{inProgressSubmissions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="font-medium text-red-600">{pendingSubmissions}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="form-structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>Structure and configuration of this feedback form</CardDescription>
            </CardHeader>
            <CardContent>
              {form.sections && form.sections.length > 0 ? (
                <div className="space-y-6">
                  {form.sections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">{section.title}</h3>
                      {section.questions && section.questions.length > 0 ? (
                        <div className="space-y-3">
                          {section.questions.map((question) => (
                            <div key={question.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <p className="text-sm font-medium">{question.title}</p>
                                <p className="text-xs text-gray-500">{question.type}</p>
                              </div>
                              <Badge variant={question.isRequired ? 'default' : 'secondary'} className="text-xs">
                                {question.isRequired ? 'Required' : 'Optional'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No questions in this section</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No form structure available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackFormDetails;
