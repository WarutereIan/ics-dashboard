import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { ProjectFormData } from './types';

interface ProjectDetailsFormProps {
  projectData: ProjectFormData;
  onProjectChange: (field: keyof ProjectFormData, value: any) => void;
}

export function ProjectDetailsForm({ projectData, onProjectChange }: ProjectDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            value={projectData.name}
            onChange={(e) => onProjectChange('name', e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <div>
          <Label htmlFor="country">Country *</Label>
          <Select value={projectData.country} onValueChange={(value) => onProjectChange('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kenya">Kenya</SelectItem>
              <SelectItem value="tanzania">Tanzania</SelectItem>
              <SelectItem value="cote d'ivoire">Côte d'Ivoire</SelectItem>
             
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={projectData.description}
          onChange={(e) => onProjectChange('description', e.target.value)}
          placeholder="Enter project description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={projectData.status} onValueChange={(value) => onProjectChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <DatePicker
            date={projectData.startDate}
            onDateChange={(date) => onProjectChange('startDate', date)}
            placeholder="Select start date"
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <DatePicker
            date={projectData.endDate}
            onDateChange={(date) => onProjectChange('endDate', date)}
            placeholder="Select end date"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="budget">Budget (USD)</Label>
        <Input
          id="budget"
          type="number"
          value={projectData.budget}
          onChange={(e) => onProjectChange('budget', parseInt(e.target.value) || 0)}
          placeholder="Enter project budget"
        />
      </div>

      {projectData.id && (
        <div className="p-3 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>Project ID:</strong> {projectData.id}
          </p>
        </div>
      )}
    </div>
  );
}