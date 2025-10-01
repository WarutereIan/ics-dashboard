import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatBubbleLeftRightIcon, ExclamationTriangleIcon, UsersIcon, EnvelopeIcon, MapPinIcon, ClockIcon, DocumentTextIcon, ShieldCheckIcon, PhoneIcon, CameraIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

import { GeneralFeedbackForm } from './forms/GeneralFeedbackForm';
import { SafetyIncidentForm } from './forms/SafetyIncidentForm';
import { EmergencyReportForm } from './forms/EmergencyReportForm';
import { StaffFeedbackForm } from './forms/StaffFeedbackForm';
import { useFeedback } from '@/contexts/FeedbackContext';

interface FeedbackSubmissionInterfaceProps {
  projectId: string;
  projectName?: string;
}

export function FeedbackSubmissionInterface({ projectId, projectName = "ICS Program" }: FeedbackSubmissionInterfaceProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forms, categories, loading, createSubmission } = useFeedback();

  const handleFormSubmit = async (formData: any, formType: string) => {
    setIsSubmitting(true);
    try {
      // Map form types to seeded category IDs
      const categoryMapping: Record<string, string> = {
        'general': 'general_feedback',
        'safety': 'safety_incident',
        'emergency': 'emergency_report',
        'staff': 'staff_feedback'
      };

      // Map form types to seeded form IDs
      const formMapping: Record<string, string> = {
        'general': 'general_feedback_form',
        'safety': 'safety_incident_form',
        'emergency': 'emergency_report_form',
        'staff': 'staff_feedback_form'
      };

      // Find the corresponding category and form, or use fallback IDs
      const category = categories.find(cat => cat.id === categoryMapping[formType] || cat.name.toLowerCase().includes(formType));
      const form = forms.find(f => f.category?.id === category?.id || f.id === formMapping[formType]);
      
      const submissionData = {
        formId: form?.id || formMapping[formType] || 'general_feedback_form',
        projectId,
        categoryId: category?.id || categoryMapping[formType] || 'general_feedback',
        priority: 'MEDIUM',
        sensitivity: 'INTERNAL',
        escalationLevel: 'NONE',
        data: formData,
        isAnonymous: formData.isAnonymous || false,
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail,
        stakeholderType: formData.stakeholderType
      };

      await createSubmission(submissionData);
      
      // Show success message
      alert('Thank you for your feedback! Your submission has been received and will be reviewed by our team.');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Static form configuration for UI display
  const staticFormConfig = [
    {
      id: 'general',
      title: 'General Feedback',
      description: 'Share your thoughts, suggestions, or general observations about the program',
      icon: ChatBubbleLeftRightIcon,
      color: 'blue',
      priority: 'LOW',
      estimatedTime: '2-3 minutes',
      component: GeneralFeedbackForm
    },
    {
      id: 'safety',
      title: 'Safety Incident Report',
      description: 'Report safety concerns, incidents, or hazards in the community',
      icon: ExclamationTriangleIcon,
      color: 'orange',
      priority: 'HIGH',
      estimatedTime: '5-7 minutes',
      component: SafetyIncidentForm
    },
    {
      id: 'emergency',
      title: 'Emergency Report',
      description: 'Report emergency situations requiring immediate attention',
      icon: PhoneIcon,
      color: 'red',
      priority: 'CRITICAL',
      estimatedTime: '3-5 minutes',
      component: EmergencyReportForm
    },
    {
      id: 'staff',
      title: 'Staff Feedback',
      description: 'Provide feedback about program staff performance or behavior',
      icon: UsersIcon,
      color: 'purple',
      priority: 'MEDIUM',
      estimatedTime: '4-6 minutes',
      component: StaffFeedbackForm
    }
  ];

  // Merge API data with static configuration for display
  const displayForms = staticFormConfig.map(config => {
    const apiForm = forms.find(f => f.title === config.title || f.category?.name === config.title);
    return {
      ...config,
      id: apiForm?.id || config.id,
      apiData: apiForm
    };
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-emerald-50',
          border: 'border-blue-200',
          text: 'text-emerald-800',
          icon: 'text-emerald-600'
        };
      case 'orange':
        return {
          bg: 'bg-lime-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          icon: 'text-lime-600'
        };
      case 'red':
        return {
          bg: 'bg-emerald-50',
          border: 'border-red-200',
          text: 'text-emerald-800',
          icon: 'text-emerald-600'
        };
      case 'purple':
        return {
          bg: 'bg-emerald-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          icon: 'text-emerald-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold">Feedback & Reporting</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your voice matters! Help us improve {projectName} by sharing your feedback, 
          reporting issues, or alerting us to emergencies.
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <ShieldCheckIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Anonymous Reporting</h3>
            <p className="text-gray-600">All feedback can be submitted anonymously</p>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <ClockIcon className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Quick Response</h3>
            <p className="text-gray-600">We respond to all feedback within 24-48 hours</p>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <ExclamationTriangleIcon className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Emergency Support</h3>
            <p className="text-gray-600">Emergency reports receive immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Feedback Type</CardTitle>
          <p className="text-gray-600">
            Select the type of feedback you'd like to submit. Each form is designed 
            to capture the most relevant information for that specific type of feedback.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 gap-1 p-1 mb-4">
              {displayForms.map((form) => {
                const Icon = form.icon;
                const colors = getColorClasses(form.color);
                return (
                  <TabsTrigger 
                    key={form.id} 
                    value={form.id}
                    className="flex flex-col items-center gap-1 p-2 h-auto min-h-[60px] data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Icon className={`w-4 h-4 ${colors.icon}`} />
                    <span className="text-xs font-medium text-center leading-tight">{form.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {displayForms.map((form) => {
              const Icon = form.icon;
              const colors = getColorClasses(form.color);
              const FormComponent = form.component;
              
              return (
                <TabsContent key={form.id} value={form.id} className="mt-4">
                  <div className="space-y-6">
                    {/* Form Header */}
                    <div className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-white ${colors.icon}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className={`text-xl font-bold ${colors.text}`}>
                              {form.title}
                            </h2>
                            <Badge variant={getPriorityColor(form.priority)} className="text-xs px-2 py-1">
                              {form.priority} Priority
                            </Badge>
                          </div>
                          <p className={`text-sm ${colors.text} mb-2`}>
                            {form.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              Estimated time: {form.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <ShieldCheckIcon className="w-3 h-3" />
                              Anonymous submission available
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Component */}
                    <div className="max-w-5xl mx-auto">
                      <FormComponent 
                        onSubmit={(data) => handleFormSubmit(data, form.id)}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Need Immediate Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Emergency Contacts</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Emergency Hotline</p>
                    <p className="text-sm text-gray-600">+1 (555) 911-HELP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <EnvelopeIcon className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Emergency Email</p>
                    <p className="text-sm text-gray-600">emergency@ics-program.org</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">General Inquiries</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <EnvelopeIcon className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Feedback Email</p>
                    <p className="text-sm text-gray-600">feedback@ics-program.org</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <MapPinIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Visit Our Office</p>
                    <p className="text-sm text-gray-600">Local community center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}