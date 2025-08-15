import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  MoreVertical,
  Loader2,
  File,
  Image,
  Video,
  Music,
  Paperclip
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Form, FormResponse, FormQuestion, MediaAttachment } from './form-creation-wizard/types';
import { useForm } from '@/contexts/FormContext';

// ResponseCell component for displaying different types of response data
interface ResponseCellProps {
  question: FormQuestion;
  value: any;
  attachments: MediaAttachment[];
  isEditable?: boolean;
  onValueChange?: (value: any) => void;
}

function ResponseCell({ question, value, attachments, isEditable = false, onValueChange }: ResponseCellProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    return '📎';
  };

  // Handle different question types
  switch (question.type) {
    case 'SHORT_TEXT':
      if (isEditable) {
        return (
          <Input
            value={value || ''}
            onChange={(e) => onValueChange?.(e.target.value)}
            className="text-xs h-6 px-1"
            placeholder="Enter value..."
          />
        );
      }
      return (
        <div className="text-xs max-w-[200px] truncate leading-tight" title={value}>
          {value || '-'}
        </div>
      );

    case 'NUMBER':
      if (isEditable) {
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onValueChange?.(e.target.value === '' ? null : Number(e.target.value))}
            className="text-xs h-6 px-1 font-mono"
            placeholder="Enter number..."
          />
        );
      }
      return (
        <div className="text-xs font-mono leading-tight">
          {value !== undefined && value !== null ? value : '-'}
        </div>
      );

    case 'SINGLE_CHOICE':
   
    case 'MULTIPLE_CHOICE':
      if (Array.isArray(value) && question.options) {
        const selectedLabels = value
          .map(v => question.options?.find(opt => opt.value === v)?.label || v)
          .join(', ');
        return (
          <div className="text-xs max-w-[200px] truncate leading-tight" title={selectedLabels}>
            {selectedLabels || '-'}
          </div>
        );
      }
      return <div className="text-xs leading-tight">{Array.isArray(value) ? value.join(', ') : value || '-'}</div>;

    case 'DATE':
    case 'DATETIME':
      return (
        <div className="text-xs leading-tight">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </div>
      );

    case 'SLIDER':
      return (
        <div className="text-xs font-mono leading-tight">
          {value !== undefined && value !== null ? value : '-'}
        </div>
      );

    case 'LIKERT_SCALE':
      return (
        <div className="text-xs leading-tight">
          {value ? `${value.value} (${value.label})` : '-'}
        </div>
      );

    case 'IMAGE_UPLOAD':
    case 'VIDEO_UPLOAD':
    case 'AUDIO_UPLOAD':
    case 'FILE_UPLOAD':
      if (attachments.length > 0) {
        return (
          <div className="space-y-1">
            {attachments.map((attachment, index) => (
              <div key={attachment.id} className="flex items-center gap-1 text-xs">
                <span>{getMediaIcon(attachment.mimeType)}</span>
                <div className="flex-1 min-w-0">
                  <div className="truncate leading-tight" title={attachment.fileName}>
                    {attachment.fileName}
                  </div>
                  <div className="text-gray-500 text-[10px] leading-tight">
                    {formatFileSize(attachment.fileSize)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = attachment.url;
                    link.download = attachment.fileName;
                    link.click();
                  }}
                  title="Download file"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        );
      }
      return <div className="text-xs text-gray-400 leading-tight">No files</div>;

    default:
      return (
        <div className="text-xs max-w-[200px] truncate leading-tight" title={String(value)}>
          {value !== undefined && value !== null ? String(value) : '-'}
        </div>
      );
  }
}

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
  const { getFormResponses, deleteFormResponse, getProjectForms, addFormResponseToStorage } = useForm();
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; questionId: string } | null>(null);
  const [manualData, setManualData] = useState<Record<number, Record<string, any>>>({});

  // Load form and responses
  useEffect(() => {
    if (formId && projectId) {
      // Load form data
      const projectForms = getProjectForms(projectId);
      const foundForm = projectForms.find(f => f.id === formId);
      if (foundForm) {
        setForm(foundForm);
      }

      // Load responses
      const formResponses = getFormResponses(formId);
      setResponses(formResponses);
    }
  }, [formId, projectId, getProjectForms, getFormResponses]);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResponses = filteredResponses.slice(startIndex, endIndex);

  // Generate table rows including blank rows for manual entry
  const generateTableRows = () => {
    const rows = [];
    
    // Add existing responses
    paginatedResponses.forEach((response, index) => {
      rows.push({
        rowIndex: startIndex + index,
        responseId: response.id,
        isExisting: true,
        data: response.data,
        attachments: response.attachments || [],
        respondentEmail: response.respondentEmail,
        isComplete: response.isComplete,
        submittedAt: response.submittedAt,
        startedAt: response.startedAt
      });
    });
    
    // Add blank rows for manual entry
    const blankRowsNeeded = itemsPerPage - paginatedResponses.length;
    for (let i = 0; i < blankRowsNeeded; i++) {
      const rowIndex = startIndex + paginatedResponses.length + i;
      rows.push({
        rowIndex,
        responseId: null,
        isExisting: false,
        data: manualData[rowIndex] || {},
        attachments: [],
        respondentEmail: null,
        isComplete: false,
        submittedAt: null,
        startedAt: null
      });
    }
    
    return rows;
  };

  const tableRows = generateTableRows();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

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
      if (!formId) return;
      
      deleteFormResponse(formId, responseId);
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

  const handleManualDataChange = (rowIndex: number, questionId: string, value: any) => {
    setManualData(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [questionId]: value
      }
    }));
  };

  const handleSaveManualData = (rowIndex: number) => {
    if (!formId || !form) return;
    
    const rowData = manualData[rowIndex];
    if (!rowData || Object.keys(rowData).length === 0) {
      toast({
        title: "No Data to Save",
        description: "Please enter some data before saving.",
        variant: "destructive",
      });
      return;
    }

    // Create a new form response from manual data
    const newResponse: FormResponse = {
      id: `manual-${Date.now()}-${rowIndex}`,
      formId: formId,
      formVersion: form.version || 1,
      respondentEmail: undefined,
      startedAt: new Date(),
      submittedAt: new Date(),
      isComplete: true,
      data: rowData,
      attachments: [],
      ipAddress: 'manual-entry',
      userAgent: 'manual-entry'
    };

    // Add the response to storage
    addFormResponseToStorage(newResponse);
    
    // Clear the manual data for this row
    setManualData(prev => {
      const newData = { ...prev };
      delete newData[rowIndex];
      return newData;
    });

    toast({
      title: "Data Saved",
      description: "Manual data has been saved as a new response.",
    });
  };

  const handleExportData = () => {
    if (!form) return;
    
    // Create CSV content
    const headers = ['Response ID', 'Email', 'Status', 'Submitted At', 'Completion Time (minutes)'];
    
    // Add question headers
    form.sections.forEach(section => {
      section.questions.forEach(question => {
        headers.push(question.title);
      });
    });

    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => {
        const completionTime = response.submittedAt && response.startedAt
          ? Math.round((response.submittedAt.getTime() - response.startedAt.getTime()) / (1000 * 60))
          : '';

        const row = [
          response.id,
          response.respondentEmail || 'Anonymous',
          response.isComplete ? 'Complete' : 'Incomplete',
          response.submittedAt?.toISOString() || 'Not submitted',
          completionTime
        ];
        
        // Add question responses
        form.sections.forEach(section => {
          section.questions.forEach(question => {
            const value = response.data[question.id];
            const attachments = response.attachments?.filter(att => att.questionId === question.id) || [];
            
            let displayValue = '';
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                displayValue = value.join('; ');
              } else if (question.type === 'SINGLE_CHOICE') {
                const option = question.options?.find(opt => opt.value === value);
                displayValue = option ? option.label : String(value);
              } else {
                displayValue = String(value);
              }
            }
            
            // Add attachment info for media uploads
            if (attachments.length > 0) {
              const attachmentInfo = attachments.map(att => `${att.fileName} (${formatFileSize(att.fileSize)})`).join('; ');
              displayValue = displayValue ? `${displayValue} | Files: ${attachmentInfo}` : `Files: ${attachmentInfo}`;
            }
            
            row.push(displayValue);
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
    if (!form) return null;
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

  if (!form) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

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

      {/* Individual Responses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Responses ({filteredResponses.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <div className="overflow-x-auto">
                  <Table className="border-collapse">
                  <TableHeader>
                      <TableRow className="border-b border-gray-300">
                        {/* Row ID column - stays on the left */}
                        <TableHead className="sticky left-0 bg-white z-10 border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900">
                          Row ID
                        </TableHead>
                        
                        {/* Question columns */}
                        {form?.sections.flatMap(section => 
                          section.questions.map(question => (
                            <TableHead key={question.id} className="min-w-[150px] border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900">
                              <div>
                                <div className={`${question.isRequired ? 'font-bold' : 'font-medium'}`}>
                                  {question.title}
                                  {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </div>
                                <div className="text-gray-500">{question.type.replace('_', ' ')}</div>
                              </div>
                            </TableHead>
                          ))
                        )}
                        
                        {/* Metadata columns - moved to the right */}
                        <TableHead className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900">
                          Status
                        </TableHead>
                        <TableHead className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900">
                          Submitted
                        </TableHead>
                        <TableHead className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900">
                          Completion Time
                        </TableHead>
                        <TableHead className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900">
                          Actions
                        </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {tableRows.map((row) => {
                        const completionTime = row.submittedAt && row.startedAt
                          ? Math.round(((row.submittedAt as Date).getTime() - (row.startedAt as Date).getTime()) / (1000 * 60))
                        : null;

                      return (
                          <TableRow key={row.rowIndex} className={`border-b border-gray-300 ${!row.isExisting ? 'bg-gray-50' : ''}`}>
                            {/* Row ID cell - stays on the left */}
                            <TableCell className="sticky left-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              <div className="text-xs font-medium">
                                {row.rowIndex + 1}
                            </div>
                          </TableCell>
                            
                            {/* Question response cells */}
                            {form?.sections.flatMap(section => 
                              section.questions.map(question => {
                                const responseValue = row.data[question.id];
                                const attachments = row.attachments?.filter((att: any) => att.questionId === question.id) || [];
                                
                                return (
                                  <TableCell key={question.id} className="min-w-[150px] border border-gray-300 px-2 py-2">
                                    <ResponseCell 
                                      question={question}
                                      value={responseValue}
                                      attachments={attachments}
                                      isEditable={!row.isExisting}
                                      onValueChange={(value) => handleManualDataChange(row.rowIndex, question.id, value)}
                                    />
                                  </TableCell>
                                );
                              })
                            )}
                            
                            {/* Metadata cells - moved to the right */}
                            <TableCell className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              <Badge variant={row.isComplete ? 'default' : 'secondary'} className="text-xs">
                                {row.isExisting ? (row.isComplete ? 'Complete' : 'Incomplete') : 'Draft'}
                            </Badge>
                          </TableCell>
                            <TableCell className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              <div className="text-xs">
                                {row.isExisting && row.submittedAt
                                  ? (row.submittedAt as Date).toLocaleDateString()
                                  : row.isExisting ? 'Not submitted' : 'Not saved'
                              }
                            </div>
                          </TableCell>
                            <TableCell className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              <div className="text-xs">
                                {row.isExisting && completionTime ? `${completionTime}m` : 'N/A'}
                              </div>
                          </TableCell>
                            <TableCell className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              {row.isExisting ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-6 w-6 p-0">
                                      <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                      onClick={() => handleDeleteResponse(row.responseId!)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveManualData(row.rowIndex)}
                                  className="h-6 px-2 text-xs"
                                  disabled={!manualData[row.rowIndex] || Object.keys(manualData[row.rowIndex] || {}).length === 0}
                                >
                                  Save
                                </Button>
                              )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                </div>
              )}
              
              {/* Pagination Controls */}
              {filteredResponses.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredResponses.length)} of {filteredResponses.length} responses
                    </div>
                    <Select value={String(itemsPerPage)} onValueChange={(value) => setItemsPerPage(Number(value))}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="25">25 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                        <SelectItem value="100">100 per page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Question Analytics Section */}
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

      {/* Summary Report Section */}
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
    </div>
  );
}