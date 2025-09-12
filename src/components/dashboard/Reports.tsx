import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Upload, Download, File, Eye, Trash2, Plus, FilePlus, Hash, MapPin, Building, FileText as FileTextIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { Report } from '@/types/dashboard';
import { ReportUpload } from './ReportUpload';
import { NamingConventionForm } from './NamingConventionForm';
import { NamingConventionData, generateFileName, parseFileName, REPORT_TYPES } from '@/lib/namingConvention';
import { PendingReviews } from './PendingReviews';
import { useReport } from '@/contexts/ReportContext';
import { reportService } from '@/services/reportService';
import { useToast } from '@/hooks/use-toast';
import { useNotification } from '@/hooks/useNotification';

export function Reports() {
  const { user } = useAuth();
  const { getProjectActivities, getProjectOutputs, getProjectOutcomes } = useProjects();
  const { reports: contextReports } = useReport();
  const { toast } = useToast();
  const { showSuccess, showError } = useNotification();
  const { projectId } = useParams();
  if (!user || !projectId) return null;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [namingDialogOpen, setNamingDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<'activity' | 'output' | 'outcome' | ''>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [namingData, setNamingData] = useState<NamingConventionData>({
    countryCode: '',
    regionCode: '',
    projectCode: '',
    reportTypeCode: '',
    date: new Date(),
    versionControl: ''
  });
  const [generatedFileName, setGeneratedFileName] = useState<string>('');
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // Get project data for report creation
  const [activities, setActivities] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    const loadProjectData = async () => {
      if (projectId && user) {
        try {
          const [activitiesData, outputsData, outcomesData] = await Promise.all([
            getProjectActivities(projectId),
            getProjectOutputs(projectId),
            getProjectOutcomes(projectId)
          ]);
          setActivities(activitiesData);
          setOutputs(outputsData);
          setOutcomes(outcomesData);
        } catch (error) {
          console.error('Error loading project data:', error);
        }
      }
    };

    loadProjectData();
  }, [projectId, user, getProjectActivities, getProjectOutputs, getProjectOutcomes]);

  // Clear activity filter when report type changes away from ACT
  useEffect(() => {
    if (selectedReportType !== 'ACT') {
      setSelectedActivity('all');
    }
  }, [selectedReportType]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'excel':
        return <File className="h-4 w-4 text-green-500" />;
      case 'word':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      weekly: 'bg-cyan-100 text-cyan-800',
      monthly: 'bg-green-100 text-green-800',
      quarterly: 'bg-blue-100 text-blue-800',
      annual: 'bg-purple-100 text-purple-800',
      adhoc: 'bg-gray-100 text-gray-800'
    };
    return variants[category as keyof typeof variants] || variants.adhoc;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-yellow-100 text-yellow-800',
      final: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  // Helper function to get file type from extension
  const getFileTypeFromExtension = (fileName: string): 'pdf' | 'excel' | 'word' | 'other' => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'doc':
      case 'docx':
        return 'word';
      default:
        return 'other';
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert backend reports to display format
  const displayReports = reports.map(report => {
    // Helper function to format user name
    const formatUserName = (user: any) => {
      if (!user) return 'Unknown';
      return `${user.firstName} ${user.lastName}`.trim() || user.email || 'Unknown';
    };

    return {
      id: report.id,
      name: report.title,
      type: getFileTypeFromExtension(report.title),
      size: report.fileSize,
      uploadDate: report.createdAt,
      description: report.description,
      category: 'adhoc', // Default category
      status: report.status.toLowerCase(),
      uploadedBy: formatUserName(report.creator), // Use report.creator instead of report.createdBy
      lastModified: report.updatedAt || report.createdAt,
      lastModifiedBy: formatUserName(report.updater), // Use report.updater instead of report.updatedBy
      projectId: projectId,
      currentAuthLevel: 'branch-admin' as const,
      approvalWorkflow: {
        id: report.id,
        reportId: report.id,
        projectId: projectId,
        createdAt: report.createdAt,
        createdBy: formatUserName(report.creator), // Use report.creator instead of report.createdBy
        currentStep: 1,
        totalSteps: 4,
        steps: [],
        status: 'pending' as const
      },
      isPendingReview: false,
      fileUrl: report.fileUrl, // Link to backend file
      // Audit information
      auditInfo: {
        createdBy: report.creator, // Use the full user object
        updatedBy: report.updater, // Use the full user object
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      }
    } as Report & { fileUrl: string; auditInfo: any };
  });


  // Simplified filtering logic - for now, just return all reports if filters are 'all'
  const filteredReports = displayReports.filter(report => {
    // For now, let's be more permissive with filtering to debug the issue
    const frequencyMatch = selectedFrequency === 'all' || report.category === selectedFrequency;
    const categoryMatch = selectedCategory === 'all' || report.category === selectedCategory;
    
    // Report type filter - be more flexible
    let reportTypeMatch = true;
    if (selectedReportType !== 'all') {
      // Check if the report name contains the selected report type
      reportTypeMatch = !!(report.name && (
        report.name.includes(`_${selectedReportType}_`) ||
        report.name.toLowerCase().includes(selectedReportType.toLowerCase())
      ));
    }
    
    // Activity filter - only apply if we have activity data
    const activityMatch = selectedActivity === 'all' || 
      !(report as any).activityId || // If no activityId, it's not an activity report
      (report as any).activityId === selectedActivity;
    
    
    return frequencyMatch && reportTypeMatch && activityMatch && categoryMatch;
  });


  // Helper for report type options
  const reportTypeOptions = [
    { value: 'activity', label: 'Activity' },
    { value: 'output', label: 'Output' },
    { value: 'outcome', label: 'Outcome' },
  ];

  // Get relevant items for the selected report type
  let relevantItems: { id: string; title: string }[] = [];
  if (reportType === 'activity') {
    relevantItems = activities.map(a => ({ id: a.id, title: a.title }));
  } else if (reportType === 'output') {
    relevantItems = outputs.map((o: any) => ({ id: o.id, title: o.title }));
  } else if (reportType === 'outcome') {
    relevantItems = outcomes.map(o => ({ id: o.id, title: o.title }));
  }

  const handleNamingDataChange = (data: NamingConventionData, fileName: string) => {
    setNamingData(data);
    setGeneratedFileName(fileName);
  };

  // Load reports from backend API
  const loadReports = async () => {
    setIsLoadingFiles(true);
    try {
      const response = await reportService.getReports(projectId);
      if (response.success && response.data) {
        setReports(response.data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      showError(
        "Load Failed",
        "Failed to load reports from the server"
      );
      setReports([]);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Load reports on component mount and when projectId changes
  useEffect(() => {
    if (projectId) {
      loadReports();
    }
  }, [projectId]);

  const handleFilesUploaded = (files: any[]) => {
    setUploadDialogOpen(false);
    // Reload reports after upload
    loadReports();
  };

  // Handle file download
  const handleDownloadFile = async (reportId: string, fileName: string) => {
    try {
      await reportService.downloadReportFile(projectId, reportId);
      showSuccess(
        "Download Complete",
        "File downloaded successfully"
      );
    } catch (error) {
      console.error('Error downloading file:', error);
      showError(
        "Download Failed",
        error instanceof Error ? error.message : "Failed to download file"
      );
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (reportId: string, fileName: string) => {
    try {
      await reportService.deleteReportFile(projectId, reportId);
      showSuccess(
        "File Deleted",
        "Report file has been deleted successfully"
      );
      // Reload reports after deletion
      loadReports();
    } catch (error) {
      console.error('Error deleting file:', error);
      showError(
        "Delete Failed",
        error instanceof Error ? error.message : "Failed to delete file"
      );
    }
  };

  const parseNamingConvention = (fileName: string) => {
    const parsed = parseFileName(fileName);
    if (!parsed) return null;
    
    return {
      country: parsed.countryCode,
      region: parsed.regionCode,
      project: parsed.projectCode,
      reportType: parsed.reportTypeCode,
      date: parsed.date,
      version: parsed.versionControl
    };
  };

  const getNamingConventionDisplay = (fileName: string) => {
    const parsed = parseNamingConvention(fileName);
    if (!parsed) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        <Badge variant="outline" className="text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          {parsed.country}-{parsed.region}
        </Badge>
        <Badge variant="outline" className="text-xs">
          <Building className="w-3 h-3 mr-1" />
          {parsed.project}
        </Badge>
        <Badge variant="outline" className="text-xs">
          <FileTextIcon className="w-3 h-3 mr-1" />
          {parsed.reportType}
        </Badge>
        {parsed.version && (
          <Badge variant="secondary" className="text-xs">
            {parsed.version}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 w-full min-w-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 w-full min-w-0">
        <div className="w-full min-w-0">
          <h1 className="text-3xl font-bold text-foreground break-words whitespace-normal">Reports</h1>
          <p className="text-muted-foreground break-words whitespace-normal">Manage project reports and documentation</p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0 w-full min-w-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadReports}
            disabled={isLoadingFiles}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              {/* <Button variant="secondary" className="gap-2">
                <FilePlus className="h-4 w-4" />
                Create from Data
              </Button> */}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Report from Existing Data</DialogTitle>
                <DialogDescription>
                  Generate a new report using current project data 
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <select
                    id="report-type"
                    className="w-full p-2 border rounded"
                    value={reportType}
                    onChange={e => {
                      setReportType(e.target.value as 'activity' | 'output' | 'outcome' );
                      setSelectedItemId('');
                    }}
                  >
                    <option value="">Select type...</option>
                    {reportTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {reportType && (
                  <div>
                    <Label htmlFor="report-item">Related {reportType.charAt(0).toUpperCase() + reportType.slice(1)}</Label>
                    <select
                      id="report-item"
                      className="w-full p-2 border rounded break-words whitespace-normal"
                      value={selectedItemId}
                      onChange={e => setSelectedItemId(e.target.value)}
                      style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                    >
                      <option value="">Select...</option>
                      {relevantItems.map(item => (
                        <option key={item.id} value={item.id} className="break-words whitespace-normal" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.title}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input id="report-title" placeholder="e.g. Custom Data Report" />
                </div>
                <div>
                  <Label htmlFor="report-desc">Description</Label>
                  <Textarea id="report-desc" placeholder="Describe the report..." />
                </div>
                <div>
                  <Label htmlFor="report-category">Category</Label>
                  <select id="report-category" className="w-full p-2 border rounded">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                    <option value="adhoc">Ad-hoc</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setCreateDialogOpen(false)}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Reports with Naming Convention</DialogTitle>
                <DialogDescription>
                  Upload report files and automatically rename them according to the hierarchical geographic naming protocol
                </DialogDescription>
              </DialogHeader>
              <ReportUpload
                onFilesUploaded={handleFilesUploaded}
                maxFiles={10}
                allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv']}
                maxFileSize={50}
              />
            </DialogContent>
          </Dialog>
        
        </div>
      </div>

      {/* Pending Reviews Section */}
      <PendingReviews projectId={projectId} />

      {/* Loading indicator */}
      {isLoadingFiles && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          {/* Frequency Filter */}
          <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Frequencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequencies</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="adhoc">Ad-hoc</SelectItem>
            </SelectContent>
          </Select>

          {/* Report Type Filter */}
          <Select value={selectedReportType} onValueChange={setSelectedReportType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Report Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Report Types</SelectItem>
              {REPORT_TYPES.map((type) => (
                <SelectItem key={type.code} value={type.code}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Activity Filter - Only show for Activity Reports */}
          {selectedReportType === 'ACT' && (
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Activities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                {activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.title || activity.name || `Activity ${activity.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedFrequency('all');
              setSelectedReportType('all');
              setSelectedActivity('all');
              setSelectedCategory('all');
            }}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredReports.length} of {reports.length} reports
            {(selectedFrequency !== 'all' || selectedReportType !== 'all' || selectedActivity !== 'all') && (
              <span className="ml-2">
                • Filtered by: 
                {selectedFrequency !== 'all' && <span className="ml-1 font-medium">{selectedFrequency}</span>}
                {selectedReportType !== 'all' && <span className="ml-1 font-medium">{REPORT_TYPES.find(t => t.code === selectedReportType)?.name}</span>}
                {selectedActivity !== 'all' && <span className="ml-1 font-medium">{activities.find(a => a.id === selectedActivity)?.title || activities.find(a => a.id === selectedActivity)?.name}</span>}
              </span>
            )}
          </p>
        </div>

        {/* Reports Grid */}
        <div className="space-y-4 w-full">
          <div className="grid gap-4 w-full min-w-0">
            {filteredReports.map((report) => (
              <Card key={report.id} className="transition-all duration-200 hover:shadow-md w-full break-words whitespace-normal min-w-0">
                <CardHeader className="pb-3 w-full min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 w-full min-w-0">
                    <div className="flex items-center gap-3 w-full min-w-0">
                      {getFileIcon(report.type)}
                      <div className="w-full min-w-0">
                        <CardTitle className="text-lg break-words whitespace-normal w-full">{report.name}</CardTitle>
                        <CardDescription className="text-sm break-words whitespace-normal w-full">
                          {report.size} • Uploaded on {new Date(report.uploadDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full min-w-0">
                      <Badge className={getCategoryBadge(report.category)}>
                        {report.category}
                      </Badge>
                      <Badge className={getStatusBadge(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground w-full min-w-0">
                    <div className="flex items-center gap-1">
                      <span>Uploaded by</span>
                      <span className="font-medium text-foreground">{report.uploadedBy}</span>
                      <span>on {new Date(report.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Last modified by</span>
                      <span className="font-medium text-foreground">{report.lastModifiedBy}</span>
                      <span>on {new Date(report.lastModified).toLocaleDateString()}</span>
                    </div>
                    {(report as any).activityId && (
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Activity: <span className="font-medium text-foreground">{(report as any).activityName || 'Unknown Activity'}</span>
                      </div>
                    )}
                  </div>
                  {/* Naming Convention Info */}
                  {report.name && getNamingConventionDisplay(report.name)}
                </CardHeader>
                <CardContent className="w-full min-w-0">
                  <p className="text-sm text-muted-foreground mb-4 break-words whitespace-normal w-full">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-2 w-full min-w-0">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDownloadFile(report.id, report.name)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDeleteFile(report.id, report.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && !isLoadingFiles && (
            <Card className="w-full">
              <CardContent className="text-center py-8 w-full">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2 break-words whitespace-normal">No reports found</h3>
                <p className="text-muted-foreground break-words whitespace-normal">
                  No reports available for the selected category. Upload your first report to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 