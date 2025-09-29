import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormResponse } from './form-creation-wizard/types';
import { FormPreview } from './form-preview/FormPreview';
import { useForm } from '@/contexts/FormContext';
import { useToast } from '@/hooks/use-toast';

interface ResponseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: Form;
  response: FormResponse;
  projectId: string;
  onResponseUpdated: (updatedResponse: FormResponse) => void;
}

export function ResponseEditModal({
  isOpen,
  onClose,
  form,
  response,
  projectId,
  onResponseUpdated
}: ResponseEditModalProps) {
  const { updateFormResponse } = useForm();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (updatedResponse: FormResponse) => {
    setIsUpdating(true);
    
    try {
      console.log('🔄 ResponseEditModal: Starting response update...', {
        projectId,
        formId: form.id,
        responseId: response.id,
        updateData: {
          data: updatedResponse.data,
          respondentEmail: updatedResponse.respondentEmail,
          isComplete: updatedResponse.isComplete
        }
      });

      // Call the API to update the response
      const result = await updateFormResponse(
        projectId,
        form.id,
        response.id,
        {
          data: updatedResponse.data,
          respondentEmail: updatedResponse.respondentEmail,
          isComplete: updatedResponse.isComplete
        }
      );

      console.log('✅ ResponseEditModal: Update successful!', result);

      if (result) {
        // Success message is already handled by FormContext
        onResponseUpdated(result);
        onClose();
      }
    } catch (error) {
      console.error('❌ ResponseEditModal: Update failed:', error);
      
      // Show error message
      toast({
        title: "Update Failed",
        description: error instanceof Error 
          ? error.message 
          : "Failed to update the form response. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <FormPreview
            form={form}
            editMode={true}
            existingResponse={response}
            onUpdate={handleUpdate}
            onBack={handleBack}
            isDialog={true}
            externalLoading={isUpdating}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}