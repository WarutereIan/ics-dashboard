import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DocumentTextIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, DocumentIcon, EyeIcon, TrashIcon, PlusIcon, MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { DocumentPlusIcon, HashtagIcon, BuildingOfficeIcon, DocumentTextIcon as FileTextIcon } from '@heroicons/react/24/outline';

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
import { ReportWorkflowDetail } from './ReportWorkflowDetail';
import { reportWorkflowService } from '@/services/reportWorkflowService';
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
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');
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
  const [openWorkflowId, setOpenWorkflowId] = useState<string | null>(null);

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
        return <DocumentTextIcon className="h-4 w-4 text-red-500" />;
      case 'excel':
        return <DocumentIcon className="h-4 w-4 text-green-500" />;
      case 'word':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <DocumentIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      weekly: 'bg-cyan-100 text-cyan-800',
      bimonthly: 'bg-teal-100 text-teal-800',
      monthly: 'bg-green-100 text-green-800',
      quarterly: 'bg-emerald-100 text-emerald-800',
      'bi-annual': 'bg-indigo-100 text-indigo-800',
      annual: 'bg-emerald-100 text-purple-800',
      adhoc: 'bg-gray-100 text-gray-800'
    };
    return variants[category as keyof typeof variants] || variants.adhoc;
  };

  const getStatusBadge = (status: string) => {
    const key = (status || '').toLowerCase();
    const variants: Record<string, string> = {
      // File status
      draft: 'bg-yellow-100 text-yellow-800',
      final: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
      // Workflow status
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-emerald-100 text-emerald-800',
      'in review': 'bg-emerald-100 text-emerald-800'
    };
    return variants[key] || variants.draft;
  };

  // Helper function to get file type from extension
  const getFileTypeFromExtension = (fileName?: string): 'pdf' | 'excel' | 'word' | 'other' => {
    if (!fileName || typeof fileName !== 'string') return 'other';
    const parts = fileName.split('.');
    const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : undefined;
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

 

  // Convert backend reports to display format
  const displayReports = reports.map(report => {

    console.log(report);
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
      category: report.category, // Default category
      status: report.status.toLowerCase(),
      uploadedBy: formatUserName(report.createdBy), // Use report.creator instead of report.createdBy
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
        status: report.status
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
    
    // Time filter
    let timeMatch = true;
    if (selectedTimeRange !== 'all') {
      const uploaded = new Date(report.uploadDate).getTime();
      const now = Date.now();
      const ranges: Record<string, number> = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '3m': 90 * 24 * 60 * 60 * 1000,
        '6m': 180 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000,
      };
      const windowMs = ranges[selectedTimeRange];
      if (windowMs) {
        timeMatch = uploaded >= (now - windowMs);
      }
    }

    return frequencyMatch && reportTypeMatch && activityMatch && categoryMatch && timeMatch;
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

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(0)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
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

  const handleOpenAudit = async (reportId: string) => {
    try {
      // Prefer loading by file id (report id here is the file/report id from reports table)
      const wf = await reportWorkflowService.getByFile(reportId);
      if (wf && wf.id) {
        setOpenWorkflowId(wf.id);
      } else {
        // fallback: try directly as workflow id
        setOpenWorkflowId(reportId);
      }
    } catch (e) {
      console.error('Failed to load workflow for report:', e);
      // fallback
      setOpenWorkflowId(reportId);
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
          <MapPinIcon className="w-3 h-3 mr-1" />
          {parsed.country}-{parsed.region}
        </Badge>
        <Badge variant="outline" className="text-xs">
          <BuildingOfficeIcon className="w-3 h-3 mr-1" />
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
            <ArrowPathIcon className={`h-4 w-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              {/* <Button variant="secondary" className="gap-2">
                <DocumentPlusIcon className="h-4 w-4" />
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
                    <option value="bimonthly">Bi-monthly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="bi-annual">Bi-annual</option>
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
                <PlusIcon className="h-4 w-4" />
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
            <HashtagIcon className="h-4 w-4" />
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
              <SelectItem value="bimonthly">Bi-monthly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="bi-annual">Bi-annual</SelectItem>
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

          {/* Time Range Filter */}
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
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
              setSelectedTimeRange('all');
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
            {(selectedFrequency !== 'all' || selectedReportType !== 'all' || selectedActivity !== 'all' || selectedTimeRange !== 'all') && (
              <span className="ml-2">
                • Filtered by: 
                {selectedFrequency !== 'all' && <span className="ml-1 font-medium">{selectedFrequency}</span>}
                {selectedReportType !== 'all' && <span className="ml-1 font-medium">{REPORT_TYPES.find(t => t.code === selectedReportType)?.name}</span>}
                {selectedActivity !== 'all' && <span className="ml-1 font-medium">{activities.find(a => a.id === selectedActivity)?.title || activities.find(a => a.id === selectedActivity)?.name}</span>}
                {selectedTimeRange !== 'all' && <span className="ml-1 font-medium">{selectedTimeRange}</span>}
              </span>
            )}
          </p>
        </div>

        {/* Reports Table */}
        <div className="w-full overflow-x-auto">
          {filteredReports.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Uploaded</th>
                  <th className="py-3 pr-4">Uploaded By</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 max-w-[420px] cursor-pointer" onClick={() => handleOpenAudit(report.id)}>
                      <div className="flex items-center gap-2">
                        {getFileIcon(report.type)}
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[380px]" title={report.name}>{report.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[380px]" title={report.description}>{report.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge className={getCategoryBadge(report.category)}>{report.category}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge className={getStatusBadge((report).approvalWorkflow.status)}>
                        {((report).approvalWorkflow.status)}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">{new Date(report.uploadDate).toLocaleDateString()}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{report.uploadedBy}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownloadFile(report.id, report.name)}>
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDeleteFile(report.id, report.name)}>
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !isLoadingFiles && (
              <Card className="w-full">
                <CardContent className="text-center py-8 w-full">
                  <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2 break-words whitespace-normal">No reports found</h3>
                  <p className="text-muted-foreground break-words whitespace-normal">
                    No reports available for the selected filters. Upload your first report to get started.
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
        {/* Audit Trail Dialog */}
        <Dialog open={!!openWorkflowId} onOpenChange={(o) => !o && setOpenWorkflowId(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {openWorkflowId && (
              <ReportWorkflowDetail 
                reportId={openWorkflowId} 
                onClose={() => setOpenWorkflowId(null)} 
                onChanged={() => loadReports()}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 