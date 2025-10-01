import React from 'react';
import { WizardStep } from './types';

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-center mb-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
            currentStep >= 0 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {currentStep + 1}
          </div>
          <span className="mx-3 text-gray-400">of</span>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-600">
            {steps.length}
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-emerald-600 break-words">
            {steps[currentStep].title}
          </p>
          <p className="text-sm text-gray-500 break-words mt-1">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div className="ml-3 min-w-0">
                <p className={`text-sm font-medium break-words ${index <= currentStep ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 break-words">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-16 flex-shrink-0 ${index < currentStep ? 'bg-emerald-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}