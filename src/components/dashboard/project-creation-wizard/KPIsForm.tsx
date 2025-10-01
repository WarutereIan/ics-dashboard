import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { OutcomeFormData, KPIFormData } from './types';

interface KPIsFormProps {
  outcomes: OutcomeFormData[];
  kpis: KPIFormData[];
  onAddKPI: (outcomeId: string) => void;
  onUpdateKPI: (index: number, field: keyof KPIFormData, value: any) => void;
  onRemoveKPI: (index: number) => void;
}

export function KPIsForm({ 
  outcomes, 
  kpis, 
  onAddKPI, 
  onUpdateKPI, 
  onRemoveKPI 
}: KPIsFormProps) {
  if (outcomes.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Key Performance Indicators</h3>
        <div className="text-center py-8 text-gray-500">
          No outcomes defined yet. Please go back and add outcomes first.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Key Performance Indicators</h3>
      
      <Tabs defaultValue={outcomes[0]?.id} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${outcomes.length}, 1fr)` }}>
          {outcomes.map((outcome, index) => (
            <TabsTrigger key={outcome.id} value={outcome.id}>
              Outcome {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {outcomes.map((outcome) => (
          <TabsContent key={outcome.id} value={outcome.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{outcome.title || `Outcome ${outcomes.indexOf(outcome) + 1}`}</h4>
                <p className="text-sm text-gray-600">{outcome.description}</p>
              </div>
              <Button onClick={() => onAddKPI(outcome.id)} className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add KPI
              </Button>
            </div>

            {kpis.filter(k => k.outcomeId === outcome.id).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No KPIs for this outcome yet.
              </div>
            ) : (
              <div className="space-y-3">
                {kpis
                  .map((kpi, index) => ({ kpi, originalIndex: index }))
                  .filter(({ kpi }) => kpi.outcomeId === outcome.id)
                  .map(({ kpi, originalIndex }) => (
                  <Card key={originalIndex}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-medium text-sm">KPI {kpis.filter(k => k.outcomeId === outcome.id).indexOf(kpi) + 1}</h5>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveKPI(originalIndex)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <Input
                          value={kpi.name}
                          onChange={(e) => onUpdateKPI(originalIndex, 'name', e.target.value)}
                          placeholder="KPI name"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            type="number"
                            value={kpi.target}
                            onChange={(e) => onUpdateKPI(originalIndex, 'target', parseInt(e.target.value) || 0)}
                            placeholder="Target value"
                          />
                          <Input
                            value={kpi.unit}
                            onChange={(e) => onUpdateKPI(originalIndex, 'unit', e.target.value)}
                            placeholder="Unit"
                          />
                          <Select value={kpi.type} onValueChange={(value) => onUpdateKPI(originalIndex, 'type', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">Bar Chart</SelectItem>
                              <SelectItem value="progress">Progress Bar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}