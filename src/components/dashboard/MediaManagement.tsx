import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, TrashIcon, EyeIcon, DocumentIcon, CalendarIcon, UserIcon, MapPinIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { FileImage, FileVideo, FileAudio, Building, FormInput, Hash, Download as DownloadIcon, Upload as UploadIcon } from 'lucide-react';

import { 
  StoredMediaFile as MediaStorageFile,
  MediaMetadata
} from '@/lib/mediaStorage';
import { StoredMediaFile } from '@/contexts/FormContext';
import { useForm } from '@/contexts/FormContext';
import { formatFileSize } from '@/lib/utils';

interface MediaManagementProps {
  projectId?: string;
}

export function MediaManagement({ projectId: propProjectId }: MediaManagementProps) {
  const { projectId: urlProjectId } = useParams();
  const projectId = propProjectId || urlProjectId;
  const {
    getProjectMediaFiles,
    getFormMediaFiles,
    searchMediaFiles,
    removeMediaFile,
    getProjectMediaStats,
    exportProjectMedia,
    refreshMediaFiles
  } = useForm();
  
  const [mediaFiles, setMediaFiles] = useState<StoredMediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<StoredMediaFile[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFile, setSelectedFile] = useState<StoredMediaFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load media files
  useEffect(() => {
    if (projectId) {
      loadMediaFiles();
    }
  }, [projectId]);

  // Filter and sort files
  useEffect(() => {
    const filterFiles = async () => {
      let filtered = [...mediaFiles];

      // Search filter
      if (searchQuery && projectId) {
        const searchResults = await searchMediaFiles(projectId, searchQuery);
        filtered = searchResults.filter(file => 
          file.metadata.projectId === projectId
        );
      }

    // Media type filter
    if (mediaTypeFilter !== 'all') {
      filtered = filtered.filter(file => file.metadata.mediaType === mediaTypeFilter);
    }

    // Form filter
    if (formFilter !== 'all') {
      filtered = filtered.filter(file => file.metadata.formId === formFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'uploadedAt':
          aValue = a.metadata.uploadedAt.getTime();
          bValue = b.metadata.uploadedAt.getTime();
          break;
        case 'fileName':
          aValue = a.metadata.fileName.toLowerCase();
          bValue = b.metadata.fileName.toLowerCase();
          break;
        case 'fileSize':
          aValue = a.metadata.fileSize;
          bValue = b.metadata.fileSize;
          break;
        case 'formName':
          aValue = a.metadata.formName.toLowerCase();
          bValue = b.metadata.formName.toLowerCase();
          break;
        default:
          aValue = a.metadata.uploadedAt.getTime();
          bValue = b.metadata.uploadedAt.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

      setFilteredFiles(filtered);
    };

    filterFiles();
  }, [mediaFiles, searchQuery, mediaTypeFilter, formFilter, sortBy, sortOrder, projectId]);

  const loadMediaFiles = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      const files = await getProjectMediaFiles(projectId);
      setMediaFiles(files);
      setStats(getProjectMediaStats(projectId));
    } catch (error) {
      console.error('Error loading media files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        if (projectId) {
          const success = await removeMediaFile(projectId, '', fileId);
          if (success) {
            loadMediaFiles();
          }
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleDownloadFile = async (file: StoredMediaFile) => {
    try {
      // Use the URL or filePath from the StoredMediaFile
      const downloadUrl = file.url || file.filePath;
      if (downloadUrl) {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.metadata.originalFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error('No download URL available for file:', file.id);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <FileImage className="w-5 h-5" />;
      case 'video': return <FileVideo className="w-5 h-5" />;
      case 'audio': return <FileAudio className="w-5 h-5" />;
      default: return <DocumentIcon className="w-5 h-5" />;
    }
  };

  const getUniqueForms = () => {
    const forms = new Map();
    mediaFiles.forEach(file => {
      forms.set(file.metadata.formId, file.metadata.formName);
    });
    return Array.from(forms.entries()).map(([id, name]) => ({ id, name }));
  };

  const handleExport = async () => {
    try {
      const exportData = await exportProjectMedia(projectId);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `media-export-${projectId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting media files:', error);
    }
  };

  if (!projectId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No project selected</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Management</h1>
          <p className="text-gray-600">Manage and organize media files for this project</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={refreshMediaFiles}>
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DocumentIcon className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileImage className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Images</p>
                  <p className="text-2xl font-bold">{stats.byType.image}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileVideo className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-600">Videos</p>
                  <p className="text-2xl font-bold">{stats.byType.video}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-lime-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={mediaTypeFilter} onValueChange={setMediaTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Media Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="file">Files</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formFilter} onValueChange={setFormFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                {getUniqueForms().map(({ id, name }) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploadedAt">Upload Date</SelectItem>
                <SelectItem value="fileName">File Name</SelectItem>
                <SelectItem value="fileSize">File Size</SelectItem>
                <SelectItem value="formName">Form Name</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'} {sortBy}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media Files Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p>Loading media files...</p>
          </CardContent>
        </Card>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No media files found</p>
            {searchQuery && <p className="text-sm text-gray-400">Try adjusting your search criteria</p>}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getMediaIcon(file.metadata.mediaType)}
                    <div>
                      <p className="font-medium text-sm truncate max-w-32">
                        {file.metadata.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.metadata.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(file)}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <FormInput className="w-3 h-3" />
                    <span className="truncate">{file.metadata.formName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-3 h-3" />
                    <span>{file.metadata.countryCode}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{file.metadata.uploadedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserIcon className="w-3 h-3" />
                    <span className="truncate">{file.metadata.uploadedBy}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {file.metadata.mediaType}
                  </Badge>
                  {file.metadata.location && (
                    <Badge variant="outline" className="text-xs">
                      <MapPinIcon className="w-3 h-3 mr-1" />
                      Location
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* File Details Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">File Name</label>
                  <p className="text-sm">{selectedFile.metadata.fileName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Original Name</label>
                  <p className="text-sm">{selectedFile.metadata.originalFileName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">File Size</label>
                  <p className="text-sm">{formatFileSize(selectedFile.metadata.fileSize)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">File Type</label>
                  <p className="text-sm">{selectedFile.metadata.fileType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Form</label>
                  <p className="text-sm">{selectedFile.metadata.formName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Question</label>
                  <p className="text-sm">{selectedFile.metadata.questionTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Uploaded By</label>
                  <p className="text-sm">{selectedFile.metadata.uploadedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Upload Date</label>
                  <p className="text-sm">{selectedFile.metadata.uploadedAt.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <p className="text-sm">{selectedFile.metadata.countryCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Project</label>
                  <p className="text-sm">{selectedFile.metadata.projectCode}</p>
                </div>
              </div>
              
              {selectedFile.metadata.location && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm">
                    {selectedFile.metadata.location.latitude}, {selectedFile.metadata.location.longitude}
                    {selectedFile.metadata.location.accuracy && (
                      <span className="text-gray-500"> (Accuracy: {selectedFile.metadata.location.accuracy}m)</span>
                    )}
                  </p>
                  {selectedFile.metadata.location.address && (
                    <p className="text-sm text-gray-600">{selectedFile.metadata.location.address}</p>
                  )}
                </div>
              )}
              
              {selectedFile.metadata.tags && selectedFile.metadata.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFile.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedFile.metadata.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm">{selectedFile.metadata.description}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  Close
                </Button>
                <Button onClick={() => handleDownloadFile(selectedFile)}>
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
