export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      demo_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          action_taken: string | null
          alert_type: string
          created_at: string
          demo_id: string
          escalated_to: string[] | null
          id: string
          is_active: boolean | null
          message: string
          requires_action: boolean | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type: string
          created_at?: string
          demo_id: string
          escalated_to?: string[] | null
          id?: string
          is_active?: boolean | null
          message: string
          requires_action?: boolean | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type?: string
          created_at?: string
          demo_id?: string
          escalated_to?: string[] | null
          id?: string
          is_active?: boolean | null
          message?: string
          requires_action?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_alerts_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_clicks: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          converted: boolean | null
          country: string | null
          demo_id: string
          device_type: string | null
          franchise_id: string | null
          id: string
          ip_address: string | null
          referrer: string | null
          region: string | null
          reseller_id: string | null
          session_duration: number | null
          user_id: string | null
          user_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          converted?: boolean | null
          country?: string | null
          demo_id: string
          device_type?: string | null
          franchise_id?: string | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          region?: string | null
          reseller_id?: string | null
          session_duration?: number | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          converted?: boolean | null
          country?: string | null
          demo_id?: string
          device_type?: string | null
          franchise_id?: string | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          region?: string | null
          reseller_id?: string | null
          session_duration?: number | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_clicks_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_health: {
        Row: {
          checked_at: string
          demo_id: string
          error_message: string | null
          id: string
          response_time: number | null
          status: Database["public"]["Enums"]["demo_status"]
        }
        Insert: {
          checked_at?: string
          demo_id: string
          error_message?: string | null
          id?: string
          response_time?: number | null
          status: Database["public"]["Enums"]["demo_status"]
        }
        Update: {
          checked_at?: string
          demo_id?: string
          error_message?: string | null
          id?: string
          response_time?: number | null
          status?: Database["public"]["Enums"]["demo_status"]
        }
        Relationships: [
          {
            foreignKeyName: "demo_health_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demos: {
        Row: {
          backup_url: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          health_check_interval: number | null
          id: string
          last_health_check: string | null
          masked_url: string | null
          max_concurrent_logins: number | null
          multi_login_enabled: boolean | null
          status: Database["public"]["Enums"]["demo_status"]
          tech_stack: Database["public"]["Enums"]["demo_tech_stack"]
          title: string
          updated_at: string
          uptime_percentage: number | null
          url: string
        }
        Insert: {
          backup_url?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          health_check_interval?: number | null
          id?: string
          last_health_check?: string | null
          masked_url?: string | null
          max_concurrent_logins?: number | null
          multi_login_enabled?: boolean | null
          status?: Database["public"]["Enums"]["demo_status"]
          tech_stack?: Database["public"]["Enums"]["demo_tech_stack"]
          title: string
          updated_at?: string
          uptime_percentage?: number | null
          url: string
        }
        Update: {
          backup_url?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          health_check_interval?: number | null
          id?: string
          last_health_check?: string | null
          masked_url?: string | null
          max_concurrent_logins?: number | null
          multi_login_enabled?: boolean | null
          status?: Database["public"]["Enums"]["demo_status"]
          tech_stack?: Database["public"]["Enums"]["demo_tech_stack"]
          title?: string
          updated_at?: string
          uptime_percentage?: number | null
          url?: string
        }
        Relationships: []
      }
      lead_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          action_taken: string | null
          alert_type: string
          auto_escalate_at: string | null
          created_at: string
          id: string
          is_active: boolean | null
          lead_id: string
          message: string
          requires_action: boolean | null
          severity: string | null
          target_roles: Database["public"]["Enums"]["app_role"][] | null
          target_users: string[] | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type: string
          auto_escalate_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lead_id: string
          message: string
          requires_action?: boolean | null
          severity?: string | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          target_users?: string[] | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type?: string
          auto_escalate_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lead_id?: string
          message?: string
          requires_action?: boolean | null
          severity?: string | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          target_users?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_alerts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_assignments: {
        Row: {
          accepted_at: string | null
          assigned_by: string
          assigned_role: Database["public"]["Enums"]["app_role"]
          assigned_to: string
          assignment_score: number | null
          auto_assigned: boolean | null
          created_at: string
          id: string
          is_active: boolean | null
          lead_id: string
          reason: string | null
          rejected_at: string | null
          rejection_reason: string | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_by: string
          assigned_role: Database["public"]["Enums"]["app_role"]
          assigned_to: string
          assignment_score?: number | null
          auto_assigned?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lead_id: string
          reason?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
        }
        Update: {
          accepted_at?: string | null
          assigned_by?: string
          assigned_role?: Database["public"]["Enums"]["app_role"]
          assigned_to?: string
          assignment_score?: number | null
          auto_assigned?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lead_id?: string
          reason?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_escalations: {
        Row: {
          auto_escalated: boolean | null
          created_at: string
          escalated_from: string | null
          escalated_to: string | null
          escalated_to_role: Database["public"]["Enums"]["app_role"] | null
          escalation_level: number | null
          id: string
          idle_minutes: number | null
          is_resolved: boolean | null
          lead_id: string
          reason: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          auto_escalated?: boolean | null
          created_at?: string
          escalated_from?: string | null
          escalated_to?: string | null
          escalated_to_role?: Database["public"]["Enums"]["app_role"] | null
          escalation_level?: number | null
          id?: string
          idle_minutes?: number | null
          is_resolved?: boolean | null
          lead_id: string
          reason: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          auto_escalated?: boolean | null
          created_at?: string
          escalated_from?: string | null
          escalated_to?: string | null
          escalated_to_role?: Database["public"]["Enums"]["app_role"] | null
          escalation_level?: number | null
          id?: string
          idle_minutes?: number | null
          is_resolved?: boolean | null
          lead_id?: string
          reason?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_escalations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_follow_ups: {
        Row: {
          ai_suggested_message: string | null
          assigned_to: string
          completed_at: string | null
          created_at: string
          follow_up_type: string
          id: string
          is_completed: boolean | null
          lead_id: string
          notes: string | null
          outcome: string | null
          reminder_sent: boolean | null
          scheduled_at: string
        }
        Insert: {
          ai_suggested_message?: string | null
          assigned_to: string
          completed_at?: string | null
          created_at?: string
          follow_up_type: string
          id?: string
          is_completed?: boolean | null
          lead_id: string
          notes?: string | null
          outcome?: string | null
          reminder_sent?: boolean | null
          scheduled_at: string
        }
        Update: {
          ai_suggested_message?: string | null
          assigned_to?: string
          completed_at?: string | null
          created_at?: string
          follow_up_type?: string
          id?: string
          is_completed?: boolean | null
          lead_id?: string
          notes?: string | null
          outcome?: string | null
          reminder_sent?: boolean | null
          scheduled_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_logs: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          id: string
          lead_id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          performed_by: string | null
          performer_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          performed_by?: string | null
          performer_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          performed_by?: string | null
          performer_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scores: {
        Row: {
          confidence: number | null
          created_at: string
          factors: Json | null
          id: string
          lead_id: string
          model_version: string | null
          score: number
          score_type: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          factors?: Json | null
          id?: string
          lead_id: string
          model_version?: string | null
          score: number
          score_type: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          factors?: Json | null
          id?: string
          lead_id?: string
          model_version?: string | null
          score?: number
          score_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_scores_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          campaign_id: string | null
          conversion_rate: number | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          reference_id: string | null
          referrer_name: string | null
          referrer_role: Database["public"]["Enums"]["app_role"] | null
          total_leads: number | null
          type: Database["public"]["Enums"]["lead_source_type"]
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          campaign_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          reference_id?: string | null
          referrer_name?: string | null
          referrer_role?: Database["public"]["Enums"]["app_role"] | null
          total_leads?: number | null
          type: Database["public"]["Enums"]["lead_source_type"]
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          campaign_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          reference_id?: string | null
          referrer_name?: string | null
          referrer_role?: Database["public"]["Enums"]["app_role"] | null
          total_leads?: number | null
          type?: Database["public"]["Enums"]["lead_source_type"]
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_score: number | null
          assigned_at: string | null
          assigned_role: Database["public"]["Enums"]["app_role"] | null
          assigned_to: string | null
          budget_range: string | null
          city: string | null
          closed_at: string | null
          closed_reason: string | null
          company: string | null
          conversion_probability: number | null
          country: string | null
          created_at: string
          created_by: string | null
          duplicate_of: string | null
          email: string
          id: string
          industry: Database["public"]["Enums"]["lead_industry"] | null
          is_duplicate: boolean | null
          last_contact_at: string | null
          masked_email: string | null
          masked_phone: string | null
          name: string
          next_follow_up: string | null
          phone: string
          priority: Database["public"]["Enums"]["lead_priority"] | null
          region: string | null
          requirements: string | null
          source: Database["public"]["Enums"]["lead_source_type"]
          source_reference_id: string | null
          status: Database["public"]["Enums"]["lead_status_type"]
          updated_at: string
        }
        Insert: {
          ai_score?: number | null
          assigned_at?: string | null
          assigned_role?: Database["public"]["Enums"]["app_role"] | null
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          closed_at?: string | null
          closed_reason?: string | null
          company?: string | null
          conversion_probability?: number | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          duplicate_of?: string | null
          email: string
          id?: string
          industry?: Database["public"]["Enums"]["lead_industry"] | null
          is_duplicate?: boolean | null
          last_contact_at?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          name: string
          next_follow_up?: string | null
          phone: string
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          region?: string | null
          requirements?: string | null
          source?: Database["public"]["Enums"]["lead_source_type"]
          source_reference_id?: string | null
          status?: Database["public"]["Enums"]["lead_status_type"]
          updated_at?: string
        }
        Update: {
          ai_score?: number | null
          assigned_at?: string | null
          assigned_role?: Database["public"]["Enums"]["app_role"] | null
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          closed_at?: string | null
          closed_reason?: string | null
          company?: string | null
          conversion_probability?: number | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          duplicate_of?: string | null
          email?: string
          id?: string
          industry?: Database["public"]["Enums"]["lead_industry"] | null
          is_duplicate?: boolean | null
          last_contact_at?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          name?: string
          next_follow_up?: string | null
          phone?: string
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          region?: string | null
          requirements?: string | null
          source?: Database["public"]["Enums"]["lead_source_type"]
          source_reference_id?: string | null
          status?: Database["public"]["Enums"]["lead_status_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_assign: {
        Row: {
          assigned_by: string
          assigned_to: string
          assignee_role: Database["public"]["Enums"]["app_role"]
          created_at: string
          demo_id: string
          end_date: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          start_date: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          assignee_role: Database["public"]["Enums"]["app_role"]
          created_at?: string
          demo_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          start_date?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          assignee_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          demo_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_assign_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      uptime_logs: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string
          demo_id: string
          event_message: string
          event_type: string
          id: string
          metadata: Json | null
          severity: string | null
          triggered_by: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          demo_id: string
          event_message: string
          event_type: string
          id?: string
          metadata?: Json | null
          severity?: string | null
          triggered_by?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          demo_id?: string
          event_message?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          severity?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uptime_logs_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_demos: { Args: { _user_id: string }; Returns: boolean }
      can_manage_demos: { Args: { _user_id: string }; Returns: boolean }
      can_manage_leads: { Args: { _user_id: string }; Returns: boolean }
      can_view_leads: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "demo_manager"
        | "franchise"
        | "reseller"
        | "client"
        | "prime"
        | "developer"
      demo_status: "active" | "inactive" | "maintenance" | "down"
      demo_tech_stack:
        | "php"
        | "node"
        | "java"
        | "python"
        | "react"
        | "angular"
        | "vue"
        | "other"
      lead_industry:
        | "retail"
        | "healthcare"
        | "finance"
        | "education"
        | "real_estate"
        | "manufacturing"
        | "hospitality"
        | "logistics"
        | "technology"
        | "other"
      lead_priority: "hot" | "warm" | "cold"
      lead_source_type:
        | "website"
        | "demo"
        | "influencer"
        | "reseller"
        | "referral"
        | "social"
        | "direct"
        | "other"
      lead_status_type:
        | "new"
        | "assigned"
        | "contacted"
        | "follow_up"
        | "qualified"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "demo_manager",
        "franchise",
        "reseller",
        "client",
        "prime",
        "developer",
      ],
      demo_status: ["active", "inactive", "maintenance", "down"],
      demo_tech_stack: [
        "php",
        "node",
        "java",
        "python",
        "react",
        "angular",
        "vue",
        "other",
      ],
      lead_industry: [
        "retail",
        "healthcare",
        "finance",
        "education",
        "real_estate",
        "manufacturing",
        "hospitality",
        "logistics",
        "technology",
        "other",
      ],
      lead_priority: ["hot", "warm", "cold"],
      lead_source_type: [
        "website",
        "demo",
        "influencer",
        "reseller",
        "referral",
        "social",
        "direct",
        "other",
      ],
      lead_status_type: [
        "new",
        "assigned",
        "contacted",
        "follow_up",
        "qualified",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
    },
  },
} as const
