import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Settings() {
  const { user } = useDashboard();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [orgName, setOrgName] = useState('ICS Organization');
  const [theme, setTheme] = useState('light');
  const [password, setPassword] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

  const isGlobalAdmin = user?.role === 'global-admin';

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" />
          <Button variant="default">Save Profile</Button>
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" />
          <Button variant="default">Change Password</Button>
        </CardContent>
      </Card>
      {isGlobalAdmin && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle>Organization Preferences</CardTitle>
              <CardDescription>Manage organization-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Organization name" />
              <label className="block text-sm font-medium mb-1">Logo</label>
              <Input type="file" onChange={e => setLogo(e.target.files ? e.target.files[0] : null)} />
              
              <Button variant="default">Save Organization Settings</Button>
            </CardContent>
          </Card>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle>System</CardTitle>
              <CardDescription>System-level actions and audit logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Export Data</Button>
              <Button variant="outline">View Audit Logs</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 