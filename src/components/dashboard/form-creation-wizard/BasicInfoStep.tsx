import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileText, FolderOpen } from 'lucide-react';
import { Form } from './types';

interface BasicInfoStepProps {
  form: Partial<Form>;
  availableProjects: { id: string; name: string; }[];
  onUpdate: (field: string, value: any) => void;
}

export function BasicInfoStep({ form, availableProjects, onUpdate }: BasicInfoStepProps) {
  const selectedProject = availableProjects.find(p => p.id === form.projectId);

  return (
    <div className="space-y-6">
      {/* Form Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Form Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title *</Label>
            <Input
              id="form-title"
              value={form.title || ''}
              onChange={(e) => onUpdate('title', e.target.value)}
              placeholder="Enter a descriptive title for your form"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be displayed to respondents as the form title
            </p>
          </div>

          <div>
            <Label htmlFor="form-description">Description (optional)</Label>
            <Textarea
              id="form-description"
              value={form.description || ''}
              onChange={(e) => onUpdate('description', e.target.value)}
              placeholder="Provide additional context about this form and its purpose"
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Help respondents understand what this form is for and why their input matters
            </p>
          </div>

          {form.id && (
            <div className="p-3 bg-blue-50 rounded-lg border">
              <p className="text-sm font-medium text-blue-900">Form ID</p>
              <p className="text-sm text-blue-700 font-mono">{form.id}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Association */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Project Association
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-select">Select Project *</Label>
            <Select value={form.projectId || ''} onValueChange={(value) => onUpdate('projectId', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose which project this form belongs to..." />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Forms are associated with projects to enable activity linking and KPI tracking
            </p>
          </div>

          {selectedProject && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900">Selected Project</p>
              <p className="text-sm text-green-700">{selectedProject.name}</p>
              <p className="text-xs text-green-600 mt-1">
                You'll be able to link form questions to activities in this project
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Form Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-category">Category (optional)</Label>
            <Input
              id="form-category"
              value={form.category || ''}
              onChange={(e) => onUpdate('category', e.target.value)}
              placeholder="e.g., Baseline Survey, Monitoring, Evaluation"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="form-tags">Tags (optional)</Label>
            <Input
              id="form-tags"
              value={form.tags?.join(', ') || ''}
              onChange={(e) => onUpdate('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
              placeholder="Enter tags separated by commas"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tags help organize and filter forms. Examples: survey, baseline, endline, monthly
            </p>
          </div>

          {form.tags && form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Notice */}
      {(!form.title || !form.projectId) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Required Information</p>
                <p className="text-sm text-orange-700">
                  Please provide a form title and select a project to continue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}