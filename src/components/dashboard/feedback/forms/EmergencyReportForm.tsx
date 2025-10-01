import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ExclamationTriangleIcon, MapPinIcon, ClockIcon, UsersIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Phone, Camera, Send, Shield, Zap } from 'lucide-react';


interface EmergencyReportFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function EmergencyReportForm({ onSubmit, isSubmitting }: EmergencyReportFormProps) {
  const [formData, setFormData] = useState({
    // Reporter Information
    isAnonymous: false,
    name: '',
    email: '',
    phone: '',
    relationship: '',
    
    // Emergency Details
    emergencyType: '',
    severity: '',
    title: '',
    description: '',
    location: '',
    specificAddress: '',
    emergencyDate: '',
    emergencyTime: '',
    
    // Immediate Threat Assessment
    ongoingThreat: false,
    threatDescription: '',
    peopleAtRisk: '',
    estimatedCasualties: '',
    
    // Response Status
    emergencyServicesCalled: false,
    servicesContacted: [] as string[],
    responseTime: '',
    currentStatus: '',
    
    // Immediate Actions Needed
    immediateActions: '',
    resourcesNeeded: '',
    evacuationRequired: false,
    shelterNeeded: false,
    
    // Follow-up
    followUp: false,
    followUpMethod: '',
    
    // Attachments
    attachments: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const emergencyTypes = [
    { value: 'medical_emergency', label: 'Medical Emergency' },
    { value: 'fire', label: 'Fire' },
    { value: 'natural_disaster', label: 'Natural Disaster' },
    { value: 'security_threat', label: 'Security Threat' },
    { value: 'structural_collapse', label: 'Structural Collapse' },
    { value: 'chemical_spill', label: 'Chemical/Hazardous Material Spill' },
    { value: 'violence', label: 'Violence or Active Threat' },
    { value: 'infrastructure_failure', label: 'Infrastructure Failure' },
    { value: 'mass_casualty', label: 'Mass Casualty Event' },
    { value: 'other', label: 'Other Emergency' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low - Minor emergency, contained' },
    { value: 'moderate', label: 'Moderate - Requires immediate attention' },
    { value: 'high', label: 'High - Serious emergency, multiple people affected' },
    { value: 'critical', label: 'Critical - Life-threatening, widespread impact' },
    { value: 'catastrophic', label: 'Catastrophic - Major disaster, mass casualties' }
  ];

  const relationships = [
    { value: 'witness', label: 'Witness' },
    { value: 'victim', label: 'Victim/Affected Person' },
    { value: 'staff', label: 'Program Staff' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'community_member', label: 'Community Member' },
    { value: 'emergency_responder', label: 'Emergency Responder' },
    { value: 'other', label: 'Other' }
  ];

  const emergencyServices = [
    { value: 'police', label: 'Police' },
    { value: 'fire_department', label: 'Fire Department' },
    { value: 'ambulance', label: 'Ambulance/Medical' },
    { value: 'emergency_management', label: 'Emergency Management' },
    { value: 'hazmat', label: 'Hazmat Team' },
    { value: 'search_rescue', label: 'Search & Rescue' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    const services = checked 
      ? [...formData.servicesContacted, service]
      : formData.servicesContacted.filter(s => s !== service);
    handleInputChange('servicesContacted', services);
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
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required for emergency reports';
      }
    }

    if (!formData.emergencyType) {
      newErrors.emergencyType = 'Please select the type of emergency';
    }

    if (!formData.severity) {
      newErrors.severity = 'Please select the severity level';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a title for the emergency';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please provide the emergency location';
    }

    if (!formData.emergencyDate) {
      newErrors.emergencyDate = 'Please provide the emergency date';
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
      {/* Emergency Alert Banner */}
      <Card className="border-red-500 bg-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-bold text-emerald-800">EMERGENCY REPORT</h3>
              <p className="text-sm text-emerald-700">
                This form is for reporting emergency situations requiring immediate attention. 
                If this is a life-threatening emergency, please call 911 immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reporter Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
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
                  <p className="text-sm text-emerald-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-sm text-emerald-600">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Your Relationship to the Emergency</Label>
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

      {/* Emergency Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            Emergency Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyType">Type of Emergency *</Label>
              <Select
                value={formData.emergencyType}
                onValueChange={(value) => handleInputChange('emergencyType', value)}
              >
                <SelectTrigger className={errors.emergencyType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  {emergencyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.emergencyType && (
                <p className="text-sm text-emerald-600">{errors.emergencyType}</p>
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
                <p className="text-sm text-emerald-600">{errors.severity}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Emergency Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
              placeholder="Brief title describing the emergency"
            />
            {errors.title && (
              <p className="text-sm text-emerald-600">{errors.title}</p>
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
              placeholder="Please provide a detailed description of the emergency situation, including what is happening, who is affected, and any immediate dangers..."
            />
            {errors.description && (
              <p className="text-sm text-emerald-600">{errors.description}</p>
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
                <p className="text-sm text-emerald-600">{errors.location}</p>
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
              <Label htmlFor="emergencyDate">Date of Emergency *</Label>
              <Input
                id="emergencyDate"
                type="date"
                value={formData.emergencyDate}
                onChange={(e) => handleInputChange('emergencyDate', e.target.value)}
                className={errors.emergencyDate ? 'border-red-500' : ''}
              />
              {errors.emergencyDate && (
                <p className="text-sm text-emerald-600">{errors.emergencyDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyTime">Time of Emergency</Label>
              <Input
                id="emergencyTime"
                type="time"
                value={formData.emergencyTime}
                onChange={(e) => handleInputChange('emergencyTime', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Threat Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ongoingThreat"
              checked={formData.ongoingThreat}
              onCheckedChange={(checked) => handleInputChange('ongoingThreat', checked)}
            />
            <Label htmlFor="ongoingThreat" className="text-sm font-medium">
              This is an ongoing threat/emergency
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threatDescription">Threat Description</Label>
            <Textarea
              id="threatDescription"
              value={formData.threatDescription}
              onChange={(e) => handleInputChange('threatDescription', e.target.value)}
              rows={2}
              placeholder="Describe any ongoing threats, dangers, or risks..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peopleAtRisk">People at Risk</Label>
              <Input
                id="peopleAtRisk"
                value={formData.peopleAtRisk}
                onChange={(e) => handleInputChange('peopleAtRisk', e.target.value)}
                placeholder="Number of people affected or at risk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCasualties">Estimated Casualties</Label>
              <Input
                id="estimatedCasualties"
                value={formData.estimatedCasualties}
                onChange={(e) => handleInputChange('estimatedCasualties', e.target.value)}
                placeholder="Number of injuries or casualties"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Response Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emergencyServicesCalled"
              checked={formData.emergencyServicesCalled}
              onCheckedChange={(checked) => handleInputChange('emergencyServicesCalled', checked)}
            />
            <Label htmlFor="emergencyServicesCalled" className="text-sm font-medium">
              Emergency services have been called
            </Label>
          </div>

          {formData.emergencyServicesCalled && (
            <div className="space-y-3">
              <Label>Which services were contacted?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {emergencyServices.map((service) => (
                  <div key={service.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.value}
                      checked={formData.servicesContacted.includes(service.value)}
                      onCheckedChange={(checked) => handleServiceToggle(service.value, checked as boolean)}
                    />
                    <Label htmlFor={service.value} className="text-sm">
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responseTime">Response Time</Label>
              <Input
                id="responseTime"
                value={formData.responseTime}
                onChange={(e) => handleInputChange('responseTime', e.target.value)}
                placeholder="How long did it take for services to arrive?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentStatus">Current Status</Label>
              <Select
                value={formData.currentStatus}
                onValueChange={(value) => handleInputChange('currentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select current status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing Emergency</SelectItem>
                  <SelectItem value="contained">Contained</SelectItem>
                  <SelectItem value="under_control">Under Control</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Immediate Actions Needed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Immediate Actions Needed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="immediateActions">Immediate Actions Required</Label>
            <Textarea
              id="immediateActions"
              value={formData.immediateActions}
              onChange={(e) => handleInputChange('immediateActions', e.target.value)}
              rows={3}
              placeholder="Describe any immediate actions that need to be taken..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourcesNeeded">Resources Needed</Label>
            <Textarea
              id="resourcesNeeded"
              value={formData.resourcesNeeded}
              onChange={(e) => handleInputChange('resourcesNeeded', e.target.value)}
              rows={2}
              placeholder="What resources, equipment, or personnel are needed?"
            />
          </div>

          <div className="space-y-3">
            <Label>Immediate Needs</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="evacuationRequired"
                  checked={formData.evacuationRequired}
                  onCheckedChange={(checked) => handleInputChange('evacuationRequired', checked)}
                />
                <Label htmlFor="evacuationRequired" className="text-sm">
                  Evacuation is required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shelterNeeded"
                  checked={formData.shelterNeeded}
                  onCheckedChange={(checked) => handleInputChange('shelterNeeded', checked)}
                />
                <Label htmlFor="shelterNeeded" className="text-sm">
                  Emergency shelter is needed
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
                  <SelectItem value="phone">Phone Call (Preferred for emergencies)</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS/Text Message</SelectItem>
                  <SelectItem value="in_person">In-Person Meeting</SelectItem>
                </SelectContent>
              </Select>
              {errors.followUpMethod && (
                <p className="text-sm text-emerald-600">{errors.followUpMethod}</p>
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
            <Label htmlFor="attachments">Upload photos, videos, or documents</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-600">
              Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, MP4, MOV (Max 10MB per file)
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
          className="min-w-[150px] bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Emergency Report
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
