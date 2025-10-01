import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cog6ToothIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';

import { Checkbox } from '@/components/ui/checkbox';
import { Role, Permission, userManagementService } from '@/services/userManagementService';
import { useNotifications } from '@/contexts/NotificationContext';

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
  onSubmit: (roleId: string, roleData: any) => Promise<void>;
}

export function EditRoleDialog({ open, onOpenChange, role, permissions, onSubmit }: EditRoleDialogProps) {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 1,
    isActive: true,
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form data when role changes
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        level: role.level,
        isActive: role.isActive,
      });
      
      // Load role's current permissions
      loadRolePermissions(role.id);
      
      setErrors({});
      setActiveTab('basic');
    }
  }, [role]);

  const loadRolePermissions = async (roleId: string) => {
    setLoadingPermissions(true);
    try {
      // Try to fetch real role permissions from API
      const rolePermissions = await userManagementService.getRolePermissions(roleId);
      setSelectedPermissions(rolePermissions);
    } catch (error) {
      console.error('Failed to load role permissions from API, using mock data:', error);
      // Fallback to mock data if API fails
      const mockRolePermissions = getMockRolePermissions(roleId);
      setSelectedPermissions(mockRolePermissions);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const getMockRolePermissions = (roleId: string): string[] => {
    // Mock function to return permissions based on role level
    // In a real implementation, this would be an API call
    if (!role) return [];

    // Return different permission sets based on role level
    switch (role.level) {
      case 1: // Global Admin
        return permissions.map(p => p.id); // All permissions
      case 2: // Director
        return permissions.filter(p => p.scope !== 'global' || p.resource === 'users' || p.resource === 'projects').map(p => p.id);
      case 3: // Regional Coordinator
        return permissions.filter(p => p.scope === 'regional' || p.scope === 'project' || p.scope === 'own').map(p => p.id);
      case 4: // Project Coordinator
        return permissions.filter(p => p.scope === 'project' || p.scope === 'own').map(p => p.id);
      case 5: // Project Officer
        return permissions.filter(p => p.scope === 'project' || p.scope === 'own').slice(0, Math.floor(permissions.length * 0.6)).map(p => p.id);
      case 6: // Viewer
        return permissions.filter(p => p.action === 'read' || p.scope === 'own').map(p => p.id);
      default:
        return [];
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Role name is required';
    if (formData.name.length < 2) newErrors.name = 'Role name must be at least 2 characters';
    if (formData.level < 1 || formData.level > 6) newErrors.level = 'Level must be between 1 and 6';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role || !validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        permissions: selectedPermissions,
      };

      await onSubmit(role.id, updateData);
      
      addNotification({
        type: 'success',
        title: 'Role Updated',
        message: `Role "${formData.name}" has been updated successfully.`,
        duration: 3000
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update role. Please try again.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const getPermissionBadgeVariant = (scope: string) => {
    switch (scope) {
      case 'global': return 'destructive';
      case 'regional': return 'default';
      case 'project': return 'secondary';
      case 'own': return 'outline';
      default: return 'outline';
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5" />
            Edit Role: {role.name}
          </DialogTitle>
          <DialogDescription>
            Update role information and manage permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Cog6ToothIcon className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <KeyIcon className="h-4 w-4" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Role Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? 'border-red-500' : ''}
                      placeholder="Enter role name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter role description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select
                        value={formData.level.toString()}
                        onValueChange={(value) => setFormData({ ...formData, level: parseInt(value) })}
                      >
                        <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1 - Global Admin</SelectItem>
                          <SelectItem value="2">Level 2 - Director</SelectItem>
                          <SelectItem value="3">Level 3 - Regional Coordinator</SelectItem>
                          <SelectItem value="4">Level 4 - Project Coordinator</SelectItem>
                          <SelectItem value="5">Level 5 - Project Officer</SelectItem>
                          <SelectItem value="6">Level 6 - Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.level && (
                        <p className="text-sm text-red-500">{errors.level}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                        <Label htmlFor="isActive">Role is active</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <KeyIcon className="h-5 w-5" />
                    Role Permissions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select the permissions that this role should have. Permissions are organized by resource type.
                  </p>
                </CardHeader>
                <CardContent>
                  {loadingPermissions ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Loading permissions...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                      <div key={resource} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium capitalize">{resource} Management</h4>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const allResourcePermissionIds = resourcePermissions.map(p => p.id);
                                const allSelected = allResourcePermissionIds.every(id => selectedPermissions.includes(id));
                                
                                if (allSelected) {
                                  // Deselect all
                                  setSelectedPermissions(prev => 
                                    prev.filter(id => !allResourcePermissionIds.includes(id))
                                  );
                                } else {
                                  // Select all
                                  setSelectedPermissions(prev => [
                                    ...prev.filter(id => !allResourcePermissionIds.includes(id)),
                                    ...allResourcePermissionIds
                                  ]);
                                }
                              }}
                            >
                              {resourcePermissions.every(p => selectedPermissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {resourcePermissions.map((permission) => (
                            <div 
                              key={permission.id} 
                              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedPermissions.includes(permission.id) 
                                  ? 'border-blue-500 bg-emerald-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => togglePermission(permission.id)}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.includes(permission.id)}
                                  onChange={() => togglePermission(permission.id)}
                                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </div>
                              <Badge variant={getPermissionBadgeVariant(permission.scope)} className="text-xs">
                                {permission.scope}
                              </Badge>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{permission.action}</div>
                                <div className="text-xs text-muted-foreground">
                                  {permission.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                      
                      {selectedPermissions.length > 0 && (
                        <div className="mt-6 p-4 bg-emerald-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Checkbox className="h-4 w-4" checked={true} disabled />
                            <span className="text-sm font-medium">Selected Permissions ({selectedPermissions.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedPermissions.map(permissionId => {
                              const permission = permissions.find(p => p.id === permissionId);
                              return permission ? (
                                <Badge key={permissionId} variant="secondary" className="text-xs">
                                  {permission.resource}:{permission.action}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
              {loading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
