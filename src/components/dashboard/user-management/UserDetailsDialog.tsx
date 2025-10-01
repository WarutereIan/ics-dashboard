import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  CalendarIcon, 
  EnvelopeIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { User as UserType } from '@/services/userManagementService';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  if (!user) return null;

  const getRoleBadgeVariant = (level: number) => {
    if (level <= 2) return 'destructive';
    if (level <= 4) return 'default';
    return 'secondary';
  };

  const getAccessLevelBadge = (accessLevel: string) => {
    switch (accessLevel) {
      case 'admin': return <Badge variant="destructive">Admin</Badge>;
      case 'write': return <Badge variant="default">Write</Badge>;
      case 'read': return <Badge variant="secondary">Read</Badge>;
      default: return <Badge variant="outline">{accessLevel}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            User Details: {user.firstName} {user.lastName}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this user's account, roles, and permissions.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-emerald-600" />
                      )}
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Created: {formatDate(user.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Last updated: {formatDate(user.updatedAt)}
                      </span>
                    </div>

                    {user.lastLoginAt && (
                      <div className="flex items-center gap-2">
                        <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Last login: {formatDate(user.lastLoginAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">
                        {user.roles.length}
                      </div>
                      <div className="text-sm text-emerald-800">Roles Assigned</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {user.projectAccess.length}
                      </div>
                      <div className="text-sm text-green-800">Project Access</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Highest Role Level</h4>
                    {user.roles.length > 0 ? (
                      <Badge variant={getRoleBadgeVariant(Math.min(...user.roles.map(r => r.level)))}>
                        Level {Math.min(...user.roles.map(r => r.level))}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">No roles assigned</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Assigned Roles ({user.roles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.roles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No roles assigned to this user.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.roles.map((role) => (
                      <div key={role.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={getRoleBadgeVariant(role.level)}>
                              Level {role.level}
                            </Badge>
                            <h4 className="font-medium">{role.roleName}</h4>
                          </div>
                          <Badge variant={role.isActive ? 'default' : 'secondary'}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        {role.roleDescription && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {role.roleDescription}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {role.projectName && (
                            <div className="flex items-center gap-1">
                              <BuildingOfficeIcon className="h-3 w-3" />
                              <span>Project: {role.projectName}</span>
                            </div>
                          )}
                          {role.country && (
                            <div className="flex items-center gap-1">
                              <GlobeAltIcon className="h-3 w-3" />
                              <span>Country: {role.country}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  Project Access ({user.projectAccess.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.projectAccess.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No project access assigned to this user.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.projectAccess.map((access) => (
                      <div key={access.projectId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{access.projectName}</h4>
                          <div className="flex items-center gap-2">
                            {getAccessLevelBadge(access.accessLevel)}
                            <Badge variant={access.isActive ? 'default' : 'secondary'}>
                              {access.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Project ID: {access.projectId}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" />
                  Account Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Account Created</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last Updated</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>

                  {user.lastLoginAt ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last Login</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatDate(user.lastLoginAt)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last Login</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Never logged in
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
