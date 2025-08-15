import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Save,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import { Form } from '@/components/dashboard/form-creation-wizard/types';
import { QuestionRenderer } from '@/components/dashboard/form-preview/QuestionRenderer';
import { toast } from '@/hooks/use-toast';
import {
  saveFormPreviewData,
  loadFormPreviewData,
  clearFormPreviewData,
  FormPreviewData
} from '@/lib/formLocalStorageUtils';
import { getFormById } from '@/lib/formLocalStorageUtils';
import { useForm } from '@/contexts/FormContext';

interface PublicFormFillerProps {
  isEmbedded?: boolean;
}

export function PublicFormFiller({ isEmbedded = false }: PublicFormFillerProps) {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { addFormResponseToStorage } = useForm();
  
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  // Load form data
  useEffect(() => {
    if (!formId) {
      setError('Form ID is required');
      setLoading(false);
      return;
    }

    try {
      // In a real implementation, this would be an API call
      // For now, we'll use our utility function to find the form by ID
      const foundForm = getFormById(formId);
      
      if (!foundForm) {
        setError('Form not found');
        setLoading(false);
        return;
      }

      // Check if form is published
      if (foundForm.status !== 'PUBLISHED') {
        setError('This form is not currently available');
        setLoading(false);
        return;
      }

      // Check form expiry
      if (foundForm.settings?.expiryDate && new Date() > foundForm.settings.expiryDate) {
        setError('This form has expired and is no longer accepting responses');
        setLoading(false);
        return;
      }

      setForm(foundForm);
      setLoading(false);
    } catch (err) {
      setError('Failed to load form');
      setLoading(false);
    }
  }, [formId]);

  // Load saved draft data
  useEffect(() => {
    if (form?.id) {
      const savedData = loadFormPreviewData(form.id);
      if (savedData) {
        setResponses(savedData.responses);
        setCurrentSectionIndex(savedData.currentSection);
      }
    }
  }, [form?.id]);

  // Auto-save draft data
  useEffect(() => {
    if (form?.id && Object.keys(responses).length > 0) {
      const previewData: Omit<FormPreviewData, 'formId'> = {
        responses,
        currentSection: currentSectionIndex,
        isComplete: false,
        startedAt: new Date(),
        lastActivityAt: new Date(),
      };
      saveFormPreviewData(form.id, previewData);
    }
  }, [form?.id, responses, currentSectionIndex]);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextSection = () => {
    if (form && currentSectionIndex < form.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!form) return;

    setIsSubmitting(true);
    
    try {
      // Create the response object
      const response = {
        id: `response-${Date.now()}`,
        formId: form.id,
        formVersion: form.version || 1,
        startedAt: new Date(),
        submittedAt: new Date(),
        isComplete: true,
        data: responses,
        ipAddress: 'Unknown', // In a real app, this would be captured from the request
        userAgent: navigator.userAgent,
        source: isEmbedded ? 'embed' : 'direct'
      };

      // Save the response using context
      addFormResponseToStorage(response);
      
      // Clear draft data
      clearFormPreviewData(form.id);
      
      setIsComplete(true);
      toast({
        title: "Form Submitted Successfully!",
        description: form.settings?.thankYouMessage || "Thank you for your response.",
      });
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    if (form?.id) {
      const previewData: Omit<FormPreviewData, 'formId'> = {
        responses,
        currentSection: currentSectionIndex,
        isComplete: false,
        startedAt: new Date(),
        lastActivityAt: new Date(),
      };
      saveFormPreviewData(form.id, previewData);
      toast({
        title: "Draft Saved",
        description: "Your progress has been saved. You can continue later.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Form Not Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Form Submitted Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              {form.settings?.thankYouMessage || "Thank you for your response. Your submission has been received."}
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSection = form.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === form.sections.length - 1;
  const progress = ((currentSectionIndex + 1) / form.sections.length) * 100;

  return (
    <div className={`min-h-screen bg-gray-50 ${isEmbedded ? 'p-0' : 'p-4'}`}>
      <div className={`max-w-4xl mx-auto ${isEmbedded ? '' : 'py-8'}`}>
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {form.title}
                </CardTitle>
                {form.description && (
                  <p className="text-gray-600 mt-2">{form.description}</p>
                )}
              </div>
              {!isEmbedded && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowProgress(!showProgress)}
                >
                  {showProgress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </CardHeader>
          
          {showProgress && (
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{currentSectionIndex + 1} of {form.sections.length} sections</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Current Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentSection.title}
            </CardTitle>
            {currentSection.description && (
              <p className="text-gray-600">{currentSection.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentSection.questions.map((question) => (
                <QuestionRenderer
                  key={question.id}
                  question={question}
                  value={responses[question.id]}
                  onChange={(value) => handleResponseChange(question.id, value)}
                  error={undefined}
                  isPreviewMode={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {!isFirstSection && (
              <Button 
                variant="outline" 
                onClick={handlePrevSection}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={saveDraft}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>

          <div className="flex gap-2">
            {!isLastSection ? (
              <Button 
                onClick={handleNextSection}
                disabled={!currentSection.questions.every(q => 
                  !q.isRequired || responses[q.id] !== undefined
                )}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !form.sections.every(section =>
                  section.questions.every(q => 
                    !q.isRequired || responses[q.id] !== undefined
                  )
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Form
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Form Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Auto-save enabled</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>{Object.keys(responses).length} questions answered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
