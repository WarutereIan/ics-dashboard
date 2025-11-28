import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search, Download, RefreshCw } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import { KoboDataService, KoboTableData } from '@/services/koboDataService';
import { useToast } from '@/hooks/use-toast';

interface KoboTableViewerProps {
  projectId: string;
  tableId: string;
  tableName: string;
  displayName: string;
}

export function KoboTableViewer({ projectId, tableId, tableName, displayName }: KoboTableViewerProps) {
  const { showError } = useNotification();
  const { toast } = useToast();
  const [data, setData] = useState<KoboTableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId, tableId, page]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log(`Loading data for table ${tableId} (${tableName})`);
      const response = await KoboDataService.getKoboTableData(projectId, tableId, page, limit);
      console.log('Data response:', response);
      setData(response.data);
    } catch (error) {
      console.error('Error loading table data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to load table data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.pagination.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const filteredData = data?.data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const getColumnHeaders = () => {
    if (!data?.data.length) return [];
    return Object.keys(data.data[0]);
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  const handleExportData = async () => {
    if (!data) return;

    try {
      setExporting(true);

      // Helper function to escape CSV values
      const escapeCsvValue = (value: any): string => {
        if (value === null || value === undefined) return '';
        
        const stringValue = String(value);
        // If value contains comma, newline, or quote, wrap in quotes and escape quotes
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      // Fetch all data pages
      const allData: any[] = [];
      const totalPages = data.pagination.totalPages;
      
      toast({
        title: "Exporting Data",
        description: `Fetching ${totalPages} page(s) of data...`,
      });

      // Fetch all pages
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const response = await KoboDataService.getKoboTableData(projectId, tableId, currentPage, limit);
        if (response.data?.data) {
          allData.push(...response.data.data);
        }
      }

      if (allData.length === 0) {
        toast({
          title: "Export Failed",
          description: "No data available to export",
          variant: "destructive",
        });
        return;
      }

      // Get column headers from the first row
      const headers = Object.keys(allData[0]);

      // Create CSV content
      const csvContent = [
        headers.map(escapeCsvValue).join(','),
        ...allData.map(row => {
          return headers.map(header => {
            const value = row[header];
            // Format the value for CSV
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value);
            if (typeof value === 'boolean') return value ? 'Yes' : 'No';
            return String(value);
          }).map(escapeCsvValue).join(',');
        })
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sanitizedDisplayName = displayName.replace(/[^a-z0-9]/gi, '_');
      a.download = `${sanitizedDisplayName}_${tableName}_export.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Exported ${allData.length} records to CSV`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to export data: ${errorMessage}`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading data...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
        <p className="text-xs text-gray-400 mt-2">Table: {tableName}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-sm text-gray-500">Table: {tableName}</p>
          </div>
          <Badge variant="outline">
            {data.pagination.total} total records
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            disabled={exporting || !data || data.pagination.total === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {getColumnHeaders().map((header) => (
                    <TableHead key={header} className="whitespace-nowrap">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={getColumnHeaders().length} className="text-center py-8">
                      {searchTerm ? 'No matching records found' : 'No data available'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, index) => (
                    <TableRow key={index}>
                      {getColumnHeaders().map((header) => (
                        <TableCell key={header} className="whitespace-nowrap max-w-xs truncate">
                          <span title={formatCellValue(row[header])}>
                            {formatCellValue(row[header])}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

