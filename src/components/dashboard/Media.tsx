import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Video, Upload, Download, Eye, Trash2, Plus, Play, FileImage } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  url: string;
  thumbnail?: string;
  size: string;
  uploadDate: string;
  description: string;
  category: 'activities' | 'outcomes' | 'events' | 'training' | 'other';
  tags: string[];
  uploadedBy: string;
}

// Mock media data
const mockMedia: MediaFile[] = [
  {
    id: '1',
    name: 'child-rights-training-session.jpg',
    type: 'image',
    url: '/api/media/child-rights-training-session.jpg',
    thumbnail: '/api/media/thumbnails/child-rights-training-session.jpg',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    description: 'Children participating in rights awareness training at Kibera Primary School',
    category: 'training',
    tags: ['training', 'children', 'rights', 'kibera'],
    uploadedBy: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'community-meeting-highlights.mp4',
    type: 'video',
    url: '/api/media/community-meeting-highlights.mp4',
    thumbnail: '/api/media/thumbnails/community-meeting-highlights.jpg',
    size: '45.2 MB',
    uploadDate: '2024-01-12',
    description: 'Highlights from community leader engagement meeting',
    category: 'activities',
    tags: ['community', 'meeting', 'leaders', 'engagement'],
    uploadedBy: 'John Kimani'
  },
  {
    id: '3',
    name: 'parent-testimonial-video.mp4',
    type: 'video',
    url: '/api/media/parent-testimonial-video.mp4',
    thumbnail: '/api/media/thumbnails/parent-testimonial-video.jpg',
    size: '28.7 MB',
    uploadDate: '2024-01-10',
    description: 'Parent testimonial about improved child protection in schools',
    category: 'outcomes',
    tags: ['testimonial', 'parent', 'protection', 'success'],
    uploadedBy: 'Mary Wanjiku'
  },
  {
    id: '4',
    name: 'school-visit-photos.jpg',
    type: 'image',
    url: '/api/media/school-visit-photos.jpg',
    thumbnail: '/api/media/thumbnails/school-visit-photos.jpg',
    size: '3.1 MB',
    uploadDate: '2024-01-08',
    description: 'Photos from monitoring visit to Mathare schools',
    category: 'activities',
    tags: ['monitoring', 'visit', 'schools', 'mathare'],
    uploadedBy: 'Grace Muthoni'
  }
];

export function Media() {
  const { projectId } = useParams();
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const catRef = useRef<HTMLSelectElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  // LocalStorage key per project
  const storageKey = `media-project-${projectId}`;

  // Load media from localStorage on mount or projectId change
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setMedia(JSON.parse(stored));
    } else {
      setMedia([]);
    }
  }, [storageKey]);

  // Save media to localStorage on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(media));
  }, [media, storageKey]);

  // Upload handler
  const handleUpload = () => {
    const fileInput = fileInputRef.current;
    const desc = descRef.current?.value || '';
    const cat = catRef.current?.value || 'other';
    const tags = tagsRef.current?.value?.split(',').map(t => t.trim()).filter(Boolean) || [];
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    const id = Date.now().toString();
    const type = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : file.type.includes('pdf') || file.type.includes('doc') ? 'document' : 'other';
    const url = URL.createObjectURL(file);
    const size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const uploadDate = new Date().toISOString();
    const name = file.name;
    const uploadedBy = 'You';
    const newMedia: MediaFile = {
      id, name, type, url, size, uploadDate, description: desc, category: cat, tags, uploadedBy
    };
    setMedia(prev => [newMedia, ...prev]);
    setUploadDialogOpen(false);
    // Reset form
    if (fileInput) fileInput.value = '';
    if (descRef.current) descRef.current.value = '';
    if (catRef.current) catRef.current.value = 'other';
    if (tagsRef.current) tagsRef.current.value = '';
  };

  // View handler
  const handleView = (item: MediaFile) => {
    setSelectedMedia(item);
    setViewDialogOpen(true);
  };

  // Download handler
  const handleDownload = (item: MediaFile) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.name;
    link.click();
  };

  // Delete handler
  const handleDelete = (item: MediaFile) => {
    setMedia(prev => prev.filter(m => m.id !== item.id));
    if (selectedMedia?.id === item.id) setViewDialogOpen(false);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-red-500" />;
      case 'document':
        return <FileImage className="h-4 w-4 text-green-500" />;
      default:
        return <FileImage className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      activities: 'bg-blue-100 text-blue-800',
      outcomes: 'bg-green-100 text-green-800',
      events: 'bg-purple-100 text-purple-800',
      training: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return variants[category as keyof typeof variants] || variants.other;
  };

  const filteredMedia = media.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    return categoryMatch && typeMatch;
  });

  const totalSize = filteredMedia.reduce((sum, item) => {
    const size = parseFloat(item.size.replace(' MB', ''));
    return sum + size;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">Manage project images, videos, and documents</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Media File</DialogTitle>
              <DialogDescription>
                Upload images, videos, or documents to the project media library
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">File</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept="image/*,video/*,.pdf,.doc,.docx" 
                  className="cursor-pointer"
                  ref={fileInputRef}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter media description..." 
                  className="resize-none"
                  ref={descRef}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select id="category" ref={catRef} defaultValue="other" className="w-full border rounded p-2">
                  <option value="activities">Activities</option>
                  <option value="outcomes">Outcomes</option>
                  <option value="events">Events</option>
                  <option value="training">Training</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input 
                  id="tags" 
                  placeholder="e.g., training, children, rights" 
                  ref={tagsRef}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMedia.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredMedia.filter(item => item.type === 'image').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredMedia.filter(item => item.type === 'video').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="activities">Activities</SelectItem>
            <SelectItem value="outcomes">Outcomes</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="group transition-all duration-200 hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    {item.type === 'image' && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                        <Image className="h-12 w-12 text-blue-400" />
                      </div>
                    )}
                    {item.type === 'video' && (
                      <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                        <Video className="h-12 w-12 text-red-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-8 w-8 text-red-500" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className={getCategoryBadge(item.category)}>
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getMediaIcon(item.type)}
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.size}</span>
                      <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleView(item)}>
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleDownload(item)}>
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getMediaIcon(item.type)}
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {item.size} • Uploaded on {new Date(item.uploadDate).toLocaleDateString()} by {item.uploadedBy}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getCategoryBadge(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleView(item)}>
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownload(item)}>
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredMedia.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No media files found</h3>
            <p className="text-muted-foreground">
              No media files available for the selected filters. Upload your first media file to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Dialog/Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMedia && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>{selectedMedia.name}</DialogTitle>
                <DialogDescription>{selectedMedia.description}</DialogDescription>
              </DialogHeader>
              {selectedMedia.type === 'image' && (
                <img src={selectedMedia.url} alt={selectedMedia.name} className="w-full max-h-[400px] object-contain rounded" />
              )}
              {selectedMedia.type === 'video' && (
                <video src={selectedMedia.url} controls className="w-full max-h-[400px] rounded" />
              )}
              {selectedMedia.type === 'document' && (
                <a href={selectedMedia.url} download={selectedMedia.name} className="text-blue-600 underline">Download Document</a>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleDownload(selectedMedia)}>
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(selectedMedia)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 