import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, XMarkIcon, UserIcon, GlobeAltIcon, EyeIcon, EyeSlashIcon, CheckIcon, ShieldCheckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

import { Role, RoleAssignment } from '@/services/userManagementService';
import { useProjects } from '@/contexts/ProjectsContext';
import { useNotification } from '@/hooks/useNotification';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: any) => Promise<void>;
  roles: Role[];
}

export function CreateUserDialog({ open, onOpenChange, onSubmit, roles }: CreateUserDialogProps) {
  const { projects } = useProjects();
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time validation for confirm password
  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return { isValid: false, message: '', showSuccess: false };
    if (password !== confirmPassword) return { isValid: false, message: 'Passwords do not match', showSuccess: false };
    return { isValid: true, message: 'Passwords match', showSuccess: true };
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        roleAssignments: roleAssignments.length > 0 ? roleAssignments : undefined,
      });
      
      // Show success notification
      showSuccess(
        'User Created Successfully',
        `${formData.firstName} ${formData.lastName} has been created and can now access the system.`
      );
      
      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
      });
      setRoleAssignments([]);
      setErrors({});
      
      // Close dialog
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to create user:', error);
      
      // Show error notification
      showError(
        'Failed to Create User',
        error.message || 'An unexpected error occurred while creating the user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const addRoleAssignment = () => {
    setRoleAssignments([...roleAssignments, { roleId: '', projectId: '', country: '' }]);
  };

  const removeRoleAssignment = (index: number) => {
    setRoleAssignments(roleAssignments.filter((_, i) => i !== index));
  };

  const updateRoleAssignment = (index: number, field: keyof RoleAssignment, value: string) => {
    const updated = [...roleAssignments];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-populate country when project is selected
    if (field === 'projectId' && value && value !== 'none') {
      const selectedProject = projects.find(p => p.id === value);
      if (selectedProject) {
        updated[index].country = selectedProject.country;
      }
    } else if (field === 'projectId' && (value === 'none' || !value)) {
      // Clear country when no project is selected
      updated[index].country = '';
    }
    
    setRoleAssignments(updated);
  };

  const getRoleBadgeVariant = (level: number) => {
    if (level <= 2) return 'destructive';
    if (level <= 4) return 'default';
    return 'secondary';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account with appropriate roles and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleFormDataChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleFormDataChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormDataChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                  <Input
                    id="password"
                      type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                      onChange={(e) => handleFormDataChange('password', e.target.value)}
                      className={`${errors.password ? 'border-red-500' : ''} pr-10`}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                  <Input
                    id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                      onChange={(e) => handleFormDataChange('confirmPassword', e.target.value)}
                      className={`${
                        errors.confirmPassword 
                          ? 'border-red-500' 
                          : validateConfirmPassword(formData.password, formData.confirmPassword).isValid && formData.confirmPassword
                          ? 'border-green-500'
                          : ''
                      } pr-10`}
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => setShowConfirmPassword(v => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {(() => {
                    const validation = validateConfirmPassword(formData.password, formData.confirmPassword);
                    if (errors.confirmPassword) {
                      return <p className="text-sm text-red-500">{errors.confirmPassword}</p>;
                    }
                    if (validation.showSuccess) {
                      return (
                        <p className="text-sm text-green-500 flex items-center gap-1">
                          <CheckIcon className="h-3 w-3" />
                          {validation.message}
                        </p>
                      );
                    }
                    if (validation.message && !validation.isValid) {
                      return <p className="text-sm text-red-500">{validation.message}</p>;
                    }
                    return null;
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Role Assignments
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRoleAssignment}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {roleAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No roles assigned. Click "Add Role" to assign roles to this user.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {roleAssignments.map((assignment, index) => {
                    const selectedRole = roles.find(r => r.id === assignment.roleId);
                    return (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Role Assignment {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRoleAssignment(index)}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label>Role *</Label>
                          <Select
                            value={assignment.roleId}
                            onValueChange={(value) => updateRoleAssignment(index, 'roleId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={getRoleBadgeVariant(role.level)} className="text-xs">
                                      Level {role.level}
                                    </Badge>
                                    <span>{role.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedRole && (
                            <p className="text-sm text-muted-foreground">
                              {selectedRole.description}
                            </p>
                          )}
                        </div>

                        {selectedRole && selectedRole.level >= 4 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <BuildingOfficeIcon className="h-4 w-4" />
                                Project (Optional)
                              </Label>
                              <Select
                                value={assignment.projectId || 'none'}
                                onValueChange={(value) => updateRoleAssignment(index, 'projectId', value === 'none' ? '' : value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No project</SelectItem>
                                  {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                      <div className="flex items-center gap-2">
                                        <span>{project.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {project.country}
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {assignment.projectId && assignment.country && (
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <GlobeAltIcon className="h-4 w-4" />
                                  Country
                                </Label>
                                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                  <Badge variant="secondary">{assignment.country}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    (Auto-selected from project)
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
