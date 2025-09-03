import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Plus,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  MapPin,
  Building,
  Calendar,
  Clock,
  Hash
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NamingConventionForm } from './NamingConventionForm';
import { 
  NamingConventionData, 
  generateFileName, 
  COUNTRIES,
  PROJECTS,
  REPORT_TYPES,
  VERSION_CONTROLS,
  getProjectsByCountry,
  getRegionsByCountry
} from '@/lib/namingConvention';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { useReport } from '@/contexts/ReportContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useProjects } from '@/contexts/ProjectsContext';
// Note: Report workflow users will be fetched from user management API when available
import { storeReportFile, downloadStoredFile, base64ToBlob } from '@/lib/reportFileStorage';
import { v4 as uuidv4 } from 'uuid';
import { Report } from '@/types/dashboard';

interface UploadedFile {
  id: string;
  originalName: string;
  newName: string;
  size: number;
  type: string;
  file: File;
  fileData: string; // Base64 encoded file data for localStorage
  namingData: NamingConventionData;
  uploadedAt: Date;
}

interface ReportUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  maxFileSize?: number; // in MB
}

export function ReportUpload({
  onFilesUploaded,
  maxFiles = 10,
  allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
  maxFileSize = 50 // 50MB default
}: ReportUploadProps) {
  const { createReportWithWorkflow } = useReport();
  const { user } = useAuth();
  const { currentProject } = useDashboard();
  const { projects } = useProjects();
  const { projectId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showNamingDialog, setShowNamingDialog] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categorization state
  const [categorization, setCategorization] = useState<NamingConventionData>({
    countryCode: '',
    regionCode: '',
    projectCode: '',
    reportTypeCode: '',
    date: new Date(),
    versionControl: 'none'
  });

  // Auto-fill country and project from current project context
  React.useEffect(() => {
    if (currentProject) {
      console.log('🏗️ Auto-categorizing report for project:', currentProject);
      
      // Map project country to country code
      const countryCodeMap: any = {
        'kenya': 'KE',
        'tanzania': 'TZ',
        'uganda': 'UG',
        'ethiopia': 'ET',
        'south sudan': 'SS',
        'sudan': 'SD'
      };
      
      const countryCode = countryCodeMap[currentProject.country.toLowerCase()];
      
      // Generate project code from project ID or name
      // Use project ID if it's already in a good format, otherwise generate from name
      let projectCode = currentProject.id;
      if (projectCode.length > 10) {
        // If ID is too long (like CUID), generate from name
        projectCode = currentProject.name
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // Remove special characters
          .split(' ')
          .map(word => word.substring(0, 3)) // Take first 3 letters of each word
          .join('-')
          .substring(0, 10); // Limit to 10 characters
      }
      
      // Auto-detect region from project description or name if available
      let regionCode = 'W-UG';
      const projectText = `${currentProject.name} ${currentProject.description || ''}`.toLowerCase();
      
      if (countryCode === 'KE'||"UG") {
        if (projectText.includes('nairobi') || projectText.includes('central')) regionCode = 'KE-C';
        else if (projectText.includes('coast') || projectText.includes('mombasa')) regionCode = 'KE-CO';
        else if (projectText.includes('western')) regionCode = 'KE-W';
        else if (projectText.includes('nyanza')) regionCode = 'KE-NY';
        else if (projectText.includes('rift') || projectText.includes('valley')) regionCode = 'KE-RV';
        else if (projectText.includes('eastern')) regionCode = 'KE-E';
        else if (projectText.includes('north')) regionCode = 'KE-NE';
      } else if (countryCode === 'TZ') {
        if (projectText.includes('dar es salaam')) regionCode = 'TZ-DS';
        else if (projectText.includes('arusha')) regionCode = 'TZ-AR';
        else if (projectText.includes('dodoma')) regionCode = 'TZ-DO';
        else if (projectText.includes('mwanza')) regionCode = 'TZ-MW';
        // Add more Tanzania regions as needed
      }
      // Add more countries as needed
      
      if (countryCode) {
        setCategorization(prev => ({
          ...prev,
          countryCode,
          projectCode,
          regionCode
        }));
        console.log('✅ Auto-categorization applied:', { countryCode, projectCode, regionCode });
      }
    }
  }, [currentProject]);

  // Report frequency state
  const [reportFrequency, setReportFrequency] = useState<'monthly' | 'quarterly' | 'annual' | 'adhoc'>('adhoc');

  // Dynamic project and region data
  const availableProjects = React.useMemo(() => {
    if (!categorization.countryCode) return [];
    
    // Filter projects by country and convert to naming convention format
    return projects
      .filter(project => {
        const countryMatches = {
          'KE': ['kenya'],
          'TZ': ['tanzania'],
          'UG': ['uganda'],
          'ET': ['ethiopia'],
          'SS': ['south sudan'],
          'SD': ['sudan']
        };
        const countryNames = countryMatches[categorization.countryCode as keyof typeof countryMatches] || [];
        return countryNames.some(countryName => 
          project.country.toLowerCase().includes(countryName)
        );
      })
      .map(project => {
        // Generate project code similar to auto-categorization logic
        let projectCode = project.id;
        if (projectCode.length > 10) {
          projectCode = project.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(' ')
            .map(word => word.substring(0, 3))
            .join('-')
            .substring(0, 10);
        }
        
        return {
          code: projectCode,
          name: project.name,
          description: project.description || '',
          country: project.country
        };
      });
  }, [projects, categorization.countryCode]);

  const availableRegions = React.useMemo(() => {
    if (!categorization.countryCode) return [];
    return getRegionsByCountry(categorization.countryCode);
  }, [categorization.countryCode]);

  const handleCategorizationChange = (field: keyof NamingConventionData, value: string | Date) => {
    setCategorization(prev => ({ ...prev, [field]: value }));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="w-4 h-4" />;
    if (fileType.includes('video')) return <FileVideo className="w-4 h-4" />;
    if (fileType.includes('audio')) return <FileAudio className="w-4 h-4" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return { isValid: false, error: `File size exceeds ${maxFileSize}MB limit` };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return { isValid: false, error: `File type ${fileExtension} is not allowed` };
    }

    return { isValid: true };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check if categorization is complete (country and project are auto-filled)
    if (!categorization.regionCode || !categorization.reportTypeCode) {
      toast({
        title: "Incomplete Categorization",
        description: "Please complete the categorization (Region, Report Type) and select report frequency before uploading files.",
        variant: "destructive",
      });
      return;
    }

    // Check if adding these files would exceed maxFiles limit
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can only upload up to ${maxFiles} files.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: { file: File; error: string }[] = [];

    files.forEach(file => {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, error: validation.error! });
      }
    });

    // Show errors for invalid files
    invalidFiles.forEach(({ file, error }) => {
      toast({
        title: "File Validation Failed",
        description: `${file.name}: ${error}`,
        variant: "destructive",
      });
    });

    // Process valid files
    if (validFiles.length > 0) {
      processFiles(validFiles);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFiles = (files: File[]) => {
    setIsUploading(true);

    // Process files and convert to base64 for localStorage storage
    const processFilesAsync = async () => {
      try {
        const newUploadedFiles: UploadedFile[] = [];
        
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          const id = `file-${Date.now()}-${index}`;
          
          // Use current categorization data with unique version control for each file
          const namingData = { ...categorization };
          
          // Add unique version control to make each filename unique
          if (namingData.versionControl === 'none') {
            namingData.versionControl = `v${uploadedFiles.length + index + 1}`;
          } else {
            namingData.versionControl = `${namingData.versionControl}_${uploadedFiles.length + index + 1}`;
          }
          
          // Generate new name with categorization
          const namingDataForGeneration = { ...namingData };
          const generatedName = generateFileName(namingDataForGeneration);
          const newName = generatedName + getFileExtension(file.name);

          // Convert file to base64 for localStorage storage
          const fileData = await fileToBase64(file);

          newUploadedFiles.push({
            id,
            originalName: file.name,
            newName: newName,
            size: file.size,
            type: file.type,
            file,
            fileData,
            namingData: namingData,
            uploadedAt: new Date()
          });
        }

        setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
        setIsUploading(false);

        toast({
          title: "Files Uploaded",
          description: `${files.length} file(s) uploaded successfully and renamed according to categorization.`,
        });
      } catch (error) {
        setIsUploading(false);
        toast({
          title: "Upload Failed",
          description: "An error occurred while processing files. Please try again.",
          variant: "destructive",
        });
        console.error('Error processing files:', error);
      }
    };

    processFilesAsync();
  };

  const handleNamingConventionChange = (namingData: NamingConventionData, fileName: string) => {
    if (selectedFileIndex !== null) {
      setUploadedFiles(prev => prev.map((file, index) => 
        index === selectedFileIndex 
          ? { ...file, namingData, newName: fileName + getFileExtension(file.originalName) }
          : file
      ));
    }
  };

  const getFileExtension = (fileName: string): string => {
    const extension = fileName.split('.').pop();
    return extension ? `.${extension}` : '';
  };

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



  // Convert file to base64 for localStorage storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const openNamingDialog = (fileIndex: number) => {
    setSelectedFileIndex(fileIndex);
    setShowNamingDialog(true);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File Removed",
      description: "File has been removed from the upload list.",
    });
  };

  const downloadFile = async (file: UploadedFile) => {
    try {
      // Use the storage utility for downloading
      const result = await downloadStoredFile(file.id, file.newName);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the file.",
        variant: "destructive",
      });
      console.error('Error downloading file:', error);
    }
  };



  const handleFinalUpload = async () => {
    console.log('handleFinalUpload called with files:', uploadedFiles);
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files",
        description: "Please upload files first.",
        variant: "destructive",
      });
      return;
    }

    // Check if categorization is complete (country and project are auto-filled)
    if (!categorization.regionCode || !categorization.reportTypeCode) {
      toast({
        title: "Incomplete Categorization",
        description: "Please complete the categorization (Region, Report Type) before uploading.",
        variant: "destructive",
      });
      return;
    }

    // Check if user and project are available
    if (!user || !projectId) {
      toast({
        title: "Missing Context",
        description: "User or project information is missing. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting upload process...');
    // Final upload
    setIsUploading(true);
    try {
      console.log('Processing files...');
      // Store file data in localStorage and create reports with approval workflows
      const createdReports = await Promise.all(uploadedFiles.map(async (file, index) => {
          console.log(`Processing file ${index + 1}:`, file);
          
          // Get the report type name
          const reportType = REPORT_TYPES.find(t => t.code === categorization.reportTypeCode);
          const project = PROJECTS.find(p => p.code === categorization.projectCode);
          
          // Generate UUID for report ID
          const reportId = uuidv4();
          
          // Create report with basic structure (workflow to be implemented when user management API is ready)
          const createdReport: Report = {
            id: reportId,
            name: file.newName,
            type: getFileTypeFromExtension(file.originalName),
            size: formatFileSize(file.size),
            uploadDate: new Date().toISOString(),
            description: `${reportType?.name || 'Report'} for ${project?.name || 'Project'} - ${file.originalName}`,
            category: reportFrequency, // Use selected frequency instead of derived category
            status: 'draft' as const,
            uploadedBy: `${user.firstName} ${user.lastName}`,
            lastModified: new Date().toISOString(),
            lastModifiedBy: `${user.firstName} ${user.lastName}`,
            projectId: projectId,
            isPendingReview: true,
            currentAuthLevel: 'branch-admin',
            approvalWorkflow: {
              id: uuidv4(),
              reportId: reportId,
              projectId: projectId,
              createdAt: new Date().toISOString(),
              createdBy: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
              currentStep: 1,
              totalSteps: 1,
              steps: [],
              status: 'pending'
            }
          };
          
          // Store file data using the storage utility
          const metadata = {
            uploadedBy: `${user.firstName} ${user.lastName}`,
            projectId: projectId,
            category: createdReport.category,
            status: createdReport.status,
            reportFrequency: reportFrequency
          };
          
          console.log('Storing file with metadata:', metadata);
          const storageResult = await storeReportFile(
            file.file,
            createdReport.id,
            file.namingData,
            metadata
          );
          
          console.log('Storage result:', storageResult);
          if (!storageResult.success) {
            throw new Error(`Failed to store file: ${storageResult.error}`);
          }
          
          // Update the report with file storage information
          // Note: In a real API, this would be stored in the database
          const updatedReport = {
            ...createdReport,
            fileStorageKey: storageResult.fileKey // Reference to localStorage key
          };
          
          return updatedReport;
        }));

        console.log('Upload completed successfully:', createdReports);
        setIsUploading(false);
        toast({
          title: "Upload Complete",
          description: `${uploadedFiles.length} report(s) have been uploaded and are now pending approval.`,
        });
        
        if (onFilesUploaded) {
          onFilesUploaded(uploadedFiles);
        }
        
        // Clear uploaded files and reset categorization (keep auto-filled country and project)
        setUploadedFiles([]);
        setCategorization(prev => ({
          ...prev,
          regionCode: '',
          reportTypeCode: '',
          date: new Date(),
          versionControl: 'none'
        }));
        setReportFrequency('adhoc');
      } catch (error) {
        console.error('Upload failed with error:', error);
        setIsUploading(false);
        toast({
          title: "Upload Failed",
          description: "An error occurred while creating the reports. Please try again.",
          variant: "destructive",
        });
        console.error('Error creating reports:', error);
      }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categorization Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              <h3 className="text-lg font-medium">Document Categorization</h3>
            </div>
            <p className="text-sm text-gray-600">
              Configure the categorization for your documents. Country and Project are automatically filled from the current project context. Files will be automatically renamed according to the naming convention. <strong>Region, Report Type, and report frequency are required before uploading files.</strong>
            </p>

            {/* Auto-categorization Summary */}
            {(categorization.countryCode || categorization.projectCode) && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="font-medium text-green-800 mb-2">Auto-Categorization Applied</div>
                  <div className="space-y-1 text-sm text-green-700">
                    {categorization.countryCode && (
                      <div>✓ Country: <strong>{currentProject?.country}</strong> → {categorization.countryCode}</div>
                    )}
                    {categorization.projectCode && (
                      <div>✓ Project: <strong>{currentProject?.name}</strong> → {categorization.projectCode}</div>
                    )}
                    {categorization.regionCode && (
                      <div>✓ Region: Auto-detected → {categorization.regionCode}</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Country Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Country *
                </Label>
                <Select
                  value={categorization.countryCode}
                  onValueChange={(value) => handleCategorizationChange('countryCode', value)}
                  disabled={true}
                >
                  <SelectTrigger className="bg-green-50 border-green-200">
                    <SelectValue>
                      {categorization.countryCode ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>
                            {COUNTRIES.find(c => c.code === categorization.countryCode)?.name || currentProject?.country}
                            <span className="text-gray-500 ml-1">({categorization.countryCode})</span>
                          </span>
                        </div>
                      ) : (
                        "Auto-detecting country..."
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Auto-detected: {currentProject?.country}</span>
                </div>
              </div>

              {/* Region Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Administrative Region *
                </Label>
                <Select
                  value={categorization.regionCode}
                  onValueChange={(value) => handleCategorizationChange('regionCode', value)}
                  disabled={!categorization.countryCode}
                >
                  <SelectTrigger className={categorization.regionCode ? "bg-green-50 border-green-200" : ""}>
                    <SelectValue placeholder="Select a region">
                      {categorization.regionCode && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>
                            {availableRegions.find(r => r.code === categorization.regionCode)?.name}
                            <span className="text-gray-500 ml-1">({categorization.regionCode})</span>
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableRegions.map((region) => (
                      <SelectItem key={region.code} value={region.code}>
                        {region.name} ({region.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categorization.regionCode && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Auto-detected from project data</span>
                  </div>
                )}
              </div>

              {/* Project Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Project *
                </Label>
                <Select
                  value={categorization.projectCode}
                  onValueChange={(value) => handleCategorizationChange('projectCode', value)}
                  disabled={true}
                >
                  <SelectTrigger className="bg-green-50 border-green-200">
                    <SelectValue>
                      {categorization.projectCode ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>
                            {availableProjects.find(p => p.code === categorization.projectCode)?.name || currentProject?.name} 
                            <span className="text-gray-500 ml-1">({categorization.projectCode})</span>
                          </span>
                        </div>
                      ) : (
                        "Auto-detecting project..."
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableProjects.map((project) => (
                      <SelectItem key={project.code} value={project.code}>
                        {project.name} ({project.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Auto-detected from current project: {currentProject?.name}</span>
                </div>
              </div>

              {/* Report Type Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Report Type *
                </Label>
                <Select
                  value={categorization.reportTypeCode}
                  onValueChange={(value) => handleCategorizationChange('reportTypeCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((type) => (
                      <SelectItem key={type.code} value={type.code}>
                        {type.name} ({type.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Report Frequency Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Report Frequency *
                </Label>
                <Select
                  value={reportFrequency}
                  onValueChange={(value) => setReportFrequency(value as 'monthly' | 'quarterly' | 'annual' | 'adhoc')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Reports</SelectItem>
                    <SelectItem value="quarterly">Quarterly Reports</SelectItem>
                    <SelectItem value="annual">Annual Reports</SelectItem>
                    <SelectItem value="adhoc">Ad-hoc Reports</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">
                  Report upload time will be automatically set to current date/time
                </p>
              </div>

              {/* Version Control */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Version Control (Optional)
                </Label>
                <Select
                  value={categorization.versionControl}
                  onValueChange={(value) => handleCategorizationChange('versionControl', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select version control" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No version control</SelectItem>
                    {VERSION_CONTROLS.map((version) => (
                      <SelectItem key={version.code} value={version.code}>
                        {version.name} ({version.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generated File Name Preview */}
            {categorization.regionCode && categorization.reportTypeCode && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700 mb-2">Generated File Name Pattern:</p>
                <code className="text-sm font-mono break-all">
                  {(() => {
                    const namingDataForPreview = { ...categorization };
                    if (namingDataForPreview.versionControl === 'none') {
                      delete namingDataForPreview.versionControl;
                    }
                    return generateFileName(namingDataForPreview);
                  })()}
                </code>
              </div>
            )}
          </div>

          {/* File Upload Input */}
          <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            categorization.regionCode && categorization.reportTypeCode
              ? 'border-gray-300 hover:border-gray-400'
              : 'border-gray-200 bg-gray-50'
          }`}>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              categorization.regionCode && categorization.reportTypeCode
                ? 'text-gray-400'
                : 'text-gray-300'
            }`} />
            <Label htmlFor="file-upload" className={`cursor-pointer ${
              categorization.regionCode && categorization.reportTypeCode
                ? ''
                : 'pointer-events-none'
            }`}>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {categorization.regionCode && categorization.reportTypeCode
                    ? 'Drop files here or click to upload'
                    : 'Complete categorization and select frequency to upload files'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: {allowedTypes.join(', ')} (Max {maxFileSize}MB each)
                </p>
                <p className="text-sm text-gray-500">
                  Maximum {maxFiles} files allowed
                </p>
                {!(categorization.regionCode && categorization.reportTypeCode) && (
                  <p className="text-sm text-orange-600 font-medium">
                    Please complete all required categorization fields and select report frequency above
                  </p>
                )}
              </div>
            </Label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Processing files... Please wait.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          {uploadedFiles.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={handleFinalUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload All Files'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Files ({uploadedFiles.length})</span>
              <Badge variant="outline">
                {uploadedFiles.filter(f => f.namingData.countryCode).length} / {uploadedFiles.length} Categorized
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.newName}</p>
                      <p className="text-sm text-gray-500">
                        Original: {file.originalName} • {formatFileSize(file.size)}
                      </p>
                      {file.namingData.countryCode && (
                        <Badge variant="secondary" className="mt-1">
                          {file.namingData.countryCode}_{file.namingData.regionCode}_{file.namingData.projectCode}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                                         <Button
                       size="sm"
                       variant="outline"
                       onClick={() => openNamingDialog(index)}
                     >
                       {file.namingData.countryCode ? 'Edit' : 'Configure'} Categorization
                     </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Naming Convention Dialog */}
      <Dialog open={showNamingDialog} onOpenChange={setShowNamingDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                   <DialogHeader>
           <DialogTitle>Configure Document Categorization</DialogTitle>
         </DialogHeader>
          {selectedFileIndex !== null && (
            <div className="space-y-4">
                             <div className="p-3 bg-gray-50 rounded-lg">
                 <p className="font-medium">File: {uploadedFiles[selectedFileIndex]?.originalName}</p>
                 <p className="text-sm text-gray-600">
                   Configure the categorization for this file. The file will be renamed according to the selected parameters.
                 </p>
               </div>
              <NamingConventionForm
                initialData={uploadedFiles[selectedFileIndex]?.namingData}
                onDataChange={handleNamingConventionChange}
                showPreview={true}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNamingDialog(false)}>
                  Cancel
                </Button>
                                 <Button onClick={() => setShowNamingDialog(false)}>
                   Apply Categorization
                 </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
