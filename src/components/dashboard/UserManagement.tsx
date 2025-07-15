import React, { useEffect, useState, useRef } from 'react';
import { getAllProjects } from '@/lib/icsData';
import { useDashboard } from '@/contexts/DashboardContext';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { User } from '@/types/dashboard';
import { mockUsers } from '@/lib/mockData';

const ROLES = [
  'global-admin',
  'country-admin',
  'project-admin',
  'branch-admin',
  'viewer',
];

type MultiSelectDropdownProps = {
  options: string[];
  selected: string[];
  setSelected: (val: string[]) => void;
  label: string;
  allLabel: string;
};

function MultiSelectDropdown({ options, selected, setSelected, label, allLabel }: MultiSelectDropdownProps) {
  const allSelected = selected.length === options.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected.length === 0 ? `Select ${label}` : selected.length === options.length ? allLabel : selected.join(', ')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={e => setSelected(e.target.checked ? [...options] : [])}
            />
            <span>{allLabel}</span>
          </label>
          {options.map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={e => {
                  if (e.target.checked) setSelected([...selected, opt]);
                  else setSelected(selected.filter((o: string) => o !== opt));
                }}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function UserManagement() {
  const { user } = useDashboard();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<User['role']>(ROLES[0] as User['role']);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  // Get all projects from data store
  const allProjects = getAllProjects(user);
  const projectOptions = allProjects.map(p => p.id);

  // Extract unique countries from projects
  const allCountries = Array.from(new Set(allProjects.map(p => p.name.toLowerCase())));

  // Aggregate all unique branches from all users
  const allBranches = Array.from(new Set(users.flatMap(u => u.accessibleBranches)));

  useEffect(() => {
    if (editUser) {
      setName(editUser.name);
      setEmail(editUser.email);
      setRole(editUser.role);
      setSelectedProjects(editUser.role === 'global-admin' ? [...projectOptions] : editUser.accessibleProjects || []);
      setSelectedCountries(editUser.role === 'global-admin' ? [...allCountries] : editUser.accessibleCountries || []);
      setSelectedBranches(editUser.role === 'global-admin' ? [...allBranches] : editUser.accessibleBranches || []);
    } else {
      setName('');
      setEmail('');
      setRole(ROLES[0] as User['role']);
      setSelectedProjects([]);
      setSelectedCountries([]);
      setSelectedBranches([]);
    }
  }, [editUser, allCountries, allBranches, projectOptions]);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  if (user.role !== 'global-admin') {
    return <div className="p-8 text-center text-lg text-muted-foreground">You do not have permission to access user management.</div>;
  }

  const handleAdd = () => {
    setEditUser(null);
    setDialogOpen(true);
  };
  const handleEdit = (u: User) => {
    setEditUser(u);
    setDialogOpen(true);
  };
  const handleDelete = (u: User) => {
    setUsers(users.filter(us => us.id !== u.id));
  };
  const handleDialogSave = () => {
    if (!name || !email || !role) return;
    const newUser = {
      id: editUser ? editUser.id : Date.now().toString(),
      name,
      email,
      role,
      accessibleProjects: role === 'global-admin' ? [...projectOptions] : selectedProjects,
      accessibleCountries: role === 'global-admin' ? [...allCountries] : selectedCountries,
      accessibleBranches: role === 'global-admin' ? [...allBranches] : selectedBranches,
      avatar: editUser?.avatar || '',
    };
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? newUser : u));
    } else {
      setUsers([newUser, ...users]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button className="gap-2" onClick={handleAdd}><Plus className="h-4 w-4" /> Add User</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell>Countries</TableCell>
              <TableCell>Branches</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: User) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Badge>{u.role}</Badge></TableCell>
                <TableCell className="max-w-[120px] truncate">{u.accessibleProjects?.length === projectOptions.length ? 'All Projects' : u.accessibleProjects?.join(', ')}</TableCell>
                <TableCell className="max-w-[120px] truncate">{u.accessibleCountries?.length === allCountries.length ? 'All Countries' : u.accessibleCountries?.join(', ')}</TableCell>
                <TableCell className="max-w-[120px] truncate">{u.accessibleBranches?.length === allBranches.length ? 'All Branches' : u.accessibleBranches?.join(', ')}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(u)}><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(u)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription>Fill in user details and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <select value={role} onChange={e => setRole(e.target.value as User['role'])} className="w-full border rounded p-2">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <MultiSelectDropdown options={projectOptions} selected={selectedProjects} setSelected={setSelectedProjects} label="Projects" allLabel="All Projects" />
            <MultiSelectDropdown options={allCountries} selected={selectedCountries} setSelected={setSelectedCountries} label="Countries" allLabel="All Countries" />
            <MultiSelectDropdown options={allBranches} selected={selectedBranches} setSelected={setSelectedBranches} label="Branches" allLabel="All Branches" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDialogSave}>{editUser ? 'Save' : 'Add'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 