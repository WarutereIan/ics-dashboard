import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Shield
} from 'lucide-react';
import { FeedbackSubmissionInterface } from './FeedbackSubmissionInterface';
import { FeedbackManagementInterface } from './FeedbackManagementInterface';
import { FeedbackFormDetails } from './FeedbackFormDetails';
import { FeedbackForm, FeedbackSubmission } from '../../../types/feedback';

interface FeedbackManagementProps {
  projectId: string;
  projectName: string;
}

export function FeedbackManagement({ projectId, projectName }: FeedbackManagementProps) {
  const [activeTab, setActiveTab] = useState('forms');
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackSubmission[]>([]);

  // Mock data - in real implementation, this would come from API
  const mockForms: FeedbackForm[] = [
    {
      id: 'form1',
      projectId,
      title: 'Community Safety Incident Report',
      description: 'Report safety incidents and concerns in the community',
      category: {
        id: 'safety_incident',
        name: 'Safety Incident',
        description: 'Report safety concerns or incidents',
        type: 'SAFETY_INCIDENT',
        defaultPriority: 'HIGH',
        defaultSensitivity: 'CONFIDENTIAL',
        escalationLevel: 'PROJECT',
        requiresImmediateNotification: true,
        allowedStakeholders: ['community_member', 'program_beneficiary']
      },
      isActive: true,
      allowAnonymous: true,
      requireAuthentication: false,
      sections: [],
      settings: {
        allowAnonymous: true,
        requireAuthentication: false,
        autoAssignPriority: true,
        autoEscalate: true,
        notificationEmails: ['admin@project.com'],
        escalationRules: [],
        confidentialityLevel: 'CONFIDENTIAL',
        responseRequired: true,
        responseDeadline: 24
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin'
    }
  ];

  const mockSubmissions: FeedbackSubmission[] = [
    {
      id: 'sub1',
      formId: 'form1',
      projectId,
      category: mockForms[0].category,
      priority: 'HIGH',
      sensitivity: 'CONFIDENTIAL',
      escalationLevel: 'PROJECT',
      isAnonymous: true,
      data: { incident: 'Broken streetlight', location: 'Main Street' },
      attachments: [],
      status: 'SUBMITTED',
      submittedAt: new Date(),
      updatedAt: new Date(),
      communications: [],
      internalNotes: []
    }
  ];


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

  const handleFormClick = (formId: string) => {
    setSelectedFormId(formId);
  };

  const handleBackToForms = () => {
    setSelectedFormId(null);
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


  // Show form details if a form is selected
  if (selectedFormId) {
    return (
      <FeedbackFormDetails 
        formId={selectedFormId} 
        onBack={handleBackToForms} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Management</h1>
          <p className="text-gray-600 mt-2">
            Manage feedback forms and submissions for {projectName}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockForms.length}</p>
                <p className="text-sm text-gray-600">Active Forms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockSubmissions.filter(s => s.priority === 'HIGH' || s.priority === 'CRITICAL').length}
                </p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockSubmissions.filter(s => s.status === 'SUBMITTED' || s.status === 'ACKNOWLEDGED').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockSubmissions.filter(s => s.status === 'RESOLVED' || s.status === 'CLOSED').length}
                </p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forms">Feedback Forms</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="public">Public Interface</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Forms</CardTitle>
            </CardHeader>
            <CardContent>
              {mockForms.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback forms yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first feedback form to start collecting stakeholder input
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockForms.map((form) => (
                    <Card key={form.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleFormClick(form.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{form.title}</h3>
                              <Badge variant={form.isActive ? 'default' : 'secondary'}>
                                {form.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{form.category.name}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {form.category.allowedStakeholders.length} stakeholder types
                              </div>
                              <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {form.settings.confidentialityLevel}
                              </div>
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {form.category.escalationLevel}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
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
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <FeedbackManagementInterface 
            projectId={projectId}
            submissions={mockSubmissions}
            forms={mockForms}
          />
        </TabsContent>

        <TabsContent value="public" className="space-y-4">
          <FeedbackSubmissionInterface 
            projectId={projectId}
            projectName={projectName}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Configure global settings for the feedback system, including default escalation rules, 
                notification preferences, and stakeholder access controls.
              </p>
              <div className="mt-4">
                <Button variant="outline">
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
