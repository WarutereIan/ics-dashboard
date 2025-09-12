import { apiClient } from '@/lib/api/client';

export interface ProjectKoboTable {
  id: string;
  projectId: string;
  tableName: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  kpiMappings: KoboKpiMapping[];
}

export interface KoboKpiMapping {
  id: string;
  projectKoboTableId: string;
  kpiId: string;
  columnName: string;
  aggregationMethod: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'DISTINCT_COUNT';
  timeFilterField?: string;
  timeFilterValue?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  kpi: {
    id: string;
    name: string;
    unit?: string;
  };
  projectKoboTable: {
    id: string;
    tableName: string;
    displayName: string;
  };
}

export interface KoboTableData {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  tableInfo: {
    id: string;
    tableName: string;
    displayName: string;
    description?: string;
  };
}

export interface KpiCalculationResult {
  kpiId: string;
  kpiName: string;
  results: Array<{
    mappingId: string;
    columnName: string;
    aggregationMethod: string;
    value: number;
    tableName: string;
    error?: string;
  }>;
  calculatedAt: string;
}

export interface AvailableKoboTable {
  id: number;
  asset_uid: string;
  table_name: string;
  asset_name: string;
  project: string;
  created_at: string;
  updated_at: string;
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
  maxLength: number | null;
}

export interface TableStats {
  totalCount: number;
  hasData: boolean;
  tableName: string;
  error?: string;
}

export class KoboDataService {
  // Available Kobo Tables
  static async getAvailableKoboTables(projectId: string): Promise<{ data: AvailableKoboTable[] }> {
    const response = await apiClient.get<AvailableKoboTable[]>(`/projects/${projectId}/kobo-data/available-tables`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available Kobo tables');
    }
    return { data: response.data || [] };
  }

  // Project Kobo Table Management
  static async createProjectKoboTable(projectId: string, data: {
    tableName: string;
    displayName: string;
    description?: string;
    isActive?: boolean;
  }) {
    return apiClient.post(`/projects/${projectId}/kobo-data/tables`, data);
  }

  static async getProjectKoboTables(projectId: string): Promise<{ data: ProjectKoboTable[] }> {
    const response = await apiClient.get<ProjectKoboTable[]>(`/projects/${projectId}/kobo-data/tables`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch project Kobo tables');
    }
    return { data: response.data || [] };
  }

  static async getProjectKoboTable(projectId: string, tableId: string): Promise<{ data: ProjectKoboTable }> {
    const response = await apiClient.get<ProjectKoboTable>(`/projects/${projectId}/kobo-data/tables/${tableId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch project Kobo table');
    }
    if (!response.data) {
      throw new Error('Project Kobo table not found');
    }
    return { data: response.data };
  }

  static async updateProjectKoboTable(
    projectId: string, 
    tableId: string, 
    data: Partial<{
      displayName: string;
      description: string;
      isActive: boolean;
    }>
  ) {
    return apiClient.put(`/projects/${projectId}/kobo-data/tables/${tableId}`, data);
  }

  static async deleteProjectKoboTable(projectId: string, tableId: string) {
    return apiClient.delete(`/projects/${projectId}/kobo-data/tables/${tableId}`);
  }

  // Kobo KPI Mapping Management
  static async createKoboKpiMapping(projectId: string, data: {
    projectKoboTableId: string;
    kpiId: string;
    columnName: string;
    aggregationMethod: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'DISTINCT_COUNT';
    timeFilterField?: string;
    timeFilterValue?: number;
    isActive?: boolean;
  }) {
    return apiClient.post(`/projects/${projectId}/kobo-data/kpi-mappings`, data);
  }

  static async getKoboKpiMappings(projectId: string, tableId?: string): Promise<{ data: KoboKpiMapping[] }> {
    const url = tableId 
      ? `/projects/${projectId}/kobo-data/kpi-mappings?tableId=${tableId}`
      : `/projects/${projectId}/kobo-data/kpi-mappings`;
    const response = await apiClient.get<KoboKpiMapping[]>(url);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch Kobo KPI mappings');
    }
    return { data: response.data || [] };
  }

  static async updateKoboKpiMapping(
    projectId: string, 
    mappingId: string, 
    data: Partial<{
      columnName: string;
      aggregationMethod: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'DISTINCT_COUNT';
      timeFilterField: string;
      timeFilterValue: number;
      isActive: boolean;
    }>
  ) {
    return apiClient.put(`/projects/${projectId}/kobo-data/kpi-mappings/${mappingId}`, data);
  }

  static async deleteKoboKpiMapping(projectId: string, mappingId: string) {
    return apiClient.delete(`/projects/${projectId}/kobo-data/kpi-mappings/${mappingId}`);
  }

  // Get table columns
  static async getTableColumns(projectId: string, tableId: string): Promise<{ data: TableColumn[] }> {
    const response = await apiClient.get<TableColumn[]>(`/projects/${projectId}/kobo-data/tables/${tableId}/columns`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch table columns');
    }
    return { data: response.data || [] };
  }

  // Get table statistics
  static async getTableStats(projectId: string, tableId: string): Promise<{ data: TableStats }> {
    const response = await apiClient.get<TableStats>(`/projects/${projectId}/kobo-data/tables/${tableId}/stats`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch table stats');
    }
    if (!response.data) {
      throw new Error('Table stats not found');
    }
    return { data: response.data };
  }

  // Kobo Data Fetching
  static async getKoboTableData(
    projectId: string, 
    tableId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<{ data: KoboTableData }> {
    const response = await apiClient.get<KoboTableData>(`/projects/${projectId}/kobo-data/tables/${tableId}/data?page=${page}&limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch table data');
    }
    if (!response.data) {
      throw new Error('Table data not found');
    }
    return { data: response.data };
  }

  // KPI Calculation
  static async calculateKpiFromKoboData(projectId: string, kpiId: string): Promise<{ data: KpiCalculationResult }> {
    const response = await apiClient.get<KpiCalculationResult>(`/projects/${projectId}/kobo-data/kpis/${kpiId}/calculate`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to calculate KPI');
    }
    if (!response.data) {
      throw new Error('KPI calculation result not found');
    }
    return { data: response.data };
  }
}

