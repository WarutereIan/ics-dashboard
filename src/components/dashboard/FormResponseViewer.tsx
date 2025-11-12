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
import { formsApi } from '@/lib/api/formsApi';
import { ResponseEditModal } from './ResponseEditModal';
import { useAuth } from '@/contexts/AuthContext';
import { createEnhancedPermissionManager } from '@/lib/permissions';

// Helper function to transform backend question format to frontend format
const transformQuestionData = (question: any) => {
  if (!question.config) return question;
  
  // Extract options from config if they exist
  const config = typeof question.config === 'string' ? JSON.parse(question.config) : question.config;
  
  return {
    ...question,
    options: config.options || [],
    // Extract other config properties that might be expected at top level
    placeholder: config.placeholder,
    min: config.min,
    max: config.max,
    step: config.step,
    allowOther: config.allowOther,
    maxSelections: config.maxSelections,
    displayType: config.displayType,
    statements: config.statements,
    defaultScaleType: config.defaultScaleType,
    defaultLabels: config.defaultLabels,
    // Preserve the original config
    config
  };
};

// Helper function to get all questions (main + conditional) in the correct order
const getAllQuestionsInOrder = (form: Form): Array<{
  question: FormQuestion;
  isConditional: boolean;
  parentQuestion?: FormQuestion;
  parentOption?: any;
}> => {
  const allQuestions: Array<{
    question: FormQuestion;
    isConditional: boolean;
    parentQuestion?: FormQuestion;
    parentOption?: any;
  }> = [];

  form.sections.forEach(section => {
    section.questions.forEach(question => {
      // Add main question
      allQuestions.push({
        question,
        isConditional: false
      });

      // Add conditional questions
      if ((question as any).options && Array.isArray((question as any).options)) {
        (question as any).options.forEach((option: any) => {
          if (option.conditionalQuestions && Array.isArray(option.conditionalQuestions)) {
            option.conditionalQuestions.forEach((condQuestion: any) => {
              allQuestions.push({
                question: condQuestion as FormQuestion,
                isConditional: true,
                parentQuestion: question,
                parentOption: option
              });
            });
          }
        });
      }
    });
  });

  return allQuestions;
};

// Helper function to transform form data structure
const transformFormData = (form: any): Form => {
  if (!form) return form;
  
  return {
    ...form,
    sections: form.sections?.map((section: any) => ({
      ...section,
      questions: section.questions?.map(transformQuestionData) || []
    })) || []
  };
};

// ResponseCell component for displaying different types of response data
interface ResponseCellProps {
  question: FormQuestion;
  value: any;
  attachments: MediaAttachment[];
  isEditable?: boolean;
  onValueChange?: (value: any) => void;
  responseData?: Record<string, any>; // Full response data for conditional questions
}

function ResponseCell({ question, value, attachments, isEditable = false, onValueChange, responseData }: ResponseCellProps) {
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
      if (isEditable) {
        return (
          <Select value={value || ''} onValueChange={onValueChange}>
            <SelectTrigger className="text-xs h-6 px-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      
      const selectedOption = question.options?.find(opt => opt.value.toString() === value?.toString());
      const selectedLabel = selectedOption?.label || value || '-';
      
      // Check if this option has conditional questions and if there are responses for them
      const conditionalResponses = selectedOption?.hasConditionalQuestions && selectedOption?.conditionalQuestions && responseData ? 
        selectedOption.conditionalQuestions.map(conditionalQuestion => {
          const conditionalValue = responseData[conditionalQuestion.id];
          return {
            question: conditionalQuestion,
            value: conditionalValue
          };
        }).filter(item => item.value !== undefined) : [];
      
      return (
        <div className="text-xs leading-tight space-y-1">
          <div className="font-medium">{selectedLabel}</div>
          {conditionalResponses.length > 0 && (
            <div className="ml-2 pl-2 border-l-2 border-blue-200 space-y-1">
              {conditionalResponses.map(({ question: conditionalQuestion, value: conditionalValue }) => (
                <div key={conditionalQuestion.id} className="text-gray-600">
                  <span className="font-medium">{conditionalQuestion.title}:</span>{' '}
                  <span>{conditionalValue || '-'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'MULTIPLE_CHOICE':
      if (Array.isArray(value) && question.options) {
        const selectedLabels = value
          .map(v => question.options?.find(opt => opt.value === v)?.label || v)
          .join(', ');
        
        // Check for conditional questions
        const conditionalResponses = question.options
          .filter(option => 
            option.hasConditionalQuestions && 
            option.conditionalQuestions && 
            value.includes(option.value.toString())
          )
          .flatMap(option => 
            option.conditionalQuestions!.map(conditionalQuestion => {
              const conditionalValue = responseData?.[conditionalQuestion.id];
              return { question: conditionalQuestion, value: conditionalValue };
            }).filter(item => item.value !== undefined)
          );
        
        return (
          <div className="text-xs leading-tight space-y-1">
            <div className="font-medium">{selectedLabels || '-'}</div>
            {conditionalResponses.length > 0 && (
              <div className="ml-2 pl-2 border-l-2 border-blue-200 space-y-1">
                {conditionalResponses.map(({ question: conditionalQuestion, value: conditionalValue }) => (
                  <div key={conditionalQuestion.id} className="text-gray-600">
                    <span className="font-medium">{conditionalQuestion.title}:</span>{' '}
                    <span>{conditionalValue || '-'}</span>
                  </div>
                ))}
              </div>
            )}
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

    case 'LOCATION':
      if (!value) {
        return <div className="text-xs text-gray-400 leading-tight">No location captured</div>;
      }
      
      const formatCoordinates = (lat: number, lng: number) => {
        const latDir = lat >= 0 ? 'N' : 'S';
        const lngDir = lng >= 0 ? 'E' : 'W';
        return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`;
      };
      
      return (
        <div className="text-xs leading-tight space-y-1">
          <div className="font-medium">📍 {formatCoordinates(value.latitude, value.longitude)}</div>
          {value.accuracy && (
            <div className="text-gray-600">Accuracy: {value.accuracy}m</div>
          )}
          {value.address && (
            <div className="text-gray-600 truncate" title={value.address}>
              {value.address}
            </div>
          )}
          <div className="text-gray-500 text-xs">
            {new Date(value.timestamp).toLocaleString()}
          </div>
        </div>
      );

    case 'LIKERT_SCALE':
      if (!value || typeof value !== 'object') {
        return <div className="text-xs text-gray-400 leading-tight">No responses</div>;
      }
      
      // Handle new Likert scale structure with per-statement responses
      const responses = Object.entries(value).map(([statementId, scaleValue]) => {
        // Check if question has statements (new structure) or is old structure
        if (!question.statements || question.statements.length === 0) {
          // Handle old Likert scale structure
          return {
            statementId,
            statement: `Statement ${statementId}`,
            response: String(scaleValue),
            scaleType: '5_POINT' as const // Default for old structure
          };
        }
        
        const statement = question.statements.find(s => s.id === statementId);
        if (!statement) return null;
        
        // Get scale options for this statement
        const getScaleOptions = (scaleType: '3_POINT' | '5_POINT' | '7_POINT', customLabels?: any) => {
          switch (scaleType) {
            case '3_POINT':
              return [
                { value: '1', label: customLabels?.negative || question.defaultLabels?.negative || 'Disagree' },
                { value: '2', label: customLabels?.neutral || question.defaultLabels?.neutral || 'Neutral' },
                { value: '3', label: customLabels?.positive || question.defaultLabels?.positive || 'Agree' }
              ];
            case '5_POINT':
              return [
                { value: '1', label: 'Strongly disagree' },
                { value: '2', label: 'Disagree' },
                { value: '3', label: 'Neither agree nor disagree' },
                { value: '4', label: 'Agree' },
                { value: '5', label: 'Strongly agree' }
              ];
            case '7_POINT':
              return [
                { value: '1', label: 'Strongly disagree' },
                { value: '2', label: 'Disagree' },
                { value: '3', label: 'Somewhat disagree' },
                { value: '4', label: 'Neither agree nor disagree' },
                { value: '5', label: 'Somewhat agree' },
                { value: '6', label: 'Agree' },
                { value: '7', label: 'Strongly agree' }
              ];
            default:
              return [
                { value: '1', label: 'Strongly disagree' },
                { value: '2', label: 'Disagree' },
                { value: '3', label: 'Neither agree nor disagree' },
                { value: '4', label: 'Agree' },
                { value: '5', label: 'Strongly agree' }
              ];
          }
        };
        
        const scaleOptions = getScaleOptions(statement.scaleType, statement.customLabels);
        const selectedOption = scaleOptions.find(opt => opt.value === scaleValue);
        
        return {
          statementId,
          statement: statement.text,
          response: selectedOption ? `${selectedOption.value} (${selectedOption.label})` : String(scaleValue),
          scaleType: statement.scaleType,
          scaleOptions
        };
      }).filter((response): response is NonNullable<typeof response> => response !== null);
      
      if (responses.length === 0) {
        return <div className="text-xs text-gray-400 leading-tight">No responses</div>;
      }
      
      if (isEditable) {
        return (
          <div className="space-y-2">
            {responses.map((response, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs font-medium text-gray-700">{response.statement}</div>
                <Select
                  value={String(value[response.statementId] || '')}
                  onValueChange={(newValue) => {
                    if (onValueChange) {
                      const newResponses = { ...value, [response.statementId]: newValue };
                      onValueChange(newResponses);
                    }
                  }}
                >
                  <SelectTrigger className="h-6 text-xs">
                    <SelectValue placeholder="Select response..." />
                  </SelectTrigger>
                  <SelectContent>
                    {response.scaleOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.value} - {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-gray-400 text-[10px]">{response.scaleType.replace('_', '-')} scale</div>
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div className="space-y-1">
          {responses.map((response, index) => (
            <div key={index} className="text-xs leading-tight">
              <div className="font-medium text-gray-700">{response.statement}</div>
              <div className="text-gray-600">{response.response}</div>
              <div className="text-gray-400 text-[10px]">{response.scaleType.replace('_', '-')} scale</div>
            </div>
          ))}
        </div>
      );

    case 'IMAGE_UPLOAD':
    case 'VIDEO_UPLOAD':
    case 'AUDIO_UPLOAD':
    case 'FILE_UPLOAD':
      // Handle both attachments (from database) and direct file data (from responses)
      const mediaFiles = attachments.length > 0 ? attachments : (Array.isArray(value) ? value : []);
      
      if (mediaFiles.length > 0) {
        return (
          <div className="space-y-1">
            {mediaFiles.map((fileData, index) => {
              // Handle both attachment objects and file data objects
              const fileName = fileData.fileName || fileData.name || fileData.originalName || 'Unknown file';
              const fileSize = fileData.fileSize || fileData.size || 0;
              const fileUrl = fileData.url;
              const mimeType = fileData.mimeType || fileData.type || '';
              const fileId = fileData.id || index;
              
              return (
                <div key={fileId} className="flex items-center gap-1 text-xs">
                  <span>{getMediaIcon(mimeType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="truncate leading-tight" title={fileName}>
                      {fileName}
                    </div>
                    <div className="text-gray-500 text-[10px] leading-tight">
                      {formatFileSize(fileSize)}
                      {fileUrl && (
                        <>
                          <br />
                          <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                            title={fileUrl}
                          >
                            {fileUrl}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  {fileUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = fileName;
                        link.click();
                      }}
                      title="Download file"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
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



export function FormResponseViewer() {
  const { formId, projectId } = useParams();
  const navigate = useNavigate();
  const { getFormResponses, deleteFormResponse, getProjectForms, loadProjectForms, addFormResponseToStorage } = useForm();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const permissionManager = createEnhancedPermissionManager({ user, isAuthenticated, isLoading: authLoading });
  const canEdit = projectId ? permissionManager.canEditFormResponses(projectId) : false;
  const canDelete = projectId ? permissionManager.canDeleteFormResponses(projectId) : false;
  
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
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  // Load form and responses
  useEffect(() => {
    const loadData = async () => {
      if (formId && projectId) {
        setIsLoading(true);
        console.log('🔄 FormResponseViewer: Loading fresh data for form:', formId);
        
        try {
          // Load complete form data (with all question details) for editing
          console.log('🔄 FormResponseViewer: Loading complete form data for:', formId);
          const completeForm = await formsApi.getForm(projectId, formId);
          if (completeForm) {
            // Transform the form data to extract options from config
            const transformedForm = transformFormData(completeForm);
            setForm(transformedForm);
            console.log('📋 FormResponseViewer: Loaded complete form with', transformedForm.sections?.length || 0, 'sections');
            console.log('🔍 FormResponseViewer: Raw form data:', JSON.stringify(completeForm, null, 2));
            console.log('🔍 FormResponseViewer: Transformed form data:', JSON.stringify(transformedForm, null, 2));
            // Check first question structure for debugging
            if (transformedForm.sections?.[0]?.questions?.[0]) {
              console.log('🔍 First question structure:', transformedForm.sections[0].questions[0]);
            }
          } else {
            console.log('⚠️ FormResponseViewer: Complete form not found, trying project forms list');
            // Fallback to project forms list if direct form fetch fails
            const projectForms = await loadProjectForms(projectId);
            const foundForm = projectForms.find((f: Form) => f.id === formId);
            if (foundForm) {
              const transformedFallbackForm = transformFormData(foundForm);
              setForm(transformedFallbackForm);
              console.log('📦 FormResponseViewer: Found form in project list:', foundForm.title);
            }
          }

          // Always load fresh responses from API
          console.log('🔄 FormResponseViewer: Loading fresh responses for form:', formId);
          const formResponses = await getFormResponses(projectId, formId);
          setResponses(formResponses);
          console.log('✅ FormResponseViewer: Loaded', formResponses.length, 'fresh responses');
        } catch (error) {
          console.error('❌ FormResponseViewer: Error loading form data:', error);
          toast({
            title: "Error",
            description: "Failed to load form data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [formId, projectId]); // Only depend on stable values, not functions

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

  // Handler functions
  const handleEditResponse = (rowData: any) => {
    if (rowData.isExisting && rowData.responseId) {
      const originalResponse = responses.find(r => r.id === rowData.responseId);
      if (originalResponse) {
        setSelectedResponse(originalResponse);
        setEditModalOpen(true);
      }
    }
  };

  const handleResponseUpdated = (updatedResponse: FormResponse) => {
    setResponses(prev => prev.map(r => r.id === updatedResponse.id ? updatedResponse : r));
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (confirm('Are you sure you want to delete this response? This action cannot be undone.')) {
      try {
        await deleteFormResponse(projectId!, form!.id, responseId);
        setResponses(prev => prev.filter(r => r.id !== responseId));
      } catch (error) {
        console.error('Error deleting response:', error);
      }
    }
  };

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
        // Convert string dates to Date objects if necessary
        const submittedAt = r.submittedAt instanceof Date ? r.submittedAt : new Date(r.submittedAt!);
        const startedAt = r.startedAt instanceof Date ? r.startedAt : new Date(r.startedAt);
        const timeMs = submittedAt.getTime() - startedAt.getTime();
        return acc + timeMs / (1000 * 60); // Convert to minutes
      }, 0) / responses.filter(r => r.isComplete).length || 0,
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
    
    // Helper function to escape CSV values
    const escapeCsvValue = (value: any): string => {
      if (value === null || value === undefined) return '';
      
      const stringValue = String(value);
      // If value contains comma, newline, or quote, wrap in quotes and escape quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Helper function to format GPS coordinates
    const formatGpsCoordinates = (gpsData: any): string => {
      if (!gpsData) return '';
      
      if (typeof gpsData === 'object') {
        // Try different possible property names for coordinates
        if (gpsData.latitude !== undefined && gpsData.longitude !== undefined) {
          return `${gpsData.latitude}, ${gpsData.longitude}`;
        }
        if (gpsData.lat !== undefined && gpsData.lng !== undefined) {
          return `${gpsData.lat}, ${gpsData.lng}`;
        }
        if (gpsData.coordinates) {
          const coords = gpsData.coordinates;
          if (coords.lat !== undefined && coords.lng !== undefined) {
            return `${coords.lat}, ${coords.lng}`;
          }
          if (coords.latitude !== undefined && coords.longitude !== undefined) {
            return `${coords.latitude}, ${coords.longitude}`;
          }
        }
        
        // If it's an object but we can't extract coordinates, log it for debugging
        console.log('🔍 GPS data structure:', gpsData);
        return `[GPS Object: ${JSON.stringify(gpsData)}]`;
      }
      
      return String(gpsData);
    };

    // Helper function to get all questions including conditional ones
    const getAllQuestions = () => {
      const allQuestions: Array<{question: any, sectionTitle: string, isConditional?: boolean, parentQuestionId?: string, parentQuestionTitle?: string, parentOption?: string}> = [];
      
      form.sections.forEach(section => {
        // Add main questions
        section.questions.forEach(question => {
          allQuestions.push({
            question,
            sectionTitle: section.title,
            isConditional: false
          });
          
          // Add conditional questions from choice options
          if ((question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && question.options) {
            question.options.forEach((option: any) => {
              if (option.conditionalQuestions && option.conditionalQuestions.length > 0) {
                option.conditionalQuestions.forEach((conditionalQuestion: any) => {
                  allQuestions.push({
                    question: conditionalQuestion,
                    sectionTitle: section.title,
                    isConditional: true,
                    parentQuestionId: question.id,
                    parentQuestionTitle: question.title,
                    parentOption: option.label
                  });
                });
              }
            });
          }
        });
      });
      
      return allQuestions;
    };

    // Create CSV content
    const headers = [
      'Response ID',
      'Email', 
      'Status', 
      'Submitted At', 
      'Completion Time (minutes)'
    ];
    
    // Add question headers (flatten LOCATION questions)
    const allQuestions = getAllQuestions();
    allQuestions.forEach(({question, sectionTitle, isConditional, parentQuestionTitle, parentOption}) => {
      let headerTitle = question.title;
      if (isConditional) {
        headerTitle = `${question.title} (Conditional: ${parentQuestionTitle} → ${parentOption})`;
      }
      if (question.type === 'LOCATION') {
        headers.push(`${headerTitle} - Latitude`);
        headers.push(`${headerTitle} - Longitude`);
        headers.push(`${headerTitle} - Accuracy`);
        headers.push(`${headerTitle} - Address`);
      } else {
        headers.push(headerTitle);
      }
    });

    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...filteredResponses.map(response => {
        const completionTime = response.submittedAt && response.startedAt
          ? Math.round(((new Date(response.submittedAt)).getTime() - (new Date(response.startedAt)).getTime()) / (1000 * 60))
          : '';

        const row = [
          response.id,
          response.respondentEmail || 'Anonymous',
          response.isComplete ? 'Complete' : 'Incomplete',
          response.submittedAt ? (new Date(response.submittedAt)).toISOString() : 'Not submitted',
          completionTime
        ];
        
        // Add question responses
        allQuestions.forEach(({question, isConditional, parentQuestionId}) => {
          let value;
          let attachments = response.attachments?.filter(att => att.questionId === question.id) || [];
          
          if (isConditional && parentQuestionId) {
            // For conditional questions, extract from nested parent response
            const parentResponseValue = response.data[parentQuestionId];
            if (typeof parentResponseValue === 'object' && parentResponseValue !== null) {
              value = parentResponseValue[question.id];
            } else {
              value = null;
            }
          } else {
            // For main questions, use direct response data
            value = response.data[question.id];
            
            // Handle nested structure for parent questions that have conditional children
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && value._parentValue !== undefined) {
              // This is a parent question with conditional children, use the parent value for display
              value = value._parentValue;
            }
          }
          
          if (question.type === 'LOCATION') {
            // Flatten location into 4 columns
            const lat = value && typeof value === 'object' ? (value.latitude ?? value.lat ?? '') : '';
            const lng = value && typeof value === 'object' ? (value.longitude ?? value.lng ?? '') : '';
            const acc = value && typeof value === 'object' ? (value.accuracy ?? '') : '';
            const addr = value && typeof value === 'object' ? (value.address ?? '') : '';
            row.push(String(lat));
            row.push(String(lng));
            row.push(String(acc));
            row.push(String(addr));
          } else {
            let displayValue = '';
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                displayValue = value.join('; ');
              } else if (question.type === 'SINGLE_CHOICE' && question.options) {
                const option = question.options.find((opt: any) => opt.value === value);
                displayValue = option ? option.label : String(value);
              } else if (question.type === 'MULTIPLE_CHOICE' && question.options) {
                // For multiple choice, value should be an array of selected values
                const selectedOptions = Array.isArray(value) ? value : [value];
                const optionLabels = selectedOptions.map((val: any) => {
                  const option = question.options.find((opt: any) => opt.value === val);
                  return option ? option.label : val;
                });
                displayValue = optionLabels.join('; ');
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
          }
        });
        
        return row.map(escapeCsvValue).join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Response data has been exported to CSV with improved formatting.",
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

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isLoading ? 'Loading Fresh Data' : 'Form Not Found'}
          </h3>
          <p className="text-gray-600">
            {isLoading ? 'Fetching latest form and response data from API...' : 'The requested form could not be found.'}
          </p>
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
                        
                        {/* Question columns - including conditional questions */}
                        {form && getAllQuestionsInOrder(form).map(({ question, isConditional, parentQuestion, parentOption }) => {
                          if (isConditional) {
                            // Conditional question column
                            return (
                              <TableHead key={question.id} className="min-w-[150px] border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 bg-blue-50">
                                <div>
                                  <div className="font-medium text-blue-800">
                                    {question.title}
                                    <span className="text-blue-600 ml-1">*</span>
                                  </div>
                                  <div className="text-blue-600 text-xs">
                                    {question.type.replace('_', ' ')} (conditional)
                                  </div>
                                  <div className="text-blue-500 text-xs">
                                    from: {parentQuestion?.title} → {parentOption?.label}
                                  </div>
                                </div>
                              </TableHead>
                            );
                          } else {
                            // Main question column
                            return (
                              <TableHead key={question.id} className="min-w-[150px] border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900">
                                <div>
                                  <div className={`${question.isRequired ? 'font-bold' : 'font-medium'}`}>
                                    {question.title}
                                    {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                                  </div>
                                  <div className="text-gray-500">{question.type.replace('_', ' ')}</div>
                                </div>
                              </TableHead>
                            );
                          }
                        })}
                        
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
                          ? Math.round(((new Date(row.submittedAt)).getTime() - (new Date(row.startedAt)).getTime()) / (1000 * 60))
                        : null;

                      return (
                          <TableRow key={row.rowIndex} className={`border-b border-gray-300 ${!row.isExisting ? 'bg-gray-50' : ''}`}>
                            {/* Row ID cell - stays on the left */}
                            <TableCell className="sticky left-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              <div className="text-xs font-medium">
                                {row.rowIndex + 1}
                            </div>
                          </TableCell>
                            
                            {/* Question response cells - matching the header structure exactly */}
                            {form && getAllQuestionsInOrder(form).map(({ question, isConditional, parentQuestion }) => {
                              if (isConditional) {
                                // For conditional questions, extract response from parent question's nested data
                                const parentResponseValue = row.data[parentQuestion?.id || ''];
                                const conditionalResponse = (typeof parentResponseValue === 'object' && parentResponseValue !== null) 
                                  ? parentResponseValue[question.id] 
                                  : null;
                                
                                return (
                                  <TableCell key={question.id} className="min-w-[150px] border border-gray-300 px-2 py-2 bg-blue-50">
                                    <div className="text-xs">
                                      {conditionalResponse !== null && conditionalResponse !== undefined ? (
                                        <div className="text-blue-800">
                                          {typeof conditionalResponse === 'object' 
                                            ? JSON.stringify(conditionalResponse) 
                                            : String(conditionalResponse)
                                          }
                                        </div>
                                      ) : (
                                        <div className="text-gray-400 italic">No response</div>
                                      )}
                                    </div>
                                  </TableCell>
                                );
                              } else {
                                // For main questions, use the standard ResponseCell
                                const responseValue = row.data[question.id];
                                const attachments = row.attachments?.filter((att: any) => att.questionId === question.id) || [];
                                
                                // Extract the actual parent response value (handle nested structure)
                                let actualResponseValue = responseValue;
                                if (typeof responseValue === 'object' && responseValue !== null && !Array.isArray(responseValue) && responseValue._parentValue !== undefined) {
                                  actualResponseValue = responseValue._parentValue;
                                }
                                
                                return (
                                  <TableCell key={question.id} className="min-w-[150px] border border-gray-300 px-2 py-2">
                                    <ResponseCell 
                                      question={question}
                                      value={actualResponseValue}
                                      attachments={attachments}
                                      isEditable={!row.isExisting}
                                      onValueChange={(value) => handleManualDataChange(row.rowIndex, question.id, value)}
                                      responseData={row.data}
                                    />
                                  </TableCell>
                                );
                              }
                            })}
                            
                            {/* Metadata cells - moved to the right */}
                            <TableCell className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              <Badge variant={row.isComplete ? 'default' : 'secondary'} className="text-xs">
                                {row.isExisting ? (row.isComplete ? 'Complete' : 'Incomplete') : 'Draft'}
                            </Badge>
                          </TableCell>
                            <TableCell className="sticky right-0 bg-white z-10 border border-gray-300 px-2 py-2">
                              <div className="text-xs">
                                {row.isExisting && row.submittedAt
                                  ? (new Date(row.submittedAt)).toLocaleDateString()
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
                              (canEdit || canDelete) ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-6 w-6 p-0">
                                          <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {canEdit && (
                                      <DropdownMenuItem 
                                        onClick={() => handleEditResponse(row)}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Response
                                      </DropdownMenuItem>
                                    )}
                                    {canDelete && (
                                      <DropdownMenuItem 
                                            onClick={() => handleDeleteResponse(row.responseId!)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : null
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
                        {responses.filter(r => r.startedAt && (new Date(r.startedAt)).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
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
      
      {/* Response Edit Modal */}
        {selectedResponse && form && projectId && (
          <ResponseEditModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedResponse(null);
            }}
            form={form}
            response={selectedResponse}
            projectId={projectId}
            onResponseUpdated={handleResponseUpdated}
          />
        )}
        </div>

        
    
    );
  }
 