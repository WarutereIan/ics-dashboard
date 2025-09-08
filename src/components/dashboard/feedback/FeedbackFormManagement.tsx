import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare,
  AlertTriangle,
  Phone,
  Users,
  BarChart3,
  Calendar,
  User,
  Eye
} from 'lucide-react';
import FeedbackFormDetails  from './FeedbackFormDetails';
import { useNavigate } from 'react-router-dom';

interface FeedbackFormManagementProps {
  projectId: string;
  projectName?: string;
}

export function FeedbackFormManagement({ projectId, projectName = "ICS Organization" }: FeedbackFormManagementProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mock data for feedback forms
  const mockForms = [
    {
      id: '1',
      title: 'General Feedback Form',
      description: 'Collect general feedback from community members',
      category: 'General',
      priority: 'LOW',
      status: 'active',
      submissions: 45,
      lastModified: '2024-01-15',
      createdBy: 'Admin User'
    },
    {
      id: '2',
      title: 'Safety Incident Report',
      description: 'Report safety concerns and incidents',
      category: 'Safety',
      priority: 'HIGH',
      status: 'active',
      submissions: 12,
      lastModified: '2024-01-10',
      createdBy: 'Admin User'
    },
    {
      id: '3',
      title: 'Emergency Report Form',
      description: 'Report emergency situations',
      category: 'Emergency',
      priority: 'CRITICAL',
      status: 'active',
      submissions: 3,
      lastModified: '2024-01-08',
      createdBy: 'Admin User'
    },
    {
      id: '4',
      title: 'Staff Feedback Form',
      description: 'Feedback about program staff',
      category: 'Staff',
      priority: 'MEDIUM',
      status: 'draft',
      submissions: 0,
      lastModified: '2024-01-12',
      createdBy: 'Admin User'
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
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleFormClick = (formId: string) => {
    navigate(`${formId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Feedback Forms</h1>
        <p className="text-gray-600 mt-2">
          View available feedback forms for {projectName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold">{mockForms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Forms</p>
                <p className="text-2xl font-bold">{mockForms.filter(f => f.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{mockForms.reduce((sum, f) => sum + f.submissions, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Feedback Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockForms.map((form) => (
              <div key={form.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleFormClick(form.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{form.title}</h3>
                      <Badge variant={getPriorityColor(form.priority)}>
                        {form.priority}
                      </Badge>
                      <Badge variant={getStatusColor(form.status)}>
                        {form.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{form.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {form.createdBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {form.submissions} submissions
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Modified {form.lastModified}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleFormClick(form.id);
                    }}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Form Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">General Feedback</h3>
                <p className="text-sm text-gray-600">Community suggestions and feedback</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Safety Incident</h3>
                <p className="text-sm text-gray-600">Report safety concerns and incidents</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 bg-red-100 rounded-lg">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Emergency Report</h3>
                <p className="text-sm text-gray-600">Report emergency situations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
