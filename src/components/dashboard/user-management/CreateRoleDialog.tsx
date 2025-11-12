import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, Key } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission, userManagementService } from '@/services/userManagementService';
import { permissionsService } from '@/services/permissionsService';

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateRoleDialog({ open, onOpenChange, onCreated }: CreateRoleDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 6,
    isActive: true,
  });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoadingPermissions(true);
      try {
        const perms = await permissionsService.getAllPermissions();
        setPermissions(perms);
      } catch (e) {
        console.error('Failed to load permissions', e);
      } finally {
        setLoadingPermissions(false);
      }
    };
    load();
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required';
    if (formData.level < 1 || formData.level > 6) newErrors.level = 'Level must be between 1 and 6';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]);
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) acc[permission.resource] = [];
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await userManagementService.createRole({
        ...formData,
        permissions: selectedPermissions,
      });
      onOpenChange(false);
      onCreated();
    } catch (err) {
      console.error('Failed to create role:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Create Role
          </DialogTitle>
          <DialogDescription>
            Define a new role and assign permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
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
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} placeholder="Enter role name" />
                    {errors.name && (<p className="text-sm text-red-500">{errors.name}</p>)}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter role description" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select value={formData.level.toString()} onValueChange={(value) => setFormData({ ...formData, level: parseInt(value) })}>
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
                      {errors.level && (<p className="text-sm text-red-500">{errors.level}</p>)}
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
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
                    <Key className="h-5 w-5" />
                    Role Permissions
                  </CardTitle>
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
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {resourcePermissions.map((permission) => (
                              <div key={permission.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedPermissions.includes(permission.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              }`} onClick={() => togglePermission(permission.id)}>
                                <div className="flex items-center">
                                  <input type="checkbox" checked={selectedPermissions.includes(permission.id)} onChange={() => togglePermission(permission.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                </div>
                                <Badge variant="secondary" className="text-xs">{permission.scope}</Badge>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{permission.action}</div>
                                  <div className="text-xs text-muted-foreground">{permission.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Role'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


