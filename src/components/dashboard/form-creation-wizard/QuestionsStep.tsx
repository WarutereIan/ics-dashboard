import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Plus, HelpCircle, Layers } from 'lucide-react';
import { FormSection, FormQuestion, QuestionType, ActivityKPIMapping } from './types';
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_DESCRIPTIONS,
  QUESTION_TYPE_CATEGORIES,
  BaseQuestionEditor,
  ShortTextQuestionEditor,
  SingleChoiceQuestionEditor,
  MultipleChoiceQuestionEditor,
  NumberQuestionEditor,
  DateQuestionEditor,
} from './question-types';

interface QuestionsStepProps {
  sections: FormSection[];
  availableActivities: ActivityKPIMapping[];
  onAddQuestion: (sectionId: string, questionType: QuestionType) => void;
  onUpdateQuestion: (sectionId: string, questionId: string, updates: Partial<FormQuestion>) => void;
  onRemoveQuestion: (sectionId: string, questionId: string) => void;
  onDuplicateQuestion: (sectionId: string, questionId: string) => void;
  onLinkQuestionToActivity: (sectionId: string, questionId: string, activityMapping: ActivityKPIMapping) => void;
}

export function QuestionsStep({
  sections,
  availableActivities,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onDuplicateQuestion,
  onLinkQuestionToActivity,
}: QuestionsStepProps) {
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('SHORT_TEXT');

  const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);

  const renderQuestionEditor = (sectionId: string, question: FormQuestion) => {
    const commonProps = {
      question,
      onUpdate: (updates: Partial<FormQuestion>) => onUpdateQuestion(sectionId, question.id, updates),
      onDelete: () => onRemoveQuestion(sectionId, question.id),
      onDuplicate: () => onDuplicateQuestion(sectionId, question.id),
      availableActivities,
      onLinkToActivity: (activityMapping: ActivityKPIMapping) => 
        onLinkQuestionToActivity(sectionId, question.id, activityMapping),
    };

    switch (question.type) {
      case 'SHORT_TEXT':
      case 'EMAIL':
      case 'PHONE':
        return <ShortTextQuestionEditor {...commonProps} question={question} />;
      case 'SINGLE_CHOICE':
      case 'YES_NO':
      case 'DROPDOWN':
        return <SingleChoiceQuestionEditor {...commonProps} question={question} />;
      case 'MULTIPLE_CHOICE':
        return <MultipleChoiceQuestionEditor {...commonProps} question={question} />;
      case 'NUMBER':
        return <NumberQuestionEditor {...commonProps} question={question} />;

      case 'DATE':
      case 'DATETIME':
        return <DateQuestionEditor {...commonProps} question={question} />;
      default:
        // For question types we haven't implemented specific editors for yet
        return <BaseQuestionEditor {...commonProps} />;
    }
  };

  const QuestionTypeSelector = ({ sectionId }: { sectionId: string }) => (
    <Card className="mb-6 border-dashed border-2 border-blue-300 bg-blue-50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <Plus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-blue-900">Add a Question</h4>
            <p className="text-sm text-blue-700">Choose a question type to add to this section</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Question Type</label>
              <Select value={selectedQuestionType} onValueChange={(value: QuestionType) => setSelectedQuestionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(QUESTION_TYPE_CATEGORIES).map(([category, types]) => (
                    <React.Fragment key={category}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                        {category}
                      </div>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {QUESTION_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => onAddQuestion(sectionId, selectedQuestionType)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          {selectedQuestionType && (
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-900">
                {QUESTION_TYPE_LABELS[selectedQuestionType]}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {QUESTION_TYPE_DESCRIPTIONS[selectedQuestionType]}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (sections.length === 0) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">No Sections Available</p>
              <p className="text-sm text-orange-700">
                Please go back to the previous step and create at least one section before adding questions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Form Questions
            </div>
            <Badge variant="outline">
              {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Add questions to each section of your form. You can link questions to project activities 
            to automatically track progress toward your KPIs.
          </p>
        </CardContent>
      </Card>

      {/* Section Tabs */}
      <Tabs defaultValue={sections[0]?.id} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
          {sections.map((section, index) => (
            <TabsTrigger key={section.id} value={section.id} className="text-center">
              <div>
                <div className="font-medium">{section.title || `Section ${index + 1}`}</div>
                <div className="text-xs text-gray-500">
                  {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            {/* Section Header */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                {section.description && (
                  <p className="text-sm text-gray-600">{section.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Add Question */}
            <QuestionTypeSelector sectionId={section.id} />

            {/* Questions List */}
            {section.questions.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No questions in this section yet</p>
                    <p className="text-sm text-gray-500">
                      Use the question selector above to add your first question.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {section.questions.map((question) => (
                  <div key={question.id}>
                    {renderQuestionEditor(section.id, question)}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Question Guidelines */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-green-900 mb-2">Question Design Best Practices</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Keep questions clear, concise, and focused on one topic</li>
            <li>• Use simple language that your target audience will understand</li>
            <li>• Avoid leading or biased questions</li>
            <li>• Provide clear instructions for complex question types</li>
            <li>• Link questions to project activities to enable automatic KPI tracking</li>
            <li>• Test your questions with a small group before deploying</li>
          </ul>
        </CardContent>
      </Card>

      {/* Validation Notice */}
      {totalQuestions === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Questions Required</p>
                <p className="text-sm text-orange-700">
                  Please add at least one question to your form before proceeding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}