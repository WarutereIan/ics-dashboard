import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

import { KoboDataService, AvailableKoboTable } from '@/services/koboDataService';
import { useNotification } from '@/hooks/useNotification';

interface AssignKoboTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (data: {
    tableName: string;
    displayName: string;
    description?: string;
    isActive?: boolean;
  }) => void;
  projectId: string;
}

export function AssignKoboTableDialog({ open, onOpenChange, onAssign, projectId }: AssignKoboTableDialogProps) {
  const [selectedTable, setSelectedTable] = useState<AvailableKoboTable | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [availableTables, setAvailableTables] = useState<AvailableKoboTable[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useNotification();

  // Fetch available tables when dialog opens
  useEffect(() => {
    if (open && projectId) {
      fetchAvailableTables();
    }
  }, [open, projectId]);

  const fetchAvailableTables = async () => {
    setLoading(true);
    try {
      const response = await KoboDataService.getAvailableKoboTables(projectId);
      setAvailableTables(response.data);
    } catch (error) {
      console.error('Failed to fetch available tables:', error);
      showError('Failed to load available Kobo tables');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTable || !displayName.trim()) {
      return;
    }

    onAssign({
      tableName: selectedTable.table_name,
      displayName: displayName.trim(),
      description: description.trim() || undefined,
      isActive,
    });

    // Reset form
    setSelectedTable(null);
    setDisplayName('');
    setDescription('');
    setIsActive(true);
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setSelectedTable(null);
    setDisplayName('');
    setDescription('');
    setIsActive(true);
  };

  const handleTableSelect = (tableId: string) => {
    const table = availableTables.find(t => t.id.toString() === tableId);
    setSelectedTable(table || null);
    // Auto-populate display name with asset name if not already set
    if (table && !displayName.trim()) {
      setDisplayName(table.asset_name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CircleStackIcon className="h-5 w-5 mr-2" />
            Assign Kobo Table
          </DialogTitle>
          <DialogDescription>
            Assign a Kobo form table to this project for data viewing and KPI mapping
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tableSelect">Select Kobo Table *</Label>
            <Select value={selectedTable?.id.toString() || ''} onValueChange={handleTableSelect} disabled={loading}>
              <SelectTrigger className="min-h-[2.5rem]">
                <SelectValue placeholder={loading ? "Loading tables..." : "Choose a Kobo table"} />
              </SelectTrigger>
              <SelectContent className="max-w-[600px]">
                {availableTables.length === 0 && !loading ? (
                  <SelectItem value="no-tables" disabled>
                    No available tables found
                  </SelectItem>
                ) : (
                  availableTables.map((table) => (
                    <SelectItem key={table.id} value={table.id.toString()} className="py-3">
                      <div className="flex flex-col w-full min-w-0">
                        <span className="font-medium text-sm leading-tight break-words">{table.asset_name}</span>
                        <span className="text-xs text-gray-500 mt-1 font-mono break-all">{table.table_name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Select from available Kobo tables imported to your database
            </p>
            {selectedTable && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs space-y-2">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Table Name:</p>
                  <p className="font-mono text-gray-600 break-all">{selectedTable.table_name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Asset UID:</p>
                  <p className="font-mono text-gray-600 break-all">{selectedTable.asset_uid}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Project:</p>
                  <p className="text-gray-600">{selectedTable.project}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Community Survey 2024"
              className="min-h-[2.5rem]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              A user-friendly name for this table (you can edit the auto-filled name)
            </p>
            {displayName.length > 50 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Long display names may be truncated in some views
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this table's purpose..."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Describe what this table contains or its purpose
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active</Label>
            <p className="text-xs text-gray-500">
              Active tables are visible to users and can be used for KPI mappings
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedTable || !displayName.trim() || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Assign Table'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

