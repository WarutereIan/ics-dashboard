import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { WizardStep, ProjectFormData, OutcomeFormData } from './types';

interface WizardNavigationProps {
  currentStep: number;
  steps: WizardStep[];
  projectData: ProjectFormData;
  outcomes: OutcomeFormData[];
  onPrevStep: () => void;
  onNextStep: () => void;
  onSaveProject: () => void;
  onCancel: () => void;
  isEditMode?: boolean;
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
  isEditMode = false,
}: WizardNavigationProps) {
  const isLastStep = currentStep === steps.length - 1;
  
  const isNextDisabled = () => {
    switch (currentStep) {
      case 0: // Project Details
        return !projectData.name || !projectData.description || !projectData.country;
      case 1: // Outcomes
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
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          {!isLastStep && (
            <Button
              onClick={onNextStep}
              disabled={isNextDisabled()}
              className="flex-1 flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          
          {isLastStep && (
            <Button onClick={onSaveProject} className="flex-1 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              <span className="whitespace-nowrap">{isEditMode ? 'Update Project' : 'Create Project'}</span>
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
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {isLastStep ? (
            <Button onClick={onSaveProject} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {isEditMode ? 'Update Project' : 'Create Project'}
            </Button>
          ) : (
            <Button
              onClick={onNextStep}
              disabled={isNextDisabled()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}