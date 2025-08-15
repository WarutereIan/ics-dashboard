// Report File Storage Utilities
// This module handles file storage in localStorage and is designed to be API-ready
// for future integration with backend storage systems.

export interface StoredFileData {
  id: string;
  reportId: string;
  originalName: string;
  newName: string;
  size: number;
  type: string;
  fileData: string; // Base64 encoded file data
  uploadedAt: string;
  namingData: any;
  metadata?: {
    uploadedBy: string;
    projectId: string;
    category: string;
    status: string;
    reportFrequency?: 'monthly' | 'quarterly' | 'annual' | 'adhoc';
  };
}

export interface FileStorageResponse {
  success: boolean;
  fileKey?: string;
  error?: string;
  data?: StoredFileData;
}

/**
 * Store a file in localStorage
 * API-ready: This function signature can be easily adapted for API calls
 */
export const storeReportFile = async (
  file: File,
  reportId: string,
  namingData: any,
  metadata?: any
): Promise<FileStorageResponse> => {
  try {
    // Convert file to base64
    const fileData = await fileToBase64(file);
    
    const fileKey = `report-file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const storedFileData: StoredFileData = {
      id: fileKey,
      reportId,
      originalName: file.name,
      newName: file.name, // Will be updated with naming convention
      size: file.size,
      type: file.type,
      fileData,
      uploadedAt: new Date().toISOString(),
      namingData,
      metadata
    };

    // Store in localStorage
    localStorage.setItem(fileKey, JSON.stringify(storedFileData));

    return {
      success: true,
      fileKey,
      data: storedFileData
    };
  } catch (error) {
    console.error('Error storing file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Retrieve a file from localStorage
 * API-ready: This function signature can be easily adapted for API calls
 */
export const getReportFile = async (fileKey: string): Promise<FileStorageResponse> => {
  try {
    const fileData = localStorage.getItem(fileKey);
    if (!fileData) {
      return {
        success: false,
        error: 'File not found'
      };
    }

    const parsedData = JSON.parse(fileData) as StoredFileData;
    return {
      success: true,
      fileKey,
      data: parsedData
    };
  } catch (error) {
    console.error('Error retrieving file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Delete a file from localStorage
 * API-ready: This function signature can be easily adapted for API calls
 */
export const deleteReportFile = async (fileKey: string): Promise<FileStorageResponse> => {
  try {
    const fileData = localStorage.getItem(fileKey);
    if (!fileData) {
      return {
        success: false,
        error: 'File not found'
      };
    }

    localStorage.removeItem(fileKey);
    return {
      success: true,
      fileKey
    };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Update file metadata in localStorage
 * API-ready: This function signature can be easily adapted for API calls
 */
export const updateReportFileMetadata = async (
  fileKey: string,
  updates: Partial<StoredFileData>
): Promise<FileStorageResponse> => {
  try {
    const fileData = localStorage.getItem(fileKey);
    if (!fileData) {
      return {
        success: false,
        error: 'File not found'
      };
    }

    const parsedData = JSON.parse(fileData) as StoredFileData;
    const updatedData = { ...parsedData, ...updates };
    
    localStorage.setItem(fileKey, JSON.stringify(updatedData));
    
    return {
      success: true,
      fileKey,
      data: updatedData
    };
  } catch (error) {
    console.error('Error updating file metadata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * List all report files in localStorage
 * API-ready: This function signature can be easily adapted for API calls
 */
export const listReportFiles = async (): Promise<FileStorageResponse> => {
  try {
    const files: StoredFileData[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('report-file-')) {
        const fileData = localStorage.getItem(key);
        if (fileData) {
          try {
            const parsedData = JSON.parse(fileData) as StoredFileData;
            files.push(parsedData);
          } catch (parseError) {
            console.warn(`Failed to parse file data for key: ${key}`);
          }
        }
      }
    }

    return {
      success: true,
      data: files as any // Type assertion for compatibility
    };
  } catch (error) {
    console.error('Error listing files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Convert file to base64 for storage
 */
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

/**
 * Convert base64 data back to a downloadable blob
 */
export const base64ToBlob = (base64Data: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Download a file from storage
 */
export const downloadStoredFile = async (fileKey: string, customFileName?: string): Promise<FileStorageResponse> => {
  try {
    const fileResponse = await getReportFile(fileKey);
    if (!fileResponse.success || !fileResponse.data) {
      return fileResponse;
    }

    const { fileData, type, newName } = fileResponse.data;
    const blob = base64ToBlob(fileData, type);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = customFileName || newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      success: true,
      fileKey
    };
  } catch (error) {
    console.error('Error downloading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
