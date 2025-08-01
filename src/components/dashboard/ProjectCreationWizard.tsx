import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    navigate,
  } = useProjectWizard();

  const { projectData, outcomes, activities, kpis, currentStep } = wizardState;

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
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
}