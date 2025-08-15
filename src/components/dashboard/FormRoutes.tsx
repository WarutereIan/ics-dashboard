import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { FormManagement } from './FormManagement';
import { FormCreationWizard } from './form-creation-wizard';
import { FormResponseViewer } from './FormResponseViewer';
import { FormDeployment } from './form-creation-wizard/form-deployment';
import { FormPreview } from './form-preview/FormPreview';

function ProjectFormWrapper({ children }: { children: React.ReactNode }) {
  const { projectId } = useParams();
  
  // Pass the projectId context to child components
  return (
    <div data-project-id={projectId}>
      {children}
    </div>
  );
}

function FormCreationWizardWrapper() {
  const { formId } = useParams<{ formId: string }>();
  return <FormCreationWizard formId={formId} />;
}

export function FormRoutes() {
  return (
    <Routes>
      {/* Main forms management dashboard */}
      <Route path="/" element={
        <ProjectFormWrapper>
          <FormManagement />
        </ProjectFormWrapper>
      } />
      
      {/* Create new form */}
      <Route path="/create" element={
        <ProjectFormWrapper>
          <FormCreationWizard formId={undefined} />
        </ProjectFormWrapper>
      } />
      
      {/* Edit existing form */}
      <Route path="/edit/:formId" element={
        <ProjectFormWrapper>
          <FormCreationWizardWrapper />
        </ProjectFormWrapper>
      } />
      
      {/* View form responses and analytics */}
      <Route path="/responses/:formId" element={
        <ProjectFormWrapper>
          <FormResponseViewer />
        </ProjectFormWrapper>
      } />
      
      {/* Form deployment and sharing */}
      <Route 
        path="/deploy/:formId" 
        element={
          <ProjectFormWrapper>
            <div className="p-6">
              <FormDeployment 
                form={{
                  id: 'sample-form',
                  title: 'Sample Form',
                  status: 'PUBLISHED',
                  responseCount: 50,
                  lastResponseAt: new Date(),
                  settings: {
                    requireAuthentication: false,
                    allowMultipleResponses: false,
                    allowResponseEditing: false,
                    showProgressBar: true,
                    allowSaveDraft: true,
                    randomizeQuestions: false,
                    thankYouMessage: 'Thank you!',
                    notificationEmails: [],
                    autoSave: true,
                  }
                } as any}
                onUpdateForm={() => {}}
              />
            </div>
          </ProjectFormWrapper>
        } 
      />
      
      {/* Preview form (public view) */}
      <Route 
        path="/preview/:formId" 
        element={
          <ProjectFormWrapper>
            <FormPreview isPreviewMode={true} />
          </ProjectFormWrapper>
        } 
      />
    </Routes>
  );
}