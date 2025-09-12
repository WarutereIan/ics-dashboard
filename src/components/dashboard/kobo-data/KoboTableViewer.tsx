import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search, Download, RefreshCw } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import { KoboDataService, KoboTableData } from '@/services/koboDataService';

interface KoboTableViewerProps {
  projectId: string;
  tableId: string;
  tableName: string;
  displayName: string;
}

export function KoboTableViewer({ projectId, tableId, tableName, displayName }: KoboTableViewerProps) {
  const { showError } = useNotification();
  const [data, setData] = useState<KoboTableData | null>(null);
  const [loading, setLoading] = useState(false);
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
      showError(`Failed to load table data: ${error.message || 'Unknown error'}`);
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
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
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

