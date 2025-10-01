import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { OutcomeFormData } from './types';

interface OutcomesFormProps {
  outcomes: OutcomeFormData[];
  onAddOutcome: () => void;
  onUpdateOutcome: (index: number, field: keyof OutcomeFormData, value: any) => void;
  onRemoveOutcome: (index: number) => void;
}

export function OutcomesForm({ 
  outcomes, 
  onAddOutcome, 
  onUpdateOutcome, 
  onRemoveOutcome 
}: OutcomesFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Outcomes</h3>
        <Button onClick={onAddOutcome} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add Outcome
        </Button>
      </div>

      {outcomes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No outcomes defined yet. Click "Add Outcome" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {outcomes.map((outcome, index) => (
            <Card key={outcome.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Outcome {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveOutcome(index)}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={outcome.title}
                      onChange={(e) => onUpdateOutcome(index, 'title', e.target.value)}
                      placeholder="Enter outcome title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={outcome.description}
                      onChange={(e) => onUpdateOutcome(index, 'description', e.target.value)}
                      placeholder="Enter outcome description"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Target Value</Label>
                      <Input
                        type="number"
                        value={outcome.target}
                        onChange={(e) => onUpdateOutcome(index, 'target', parseInt(e.target.value) || 0)}
                        placeholder="Enter target value"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input
                        value={outcome.unit}
                        onChange={(e) => onUpdateOutcome(index, 'unit', e.target.value)}
                        placeholder="e.g., children, families, %"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}