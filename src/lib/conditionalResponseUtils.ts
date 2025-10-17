import { Form, FormQuestion, FormResponse } from '@/components/dashboard/form-creation-wizard/types';

/**
 * Extract conditional question responses from a form response
 */
export function extractConditionalResponses(
  form: Form, 
  response: FormResponse
): Record<string, { question: FormQuestion; value: any; parentQuestionId: string; parentQuestionTitle: string }> {
  const conditionalResponses: Record<string, { question: FormQuestion; value: any; parentQuestionId: string; parentQuestionTitle: string }> = {};

  // Get all questions from all sections
  const allQuestions = form.sections.flatMap(section => section.questions);

  // For each question in the response data
  Object.entries(response.data).forEach(([questionId, responseValue]) => {
    const question = allQuestions.find(q => q.id === questionId);
    
    if (question && typeof responseValue === 'object' && responseValue !== null) {
      // This question has nested responses (conditional questions)
      Object.entries(responseValue).forEach(([conditionalQuestionId, conditionalValue]) => {
        // Find the conditional question definition
        const conditionalQuestion = findConditionalQuestion(form, conditionalQuestionId);
        
        if (conditionalQuestion) {
          conditionalResponses[conditionalQuestionId] = {
            question: conditionalQuestion,
            value: conditionalValue,
            parentQuestionId: questionId,
            parentQuestionTitle: question.title
          };
        }
      });
    }
  });

  return conditionalResponses;
}

/**
 * Find a conditional question by its ID
 */
function findConditionalQuestion(form: Form, conditionalQuestionId: string): FormQuestion | null {
  for (const section of form.sections) {
    for (const question of section.questions) {
      if (question.options && Array.isArray(question.options)) {
        for (const option of question.options) {
          if (option.conditionalQuestions && Array.isArray(option.conditionalQuestions)) {
            const conditionalQuestion = option.conditionalQuestions.find(
              (condQ: any) => condQ.id === conditionalQuestionId
            );
            if (conditionalQuestion) {
              return conditionalQuestion as FormQuestion;
            }
          }
        }
      }
    }
  }
  return null;
}

/**
 * Get all conditional questions from a form
 */
export function getAllConditionalQuestions(form: Form): Array<{
  question: FormQuestion;
  parentQuestionId: string;
  parentQuestionTitle: string;
  parentOptionLabel: string;
}> {
  const conditionalQuestions: Array<{
    question: FormQuestion;
    parentQuestionId: string;
    parentQuestionTitle: string;
    parentOptionLabel: string;
  }> = [];

  for (const section of form.sections) {
    for (const question of section.questions) {
      if (question.options && Array.isArray(question.options)) {
        for (const option of question.options) {
          if (option.conditionalQuestions && Array.isArray(option.conditionalQuestions)) {
            for (const conditionalQuestion of option.conditionalQuestions) {
              conditionalQuestions.push({
                question: conditionalQuestion as FormQuestion,
                parentQuestionId: question.id,
                parentQuestionTitle: question.title,
                parentOptionLabel: option.label
              });
            }
          }
        }
      }
    }
  }

  return conditionalQuestions;
}

/**
 * Analyze conditional question responses across all form responses
 */
export function analyzeConditionalResponses(
  form: Form, 
  responses: FormResponse[]
): Record<string, {
  question: FormQuestion;
  parentQuestionTitle: string;
  parentOptionLabel: string;
  responses: any[];
  summary: {
    totalResponses: number;
    uniqueValues: Record<string, number>;
    averageValue?: number;
    minValue?: number;
    maxValue?: number;
  };
}> {
  const allConditionalQuestions = getAllConditionalQuestions(form);
  const analysis: Record<string, any> = {};

  // Initialize analysis for each conditional question
  allConditionalQuestions.forEach(({ question, parentQuestionTitle, parentOptionLabel }) => {
    analysis[question.id] = {
      question,
      parentQuestionTitle,
      parentOptionLabel,
      responses: [],
      summary: {
        totalResponses: 0,
        uniqueValues: {}
      }
    };
  });

  // Process each response
  responses.forEach(response => {
    const conditionalResponses = extractConditionalResponses(form, response);
    
    Object.entries(conditionalResponses).forEach(([conditionalQuestionId, data]) => {
      if (analysis[conditionalQuestionId]) {
        analysis[conditionalQuestionId].responses.push(data.value);
        analysis[conditionalQuestionId].summary.totalResponses++;
        
        // Count unique values
        const valueKey = String(data.value);
        analysis[conditionalQuestionId].summary.uniqueValues[valueKey] = 
          (analysis[conditionalQuestionId].summary.uniqueValues[valueKey] || 0) + 1;
        
        // Calculate numeric statistics for number questions
        if (data.question.type === 'NUMBER' && typeof data.value === 'number') {
          const current = analysis[conditionalQuestionId].summary;
          if (current.minValue === undefined || data.value < current.minValue) {
            current.minValue = data.value;
          }
          if (current.maxValue === undefined || data.value > current.maxValue) {
            current.maxValue = data.value;
          }
        }
      }
    });
  });

  // Calculate averages for number questions
  Object.values(analysis).forEach((item: any) => {
    if (item.question.type === 'NUMBER' && item.responses.length > 0) {
      const numericResponses = item.responses.filter((r: any) => typeof r === 'number');
      if (numericResponses.length > 0) {
        item.summary.averageValue = numericResponses.reduce((sum: number, val: number) => sum + val, 0) / numericResponses.length;
      }
    }
  });

  return analysis;
}

/**
 * Get conditional question responses for a specific parent question
 */
export function getConditionalResponsesForParent(
  form: Form,
  responses: FormResponse[],
  parentQuestionId: string
): Record<string, any[]> {
  const conditionalResponses: Record<string, any[]> = {};

  responses.forEach(response => {
    const responseValue = response.data[parentQuestionId];
    
    if (typeof responseValue === 'object' && responseValue !== null) {
      Object.entries(responseValue).forEach(([conditionalQuestionId, value]) => {
        if (!conditionalResponses[conditionalQuestionId]) {
          conditionalResponses[conditionalQuestionId] = [];
        }
        conditionalResponses[conditionalQuestionId].push(value);
      });
    }
  });

  return conditionalResponses;
}
