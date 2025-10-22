import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Plus, Trash2, GripVertical, Layers, Repeat } from 'lucide-react';
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
  onUpdateSection: (sectionId: string, updates: Partial<FormSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  sectionsLength: number;
}

function SortableSectionItem({ 
  section, 
  index, 
  onUpdateSection, 
  onRemoveSection, 
  sectionsLength 
}: SortableSectionItemProps) {
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
                    console.log('🔄 Section repeatable toggle changed:', {
                      sectionId: section.id,
                      sectionTitle: section.title,
                      repeatable: checked,
                      previousConditional: section.conditional
                    });
                    onUpdateSection(section.id, { 
                      conditional: { 
                        ...section.conditional, 
                        repeatable: checked 
                      } 
                    });
                  }}
                />
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