import { FormQuestion, SingleChoiceQuestion, MultipleChoiceQuestion } from '../../form-creation-wizard/types';

/**
 * Helper function to identify if a question is a conditional question
 * Conditional questions are those that appear in option.conditionalQuestions
 * or are marked with isConditional flag in their config
 */
export function isConditionalQuestion(question: FormQuestion, allQuestions: FormQuestion[]): boolean {
  // First check if the question has isConditional flag in config (more efficient)
  if ((question as any).config?.isConditional || (question as any).isConditional) {
    return true;
  }
  
  // Fallback: Check if this question appears in any option's conditionalQuestions
  for (const otherQuestion of allQuestions) {
    // Only choice questions have options
    if (otherQuestion.type === 'SINGLE_CHOICE' || otherQuestion.type === 'MULTIPLE_CHOICE') {
      const choiceQuestion = otherQuestion as SingleChoiceQuestion | MultipleChoiceQuestion;
      
      // Check options in both question.options and question.config.options
      const options = choiceQuestion.options || (choiceQuestion as any).config?.options || [];
      
      for (const option of options) {
        if (option.conditionalQuestions) {
          const isInConditionalQuestions = option.conditionalQuestions.some(
            (condQuestion: any) => condQuestion.id === question.id
          );
          if (isInConditionalQuestions) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/**
 * Filter out conditional questions from the main question list
 * Conditional questions should only be rendered when their parent option is selected
 */
export function filterMainQuestions(questions: FormQuestion[]): FormQuestion[] {
  return questions.filter(question => !isConditionalQuestion(question, questions));
}

/**
 * Get all conditional questions for a specific parent question and option
 */
export function getConditionalQuestionsForOption(
  parentQuestion: FormQuestion, 
  optionId: string, 
  allQuestions: FormQuestion[]
): FormQuestion[] {
  // Only choice questions have options
  if (parentQuestion.type !== 'SINGLE_CHOICE' && parentQuestion.type !== 'MULTIPLE_CHOICE') {
    return [];
  }

  const choiceQuestion = parentQuestion as SingleChoiceQuestion | MultipleChoiceQuestion;
  
  // Check options in both question.options and question.config.options
  const options = choiceQuestion.options || (choiceQuestion as any).config?.options || [];
  const option = options.find((opt: any) => opt.id === optionId);
  
  if (!option || !option.conditionalQuestions) {
    return [];
  }

  // Find the actual question objects from the allQuestions list
  return option.conditionalQuestions
    .map((condQuestion: any) => allQuestions.find((q: FormQuestion) => q.id === condQuestion.id))
    .filter((q): q is FormQuestion => q !== undefined);
}
