import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TagIcon } from '@heroicons/react/24/outline';

import { FORM_CATEGORIES, GROUPED_FORM_CATEGORIES } from '@/lib/constants/formCategories';

interface FormCategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showDescription?: boolean;
}

export function FormCategorySelect({
  value = '',
  onValueChange,
  placeholder = "Select a form category...",
  label = "Category",
  required = false,
  disabled = false,
  className = '',
  showDescription = true
}: FormCategorySelectProps) {
  const selectedCategory = FORM_CATEGORIES.find(cat => cat.value === value);

  // Handle value conversion: empty string becomes 'none', and vice versa
  const selectValue = value === '' ? 'none' : value;
  
  const handleValueChange = (newValue: string) => {
    const actualValue = newValue === 'none' ? '' : newValue;
    onValueChange(actualValue);
  };

  return (
    <div className={className}>
      <Label htmlFor="form-category" className="flex items-center gap-2">
        <TagIcon className="w-4 h-4" />
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Select value={selectValue} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <span className="text-muted-foreground">No category</span>
          </SelectItem>
          {Object.entries(GROUPED_FORM_CATEGORIES).map(([groupName, categoryValues]) => (
            <SelectGroup key={groupName}>
              <SelectLabel>{groupName}</SelectLabel>
              {categoryValues.map((categoryValue) => {
                const category = FORM_CATEGORIES.find(cat => cat.value === categoryValue);
                return category ? (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex flex-col">
                      <span>{category.label}</span>
                      {showDescription && (
                        <span className="text-xs text-muted-foreground">{category.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ) : null;
              })}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-gray-500 mt-1">
        Choose a category that best describes the purpose of this form
      </p>
      
      {selectedCategory && showDescription && (
        <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-emerald-900">
            {selectedCategory.label}
          </p>
          <p className="text-xs text-emerald-700">
            {selectedCategory.description}
          </p>
        </div>
      )}
    </div>
  );
}
