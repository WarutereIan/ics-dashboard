import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { QuestionType } from './types';
import { toast } from '@/hooks/use-toast';
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_DESCRIPTIONS,
  QUESTION_TYPE_CATEGORIES,
} from './question-types';

interface AddNextQuestionModalProps {
  sectionId: string;
  onAddQuestion: (sectionId: string, questionType: QuestionType) => void; // already wrapped upstream to insert after current
}

export function AddNextQuestionModal({ sectionId, onAddQuestion }: AddNextQuestionModalProps) {
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('SHORT_TEXT');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddQuestion = () => {
    onAddQuestion(sectionId, selectedQuestionType);
    toast({
      title: 'Question inserted',
      description: `${selectedQuestionType.replace('_', ' ')} inserted below.`,
    });
    setIsOpen(false);
    setSelectedQuestionType('SHORT_TEXT'); // Reset to default
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
             <DialogTrigger asChild>
         <Button 
           size="icon"
           className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 text-green-600 shadow-lg hover:shadow-xl transition-all duration-200  border-green-600"
         >
           <Plus className="w-10 h-10 font-bold" />
         </Button>
       </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add Next Question
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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

          {selectedQuestionType && (
            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm font-medium text-gray-900">
                {QUESTION_TYPE_LABELS[selectedQuestionType]}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {QUESTION_TYPE_DESCRIPTIONS[selectedQuestionType]}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
