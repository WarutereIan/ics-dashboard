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
  EyeOff,
  Plus
} from 'lucide-react';
import { Form } from '@/components/dashboard/form-creation-wizard/types';
import { QuestionRenderer } from '@/components/dashboard/form-preview/QuestionRenderer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { toast } from '@/hooks/use-toast';
import {
  saveFormPreviewData,
  loadFormPreviewData,
  clearFormPreviewData,
  FormPreviewData
} from '@/lib/formLocalStorageUtils';
import { useForm } from '@/contexts/FormContext';
import { formsApi } from '@/lib/api/formsApi';

interface PublicFormFillerProps {
  isEmbedded?: boolean;
}

export function PublicFormFiller({ isEmbedded = false }: PublicFormFillerProps) {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { addFormResponseToStorage, validateConditionalQuestions } = useForm();
  
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [conditionalResponses, setConditionalResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  // Load form data
  useEffect(() => {
    const loadForm = async () => {
      if (!formId) {
        setError('Form ID is required');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading public form:', formId);
        const foundForm = await formsApi.getPublicForm(formId);
        
        console.log('Public form loaded successfully:', foundForm);
        setForm(foundForm);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to load public form:', err);
        const msg: string = err?.message || '';

        // If form requires authentication, try secure endpoint when token exists
        if (msg.includes('requires authentication')) {
          const token = localStorage.getItem('ics-auth-token');
          if (token) {
            try {
              console.log('Retrying with secure endpoint for authenticated user');
              const secureForm = await formsApi.getSecureForm(formId);
              setForm(secureForm);
              setRequiresAuth(false);
              setLoading(false);
              return;
            } catch (secureErr: any) {
              console.error('Secure form fetch failed:', secureErr);
              // Fall through to show auth required UI
            }
          }
          setRequiresAuth(true);
          setError('This form requires authentication. Please log in to continue.');
        } else if (msg.includes('expired')) {
          setError('This form has expired and is no longer accepting responses');
        } else if (msg.includes('not found') || msg.includes('not published')) {
          setError('Form not found or not available');
        } else {
          setError('Failed to load form. Please try again later.');
        }
        
        setLoading(false);
      }
    };

    loadForm();
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

  const handleConditionalChange = (questionId: string, value: any) => {
    setConditionalResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Validate current section including conditional questions
  const validateCurrentSection = () => {
    if (!form || !currentSection) return true;
    
    const allResponses = { ...responses, ...conditionalResponses };
    // Only validate conditional questions within the current section to avoid blocking on other sections
    const sectionOnlyForm = { ...form, sections: [currentSection] } as Form;
    const errors = validateConditionalQuestions(sectionOnlyForm, allResponses);
    
    // Also validate main questions
    currentSection.questions.forEach(question => {
      if (question.isRequired) {
        const response = responses[question.id];
        if (response === undefined || response === '' || response === null ||
            (Array.isArray(response) && response.length === 0)) {
          errors[question.id] = 'This field is required';
        }
      }
    });
    
    return Object.keys(errors).length === 0;
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
    if (!form || isSubmitting) return; // Prevent double submissions

    setIsSubmitting(true);
    
    try {
      console.log('📤 Submitting form response for form:', form.id);
      
      // Create the response object and submit via addFormResponseToStorage 
      // (which handles online/offline scenarios and API submission)
      const responseData = {
        id: `response-${Date.now()}`,
        formId: form.id,
        formVersion: form.version || 1,
        startedAt: new Date(),
        submittedAt: new Date(),
        isComplete: true,
        data: {
          ...responses,
          ...conditionalResponses
        },
        ipAddress: 'Unknown',
        userAgent: navigator.userAgent,
        source: isEmbedded ? 'embed' : 'direct'
      };

      console.log('📊 Response data:', responseData);
      
      // Submit via context (handles API call + local storage + offline queue)
      await addFormResponseToStorage(responseData);
      
      // Clear draft data
      clearFormPreviewData(form.id);
      
      setIsComplete(true);
      
      // Success toast is already handled by addFormResponseToStorage
      // Only show custom thank you message if different from default
      if (form.settings?.thankYouMessage && form.settings.thankYouMessage !== "Thank you for your response.") {
        toast({
          title: "Form Submitted Successfully!",
          description: form.settings.thankYouMessage,
        });
      }
    } catch (err: any) {
      console.error('Form submission failed:', err);
      toast({
        title: "Submission Failed",
        description: err.message || "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    // Preserve return path to this public form
    const next = encodeURIComponent(`/fill/${formId}`);
    navigate(`/login?next=${next}`);
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
            {requiresAuth && (
              <div className="mt-4">
                <Button onClick={handleLoginRedirect} className="w-full">Login to continue</Button>
              </div>
            )}
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
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  // Reset form state for new response
                  setResponses({});
                  setCurrentSectionIndex(0);
                  setIsComplete(false);
                  setShowProgress(true);
                  // Clear any saved draft data
                  if (form?.id) {
                    clearFormPreviewData(form.id);
                  }
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Another Response
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </div>
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
                <ErrorBoundary
                  key={question.id}
                  fallback={
                    <Alert variant="destructive" className="my-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Error loading question: {question.title}. Please refresh the page or contact support.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <QuestionRenderer
                    question={question}
                    value={responses[question.id]}
                    onChange={(value) => handleResponseChange(question.id, value)}
                    error={undefined}
                    isPreviewMode={false}
                    conditionalValues={conditionalResponses}
                    onConditionalChange={handleConditionalChange}
                  />
                </ErrorBoundary>
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
                disabled={!validateCurrentSection()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !validateCurrentSection()}
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
