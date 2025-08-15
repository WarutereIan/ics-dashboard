import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { MultipleChoiceQuestion, ActivityKPIMapping, ChoiceOption, FormQuestion } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface MultipleChoiceQuestionEditorProps {
  question: MultipleChoiceQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
}

export function MultipleChoiceQuestionEditor(props: MultipleChoiceQuestionEditorProps) {
  const { question, onUpdate } = props;
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [otherText, setOtherText] = React.useState('');

  const addOption = () => {
    const newOption: ChoiceOption = {
      id: uuidv4(),
      label: `Option ${question.options.length + 1}`,
      value: `option_${question.options.length + 1}`,
    };
    
    onUpdate({
      options: [...question.options, newOption]
    } as Partial<FormQuestion>);
  };

  const updateOption = (optionId: string, updates: Partial<ChoiceOption>) => {
    onUpdate({
      options: question.options.map(option =>
        option.id === optionId ? { ...option, ...updates } : option
      )
    } as Partial<FormQuestion>);
  };

  const removeOption = (optionId: string) => {
    if (question.options.length > 2) {
      onUpdate({
        options: question.options.filter(option => option.id !== optionId)
      } as Partial<FormQuestion>);
    }
  };

  const moveOption = (optionId: string, direction: 'up' | 'down') => {
    const currentIndex = question.options.findIndex(option => option.id === optionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < question.options.length - 1)
    ) {
      const newOptions = [...question.options];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newOptions[currentIndex], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[currentIndex]];
      onUpdate({ options: newOptions } as Partial<FormQuestion>);
    }
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => {
      const isSelected = prev.includes(optionId);
      if (isSelected) {
        return prev.filter(id => id !== optionId);
      } else {
        // Check if we're within the selection limits
        if (question.maxSelections && prev.length >= question.maxSelections) {
          return prev; // Don't add if we've reached the maximum
        }
        return [...prev, optionId];
      }
    });
  };

  const handleOtherToggle = (checked: boolean) => {
    if (checked) {
      if (question.maxSelections && selectedOptions.length >= question.maxSelections) {
        return; // Don't add if we've reached the maximum
      }
      setSelectedOptions(prev => [...prev, 'other']);
    } else {
      setSelectedOptions(prev => prev.filter(id => id !== 'other'));
      setOtherText('');
    }
  };

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-4 block">Question Configuration</Label>
          
          <div className="space-y-4">
            {/* Selection Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`minSelections-${question.id}`}>Minimum Selections</Label>
                <Input
                  id={`minSelections-${question.id}`}
                  type="number"
                  value={question.minSelections || ''}
                  onChange={(e) => onUpdate({ minSelections: parseInt(e.target.value) || undefined } as Partial<FormQuestion>)}
                  placeholder="No minimum"
                  min="0"
                  max="20"
                />
              </div>
              
              <div>
                <Label htmlFor={`maxSelections-${question.id}`}>Maximum Selections</Label>
                <Input
                  id={`maxSelections-${question.id}`}
                  type="number"
                  value={question.maxSelections || ''}
                  onChange={(e) => onUpdate({ maxSelections: parseInt(e.target.value) || undefined } as Partial<FormQuestion>)}
                  placeholder="No maximum"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            {/* Allow Other Option */}
            <div className="flex items-center justify-between">
              <Label>Allow "Other" option with text input</Label>
              <Switch
                checked={question.allowOther || false}
                onCheckedChange={(checked) => onUpdate({ allowOther: checked } as Partial<FormQuestion>)}
              />
            </div>

            {/* Options Management */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Answer Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2 p-2 border rounded">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) => updateOption(option.id, { label: e.target.value })}
                        placeholder="Option label"
                      />
                      <Input
                        value={option.value}
                        onChange={(e) => updateOption(option.id, { value: e.target.value })}
                        placeholder="Option value"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOption(option.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOption(option.id, 'down')}
                        disabled={index === question.options.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                        disabled={question.options.length <= 2}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-lg bg-white">
          <Label className="text-sm font-medium mb-2 block text-blue-600">Preview</Label>
          <div className="space-y-2">
            <Label className="font-medium">
              {question.title || 'Question Title'}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-gray-600">{question.description}</p>
            )}
            
                         <div className="space-y-2">
               {question.options.map((option) => (
                 <div key={option.id} className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id={`preview-${option.id}`}
                     checked={selectedOptions.includes(option.id)}
                     onChange={() => handleOptionToggle(option.id)}
                     className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                   />
                   <Label htmlFor={`preview-${option.id}`}>{option.label}</Label>
                 </div>
               ))}
               {question.allowOther && (
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="preview-other"
                     checked={selectedOptions.includes('other')}
                     onChange={(e) => handleOtherToggle(e.target.checked)}
                     className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                   />
                   <Label htmlFor="preview-other">Other:</Label>
                   <Input 
                     placeholder="Please specify..." 
                     className="flex-1" 
                     value={otherText}
                     onChange={(e) => setOtherText(e.target.value)}
                     disabled={!selectedOptions.includes('other')}
                   />
                 </div>
               )}
             </div>

                         {(question.minSelections || question.maxSelections) && (
               <div className="mt-2 space-y-1">
                 <p className="text-xs text-gray-500">
                   {question.minSelections && question.maxSelections
                     ? `Select between ${question.minSelections} and ${question.maxSelections} options`
                     : question.minSelections
                     ? `Select at least ${question.minSelections} option${question.minSelections > 1 ? 's' : ''}`
                     : `Select up to ${question.maxSelections} option${question.maxSelections! > 1 ? 's' : ''}`
                   }
                 </p>
                 <p className="text-xs font-medium">
                   Selected: {selectedOptions.length} option{selectedOptions.length !== 1 ? 's' : ''}
                   {question.maxSelections && ` / ${question.maxSelections} max`}
                 </p>
                 {question.minSelections && selectedOptions.length < question.minSelections && (
                   <p className="text-xs text-red-500">
                     Please select at least {question.minSelections} option{question.minSelections > 1 ? 's' : ''}
                   </p>
                 )}
               </div>
             )}
          </div>
        </div>

        {/* Data Information */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Database Storage</p>
            <p className="text-xs text-gray-600">
              Selected option values will be stored as ARRAY_TEXT in PostgreSQL
            </p>
          </div>
          <Badge variant="outline">ARRAY_TEXT</Badge>
        </div>
      </div>
    </BaseQuestionEditor>
  );
}