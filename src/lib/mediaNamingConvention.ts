import { Form } from '../components/dashboard/form-creation-wizard/types';
import { Project } from '../types/dashboard';

export interface MediaNamingData {
  countryCode: string;
  projectCode: string;
  formName: string;
  originalFileName: string;
  mediaType: 'image' | 'video' | 'audio' | 'file';
  timestamp: number;
}

/**
 * Generate a standardized media file name with country code, project code, and form name prefixes
 * Format: CountryCode_ProjectCode_FormName_OriginalName_Timestamp
 */
export function generateMediaFileName(data: MediaNamingData): string {
  const {
    countryCode,
    projectCode,
    formName,
    originalFileName,
    mediaType,
    timestamp
  } = data;

  // Clean and format the form name (remove special characters, replace spaces with underscores)
  const cleanFormName = formName
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toUpperCase()
    .substring(0, 20); // Limit length

  // Get file extension from original filename
  const fileExtension = originalFileName.includes('.') 
    ? originalFileName.substring(originalFileName.lastIndexOf('.'))
    : getDefaultExtension(mediaType);

  // Generate timestamp string (YYYYMMDD_HHMMSS format)
  const date = new Date(timestamp);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '');

  // Generate the new filename
  const newFileName = `${countryCode}_${projectCode}_${cleanFormName}_${dateStr}_${timeStr}${fileExtension}`;

  return newFileName;
}

/**
 * Get default file extension based on media type
 */
function getDefaultExtension(mediaType: 'image' | 'video' | 'audio' | 'file'): string {
  switch (mediaType) {
    case 'image':
      return '.jpg';
    case 'video':
      return '.mp4';
    case 'audio':
      return '.mp3';
    case 'file':
      return '.pdf';
    default:
      return '.file';
  }
}

/**
 * Generate media naming data from project and form information
 */
export function createMediaNamingData(
  project: Project,
  form: Form,
  originalFileName: string,
  mediaType: 'image' | 'video' | 'audio' | 'file'
): MediaNamingData {
  return {
    countryCode: project.country,
    projectCode: project.id, // Use project ID as code since dashboard Project doesn't have code
    formName: form.title,
    originalFileName,
    mediaType,
    timestamp: Date.now()
  };
}

/**
 * Parse a media filename to extract naming data
 */
export function parseMediaFileName(fileName: string): Partial<MediaNamingData> | null {
  // Remove file extension
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  // Split by underscore
  const parts = nameWithoutExt.split('_');
  
  if (parts.length < 5) return null;
  
  const [countryCode, projectCode, ...formNameParts] = parts;
  
  // Extract date and time from the end
  const dateTimePart = formNameParts[formNameParts.length - 1];
  const datePart = formNameParts[formNameParts.length - 2];
  
  // Reconstruct form name (everything between projectCode and date)
  const formNamePartsOnly = formNameParts.slice(0, -2);
  const formName = formNamePartsOnly.join('_');
  
  // Parse timestamp
  const timestamp = parseTimestamp(datePart, dateTimePart);
  
  return {
    countryCode,
    projectCode,
    formName,
    timestamp
  };
}

/**
 * Parse timestamp from date and time parts
 */
function parseTimestamp(datePart: string, timePart: string): number {
  try {
    // datePart format: YYYYMMDD
    // timePart format: HHMMSS
    const year = parseInt(datePart.slice(0, 4));
    const month = parseInt(datePart.slice(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(datePart.slice(6, 8));
    const hour = parseInt(timePart.slice(0, 2));
    const minute = parseInt(timePart.slice(2, 4));
    const second = parseInt(timePart.slice(4, 6));
    
    return new Date(year, month, day, hour, minute, second).getTime();
  } catch {
    return Date.now();
  }
}

/**
 * Get media type from file extension
 */
export function getMediaTypeFromExtension(fileName: string): 'image' | 'video' | 'audio' | 'file' {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.webm', '.mkv', '.flv'];
  const audioExtensions = ['.mp3', '.wav', '.aac', '.ogg', '.m4a', '.flac'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  return 'file';
}
