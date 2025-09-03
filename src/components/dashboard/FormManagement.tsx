import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Share2, 
  BarChart3, 
  Download,
  Trash2,
  Copy,
  FileText,
  Calendar,
  Users,
  ArrowLeft,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/contexts/FormContext';
import { toast } from '@/hooks/use-toast';
import { Form } from './form-creation-wizard/types';
import { 
  saveFormManagementFilters, 
  loadFormManagementFilters, 
  clearFormManagementFilters,
  getDefaultFormManagementFilters,
  FormManagementFilters,
  addForm,
  updateForm,
  deleteForm as deleteFormFromStorage,
  duplicateForm as duplicateFormInStorage
} from '@/lib/formLocalStorageUtils';

export function FormManagement() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();
  const { getProjectForms, loadProjectForms } = useForm();
  
  // Load forms from context for the current project
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load forms when component mounts or projectId changes
  useEffect(() => {
    const loadForms = async () => {
      if (projectId) {
        setIsLoading(true);
        console.log('🔄 FormManagement: Loading fresh form data for project:', projectId);
        
        try {
          // Always load fresh data from API instead of cached data
          const freshForms = await loadProjectForms(projectId);
          console.log('✅ FormManagement: Loaded', freshForms.length, 'fresh forms from API');
          
          // If no forms found in API, try loading from legacy storage as fallback
          if (freshForms.length === 0) {
            try {
              const legacyForms = localStorage.getItem('ics_forms_data');
              if (legacyForms) {
                const parsedForms = JSON.parse(legacyForms);
                const projectForms = parsedForms.filter((form: any) => form.projectId === projectId);
                const mappedForms = projectForms.map((form: any) => ({
                  ...form,
                  createdAt: form.createdAt ? new Date(form.createdAt) : new Date(),
                  updatedAt: form.updatedAt ? new Date(form.updatedAt) : new Date(),
                  lastResponseAt: form.lastResponseAt ? new Date(form.lastResponseAt) : undefined,
                  settings: {
                    ...form.settings,
                    expiryDate: form.settings?.expiryDate ? new Date(form.settings.expiryDate) : undefined,
                  },
                }));
                setForms(mappedForms);
                console.log('📦 FormManagement: Loaded', mappedForms.length, 'forms from legacy storage');
              } else {
                console.log('⚠️ FormManagement: No forms found in legacy storage either');
              }
            } catch (error) {
              console.error('❌ FormManagement: Error loading legacy forms:', error);
            }
          } else {
            setForms(freshForms);
          }
        } catch (error) {
          console.error('Error loading forms:', error);
          toast({
            title: "Error",
            description: "Failed to load forms",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadForms();
  }, [projectId]); // Only depend on stable projectId, not functions
  
  // Load saved filters from localStorage
  const [filters, setFilters] = useState<FormManagementFilters>(() => {
    const savedFilters = loadFormManagementFilters();
    return savedFilters || getDefaultFormManagementFilters();
  });


  
  // Get project name from context or use a default
  const projectName = projectId ? `Project ${projectId.toUpperCase()}` : 'Unknown Project';

  // Save filters to localStorage when they change
  useEffect(() => {
    saveFormManagementFilters(filters);
  }, [filters]);

  // Refresh forms when projectId changes or when component comes into focus
  useEffect(() => {
    const refreshForms = async () => {
      if (projectId) {
        console.log('🔄 FormManagement: Refreshing forms for project:', projectId);
        const freshForms = await loadProjectForms(projectId);
        console.log('✅ FormManagement: Refreshed with', freshForms.length, 'fresh forms:', freshForms.map((f: Form) => ({ id: f.id, title: f.title })));
        
        // If no forms found in API, try loading from legacy storage
        if (freshForms.length === 0) {
          try {
            const legacyForms = localStorage.getItem('ics_forms_data');
            if (legacyForms) {
              const parsedForms = JSON.parse(legacyForms);
              const projectForms = parsedForms.filter((form: any) => form.projectId === projectId);
              const processedForms = projectForms.map((form: any) => ({
                ...form,
                createdAt: form.createdAt ? new Date(form.createdAt) : new Date(),
                updatedAt: form.updatedAt ? new Date(form.updatedAt) : new Date(),
                lastResponseAt: form.lastResponseAt ? new Date(form.lastResponseAt) : undefined,
                settings: {
                  ...form.settings,
                  expiryDate: form.settings?.expiryDate ? new Date(form.settings.expiryDate) : undefined,
                },
              }));
              console.log('Found forms in legacy storage:', processedForms.map((f: Form) => ({ id: f.id, title: f.title })));
              setForms(processedForms);
              return;
            }
          } catch (error) {
            console.error('Error loading legacy forms:', error);
          }
        }
        
        setForms(freshForms);
      } else {
        setForms([]);
      }
    };

    // Refresh forms immediately
    refreshForms();

    // Refresh forms when window gains focus (user returns from form wizard)
    const handleFocus = () => {
      refreshForms();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [projectId]); // Only depend on stable projectId, not functions

  // Initialize with sample data if no forms exist (for demonstration)
  useEffect(() => {
    if (projectId && forms.length === 0) {
      // Check if we should initialize with sample data
      const hasInitialized = localStorage.getItem(`ics_forms_initialized_${projectId}`);
     /*  if (!hasInitialized) {
        const sampleForms: Form[] = [
          {
            id: `sample-form-1-${projectId}`,
    title: 'Baseline Survey - Education Project',
    description: 'Initial data collection for the education improvement project',
            projectId: projectId,
            createdBy: user?.id || 'user-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    status: 'PUBLISHED',
    version: 1,
    sections: [],
    settings: {
      requireAuthentication: false,
      thankYouMessage: 'Thank you for your response!',
      notificationEmails: [],
    },
    responseCount: 127,
    lastResponseAt: new Date('2024-01-25'),
    tags: ['baseline', 'education'],
    category: 'Survey',
  },
  {
            id: `sample-form-2-${projectId}`,
    title: 'Monthly Progress Monitoring',
    description: 'Monthly check-in on project activities and outcomes',
            projectId: projectId,
            createdBy: user?.id || 'user-1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    status: 'DRAFT',
    version: 1,
    sections: [],
    settings: {
      requireAuthentication: true,
      thankYouMessage: 'Thank you for your response!',
      notificationEmails: [],
    },
    responseCount: 0,
    tags: ['monitoring', 'monthly'],
    category: 'Monitoring',
  },
];

        sampleForms.forEach(form => addForm(form));
        setForms(sampleForms);
        localStorage.setItem(`ics_forms_initialized_${projectId}`, 'true');
      } */
    }
  }, [projectId, forms.length, user?.id]);

  // Update search term from filters
  const searchTerm = filters.searchTerm;
  const statusFilter = filters.status.length > 0 ? filters.status[0] : 'all';
  const categoryFilter = filters.projectId.length > 0 ? filters.projectId[0] : 'all';

  // Filter forms based on search and filters
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || form.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: Form['status']) => {
    switch (status) {
      case 'PUBLISHED': return 'default';
      case 'DRAFT': return 'secondary';
      case 'CLOSED': return 'destructive';
      case 'ARCHIVED': return 'outline';
      default: return 'secondary';
    }
  };

  const handleCreateForm = () => {
    navigate(`/dashboard/projects/${projectId}/forms/create`);
  };

  const handleEditForm = (formId: string) => {
    navigate(`/dashboard/projects/${projectId}/forms/edit/${formId}`);
  };

  const handleViewForm = (formId: string) => {
    navigate(`/dashboard/projects/${projectId}/forms/preview/${formId}`);
  };

  const handleViewResponses = (formId: string) => {
    navigate(`/dashboard/projects/${projectId}/forms/responses/${formId}`);
  };

  const handleDuplicateForm = async (form: Form) => {
    try {
      const duplicatedForm = duplicateFormInStorage(form);
      setForms(prev => [duplicatedForm, ...prev]);
      
      toast({
        title: "Form Duplicated",
        description: `"${form.title}" has been duplicated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Duplication Failed",
        description: "Could not duplicate the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      deleteFormFromStorage(formId);
      setForms(prev => prev.filter(form => form.id !== formId));
      
      toast({
        title: "Form Deleted",
        description: "The form has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareForm = (form: Form) => {
    // Only allow sharing published forms
    if (form.status !== 'PUBLISHED') {
      toast({
        title: "Cannot Share Form",
        description: "Only published forms can be shared. Please publish the form first.",
        variant: "destructive",
      });
      return;
    }

    const baseUrl = window.location.origin;
    const formUrl = `${baseUrl}/fill/${form.id}`;
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "Link Copied!",
      description: "Form link has been copied to clipboard.",
    });
  };

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  const handleStatusFilterChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: value === 'all' ? [] : [value] 
    }));
  };

  const handleCategoryFilterChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      projectId: value === 'all' ? [] : [value] 
    }));
  };

  const handleClearFilters = () => {
    setFilters(getDefaultFormManagementFilters());
    clearFormManagementFilters();
  };

  return (
    <div className="space-y-6">
      {/* Project Navigation Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/dashboard/projects/${projectId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Button>
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-medium text-gray-700">{projectName}</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">Form Management</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base break-words">Create and manage data collection forms for {projectName}</p>
        </div>
        
        <Button onClick={handleCreateForm} className="flex items-center gap-2 w-full lg:w-auto justify-center lg:justify-start">
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">Create New Form</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{forms.length}</p>
                <p className="text-xs text-gray-500">Total Forms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{forms.filter(f => f.status === 'PUBLISHED').length}</p>
                <p className="text-xs text-gray-500">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{forms.reduce((sum, form) => sum + form.responseCount, 0)}</p>
                <p className="text-xs text-gray-500">Total Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Edit className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{forms.filter(f => f.status === 'DRAFT').length}</p>
                <p className="text-xs text-gray-500">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search forms by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Survey">Survey</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                  <SelectItem value="Evaluation">Evaluation</SelectItem>
                  <SelectItem value="Registration">Registration</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Forms ({filteredForms.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredForms.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {forms.length === 0 ? 'No forms created yet' : 'No forms match your filters'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {forms.length === 0 
                  ? 'Create your first form to start collecting data'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {forms.length === 0 && (
                <Button onClick={handleCreateForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responses</TableHead>
                      <TableHead>Last Response</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.map((form) => (
                      <TableRow 
                        key={form.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleViewResponses(form.id)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium break-words">{form.title}</p>
                            <p className="text-sm text-gray-500 break-words">{form.description}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {form.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(form.status)}>
                            {form.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            {form.responseCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {form.lastResponseAt
                              ? new Date(form.lastResponseAt).toLocaleDateString()
                              : 'None'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(form.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewForm(form.id); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview Form
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditForm(form.id); }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Form
                              </DropdownMenuItem>
                              {form.responseCount > 0 && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewResponses(form.id); }}>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  View Responses ({form.responseCount})
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {form.status === 'PUBLISHED' && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShareForm(form); }}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Link
                              </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateForm(form); }}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => { e.stopPropagation(); handleDeleteForm(form.id); }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredForms.map((form) => (
                  <Card 
                    key={form.id} 
                    className="w-full cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleViewResponses(form.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base break-words">{form.title}</h3>
                            <p className="text-sm text-gray-500 break-words">{form.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 flex-shrink-0 ml-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewForm(form.id); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview Form
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditForm(form.id); }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Form
                              </DropdownMenuItem>
                              {form.responseCount > 0 && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewResponses(form.id); }}>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  View Responses ({form.responseCount})
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {form.status === 'PUBLISHED' && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShareForm(form); }}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Link
                              </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateForm(form); }}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => { e.stopPropagation(); handleDeleteForm(form.id); }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {form.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex flex-col space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <Badge variant={getStatusColor(form.status)}>
                              {form.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Responses:</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              {form.responseCount}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Response:</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-right">
                                {form.lastResponseAt
                                  ? new Date(form.lastResponseAt).toLocaleDateString()
                                  : 'None'
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Created:</span>
                            <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}