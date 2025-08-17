import { MediaNamingData, parseMediaFileName } from './mediaNamingConvention';
import { Form } from '../components/dashboard/form-creation-wizard/types';
import { Project } from '../types/dashboard';

export interface MediaMetadata {
  id: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  fileType: string;
  mediaType: 'image' | 'video' | 'audio' | 'file';
  countryCode: string;
  projectCode: string;
  projectId: string;
  formId: string;
  formName: string;
  questionId: string;
  questionTitle: string;
  uploadedAt: Date;
  uploadedBy: string;
  tags?: string[];
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  };
}

export interface StoredMediaFile {
  id: string;
  file: File;
  metadata: MediaMetadata;
}

const STORAGE_KEY = 'ics-dashboard-media-files';

/**
 * Store a media file with metadata
 */
export async function storeMediaFile(
  file: File,
  metadata: Omit<MediaMetadata, 'id' | 'fileName' | 'originalFileName' | 'fileSize' | 'fileType' | 'uploadedAt'>
): Promise<StoredMediaFile> {
  const id = generateMediaId();
  const storedFile: StoredMediaFile = {
    id,
    file,
    metadata: {
      ...metadata,
      id,
      fileName: file.name,
      originalFileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date()
    }
  };

  // Get existing media files
  const existingFiles = getStoredMediaFiles();
  
  // Add new file
  existingFiles.push(storedFile);
  
  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingFiles));
  
  // Dispatch storage event for cross-tab synchronization
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: JSON.stringify(existingFiles)
  }));

  return storedFile;
}

/**
 * Get all stored media files
 */
export function getStoredMediaFiles(): StoredMediaFile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      metadata: {
        ...item.metadata,
        uploadedAt: new Date(item.metadata.uploadedAt)
      }
    }));
  } catch (error) {
    console.error('Error loading stored media files:', error);
    return [];
  }
}

/**
 * Get media files by project ID
 */
export function getMediaFilesByProject(projectId: string): StoredMediaFile[] {
  const allFiles = getStoredMediaFiles();
  return allFiles.filter(file => file.metadata.projectId === projectId);
}

/**
 * Get media files by form ID
 */
export function getMediaFilesByForm(formId: string): StoredMediaFile[] {
  const allFiles = getStoredMediaFiles();
  return allFiles.filter(file => file.metadata.formId === formId);
}

/**
 * Get media files by country code
 */
export function getMediaFilesByCountry(countryCode: string): StoredMediaFile[] {
  const allFiles = getStoredMediaFiles();
  return allFiles.filter(file => file.metadata.countryCode === countryCode);
}

/**
 * Get media files by media type
 */
export function getMediaFilesByType(mediaType: 'image' | 'video' | 'audio' | 'file'): StoredMediaFile[] {
  const allFiles = getStoredMediaFiles();
  return allFiles.filter(file => file.metadata.mediaType === mediaType);
}

/**
 * Search media files by metadata
 */
export function searchMediaFiles(query: string): StoredMediaFile[] {
  const allFiles = getStoredMediaFiles();
  const lowerQuery = query.toLowerCase();
  
  return allFiles.filter(file => 
    file.metadata.formName.toLowerCase().includes(lowerQuery) ||
    file.metadata.questionTitle.toLowerCase().includes(lowerQuery) ||
    file.metadata.originalFileName.toLowerCase().includes(lowerQuery) ||
    file.metadata.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    file.metadata.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Delete a media file
 */
export function deleteMediaFile(fileId: string): boolean {
  try {
    const allFiles = getStoredMediaFiles();
    const filteredFiles = allFiles.filter(file => file.id !== fileId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFiles));
    
    // Dispatch storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(filteredFiles)
    }));
    
    return true;
  } catch (error) {
    console.error('Error deleting media file:', error);
    return false;
  }
}

/**
 * Update media file metadata
 */
export function updateMediaFileMetadata(
  fileId: string, 
  updates: Partial<MediaMetadata>
): StoredMediaFile | null {
  try {
    const allFiles = getStoredMediaFiles();
    const fileIndex = allFiles.findIndex(file => file.id === fileId);
    
    if (fileIndex === -1) return null;
    
    allFiles[fileIndex].metadata = {
      ...allFiles[fileIndex].metadata,
      ...updates
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFiles));
    
    // Dispatch storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(allFiles)
    }));
    
    return allFiles[fileIndex];
  } catch (error) {
    console.error('Error updating media file metadata:', error);
    return null;
  }
}

/**
 * Get media file by ID
 */
export function getMediaFileById(fileId: string): StoredMediaFile | null {
  const allFiles = getStoredMediaFiles();
  return allFiles.find(file => file.id === fileId) || null;
}

/**
 * Get media statistics for a project
 */
export function getProjectMediaStats(projectId: string) {
  const projectFiles = getMediaFilesByProject(projectId);
  
  const stats = {
    total: projectFiles.length,
    byType: {
      image: projectFiles.filter(f => f.metadata.mediaType === 'image').length,
      video: projectFiles.filter(f => f.metadata.mediaType === 'video').length,
      audio: projectFiles.filter(f => f.metadata.mediaType === 'audio').length,
      file: projectFiles.filter(f => f.metadata.mediaType === 'file').length,
    },
    totalSize: projectFiles.reduce((sum, file) => sum + file.metadata.fileSize, 0),
    byForm: {} as Record<string, number>
  };
  
  // Count by form
  projectFiles.forEach(file => {
    const formName = file.metadata.formName;
    stats.byForm[formName] = (stats.byForm[formName] || 0) + 1;
  });
  
  return stats;
}

/**
 * Generate unique media ID
 */
function generateMediaId(): string {
  return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create metadata from file and context information
 */
export function createMediaMetadata(
  file: File,
  project: Project,
  form: Form,
  questionId: string,
  questionTitle: string,
  uploadedBy: string,
  mediaType: 'image' | 'video' | 'audio' | 'file',
  location?: { latitude: number; longitude: number; accuracy?: number; address?: string },
  tags?: string[],
  description?: string
): Omit<MediaMetadata, 'id' | 'fileName' | 'originalFileName' | 'fileSize' | 'fileType' | 'uploadedAt'> {
  return {
    fileName: file.name,
    originalFileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    mediaType,
    countryCode: project.country,
    projectCode: project.id,
    projectId: project.id,
    formId: form.id,
    formName: form.title,
    questionId,
    questionTitle,
    uploadedBy,
    tags,
    description,
    location
  };
}

/**
 * Export media files for backup/download
 */
export function exportMediaFiles(projectId?: string): string {
  const files = projectId ? getMediaFilesByProject(projectId) : getStoredMediaFiles();
  
  const exportData = {
    exportDate: new Date().toISOString(),
    totalFiles: files.length,
    files: files.map(file => ({
      ...file.metadata,
      uploadedAt: file.metadata.uploadedAt.toISOString()
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import media files from backup
 */
export function importMediaFiles(importData: string): boolean {
  try {
    const data = JSON.parse(importData);
    const existingFiles = getStoredMediaFiles();
    
    // Add imported files (with new IDs to avoid conflicts)
    const importedFiles = data.files.map((fileData: any) => ({
      id: generateMediaId(),
      file: null, // Files are not included in export, only metadata
      metadata: {
        ...fileData,
        id: generateMediaId(),
        uploadedAt: new Date(fileData.uploadedAt)
      }
    }));
    
    const allFiles = [...existingFiles, ...importedFiles];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFiles));
    
    return true;
  } catch (error) {
    console.error('Error importing media files:', error);
    return false;
  }
}


