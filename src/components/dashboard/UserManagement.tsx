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
  const { user, projects } = useDashboard();
  if (!user) return null;
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  // New: modalUser state for editing/adding
  const [modalUser, setModalUser] = useState<User | null>(null);

  // Get all projects from data store (for project selector)
  const allProjectsForSelector = user ? getAllProjects(user) : [];
  const projectOptions = allProjectsForSelector.map(p => p.id);

  // Extract unique countries from accessible projects
  const allCountriesRaw = Array.from(new Set(projects
    .filter(p => user.role === 'global-admin' || user.accessibleProjects.includes(p.id))
    .map((p: typeof projects[number]) => (typeof p.country === 'string' ? p.country.toLowerCase() : ''))
    .filter((c: string) => !!c)
  ));
  const allCountries = allCountriesRaw.map((c: string) => c.charAt(0).toUpperCase() + c.slice(1));

  // Aggregate all unique branches from all users
  const allBranches = Array.from(new Set(users.flatMap(u => u.accessibleBranches)));

  useEffect(() => {
    if (editUser) {
      // Deep copy user for editing
      setModalUser({ ...editUser });
    } else if (dialogOpen) {
      // New user template
      setModalUser({
        id: Date.now().toString(),
        name: '',
        email: '',
        role: ROLES[0] as User['role'],
        accessibleProjects: [],
        accessibleCountries: [],
        accessibleBranches: [],
        avatar: '',
      });
    } else {
      setModalUser(null);
    }
  }, [editUser, dialogOpen]);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  if (user && user.role !== 'global-admin') {
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
    if (!modalUser || !modalUser.name || !modalUser.email || !modalUser.role) return;
    // Set all for global-admin
    const updatedUser = {
      ...modalUser,
      accessibleProjects: modalUser.role === 'global-admin' ? [...projectOptions] : modalUser.accessibleProjects,
      accessibleCountries: modalUser.role === 'global-admin' ? [...allCountries] : modalUser.accessibleCountries,
      accessibleBranches: modalUser.role === 'global-admin' ? [...allBranches] : modalUser.accessibleBranches,
    };
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? updatedUser : u));
    } else {
      setUsers([updatedUser, ...users]);
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
          {modalUser && (
            <div className="space-y-4">
              <Input value={modalUser.name} onChange={e => setModalUser({ ...modalUser, name: e.target.value })} placeholder="Name" />
              <Input value={modalUser.email} onChange={e => setModalUser({ ...modalUser, email: e.target.value })} placeholder="Email" />
              <select value={modalUser.role} onChange={e => setModalUser({ ...modalUser, role: e.target.value as User['role'] })} className="w-full border rounded p-2">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <MultiSelectDropdown options={projectOptions} selected={modalUser.accessibleProjects} setSelected={val => setModalUser({ ...modalUser, accessibleProjects: val })} label="Projects" allLabel="All Projects" />
              <MultiSelectDropdown options={allCountries} selected={modalUser.accessibleCountries} setSelected={val => setModalUser({ ...modalUser, accessibleCountries: val })} label="Countries" allLabel="All Countries" />
              <MultiSelectDropdown options={allBranches} selected={modalUser.accessibleBranches} setSelected={val => setModalUser({ ...modalUser, accessibleBranches: val })} label="Branches" allLabel="All Branches" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleDialogSave}>{editUser ? 'Save' : 'Add'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 