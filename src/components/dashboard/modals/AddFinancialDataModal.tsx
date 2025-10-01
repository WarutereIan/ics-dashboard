import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CurrencyDollarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Calculator, Loader2 } from 'lucide-react';

import { Activity } from '@/types/dashboard';
import { CreateActivityFinancialDataDto } from '@/lib/api/financialApi';

interface AddFinancialDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityFinancialDataDto) => Promise<void>;
  activity: Activity | null;
  year: number;
  isLoading?: boolean;
}

export function AddFinancialDataModal({
  isOpen,
  onClose,
  onSubmit,
  activity,
  year,
  isLoading = false
}: AddFinancialDataModalProps) {
  const [formData, setFormData] = useState<CreateActivityFinancialDataDto>({
    activityId: '',
    activityTitle: '',
    year: year,
    totalAnnualBudget: 0,
    q1Cost: 0,
    q2Cost: 0,
    q3Cost: 0,
    q4Cost: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or activity changes
  useEffect(() => {
    if (activity && isOpen) {
      setFormData({
        activityId: activity.id,
        activityTitle: activity.title,
        year: year,
        totalAnnualBudget: 0,
        q1Cost: 0,
        q2Cost: 0,
        q3Cost: 0,
        q4Cost: 0,
        notes: ''
      });
      setErrors({});
    }
  }, [activity, isOpen, year]);

  const handleInputChange = (field: keyof CreateActivityFinancialDataDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation function that updates errors state
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.activityTitle.trim()) {
      newErrors.activityTitle = 'Activity title is required';
    }

    if (!formData.totalAnnualBudget || formData.totalAnnualBudget <= 0) {
      newErrors.totalAnnualBudget = 'Total annual budget must be greater than 0';
    }

    const totalQuarterly = (formData.q1Cost || 0) + (formData.q2Cost || 0) + (formData.q3Cost || 0) + (formData.q4Cost || 0);
    if (formData.totalAnnualBudget && totalQuarterly > formData.totalAnnualBudget) {
      newErrors.quarterly = 'Sum of quarterly costs cannot exceed total annual budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation function for disabled state (doesn't update state)
  const isFormValid = useMemo((): boolean => {
    if (!formData.activityTitle.trim()) {
      return false;
    }

    if (!formData.totalAnnualBudget || formData.totalAnnualBudget <= 0) {
      return false;
    }

    const totalQuarterly = (formData.q1Cost || 0) + (formData.q2Cost || 0) + (formData.q3Cost || 0) + (formData.q4Cost || 0);
    if (totalQuarterly > formData.totalAnnualBudget) {
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting financial data:', error);
      setErrors({ submit: 'Failed to save financial data. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const totalQuarterly = (formData.q1Cost || 0) + (formData.q2Cost || 0) + (formData.q3Cost || 0) + (formData.q4Cost || 0);
  const remainingBudget = (formData.totalAnnualBudget || 0) - totalQuarterly;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            Add Financial Data for {activity?.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Info */}
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <h3 className="font-medium text-emerald-900">Activity Information</h3>
            </div>
            <p className="text-sm text-emerald-700">
              <strong>Activity:</strong> {activity?.title}
            </p>
            <p className="text-sm text-emerald-700">
              <strong>Year:</strong> {year}
            </p>
          </div>

          {/* Activity Title (editable for validation) */}
          <div className="space-y-2">
            <Label htmlFor="activityTitle">Activity Title *</Label>
            <Input
              id="activityTitle"
              value={formData.activityTitle}
              onChange={(e) => handleInputChange('activityTitle', e.target.value)}
              placeholder="Enter activity title"
              disabled={isSubmitting}
              className={errors.activityTitle ? 'border-red-500' : ''}
            />
            {errors.activityTitle && (
              <p className="text-sm text-emerald-600">{errors.activityTitle}</p>
            )}
          </div>

          {/* Total Annual Budget */}
          <div className="space-y-2">
            <Label htmlFor="totalBudget">Total Annual Budget * (USD)</Label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="totalBudget"
                type="number"
                value={formData.totalAnnualBudget}
                onChange={(e) => handleInputChange('totalAnnualBudget', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isSubmitting}
                className={`pl-10 ${errors.totalAnnualBudget ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.totalAnnualBudget && (
              <p className="text-sm text-emerald-600">{errors.totalAnnualBudget}</p>
            )}
          </div>

          {/* Quarterly Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Quarterly Budget Breakdown</Label>
              <span className="text-sm text-gray-500">(Optional)</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Q1 */}
              <div className="space-y-2">
                <Label htmlFor="q1Cost">Q1 Cost</Label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="q1Cost"
                    type="number"
                    value={formData.q1Cost}
                    onChange={(e) => handleInputChange('q1Cost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-2">
                <Label htmlFor="q2Cost">Q2 Cost</Label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="q2Cost"
                    type="number"
                    value={formData.q2Cost}
                    onChange={(e) => handleInputChange('q2Cost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-2">
                <Label htmlFor="q3Cost">Q3 Cost</Label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="q3Cost"
                    type="number"
                    value={formData.q3Cost}
                    onChange={(e) => handleInputChange('q3Cost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Q4 */}
              <div className="space-y-2">
                <Label htmlFor="q4Cost">Q4 Cost</Label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="q4Cost"
                    type="number"
                    value={formData.q4Cost}
                    onChange={(e) => handleInputChange('q4Cost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Quarterly Allocation:</span>
                <span className="font-medium">${totalQuarterly.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining Budget:</span>
                <span className={`font-medium ${remainingBudget < 0 ? 'text-emerald-600' : 'text-green-600'}`}>
                  ${remainingBudget.toFixed(2)}
                </span>
              </div>
              {remainingBudget < 0 && (
                <p className="text-xs text-emerald-600">
                  ⚠️ Quarterly allocation exceeds total budget
                </p>
              )}
            </div>

            {errors.quarterly && (
              <Alert variant="destructive">
                <ExclamationCircleIcon className="h-4 w-4" />
                <AlertDescription>{errors.quarterly}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about this financial data..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <Alert variant="destructive">
              <ExclamationCircleIcon className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Financial Data'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
