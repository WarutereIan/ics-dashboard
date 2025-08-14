import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageUploadQuestion, VideoUploadQuestion, FileUploadQuestion, AudioUploadQuestion } from '../types';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { FormQuestion, ActivityKPIMapping } from '../types';

interface BaseQuestionEditorProps {
  question: FormQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
  children?: React.ReactNode;
}

type MediaUploadQuestionEditorProps = BaseQuestionEditorProps & {
  question: ImageUploadQuestion | VideoUploadQuestion | FileUploadQuestion | AudioUploadQuestion;
};

export function MediaUploadQuestionEditor(props: MediaUploadQuestionEditorProps) {
  const { question, onUpdate } = props;

  const getMediaTypeConfig = () => {
    switch (question.type) {
      case 'IMAGE_UPLOAD':
        return {
          title: 'Image Upload Settings',
          icon: '🖼️',
          defaultFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
          defaultMaxSize: 5 * 1024 * 1024, // 5MB
          sizeUnit: 'MB'
        };
      case 'VIDEO_UPLOAD':
        return {
          title: 'Video Upload Settings',
          icon: '🎥',
          defaultFormats: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
          defaultMaxSize: 100 * 1024 * 1024, // 100MB
          sizeUnit: 'MB'
        };
      case 'AUDIO_UPLOAD':
        return {
          title: 'Audio Upload Settings',
          icon: '🎵',
          defaultFormats: ['audio/mp3', 'audio/wav', 'audio/aac'],
          defaultMaxSize: 50 * 1024 * 1024, // 50MB
          sizeUnit: 'MB'
        };
      case 'FILE_UPLOAD':
        return {
          title: 'File Upload Settings',
          icon: '📎',
          defaultFormats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/rtf'],
          defaultMaxSize: 25 * 1024 * 1024, // 25MB
          sizeUnit: 'MB'
        };
      default:
        return {
          title: 'Media Upload Settings',
          icon: '📁',
          defaultFormats: [],
          defaultMaxSize: 10 * 1024 * 1024,
          sizeUnit: 'MB'
        };
    }
  };

  const config = getMediaTypeConfig();

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb} MB`;
  };

  const parseFileSize = (sizeString: string) => {
    const match = sizeString.match(/(\d+(?:\.\d+)?)\s*MB/i);
    if (match) {
      return Math.round(parseFloat(match[1]) * 1024 * 1024);
    }
    return config.defaultMaxSize;
  };

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-6">
        {/* Media Upload Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{config.icon}</span>
              {config.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
         

            {/* Image Upload - Simple Configuration */}
            {question.type === 'IMAGE_UPLOAD' && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🖼️</span>
                    <Label className="text-sm font-medium">Image Upload Settings</Label>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Default Configuration:</strong>
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• All image formats allowed (JPEG, PNG, GIF, WebP)</li>
                      <li>• Maximum file size: 5MB per image</li>
                      <li>• Up to 10 images can be uploaded</li>
                      <li>• No dimension restrictions</li>
                      <li>• Medium preview size</li>
                      <li>• 80% compression quality</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Video Upload - Simple Configuration */}
            {question.type === 'VIDEO_UPLOAD' && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🎥</span>
                    <Label className="text-sm font-medium">Video Upload Settings</Label>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Default Configuration:</strong>
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• All video formats allowed (MP4, AVI, MOV, WMV, WebM)</li>
                      <li>• Maximum file size: 100MB per video</li>
                      <li>• Up to 4 videos can be uploaded</li>
                      <li>• No duration restrictions</li>
                      <li>• Auto-compression enabled</li>
                      <li>• Medium quality settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Upload - Simple Configuration */}
            {question.type === 'AUDIO_UPLOAD' && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🎵</span>
                    <Label className="text-sm font-medium">Audio Upload Settings</Label>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Default Configuration:</strong>
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• All audio formats allowed (MP3, WAV, AAC, OGG, M4A)</li>
                      <li>• Maximum file size: 50MB per audio file</li>
                      <li>• Up to 3 audio files can be uploaded</li>
                      <li>• No duration restrictions</li>
                      <li>• Auto-compression enabled</li>
                      <li>• Medium quality settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload - Simple Configuration */}
            {question.type === 'FILE_UPLOAD' && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📎</span>
                    <Label className="text-sm font-medium">File Upload Settings</Label>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Default Configuration:</strong>
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• All common file formats allowed (PDF, DOC, DOCX, TXT, etc.)</li>
                      <li>• Maximum file size: 25MB per file</li>
                      <li>• Up to 5 files can be uploaded</li>
                      <li>• File preview enabled</li>
                      <li>• No file name length restrictions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Settings Summary */}
       {/*  <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Max File Size:</span>
                <Badge variant="secondary">{formatFileSize(question.maxFileSize || config.defaultMaxSize)}</Badge>
              </div>
                           <div className="flex justify-between">
               <span className="text-sm">Max Files:</span>
               <Badge variant="secondary">
                 {question.maxFiles || (
                   question.type === 'IMAGE_UPLOAD' ? 10 : 
                   question.type === 'VIDEO_UPLOAD' ? 4 : 
                   question.type === 'AUDIO_UPLOAD' ? 3 : 1
                 )}
               </Badge>
             </div>
             <div className="flex justify-between">
               <span className="text-sm">Multiple Files:</span>
               <Badge variant={question.allowMultiple ? "default" : "secondary"}>
                 {question.allowMultiple ? "Allowed" : "Single file only"}
               </Badge>
             </div>
              <div className="flex justify-between">
                <span className="text-sm">Allowed Formats:</span>
                <Badge variant="outline">
                  {(question.allowedFormats || config.defaultFormats).length} formats
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </BaseQuestionEditor>
  );
}
