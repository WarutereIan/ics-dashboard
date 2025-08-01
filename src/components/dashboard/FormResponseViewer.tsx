import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Download,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  Users,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Form, FormResponse } from './form-creation-wizard/types';

// Mock data - in a real app, this would come from your API
const mockForm: Form = {
  id: 'form-1',
  title: 'Baseline Survey - Education Project',
  description: 'Initial data collection for the education improvement project',
  projectId: 'project-1',
  createdBy: 'user-1',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  status: 'PUBLISHED',
  version: 1,
  sections: [
    {
      id: 'section-1',
      title: 'Personal Information',
      description: 'Basic information about the respondent',
      order: 1,
      questions: [
        {
          id: 'q1',
          type: 'SHORT_TEXT',
          title: 'Full Name',
          description: '',
          isRequired: true,
          validationRules: [],
          dataType: 'TEXT',
          order: 1,
        },
        {
          id: 'q2',
          type: 'NUMBER',
          title: 'Age',
          description: '',
          isRequired: true,
          validationRules: [],
          dataType: 'INTEGER',
          order: 2,
        },
        {
          id: 'q3',
          type: 'SINGLE_CHOICE',
          title: 'Gender',
          description: '',
          isRequired: false,
          validationRules: [],
          dataType: 'TEXT',
          order: 3,
          options: [
            { id: '1', label: 'Male', value: 'male' },
            { id: '2', label: 'Female', value: 'female' },
            { id: '3', label: 'Other', value: 'other' },
          ],
          displayType: 'RADIO',
        },
      ],
    },
  ],
  settings: {
    requireAuthentication: false,
    thankYouMessage: 'Thank you for your response!',
    notificationEmails: [],
  },
  responseCount: 127,
  lastResponseAt: new Date('2024-01-25'),
  tags: ['baseline', 'education'],
  category: 'Survey',
};

const mockResponses: FormResponse[] = [
  {
    id: 'response-1',
    formId: 'form-1',
    formVersion: 1,
    respondentEmail: 'john.doe@example.com',
    startedAt: new Date('2024-01-20T10:00:00'),
    submittedAt: new Date('2024-01-20T10:15:00'),
    isComplete: true,
    data: {
      q1: 'John Doe',
      q2: 28,
      q3: 'male',
    },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
  },
  {
    id: 'response-2',
    formId: 'form-1',
    formVersion: 1,
    respondentEmail: 'jane.smith@example.com',
    startedAt: new Date('2024-01-20T14:00:00'),
    submittedAt: new Date('2024-01-20T14:12:00'),
    isComplete: true,
    data: {
      q1: 'Jane Smith',
      q2: 32,
      q3: 'female',
    },
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0...',
  },
  {
    id: 'response-3',
    formId: 'form-1',
    formVersion: 1,
    startedAt: new Date('2024-01-21T09:00:00'),
    isComplete: false,
    data: {
      q1: 'Mike Johnson',
      q2: 25,
    },
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0...',
  },
];

export function FormResponseViewer() {
  const { formId, projectId } = useParams();
  const navigate = useNavigate();
  
  const [form] = useState<Form>(mockForm);
  const [responses, setResponses] = useState<FormResponse[]>(mockResponses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filter responses
  const filteredResponses = responses.filter((response) => {
    const matchesSearch = searchTerm === '' || 
      response.respondentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(response.data).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'complete' && response.isComplete) ||
      (statusFilter === 'incomplete' && !response.isComplete);
    
    // Date filter logic would go here
    const matchesDate = true; // Simplified for now
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate analytics
  const analytics = {
    totalResponses: responses.length,
    completeResponses: responses.filter(r => r.isComplete).length,
    incompleteResponses: responses.filter(r => !r.isComplete).length,
    averageCompletionTime: responses
      .filter(r => r.isComplete && r.submittedAt && r.startedAt)
      .reduce((acc, r) => {
        const timeMs = r.submittedAt!.getTime() - r.startedAt.getTime();
        return acc + timeMs / (1000 * 60); // Convert to minutes
      }, 0) / responses.filter(r => r.isComplete).length || 0,
  };

  const handleDeleteResponse = async (responseId: string) => {
    try {
      setResponses(prev => prev.filter(r => r.id !== responseId));
      toast({
        title: "Response Deleted",
        description: "The response has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete the response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    // Create CSV content
    const headers = ['Response ID', 'Email', 'Status', 'Submitted At'];
    
    // Add question headers
    form.sections.forEach(section => {
      section.questions.forEach(question => {
        headers.push(question.title);
      });
    });

    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => {
        const row = [
          response.id,
          response.respondentEmail || 'Anonymous',
          response.isComplete ? 'Complete' : 'Incomplete',
          response.submittedAt?.toISOString() || 'Not submitted'
        ];
        
        // Add question responses
        form.sections.forEach(section => {
          section.questions.forEach(question => {
            const value = response.data[question.id];
            row.push(value ? String(value) : '');
          });
        });
        
        return row.join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Response data has been exported to CSV.",
    });
  };

  const QuestionAnalytics = ({ questionId }: { questionId: string }) => {
    const question = form.sections
      .flatMap(s => s.questions)
      .find(q => q.id === questionId);
    
    if (!question) return null;

    const questionResponses = responses
      .filter(r => r.data[questionId] !== undefined)
      .map(r => r.data[questionId]);

    if (question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') {
      const valueCounts = questionResponses.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return (
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">{question.title}</h4>
          <div className="space-y-2">
            {Object.entries(valueCounts).map(([value, count]) => (
              <div key={value} className="flex justify-between items-center">
                <span className="text-sm">{value}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${((count as number) / questionResponses.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{count as number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === 'NUMBER') {
      const numericValues = questionResponses
        .filter(v => typeof v === 'number')
        .sort((a, b) => a - b);
      
      if (numericValues.length === 0) return null;

      const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const median = numericValues[Math.floor(numericValues.length / 2)];

      return (
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">{question.title}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Average</p>
              <p className="font-medium">{avg.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Median</p>
              <p className="font-medium">{median}</p>
            </div>
            <div>
              <p className="text-gray-600">Range</p>
              <p className="font-medium">{min} - {max}</p>
            </div>
            <div>
              <p className="text-gray-600">Responses</p>
              <p className="font-medium">{numericValues.length}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">{question.title}</h4>
        <p className="text-sm text-gray-600">
          {questionResponses.length} response{questionResponses.length !== 1 ? 's' : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(`/dashboard/projects/${projectId}/forms`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600">Form Responses & Analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={form.status === 'PUBLISHED' ? 'default' : 'secondary'}>
            {form.status}
          </Badge>
          <Button onClick={handleExportData} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{analytics.totalResponses}</p>
                <p className="text-xs text-gray-500">Total Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{analytics.completeResponses}</p>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <PieChart className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{analytics.incompleteResponses}</p>
                <p className="text-xs text-gray-500">Incomplete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{analytics.averageCompletionTime.toFixed(1)}m</p>
                <p className="text-xs text-gray-500">Avg. Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="responses" className="w-full">
        <TabsList>
          <TabsTrigger value="responses">Individual Responses</TabsTrigger>
          <TabsTrigger value="analytics">Question Analytics</TabsTrigger>
          <TabsTrigger value="summary">Summary Report</TabsTrigger>
        </TabsList>

        {/* Responses Tab */}
        <TabsContent value="responses" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search responses by email or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Responses ({filteredResponses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredResponses.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No responses found</p>
                  <p className="text-sm text-gray-500">
                    {responses.length === 0 ? 'No responses have been submitted yet' : 'Try adjusting your filters'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Respondent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Completion Time</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((response) => {
                      const completionTime = response.submittedAt && response.startedAt
                        ? Math.round((response.submittedAt.getTime() - response.startedAt.getTime()) / (1000 * 60))
                        : null;

                      return (
                        <TableRow key={response.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {response.respondentEmail || 'Anonymous'}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {response.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={response.isComplete ? 'default' : 'secondary'}>
                              {response.isComplete ? 'Complete' : 'Incomplete'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {response.submittedAt
                                ? response.submittedAt.toLocaleDateString()
                                : 'Not submitted'
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            {completionTime ? `${completionTime}m` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteResponse(response.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Question Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {form.sections.flatMap(section => 
                  section.questions.map(question => (
                    <QuestionAnalytics key={question.id} questionId={question.id} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Form Performance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {((analytics.completeResponses / analytics.totalResponses) * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-blue-700">Completion Rate</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {analytics.averageCompletionTime.toFixed(1)}
                      </p>
                      <p className="text-sm text-green-700">Avg. Minutes</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {form.sections.reduce((total, section) => total + section.questions.length, 0)}
                      </p>
                      <p className="text-sm text-purple-700">Total Questions</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {responses.filter(r => r.startedAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                      </p>
                      <p className="text-sm text-orange-700">This Week</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Activity Integration</h4>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      Response data is automatically synchronized with linked project activities and KPI calculations.
                      Real-time updates are reflected in project dashboards and progress tracking.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}