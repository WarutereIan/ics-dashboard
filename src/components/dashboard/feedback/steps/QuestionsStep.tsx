import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HiClipboard } from '@heroicons/react/24/outline';
import { HelpCircle, GripVertical } from 'lucide-react';

import { FeedbackForm, FeedbackFormSection, FeedbackQuestion, FeedbackQuestionType } from '@/types/feedback';

interface QuestionsStepProps {
  form: FeedbackForm;
  onUpdate: (updates: Partial<FeedbackForm>) => void;
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, updates: Partial<FeedbackFormSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  onAddQuestion: (sectionId: string, questionType: FeedbackQuestionType) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<FeedbackQuestion>) => void;
  onRemoveQuestion: (questionId: string) => void;
  onDuplicateQuestion: (questionId: string) => void;
  validationErrors: string[];
}

const QUESTION_TYPES: { type: FeedbackQuestionType; label: string; description: string }[] = [
  { type: 'SHORT_TEXT', label: 'Short Text', description: 'Single line text input' },
  { type: 'LONG_TEXT', label: 'Long Text', description: 'Multi-line text area' },
  { type: 'NUMBER', label: 'Number', description: 'Numeric input' },
  { type: 'EMAIL', label: 'Email', description: 'Email address input' },
  { type: 'PHONE', label: 'Phone', description: 'Phone number input' },
  { type: 'DATE', label: 'Date', description: 'Date picker' },
  { type: 'DATETIME', label: 'Date & Time', description: 'Date and time picker' },
  { type: 'SINGLE_CHOICE', label: 'Single Choice', description: 'Dropdown selection' },
  { type: 'MULTIPLE_CHOICE', label: 'Multiple Choice', description: 'Checkbox selection' },
  { type: 'YES_NO', label: 'Yes/No', description: 'Binary choice' },
  { type: 'LIKERT_SCALE', label: 'Likert Scale', description: 'Rating scale' },
  { type: 'LOCATION', label: 'Location', description: 'GPS location capture' },
  { type: 'IMAGE_UPLOAD', label: 'Image Upload', description: 'Image file upload' },
  { type: 'FILE_UPLOAD', label: 'File Upload', description: 'Document upload' },
  { type: 'STAKEHOLDER_TYPE', label: 'Stakeholder Type', description: 'Stakeholder identification' },
  { type: 'PRIORITY_SELECTION', label: 'Priority Selection', description: 'Priority level selection' },
  { type: 'ESCALATION_LEVEL', label: 'Escalation Level', description: 'Escalation level selection' }
];

export function QuestionsStep({
  form,
  onUpdate,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onDuplicateQuestion,
  validationErrors
}: QuestionsStepProps) {
  const totalQuestions = form.sections.reduce((total, section) => total + section.questions.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Form Questions</h3>
          <p className="text-sm text-gray-600">
            Design the questions that stakeholders will answer when submitting feedback
          </p>
        </div>
        <Badge variant="outline">
          {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} total
        </Badge>
      </div>

      {/* Sections */}
      {form.sections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Start by adding a section to organize your feedback form questions
            </p>
            <Button onClick={onAddSection}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {form.sections.map((section, sectionIndex) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <CardTitle className="text-lg">Section {sectionIndex + 1}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveSection(section.id)}
                      disabled={form.sections.length === 1}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Section Title */}
                  <div>
                    <label className="text-sm font-medium">Section Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Incident Details"
                    />
                  </div>

                  {/* Section Description */}
                  <div>
                    <label className="text-sm font-medium">Section Description (Optional)</label>
                    <textarea
                      value={section.description || ''}
                      onChange={(e) => onUpdateSection(section.id, { description: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Brief description of what this section covers..."
                    />
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Questions</label>
                      <div className="flex gap-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              onAddQuestion(section.id, e.target.value as FeedbackQuestionType);
                              e.target.value = '';
                            }
                          }}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Add Question Type</option>
                          {QUESTION_TYPES.map(({ type, label, description }) => (
                            <option key={type} value={type} title={description}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {section.questions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No questions in this section yet</p>
                        <p className="text-sm">Select a question type above to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {section.questions.map((question, questionIndex) => (
                          <div key={question.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{question.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {QUESTION_TYPES.find(t => t.type === question.type)?.label}
                                </Badge>
                                {question.isRequired && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              {question.description && (
                                <p className="text-xs text-gray-600">{question.description}</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDuplicateQuestion(question.id)}
                              >
                                <ClipboardIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveQuestion(question.id)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Section Button */}
          <Button variant="outline" onClick={onAddSection} className="w-full">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Another Section
          </Button>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="text-emerald-800">
              <p className="font-medium mb-2">Please fix the following issues:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
