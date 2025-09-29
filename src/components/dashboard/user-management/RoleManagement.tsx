import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search,
  Filter,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Role, Permission, userManagementService } from '@/services/userManagementService';
import { EditRoleDialog } from './EditRoleDialog';
import { useNotifications } from '@/contexts/NotificationContext';

interface RoleManagementProps {
  roles: Role[];
  onRolesChange: () => void;
}

export function RoleManagement({ roles, onRolesChange }: RoleManagementProps) {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | '1-2' | '3-4' | '5-6'>('all');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load permissions when component mounts
  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      // This would be an API call to get all permissions
      // For now, we'll use mock data based on the seeded permissions
      const mockPermissions: Permission[] = [
        // User Management
        { id: '1', name: 'users:create', description: 'Create users', resource: 'users', action: 'create', scope: 'global', isActive: true },
        { id: '2', name: 'users:read', description: 'Read users', resource: 'users', action: 'read', scope: 'global', isActive: true },
        { id: '3', name: 'users:update', description: 'Update users', resource: 'users', action: 'update', scope: 'global', isActive: true },
        { id: '4', name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete', scope: 'global', isActive: true },
        { id: '5', name: 'users:read-own', description: 'Read own user data', resource: 'users', action: 'read', scope: 'own', isActive: true },
        { id: '6', name: 'users:update-own', description: 'Update own user data', resource: 'users', action: 'update', scope: 'own', isActive: true },
        { id: '7', name: 'users:create-project', description: 'Create users within project scope', resource: 'users', action: 'create', scope: 'project', isActive: true },
        { id: '8', name: 'users:read-project', description: 'Read users within project scope', resource: 'users', action: 'read', scope: 'project', isActive: true },
        { id: '9', name: 'users:update-project', description: 'Update users within project scope', resource: 'users', action: 'update', scope: 'project', isActive: true },
        { id: '10', name: 'users:delete-project', description: 'Delete users within project scope', resource: 'users', action: 'delete', scope: 'project', isActive: true },

        // Project Management
        { id: '11', name: 'projects:create', description: 'Create projects', resource: 'projects', action: 'create', scope: 'global', isActive: true },
        { id: '12', name: 'projects:read', description: 'Read projects', resource: 'projects', action: 'read', scope: 'global', isActive: true },
        { id: '13', name: 'projects:update', description: 'Update projects', resource: 'projects', action: 'update', scope: 'global', isActive: true },
        { id: '14', name: 'projects:delete', description: 'Delete projects', resource: 'projects', action: 'delete', scope: 'global', isActive: true },
        { id: '15', name: 'projects:read-regional', description: 'Read regional projects', resource: 'projects', action: 'read', scope: 'regional', isActive: true },
        { id: '16', name: 'projects:update-regional', description: 'Update regional projects', resource: 'projects', action: 'update', scope: 'regional', isActive: true },
        { id: '17', name: 'projects:read-project', description: 'Read project data', resource: 'projects', action: 'read', scope: 'project', isActive: true },
        { id: '18', name: 'projects:update-project', description: 'Update project data', resource: 'projects', action: 'update', scope: 'project', isActive: true },

        // Finance Management
        { id: '19', name: 'finance:read', description: 'Read finance data', resource: 'finance', action: 'read', scope: 'global', isActive: true },
        { id: '20', name: 'finance:update', description: 'Update finance data', resource: 'finance', action: 'update', scope: 'global', isActive: true },
        { id: '21', name: 'finance:read-regional', description: 'Read regional finance data', resource: 'finance', action: 'read', scope: 'regional', isActive: true },
        { id: '22', name: 'finance:update-regional', description: 'Update regional finance data', resource: 'finance', action: 'update', scope: 'regional', isActive: true },
        { id: '23', name: 'finance:read-project', description: 'Read project finance data', resource: 'finance', action: 'read', scope: 'project', isActive: true },
        { id: '24', name: 'finance:update-project', description: 'Update project finance data', resource: 'finance', action: 'update', scope: 'project', isActive: true },

        // KPI Management
        { id: '25', name: 'kpis:read', description: 'Read KPIs', resource: 'kpis', action: 'read', scope: 'global', isActive: true },
        { id: '26', name: 'kpis:update', description: 'Update KPIs', resource: 'kpis', action: 'update', scope: 'global', isActive: true },
        { id: '27', name: 'kpis:read-regional', description: 'Read regional KPIs', resource: 'kpis', action: 'read', scope: 'regional', isActive: true },
        { id: '28', name: 'kpis:update-regional', description: 'Update regional KPIs', resource: 'kpis', action: 'update', scope: 'regional', isActive: true },
        { id: '29', name: 'kpis:read-project', description: 'Read project KPIs', resource: 'kpis', action: 'read', scope: 'project', isActive: true },
        { id: '30', name: 'kpis:update-project', description: 'Update project KPIs', resource: 'kpis', action: 'update', scope: 'project', isActive: true },

        // Reports Management
        { id: '31', name: 'reports:create', description: 'Create reports', resource: 'reports', action: 'create', scope: 'global', isActive: true },
        { id: '32', name: 'reports:read', description: 'Read reports', resource: 'reports', action: 'read', scope: 'global', isActive: true },
        { id: '33', name: 'reports:update', description: 'Update reports', resource: 'reports', action: 'update', scope: 'global', isActive: true },
        { id: '34', name: 'reports:delete', description: 'Delete reports', resource: 'reports', action: 'delete', scope: 'global', isActive: true },
        { id: '35', name: 'reports:read-regional', description: 'Read regional reports', resource: 'reports', action: 'read', scope: 'regional', isActive: true },
        { id: '36', name: 'reports:create-regional', description: 'Create regional reports', resource: 'reports', action: 'create', scope: 'regional', isActive: true },
        { id: '37', name: 'reports:read-project', description: 'Read project reports', resource: 'reports', action: 'read', scope: 'project', isActive: true },
        { id: '38', name: 'reports:create-project', description: 'Create project reports', resource: 'reports', action: 'create', scope: 'project', isActive: true },
        { id: '39', name: 'reports:update-project', description: 'Update project reports', resource: 'reports', action: 'update', scope: 'project', isActive: true },
        { id: '40', name: 'reports:delete-project', description: 'Delete project reports', resource: 'reports', action: 'delete', scope: 'project', isActive: true },

        // Analytics
        { id: '41', name: 'analytics:read', description: 'Read analytics', resource: 'analytics', action: 'read', scope: 'global', isActive: true },
        { id: '42', name: 'analytics:read-regional', description: 'Read regional analytics', resource: 'analytics', action: 'read', scope: 'regional', isActive: true },
        { id: '43', name: 'analytics:read-project', description: 'Read project analytics', resource: 'analytics', action: 'read', scope: 'project', isActive: true },
      ];
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesLevel = true;
    if (levelFilter !== 'all') {
      const [min, max] = levelFilter.split('-').map(Number);
      matchesLevel = role.level >= min && role.level <= max;
    }
    
    return matchesSearch && matchesLevel;
  });

  const getRoleBadgeVariant = (level: number) => {
    if (level <= 2) return 'destructive';
    if (level <= 4) return 'default';
    return 'secondary';
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

  const handleViewRoleDetails = (role: Role) => {
    setSelectedRole(role);
    setDetailsDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  const handleUpdateRole = async (roleId: string, roleData: any) => {
    try {
      await userManagementService.updateRole(roleId, roleData);
      setEditDialogOpen(false);
      setSelectedRole(null);
      onRolesChange(); // Refresh the roles list
    } catch (error: any) {
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
      try {
        await userManagementService.deleteRole(role.id);
        addNotification({
          type: 'success',
          title: 'Role Deleted',
          message: `Role "${role.name}" has been deleted successfully.`,
          duration: 3000
        });
        onRolesChange(); // Refresh the roles list
      } catch (error: any) {
        addNotification({
          type: 'error',
          title: 'Delete Failed',
          message: error.message || 'Failed to delete role. Please try again.',
          duration: 5000
        });
      }
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Roles & Permissions
          </h2>
          <p className="text-muted-foreground">
            Manage system roles and their associated permissions
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={(value: any) => setLevelFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1-2">Level 1-2 (Admin)</SelectItem>
                <SelectItem value="3-4">Level 3-4 (Regional)</SelectItem>
                <SelectItem value="5-6">Level 5-6 (Project)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Roles ({filteredRoles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="font-medium">{role.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(role.level)}>
                      Level {role.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {role.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? 'default' : 'secondary'}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewRoleDetails(role)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                       {/*  <DropdownMenuItem onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem 
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Role
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Details: {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this role and its permissions.
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="space-y-6">
              {/* Role Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Role Name</Label>
                      <p className="text-sm">{selectedRole.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Level</Label>
                      <div className="mt-1">
                        <Badge variant={getRoleBadgeVariant(selectedRole.level)}>
                          Level {selectedRole.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRole.description || 'No description provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge variant={selectedRole.isActive ? 'default' : 'secondary'}>
                        {selectedRole.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions by Resource */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                      <div key={resource} className="space-y-3">
                        <h4 className="font-medium capitalize">{resource} Management</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {resourcePermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2 p-2 border rounded-lg">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      {/* <EditRoleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        role={selectedRole}
        permissions={permissions}
        onSubmit={handleUpdateRole}
      /> */}
    </div>
  );
}
