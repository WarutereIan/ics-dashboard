import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { formatDraftAge, getDraftAge } from '@/lib/localStorageUtils';
import {
  useProjectWizard,
  StepIndicator,
  ProjectDetailsForm,
  OutcomesForm,
  ActivitiesForm,
  KPIsForm,
  ProjectReview,
  WizardNavigation,
} from './project-creation-wizard';

export function ProjectCreationWizard() {
  const {
    wizardState,
    steps,
    isEditMode,
    handleProjectChange,
    addOutcome,
    updateOutcome,
    removeOutcome,
    addActivity,
    updateActivity,
    removeActivity,
    addKPI,
    updateKPI,
    removeKPI,
    nextStep,
    prevStep,
    saveProject,
    saveDraft,
    saveEdits,
    clearDraft,
    hasDraft,
    navigate,
  } = useProjectWizard();

  const { projectData, outcomes, activities, kpis, currentStep } = wizardState;
  const [showDraftAlert, setShowDraftAlert] = useState(false);
  const [draftAgeText, setDraftAgeText] = useState('');

  // Check for draft on component mount
  useEffect(() => {
    if (!isEditMode && hasDraft()) {
      setShowDraftAlert(true);
      const draftAge = getDraftAge();
      if (draftAge) {
        setDraftAgeText(formatDraftAge(draftAge));
      }
    }
  }, [isEditMode, hasDraft]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectDetailsForm 
            projectData={projectData} 
            onProjectChange={handleProjectChange} 
          />
        );
      case 1:
        return (
          <OutcomesForm
            outcomes={outcomes}
            onAddOutcome={addOutcome}
            onUpdateOutcome={updateOutcome}
            onRemoveOutcome={removeOutcome}
          />
        );
      case 2:
        return (
          <ActivitiesForm
            outcomes={outcomes}
            activities={activities}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
            onRemoveActivity={removeActivity}
          />
        );
      case 3:
        return (
          <KPIsForm
            outcomes={outcomes}
            kpis={kpis}
            onAddKPI={addKPI}
            onUpdateKPI={updateKPI}
            onRemoveKPI={removeKPI}
          />
        );
      case 4:
        return (
          <ProjectReview
            projectData={projectData}
            outcomes={outcomes}
            activities={activities}
            kpis={kpis}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-5xl mx-auto w-full min-w-0">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
            {isEditMode ? `Edit Project: ${projectData.name || 'Loading...'}` : 'Create New Project'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base break-words">
            {isEditMode 
              ? 'Update your project details, outcomes, activities, and KPIs'
              : 'Set up your project with outcomes, activities, and KPIs'
            }
          </p>
        </div>

        {/* Draft Alert */}
        {showDraftAlert && !isEditMode && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Download className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <span>A draft of your project is available{draftAgeText && ` (saved ${draftAgeText})`}. You can restore it to continue where you left off.</span>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // The draft is already loaded by the hook, just hide the alert
                      setShowDraftAlert(false);
                    }}
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    Restore Draft
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDraftAlert(false)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <div className="mb-6 md:mb-8 overflow-x-auto">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl break-words">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-sm md:text-base break-words">{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="w-full min-w-0 overflow-x-auto">
              {renderStepContent()}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 md:mt-8">
          <WizardNavigation
            currentStep={currentStep}
            steps={steps}
            projectData={projectData}
            outcomes={outcomes}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onSaveProject={saveProject}
            onCancel={() => navigate('/dashboard')}
            onSaveDraft={saveDraft}
            onSaveEdits={saveEdits}
            onClearDraft={clearDraft}
            hasDraft={hasDraft()}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
}