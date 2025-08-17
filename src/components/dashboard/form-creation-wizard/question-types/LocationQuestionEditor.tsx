import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Settings, Globe, Target, Clock } from 'lucide-react';
import { LocationQuestion } from '../types';
import { BaseQuestionEditor } from './BaseQuestionEditor';
import { FormQuestion, ActivityKPIMapping } from '../types';

interface BaseQuestionEditorProps {
  question: FormQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  availableActivities: ActivityKPIMapping[];
  onLinkToActivity: (activityMapping: ActivityKPIMapping) => void;
  children?: React.ReactNode;
}

type LocationQuestionEditorProps = BaseQuestionEditorProps & {
  question: LocationQuestion;
};

export function LocationQuestionEditor(props: LocationQuestionEditorProps) {
  const { question, onUpdate } = props;

  return (
    <BaseQuestionEditor {...props}>
      <div className="space-y-6">
        {/* Location Capture Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Capture Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* High Accuracy Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">High Accuracy GPS</Label>
                <p className="text-xs text-gray-500">
                  Use high accuracy GPS for better precision (uses more battery)
                </p>
              </div>
              <Switch
                checked={question.enableHighAccuracy ?? true}
                onCheckedChange={(checked) => 
                  onUpdate({ enableHighAccuracy: checked } as Partial<FormQuestion>)
                }
              />
            </div>

            {/* Accuracy Setting */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Required Accuracy (meters)</Label>
              <Input
                type="number"
                min="1"
                max="1000"
                placeholder="10"
                value={question.accuracy || ''}
                onChange={(e) => 
                  onUpdate({ accuracy: e.target.value ? parseInt(e.target.value) : undefined } as Partial<FormQuestion>)
                }
                className="w-32"
              />
              <p className="text-xs text-gray-500">
                Minimum accuracy required. Leave empty for any accuracy.
              </p>
            </div>

            {/* Timeout Setting */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Timeout (seconds)</Label>
              <Input
                type="number"
                min="5"
                max="60"
                placeholder="10"
                value={question.timeout ? question.timeout / 1000 : ''}
                onChange={(e) => 
                  onUpdate({ timeout: e.target.value ? parseInt(e.target.value) * 1000 : undefined } as Partial<FormQuestion>)
                }
                className="w-32"
              />
              <p className="text-xs text-gray-500">
                Maximum time to wait for location (5-60 seconds)
              </p>
            </div>

            {/* Manual Input Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Allow Manual Input</Label>
                <p className="text-xs text-gray-500">
                  Let users enter coordinates manually if GPS fails
                </p>
              </div>
              <Switch
                checked={question.allowManualInput ?? false}
                onCheckedChange={(checked) => 
                  onUpdate({ allowManualInput: checked } as Partial<FormQuestion>)
                }
              />
            </div>

            {/* Address Capture Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Capture Address</Label>
                <p className="text-xs text-gray-500">
                  Automatically get address from coordinates
                </p>
              </div>
              <Switch
                checked={question.captureAddress ?? false}
                onCheckedChange={(checked) => 
                  onUpdate({ captureAddress: checked } as Partial<FormQuestion>)
                }
              />
            </div>

            {/* Map Display Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Show Map Preview</Label>
                <p className="text-xs text-gray-500">
                  Display map preview of captured location
                </p>
              </div>
              <Switch
                checked={question.showMap ?? false}
                onCheckedChange={(checked) => 
                  onUpdate({ showMap: checked } as Partial<FormQuestion>)
                }
              />
            </div>
          </CardContent>
        </Card>

      

        {/* Feature Information */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Location Capture Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 📍 GPS location capture with accuracy reporting</li>
                  <li>• 🎯 Manual coordinate entry as fallback</li>
                  <li>• 🏠 Automatic address lookup from coordinates</li>
                  <li>• ⏱️ Configurable timeout and accuracy settings</li>
                  <li>• 🔋 Battery-optimized GPS options</li>
                  <li>• 📱 Mobile-friendly interface</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseQuestionEditor>
  );
}
