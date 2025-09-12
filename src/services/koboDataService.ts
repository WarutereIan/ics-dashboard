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
    return apiClient.get(`/projects/${projectId}/kobo-data/available-tables`);
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
    return apiClient.get(`/projects/${projectId}/kobo-data/tables`);
  }

  static async getProjectKoboTable(projectId: string, tableId: string): Promise<{ data: ProjectKoboTable }> {
    return apiClient.get(`/projects/${projectId}/kobo-data/tables/${tableId}`);
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
    return apiClient.get(url);
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
    return apiClient.get(`/projects/${projectId}/kobo-data/tables/${tableId}/columns`);
  }

  // Get table statistics
  static async getTableStats(projectId: string, tableId: string): Promise<{ data: TableStats }> {
    return apiClient.get(`/projects/${projectId}/kobo-data/tables/${tableId}/stats`);
  }

  // Kobo Data Fetching
  static async getKoboTableData(
    projectId: string, 
    tableId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<{ data: KoboTableData }> {
    return apiClient.get(`/projects/${projectId}/kobo-data/tables/${tableId}/data?page=${page}&limit=${limit}`);
  }

  // KPI Calculation
  static async calculateKpiFromKoboData(projectId: string, kpiId: string): Promise<{ data: KpiCalculationResult }> {
    return apiClient.get(`/projects/${projectId}/kobo-data/kpis/${kpiId}/calculate`);
  }
}

