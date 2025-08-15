import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, File, Image, Video, Music } from 'lucide-react';
import { FormQuestion } from '../../form-creation-wizard/types';
import { BaseQuestionRenderer } from './BaseQuestionRenderer';

interface MediaUploadQuestionRendererProps {
  question: FormQuestion;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
}

export function MediaUploadQuestionRenderer({ 
  question, 
  value = [], 
  onChange, 
  disabled = false 
}: MediaUploadQuestionRendererProps) {
  const [dragActive, setDragActive] = useState(false);

  const getMediaTypeConfig = () => {
    switch (question.type) {
      case 'IMAGE_UPLOAD':
        return {
          icon: Image,
          title: 'Image Upload',
          acceptedTypes: 'image/*',
          maxFiles: question.maxFiles || 10,
          maxSize: question.maxFileSize || 5 * 1024 * 1024, // 5MB
          formats: question.allowedFormats || ['jpg', 'jpeg', 'png', 'gif', 'webp']
        };
      case 'VIDEO_UPLOAD':
        return {
          icon: Video,
          title: 'Video Upload',
          acceptedTypes: 'video/*',
          maxFiles: question.maxFiles || 4,
          maxSize: question.maxFileSize || 100 * 1024 * 1024, // 100MB
          formats: question.allowedFormats || ['mp4', 'avi', 'mov', 'wmv', 'webm']
        };
      case 'AUDIO_UPLOAD':
        return {
          icon: Music,
          title: 'Audio Upload',
          acceptedTypes: 'audio/*',
          maxFiles: question.maxFiles || 3,
          maxSize: question.maxFileSize || 50 * 1024 * 1024, // 50MB
          formats: question.allowedFormats || ['mp3', 'wav', 'aac', 'ogg', 'm4a']
        };
      case 'FILE_UPLOAD':
        return {
          icon: File,
          title: 'File Upload',
          acceptedTypes: '*/*',
          maxFiles: question.maxFiles || 5,
          maxSize: question.maxFileSize || 25 * 1024 * 1024, // 25MB
          formats: question.allowedFormats || ['pdf', 'doc', 'docx', 'txt', 'rtf']
        };
      default:
        return {
          icon: File,
          title: 'File Upload',
          acceptedTypes: '*/*',
          maxFiles: 1,
          maxSize: 10 * 1024 * 1024,
          formats: []
        };
    }
  };

  const config = getMediaTypeConfig();
  const IconComponent = config.icon;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !onChange) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Check file size
      if (file.size > config.maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(config.maxSize)}`);
        return false;
      }

      // Check file count
      if (value.length + 1 > config.maxFiles) {
        alert(`Maximum ${config.maxFiles} files allowed`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = [...value, ...validFiles];
      onChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    if (!onChange) return;
    const newFiles = value.filter((_: any, i: number) => i !== index);
    onChange(newFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <BaseQuestionRenderer question={question}>
      <div className="space-y-4">
        {/* Upload Area */}
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {config.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              
              <div className="space-y-2 text-xs text-gray-500">
                <p>Maximum {config.maxFiles} file{config.maxFiles !== 1 ? 's' : ''}</p>
                <p>Maximum size: {formatFileSize(config.maxSize)} per file</p>
                {config.formats.length > 0 && (
                  <p>Accepted formats: {config.formats.join(', ')}</p>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = (question as any).allowMultiple !== false;
                  input.accept = config.acceptedTypes;
                  input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
                  input.click();
                }}
                disabled={disabled}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {value && value.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Selected Files ({value.length}/{config.maxFiles})
            </h4>
            {value.map((file: File, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Validation Messages */}
        {question.validationRules?.map((rule, index) => (
          <div key={index} className="text-xs text-gray-500">
            {rule.message}
          </div>
        ))}
      </div>
    </BaseQuestionRenderer>
  );
}

