import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { UsersIcon, ChatBubbleLeftRightIcon, CalendarIcon, ClockIcon, UserIcon, EnvelopeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Star, Send, Phone, Shield } from 'lucide-react';


interface StaffFeedbackFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function StaffFeedbackForm({ onSubmit, isSubmitting }: StaffFeedbackFormProps) {
  const [formData, setFormData] = useState({
    // Reporter Information
    isAnonymous: false,
    name: '',
    email: '',
    phone: '',
    relationship: '',
    
    // Staff Information
    staffName: '',
    staffRole: '',
    staffDepartment: '',
    interactionDate: '',
    interactionType: '',
    
    // Feedback Details
    feedbackType: '',
    overallRating: '',
    title: '',
    description: '',
    
    // Specific Areas
    professionalism: '',
    communication: '',
    knowledge: '',
    helpfulness: '',
    timeliness: '',
    respect: '',
    
    // Specific Feedback
    positiveAspects: '',
    areasForImprovement: '',
    specificIncidents: '',
    
    // Impact
    impactOnExperience: '',
    wouldRecommend: '',
    followUpNeeded: false,
    
    // Follow-up
    followUp: false,
    followUpMethod: '',
    
    // Attachments
    attachments: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const feedbackTypes = [
    { value: 'compliment', label: 'Compliment - Positive feedback' },
    { value: 'complaint', label: 'Complaint - Negative feedback' },
    { value: 'suggestion', label: 'Suggestion - Improvement recommendation' },
    { value: 'concern', label: 'Concern - Worry or issue' },
    { value: 'appreciation', label: 'Appreciation - Thank you message' },
    { value: 'other', label: 'Other' }
  ];

  const relationships = [
    { value: 'program_beneficiary', label: 'Program Beneficiary' },
    { value: 'community_member', label: 'Community Member' },
    { value: 'family_member', label: 'Family Member' },
    { value: 'colleague', label: 'Colleague/Co-worker' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'other', label: 'Other' }
  ];

  const interactionTypes = [
    { value: 'in_person', label: 'In-Person Meeting' },
    { value: 'phone_call', label: 'Phone Call' },
    { value: 'email', label: 'Email Communication' },
    { value: 'workshop', label: 'Workshop/Training' },
    { value: 'event', label: 'Community Event' },
    { value: 'home_visit', label: 'Home Visit' },
    { value: 'office_visit', label: 'Office Visit' },
    { value: 'other', label: 'Other' }
  ];

  const ratingOptions = [
    { value: '5', label: '⭐⭐⭐⭐⭐ Excellent' },
    { value: '4', label: '⭐⭐⭐⭐ Good' },
    { value: '3', label: '⭐⭐⭐ Average' },
    { value: '2', label: '⭐⭐ Poor' },
    { value: '1', label: '⭐ Very Poor' }
  ];

  const impactLevels = [
    { value: 'very_positive', label: 'Very Positive - Exceeded expectations' },
    { value: 'positive', label: 'Positive - Met expectations' },
    { value: 'neutral', label: 'Neutral - No significant impact' },
    { value: 'negative', label: 'Negative - Below expectations' },
    { value: 'very_negative', label: 'Very Negative - Significantly below expectations' }
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
        newErrors.name = 'Name is required for non-anonymous feedback';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required for non-anonymous feedback';
      }
    }

    if (!formData.staffName.trim()) {
      newErrors.staffName = 'Please provide the staff member\'s name';
    }

    if (!formData.feedbackType) {
      newErrors.feedbackType = 'Please select the type of feedback';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a title for your feedback';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description';
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
                <Label htmlFor="relationship">Your Relationship to the Staff Member</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => handleInputChange('relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your relationship" />
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

      {/* Staff Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Staff Member Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staffName">Staff Member Name *</Label>
              <Input
                id="staffName"
                value={formData.staffName}
                onChange={(e) => handleInputChange('staffName', e.target.value)}
                className={errors.staffName ? 'border-red-500' : ''}
                placeholder="Full name of the staff member"
              />
              {errors.staffName && (
                <p className="text-sm text-emerald-600">{errors.staffName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="staffRole">Staff Role/Position</Label>
              <Input
                id="staffRole"
                value={formData.staffRole}
                onChange={(e) => handleInputChange('staffRole', e.target.value)}
                placeholder="e.g., Program Coordinator, Case Worker"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staffDepartment">Department/Program</Label>
              <Input
                id="staffDepartment"
                value={formData.staffDepartment}
                onChange={(e) => handleInputChange('staffDepartment', e.target.value)}
                placeholder="e.g., Health Services, Education"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interactionDate">Date of Interaction</Label>
              <Input
                id="interactionDate"
                type="date"
                value={formData.interactionDate}
                onChange={(e) => handleInputChange('interactionDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interactionType">Type of Interaction</Label>
            <Select
              value={formData.interactionType}
              onValueChange={(value) => handleInputChange('interactionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interaction type" />
              </SelectTrigger>
              <SelectContent>
                {interactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            Feedback Details
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
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Feedback Title *</Label>
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
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
              placeholder="Please provide detailed feedback about your interaction with the staff member..."
            />
            {errors.description && (
              <p className="text-sm text-emerald-600">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Specific Areas Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Specific Areas Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Please rate the staff member in the following areas (optional):
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professionalism">Professionalism</Label>
              <Select
                value={formData.professionalism}
                onValueChange={(value) => handleInputChange('professionalism', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate professionalism" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="communication">Communication</Label>
              <Select
                value={formData.communication}
                onValueChange={(value) => handleInputChange('communication', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate communication" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge">Knowledge & Expertise</Label>
              <Select
                value={formData.knowledge}
                onValueChange={(value) => handleInputChange('knowledge', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate knowledge" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="helpfulness">Helpfulness</Label>
              <Select
                value={formData.helpfulness}
                onValueChange={(value) => handleInputChange('helpfulness', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate helpfulness" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeliness">Timeliness</Label>
              <Select
                value={formData.timeliness}
                onValueChange={(value) => handleInputChange('timeliness', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate timeliness" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="respect">Respect & Courtesy</Label>
              <Select
                value={formData.respect}
                onValueChange={(value) => handleInputChange('respect', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate respect" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specific Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Specific Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="positiveAspects">Positive Aspects</Label>
            <Textarea
              id="positiveAspects"
              value={formData.positiveAspects}
              onChange={(e) => handleInputChange('positiveAspects', e.target.value)}
              rows={3}
              placeholder="What did the staff member do well? What positive aspects would you like to highlight?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
            <Textarea
              id="areasForImprovement"
              value={formData.areasForImprovement}
              onChange={(e) => handleInputChange('areasForImprovement', e.target.value)}
              rows={3}
              placeholder="What areas could the staff member improve? Any suggestions for better service?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificIncidents">Specific Incidents or Examples</Label>
            <Textarea
              id="specificIncidents"
              value={formData.specificIncidents}
              onChange={(e) => handleInputChange('specificIncidents', e.target.value)}
              rows={3}
              placeholder="Please provide specific examples or incidents that illustrate your feedback..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Impact Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="impactOnExperience">Impact on Your Experience</Label>
            <Select
              value={formData.impactOnExperience}
              onValueChange={(value) => handleInputChange('impactOnExperience', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="How did this interaction impact your experience?" />
              </SelectTrigger>
              <SelectContent>
                {impactLevels.map((impact) => (
                  <SelectItem key={impact.value} value={impact.value}>
                    {impact.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wouldRecommend">Would you recommend this staff member to others?</Label>
            <Select
              value={formData.wouldRecommend}
              onValueChange={(value) => handleInputChange('wouldRecommend', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="definitely">Definitely Yes</SelectItem>
                <SelectItem value="probably">Probably Yes</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="probably_not">Probably Not</SelectItem>
                <SelectItem value="definitely_not">Definitely Not</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="followUpNeeded"
              checked={formData.followUpNeeded}
              onCheckedChange={(checked) => handleInputChange('followUpNeeded', checked)}
            />
            <Label htmlFor="followUpNeeded" className="text-sm font-medium">
              This feedback requires follow-up or action
            </Label>
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
                <p className="text-sm text-emerald-600">{errors.followUpMethod}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attachments">Upload supporting documents or evidence</Label>
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
          className="min-w-[150px] bg-purple-600 hover:bg-purple-700"
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
