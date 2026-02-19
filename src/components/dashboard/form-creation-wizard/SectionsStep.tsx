import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Eye, Plus, Trash2, GripVertical, Layers, Repeat } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormSection } from './types';

/**
 * Sortable Section Item Component
 * 
 * Wraps section cards with drag-and-drop functionality.
 * Provides a grip handle for reordering sections within a form.
 * 
 * Features:
 * - Visual drag handle with hover effects
 * - Smooth drag animations
 * - Accessibility support with keyboard navigation
 * - Maintains section editing functionality while dragging
 */
interface SortableSectionItemProps {
  section: FormSection;
  index: number;
  allSections: FormSection[];
  onUpdateSection: (sectionId: string, updates: Partial<FormSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  sectionsLength: number;
}

function SortableSectionItem({ 
  section, 
  index, 
  allSections,
  onUpdateSection, 
  onRemoveSection, 
  sectionsLength 
}: SortableSectionItemProps) {
  const previousSections = allSections.slice(0, index);
  const previousQuestions = previousSections.flatMap(s => (s.questions || []).map(q => ({ ...q, sectionId: s.id, sectionTitle: s.title })));
  // Resolve selected source section: explicit or derived from dependsOn (for backward compatibility)
  const selectedSectionId = section.conditional?.dependsOnSectionId
    ?? (section.conditional?.dependsOn
      ? previousSections.find(s => s.questions?.some((q: any) => q.id === section.conditional?.dependsOn))?.id
      : undefined);
  const questionsInSelectedSection = selectedSectionId
    ? (previousSections.find(s => s.id === selectedSectionId)?.questions ?? [])
    : [];
  const dependsOnQuestion = section.conditional?.dependsOn
    ? previousQuestions.find(q => q.id === section.conditional!.dependsOn)
    : null;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 group cursor-grab active:cursor-grabbing"
              title="Drag to reorder section"
            >
              <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
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

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-gray-600" />
                  <div>
                    <Label htmlFor={`section-repeatable-${section.id}`} className="text-sm font-medium">
                      Allow multiple instances
                    </Label>
                    <p className="text-xs text-gray-500">
                      Users can fill this section multiple times (e.g., for multiple learners)
                    </p>
                  </div>
                </div>
                <Switch
                  id={`section-repeatable-${section.id}`}
                  checked={section.conditional?.repeatable || false}
                  onCheckedChange={(checked) => {
                    onUpdateSection(section.id, { 
                      conditional: { 
                        ...section.conditional, 
                        repeatable: checked 
                      } 
                    });
                  }}
                />
              </div>

              {/* Show section only when a previous question has a specific value (e.g. Gender = M) */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-700" />
                  <div>
                    <Label className="text-sm font-medium text-amber-900">Show section only when</Label>
                    <p className="text-xs text-amber-700">
                      Only show this section when a previous question has a specific answer (e.g. Gender = Female)
                    </p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div>
                    <Label className="text-xs">Source section</Label>
                    <Select
                      value={selectedSectionId ?? '__none__'}
                      onValueChange={(value) => {
                        if (value === '__none__') {
                          onUpdateSection(section.id, {
                            conditional: {
                              ...section.conditional,
                              dependsOnSectionId: undefined,
                              dependsOn: undefined,
                              showWhen: undefined,
                            },
                          });
                          return;
                        }
                        onUpdateSection(section.id, {
                          conditional: {
                            ...section.conditional,
                            dependsOnSectionId: value,
                            dependsOn: undefined,
                            showWhen: undefined,
                          },
                        });
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Always show" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Always show this section</SelectItem>
                        {previousSections.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Question</Label>
                    <Select
                      value={section.conditional?.dependsOn ?? '__none__'}
                      onValueChange={(value) => {
                        const next = value === '__none__'
                          ? { ...section.conditional, dependsOn: undefined, showWhen: undefined }
                          : { ...section.conditional, dependsOn: value, showWhen: undefined };
                        onUpdateSection(section.id, { conditional: next });
                      }}
                      disabled={!selectedSectionId || questionsInSelectedSection.length === 0}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">—</SelectItem>
                        {questionsInSelectedSection.map((q: any) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Answer</Label>
                    {!section.conditional?.dependsOn || !dependsOnQuestion ? (
                      <div className="mt-1 h-9 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                        Select a question first
                      </div>
                    ) : (dependsOnQuestion as any).options?.length > 0 ? (
                      <Select
                        value={Array.isArray(section.conditional?.showWhen)
                          ? String((section.conditional.showWhen as any[])[0])
                          : section.conditional?.showWhen != null
                            ? String(section.conditional.showWhen)
                            : '__none__'}
                        onValueChange={(value) => {
                          if (value === '__none__') {
                            onUpdateSection(section.id, {
                              conditional: { ...section.conditional, showWhen: undefined },
                            });
                            return;
                          }
                          onUpdateSection(section.id, {
                            conditional: { ...section.conditional, showWhen: value },
                          });
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          {(dependsOnQuestion as any).options.map((opt: any) => (
                            <SelectItem key={opt.id} value={String(opt.value)}>
                              {opt.label ?? String(opt.value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        className="mt-1"
                        placeholder="Value to match"
                        value={Array.isArray(section.conditional?.showWhen)
                          ? (section.conditional.showWhen as any[]).join(', ')
                          : section.conditional?.showWhen != null
                            ? String(section.conditional.showWhen)
                            : ''}
                        onChange={(e) => {
                          const v = e.target.value.trim();
                          onUpdateSection(section.id, {
                            conditional: { ...section.conditional, showWhen: v || undefined },
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
                {previousSections.length === 0 && (
                  <p className="text-xs text-amber-600">Add sections above this one to limit visibility by answer.</p>
                )}
                {selectedSectionId && questionsInSelectedSection.length === 0 && (
                  <p className="text-xs text-amber-600">Selected section has no questions yet.</p>
                )}
                {section.conditional?.dependsOn && previousQuestions.length > 0 && !dependsOnQuestion && (
                  <p className="text-xs text-amber-600">Selected question not found (section or question may have changed).</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveSection(section.id)}
              disabled={sectionsLength <= 1}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
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
  );
}

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
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderSections(oldIndex, newIndex);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Form Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Organize your form into logical sections. Each section can contain multiple questions
            and helps respondents navigate through your form more easily.
          </p>
          
          <Button onClick={onAddSection} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
        </CardContent>
      </Card>

      {/* Reordering Instructions */}
      {sections.length > 1 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <GripVertical className="w-4 h-4" />
              <span>Drag sections by the grip handle to reorder them</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No sections created yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Start by adding your first section to organize your form questions.
              </p>
              <Button onClick={onAddSection} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Section
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map(section => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section, index) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  allSections={sections}
                  onUpdateSection={onUpdateSection}
                  onRemoveSection={onRemoveSection}
                  sectionsLength={sections.length}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Section Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-2">Section Organization Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Group related questions together (e.g., "Personal Information", "Project Feedback")</li>
            <li>• Keep sections focused and not too long (5-10 questions per section)</li>
            <li>• Use clear, descriptive section titles</li>
            <li>• Consider the logical flow from one section to the next</li>
            <li>• Add descriptions to provide context or instructions for complex sections</li>
            <li>• Drag sections by the grip handle to reorder them for better user experience</li>
          </ul>
        </CardContent>
      </Card>

      {/* Validation Notice */}
      {sections.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Section Required</p>
                <p className="text-sm text-orange-700">
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