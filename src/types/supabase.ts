/*
  Auto-generated Supabase types. Source: Supabase MCP generate_typescript_types.
  Do not edit by hand; re-generate when the database schema changes.
*/

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          budget: number
          createdAt: string
          createdBy: string
          description: string | null
          endDate: string | null
          id: string
          outcomeId: string
          progress: number
          projectId: string
          responsible: string | null
          spent: number
          startDate: string | null
          status: Database["public"]["Enums"]["ActivityStatus"]
          title: string
          updatedAt: string
          updatedBy: string
        }
        Insert: {
          budget?: number
          createdAt?: string
          createdBy: string
          description?: string | null
          endDate?: string | null
          id: string
          outcomeId: string
          progress?: number
          projectId: string
          responsible?: string | null
          spent?: number
          startDate?: string | null
          status?: Database["public"]["Enums"]["ActivityStatus"]
          title: string
          updatedAt: string
          updatedBy: string
        }
        Update: {
          budget?: number
          createdAt?: string
          createdBy?: string
          description?: string | null
          endDate?: string | null
          id?: string
          outcomeId?: string
          progress?: number
          projectId?: string
          responsible?: string | null
          spent?: number
          startDate?: string | null
          status?: Database["public"]["Enums"]["ActivityStatus"]
          title?: string
          updatedAt?: string
          updatedBy?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_outcomeId_fkey"
            columns: ["outcomeId"]
            isOneToOne: false
            referencedRelation: "outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      /*
        Truncated: The full generated types are quite large.
        For complete definitions, re-run Supabase types generation and replace this file.
      */
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ActivityStatus:
        | "PLANNING"
        | "ACTIVE"
        | "COMPLETED"
        | "ON_HOLD"
        | "NOT_STARTED"
        | "IN_PROGRESS"
      ProjectStatus: "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD"
      FormStatus: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED"
      KPIFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY"
      OutcomeStatus:
        | "PLANNING"
        | "ACTIVE"
        | "COMPLETED"
        | "ON_HOLD"
        | "ON_TRACK"
        | "AT_RISK"
        | "BEHIND"
      OutputStatus: "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD"
      PermissionRole: "VIEWER" | "EDITOR" | "ADMIN"
      ReportCategory:
        | "MONTHLY"
        | "QUARTERLY"
        | "ANNUAL"
        | "SPECIAL"
        | "FINANCIAL"
        | "TECHNICAL"
        | "WEEKLY"
        | "BIMONTHLY"
        | "BI_ANNUAL"
        | "ADHOC"
      ReportFrequency:
        | "WEEKLY"
        | "BIMONTHLY"
        | "MONTHLY"
        | "QUARTERLY"
        | "BI_ANNUAL"
        | "ANNUAL"
        | "ADHOC"
      ReportPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
      ReportStatus: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED"
      ReportType:
        | "QUARTERLY"
        | "ANNUAL"
        | "MONTHLY"
        | "ADHOC"
        | "PROGRESS"
        | "FINANCIAL"
      ReviewAction: "APPROVE" | "REJECT" | "REQUEST_CHANGES" | "SKIP"
      StrategicPriority: "HIGH" | "MEDIUM" | "LOW"
      SubActivityPriority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      SubActivityStatus:
        | "NOT_STARTED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "ON_HOLD"
        | "CANCELLED"
      WorkflowStatus:
        | "PENDING"
        | "IN_REVIEW"
        | "APPROVED"
        | "REJECTED"
        | "CHANGES_REQUESTED"
        | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never


