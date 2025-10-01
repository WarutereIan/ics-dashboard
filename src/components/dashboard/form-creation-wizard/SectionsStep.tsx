import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExclamationCircleIcon, PlusIcon, TrashIcon, Bars3Icon, Squares2X2Icon } from '@heroicons/react/24/outline';

import { FormSection } from './types';

interface SectionsStepProps {
  sections: FormSection[];
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, updates: Partial<FormSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  onReorderSections: (startIndex: number, endIndex: number) => void;
}

export function SectionsStep({
  sections,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onReorderSections,
}: SectionsStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Squares2X2Icon className="w-5 h-5" />
            Form Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Organize your form into logical sections. Each section can contain multiple questions
            and helps respondents navigate through your form more easily.
          </p>
          
          <Button onClick={onAddSection} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Section
          </Button>
        </CardContent>
      </Card>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Squares2X2Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No sections created yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Start by adding your first section to organize your form questions.
              </p>
              <Button onClick={onAddSection} variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Section
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={section.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Bars3Icon className="w-4 h-4 text-gray-400 cursor-move" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Section {index + 1}</Badge>
                        <span className="text-xs text-gray-500">
                          {section.questions?.length || 0} questions
                        </span>
                      </div>
                      
                      <div>
                        <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                        <Input
                          id={`section-title-${section.id}`}
                          value={section.title}
                          onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
                          placeholder="Enter section title..."
                          className="font-medium"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`section-description-${section.id}`}>
                          Section Description (optional)
                        </Label>
                        <Textarea
                          id={`section-description-${section.id}`}
                          value={section.description || ''}
                          onChange={(e) => onUpdateSection(section.id, { description: e.target.value })}
                          placeholder="Add instructions or context for this section..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveSection(section.id)}
                      disabled={sections.length <= 1}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {section.description && (
                <CardContent className="pt-0">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Section Guidelines */}
      <Card className="bg-emerald-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-emerald-900 mb-2">Section Organization Tips</h4>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• Group related questions together (e.g., "Personal Information", "Project Feedback")</li>
            <li>• Keep sections focused and not too long (5-10 questions per section)</li>
            <li>• Use clear, descriptive section titles</li>
            <li>• Consider the logical flow from one section to the next</li>
            <li>• Add descriptions to provide context or instructions for complex sections</li>
          </ul>
        </CardContent>
      </Card>

      {/* Validation Notice */}
      {sections.length === 0 && (
        <Card className="border-orange-200 bg-lime-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <ExclamationCircleIcon className="w-5 h-5 text-lime-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Section Required</p>
                <p className="text-sm text-lime-700">
                  Please add at least one section to organize your form questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}