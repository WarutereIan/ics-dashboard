import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, MapPin, Building, Clock, Hash } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  COUNTRIES,
  PROJECTS,
  REPORT_TYPES,
  VERSION_CONTROLS,
  getProjectsByCountry,
  getRegionsByCountry,
  generateFileName,
  validateNamingConvention,
  type NamingConventionData,
  type Country,
  type Region,
  type Project,
  type ReportType
} from '@/lib/namingConvention';

interface NamingConventionFormProps {
  initialData?: Partial<NamingConventionData>;
  onDataChange?: (data: NamingConventionData, fileName: string) => void;
  showPreview?: boolean;
  disabled?: boolean;
}

export function NamingConventionForm({
  initialData,
  onDataChange,
  showPreview = true,
  disabled = false
}: NamingConventionFormProps) {
  const [formData, setFormData] = useState<NamingConventionData>({
    countryCode: initialData?.countryCode || '',
    regionCode: initialData?.regionCode || '',
    projectCode: initialData?.projectCode || '',
    reportTypeCode: initialData?.reportTypeCode || '',
    date: initialData?.date || new Date(),
    versionControl: initialData?.versionControl || ''
  });

  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [availableRegions, setAvailableRegions] = useState<Region[]>([]);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({ isValid: false, errors: [] });

  // Update available projects when country changes
  useEffect(() => {
    if (formData.countryCode) {
      const projects = getProjectsByCountry(formData.countryCode);
      setAvailableProjects(projects);
      
      // Reset project if it's not available for the selected country
      if (!projects.find(p => p.code === formData.projectCode)) {
        setFormData(prev => ({ ...prev, projectCode: '' }));
      }
    } else {
      setAvailableProjects([]);
      setFormData(prev => ({ ...prev, projectCode: '' }));
    }
  }, [formData.countryCode]);

  // Update available regions when country changes
  useEffect(() => {
    if (formData.countryCode) {
      const regions = getRegionsByCountry(formData.countryCode);
      setAvailableRegions(regions);
      
      // Reset region if it's not available for the selected country
      if (!regions.find(r => r.code === formData.regionCode)) {
        setFormData(prev => ({ ...prev, regionCode: '' }));
      }
    } else {
      setAvailableRegions([]);
      setFormData(prev => ({ ...prev, regionCode: '' }));
    }
  }, [formData.countryCode]);

  // Validate form data whenever it changes
  useEffect(() => {
    if (formData.countryCode && formData.regionCode && formData.projectCode && formData.reportTypeCode) {
      const validationResult = validateNamingConvention(formData);
      setValidation(validationResult);
      
      if (validationResult.isValid && onDataChange) {
        const fileName = generateFileName(formData);
        onDataChange(formData, fileName);
      }
    } else {
      setValidation({ isValid: false, errors: [] });
    }
  }, [formData, onDataChange]);

  const handleFieldChange = (field: keyof NamingConventionData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedCountry = (): Country | undefined => {
    return COUNTRIES.find(c => c.code === formData.countryCode);
  };

  const getSelectedRegion = (): Region | undefined => {
    return availableRegions.find(r => r.code === formData.regionCode);
  };

  const getSelectedProject = (): Project | undefined => {
    return availableProjects.find(p => p.code === formData.projectCode);
  };

  const getSelectedReportType = (): ReportType | undefined => {
    return REPORT_TYPES.find(t => t.code === formData.reportTypeCode);
  };

  const getSelectedVersionControl = (): string => {
    return VERSION_CONTROLS.find(v => v.code === formData.versionControl)?.name || '';
  };

  const generatedFileName = generateFileName(formData);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Naming Convention Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Country Selection */}
        <div className="space-y-2">
          <Label htmlFor="country" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Country *
          </Label>
          <Select
            value={formData.countryCode}
            onValueChange={(value) => handleFieldChange('countryCode', value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getSelectedCountry() && (
            <p className="text-sm text-gray-600">
              {getSelectedCountry()!.name} - {getSelectedCountry()!.regions.length} regions available
            </p>
          )}
        </div>

        {/* Region Selection */}
        <div className="space-y-2">
          <Label htmlFor="region" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Administrative Region *
          </Label>
          <Select
            value={formData.regionCode}
            onValueChange={(value) => handleFieldChange('regionCode', value)}
            disabled={disabled || !formData.countryCode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {availableRegions.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  {region.name} ({region.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getSelectedRegion() && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">{getSelectedRegion()!.name}</p>
              <p>Areas: {getSelectedRegion()!.areas.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Project Selection */}
        <div className="space-y-2">
          <Label htmlFor="project" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Project *
          </Label>
          <Select
            value={formData.projectCode}
            onValueChange={(value) => handleFieldChange('projectCode', value)}
            disabled={disabled || !formData.countryCode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {availableProjects.map((project) => (
                <SelectItem key={project.code} value={project.code}>
                  {project.name} ({project.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getSelectedProject() && (
            <p className="text-sm text-gray-600">
              {getSelectedProject()!.description}
            </p>
          )}
        </div>

        {/* Report Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="reportType" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Report Type *
          </Label>
          <Select
            value={formData.reportTypeCode}
            onValueChange={(value) => handleFieldChange('reportTypeCode', value)}
            disabled={disabled}
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
          {getSelectedReportType() && (
            <p className="text-sm text-gray-600">
              {getSelectedReportType()!.description}
            </p>
          )}
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Report Date *
          </Label>
          <DateTimePicker
            date={formData.date}
            onDateChange={(date) => handleFieldChange('date', date || new Date())}
            disabled={disabled}
            placeholder="Select date and time"
          />
        </div>

        {/* Version Control */}
        <div className="space-y-2">
          <Label htmlFor="versionControl" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Version Control (Optional)
          </Label>
          <Select
            value={formData.versionControl}
            onValueChange={(value) => handleFieldChange('versionControl', value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select version control" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No version control</SelectItem>
              {VERSION_CONTROLS.map((version) => (
                <SelectItem key={version.code} value={version.code}>
                  {version.name} ({version.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.versionControl && (
            <p className="text-sm text-gray-600">
              {getSelectedVersionControl()}
            </p>
          )}
        </div>

        {/* Validation Errors */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* File Name Preview */}
        {showPreview && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generated File Name
              </Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <code className="text-sm font-mono break-all">
                  {generatedFileName}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={validation.isValid ? "default" : "secondary"}>
                  {validation.isValid ? "Valid" : "Invalid"}
                </Badge>
                {validation.isValid && (
                  <Badge variant="outline">
                    Ready to use
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
