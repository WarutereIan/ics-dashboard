import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Upload, Download, File, Eye, Trash2, Plus, FilePlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDashboard } from '@/contexts/DashboardContext';
import { getProjectReports, getProjectActivities, getProjectOutputs, getProjectOutcomes } from '@/lib/icsData';
import { Report } from '@/types/dashboard';

export function Reports() {
  const { projectId } = useParams();
  const { user } = useDashboard();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<'activity' | 'output' | 'outcome' | ''>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  // Get per-project reports
  const reports: Report[] = projectId ? getProjectReports(user, projectId) : [];
  const activities = projectId ? getProjectActivities(user, projectId) : [];
  const outputs = projectId ? getProjectOutputs(user, projectId) : [];
  const outcomes = projectId ? getProjectOutcomes(user, projectId) : [];

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
      quarterly: 'bg-blue-100 text-blue-800',
      annual: 'bg-purple-100 text-purple-800',
      monthly: 'bg-green-100 text-green-800',
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

  const filteredReports = selectedCategory === 'all' 
    ? reports 
    : reports.filter(report => report.category === selectedCategory);

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

  return (
    <div className="flex flex-col flex-1 w-full min-w-0 px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 w-full min-w-0">
        <div className="w-full min-w-0">
          <h1 className="text-3xl font-bold text-foreground break-words whitespace-normal">Reports</h1>
          <p className="text-muted-foreground break-words whitespace-normal">Manage project reports and documentation</p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0 w-full min-w-0">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <FilePlus className="h-4 w-4" />
                Create from Data
              </Button>
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
                      setReportType(e.target.value as 'activity' | 'output' | 'outcome' | '');
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Report</DialogTitle>
                <DialogDescription>
                  Upload a new report file to the project repository
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">File</Label>
                  <Input id="file" type="file" accept=".pdf,.xlsx,.docx,.doc" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter report description..." />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select id="category" className="w-full p-2 border rounded">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                    <option value="adhoc">Ad-hoc</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setUploadDialogOpen(false)}>
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="annual">Annual</TabsTrigger>
          <TabsTrigger value="adhoc">Ad-hoc</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4 w-full">
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
                    <div>Uploaded by <span className="font-medium text-foreground">{report.uploadedBy}</span></div>
                    <div>Last modified: {new Date(report.lastModified).toLocaleDateString()} by <span className="font-medium text-foreground">{report.lastModifiedBy}</span></div>
                  </div>
                </CardHeader>
                <CardContent className="w-full min-w-0">
                  <p className="text-sm text-muted-foreground mb-4 break-words whitespace-normal w-full">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-2 w-full min-w-0">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button variant="default" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && (
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 