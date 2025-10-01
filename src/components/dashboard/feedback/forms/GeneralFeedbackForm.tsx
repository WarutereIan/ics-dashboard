import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { UserIcon, EnvelopeIcon, MapPinIcon, ChatBubbleLeftRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Phone, Star, Send } from 'lucide-react';


interface GeneralFeedbackFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function GeneralFeedbackForm({ onSubmit, isSubmitting }: GeneralFeedbackFormProps) {
  const [formData, setFormData] = useState({
    // Stakeholder Information
    stakeholderType: '',
    isAnonymous: false,
    name: '',
    email: '',
    phone: '',
    location: '',
    
    // Feedback Content
    feedbackType: '',
    overallRating: '',
    title: '',
    description: '',
    suggestions: '',
    
    // Additional Information
    programArea: '',
    frequency: '',
    impact: '',
    followUp: false,
    followUpMethod: '',
    
    // Attachments
    attachments: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const stakeholderTypes = [
    { value: 'community_member', label: 'Community Member' },
    { value: 'program_beneficiary', label: 'Program Beneficiary' },
    { value: 'observer', label: 'External Observer' },
    { value: 'partner_organization', label: 'Partner Organization' },
    { value: 'government_official', label: 'Government Official' }
  ];

  const feedbackTypes = [
    { value: 'suggestion', label: 'Improvement Suggestion' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'compliment', label: 'Compliment' },
    { value: 'question', label: 'Question' },
    { value: 'other', label: 'Other' }
  ];

  const programAreas = [
    { value: 'health', label: 'Health Services' },
    { value: 'education', label: 'Education Programs' },
    { value: 'livelihood', label: 'Livelihood Support' },
    { value: 'infrastructure', label: 'Infrastructure Development' },
    { value: 'governance', label: 'Community Governance' },
    { value: 'other', label: 'Other' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'occasionally', label: 'Occasionally' },
    { value: 'first_time', label: 'First Time' }
  ];

  const impacts = [
    { value: 'very_positive', label: 'Very Positive' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' },
    { value: 'very_negative', label: 'Very Negative' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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

    if (!formData.stakeholderType) {
      newErrors.stakeholderType = 'Please select your stakeholder type';
    }

    if (!formData.isAnonymous) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required for non-anonymous submissions';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required for non-anonymous submissions';
      }
    }

    if (!formData.feedbackType) {
      newErrors.feedbackType = 'Please select the type of feedback';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a title for your feedback';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description';
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
      {/* Stakeholder Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Your Information
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stakeholderType">I am a *</Label>
              <Select
                value={formData.stakeholderType}
                onValueChange={(value) => handleInputChange('stakeholderType', value)}
              >
                <SelectTrigger className={errors.stakeholderType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {stakeholderTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stakeholderType && (
                <p className="text-sm text-emerald-600">{errors.stakeholderType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="programArea">Program Area</Label>
              <Select
                value={formData.programArea}
                onValueChange={(value) => handleInputChange('programArea', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program area" />
                </SelectTrigger>
                <SelectContent>
                  {programAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  <p className="text-sm text-emerald-600">{errors.email}</p>
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
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State/Province"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedbackType">Type of Feedback *</Label>
              <Select
                value={formData.feedbackType}
                onValueChange={(value) => handleInputChange('feedbackType', value)}
              >
                <SelectTrigger className={errors.feedbackType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.feedbackType && (
                <p className="text-sm text-emerald-600">{errors.feedbackType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="overallRating">Overall Rating</Label>
              <Select
                value={formData.overallRating}
                onValueChange={(value) => handleInputChange('overallRating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                  <SelectItem value="2">⭐⭐ Poor</SelectItem>
                  <SelectItem value="1">⭐ Very Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
              placeholder="Brief title for your feedback"
            />
            {errors.title && (
              <p className="text-sm text-emerald-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
              placeholder="Please provide detailed feedback about your experience..."
            />
            {errors.description && (
              <p className="text-sm text-emerald-600">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggestions">Suggestions for Improvement</Label>
            <Textarea
              id="suggestions"
              value={formData.suggestions}
              onChange={(e) => handleInputChange('suggestions', e.target.value)}
              rows={3}
              placeholder="Any suggestions for how we can improve our services..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">How often do you interact with our program?</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => handleInputChange('frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">How has the program impacted you?</Label>
              <Select
                value={formData.impact}
                onValueChange={(value) => handleInputChange('impact', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact level" />
                </SelectTrigger>
                <SelectContent>
                  {impacts.map((impact) => (
                    <SelectItem key={impact.value} value={impact.value}>
                      {impact.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
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
                  <p className="text-sm text-emerald-600">{errors.followUpMethod}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Attachments (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attachments">Upload supporting documents or images</Label>
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
          className="min-w-[150px]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
