import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Users,
  Calendar
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/dashboard/form-creation-wizard/types';

interface FormExportModalProps {
  forms: Form[];
  projectId: string;
  trigger?: React.ReactNode;
}

interface ExportForm extends Form {
  selected: boolean;
}

export function FormExportModal({ forms, projectId, trigger }: FormExportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportForms, setExportForms] = useState<ExportForm[]>(() => 
    forms.map(form => ({ ...form, selected: false }))
  );

  // Update exportForms when forms prop changes
  useEffect(() => {
    console.log('📋 FormExportModal: Forms prop changed:', forms.length, 'forms');
    console.log('📋 Available forms:', forms.map(f => ({ title: f.title, sections: f.sections?.length || 0 })));
    setExportForms(forms.map(form => ({ ...form, selected: false })));
  }, [forms]);

  const selectedCount = exportForms.filter(form => form.selected).length;

  const handleSelectAll = (checked: boolean) => {
    setExportForms(prev => prev.map(form => ({ ...form, selected: checked })));
  };

  const handleSelectForm = (formId: string, checked: boolean) => {
    setExportForms(prev => prev.map(form => 
      form.id === formId ? { ...form, selected: checked } : form
    ));
  };

  const prepareFormForExport = (form: Form) => {
    console.log('🔍 prepareFormForExport called for form:', form.title);
    
    // Remove server-generated fields and keep only the essential form structure
    const {
      id,
      projectId: _projectId,
      createdBy,
      createdAt,
      updatedAt,
      version,
      responseCount,
      lastResponseAt,
      ...exportData
    } = form;

    console.log('🔍 Form sections count:', exportData.sections?.length || 0);

    // Debug: Log choice question options before export
    if (exportData.sections) {
      exportData.sections.forEach((section: any, sectionIndex: number) => {
        console.log(`🔍 Processing section ${sectionIndex}:`, section.title, 'Questions:', section.questions?.length || 0);
        
        section.questions?.forEach((question: any, questionIndex: number) => {
          console.log(`🔍 Question ${questionIndex}:`, question.title, 'Type:', question.type);
          
          // Check if it's a choice question
          if (question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') {
            console.log(`🎯 Found choice question: ${question.title}`);
            console.log(`🎯 Full question object:`, question);
            
            // Check for options in multiple possible locations
            const options = question.options || question.config?.options || [];
            console.log(`🎯 Question has options:`, !!question.options);
            console.log(`🎯 Question has config.options:`, !!question.config?.options);
            console.log(`🎯 Final options array:`, options);
            console.log(`🎯 Options length:`, options?.length || 0);
            
            if (options && options.length > 0) {
              console.log(`📤 Export - Section ${sectionIndex}, Question ${questionIndex} (${question.title}):`, {
                type: question.type,
                optionsCount: options.length,
                options: options.map((opt: any) => ({
                  id: opt.id,
                  label: opt.label,
                  value: opt.value
                }))
              });
            } else {
              console.log(`⚠️ Choice question "${question.title}" has no options or empty options array`);
            }
          }
        });
      });
    } else {
      console.log('🔍 No sections found in form');
    }

    return {
      ...exportData,
      // Add metadata for reference
      _exportMetadata: {
        originalId: id,
        exportedAt: new Date().toISOString(),
        version: version,
        responseCount: responseCount
      }
    };
  };

  const handleExport = async () => {
    console.log('🚀 handleExport called, selectedCount:', selectedCount);
    
    if (selectedCount === 0) {
      toast({
        title: "No Forms Selected",
        description: "Please select at least one form to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const selectedForms = exportForms.filter(form => form.selected);
      console.log('🚀 Selected forms for export:', selectedForms.length, selectedForms.map(f => f.title));
      
      const exportData = selectedForms.map(prepareFormForExport);
      console.log('🚀 Export data prepared:', exportData.length, 'forms');

      // Create filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `forms-export-${projectId}-${timestamp}.json`;

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${selectedCount} form(s) exported successfully.`,
      });

      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export forms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      setExportForms(forms.map(form => ({ ...form, selected: false })));
      setIsOpen(false);
    }
  };

  const getStatusColor = (status: Form['status']) => {
    switch (status) {
      case 'PUBLISHED': return 'default';
      case 'DRAFT': return 'secondary';
      case 'CLOSED': return 'destructive';
      case 'ARCHIVED': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Forms
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Forms to JSON</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Export Information:</strong>
              <ul className="mt-2 text-sm space-y-1">
                <li>• Forms will be exported as a JSON array</li>
                <li>• Server-generated fields (ID, timestamps, etc.) will be excluded</li>
                <li>• Original form metadata will be preserved in _exportMetadata</li>
                <li>• <strong>When imported, all IDs will be regenerated</strong> to avoid conflicts</li>
                <li>• File will be named: forms-export-{projectId}-{new Date().toISOString().split('T')[0]}.json</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Selection Controls */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedCount === forms.length && forms.length > 0}
                onCheckedChange={handleSelectAll}
                disabled={isExporting}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({forms.length} forms)
              </label>
            </div>
            <div className="text-sm text-gray-600">
              {selectedCount} of {forms.length} selected
            </div>
          </div>

          {/* Forms List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {exportForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={form.id}
                  checked={form.selected}
                  onCheckedChange={(checked) => handleSelectForm(form.id, checked as boolean)}
                  disabled={isExporting}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{form.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(form.status)} className="text-xs">
                        {form.status}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        {form.responseCount}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{form.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {form.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {form.tags.length > 3 && (
                        <span className="text-xs">+{form.tags.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {forms.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No forms available for export</p>
              <p className="text-sm text-gray-500">Create some forms first to export them.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={selectedCount === 0 || isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {selectedCount} Form{selectedCount !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
