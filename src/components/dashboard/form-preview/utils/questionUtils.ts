import { FormQuestion, SingleChoiceQuestion, MultipleChoiceQuestion } from '../../form-creation-wizard/types';

/**
 * Helper function to identify if a question is a conditional question
 * Conditional questions are those that appear in option.conditionalQuestions
 * but are now saved as separate questions in the database
 */
export function isConditionalQuestion(question: FormQuestion, allQuestions: FormQuestion[]): boolean {
  // Check if this question appears in any option's conditionalQuestions
  for (const otherQuestion of allQuestions) {
    // Only choice questions have options
    if (otherQuestion.type === 'SINGLE_CHOICE' || otherQuestion.type === 'MULTIPLE_CHOICE') {
      const choiceQuestion = otherQuestion as SingleChoiceQuestion | MultipleChoiceQuestion;
      if (choiceQuestion.options) {
        for (const option of choiceQuestion.options) {
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
  const option = choiceQuestion.options?.find((opt: any) => opt.id === optionId);
  if (!option || !option.conditionalQuestions) {
    return [];
  }

  // Find the actual question objects from the allQuestions list
  return option.conditionalQuestions
    .map((condQuestion: any) => allQuestions.find((q: FormQuestion) => q.id === condQuestion.id))
    .filter((q): q is FormQuestion => q !== undefined);
}
