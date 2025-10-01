import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

import { WizardStep, ProjectFormData, OutcomeFormData } from './types';

interface WizardNavigationProps {
  currentStep: number;
  steps: WizardStep[];
  projectData: ProjectFormData;
  outcomes: OutcomeFormData[];
  onPrevStep: () => void;
  onNextStep: () => void;
  onSaveProject: () => Promise<void>;
  onCancel: () => void;
  onSaveDraft?: () => void;
  onSaveEdits?: () => Promise<void>;
  onClearDraft?: () => void;
  hasDraft?: boolean;
  isEditMode?: boolean;
  hasUnsavedChanges?: boolean;
}

export function WizardNavigation({
  currentStep,
  steps,
  projectData,
  outcomes,
  onPrevStep,
  onNextStep,
  onSaveProject,
  onCancel,
  onSaveDraft,
  onSaveEdits,
  onClearDraft,
  hasDraft = false,
  isEditMode = false,
  hasUnsavedChanges = false,
}: WizardNavigationProps) {
  const [isSaving, setIsSaving] = useState(false);
  const isLastStep = currentStep === steps.length - 1;

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      await onSaveProject();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const isNextDisabled = () => {
    switch (currentStep) {
      case 0: // Project Details
        return !projectData.name || !projectData.description || !projectData.country;
      case 1: // Project Overview
        // Overview step is optional, so always allow next
        return false;
      case 2: // Outcomes
        return outcomes.length === 0;
      default:
        return false;
    }
  };

  return (
    <div className="mt-6 md:mt-8">
      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPrevStep}
            disabled={currentStep === 0}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          
          {!isLastStep && (
            <Button
              onClick={onNextStep}
              disabled={isNextDisabled()}
              className="flex-1 flex items-center justify-center gap-2"
            >
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          
          {!isEditMode && onSaveDraft && (
            <Button 
              variant="outline" 
              onClick={onSaveDraft} 
              className="flex-1"
              disabled={!projectData.name}
            >
              Save Draft
            </Button>
          )}
          
          {isEditMode && onSaveEdits && (
            <Button 
              variant="outline" 
              onClick={onSaveEdits} 
              className="flex-1"
              disabled={!projectData.name}
            >
              {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
            </Button>
          )}
          
          {isLastStep && (
            <Button 
              onClick={handleSaveProject} 
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
              <span className="whitespace-nowrap">
                {isSaving ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {!isEditMode && onSaveDraft && (
            <Button 
              variant="outline" 
              onClick={onSaveDraft}
              disabled={!projectData.name}
            >
              Save Draft
            </Button>
          )}
          
          {isEditMode && onSaveEdits && (
            <Button 
              variant="outline" 
              onClick={onSaveEdits}
              disabled={!projectData.name}
            >
              {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
            </Button>
          )}
          
          {!isEditMode && onClearDraft && hasDraft && (
            <Button 
              variant="outline" 
              onClick={onClearDraft}
              className="text-emerald-600 border-red-300 hover:bg-emerald-50"
            >
              Clear Draft
            </Button>
          )}
          
          {isLastStep ? (
            <Button 
              onClick={handleSaveProject} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
            </Button>
          ) : (
            <Button
              onClick={onNextStep}
              disabled={isNextDisabled()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}