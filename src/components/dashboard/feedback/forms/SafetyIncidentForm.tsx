import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Camera,
  FileText,
  Send,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface SafetyIncidentFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function SafetyIncidentForm({ onSubmit, isSubmitting }: SafetyIncidentFormProps) {
  const [formData, setFormData] = useState({
    // Reporter Information
    isAnonymous: false,
    name: '',
    email: '',
    phone: '',
    relationship: '',
    
    // Incident Details
    incidentType: '',
    severity: '',
    title: '',
    description: '',
    location: '',
    specificAddress: '',
    incidentDate: '',
    incidentTime: '',
    
    // People Involved
    peopleInvolved: '',
    witnesses: '',
    injuries: '',
    medicalAttention: false,
    
    // Environmental Factors
    weatherConditions: '',
    lighting: '',
    equipmentInvolved: '',
    safetyEquipment: '',
    
    // Immediate Actions
    immediateActions: '',
    emergencyServices: false,
    policeNotified: false,
    medicalServices: false,
    
    // Follow-up
    followUp: false,
    followUpMethod: '',
    
    // Attachments
    attachments: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const incidentTypes = [
    { value: 'slip_fall', label: 'Slip, Trip, or Fall' },
    { value: 'equipment_malfunction', label: 'Equipment Malfunction' },
    { value: 'vehicle_accident', label: 'Vehicle Accident' },
    { value: 'fire_emergency', label: 'Fire or Emergency' },
    { value: 'violence_threat', label: 'Violence or Threat' },
    { value: 'environmental_hazard', label: 'Environmental Hazard' },
    { value: 'structural_damage', label: 'Structural Damage' },
    { value: 'chemical_exposure', label: 'Chemical Exposure' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'minor', label: 'Minor - No injuries, minimal damage' },
    { value: 'moderate', label: 'Moderate - Minor injuries, some damage' },
    { value: 'serious', label: 'Serious - Injuries requiring medical attention' },
    { value: 'severe', label: 'Severe - Major injuries or significant damage' },
    { value: 'critical', label: 'Critical - Life-threatening or fatal' }
  ];

  const relationships = [
    { value: 'witness', label: 'Witness' },
    { value: 'victim', label: 'Victim/Injured Party' },
    { value: 'staff', label: 'Program Staff' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'community_member', label: 'Community Member' },
    { value: 'other', label: 'Other' }
  ];

  const weatherConditions = [
    { value: 'clear', label: 'Clear/Sunny' },
    { value: 'cloudy', label: 'Cloudy' },
    { value: 'rainy', label: 'Rainy' },
    { value: 'stormy', label: 'Stormy' },
    { value: 'foggy', label: 'Foggy' },
    { value: 'snowy', label: 'Snowy' },
    { value: 'unknown', label: 'Unknown' }
  ];

  const lightingConditions = [
    { value: 'daylight', label: 'Daylight' },
    { value: 'dusk_dawn', label: 'Dusk/Dawn' },
    { value: 'artificial_light', label: 'Artificial Light' },
    { value: 'poor_lighting', label: 'Poor Lighting' },
    { value: 'no_lighting', label: 'No Lighting' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isAnonymous) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required for non-anonymous reports';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required for non-anonymous reports';
      }
    }

    if (!formData.incidentType) {
      newErrors.incidentType = 'Please select the type of incident';
    }

    if (!formData.severity) {
      newErrors.severity = 'Please select the severity level';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a title for the incident';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please provide the incident location';
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Please provide the incident date';
    }

    if (formData.followUp && !formData.followUpMethod) {
      newErrors.followUpMethod = 'Please specify how you would like to be contacted';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Reporter Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Reporter Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) => handleInputChange('isAnonymous', checked)}
            />
            <Label htmlFor="anonymous" className="text-sm font-medium">
              Submit anonymously (your identity will not be recorded)
            </Label>
          </div>

          {!formData.isAnonymous && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Your Relationship to the Incident</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => handleInputChange('relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incident Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incidentType">Type of Incident *</Label>
              <Select
                value={formData.incidentType}
                onValueChange={(value) => handleInputChange('incidentType', value)}
              >
                <SelectTrigger className={errors.incidentType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incidentType && (
                <p className="text-sm text-red-600">{errors.incidentType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => handleInputChange('severity', value)}
              >
                <SelectTrigger className={errors.severity ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.severity && (
                <p className="text-sm text-red-600">{errors.severity}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Incident Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
              placeholder="Brief title describing the incident"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
              placeholder="Please provide a detailed description of what happened, including the sequence of events..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={errors.location ? 'border-red-500' : ''}
                placeholder="General location (e.g., Community Center, School)"
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificAddress">Specific Address</Label>
              <Input
                id="specificAddress"
                value={formData.specificAddress}
                onChange={(e) => handleInputChange('specificAddress', e.target.value)}
                placeholder="Street address, room number, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incidentDate">Date of Incident *</Label>
              <Input
                id="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                className={errors.incidentDate ? 'border-red-500' : ''}
              />
              {errors.incidentDate && (
                <p className="text-sm text-red-600">{errors.incidentDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentTime">Time of Incident</Label>
              <Input
                id="incidentTime"
                type="time"
                value={formData.incidentTime}
                onChange={(e) => handleInputChange('incidentTime', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* People Involved */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            People Involved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="peopleInvolved">People Involved in the Incident</Label>
            <Textarea
              id="peopleInvolved"
              value={formData.peopleInvolved}
              onChange={(e) => handleInputChange('peopleInvolved', e.target.value)}
              rows={2}
              placeholder="Describe who was involved (names, roles, etc.)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="witnesses">Witnesses</Label>
            <Textarea
              id="witnesses"
              value={formData.witnesses}
              onChange={(e) => handleInputChange('witnesses', e.target.value)}
              rows={2}
              placeholder="List any witnesses and their contact information if available"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="injuries">Injuries Sustained</Label>
            <Textarea
              id="injuries"
              value={formData.injuries}
              onChange={(e) => handleInputChange('injuries', e.target.value)}
              rows={2}
              placeholder="Describe any injuries, including severity and affected individuals"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="medicalAttention"
              checked={formData.medicalAttention}
              onCheckedChange={(checked) => handleInputChange('medicalAttention', checked)}
            />
            <Label htmlFor="medicalAttention" className="text-sm font-medium">
              Medical attention was required
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weatherConditions">Weather Conditions</Label>
              <Select
                value={formData.weatherConditions}
                onValueChange={(value) => handleInputChange('weatherConditions', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weather conditions" />
                </SelectTrigger>
                <SelectContent>
                  {weatherConditions.map((weather) => (
                    <SelectItem key={weather.value} value={weather.value}>
                      {weather.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lighting">Lighting Conditions</Label>
              <Select
                value={formData.lighting}
                onValueChange={(value) => handleInputChange('lighting', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lighting conditions" />
                </SelectTrigger>
                <SelectContent>
                  {lightingConditions.map((light) => (
                    <SelectItem key={light.value} value={light.value}>
                      {light.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentInvolved">Equipment Involved</Label>
              <Input
                id="equipmentInvolved"
                value={formData.equipmentInvolved}
                onChange={(e) => handleInputChange('equipmentInvolved', e.target.value)}
                placeholder="Describe any equipment involved in the incident"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="safetyEquipment">Safety Equipment</Label>
              <Input
                id="safetyEquipment"
                value={formData.safetyEquipment}
                onChange={(e) => handleInputChange('safetyEquipment', e.target.value)}
                placeholder="Was safety equipment used? Was it adequate?"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Immediate Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Immediate Actions Taken</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="immediateActions">Actions Taken Immediately After the Incident</Label>
            <Textarea
              id="immediateActions"
              value={formData.immediateActions}
              onChange={(e) => handleInputChange('immediateActions', e.target.value)}
              rows={3}
              placeholder="Describe what actions were taken immediately after the incident occurred..."
            />
          </div>

          <div className="space-y-3">
            <Label>Emergency Services Contacted</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="policeNotified"
                  checked={formData.policeNotified}
                  onCheckedChange={(checked) => handleInputChange('policeNotified', checked)}
                />
                <Label htmlFor="policeNotified" className="text-sm">
                  Police were notified
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medicalServices"
                  checked={formData.medicalServices}
                  onCheckedChange={(checked) => handleInputChange('medicalServices', checked)}
                />
                <Label htmlFor="medicalServices" className="text-sm">
                  Medical services were called
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergencyServices"
                  checked={formData.emergencyServices}
                  onCheckedChange={(checked) => handleInputChange('emergencyServices', checked)}
                />
                <Label htmlFor="emergencyServices" className="text-sm">
                  Other emergency services were contacted
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="followUp"
              checked={formData.followUp}
              onCheckedChange={(checked) => handleInputChange('followUp', checked)}
            />
            <Label htmlFor="followUp" className="text-sm font-medium">
              I would like to be contacted for follow-up
            </Label>
          </div>

          {formData.followUp && (
            <div className="space-y-2">
              <Label htmlFor="followUpMethod">Preferred Contact Method</Label>
              <Select
                value={formData.followUpMethod}
                onValueChange={(value) => handleInputChange('followUpMethod', value)}
              >
                <SelectTrigger className={errors.followUpMethod ? 'border-red-500' : ''}>
                  <SelectValue placeholder="How would you like to be contacted?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="sms">SMS/Text Message</SelectItem>
                  <SelectItem value="in_person">In-Person Meeting</SelectItem>
                </SelectContent>
              </Select>
              {errors.followUpMethod && (
                <p className="text-sm text-red-600">{errors.followUpMethod}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Supporting Evidence (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attachments">Upload photos, documents, or other evidence</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-600">
              Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB per file)
            </p>
          </div>

          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files</Label>
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-[150px] bg-orange-600 hover:bg-orange-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Report
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
