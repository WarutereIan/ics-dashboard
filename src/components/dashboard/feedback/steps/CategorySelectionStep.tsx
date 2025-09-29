import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  FeedbackForm, 
  StakeholderType, 
  DEFAULT_STAKEHOLDER_TYPES 
} from '@/types/feedback';
import { Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface CategorySelectionStepProps {
  form: FeedbackForm;
  onUpdate: (updates: Partial<FeedbackForm>) => void;
  validationErrors: string[];
}

export function CategorySelectionStep({ form, onUpdate, validationErrors }: CategorySelectionStepProps) {
  const handleStakeholderToggle = (stakeholderId: string, checked: boolean) => {
    const currentAllowed = form.category?.allowedStakeholders || [];
    const updatedAllowed = checked 
      ? [...currentAllowed, stakeholderId]
      : currentAllowed.filter(id => id !== stakeholderId);

    onUpdate({
      category: {
        ...form.category!,
        allowedStakeholders: updatedAllowed
      }
    });
  };

  const isStakeholderAllowed = (stakeholderId: string) => {
    return form.category?.allowedStakeholders.includes(stakeholderId) || false;
  };

  const getStakeholderIcon = (stakeholder: StakeholderType) => {
    switch (stakeholder.id) {
      case 'community_member':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'program_beneficiary':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'observer':
        return <Shield className="w-5 h-5 text-purple-600" />;
      case 'partner_organization':
        return <Users className="w-5 h-5 text-orange-600" />;
      case 'government_official':
        return <Shield className="w-5 h-5 text-red-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'SENSITIVE':
        return 'destructive';
      case 'CONFIDENTIAL':
        return 'default';
      case 'INTERNAL':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Summary */}
      {form.category && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Selected Category: {form.category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Type:</span>
                <p className="text-blue-800">{form.category.type}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Default Priority:</span>
                <p className="text-blue-800">{form.category.defaultPriority}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Sensitivity:</span>
                <p className="text-blue-800">{form.category.defaultSensitivity}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Escalation:</span>
                <p className="text-blue-800">{form.category.escalationLevel}</p>
              </div>
            </div>
            <p className="text-blue-700 mt-3 text-sm">{form.category.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Stakeholder Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">Allowed Stakeholders</Label>
          <p className="text-sm text-gray-600">
            Select which types of stakeholders can submit feedback using this form. 
            You can modify the default selections based on your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_STAKEHOLDER_TYPES.map((stakeholder) => {
            const isAllowed = isStakeholderAllowed(stakeholder.id);
            const canSubmitThisType = stakeholder.allowedFeedbackTypes.includes(form.category?.type || 'GENERAL');
            
            return (
              <Card 
                key={stakeholder.id}
                className={`transition-all ${
                  isAllowed ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                } ${!canSubmitThisType ? 'opacity-50' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStakeholderIcon(stakeholder)}
                      <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                    </div>
                    <Checkbox
                      checked={isAllowed}
                      onCheckedChange={(checked) => handleStakeholderToggle(stakeholder.id, checked as boolean)}
                      disabled={!canSubmitThisType}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{stakeholder.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Anonymous:</span>
                      <span className={stakeholder.canSubmitAnonymous ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {stakeholder.canSubmitAnonymous ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Default Sensitivity:</span>
                      <Badge variant={getSensitivityColor(stakeholder.defaultSensitivity)} className="text-xs">
                        {stakeholder.defaultSensitivity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Allowed Types:</span>
                      <span className="text-gray-600">{stakeholder.allowedFeedbackTypes.length}</span>
                    </div>
                  </div>

                  {!canSubmitThisType && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      This stakeholder type cannot submit {form.category?.type} feedback
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stakeholder Summary */}
      {form.category && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stakeholder Access Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Allowed Stakeholders:</span>
                <Badge variant="outline">
                  {form.category.allowedStakeholders.length} of {DEFAULT_STAKEHOLDER_TYPES.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Anonymous Submissions:</span>
                <Badge variant={form.allowAnonymous ? 'default' : 'secondary'}>
                  {form.allowAnonymous ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Authentication Required:</span>
                <Badge variant={form.requireAuthentication ? 'default' : 'secondary'}>
                  {form.requireAuthentication ? 'Required' : 'Optional'}
                </Badge>
              </div>
            </div>

            {form.category.allowedStakeholders.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Stakeholders:</p>
                <div className="flex flex-wrap gap-2">
                  {form.category.allowedStakeholders.map(stakeholderId => {
                    const stakeholder = DEFAULT_STAKEHOLDER_TYPES.find(s => s.id === stakeholderId);
                    return stakeholder ? (
                      <Badge key={stakeholderId} variant="outline" className="text-xs">
                        {stakeholder.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800">
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
