import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  FeedbackForm, 
  FeedbackFormSection, 
  FeedbackQuestion, 
  FeedbackQuestionType,
  FeedbackCategory,
  DEFAULT_FEEDBACK_CATEGORIES,
  FeedbackFormSettings,
  EscalationRule,
  DEFAULT_STAKEHOLDER_TYPES
} from '@/types/feedback';

interface UseFeedbackWizardProps {
  projectId: string;
  formId?: string;
}

export function useFeedbackWizard({ projectId, formId }: UseFeedbackWizardProps) {
  const [form, setForm] = useState<FeedbackForm>(() => ({
    id: formId || uuidv4(),
    projectId,
    title: '',
    description: '',
    category: DEFAULT_FEEDBACK_CATEGORIES[0],
    isActive: true,
    allowAnonymous: true,
    requireAuthentication: false,
    sections: [],
    settings: {
      allowAnonymous: true,
      requireAuthentication: false,
      autoAssignPriority: true,
      autoEscalate: true,
      notificationEmails: [],
      escalationRules: [],
      confidentialityLevel: 'PUBLIC',
      responseRequired: false
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user' // This should come from auth context
  }));

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Validation logic
  const validateForm = useCallback(() => {
    const errors: Record<string, string[]> = {};

    // Basic info validation
    if (!form.title.trim()) {
      errors['basic-info'] = [...(errors['basic-info'] || []), 'Form title is required'];
    }
    if (!form.description.trim()) {
      errors['basic-info'] = [...(errors['basic-info'] || []), 'Form description is required'];
    }

    // Category validation
    if (!form.category) {
      errors['category'] = [...(errors['category'] || []), 'Feedback category is required'];
    }

    // Questions validation
    if (form.sections.length === 0) {
      errors['questions'] = [...(errors['questions'] || []), 'At least one section is required'];
    }

    const totalQuestions = form.sections.reduce((total, section) => total + section.questions.length, 0);
    if (totalQuestions === 0) {
      errors['questions'] = [...(errors['questions'] || []), 'At least one question is required'];
    }

    // Check for required questions
    form.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        if (!question.title.trim()) {
          errors['questions'] = [...(errors['questions'] || []), 
            `Question ${questionIndex + 1} in section "${section.title}" needs a title`];
        }
      });
    });

    // Settings validation
    if (form.settings.notificationEmails.length === 0) {
      errors['settings'] = [...(errors['settings'] || []), 'At least one notification email is required'];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const isFormValid = Object.keys(validationErrors).length === 0;

  const updateForm = useCallback((updates: Partial<FeedbackForm>) => {
    setForm(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  }, []);

  const addSection = useCallback((afterSectionId?: string) => {
    const newSection: FeedbackFormSection = {
      id: uuidv4(),
      title: `Section ${form.sections.length + 1}`,
      description: '',
      order: form.sections.length,
      questions: []
    };

    setForm(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      updatedAt: new Date()
    }));
  }, [form.sections.length]);

  const updateSection = useCallback((sectionId: string, updates: Partial<FeedbackFormSection>) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
      updatedAt: new Date()
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
      updatedAt: new Date()
    }));
  }, []);

  const addQuestion = useCallback((
    sectionId: string, 
    questionType: FeedbackQuestionType, 
    afterQuestionId?: string
  ) => {
    const section = form.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newQuestion: FeedbackQuestion = {
      id: uuidv4(),
      sectionId,
      type: questionType,
      title: `Question ${section.questions.length + 1}`,
      description: '',
      order: section.questions.length,
      isRequired: false,
      config: getDefaultConfigForQuestionType(questionType)
    };

    setForm(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      ),
      updatedAt: new Date()
    }));
  }, [form.sections]);

  const updateQuestion = useCallback((questionId: string, updates: Partial<FeedbackQuestion>) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        questions: section.questions.map(question =>
          question.id === questionId ? { ...question, ...updates } : question
        )
      })),
      updatedAt: new Date()
    }));
  }, []);

  const removeQuestion = useCallback((questionId: string) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        questions: section.questions.filter(question => question.id !== questionId)
      })),
      updatedAt: new Date()
    }));
  }, []);

  const duplicateQuestion = useCallback((questionId: string) => {
    setForm(prev => {
      const newSections = prev.sections.map(section => {
        const questionIndex = section.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return section;

        const originalQuestion = section.questions[questionIndex];
        const duplicatedQuestion: FeedbackQuestion = {
          ...originalQuestion,
          id: uuidv4(),
          title: `${originalQuestion.title} (Copy)`,
          order: section.questions.length
        };

        return {
          ...section,
          questions: [...section.questions, duplicatedQuestion]
        };
      });

      return {
        ...prev,
        sections: newSections,
        updatedAt: new Date()
      };
    });
  }, []);

  const linkQuestionToActivities = useCallback((questionId: string, activities: any[]) => {
    // This would be similar to the regular form wizard but for feedback forms
    // For now, we'll implement a basic version
    updateQuestion(questionId, { 
      config: { 
        ...form.sections
          .flatMap(s => s.questions)
          .find(q => q.id === questionId)?.config || {},
        linkedActivities: activities 
      } 
    });
  }, [updateQuestion, form.sections]);

  return {
    form,
    updateForm,
    addSection,
    updateSection,
    removeSection,
    addQuestion,
    updateQuestion,
    removeQuestion,
    duplicateQuestion,
    linkQuestionToActivities,
    validationErrors,
    isFormValid
  };
}

// Helper function to get default config for question types
function getDefaultConfigForQuestionType(questionType: FeedbackQuestionType): any {
  switch (questionType) {
    case 'SINGLE_CHOICE':
      return {
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' }
        ],
        displayType: 'DROPDOWN'
      };
    case 'MULTIPLE_CHOICE':
      return {
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' }
        ],
        displayType: 'RADIO'
      };
    case 'LIKERT_SCALE':
      return {
        scaleType: '5_POINT',
        statements: [
          { id: uuidv4(), text: 'Statement 1' }
        ]
      };
    case 'STAKEHOLDER_TYPE':
      return {
        options: DEFAULT_STAKEHOLDER_TYPES.map(stakeholder => ({
          id: stakeholder.id,
          label: stakeholder.name,
          value: stakeholder.id
        }))
      };
    case 'PRIORITY_SELECTION':
      return {
        options: [
          { id: 'low', label: 'Low', value: 'LOW' },
          { id: 'medium', label: 'Medium', value: 'MEDIUM' },
          { id: 'high', label: 'High', value: 'HIGH' },
          { id: 'critical', label: 'Critical', value: 'CRITICAL' }
        ]
      };
    case 'ESCALATION_LEVEL':
      return {
        options: [
          { id: 'none', label: 'No Escalation', value: 'NONE' },
          { id: 'project', label: 'Project Level', value: 'PROJECT' },
          { id: 'regional', label: 'Regional Level', value: 'REGIONAL' },
          { id: 'national', label: 'National Level', value: 'NATIONAL' },
          { id: 'emergency', label: 'Emergency', value: 'EMERGENCY' }
        ]
      };
    default:
      return {};
  }
}
