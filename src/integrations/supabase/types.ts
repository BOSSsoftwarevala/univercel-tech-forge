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
      access_lists: {
        Row: {
          added_by: string | null
          created_at: string | null
          entry_type: string
          entry_value: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          list_type: string
          metadata: Json | null
          reason: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          entry_type: string
          entry_value: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          list_type: string
          metadata?: Json | null
          reason?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          entry_type?: string
          entry_value?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          list_type?: string
          metadata?: Json | null
          reason?: string | null
        }
        Relationships: []
      }
      accessibility_compliance: {
        Row: {
          alt_text_pass: boolean | null
          auditor_notes: string | null
          color_contrast_pass: boolean | null
          created_at: string | null
          id: string
          issues_found: number | null
          issues_resolved: number | null
          keyboard_nav_pass: boolean | null
          language_support: string[] | null
          last_audit_date: string | null
          page_url: string
          screen_reader_pass: boolean | null
          status: string | null
          wcag_level: string | null
        }
        Insert: {
          alt_text_pass?: boolean | null
          auditor_notes?: string | null
          color_contrast_pass?: boolean | null
          created_at?: string | null
          id?: string
          issues_found?: number | null
          issues_resolved?: number | null
          keyboard_nav_pass?: boolean | null
          language_support?: string[] | null
          last_audit_date?: string | null
          page_url: string
          screen_reader_pass?: boolean | null
          status?: string | null
          wcag_level?: string | null
        }
        Update: {
          alt_text_pass?: boolean | null
          auditor_notes?: string | null
          color_contrast_pass?: boolean | null
          created_at?: string | null
          id?: string
          issues_found?: number | null
          issues_resolved?: number | null
          keyboard_nav_pass?: boolean | null
          language_support?: string[] | null
          last_audit_date?: string | null
          page_url?: string
          screen_reader_pass?: boolean | null
          status?: string | null
          wcag_level?: string | null
        }
        Relationships: []
      }
      account_suspensions: {
        Row: {
          appeal_submitted: boolean | null
          appeal_submitted_at: string | null
          appeal_text: string | null
          auto_triggered: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          lifted_at: string | null
          lifted_by: string | null
          masked_reason: string | null
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string | null
          suspended_at: string | null
          suspension_type: string
          trigger_alert_id: string | null
          user_id: string
        }
        Insert: {
          appeal_submitted?: boolean | null
          appeal_submitted_at?: string | null
          appeal_text?: string | null
          auto_triggered?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          lifted_at?: string | null
          lifted_by?: string | null
          masked_reason?: string | null
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          suspended_at?: string | null
          suspension_type: string
          trigger_alert_id?: string | null
          user_id: string
        }
        Update: {
          appeal_submitted?: boolean | null
          appeal_submitted_at?: string | null
          appeal_text?: string | null
          auto_triggered?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          lifted_at?: string | null
          lifted_by?: string | null
          masked_reason?: string | null
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          suspended_at?: string | null
          suspension_type?: string
          trigger_alert_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      action_approval_queue: {
        Row: {
          action_data: Json
          action_target: string
          action_type: string
          ai_risk_assessment: Json | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          auto_approve_eligible: boolean | null
          created_at: string | null
          device_fingerprint: string | null
          device_trusted: boolean | null
          email_link_expires_at: string | null
          email_link_sent_at: string | null
          email_link_token: string | null
          email_verified: boolean | null
          expires_at: string | null
          id: string
          ip_address: string | null
          otp_required: boolean | null
          otp_verification_id: string | null
          otp_verified: boolean | null
          password_verified: boolean | null
          password_verified_at: string | null
          priority: string | null
          rejection_reason: string | null
          risk_score: number | null
          updated_at: string | null
          user_id: string
          user_role: string
        }
        Insert: {
          action_data?: Json
          action_target: string
          action_type: string
          ai_risk_assessment?: Json | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          auto_approve_eligible?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          device_trusted?: boolean | null
          email_link_expires_at?: string | null
          email_link_sent_at?: string | null
          email_link_token?: string | null
          email_verified?: boolean | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          otp_required?: boolean | null
          otp_verification_id?: string | null
          otp_verified?: boolean | null
          password_verified?: boolean | null
          password_verified_at?: string | null
          priority?: string | null
          rejection_reason?: string | null
          risk_score?: number | null
          updated_at?: string | null
          user_id: string
          user_role: string
        }
        Update: {
          action_data?: Json
          action_target?: string
          action_type?: string
          ai_risk_assessment?: Json | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          auto_approve_eligible?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          device_trusted?: boolean | null
          email_link_expires_at?: string | null
          email_link_sent_at?: string | null
          email_link_token?: string | null
          email_verified?: boolean | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          otp_required?: boolean | null
          otp_verification_id?: string | null
          otp_verified?: boolean | null
          password_verified?: boolean | null
          password_verified_at?: string | null
          priority?: string | null
          rejection_reason?: string | null
          risk_score?: number | null
          updated_at?: string | null
          user_id?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_approval_queue_otp_verification_id_fkey"
            columns: ["otp_verification_id"]
            isOneToOne: false
            referencedRelation: "otp_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      action_logs: {
        Row: {
          action_result: string
          action_type: string
          button_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          module_name: string
          response_time_ms: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_result: string
          action_type: string
          button_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module_name: string
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_result?: string
          action_type?: string
          button_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module_name?: string
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action_type: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          role: string | null
          severity_level: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          role?: string | null
          severity_level?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          role?: string | null
          severity_level?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_scope_history: {
        Row: {
          admin_id: string
          change_reason: string | null
          changed_at: string | null
          changed_by_super_admin_id: string | null
          id: string
          new_scope: Json
          old_scope: Json | null
        }
        Insert: {
          admin_id: string
          change_reason?: string | null
          changed_at?: string | null
          changed_by_super_admin_id?: string | null
          id?: string
          new_scope: Json
          old_scope?: Json | null
        }
        Update: {
          admin_id?: string
          change_reason?: string | null
          changed_at?: string | null
          changed_by_super_admin_id?: string | null
          id?: string
          new_scope?: Json
          old_scope?: Json | null
        }
        Relationships: []
      }
      admins: {
        Row: {
          assigned_scope: Json | null
          created_at: string | null
          created_by_super_admin_id: string | null
          id: string
          permissions_list: Json | null
          scope_type: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_scope?: Json | null
          created_at?: string | null
          created_by_super_admin_id?: string | null
          id?: string
          permissions_list?: Json | null
          scope_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_scope?: Json | null
          created_at?: string | null
          created_by_super_admin_id?: string | null
          id?: string
          permissions_list?: Json | null
          scope_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_billing_qr_codes: {
        Row: {
          base_cost_total: number
          created_at: string
          data_payload: Json
          expires_at: string
          final_cost_total: number
          id: string
          is_valid: boolean | null
          last_refreshed_at: string | null
          management_fee_total: number
          period_end: string | null
          period_start: string | null
          qr_code: string
          qr_type: string
          statement_id: string | null
          usage_id: string | null
        }
        Insert: {
          base_cost_total: number
          created_at?: string
          data_payload: Json
          expires_at?: string
          final_cost_total: number
          id?: string
          is_valid?: boolean | null
          last_refreshed_at?: string | null
          management_fee_total: number
          period_end?: string | null
          period_start?: string | null
          qr_code: string
          qr_type?: string
          statement_id?: string | null
          usage_id?: string | null
        }
        Update: {
          base_cost_total?: number
          created_at?: string
          data_payload?: Json
          expires_at?: string
          final_cost_total?: number
          id?: string
          is_valid?: boolean | null
          last_refreshed_at?: string | null
          management_fee_total?: number
          period_end?: string | null
          period_start?: string | null
          qr_code?: string
          qr_type?: string
          statement_id?: string | null
          usage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_billing_qr_codes_usage_id_fkey"
            columns: ["usage_id"]
            isOneToOne: false
            referencedRelation: "ai_usage_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_billing_statements: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          period_type: string
          processed_at: string | null
          qr_code_id: string | null
          statement_number: string
          status: string | null
          total_base_cost: number
          total_final_cost: number
          total_management_fee: number
          total_requests: number | null
          total_tokens: number | null
          usage_breakdown: Json | null
          wallet_transaction_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          period_type?: string
          processed_at?: string | null
          qr_code_id?: string | null
          statement_number?: string
          status?: string | null
          total_base_cost?: number
          total_final_cost?: number
          total_management_fee?: number
          total_requests?: number | null
          total_tokens?: number | null
          usage_breakdown?: Json | null
          wallet_transaction_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          processed_at?: string | null
          qr_code_id?: string | null
          statement_number?: string
          status?: string | null
          total_base_cost?: number
          total_final_cost?: number
          total_management_fee?: number
          total_requests?: number | null
          total_tokens?: number | null
          usage_breakdown?: Json | null
          wallet_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_billing_statements_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "ai_billing_qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_efficiency_scores: {
        Row: {
          avg_cost_per_request: number | null
          comparison_to_market: number | null
          created_at: string
          efficiency_score: number | null
          id: string
          module: Database["public"]["Enums"]["ai_module"]
          period_end: string
          period_start: string
          total_cost: number | null
          total_requests: number | null
        }
        Insert: {
          avg_cost_per_request?: number | null
          comparison_to_market?: number | null
          created_at?: string
          efficiency_score?: number | null
          id?: string
          module: Database["public"]["Enums"]["ai_module"]
          period_end: string
          period_start: string
          total_cost?: number | null
          total_requests?: number | null
        }
        Update: {
          avg_cost_per_request?: number | null
          comparison_to_market?: number | null
          created_at?: string
          efficiency_score?: number | null
          id?: string
          module?: Database["public"]["Enums"]["ai_module"]
          period_end?: string
          period_start?: string
          total_cost?: number | null
          total_requests?: number | null
        }
        Relationships: []
      }
      ai_fraud_detection: {
        Row: {
          created_at: string
          details: Json | null
          detection_type: string
          id: string
          is_resolved: boolean | null
          related_qr_id: string | null
          related_usage_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          detection_type: string
          id?: string
          is_resolved?: boolean | null
          related_qr_id?: string | null
          related_usage_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          detection_type?: string
          id?: string
          is_resolved?: boolean | null
          related_qr_id?: string | null
          related_usage_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_fraud_detection_related_qr_id_fkey"
            columns: ["related_qr_id"]
            isOneToOne: false
            referencedRelation: "ai_billing_qr_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_fraud_detection_related_usage_id_fkey"
            columns: ["related_usage_id"]
            isOneToOne: false
            referencedRelation: "ai_usage_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          is_acknowledged: boolean | null
          issue_detected: string
          related_role: Database["public"]["Enums"]["app_role"] | null
          scope: string | null
          scope_value: string | null
          suggested_action: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_acknowledged?: boolean | null
          issue_detected: string
          related_role?: Database["public"]["Enums"]["app_role"] | null
          scope?: string | null
          scope_value?: string | null
          suggested_action?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_acknowledged?: boolean | null
          issue_detected?: string
          related_role?: Database["public"]["Enums"]["app_role"] | null
          scope?: string | null
          scope_value?: string | null
          suggested_action?: string | null
        }
        Relationships: []
      }
      ai_job_steps: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_ms: number | null
          id: string
          input_data: Json | null
          job_id: string | null
          output_data: Json | null
          status: string
          step_number: number
          step_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          input_data?: Json | null
          job_id?: string | null
          output_data?: Json | null
          status?: string
          step_number: number
          step_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          input_data?: Json | null
          job_id?: string | null
          output_data?: Json | null
          status?: string
          step_number?: number
          step_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_job_steps_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "ai_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_jobs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          completed_at: string | null
          confidence_score: number | null
          created_at: string | null
          error_message: string | null
          human_approved: boolean | null
          id: string
          input_data: Json | null
          job_type: string
          output_data: Json | null
          source_button_id: string | null
          source_module: string
          status: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          error_message?: string | null
          human_approved?: boolean | null
          id?: string
          input_data?: Json | null
          job_type: string
          output_data?: Json | null
          source_button_id?: string | null
          source_module: string
          status?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          error_message?: string | null
          human_approved?: boolean | null
          id?: string
          input_data?: Json | null
          job_type?: string
          output_data?: Json | null
          source_button_id?: string | null
          source_module?: string
          status?: string
        }
        Relationships: []
      }
      ai_observation_logs: {
        Row: {
          action_id: string | null
          action_taken: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          module_name: string
          observation_data: Json | null
          observation_type: string
          result: string | null
          user_id: string | null
        }
        Insert: {
          action_id?: string | null
          action_taken?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          module_name: string
          observation_data?: Json | null
          observation_type: string
          result?: string | null
          user_id?: string | null
        }
        Update: {
          action_id?: string | null
          action_taken?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          module_name?: string
          observation_data?: Json | null
          observation_type?: string
          result?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_qr_scan_logs: {
        Row: {
          alert_reason: string | null
          alert_triggered: boolean | null
          created_at: string
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          is_duplicate: boolean | null
          is_valid_scan: boolean | null
          qr_code_id: string | null
          scan_type: string | null
          scanned_by: string
          scanner_role: Database["public"]["Enums"]["app_role"]
          user_agent: string | null
          watermark_applied: boolean | null
        }
        Insert: {
          alert_reason?: string | null
          alert_triggered?: boolean | null
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          is_duplicate?: boolean | null
          is_valid_scan?: boolean | null
          qr_code_id?: string | null
          scan_type?: string | null
          scanned_by: string
          scanner_role: Database["public"]["Enums"]["app_role"]
          user_agent?: string | null
          watermark_applied?: boolean | null
        }
        Update: {
          alert_reason?: string | null
          alert_triggered?: boolean | null
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          is_duplicate?: boolean | null
          is_valid_scan?: boolean | null
          qr_code_id?: string | null
          scan_type?: string | null
          scanned_by?: string
          scanner_role?: Database["public"]["Enums"]["app_role"]
          user_agent?: string | null
          watermark_applied?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_qr_scan_logs_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "ai_billing_qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          base_cost: number
          created_at: string
          final_cost: number | null
          id: string
          is_billed: boolean | null
          management_fee: number | null
          management_fee_percent: number
          module: Database["public"]["Enums"]["ai_module"]
          processed_at: string | null
          provider: Database["public"]["Enums"]["ai_provider"]
          purpose: string | null
          qr_code_id: string | null
          request_count: number | null
          tokens_used: number | null
          usage_id: string
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
          wallet_transaction_id: string | null
        }
        Insert: {
          base_cost?: number
          created_at?: string
          final_cost?: number | null
          id?: string
          is_billed?: boolean | null
          management_fee?: number | null
          management_fee_percent?: number
          module: Database["public"]["Enums"]["ai_module"]
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["ai_provider"]
          purpose?: string | null
          qr_code_id?: string | null
          request_count?: number | null
          tokens_used?: number | null
          usage_id?: string
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
          wallet_transaction_id?: string | null
        }
        Update: {
          base_cost?: number
          created_at?: string
          final_cost?: number | null
          id?: string
          is_billed?: boolean | null
          management_fee?: number | null
          management_fee_percent?: number
          module?: Database["public"]["Enums"]["ai_module"]
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["ai_provider"]
          purpose?: string | null
          qr_code_id?: string | null
          request_count?: number | null
          tokens_used?: number | null
          usage_id?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
          wallet_transaction_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key_hash: string
          api_key_prefix: string
          created_at: string
          expires_at: string | null
          id: string
          name: string
          status: string | null
          user_id: string
        }
        Insert: {
          api_key_hash: string
          api_key_prefix: string
          created_at?: string
          expires_at?: string | null
          id?: string
          name: string
          status?: string | null
          user_id: string
        }
        Update: {
          api_key_hash?: string
          api_key_prefix?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          name?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      approval_actions: {
        Row: {
          approval_id: string
          boss_id: string | null
          decided_at: string | null
          decision: string | null
          reason: string | null
          request_ref_id: string | null
          request_type: string
        }
        Insert: {
          approval_id?: string
          boss_id?: string | null
          decided_at?: string | null
          decision?: string | null
          reason?: string | null
          request_ref_id?: string | null
          request_type: string
        }
        Update: {
          approval_id?: string
          boss_id?: string | null
          decided_at?: string | null
          decision?: string | null
          reason?: string | null
          request_ref_id?: string | null
          request_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_actions_boss_id_fkey"
            columns: ["boss_id"]
            isOneToOne: false
            referencedRelation: "boss_accounts"
            referencedColumns: ["boss_id"]
          },
        ]
      }
      approval_audit_logs: {
        Row: {
          action: string
          amount: number | null
          approved_by: string | null
          created_at: string | null
          daily_limit_exceeded: boolean | null
          id: string
          monthly_limit_exceeded: boolean | null
          payout_request_id: string | null
          reason: string | null
          user_flagged: boolean | null
        }
        Insert: {
          action: string
          amount?: number | null
          approved_by?: string | null
          created_at?: string | null
          daily_limit_exceeded?: boolean | null
          id?: string
          monthly_limit_exceeded?: boolean | null
          payout_request_id?: string | null
          reason?: string | null
          user_flagged?: boolean | null
        }
        Update: {
          action?: string
          amount?: number | null
          approved_by?: string | null
          created_at?: string | null
          daily_limit_exceeded?: boolean | null
          id?: string
          monthly_limit_exceeded?: boolean | null
          payout_request_id?: string | null
          reason?: string | null
          user_flagged?: boolean | null
        }
        Relationships: []
      }
      approval_decisions: {
        Row: {
          approval_id: string
          decision: string
          decision_reason: string | null
          decision_time: string | null
          id: string
          super_admin_id: string
        }
        Insert: {
          approval_id: string
          decision: string
          decision_reason?: string | null
          decision_time?: string | null
          id?: string
          super_admin_id: string
        }
        Update: {
          approval_id?: string
          decision?: string
          decision_reason?: string | null
          decision_time?: string | null
          id?: string
          super_admin_id?: string
        }
        Relationships: []
      }
      approval_steps: {
        Row: {
          approval_id: string | null
          approver_id: string | null
          approver_role: string
          created_at: string | null
          decided_at: string | null
          decision_notes: string | null
          id: string
          status: string
          step_number: number
        }
        Insert: {
          approval_id?: string | null
          approver_id?: string | null
          approver_role: string
          created_at?: string | null
          decided_at?: string | null
          decision_notes?: string | null
          id?: string
          status?: string
          step_number?: number
        }
        Update: {
          approval_id?: string | null
          approver_id?: string | null
          approver_role?: string
          created_at?: string | null
          decided_at?: string | null
          decision_notes?: string | null
          id?: string
          status?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "approval_steps_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "approvals"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          request_data: Json | null
          request_type: string
          requested_by_user_id: string
          risk_score: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          request_data?: Json | null
          request_type: string
          requested_by_user_id: string
          risk_score?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          request_data?: Json | null
          request_type?: string
          requested_by_user_id?: string
          risk_score?: number | null
          status?: string | null
        }
        Relationships: []
      }
      area_manager_accounts: {
        Row: {
          assigned_countries: string[] | null
          assigned_super_admin_id: string | null
          can_access_other_regions: boolean | null
          can_export_data: boolean | null
          country: string
          created_at: string | null
          current_activity: string | null
          daily_report_enabled: boolean | null
          id: string
          last_login_time: string | null
          login_device: string | null
          region: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          weekly_report_enabled: boolean | null
        }
        Insert: {
          assigned_countries?: string[] | null
          assigned_super_admin_id?: string | null
          can_access_other_regions?: boolean | null
          can_export_data?: boolean | null
          country: string
          created_at?: string | null
          current_activity?: string | null
          daily_report_enabled?: boolean | null
          id?: string
          last_login_time?: string | null
          login_device?: string | null
          region?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          weekly_report_enabled?: boolean | null
        }
        Update: {
          assigned_countries?: string[] | null
          assigned_super_admin_id?: string | null
          can_access_other_regions?: boolean | null
          can_export_data?: boolean | null
          country?: string
          created_at?: string | null
          current_activity?: string | null
          daily_report_enabled?: boolean | null
          id?: string
          last_login_time?: string | null
          login_device?: string | null
          region?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          weekly_report_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_area_manager_assigned_super_admin_id_fkey"
            columns: ["assigned_super_admin_id"]
            isOneToOne: false
            referencedRelation: "super_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_abuse_flags: {
        Row: {
          created_at: string | null
          details: Json | null
          flag_count: number | null
          flag_type: string
          id: string
          is_resolved: boolean | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          staff_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          flag_count?: number | null
          flag_type: string
          id?: string
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          staff_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          flag_count?: number | null
          flag_type?: string
          id?: string
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          staff_id?: string
        }
        Relationships: []
      }
      assist_eligibility_settings: {
        Row: {
          allowed_modes: string[] | null
          created_at: string | null
          id: string
          is_assist_enabled: boolean | null
          max_duration_minutes: number | null
          max_sessions_per_staff: number | null
          requires_approval: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          allowed_modes?: string[] | null
          created_at?: string | null
          id?: string
          is_assist_enabled?: boolean | null
          max_duration_minutes?: number | null
          max_sessions_per_staff?: number | null
          requires_approval?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          allowed_modes?: string[] | null
          created_at?: string | null
          id?: string
          is_assist_enabled?: boolean | null
          max_duration_minutes?: number | null
          max_sessions_per_staff?: number | null
          requires_approval?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      assist_force_end_logs: {
        Row: {
          created_at: string | null
          end_type: string
          ended_by: string
          ended_by_role: Database["public"]["Enums"]["app_role"] | null
          id: string
          reason: string
          session_duration_seconds: number | null
          session_id: string
          was_policy_violation: boolean | null
        }
        Insert: {
          created_at?: string | null
          end_type: string
          ended_by: string
          ended_by_role?: Database["public"]["Enums"]["app_role"] | null
          id?: string
          reason: string
          session_duration_seconds?: number | null
          session_id: string
          was_policy_violation?: boolean | null
        }
        Update: {
          created_at?: string | null
          end_type?: string
          ended_by?: string
          ended_by_role?: Database["public"]["Enums"]["app_role"] | null
          id?: string
          reason?: string
          session_duration_seconds?: number | null
          session_id?: string
          was_policy_violation?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "assist_force_end_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "safe_assist_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assist_request_queue: {
        Row: {
          created_at: string | null
          id: string
          rejection_reason: string | null
          request_reason: string | null
          requested_duration_minutes: number | null
          requested_mode: string | null
          requested_support_staff_id: string | null
          requesting_user_id: string
          requesting_user_role: Database["public"]["Enums"]["app_role"] | null
          reviewed_at: string | null
          reviewed_by: string | null
          session_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          request_reason?: string | null
          requested_duration_minutes?: number | null
          requested_mode?: string | null
          requested_support_staff_id?: string | null
          requesting_user_id: string
          requesting_user_role?: Database["public"]["Enums"]["app_role"] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          request_reason?: string | null
          requested_duration_minutes?: number | null
          requested_mode?: string | null
          requested_support_staff_id?: string | null
          requesting_user_id?: string
          requesting_user_role?: Database["public"]["Enums"]["app_role"] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assist_request_queue_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "safe_assist_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_lock: {
        Row: {
          created_at: string | null
          id: string
          is_locked: boolean | null
          lock_reason: string
          locked_by: string | null
          record_ref_id: string
          table_name: string
          unlock_condition: string | null
          unlocked_at: string | null
          unlocked_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          lock_reason: string
          locked_by?: string | null
          record_ref_id: string
          table_name: string
          unlock_condition?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          lock_reason?: string
          locked_by?: string | null
          record_ref_id?: string
          table_name?: string
          unlock_condition?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          id: string
          meta_json: Json | null
          module: string
          role: Database["public"]["Enums"]["app_role"] | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          meta_json?: Json | null
          module: string
          role?: Database["public"]["Enums"]["app_role"] | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          meta_json?: Json | null
          module?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      auto_healing_config: {
        Row: {
          auto_shutdown_on_failure: boolean | null
          created_at: string | null
          heartbeat_timeout_seconds: number | null
          id: string
          is_enabled: boolean | null
          last_restart_at: string | null
          max_restart_attempts: number | null
          restart_count: number | null
          server_id: string | null
        }
        Insert: {
          auto_shutdown_on_failure?: boolean | null
          created_at?: string | null
          heartbeat_timeout_seconds?: number | null
          id?: string
          is_enabled?: boolean | null
          last_restart_at?: string | null
          max_restart_attempts?: number | null
          restart_count?: number | null
          server_id?: string | null
        }
        Update: {
          auto_shutdown_on_failure?: boolean | null
          created_at?: string | null
          heartbeat_timeout_seconds?: number | null
          id?: string
          is_enabled?: boolean | null
          last_restart_at?: string | null
          max_restart_attempts?: number | null
          restart_count?: number | null
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_healing_config_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_scaling_policies: {
        Row: {
          consecutive_checks_required: number | null
          consecutive_triggers: number | null
          cooldown_minutes: number | null
          cooldown_seconds: number | null
          cpu_threshold_percent: number | null
          created_at: string | null
          disk_threshold_percent: number | null
          id: string
          is_enabled: boolean | null
          last_scale_at: string | null
          last_triggered_at: string | null
          max_cpu: number | null
          max_ram: number | null
          max_storage: number | null
          ram_threshold_percent: number | null
          scale_up_cpu: number | null
          scale_up_ram: number | null
          scale_up_storage: number | null
          server_id: string | null
        }
        Insert: {
          consecutive_checks_required?: number | null
          consecutive_triggers?: number | null
          cooldown_minutes?: number | null
          cooldown_seconds?: number | null
          cpu_threshold_percent?: number | null
          created_at?: string | null
          disk_threshold_percent?: number | null
          id?: string
          is_enabled?: boolean | null
          last_scale_at?: string | null
          last_triggered_at?: string | null
          max_cpu?: number | null
          max_ram?: number | null
          max_storage?: number | null
          ram_threshold_percent?: number | null
          scale_up_cpu?: number | null
          scale_up_ram?: number | null
          scale_up_storage?: number | null
          server_id?: string | null
        }
        Update: {
          consecutive_checks_required?: number | null
          consecutive_triggers?: number | null
          cooldown_minutes?: number | null
          cooldown_seconds?: number | null
          cpu_threshold_percent?: number | null
          created_at?: string | null
          disk_threshold_percent?: number | null
          id?: string
          is_enabled?: boolean | null
          last_scale_at?: string | null
          last_triggered_at?: string | null
          max_cpu?: number | null
          max_ram?: number | null
          max_storage?: number | null
          ram_threshold_percent?: number | null
          scale_up_cpu?: number | null
          scale_up_ram?: number | null
          scale_up_storage?: number | null
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_scaling_policies_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      background_jobs: {
        Row: {
          created_at: string | null
          id: string
          interval_seconds: number
          is_active: boolean | null
          job_type: string
          last_error: string | null
          last_run_at: string | null
          next_run_at: string | null
          run_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interval_seconds: number
          is_active?: boolean | null
          job_type: string
          last_error?: string | null
          last_run_at?: string | null
          next_run_at?: string | null
          run_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interval_seconds?: number
          is_active?: boolean | null
          job_type?: string
          last_error?: string | null
          last_run_at?: string | null
          next_run_at?: string | null
          run_count?: number | null
        }
        Relationships: []
      }
      backup_codes: {
        Row: {
          code_hash: string
          created_at: string | null
          id: string
          is_used: boolean | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string | null
          id?: string
          is_used?: boolean | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string | null
          id?: string
          is_used?: boolean | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      backup_schedules: {
        Row: {
          backup_type: string
          created_at: string
          created_by: string | null
          cron_expression: string | null
          failure_count: number | null
          frequency: string
          id: string
          is_active: boolean | null
          last_run_at: string | null
          max_backups: number | null
          next_run_at: string | null
          notification_emails: string[] | null
          notify_on_failure: boolean | null
          notify_on_success: boolean | null
          retention_days: number | null
          schedule_name: string
          server_id: string | null
          success_count: number | null
          updated_at: string
        }
        Insert: {
          backup_type: string
          created_at?: string
          created_by?: string | null
          cron_expression?: string | null
          failure_count?: number | null
          frequency: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          max_backups?: number | null
          next_run_at?: string | null
          notification_emails?: string[] | null
          notify_on_failure?: boolean | null
          notify_on_success?: boolean | null
          retention_days?: number | null
          schedule_name: string
          server_id?: string | null
          success_count?: number | null
          updated_at?: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          created_by?: string | null
          cron_expression?: string | null
          failure_count?: number | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          max_backups?: number | null
          next_run_at?: string | null
          notification_emails?: string[] | null
          notify_on_failure?: boolean | null
          notify_on_success?: boolean | null
          retention_days?: number | null
          schedule_name?: string
          server_id?: string | null
          success_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "backup_schedules_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      behavior_analytics: {
        Row: {
          anomaly_flags: string[] | null
          bot_probability: number | null
          click_coordinates: Json | null
          created_at: string | null
          event_type: string
          id: string
          is_bot_like: boolean | null
          keystroke_pattern: string | null
          mouse_velocity: number | null
          page_url: string | null
          scroll_pattern: string | null
          session_id: string | null
          time_on_page: number | null
          user_id: string
        }
        Insert: {
          anomaly_flags?: string[] | null
          bot_probability?: number | null
          click_coordinates?: Json | null
          created_at?: string | null
          event_type: string
          id?: string
          is_bot_like?: boolean | null
          keystroke_pattern?: string | null
          mouse_velocity?: number | null
          page_url?: string | null
          scroll_pattern?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_id: string
        }
        Update: {
          anomaly_flags?: string[] | null
          bot_probability?: number | null
          click_coordinates?: Json | null
          created_at?: string | null
          event_type?: string
          id?: string
          is_bot_like?: boolean | null
          keystroke_pattern?: string | null
          mouse_velocity?: number | null
          page_url?: string | null
          scroll_pattern?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_id?: string
        }
        Relationships: []
      }
      behavior_patterns: {
        Row: {
          anomaly_detected_at: string | null
          baseline_data: Json
          created_at: string
          current_data: Json | null
          deviation_score: number | null
          id: string
          is_anomalous: boolean | null
          last_sample_at: string | null
          pattern_type: string
          samples_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anomaly_detected_at?: string | null
          baseline_data?: Json
          created_at?: string
          current_data?: Json | null
          deviation_score?: number | null
          id?: string
          is_anomalous?: boolean | null
          last_sample_at?: string | null
          pattern_type: string
          samples_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anomaly_detected_at?: string | null
          baseline_data?: Json
          created_at?: string
          current_data?: Json | null
          deviation_score?: number | null
          id?: string
          is_anomalous?: boolean | null
          last_sample_at?: string | null
          pattern_type?: string
          samples_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blackbox_events: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          geo_location: string | null
          id: string
          ip_address: string | null
          is_sealed: boolean
          metadata: Json | null
          module_name: string
          risk_score: number | null
          role_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_sealed?: boolean
          metadata?: Json | null
          module_name: string
          risk_score?: number | null
          role_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_sealed?: boolean
          metadata?: Json | null
          module_name?: string
          risk_score?: number | null
          role_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      boss_accounts: {
        Row: {
          boss_id: string
          created_at: string | null
          email: string
          name: string
          status: string | null
          user_id: string
        }
        Insert: {
          boss_id?: string
          created_at?: string | null
          email: string
          name: string
          status?: string | null
          user_id: string
        }
        Update: {
          boss_id?: string
          created_at?: string | null
          email?: string
          name?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      boss_alerts: {
        Row: {
          alert_type: string
          auto_generated: boolean | null
          created_at: string
          description: string | null
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          metadata: Json | null
          priority: number | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          source_entity_id: string | null
          source_module: string | null
          title: string
        }
        Insert: {
          alert_type: string
          auto_generated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          metadata?: Json | null
          priority?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source_entity_id?: string | null
          source_module?: string | null
          title: string
        }
        Update: {
          alert_type?: string
          auto_generated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          metadata?: Json | null
          priority?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source_entity_id?: string | null
          source_module?: string | null
          title?: string
        }
        Relationships: []
      }
      boss_audit_logs: {
        Row: {
          action_target: string | null
          action_type: string
          actor_id: string | null
          actor_role: string | null
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          risk_level: string | null
          session_id: string | null
          status: string | null
          target_id: string | null
          user_agent: string | null
        }
        Insert: {
          action_target?: string | null
          action_type: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          risk_level?: string | null
          session_id?: string | null
          status?: string | null
          target_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action_target?: string | null
          action_type?: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          risk_level?: string | null
          session_id?: string | null
          status?: string | null
          target_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      boss_financial_metrics: {
        Row: {
          created_at: string
          currency: string
          expense_breakdown: Json | null
          gross_margin: number | null
          id: string
          is_forecast: boolean | null
          metadata: Json | null
          net_profit: number
          period_end: string
          period_start: string
          period_type: string
          revenue_by_source: Json | null
          total_expenses: number
          total_revenue: number
        }
        Insert: {
          created_at?: string
          currency?: string
          expense_breakdown?: Json | null
          gross_margin?: number | null
          id?: string
          is_forecast?: boolean | null
          metadata?: Json | null
          net_profit?: number
          period_end: string
          period_start: string
          period_type?: string
          revenue_by_source?: Json | null
          total_expenses?: number
          total_revenue?: number
        }
        Update: {
          created_at?: string
          currency?: string
          expense_breakdown?: Json | null
          gross_margin?: number | null
          id?: string
          is_forecast?: boolean | null
          metadata?: Json | null
          net_profit?: number
          period_end?: string
          period_start?: string
          period_type?: string
          revenue_by_source?: Json | null
          total_expenses?: number
          total_revenue?: number
        }
        Relationships: []
      }
      boss_module_status: {
        Row: {
          avg_response_ms: number | null
          created_at: string
          dependencies: Json | null
          error_count: number | null
          health_score: number | null
          id: string
          last_heartbeat_at: string | null
          metadata: Json | null
          module_key: string
          module_name: string
          request_count_24h: number | null
          status: string
          updated_at: string
          uptime_percentage: number | null
          version: string | null
          warning_count: number | null
        }
        Insert: {
          avg_response_ms?: number | null
          created_at?: string
          dependencies?: Json | null
          error_count?: number | null
          health_score?: number | null
          id?: string
          last_heartbeat_at?: string | null
          metadata?: Json | null
          module_key: string
          module_name: string
          request_count_24h?: number | null
          status?: string
          updated_at?: string
          uptime_percentage?: number | null
          version?: string | null
          warning_count?: number | null
        }
        Update: {
          avg_response_ms?: number | null
          created_at?: string
          dependencies?: Json | null
          error_count?: number | null
          health_score?: number | null
          id?: string
          last_heartbeat_at?: string | null
          metadata?: Json | null
          module_key?: string
          module_name?: string
          request_count_24h?: number | null
          status?: string
          updated_at?: string
          uptime_percentage?: number | null
          version?: string | null
          warning_count?: number | null
        }
        Relationships: []
      }
      boss_reports: {
        Row: {
          created_at: string
          file_format: string | null
          file_url: string | null
          generated_by: string | null
          id: string
          is_scheduled: boolean | null
          last_run_at: string | null
          metadata: Json | null
          next_run_at: string | null
          period_end: string | null
          period_start: string | null
          report_category: string
          report_data: Json | null
          report_name: string
          report_type: string
          schedule_cron: string | null
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_format?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          is_scheduled?: boolean | null
          last_run_at?: string | null
          metadata?: Json | null
          next_run_at?: string | null
          period_end?: string | null
          period_start?: string | null
          report_category?: string
          report_data?: Json | null
          report_name: string
          report_type: string
          schedule_cron?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_format?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          is_scheduled?: boolean | null
          last_run_at?: string | null
          metadata?: Json | null
          next_run_at?: string | null
          period_end?: string | null
          period_start?: string | null
          report_category?: string
          report_data?: Json | null
          report_name?: string
          report_type?: string
          schedule_cron?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      boss_sessions: {
        Row: {
          boss_id: string | null
          device_fingerprint: string | null
          ip_address: string | null
          login_time: string | null
          logout_time: string | null
          session_id: string
        }
        Insert: {
          boss_id?: string | null
          device_fingerprint?: string | null
          ip_address?: string | null
          login_time?: string | null
          logout_time?: string | null
          session_id?: string
        }
        Update: {
          boss_id?: string | null
          device_fingerprint?: string | null
          ip_address?: string | null
          login_time?: string | null
          logout_time?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "boss_sessions_boss_id_fkey"
            columns: ["boss_id"]
            isOneToOne: false
            referencedRelation: "boss_accounts"
            referencedColumns: ["boss_id"]
          },
        ]
      }
      boss_system_metrics: {
        Row: {
          category: string
          created_at: string
          id: string
          metadata: Json | null
          metric_key: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          trend_direction: string | null
          trend_percentage: number | null
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_key: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          trend_direction?: string | null
          trend_percentage?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_key?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          trend_direction?: string | null
          trend_percentage?: number | null
        }
        Relationships: []
      }
      boss_user_activity: {
        Row: {
          active_users: number
          activity_by_region: Json | null
          activity_by_role: Json | null
          avg_session_duration_seconds: number | null
          bounce_rate: number | null
          created_at: string
          id: string
          metadata: Json | null
          new_signups: number | null
          period_end: string
          period_start: string
          period_type: string
          top_pages: Json | null
          total_sessions: number | null
        }
        Insert: {
          active_users?: number
          activity_by_region?: Json | null
          activity_by_role?: Json | null
          avg_session_duration_seconds?: number | null
          bounce_rate?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_signups?: number | null
          period_end: string
          period_start: string
          period_type?: string
          top_pages?: Json | null
          total_sessions?: number | null
        }
        Update: {
          active_users?: number
          activity_by_region?: Json | null
          activity_by_role?: Json | null
          avg_session_duration_seconds?: number | null
          bounce_rate?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_signups?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          top_pages?: Json | null
          total_sessions?: number | null
        }
        Relationships: []
      }
      box_action_logs: {
        Row: {
          action_result: string
          action_type: string
          box_entity_id: string
          box_type: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_status: string | null
          previous_status: string | null
          user_agent: string | null
          user_id: string
          user_role: string
        }
        Insert: {
          action_result: string
          action_type: string
          box_entity_id: string
          box_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_status?: string | null
          previous_status?: string | null
          user_agent?: string | null
          user_id: string
          user_role: string
        }
        Update: {
          action_result?: string
          action_type?: string
          box_entity_id?: string
          box_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_status?: string | null
          previous_status?: string | null
          user_agent?: string | null
          user_id?: string
          user_role?: string
        }
        Relationships: []
      }
      box_action_permissions: {
        Row: {
          action_type: string
          box_type: string
          created_at: string
          id: string
          is_allowed: boolean
          role: string
          updated_at: string
        }
        Insert: {
          action_type: string
          box_type: string
          created_at?: string
          id?: string
          is_allowed?: boolean
          role: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          box_type?: string
          created_at?: string
          id?: string
          is_allowed?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      box_status: {
        Row: {
          box_type: string
          created_at: string
          entity_id: string
          id: string
          last_action: string | null
          last_action_at: string | null
          last_action_by: string | null
          metadata: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          box_type: string
          created_at?: string
          entity_id: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          last_action_by?: string | null
          metadata?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          box_type?: string
          created_at?: string
          entity_id?: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          last_action_by?: string | null
          metadata?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      branch_map: {
        Row: {
          branch_code: string
          branch_name: string
          city: string | null
          country: string
          created_at: string
          franchise_user_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          state: string | null
          status: string | null
        }
        Insert: {
          branch_code: string
          branch_name: string
          city?: string | null
          country: string
          created_at?: string
          franchise_user_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          status?: string | null
        }
        Update: {
          branch_code?: string
          branch_name?: string
          city?: string | null
          country?: string
          created_at?: string
          franchise_user_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          status?: string | null
        }
        Relationships: []
      }
      business_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_subcategories: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      button_executions: {
        Row: {
          button_id: string
          completed_at: string | null
          created_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          ip_address: string | null
          latency_ms: number | null
          metadata: Json | null
          role_id: string | null
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          button_id: string
          completed_at?: string | null
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          role_id?: string | null
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          button_id?: string
          completed_at?: string | null
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          role_id?: string | null
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      button_registry: {
        Row: {
          action_type: string
          api_endpoint: string | null
          button_id: string
          created_at: string | null
          db_table: string | null
          description: string | null
          id: string
          is_active: boolean | null
          module_name: string
          updated_at: string | null
        }
        Insert: {
          action_type: string
          api_endpoint?: string | null
          button_id: string
          created_at?: string | null
          db_table?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_name: string
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          api_endpoint?: string | null
          button_id?: string
          created_at?: string | null
          db_table?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      buzzer_queue: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          auto_escalate_after: number | null
          created_at: string
          escalation_level: number | null
          id: string
          lead_id: string | null
          priority: string | null
          region: string | null
          role_target: Database["public"]["Enums"]["app_role"] | null
          status: string | null
          task_id: string | null
          trigger_type: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          auto_escalate_after?: number | null
          created_at?: string
          escalation_level?: number | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          region?: string | null
          role_target?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          task_id?: string | null
          trigger_type: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          auto_escalate_after?: number | null
          created_at?: string
          escalation_level?: number | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          region?: string | null
          role_target?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          task_id?: string | null
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "buzzer_queue_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      ceo_ai_insights: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          action_taken: string | null
          category: string | null
          confidence_score: number | null
          created_at: string
          description: string | null
          id: string
          impact_level: string | null
          insight_type: string
          is_acknowledged: boolean | null
          metadata: Json | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          category?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          impact_level?: string | null
          insight_type?: string
          is_acknowledged?: boolean | null
          metadata?: Json | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          category?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          impact_level?: string | null
          insight_type?: string
          is_acknowledged?: boolean | null
          metadata?: Json | null
          title?: string
        }
        Relationships: []
      }
      ceo_kpi_metrics: {
        Row: {
          change_percent: number | null
          created_at: string
          id: string
          metadata: Json | null
          metric_category: string
          metric_name: string
          metric_value: number
          period_date: string
          period_type: string
          previous_value: number | null
        }
        Insert: {
          change_percent?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_category?: string
          metric_name: string
          metric_value?: number
          period_date?: string
          period_type?: string
          previous_value?: number | null
        }
        Update: {
          change_percent?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_category?: string
          metric_name?: string
          metric_value?: number
          period_date?: string
          period_type?: string
          previous_value?: number | null
        }
        Relationships: []
      }
      ceo_product_performance: {
        Row: {
          avg_rating: number | null
          category: string | null
          created_at: string
          growth_percent: number | null
          id: string
          metadata: Json | null
          period_month: string
          product_id: string | null
          product_name: string
          return_rate: number | null
          total_revenue: number
          total_sales: number
        }
        Insert: {
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          growth_percent?: number | null
          id?: string
          metadata?: Json | null
          period_month: string
          product_id?: string | null
          product_name: string
          return_rate?: number | null
          total_revenue?: number
          total_sales?: number
        }
        Update: {
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          growth_percent?: number | null
          id?: string
          metadata?: Json | null
          period_month?: string
          product_id?: string | null
          product_name?: string
          return_rate?: number | null
          total_revenue?: number
          total_sales?: number
        }
        Relationships: []
      }
      ceo_region_performance: {
        Row: {
          active_franchises: number | null
          country_code: string | null
          created_at: string
          growth_percent: number | null
          id: string
          market_share: number | null
          metadata: Json | null
          period_month: string
          region_name: string
          risk_level: string | null
          total_revenue: number
          total_users: number
        }
        Insert: {
          active_franchises?: number | null
          country_code?: string | null
          created_at?: string
          growth_percent?: number | null
          id?: string
          market_share?: number | null
          metadata?: Json | null
          period_month: string
          region_name: string
          risk_level?: string | null
          total_revenue?: number
          total_users?: number
        }
        Update: {
          active_franchises?: number | null
          country_code?: string | null
          created_at?: string
          growth_percent?: number | null
          id?: string
          market_share?: number | null
          metadata?: Json | null
          period_month?: string
          region_name?: string
          risk_level?: string | null
          total_revenue?: number
          total_users?: number
        }
        Relationships: []
      }
      ceo_reports: {
        Row: {
          boss_response: string | null
          content: string | null
          created_at: string
          generated_by: string | null
          id: string
          period_end: string | null
          period_start: string | null
          report_data: Json | null
          report_type: string
          status: string
          submitted_at: string | null
          submitted_to_boss: boolean | null
          summary: string | null
          title: string
        }
        Insert: {
          boss_response?: string | null
          content?: string | null
          created_at?: string
          generated_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          report_data?: Json | null
          report_type?: string
          status?: string
          submitted_at?: string | null
          submitted_to_boss?: boolean | null
          summary?: string | null
          title: string
        }
        Update: {
          boss_response?: string | null
          content?: string | null
          created_at?: string
          generated_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          report_data?: Json | null
          report_type?: string
          status?: string
          submitted_at?: string | null
          submitted_to_boss?: boolean | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      ceo_revenue_metrics: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          period_month: string
          period_year: number
          region: string | null
          revenue_source: string
          target_amount: number | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          period_month: string
          period_year?: number
          region?: string | null
          revenue_source: string
          target_amount?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          period_month?: string
          period_year?: number
          region?: string | null
          revenue_source?: string
          target_amount?: number | null
        }
        Relationships: []
      }
      ceo_scan_logs: {
        Row: {
          created_at: string
          critical_issues: number | null
          id: string
          initiated_by: string | null
          issues_found: number | null
          modules_scanned: number | null
          scan_duration_ms: number | null
          scan_results: Json | null
          scan_type: string
          status: string
        }
        Insert: {
          created_at?: string
          critical_issues?: number | null
          id?: string
          initiated_by?: string | null
          issues_found?: number | null
          modules_scanned?: number | null
          scan_duration_ms?: number | null
          scan_results?: Json | null
          scan_type?: string
          status?: string
        }
        Update: {
          created_at?: string
          critical_issues?: number | null
          id?: string
          initiated_by?: string | null
          issues_found?: number | null
          modules_scanned?: number | null
          scan_duration_ms?: number | null
          scan_results?: Json | null
          scan_type?: string
          status?: string
        }
        Relationships: []
      }
      ceo_system_health: {
        Row: {
          benchmark: number | null
          created_at: string
          details: Json | null
          id: string
          metric_name: string
          module_name: string | null
          recorded_at: string
          score: number
          status: string
        }
        Insert: {
          benchmark?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          metric_name: string
          module_name?: string | null
          recorded_at?: string
          score?: number
          status?: string
        }
        Update: {
          benchmark?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          metric_name?: string
          module_name?: string | null
          recorded_at?: string
          score?: number
          status?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          cannot_delete: boolean | null
          cannot_edit: boolean | null
          language: string | null
          masked_sender: string | null
          message_id: string
          message_text: string
          sender_id: string | null
          thread_id: string | null
          timestamp: string
          translated_text: string | null
        }
        Insert: {
          cannot_delete?: boolean | null
          cannot_edit?: boolean | null
          language?: string | null
          masked_sender?: string | null
          message_id?: string
          message_text: string
          sender_id?: string | null
          thread_id?: string | null
          timestamp?: string
          translated_text?: string | null
        }
        Update: {
          cannot_delete?: boolean | null
          cannot_edit?: boolean | null
          language?: string | null
          masked_sender?: string | null
          message_id?: string
          message_text?: string
          sender_id?: string | null
          thread_id?: string | null
          timestamp?: string
          translated_text?: string | null
        }
        Relationships: []
      }
      chat_room_messages: {
        Row: {
          created_at: string | null
          delete_blocked: boolean | null
          edit_blocked: boolean | null
          id: string
          masked_sender_name: string | null
          message_text: string
          room_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          delete_blocked?: boolean | null
          edit_blocked?: boolean | null
          id?: string
          masked_sender_name?: string | null
          message_text: string
          room_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          delete_blocked?: boolean | null
          edit_blocked?: boolean | null
          id?: string
          masked_sender_name?: string | null
          message_text?: string
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          purpose: string | null
          room_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          purpose?: string | null
          room_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          purpose?: string | null
          room_type?: string | null
        }
        Relationships: []
      }
      chat_threads: {
        Row: {
          created_at: string
          created_by: string | null
          is_active: boolean | null
          related_lead: string | null
          related_role: Database["public"]["Enums"]["app_role"] | null
          related_task: string | null
          thread_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          is_active?: boolean | null
          related_lead?: string | null
          related_role?: Database["public"]["Enums"]["app_role"] | null
          related_task?: string | null
          thread_id?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          is_active?: boolean | null
          related_lead?: string | null
          related_role?: Database["public"]["Enums"]["app_role"] | null
          related_task?: string | null
          thread_id?: string
        }
        Relationships: []
      }
      chat_user_status: {
        Row: {
          id: string
          is_muted: boolean | null
          is_online: boolean | null
          last_active_channel: string | null
          last_seen: string | null
          mute_reason: string | null
          muted_until: string | null
          updated_at: string | null
          user_id: string
          violation_count: number | null
        }
        Insert: {
          id?: string
          is_muted?: boolean | null
          is_online?: boolean | null
          last_active_channel?: string | null
          last_seen?: string | null
          mute_reason?: string | null
          muted_until?: string | null
          updated_at?: string | null
          user_id: string
          violation_count?: number | null
        }
        Update: {
          id?: string
          is_muted?: boolean | null
          is_online?: boolean | null
          last_active_channel?: string | null
          last_seen?: string | null
          mute_reason?: string | null
          muted_until?: string | null
          updated_at?: string | null
          user_id?: string
          violation_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_user_status_last_active_channel_fkey"
            columns: ["last_active_channel"]
            isOneToOne: false
            referencedRelation: "internal_chat_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_violations: {
        Row: {
          action_taken: string | null
          channel_id: string | null
          created_at: string | null
          description: string | null
          detected_content: string | null
          id: string
          message_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          user_id: string
          violation_level: number | null
          violation_type: string
        }
        Insert: {
          action_taken?: string | null
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          detected_content?: string | null
          id?: string
          message_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          user_id: string
          violation_level?: number | null
          violation_type: string
        }
        Update: {
          action_taken?: string | null
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          detected_content?: string | null
          id?: string
          message_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          user_id?: string
          violation_level?: number | null
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_violations_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_violations_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_agents: {
        Row: {
          availability: string | null
          created_at: string
          email: string | null
          id: string
          languages: string[] | null
          max_concurrent_chats: number | null
          name: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email?: string | null
          id?: string
          languages?: string[] | null
          max_concurrent_chats?: number | null
          name: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string | null
          id?: string
          languages?: string[] | null
          max_concurrent_chats?: number | null
          name?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_automation_rules: {
        Row: {
          action_type: string
          action_value: string | null
          chatbot_id: string
          condition_type: string | null
          condition_value: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          trigger_type: string
          trigger_value: string | null
        }
        Insert: {
          action_type: string
          action_value?: string | null
          chatbot_id: string
          condition_type?: string | null
          condition_value?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          trigger_type: string
          trigger_value?: string | null
        }
        Update: {
          action_type?: string
          action_value?: string | null
          chatbot_id?: string
          condition_type?: string | null
          condition_value?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          trigger_type?: string
          trigger_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_automation_rules_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "support_chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_conversations: {
        Row: {
          app_version: string | null
          assigned_agent_id: string | null
          chatbot_id: string
          country: string | null
          created_at: string
          csat_score: number | null
          device_type: string | null
          ended_at: string | null
          guest_id: string | null
          id: string
          language: string | null
          started_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          assigned_agent_id?: string | null
          chatbot_id: string
          country?: string | null
          created_at?: string
          csat_score?: number | null
          device_type?: string | null
          ended_at?: string | null
          guest_id?: string | null
          id?: string
          language?: string | null
          started_at?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          assigned_agent_id?: string | null
          chatbot_id?: string
          country?: string | null
          created_at?: string
          csat_score?: number | null
          device_type?: string | null
          ended_at?: string | null
          guest_id?: string | null
          id?: string
          language?: string | null
          started_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_conversations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "support_chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_knowledge_base: {
        Row: {
          chatbot_id: string
          content: string | null
          created_at: string
          id: string
          last_trained_at: string | null
          source_type: string
          source_url: string | null
          status: string | null
          title: string
        }
        Insert: {
          chatbot_id: string
          content?: string | null
          created_at?: string
          id?: string
          last_trained_at?: string | null
          source_type: string
          source_url?: string | null
          status?: string | null
          title: string
        }
        Update: {
          chatbot_id?: string
          content?: string | null
          created_at?: string
          id?: string
          last_trained_at?: string | null
          source_type?: string
          source_url?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_knowledge_base_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "support_chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_working_hours: {
        Row: {
          chatbot_id: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          timezone: string | null
        }
        Insert: {
          chatbot_id: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          timezone?: string | null
        }
        Update: {
          chatbot_id?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_working_hours_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "support_chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      click_fraud_detection: {
        Row: {
          bot_clicks: number | null
          created_at: string | null
          duplicate_ip_clicks: number | null
          flagged_at: string | null
          franchise_id: string | null
          fraud_score: number | null
          id: string
          influencer_id: string | null
          invalid_clicks: number | null
          period_end: string
          period_start: string
          reseller_id: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string | null
          suspicious_patterns: Json | null
          total_clicks: number | null
          tracking_code: string | null
          valid_clicks: number | null
          vpn_clicks: number | null
        }
        Insert: {
          bot_clicks?: number | null
          created_at?: string | null
          duplicate_ip_clicks?: number | null
          flagged_at?: string | null
          franchise_id?: string | null
          fraud_score?: number | null
          id?: string
          influencer_id?: string | null
          invalid_clicks?: number | null
          period_end: string
          period_start: string
          reseller_id?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          suspicious_patterns?: Json | null
          total_clicks?: number | null
          tracking_code?: string | null
          valid_clicks?: number | null
          vpn_clicks?: number | null
        }
        Update: {
          bot_clicks?: number | null
          created_at?: string | null
          duplicate_ip_clicks?: number | null
          flagged_at?: string | null
          franchise_id?: string | null
          fraud_score?: number | null
          id?: string
          influencer_id?: string | null
          invalid_clicks?: number | null
          period_end?: string
          period_start?: string
          reseller_id?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          suspicious_patterns?: Json | null
          total_clicks?: number | null
          tracking_code?: string | null
          valid_clicks?: number | null
          vpn_clicks?: number | null
        }
        Relationships: []
      }
      client_feedback: {
        Row: {
          category: string | null
          created_at: string | null
          csat_score: number | null
          feedback_text: string | null
          feedback_type: string | null
          id: string
          nps_score: number | null
          rating: number | null
          responded_by: string | null
          response_text: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          csat_score?: number | null
          feedback_text?: string | null
          feedback_type?: string | null
          id?: string
          nps_score?: number | null
          rating?: number | null
          responded_by?: string | null
          response_text?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          csat_score?: number | null
          feedback_text?: string | null
          feedback_type?: string | null
          id?: string
          nps_score?: number | null
          rating?: number | null
          responded_by?: string | null
          response_text?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      client_projects: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          assigned_ip: string | null
          assigned_to: string | null
          balance_amount: number | null
          balance_paid: boolean | null
          balance_paid_at: string | null
          balance_payment_method: string | null
          balance_transaction_id: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          company_name: string | null
          created_at: string
          currency: string | null
          demo_id: string | null
          deposit_amount: number | null
          deposit_paid: boolean | null
          deposit_paid_at: string | null
          deposit_payment_method: string | null
          deposit_transaction_id: string | null
          dns_configured: boolean | null
          domain_name: string
          id: string
          logo_url: string | null
          project_type: string
          quoted_amount: number | null
          requirements: string | null
          status: string | null
          status_message: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_ip?: string | null
          assigned_to?: string | null
          balance_amount?: number | null
          balance_paid?: boolean | null
          balance_paid_at?: string | null
          balance_payment_method?: string | null
          balance_transaction_id?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          company_name?: string | null
          created_at?: string
          currency?: string | null
          demo_id?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          deposit_paid_at?: string | null
          deposit_payment_method?: string | null
          deposit_transaction_id?: string | null
          dns_configured?: boolean | null
          domain_name: string
          id?: string
          logo_url?: string | null
          project_type?: string
          quoted_amount?: number | null
          requirements?: string | null
          status?: string | null
          status_message?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_ip?: string | null
          assigned_to?: string | null
          balance_amount?: number | null
          balance_paid?: boolean | null
          balance_paid_at?: string | null
          balance_payment_method?: string | null
          balance_transaction_id?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          company_name?: string | null
          created_at?: string
          currency?: string | null
          demo_id?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          deposit_paid_at?: string | null
          deposit_payment_method?: string | null
          deposit_transaction_id?: string | null
          dns_configured?: boolean | null
          domain_name?: string
          id?: string
          logo_url?: string | null
          project_type?: string
          quoted_amount?: number | null
          requirements?: string | null
          status?: string | null
          status_message?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      client_success_cases: {
        Row: {
          assigned_to: string | null
          client_user_id: string
          created_at: string
          description: string | null
          id: string
          issue_type: string
          resolution_notes: string | null
          satisfaction_score: number | null
          severity: string | null
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_user_id: string
          created_at?: string
          description?: string | null
          id?: string
          issue_type: string
          resolution_notes?: string | null
          satisfaction_score?: number | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_user_id?: string
          created_at?: string
          description?: string | null
          id?: string
          issue_type?: string
          resolution_notes?: string | null
          satisfaction_score?: number | null
          severity?: string | null
          status?: string | null
        }
        Relationships: []
      }
      code_access_logs: {
        Row: {
          access_time: string | null
          action_type: string
          copy_attempt: boolean | null
          created_at: string | null
          developer_id: string
          device_fingerprint: string | null
          export_attempt: boolean | null
          file_path: string | null
          id: string
          ip_address: string | null
          is_outside_hours: boolean | null
          is_suspicious: boolean | null
          repository: string | null
          suspicious_reason: string | null
          task_id: string | null
          watermark_applied: boolean | null
        }
        Insert: {
          access_time?: string | null
          action_type: string
          copy_attempt?: boolean | null
          created_at?: string | null
          developer_id: string
          device_fingerprint?: string | null
          export_attempt?: boolean | null
          file_path?: string | null
          id?: string
          ip_address?: string | null
          is_outside_hours?: boolean | null
          is_suspicious?: boolean | null
          repository?: string | null
          suspicious_reason?: string | null
          task_id?: string | null
          watermark_applied?: boolean | null
        }
        Update: {
          access_time?: string | null
          action_type?: string
          copy_attempt?: boolean | null
          created_at?: string | null
          developer_id?: string
          device_fingerprint?: string | null
          export_attempt?: boolean | null
          file_path?: string | null
          id?: string
          ip_address?: string | null
          is_outside_hours?: boolean | null
          is_suspicious?: boolean | null
          repository?: string | null
          suspicious_reason?: string | null
          task_id?: string | null
          watermark_applied?: boolean | null
        }
        Relationships: []
      }
      commission_fraud_detection: {
        Row: {
          action_taken: string | null
          amount_flagged: number | null
          auto_hold_applied: boolean | null
          check_type: string
          created_at: string | null
          findings: Json | null
          fraud_probability: number | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          risk_indicators: string[] | null
          status: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          action_taken?: string | null
          amount_flagged?: number | null
          auto_hold_applied?: boolean | null
          check_type: string
          created_at?: string | null
          findings?: Json | null
          fraud_probability?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_indicators?: string[] | null
          status?: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          action_taken?: string | null
          amount_flagged?: number | null
          auto_hold_applied?: boolean | null
          check_type?: string
          created_at?: string | null
          findings?: Json | null
          fraud_probability?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_indicators?: string[] | null
          status?: string | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      compliance_audit_trail: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["app_role"] | null
          compliance_tags: string[] | null
          entity_id: string
          entity_type: string
          geo_location: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          signature: string | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["app_role"] | null
          compliance_tags?: string[] | null
          entity_id: string
          entity_type: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          signature?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["app_role"] | null
          compliance_tags?: string[] | null
          entity_id?: string
          entity_type?: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          signature?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      compliance_logs: {
        Row: {
          compliance_type: string
          created_at: string | null
          id: string
          issue: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          compliance_type: string
          created_at?: string | null
          id?: string
          issue?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          compliance_type?: string
          created_at?: string | null
          id?: string
          issue?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      compliance_status: {
        Row: {
          compliance_score: number | null
          country: string | null
          issues: Json | null
          last_checked: string | null
          notes: string | null
          record_id: string
          region: string
        }
        Insert: {
          compliance_score?: number | null
          country?: string | null
          issues?: Json | null
          last_checked?: string | null
          notes?: string | null
          record_id?: string
          region: string
        }
        Update: {
          compliance_score?: number | null
          country?: string | null
          issues?: Json | null
          last_checked?: string | null
          notes?: string | null
          record_id?: string
          region?: string
        }
        Relationships: []
      }
      compliance_violation_types: {
        Row: {
          applicable_roles: Database["public"]["Enums"]["app_role"][] | null
          auto_trigger_enabled: boolean | null
          category: string
          code: string
          created_at: string | null
          default_penalty_level: number
          description: string | null
          escalation_threshold: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          applicable_roles?: Database["public"]["Enums"]["app_role"][] | null
          auto_trigger_enabled?: boolean | null
          category: string
          code: string
          created_at?: string | null
          default_penalty_level: number
          description?: string | null
          escalation_threshold?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          applicable_roles?: Database["public"]["Enums"]["app_role"][] | null
          auto_trigger_enabled?: boolean | null
          category?: string
          code?: string
          created_at?: string | null
          default_penalty_level?: number
          description?: string | null
          escalation_threshold?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      continents: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      cookie_consents: {
        Row: {
          analytics: boolean | null
          consent_given_at: string | null
          consent_updated_at: string | null
          essential: boolean | null
          id: string
          ip_address: string | null
          marketing: boolean | null
          preferences: boolean | null
          region: string | null
          session_id: string
          third_party: boolean | null
          user_id: string | null
        }
        Insert: {
          analytics?: boolean | null
          consent_given_at?: string | null
          consent_updated_at?: string | null
          essential?: boolean | null
          id?: string
          ip_address?: string | null
          marketing?: boolean | null
          preferences?: boolean | null
          region?: string | null
          session_id: string
          third_party?: boolean | null
          user_id?: string | null
        }
        Update: {
          analytics?: boolean | null
          consent_given_at?: string | null
          consent_updated_at?: string | null
          essential?: boolean | null
          id?: string
          ip_address?: string | null
          marketing?: boolean | null
          preferences?: boolean | null
          region?: string | null
          session_id?: string
          third_party?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          continent_id: string
          created_at: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          code: string
          continent_id: string
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          code?: string
          continent_id?: string
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      crm_customers: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          lead_id: string | null
          name: string
          notes: string | null
          phone: string | null
          total_deals: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lead_id?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          total_deals?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lead_id?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          total_deals?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_customers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          actual_close_date: string | null
          created_at: string
          customer_id: string | null
          expected_close_date: string | null
          id: string
          lead_id: string | null
          notes: string | null
          stage: string | null
          title: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          actual_close_date?: string | null
          created_at?: string
          customer_id?: string | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          stage?: string | null
          title: string
          updated_at?: string
          user_id: string
          value?: number
        }
        Update: {
          actual_close_date?: string | null
          created_at?: string
          customer_id?: string | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          stage?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "crm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          customer_id: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          priority: string | null
          reminder_at: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          reminder_at?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: string | null
          reminder_at?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "crm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_audit_chain: {
        Row: {
          action_type: string
          block_hash: string
          block_number: number
          data_hash: string
          id: string
          is_genesis: boolean | null
          merkle_root: string | null
          metadata: Json | null
          module: string
          nonce: string
          previous_hash: string
          signature: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          block_hash: string
          block_number: number
          data_hash: string
          id?: string
          is_genesis?: boolean | null
          merkle_root?: string | null
          metadata?: Json | null
          module: string
          nonce: string
          previous_hash: string
          signature?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          block_hash?: string
          block_number?: number
          data_hash?: string
          id?: string
          is_genesis?: boolean | null
          merkle_root?: string | null
          metadata?: Json | null
          module?: string
          nonce?: string
          previous_hash?: string
          signature?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      data_residency_config: {
        Row: {
          applicable_regulations: string[] | null
          consent_required_for_transfer: boolean | null
          created_at: string | null
          cross_border_allowed: boolean | null
          data_retention_days: number | null
          encryption_required: boolean | null
          id: string
          is_active: boolean | null
          region_code: string
          region_name: string
          storage_location: string
          updated_at: string | null
        }
        Insert: {
          applicable_regulations?: string[] | null
          consent_required_for_transfer?: boolean | null
          created_at?: string | null
          cross_border_allowed?: boolean | null
          data_retention_days?: number | null
          encryption_required?: boolean | null
          id?: string
          is_active?: boolean | null
          region_code: string
          region_name: string
          storage_location: string
          updated_at?: string | null
        }
        Update: {
          applicable_regulations?: string[] | null
          consent_required_for_transfer?: boolean | null
          created_at?: string | null
          cross_border_allowed?: boolean | null
          data_retention_days?: number | null
          encryption_required?: boolean | null
          id?: string
          is_active?: boolean | null
          region_code?: string
          region_name?: string
          storage_location?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      data_subject_requests: {
        Row: {
          created_at: string | null
          deadline_at: string | null
          export_file_url: string | null
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          regulation: string
          rejection_reason: string | null
          request_type: string
          requested_data_categories: string[] | null
          status: string | null
          user_id: string
          verification_method: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline_at?: string | null
          export_file_url?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          regulation: string
          rejection_reason?: string | null
          request_type: string
          requested_data_categories?: string[] | null
          status?: string | null
          user_id: string
          verification_method?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline_at?: string | null
          export_file_url?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          regulation?: string
          rejection_reason?: string | null
          request_type?: string
          requested_data_categories?: string[] | null
          status?: string | null
          user_id?: string
          verification_method?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      dedicated_support_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_system_message: boolean | null
          message: string
          read_at: string | null
          sender_id: string
          sender_masked_name: string | null
          sender_role: Database["public"]["Enums"]["app_role"]
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          message: string
          read_at?: string | null
          sender_id: string
          sender_masked_name?: string | null
          sender_role: Database["public"]["Enums"]["app_role"]
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          message?: string
          read_at?: string | null
          sender_id?: string
          sender_masked_name?: string | null
          sender_role?: Database["public"]["Enums"]["app_role"]
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dedicated_support_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "dedicated_support_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      dedicated_support_threads: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string
          id: string
          is_urgent: boolean | null
          last_message_at: string | null
          participant_developer_id: string | null
          participant_masked_name: string | null
          prime_user_id: string
          status: string | null
          subject: string
          thread_type: string | null
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          last_message_at?: string | null
          participant_developer_id?: string | null
          participant_masked_name?: string | null
          prime_user_id: string
          status?: string | null
          subject: string
          thread_type?: string | null
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          last_message_at?: string | null
          participant_developer_id?: string | null
          participant_masked_name?: string | null
          prime_user_id?: string
          status?: string | null
          subject?: string
          thread_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dedicated_support_threads_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      demo_analytics: {
        Row: {
          avg_duration_seconds: number | null
          bounce_rate: number | null
          conversion_count: number | null
          conversion_rate: number | null
          created_at: string
          date: string
          demo_id: string
          device_breakdown: Json | null
          id: string
          region_breakdown: Json | null
          top_pages: Json | null
          total_views: number | null
          unique_views: number | null
        }
        Insert: {
          avg_duration_seconds?: number | null
          bounce_rate?: number | null
          conversion_count?: number | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          demo_id: string
          device_breakdown?: Json | null
          id?: string
          region_breakdown?: Json | null
          top_pages?: Json | null
          total_views?: number | null
          unique_views?: number | null
        }
        Update: {
          avg_duration_seconds?: number | null
          bounce_rate?: number | null
          conversion_count?: number | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          demo_id?: string
          device_breakdown?: Json | null
          id?: string
          region_breakdown?: Json | null
          top_pages?: Json | null
          total_views?: number | null
          unique_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_analytics_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_cart: {
        Row: {
          added_at: string
          demo_id: string | null
          id: string
          is_active: boolean | null
          quantity: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string
          demo_id?: string | null
          id?: string
          is_active?: boolean | null
          quantity?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string
          demo_id?: string | null
          id?: string
          is_active?: boolean | null
          quantity?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_cart_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
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
      demo_daily_ids: {
        Row: {
          created_at: string
          created_by: string | null
          daily_id: string
          demo_id: string | null
          generated_date: string
          id: string
          is_active: boolean | null
          sequence_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          daily_id: string
          demo_id?: string | null
          generated_date?: string
          id?: string
          is_active?: boolean | null
          sequence_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          daily_id?: string
          demo_id?: string | null
          generated_date?: string
          id?: string
          is_active?: boolean | null
          sequence_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_daily_ids_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_deployments: {
        Row: {
          approved_domain: string
          approved_ips: string[] | null
          blocked_attempts: number | null
          created_at: string
          created_by: string | null
          daily_demo_id: string
          demo_id: string | null
          deployment_status: string | null
          encryption_key_ref: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_domain_locked: boolean | null
          is_encrypted: boolean | null
          is_obfuscated: boolean | null
          last_verification_at: string | null
          license_key: string
          license_key_hash: string | null
          order_id: string | null
          verification_count: number | null
        }
        Insert: {
          approved_domain: string
          approved_ips?: string[] | null
          blocked_attempts?: number | null
          created_at?: string
          created_by?: string | null
          daily_demo_id: string
          demo_id?: string | null
          deployment_status?: string | null
          encryption_key_ref?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_domain_locked?: boolean | null
          is_encrypted?: boolean | null
          is_obfuscated?: boolean | null
          last_verification_at?: string | null
          license_key: string
          license_key_hash?: string | null
          order_id?: string | null
          verification_count?: number | null
        }
        Update: {
          approved_domain?: string
          approved_ips?: string[] | null
          blocked_attempts?: number | null
          created_at?: string
          created_by?: string | null
          daily_demo_id?: string
          demo_id?: string | null
          deployment_status?: string | null
          encryption_key_ref?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_domain_locked?: boolean | null
          is_encrypted?: boolean | null
          is_obfuscated?: boolean | null
          last_verification_at?: string | null
          license_key?: string
          license_key_hash?: string | null
          order_id?: string | null
          verification_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_deployments_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_deployments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "demo_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_documents: {
        Row: {
          created_at: string
          demo_id: string
          document_type: string
          id: string
          is_public: boolean | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          demo_id: string
          document_type: string
          id?: string
          is_public?: boolean | null
          title: string
          url: string
        }
        Update: {
          created_at?: string
          demo_id?: string
          document_type?: string
          id?: string
          is_public?: boolean | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_documents_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_escalations: {
        Row: {
          acknowledged_at: string | null
          alert_id: string | null
          auto_escalated: boolean | null
          created_at: string
          demo_id: string
          escalated_to_role: Database["public"]["Enums"]["app_role"] | null
          escalated_to_user: string | null
          escalation_level: number | null
          id: string
          reason: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          alert_id?: string | null
          auto_escalated?: boolean | null
          created_at?: string
          demo_id: string
          escalated_to_role?: Database["public"]["Enums"]["app_role"] | null
          escalated_to_user?: string | null
          escalation_level?: number | null
          id?: string
          reason: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          alert_id?: string | null
          auto_escalated?: boolean | null
          created_at?: string
          demo_id?: string
          escalated_to_role?: Database["public"]["Enums"]["app_role"] | null
          escalated_to_user?: string | null
          escalation_level?: number | null
          id?: string
          reason?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_escalations_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "demo_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_escalations_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_favorites: {
        Row: {
          added_at: string
          demo_id: string | null
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string
          demo_id?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string
          demo_id?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_favorites_demo_id_fkey"
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
      demo_login_credentials: {
        Row: {
          created_at: string
          demo_id: string
          id: string
          is_active: boolean | null
          login_url: string | null
          notes: string | null
          password: string
          role_type: string
          username: string
        }
        Insert: {
          created_at?: string
          demo_id: string
          id?: string
          is_active?: boolean | null
          login_url?: string | null
          notes?: string | null
          password: string
          role_type: string
          username: string
        }
        Update: {
          created_at?: string
          demo_id?: string
          id?: string
          is_active?: boolean | null
          login_url?: string | null
          notes?: string | null
          password?: string
          role_type?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_login_credentials_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_login_roles: {
        Row: {
          created_at: string
          created_by: string | null
          demo_id: string
          display_order: number | null
          id: string
          is_active: boolean | null
          password_encrypted: string
          role_name: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          demo_id: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          password_encrypted: string
          role_name: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          demo_id?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          password_encrypted?: string
          role_name?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_login_roles_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_orders: {
        Row: {
          auto_detected: boolean | null
          client_domain: string | null
          client_email: string | null
          client_name: string | null
          created_at: string
          daily_demo_id: string
          demo_id: string | null
          deployed_at: string | null
          deployed_by: string | null
          id: string
          is_live: boolean | null
          is_promoted: boolean | null
          is_verified: boolean | null
          order_number: string
          order_status: string | null
          promoted_at: string | null
          promoted_by: string | null
          requirements: Json | null
          software_package_id: string | null
          status_flow: Json | null
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          auto_detected?: boolean | null
          client_domain?: string | null
          client_email?: string | null
          client_name?: string | null
          created_at?: string
          daily_demo_id: string
          demo_id?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          id?: string
          is_live?: boolean | null
          is_promoted?: boolean | null
          is_verified?: boolean | null
          order_number: string
          order_status?: string | null
          promoted_at?: string | null
          promoted_by?: string | null
          requirements?: Json | null
          software_package_id?: string | null
          status_flow?: Json | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          auto_detected?: boolean | null
          client_domain?: string | null
          client_email?: string | null
          client_name?: string | null
          created_at?: string
          daily_demo_id?: string
          demo_id?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          id?: string
          is_live?: boolean | null
          is_promoted?: boolean | null
          is_verified?: boolean | null
          order_number?: string
          order_status?: string | null
          promoted_at?: string | null
          promoted_by?: string | null
          requirements?: Json | null
          software_package_id?: string | null
          status_flow?: Json | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_orders_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_projects: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          project_name: string
          project_url: string
          tech_stack: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          project_name: string
          project_url: string
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          project_name?: string
          project_url?: string
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      demo_renewal_logs: {
        Row: {
          auto_renewed: boolean | null
          created_at: string
          demo_id: string
          id: string
          new_expiry: string
          notes: string | null
          previous_expiry: string | null
          renewed_by: string | null
        }
        Insert: {
          auto_renewed?: boolean | null
          created_at?: string
          demo_id: string
          id?: string
          new_expiry: string
          notes?: string | null
          previous_expiry?: string | null
          renewed_by?: string | null
        }
        Update: {
          auto_renewed?: boolean | null
          created_at?: string
          demo_id?: string
          id?: string
          new_expiry?: string
          notes?: string | null
          previous_expiry?: string | null
          renewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_renewal_logs_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_rental_links: {
        Row: {
          access_type: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          current_views: number | null
          demo_id: string
          expires_at: string
          franchise_id: string | null
          id: string
          masked_url: string
          max_views: number | null
          notes: string | null
          real_url: string
          rejection_reason: string | null
          requester_id: string
          requester_role: Database["public"]["Enums"]["app_role"]
          reseller_id: string | null
          status: string | null
        }
        Insert: {
          access_type?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          current_views?: number | null
          demo_id: string
          expires_at: string
          franchise_id?: string | null
          id?: string
          masked_url: string
          max_views?: number | null
          notes?: string | null
          real_url: string
          rejection_reason?: string | null
          requester_id: string
          requester_role: Database["public"]["Enums"]["app_role"]
          reseller_id?: string | null
          status?: string | null
        }
        Update: {
          access_type?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          current_views?: number | null
          demo_id?: string
          expires_at?: string
          franchise_id?: string | null
          id?: string
          masked_url?: string
          max_views?: number | null
          notes?: string | null
          real_url?: string
          rejection_reason?: string | null
          requester_id?: string
          requester_role?: Database["public"]["Enums"]["app_role"]
          reseller_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_rental_links_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_report_cards: {
        Row: {
          action_timestamp: string
          action_type: string
          auto_registered: boolean | null
          completion_time_seconds: number | null
          created_at: string
          demo_id: string | null
          demo_name: string
          demo_status: string | null
          error_details: string | null
          fix_details: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          performed_by: string
          performed_by_role: string
          sector: string | null
          sub_category: string | null
          uptime_state: string | null
          workflow_status: string | null
        }
        Insert: {
          action_timestamp?: string
          action_type: string
          auto_registered?: boolean | null
          completion_time_seconds?: number | null
          created_at?: string
          demo_id?: string | null
          demo_name: string
          demo_status?: string | null
          error_details?: string | null
          fix_details?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_by: string
          performed_by_role: string
          sector?: string | null
          sub_category?: string | null
          uptime_state?: string | null
          workflow_status?: string | null
        }
        Update: {
          action_timestamp?: string
          action_type?: string
          auto_registered?: boolean | null
          completion_time_seconds?: number | null
          created_at?: string
          demo_id?: string | null
          demo_name?: string
          demo_status?: string | null
          error_details?: string | null
          fix_details?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_by?: string
          performed_by_role?: string
          sector?: string | null
          sub_category?: string | null
          uptime_state?: string | null
          workflow_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_report_cards_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          client_email: string
          client_name: string
          company_name: string | null
          created_at: string | null
          id: string
          interested_category: string | null
          message: string | null
          notes: string | null
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          status: string | null
        }
        Insert: {
          client_email: string
          client_name: string
          company_name?: string | null
          created_at?: string | null
          id?: string
          interested_category?: string | null
          message?: string | null
          notes?: string | null
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
        }
        Update: {
          client_email?: string
          client_name?: string
          company_name?: string | null
          created_at?: string | null
          id?: string
          interested_category?: string | null
          message?: string | null
          notes?: string | null
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      demo_security_locks: {
        Row: {
          block_reason: string | null
          created_at: string
          deployment_id: string | null
          id: string
          is_authorized: boolean | null
          license_key: string | null
          request_domain: string | null
          request_ip: string | null
          request_user_agent: string | null
          was_auto_blocked: boolean | null
        }
        Insert: {
          block_reason?: string | null
          created_at?: string
          deployment_id?: string | null
          id?: string
          is_authorized?: boolean | null
          license_key?: string | null
          request_domain?: string | null
          request_ip?: string | null
          request_user_agent?: string | null
          was_auto_blocked?: boolean | null
        }
        Update: {
          block_reason?: string | null
          created_at?: string
          deployment_id?: string | null
          id?: string
          is_authorized?: boolean | null
          license_key?: string | null
          request_domain?: string | null
          request_ip?: string | null
          request_user_agent?: string | null
          was_auto_blocked?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_security_locks_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "demo_deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_setup_tasks: {
        Row: {
          assigned_server: string | null
          auto_created: boolean | null
          completed_at: string | null
          created_at: string
          domain_name: string | null
          error_message: string | null
          id: string
          progress_percentage: number | null
          started_at: string | null
          suggestion_id: string | null
          task_description: string | null
          task_status: string | null
          task_type: string
        }
        Insert: {
          assigned_server?: string | null
          auto_created?: boolean | null
          completed_at?: string | null
          created_at?: string
          domain_name?: string | null
          error_message?: string | null
          id?: string
          progress_percentage?: number | null
          started_at?: string | null
          suggestion_id?: string | null
          task_description?: string | null
          task_status?: string | null
          task_type: string
        }
        Update: {
          assigned_server?: string | null
          auto_created?: boolean | null
          completed_at?: string | null
          created_at?: string
          domain_name?: string | null
          error_message?: string | null
          id?: string
          progress_percentage?: number | null
          started_at?: string | null
          suggestion_id?: string | null
          task_description?: string | null
          task_status?: string | null
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_setup_tasks_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "demo_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_software_packages: {
        Row: {
          client_requirements: Json | null
          created_at: string
          demo_id: string | null
          id: string
          is_ready: boolean | null
          is_tested: boolean | null
          order_id: string | null
          package_name: string | null
          package_status: string | null
          ready_at: string | null
          source_demo_snapshot: Json | null
          test_results: Json | null
          tested_at: string | null
          tested_by: string | null
          updated_at: string
        }
        Insert: {
          client_requirements?: Json | null
          created_at?: string
          demo_id?: string | null
          id?: string
          is_ready?: boolean | null
          is_tested?: boolean | null
          order_id?: string | null
          package_name?: string | null
          package_status?: string | null
          ready_at?: string | null
          source_demo_snapshot?: Json | null
          test_results?: Json | null
          tested_at?: string | null
          tested_by?: string | null
          updated_at?: string
        }
        Update: {
          client_requirements?: Json | null
          created_at?: string
          demo_id?: string | null
          id?: string
          is_ready?: boolean | null
          is_tested?: boolean | null
          order_id?: string | null
          package_name?: string | null
          package_status?: string | null
          ready_at?: string | null
          source_demo_snapshot?: Json | null
          test_results?: Json | null
          tested_at?: string | null
          tested_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_software_packages_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_software_packages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "demo_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_suggestions: {
        Row: {
          assigned_server: string | null
          auto_processed: boolean | null
          created_at: string
          demo_id: string | null
          demo_name: string | null
          domain_connected: boolean | null
          domain_connected_at: string | null
          domain_name: string | null
          estimated_completion: string | null
          feature_requests: string | null
          id: string
          is_update_request: boolean | null
          notes: string | null
          parent_suggestion_id: string | null
          required_modules: string[] | null
          server_linked: boolean | null
          server_linked_at: string | null
          setup_completed: boolean | null
          setup_completed_at: string | null
          setup_started: boolean | null
          setup_started_at: string | null
          setup_status: string | null
          submitted_at: string
          task_id: string | null
          updated_at: string
          user_id: string | null
          user_ip: string | null
        }
        Insert: {
          assigned_server?: string | null
          auto_processed?: boolean | null
          created_at?: string
          demo_id?: string | null
          demo_name?: string | null
          domain_connected?: boolean | null
          domain_connected_at?: string | null
          domain_name?: string | null
          estimated_completion?: string | null
          feature_requests?: string | null
          id?: string
          is_update_request?: boolean | null
          notes?: string | null
          parent_suggestion_id?: string | null
          required_modules?: string[] | null
          server_linked?: boolean | null
          server_linked_at?: string | null
          setup_completed?: boolean | null
          setup_completed_at?: string | null
          setup_started?: boolean | null
          setup_started_at?: string | null
          setup_status?: string | null
          submitted_at?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string | null
          user_ip?: string | null
        }
        Update: {
          assigned_server?: string | null
          auto_processed?: boolean | null
          created_at?: string
          demo_id?: string | null
          demo_name?: string | null
          domain_connected?: boolean | null
          domain_connected_at?: string | null
          domain_name?: string | null
          estimated_completion?: string | null
          feature_requests?: string | null
          id?: string
          is_update_request?: boolean | null
          notes?: string | null
          parent_suggestion_id?: string | null
          required_modules?: string[] | null
          server_linked?: boolean | null
          server_linked_at?: string | null
          setup_completed?: boolean | null
          setup_completed_at?: string | null
          setup_started?: boolean | null
          setup_started_at?: string | null
          setup_status?: string | null
          submitted_at?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_suggestions_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_suggestions_parent_suggestion_id_fkey"
            columns: ["parent_suggestion_id"]
            isOneToOne: false
            referencedRelation: "demo_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_technologies: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      demo_validation_logs: {
        Row: {
          created_at: string | null
          demo_id: string | null
          demo_url: string
          error_message: string | null
          http_status: number | null
          id: string
          response_time_ms: number | null
          status: string
          validated_at: string | null
          validated_by: string | null
          validation_type: string
        }
        Insert: {
          created_at?: string | null
          demo_id?: string | null
          demo_url: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          response_time_ms?: number | null
          status?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_type: string
        }
        Update: {
          created_at?: string | null
          demo_id?: string | null
          demo_url?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          response_time_ms?: number | null
          status?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_validation_logs_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_verification_queue: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          demo_id: string | null
          error_message: string | null
          id: string
          last_attempt_at: string | null
          max_attempts: number | null
          priority: number | null
          status: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          demo_id?: string | null
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          priority?: number | null
          status?: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          demo_id?: string | null
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          priority?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_verification_queue_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demos: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          ai_category_suggestion: string | null
          ai_tech_suggestion: string | null
          backup_url: string | null
          category: string
          category_id: string | null
          created_at: string
          created_by: string | null
          demo_banner_text: string | null
          demo_type: string | null
          description: string | null
          disable_destructive: boolean | null
          disable_exports: boolean | null
          expiry_date: string | null
          health_check_interval: number | null
          health_score: number | null
          http_status: number | null
          id: string
          is_bulk_created: boolean | null
          is_trending: boolean | null
          last_health_check: string | null
          last_verified_at: string | null
          lifecycle_status: string | null
          login_url: string | null
          masked_url: string | null
          max_concurrent_logins: number | null
          multi_login_enabled: boolean | null
          normalized_url: string | null
          renewal_date: string | null
          response_time_ms: number | null
          status: Database["public"]["Enums"]["demo_status"]
          tech_stack: Database["public"]["Enums"]["demo_tech_stack"]
          technology_id: string | null
          title: string
          total_login_roles: number | null
          updated_at: string
          uptime_percentage: number | null
          url: string
          verification_status: string | null
          video_fallback_url: string | null
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          ai_category_suggestion?: string | null
          ai_tech_suggestion?: string | null
          backup_url?: string | null
          category: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          demo_banner_text?: string | null
          demo_type?: string | null
          description?: string | null
          disable_destructive?: boolean | null
          disable_exports?: boolean | null
          expiry_date?: string | null
          health_check_interval?: number | null
          health_score?: number | null
          http_status?: number | null
          id?: string
          is_bulk_created?: boolean | null
          is_trending?: boolean | null
          last_health_check?: string | null
          last_verified_at?: string | null
          lifecycle_status?: string | null
          login_url?: string | null
          masked_url?: string | null
          max_concurrent_logins?: number | null
          multi_login_enabled?: boolean | null
          normalized_url?: string | null
          renewal_date?: string | null
          response_time_ms?: number | null
          status?: Database["public"]["Enums"]["demo_status"]
          tech_stack?: Database["public"]["Enums"]["demo_tech_stack"]
          technology_id?: string | null
          title: string
          total_login_roles?: number | null
          updated_at?: string
          uptime_percentage?: number | null
          url: string
          verification_status?: string | null
          video_fallback_url?: string | null
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          ai_category_suggestion?: string | null
          ai_tech_suggestion?: string | null
          backup_url?: string | null
          category?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          demo_banner_text?: string | null
          demo_type?: string | null
          description?: string | null
          disable_destructive?: boolean | null
          disable_exports?: boolean | null
          expiry_date?: string | null
          health_check_interval?: number | null
          health_score?: number | null
          http_status?: number | null
          id?: string
          is_bulk_created?: boolean | null
          is_trending?: boolean | null
          last_health_check?: string | null
          last_verified_at?: string | null
          lifecycle_status?: string | null
          login_url?: string | null
          masked_url?: string | null
          max_concurrent_logins?: number | null
          multi_login_enabled?: boolean | null
          normalized_url?: string | null
          renewal_date?: string | null
          response_time_ms?: number | null
          status?: Database["public"]["Enums"]["demo_status"]
          tech_stack?: Database["public"]["Enums"]["demo_tech_stack"]
          technology_id?: string | null
          title?: string
          total_login_roles?: number | null
          updated_at?: string
          uptime_percentage?: number | null
          url?: string
          verification_status?: string | null
          video_fallback_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "demo_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demos_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "demo_technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      dev_performance: {
        Row: {
          dev_id: string | null
          final_score: number | null
          record_id: string
          score_behavior: number | null
          score_delivery: number | null
          score_speed: number | null
          task_id: string | null
          timestamp: string
        }
        Insert: {
          dev_id?: string | null
          final_score?: number | null
          record_id?: string
          score_behavior?: number | null
          score_delivery?: number | null
          score_speed?: number | null
          task_id?: string | null
          timestamp?: string
        }
        Update: {
          dev_id?: string | null
          final_score?: number | null
          record_id?: string
          score_behavior?: number | null
          score_delivery?: number | null
          score_speed?: number | null
          task_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      dev_timer: {
        Row: {
          created_at: string
          dev_id: string | null
          pause_timestamp: string | null
          start_timestamp: string | null
          stop_timestamp: string | null
          task_id: string | null
          timer_id: string
          total_seconds: number | null
        }
        Insert: {
          created_at?: string
          dev_id?: string | null
          pause_timestamp?: string | null
          start_timestamp?: string | null
          stop_timestamp?: string | null
          task_id?: string | null
          timer_id?: string
          total_seconds?: number | null
        }
        Update: {
          created_at?: string
          dev_id?: string | null
          pause_timestamp?: string | null
          start_timestamp?: string | null
          stop_timestamp?: string | null
          task_id?: string | null
          timer_id?: string
          total_seconds?: number | null
        }
        Relationships: []
      }
      developer_activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          developer_id: string
          device_info: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          developer_id: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          developer_id?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "developer_activity_logs_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_assignment_priority: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assignment_type: string | null
          created_at: string
          developer_id: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          prime_user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_type?: string | null
          created_at?: string
          developer_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          prime_user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_type?: string | null
          created_at?: string
          developer_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          prime_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_assignment_priority_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "developer_assignment_priority_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_code_submissions: {
        Row: {
          ai_review_feedback: string | null
          ai_review_score: number | null
          commit_message: string | null
          created_at: string
          developer_id: string
          file_urls: Json | null
          id: string
          notes: string | null
          review_notes: string | null
          review_status: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submission_type: string
          task_id: string
        }
        Insert: {
          ai_review_feedback?: string | null
          ai_review_score?: number | null
          commit_message?: string | null
          created_at?: string
          developer_id: string
          file_urls?: Json | null
          id?: string
          notes?: string | null
          review_notes?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submission_type?: string
          task_id: string
        }
        Update: {
          ai_review_feedback?: string | null
          ai_review_score?: number | null
          commit_message?: string | null
          created_at?: string
          developer_id?: string
          file_urls?: Json | null
          id?: string
          notes?: string | null
          review_notes?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submission_type?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_code_submissions_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "developer_code_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_system_message: boolean | null
          message: string
          sender_id: string
          sender_role: Database["public"]["Enums"]["app_role"]
          task_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          message: string
          sender_id: string
          sender_role: Database["public"]["Enums"]["app_role"]
          task_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_system_message?: boolean | null
          message?: string
          sender_id?: string
          sender_role?: Database["public"]["Enums"]["app_role"]
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_messages_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_past_projects: {
        Row: {
          created_at: string
          demo_url: string | null
          demo_video_url: string | null
          duration_months: number | null
          id: string
          is_verified: boolean | null
          project_description: string | null
          project_name: string
          project_url: string | null
          registration_id: string
          role_in_project: string | null
          technologies_used: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          demo_url?: string | null
          demo_video_url?: string | null
          duration_months?: number | null
          id?: string
          is_verified?: boolean | null
          project_description?: string | null
          project_name: string
          project_url?: string | null
          registration_id: string
          role_in_project?: string | null
          technologies_used?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          demo_url?: string | null
          demo_video_url?: string | null
          duration_months?: number | null
          id?: string
          is_verified?: boolean | null
          project_description?: string | null
          project_name?: string
          project_url?: string | null
          registration_id?: string
          role_in_project?: string | null
          technologies_used?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_past_projects_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "developer_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_registrations: {
        Row: {
          account_holder_name: string | null
          account_number_masked: string | null
          bank_details_verified: boolean | null
          bank_name: string | null
          country: string | null
          created_at: string
          databases: string[] | null
          email: string
          expertise_level: string | null
          frameworks: string[] | null
          full_name: string
          id: string
          ifsc_code: string | null
          nda_accepted: boolean | null
          nda_accepted_at: string | null
          nda_document_url: string | null
          phone: string | null
          photo_id_uploaded_at: string | null
          photo_id_url: string | null
          photo_id_verified: boolean | null
          primary_skills: string[] | null
          programming_languages: string[] | null
          rejection_reason: string | null
          resume_uploaded_at: string | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          rules_accepted: boolean | null
          rules_accepted_at: string | null
          secondary_skills: string[] | null
          status: Database["public"]["Enums"]["developer_verification_status"]
          submitted_at: string | null
          timezone: string | null
          tools: string[] | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          years_of_experience: number | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number_masked?: string | null
          bank_details_verified?: boolean | null
          bank_name?: string | null
          country?: string | null
          created_at?: string
          databases?: string[] | null
          email: string
          expertise_level?: string | null
          frameworks?: string[] | null
          full_name: string
          id?: string
          ifsc_code?: string | null
          nda_accepted?: boolean | null
          nda_accepted_at?: string | null
          nda_document_url?: string | null
          phone?: string | null
          photo_id_uploaded_at?: string | null
          photo_id_url?: string | null
          photo_id_verified?: boolean | null
          primary_skills?: string[] | null
          programming_languages?: string[] | null
          rejection_reason?: string | null
          resume_uploaded_at?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rules_accepted?: boolean | null
          rules_accepted_at?: string | null
          secondary_skills?: string[] | null
          status?: Database["public"]["Enums"]["developer_verification_status"]
          submitted_at?: string | null
          timezone?: string | null
          tools?: string[] | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          years_of_experience?: number | null
        }
        Update: {
          account_holder_name?: string | null
          account_number_masked?: string | null
          bank_details_verified?: boolean | null
          bank_name?: string | null
          country?: string | null
          created_at?: string
          databases?: string[] | null
          email?: string
          expertise_level?: string | null
          frameworks?: string[] | null
          full_name?: string
          id?: string
          ifsc_code?: string | null
          nda_accepted?: boolean | null
          nda_accepted_at?: string | null
          nda_document_url?: string | null
          phone?: string | null
          photo_id_uploaded_at?: string | null
          photo_id_url?: string | null
          photo_id_verified?: boolean | null
          primary_skills?: string[] | null
          programming_languages?: string[] | null
          rejection_reason?: string | null
          resume_uploaded_at?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rules_accepted?: boolean | null
          rules_accepted_at?: string | null
          secondary_skills?: string[] | null
          status?: Database["public"]["Enums"]["developer_verification_status"]
          submitted_at?: string | null
          timezone?: string | null
          tools?: string[] | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      developer_skills: {
        Row: {
          created_at: string
          developer_id: string
          id: string
          proficiency_level: string | null
          skill_name: string
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          developer_id: string
          id?: string
          proficiency_level?: string | null
          skill_name: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          developer_id?: string
          id?: string
          proficiency_level?: string | null
          skill_name?: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "developer_skills_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_tasks: {
        Row: {
          accepted_at: string | null
          actual_delivery_at: string | null
          assigned_by: string | null
          buzzer_acknowledged_at: string | null
          buzzer_active: boolean | null
          category: string
          checkpoint_status: string | null
          client_id: string | null
          client_rating: number | null
          completed_at: string | null
          created_at: string
          deadline: string | null
          delivery_notes: string | null
          description: string | null
          developer_id: string | null
          estimated_hours: number | null
          id: string
          masked_client_info: Json | null
          max_delivery_hours: number | null
          pause_reason: string | null
          paused_at: string | null
          penalty_amount: number | null
          priority: string | null
          promised_at: string | null
          promised_delivery_at: string | null
          quality_score: number | null
          sla_hours: number | null
          started_at: string | null
          status: string
          task_amount: number | null
          tech_stack: string[] | null
          title: string
          total_paused_minutes: number | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          actual_delivery_at?: string | null
          assigned_by?: string | null
          buzzer_acknowledged_at?: string | null
          buzzer_active?: boolean | null
          category: string
          checkpoint_status?: string | null
          client_id?: string | null
          client_rating?: number | null
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          delivery_notes?: string | null
          description?: string | null
          developer_id?: string | null
          estimated_hours?: number | null
          id?: string
          masked_client_info?: Json | null
          max_delivery_hours?: number | null
          pause_reason?: string | null
          paused_at?: string | null
          penalty_amount?: number | null
          priority?: string | null
          promised_at?: string | null
          promised_delivery_at?: string | null
          quality_score?: number | null
          sla_hours?: number | null
          started_at?: string | null
          status?: string
          task_amount?: number | null
          tech_stack?: string[] | null
          title: string
          total_paused_minutes?: number | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          actual_delivery_at?: string | null
          assigned_by?: string | null
          buzzer_acknowledged_at?: string | null
          buzzer_active?: boolean | null
          category?: string
          checkpoint_status?: string | null
          client_id?: string | null
          client_rating?: number | null
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          delivery_notes?: string | null
          description?: string | null
          developer_id?: string | null
          estimated_hours?: number | null
          id?: string
          masked_client_info?: Json | null
          max_delivery_hours?: number | null
          pause_reason?: string | null
          paused_at?: string | null
          penalty_amount?: number | null
          priority?: string | null
          promised_at?: string | null
          promised_delivery_at?: string | null
          quality_score?: number | null
          sla_hours?: number | null
          started_at?: string | null
          status?: string
          task_amount?: number | null
          tech_stack?: string[] | null
          title?: string
          total_paused_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_tasks_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_timer_logs: {
        Row: {
          action: string
          checkpoint_type: string | null
          developer_id: string
          elapsed_minutes: number | null
          id: string
          metadata: Json | null
          pause_reason: string | null
          task_id: string
          timestamp: string
        }
        Insert: {
          action: string
          checkpoint_type?: string | null
          developer_id: string
          elapsed_minutes?: number | null
          id?: string
          metadata?: Json | null
          pause_reason?: string | null
          task_id: string
          timestamp?: string
        }
        Update: {
          action?: string
          checkpoint_type?: string | null
          developer_id?: string
          elapsed_minutes?: number | null
          id?: string
          metadata?: Json | null
          pause_reason?: string | null
          task_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_timer_logs_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "developer_timer_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_violations: {
        Row: {
          acknowledged_at: string | null
          auto_generated: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          developer_id: string
          id: string
          is_acknowledged: boolean | null
          penalty_amount: number | null
          severity: string
          task_id: string | null
          violation_type: string
        }
        Insert: {
          acknowledged_at?: string | null
          auto_generated?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          developer_id: string
          id?: string
          is_acknowledged?: boolean | null
          penalty_amount?: number | null
          severity?: string
          task_id?: string | null
          violation_type: string
        }
        Update: {
          acknowledged_at?: string | null
          auto_generated?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          developer_id?: string
          id?: string
          is_acknowledged?: boolean | null
          penalty_amount?: number | null
          severity?: string
          task_id?: string | null
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_violations_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "developer_violations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_wallet: {
        Row: {
          available_balance: number
          created_at: string
          developer_id: string
          id: string
          last_payout_at: string | null
          pending_balance: number
          total_earned: number
          total_penalties: number
          total_withdrawn: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          developer_id: string
          id?: string
          last_payout_at?: string | null
          pending_balance?: number
          total_earned?: number
          total_penalties?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          developer_id?: string
          id?: string
          last_payout_at?: string | null
          pending_balance?: number
          total_earned?: number
          total_penalties?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_wallet_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: true
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          developer_id: string
          id: string
          reference_id: string | null
          reference_type: string | null
          status: string | null
          task_id: string | null
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          developer_id: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          task_id?: string | null
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          developer_id?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          task_id?: string | null
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_wallet_transactions_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "developer_wallet_transactions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "developer_wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "developer_wallet"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_work_logs: {
        Row: {
          compliance_status: string | null
          created_at: string | null
          date: string
          developer_id: string
          id: string
          late_penalties_applied: number | null
          notes: string | null
          overtime_consent_given: boolean | null
          overtime_minutes: number | null
          tasks_assigned: number | null
          tasks_completed: number | null
          total_break_minutes: number | null
          total_work_minutes: number | null
          voluntary_acceptance_rate: number | null
        }
        Insert: {
          compliance_status?: string | null
          created_at?: string | null
          date: string
          developer_id: string
          id?: string
          late_penalties_applied?: number | null
          notes?: string | null
          overtime_consent_given?: boolean | null
          overtime_minutes?: number | null
          tasks_assigned?: number | null
          tasks_completed?: number | null
          total_break_minutes?: number | null
          total_work_minutes?: number | null
          voluntary_acceptance_rate?: number | null
        }
        Update: {
          compliance_status?: string | null
          created_at?: string | null
          date?: string
          developer_id?: string
          id?: string
          late_penalties_applied?: number | null
          notes?: string | null
          overtime_consent_given?: boolean | null
          overtime_minutes?: number | null
          tasks_assigned?: number | null
          tasks_completed?: number | null
          total_break_minutes?: number | null
          total_work_minutes?: number | null
          voluntary_acceptance_rate?: number | null
        }
        Relationships: []
      }
      developers: {
        Row: {
          availability_status: string | null
          created_at: string
          current_task_id: string | null
          email: string
          frozen_at: string | null
          frozen_reason: string | null
          full_name: string
          id: string
          is_frozen: boolean | null
          joined_at: string | null
          masked_email: string | null
          masked_phone: string | null
          onboarding_completed: boolean | null
          phone: string | null
          skill_test_score: number | null
          skill_test_status: string | null
          status: string
          total_strikes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_status?: string | null
          created_at?: string
          current_task_id?: string | null
          email: string
          frozen_at?: string | null
          frozen_reason?: string | null
          full_name: string
          id?: string
          is_frozen?: boolean | null
          joined_at?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          skill_test_score?: number | null
          skill_test_status?: string | null
          status?: string
          total_strikes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_status?: string | null
          created_at?: string
          current_task_id?: string | null
          email?: string
          frozen_at?: string | null
          frozen_reason?: string | null
          full_name?: string
          id?: string
          is_frozen?: boolean | null
          joined_at?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          skill_test_score?: number | null
          skill_test_status?: string | null
          status?: string
          total_strikes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      device_fingerprints: {
        Row: {
          blocked_reason: string | null
          browser: string | null
          created_at: string | null
          device_info: Json | null
          fingerprint_hash: string
          first_seen_at: string | null
          id: string
          is_blocked: boolean | null
          is_primary: boolean | null
          is_trusted: boolean | null
          language: string | null
          last_seen_at: string | null
          login_count: number | null
          os: string | null
          screen_resolution: string | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          blocked_reason?: string | null
          browser?: string | null
          created_at?: string | null
          device_info?: Json | null
          fingerprint_hash: string
          first_seen_at?: string | null
          id?: string
          is_blocked?: boolean | null
          is_primary?: boolean | null
          is_trusted?: boolean | null
          language?: string | null
          last_seen_at?: string | null
          login_count?: number | null
          os?: string | null
          screen_resolution?: string | null
          timezone?: string | null
          user_id: string
        }
        Update: {
          blocked_reason?: string | null
          browser?: string | null
          created_at?: string | null
          device_info?: Json | null
          fingerprint_hash?: string
          first_seen_at?: string | null
          id?: string
          is_blocked?: boolean | null
          is_primary?: boolean | null
          is_trusted?: boolean | null
          language?: string | null
          last_seen_at?: string | null
          login_count?: number | null
          os?: string | null
          screen_resolution?: string | null
          timezone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_events: {
        Row: {
          action: string
          affected_modules: string[] | null
          boss_id: string | null
          event_id: string
          reason: string
          timestamp: string | null
        }
        Insert: {
          action: string
          affected_modules?: string[] | null
          boss_id?: string | null
          event_id?: string
          reason: string
          timestamp?: string | null
        }
        Update: {
          action?: string
          affected_modules?: string[] | null
          boss_id?: string | null
          event_id?: string
          reason?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_events_boss_id_fkey"
            columns: ["boss_id"]
            isOneToOne: false
            referencedRelation: "boss_accounts"
            referencedColumns: ["boss_id"]
          },
        ]
      }
      encrypted_vault: {
        Row: {
          access_count: number | null
          access_level: string
          allowed_roles: string[] | null
          auth_tag: string | null
          created_at: string
          data_type: string
          encrypted_data: string
          encryption_key_hash: string
          expires_at: string | null
          id: string
          is_archived: boolean | null
          iv: string
          last_accessed_at: string | null
          last_accessed_by: string | null
          owner_id: string
        }
        Insert: {
          access_count?: number | null
          access_level: string
          allowed_roles?: string[] | null
          auth_tag?: string | null
          created_at?: string
          data_type: string
          encrypted_data: string
          encryption_key_hash: string
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          iv: string
          last_accessed_at?: string | null
          last_accessed_by?: string | null
          owner_id: string
        }
        Update: {
          access_count?: number | null
          access_level?: string
          allowed_roles?: string[] | null
          auth_tag?: string | null
          created_at?: string
          data_type?: string
          encrypted_data?: string
          encryption_key_hash?: string
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          iv?: string
          last_accessed_at?: string | null
          last_accessed_by?: string | null
          owner_id?: string
        }
        Relationships: []
      }
      escalation_records: {
        Row: {
          auto_escalated: boolean | null
          created_at: string
          developer_id: string | null
          escalated_to: string | null
          escalated_to_role: Database["public"]["Enums"]["app_role"] | null
          escalation_level: number | null
          id: string
          idle_minutes: number | null
          is_resolved: boolean | null
          reason: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          task_id: string
        }
        Insert: {
          auto_escalated?: boolean | null
          created_at?: string
          developer_id?: string | null
          escalated_to?: string | null
          escalated_to_role?: Database["public"]["Enums"]["app_role"] | null
          escalation_level?: number | null
          id?: string
          idle_minutes?: number | null
          is_resolved?: boolean | null
          reason: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          task_id: string
        }
        Update: {
          auto_escalated?: boolean | null
          created_at?: string
          developer_id?: string | null
          escalated_to?: string | null
          escalated_to_role?: Database["public"]["Enums"]["app_role"] | null
          escalation_level?: number | null
          id?: string
          idle_minutes?: number | null
          is_resolved?: boolean | null
          reason?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalation_records_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalation_records_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_login_attempts: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          device_fingerprint: string | null
          email: string | null
          id: string
          ip_address: string | null
          is_locked: boolean | null
          last_attempt_at: string | null
          locked_until: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          device_fingerprint?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          is_locked?: boolean | null
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          device_fingerprint?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          is_locked?: boolean | null
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          enabled: boolean | null
          flag_key: string
          flag_name: string | null
          id: string
          module_id: string | null
          rollout_percentage: number | null
          target_roles: Database["public"]["Enums"]["app_role"][] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          flag_key: string
          flag_name?: string | null
          id?: string
          module_id?: string | null
          rollout_percentage?: number | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          flag_key?: string
          flag_name?: string | null
          id?: string
          module_id?: string | null
          rollout_percentage?: number | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "product_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      festival_calendar: {
        Row: {
          country_codes: string[] | null
          created_at: string | null
          day: number
          default_discount: number | null
          description: string | null
          duration_days: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          month: number
          name: string
          theme_primary: string | null
          theme_secondary: string | null
        }
        Insert: {
          country_codes?: string[] | null
          created_at?: string | null
          day: number
          default_discount?: number | null
          description?: string | null
          duration_days?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          month: number
          name: string
          theme_primary?: string | null
          theme_secondary?: string | null
        }
        Update: {
          country_codes?: string[] | null
          created_at?: string | null
          day?: number
          default_discount?: number | null
          description?: string | null
          duration_days?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          month?: number
          name?: string
          theme_primary?: string | null
          theme_secondary?: string | null
        }
        Relationships: []
      }
      firewall_rules: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          ip_range: string | null
          is_active: boolean | null
          port_range: string | null
          protocol: string | null
          rule_name: string
          rule_type: string
          server_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          ip_range?: string | null
          is_active?: boolean | null
          port_range?: string | null
          protocol?: string | null
          rule_name: string
          rule_type?: string
          server_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          ip_range?: string | null
          is_active?: boolean | null
          port_range?: string | null
          protocol?: string | null
          rule_name?: string
          rule_type?: string
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "firewall_rules_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_accounts: {
        Row: {
          address: string | null
          business_name: string
          city: string | null
          commission_rate: number | null
          country: string | null
          created_at: string
          email: string
          exclusive_rights: boolean | null
          franchise_code: string
          gst_number: string | null
          id: string
          joined_at: string | null
          kyc_documents: Json | null
          kyc_status: string | null
          masked_email: string | null
          masked_phone: string | null
          owner_name: string
          pan_number: string | null
          phone: string
          pincode: string | null
          sales_target_monthly: number | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          business_name: string
          city?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          email: string
          exclusive_rights?: boolean | null
          franchise_code: string
          gst_number?: string | null
          id?: string
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          owner_name: string
          pan_number?: string | null
          phone: string
          pincode?: string | null
          sales_target_monthly?: number | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          email?: string
          exclusive_rights?: boolean | null
          franchise_code?: string
          gst_number?: string | null
          id?: string
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          owner_name?: string
          pan_number?: string | null
          phone?: string
          pincode?: string | null
          sales_target_monthly?: number | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      franchise_commissions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bonus_amount: number | null
          commission_amount: number
          commission_rate: number
          created_at: string
          credited_at: string | null
          description: string | null
          franchise_id: string
          id: string
          lead_id: string | null
          metadata: Json | null
          sale_amount: number
          status: string | null
          type: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bonus_amount?: number | null
          commission_amount: number
          commission_rate: number
          created_at?: string
          credited_at?: string | null
          description?: string | null
          franchise_id: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          sale_amount: number
          status?: string | null
          type: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bonus_amount?: number | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          credited_at?: string | null
          description?: string | null
          franchise_id?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          sale_amount?: number
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_commissions_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_contracts: {
        Row: {
          auto_renew: boolean | null
          commission_terms: Json | null
          contract_number: string
          contract_type: string | null
          created_at: string
          document_url: string | null
          end_date: string
          franchise_id: string
          id: string
          renewal_date: string | null
          signed_at: string | null
          signed_by: string | null
          start_date: string
          status: string | null
          terms: Json | null
          territory_terms: Json | null
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean | null
          commission_terms?: Json | null
          contract_number: string
          contract_type?: string | null
          created_at?: string
          document_url?: string | null
          end_date: string
          franchise_id: string
          id?: string
          renewal_date?: string | null
          signed_at?: string | null
          signed_by?: string | null
          start_date: string
          status?: string | null
          terms?: Json | null
          territory_terms?: Json | null
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean | null
          commission_terms?: Json | null
          contract_number?: string
          contract_type?: string | null
          created_at?: string
          document_url?: string | null
          end_date?: string
          franchise_id?: string
          id?: string
          renewal_date?: string | null
          signed_at?: string | null
          signed_by?: string | null
          start_date?: string
          status?: string | null
          terms?: Json | null
          territory_terms?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_contracts_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_escalations: {
        Row: {
          attachments: Json | null
          created_at: string
          description: string
          escalated_to: string | null
          escalation_type: string
          franchise_id: string
          id: string
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          subject: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          description: string
          escalated_to?: string | null
          escalation_type: string
          franchise_id: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          description?: string
          escalated_to?: string | null
          escalation_type?: string
          franchise_id?: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_escalations_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_leads: {
        Row: {
          assigned_at: string | null
          assigned_to_reseller: string | null
          city: string | null
          closed_at: string | null
          commission_earned: number | null
          created_at: string
          demo_assigned_id: string | null
          demo_requested: boolean | null
          franchise_id: string
          id: string
          industry: string | null
          language_preference: string | null
          last_activity_at: string | null
          lead_name: string
          lead_score: number | null
          masked_contact: string | null
          original_lead_id: string | null
          region: string | null
          sale_value: number | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to_reseller?: string | null
          city?: string | null
          closed_at?: string | null
          commission_earned?: number | null
          created_at?: string
          demo_assigned_id?: string | null
          demo_requested?: boolean | null
          franchise_id: string
          id?: string
          industry?: string | null
          language_preference?: string | null
          last_activity_at?: string | null
          lead_name: string
          lead_score?: number | null
          masked_contact?: string | null
          original_lead_id?: string | null
          region?: string | null
          sale_value?: number | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to_reseller?: string | null
          city?: string | null
          closed_at?: string | null
          commission_earned?: number | null
          created_at?: string
          demo_assigned_id?: string | null
          demo_requested?: boolean | null
          franchise_id?: string
          id?: string
          industry?: string | null
          language_preference?: string | null
          last_activity_at?: string | null
          lead_name?: string
          lead_score?: number | null
          masked_contact?: string | null
          original_lead_id?: string | null
          region?: string | null
          sale_value?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_leads_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchise_leads_original_lead_id_fkey"
            columns: ["original_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_payouts: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          bank_details: Json | null
          created_at: string
          franchise_id: string
          id: string
          notes: string | null
          payment_method: string | null
          processed_at: string | null
          requested_at: string | null
          status: string | null
          transaction_ref: string | null
          type: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          created_at?: string
          franchise_id: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          transaction_ref?: string | null
          type: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          created_at?: string
          franchise_id?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          transaction_ref?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_payouts_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_renewals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          contract_id: string
          created_at: string
          franchise_id: string
          id: string
          new_end_date: string
          notes: string | null
          previous_end_date: string
          renewal_fee: number | null
          requested_at: string | null
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          contract_id: string
          created_at?: string
          franchise_id: string
          id?: string
          new_end_date: string
          notes?: string | null
          previous_end_date: string
          renewal_fee?: number | null
          requested_at?: string | null
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          contract_id?: string
          created_at?: string
          franchise_id?: string
          id?: string
          new_end_date?: string
          notes?: string | null
          previous_end_date?: string
          renewal_fee?: number | null
          requested_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_renewals_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "franchise_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchise_renewals_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_territories: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string
          franchise_id: string
          id: string
          is_active: boolean | null
          is_exclusive: boolean | null
          override_approved_by: string | null
          override_reason: string | null
          parent_territory_id: string | null
          territory_code: string | null
          territory_name: string
          territory_type: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          franchise_id: string
          id?: string
          is_active?: boolean | null
          is_exclusive?: boolean | null
          override_approved_by?: string | null
          override_reason?: string | null
          parent_territory_id?: string | null
          territory_code?: string | null
          territory_name: string
          territory_type: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          franchise_id?: string
          id?: string
          is_active?: boolean | null
          is_exclusive?: boolean | null
          override_approved_by?: string | null
          override_reason?: string | null
          parent_territory_id?: string | null
          territory_code?: string | null
          territory_name?: string
          territory_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_territories_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchise_territories_parent_territory_id_fkey"
            columns: ["parent_territory_id"]
            isOneToOne: false
            referencedRelation: "franchise_territories"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_training_scores: {
        Row: {
          ai_feedback: string | null
          certificate_issued: boolean | null
          certificate_url: string | null
          completed_at: string | null
          created_at: string
          franchise_id: string
          id: string
          max_score: number | null
          module_name: string
          module_type: string | null
          score: number
        }
        Insert: {
          ai_feedback?: string | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          franchise_id: string
          id?: string
          max_score?: number | null
          module_name: string
          module_type?: string | null
          score: number
        }
        Update: {
          ai_feedback?: string | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          franchise_id?: string
          id?: string
          max_score?: number | null
          module_name?: string
          module_type?: string | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "franchise_training_scores_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_wallet_ledger: {
        Row: {
          amount: number
          balance_after: number
          category: string
          created_at: string
          description: string | null
          franchise_id: string
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          balance_after: number
          category: string
          created_at?: string
          description?: string | null
          franchise_id: string
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          category?: string
          created_at?: string
          description?: string | null
          franchise_id?: string
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_wallet_ledger_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          alert_id: string
          flagged_by_ai: boolean | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          status: string | null
          timestamp: string
          type: string
          user_id: string | null
        }
        Insert: {
          alert_id?: string
          flagged_by_ai?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          timestamp?: string
          type: string
          user_id?: string | null
        }
        Update: {
          alert_id?: string
          flagged_by_ai?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          timestamp?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fraud_scores: {
        Row: {
          behavior_score: number | null
          click_score: number | null
          created_at: string | null
          device_score: number | null
          id: string
          identity_score: number | null
          last_calculated_at: string | null
          overall_score: number | null
          requires_review: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_factors: string[] | null
          risk_level: string | null
          transaction_score: number | null
          user_id: string
        }
        Insert: {
          behavior_score?: number | null
          click_score?: number | null
          created_at?: string | null
          device_score?: number | null
          id?: string
          identity_score?: number | null
          last_calculated_at?: string | null
          overall_score?: number | null
          requires_review?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_factors?: string[] | null
          risk_level?: string | null
          transaction_score?: number | null
          user_id: string
        }
        Update: {
          behavior_score?: number | null
          click_score?: number | null
          created_at?: string | null
          device_score?: number | null
          id?: string
          identity_score?: number | null
          last_calculated_at?: string | null
          overall_score?: number | null
          requires_review?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_factors?: string[] | null
          risk_level?: string | null
          transaction_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      frozen_accounts: {
        Row: {
          freeze_date: string | null
          freeze_reason: string
          frozen_by: string | null
          id: string
          status: string | null
          unfreeze_date: string | null
          user_id: string
        }
        Insert: {
          freeze_date?: string | null
          freeze_reason: string
          frozen_by?: string | null
          id?: string
          status?: string | null
          unfreeze_date?: string | null
          user_id: string
        }
        Update: {
          freeze_date?: string | null
          freeze_reason?: string
          frozen_by?: string | null
          id?: string
          status?: string | null
          unfreeze_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      global_offers: {
        Row: {
          banner_text: string | null
          country_code: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_percentage: number
          end_date: string
          event_name: string | null
          event_type: Database["public"]["Enums"]["offer_event_type"]
          icon: string | null
          id: string
          is_active: boolean | null
          is_auto_detected: boolean | null
          start_date: string
          theme_accent_color: string | null
          theme_primary_color: string | null
          theme_secondary_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_text?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_percentage?: number
          end_date: string
          event_name?: string | null
          event_type?: Database["public"]["Enums"]["offer_event_type"]
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_detected?: boolean | null
          start_date: string
          theme_accent_color?: string | null
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_text?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_percentage?: number
          end_date?: string
          event_name?: string | null
          event_type?: Database["public"]["Enums"]["offer_event_type"]
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_detected?: boolean | null
          start_date?: string
          theme_accent_color?: string | null
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hr_applicants: {
        Row: {
          created_at: string | null
          experience_years: number | null
          full_name: string
          id: string
          masked_email: string | null
          masked_phone: string | null
          notes: string | null
          portfolio_url: string | null
          position: string
          resume_path: string | null
          screening_score: number | null
          skills_json: Json | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          masked_email?: string | null
          masked_phone?: string | null
          notes?: string | null
          portfolio_url?: string | null
          position: string
          resume_path?: string | null
          screening_score?: number | null
          skills_json?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          masked_email?: string | null
          masked_phone?: string | null
          notes?: string | null
          portfolio_url?: string | null
          position?: string
          resume_path?: string | null
          screening_score?: number | null
          skills_json?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hr_interviews: {
        Row: {
          applicant_id: string
          conducted_at: string | null
          created_at: string | null
          feedback: string | null
          id: string
          interview_type: string | null
          interviewer_id: string
          recommendation: string | null
          scheduled_at: string
          score: number | null
          status: string | null
        }
        Insert: {
          applicant_id: string
          conducted_at?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interview_type?: string | null
          interviewer_id: string
          recommendation?: string | null
          scheduled_at: string
          score?: number | null
          status?: string | null
        }
        Update: {
          applicant_id?: string
          conducted_at?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interview_type?: string | null
          interviewer_id?: string
          recommendation?: string | null
          scheduled_at?: string
          score?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_interviews_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "hr_applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      immutable_security_log: {
        Row: {
          action_details: Json | null
          created_at: string | null
          device_fingerprint: string | null
          event_type: string
          id: string
          ip_address: string | null
          signature: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action_details?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          signature?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action_details?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          signature?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      incidents: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          incident_id: string
          reported_by: string | null
          resolution: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          incident_id?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          incident_id?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      influencer_accounts: {
        Row: {
          city: string | null
          commission_tier: string | null
          country: string | null
          cpa_rate: number | null
          cpc_rate: number | null
          cpl_rate: number | null
          created_at: string
          email: string
          fraud_score: number | null
          full_name: string
          id: string
          is_suspended: boolean | null
          joined_at: string | null
          kyc_documents: Json | null
          kyc_status: string | null
          masked_email: string | null
          masked_phone: string | null
          phone: string | null
          region: string | null
          social_platforms: Json | null
          status: string | null
          suspended_at: string | null
          suspension_reason: string | null
          total_clicks: number | null
          total_conversions: number | null
          total_earned: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          commission_tier?: string | null
          country?: string | null
          cpa_rate?: number | null
          cpc_rate?: number | null
          cpl_rate?: number | null
          created_at?: string
          email: string
          fraud_score?: number | null
          full_name: string
          id?: string
          is_suspended?: boolean | null
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          phone?: string | null
          region?: string | null
          social_platforms?: Json | null
          status?: string | null
          suspended_at?: string | null
          suspension_reason?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_earned?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          commission_tier?: string | null
          country?: string | null
          cpa_rate?: number | null
          cpc_rate?: number | null
          cpl_rate?: number | null
          created_at?: string
          email?: string
          fraud_score?: number | null
          full_name?: string
          id?: string
          is_suspended?: boolean | null
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          phone?: string | null
          region?: string | null
          social_platforms?: Json | null
          status?: string | null
          suspended_at?: string | null
          suspension_reason?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_earned?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      influencer_audit_trail: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          id: string
          influencer_id: string
          ip_address: string | null
          metadata: Json | null
          performed_by: string | null
          performer_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          id?: string
          influencer_id: string
          ip_address?: string | null
          metadata?: Json | null
          performed_by?: string | null
          performer_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          id?: string
          influencer_id?: string
          ip_address?: string | null
          metadata?: Json | null
          performed_by?: string | null
          performer_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_audit_trail_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_campaign_map: {
        Row: {
          achieved_clicks: number | null
          achieved_conversions: number | null
          assigned_by: string | null
          bonus_amount: number | null
          campaign_name: string
          campaign_type: string | null
          created_at: string
          end_date: string | null
          id: string
          influencer_id: string
          product_category: string | null
          start_date: string
          status: string | null
          target_clicks: number | null
          target_conversions: number | null
        }
        Insert: {
          achieved_clicks?: number | null
          achieved_conversions?: number | null
          assigned_by?: string | null
          bonus_amount?: number | null
          campaign_name: string
          campaign_type?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          influencer_id: string
          product_category?: string | null
          start_date: string
          status?: string | null
          target_clicks?: number | null
          target_conversions?: number | null
        }
        Update: {
          achieved_clicks?: number | null
          achieved_conversions?: number | null
          assigned_by?: string | null
          bonus_amount?: number | null
          campaign_name?: string
          campaign_type?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          influencer_id?: string
          product_category?: string | null
          start_date?: string
          status?: string | null
          target_clicks?: number | null
          target_conversions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_campaign_map_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_click_logs: {
        Row: {
          browser: string | null
          campaign_id: string | null
          city: string | null
          clicked_at: string
          country: string | null
          device_type: string | null
          fraud_reason: string | null
          fraud_score: number | null
          id: string
          influencer_id: string
          ip_address: string | null
          is_bot: boolean | null
          is_fraud: boolean | null
          is_unique: boolean | null
          tracking_link: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          browser?: string | null
          campaign_id?: string | null
          city?: string | null
          clicked_at?: string
          country?: string | null
          device_type?: string | null
          fraud_reason?: string | null
          fraud_score?: number | null
          id?: string
          influencer_id: string
          ip_address?: string | null
          is_bot?: boolean | null
          is_fraud?: boolean | null
          is_unique?: boolean | null
          tracking_link: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          browser?: string | null
          campaign_id?: string | null
          city?: string | null
          clicked_at?: string
          country?: string | null
          device_type?: string | null
          fraud_reason?: string | null
          fraud_score?: number | null
          id?: string
          influencer_id?: string
          ip_address?: string | null
          is_bot?: boolean | null
          is_fraud?: boolean | null
          is_unique?: boolean | null
          tracking_link?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_click_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "influencer_campaign_map"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_click_logs_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_conversion_logs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          campaign_id: string | null
          click_id: string | null
          commission_amount: number
          commission_rate: number
          commission_type: string | null
          conversion_type: string | null
          created_at: string
          credited_at: string | null
          id: string
          influencer_id: string
          product_category: string | null
          sale_amount: number | null
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          click_id?: string | null
          commission_amount: number
          commission_rate: number
          commission_type?: string | null
          conversion_type?: string | null
          created_at?: string
          credited_at?: string | null
          id?: string
          influencer_id: string
          product_category?: string | null
          sale_amount?: number | null
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          click_id?: string | null
          commission_amount?: number
          commission_rate?: number
          commission_type?: string | null
          conversion_type?: string | null
          created_at?: string
          credited_at?: string | null
          id?: string
          influencer_id?: string
          product_category?: string | null
          sale_amount?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_conversion_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "influencer_campaign_map"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_conversion_logs_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "influencer_click_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_conversion_logs_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_payout_requests: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          bank_details: Json | null
          created_at: string
          id: string
          influencer_id: string
          payment_method: string | null
          processed_at: string | null
          rejection_reason: string | null
          requested_at: string | null
          status: string | null
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          created_at?: string
          id?: string
          influencer_id: string
          payment_method?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string | null
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          created_at?: string
          id?: string
          influencer_id?: string
          payment_method?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string | null
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_payout_requests_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_performance_metrics: {
        Row: {
          bot_clicks: number | null
          conversion_rate: number | null
          conversions: number | null
          country_breakdown: Json | null
          created_at: string
          earnings: number | null
          fraud_clicks: number | null
          fraud_score: number | null
          id: string
          influencer_id: string
          metric_date: string
          platform_breakdown: Json | null
          tier_progress: number | null
          total_clicks: number | null
          unique_clicks: number | null
        }
        Insert: {
          bot_clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          country_breakdown?: Json | null
          created_at?: string
          earnings?: number | null
          fraud_clicks?: number | null
          fraud_score?: number | null
          id?: string
          influencer_id: string
          metric_date: string
          platform_breakdown?: Json | null
          tier_progress?: number | null
          total_clicks?: number | null
          unique_clicks?: number | null
        }
        Update: {
          bot_clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          country_breakdown?: Json | null
          created_at?: string
          earnings?: number | null
          fraud_clicks?: number | null
          fraud_score?: number | null
          id?: string
          influencer_id?: string
          metric_date?: string
          platform_breakdown?: Json | null
          tier_progress?: number | null
          total_clicks?: number | null
          unique_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_performance_metrics_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_referral_links: {
        Row: {
          campaign_id: string | null
          conversions: number | null
          created_at: string
          expires_at: string | null
          id: string
          influencer_id: string
          is_active: boolean | null
          original_url: string
          product_category: string | null
          short_code: string
          total_clicks: number | null
          tracking_url: string
          unique_clicks: number | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          campaign_id?: string | null
          conversions?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          influencer_id: string
          is_active?: boolean | null
          original_url: string
          product_category?: string | null
          short_code: string
          total_clicks?: number | null
          tracking_url: string
          unique_clicks?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          campaign_id?: string | null
          conversions?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          influencer_id?: string
          is_active?: boolean | null
          original_url?: string
          product_category?: string | null
          short_code?: string
          total_clicks?: number | null
          tracking_url?: string
          unique_clicks?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_referral_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "influencer_campaign_map"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_referral_links_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_support_tickets: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          category: string | null
          created_at: string
          description: string
          escalated_to: string | null
          escalation_level: number | null
          id: string
          influencer_id: string
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          subject: string
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: string | null
          created_at?: string
          description: string
          escalated_to?: string | null
          escalation_level?: number | null
          id?: string
          influencer_id: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject: string
          ticket_number: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: string | null
          created_at?: string
          description?: string
          escalated_to?: string | null
          escalation_level?: number | null
          id?: string
          influencer_id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject?: string
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_support_tickets_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_wallet: {
        Row: {
          available_balance: number | null
          created_at: string
          id: string
          influencer_id: string
          last_payout_at: string | null
          pending_balance: number | null
          total_earned: number | null
          total_penalties: number | null
          total_withdrawn: number | null
          updated_at: string
        }
        Insert: {
          available_balance?: number | null
          created_at?: string
          id?: string
          influencer_id: string
          last_payout_at?: string | null
          pending_balance?: number | null
          total_earned?: number | null
          total_penalties?: number | null
          total_withdrawn?: number | null
          updated_at?: string
        }
        Update: {
          available_balance?: number | null
          created_at?: string
          id?: string
          influencer_id?: string
          last_payout_at?: string | null
          pending_balance?: number | null
          total_earned?: number | null
          total_penalties?: number | null
          total_withdrawn?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_wallet_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: true
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_wallet_ledger: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          influencer_id: string
          reference_id: string | null
          reference_type: string | null
          status: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          influencer_id: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          influencer_id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_wallet_ledger_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_chat_channels: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          channel_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          frozen_at: string | null
          frozen_by: string | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          is_frozen: boolean | null
          name: string
          target_roles: Database["public"]["Enums"]["app_role"][] | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          channel_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frozen_at?: string | null
          frozen_by?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          is_frozen?: boolean | null
          name: string
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          channel_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frozen_at?: string | null
          frozen_by?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          is_frozen?: boolean | null
          name?: string
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
        }
        Relationships: []
      }
      internal_chat_messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string | null
          flag_reason: string | null
          flagged_by: string | null
          id: string
          is_flagged: boolean | null
          is_masked: boolean | null
          is_visible: boolean | null
          message_type: string
          original_content: string | null
          read_by: string[] | null
          sender_id: string
          sender_masked_name: string
          sender_region: string | null
          sender_role: Database["public"]["Enums"]["app_role"]
          voice_transcript: string | null
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string | null
          flag_reason?: string | null
          flagged_by?: string | null
          id?: string
          is_flagged?: boolean | null
          is_masked?: boolean | null
          is_visible?: boolean | null
          message_type?: string
          original_content?: string | null
          read_by?: string[] | null
          sender_id: string
          sender_masked_name: string
          sender_region?: string | null
          sender_role: Database["public"]["Enums"]["app_role"]
          voice_transcript?: string | null
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string | null
          flag_reason?: string | null
          flagged_by?: string | null
          id?: string
          is_flagged?: boolean | null
          is_masked?: boolean | null
          is_visible?: boolean | null
          message_type?: string
          original_content?: string | null
          read_by?: string[] | null
          sender_id?: string
          sender_masked_name?: string
          sender_region?: string | null
          sender_role?: Database["public"]["Enums"]["app_role"]
          voice_transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_chat_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          currency: string | null
          invoice_id: string
          invoice_number: string | null
          pdf_link: string | null
          status: string | null
          tax: number | null
          timestamp: string
          user_id: string
        }
        Insert: {
          amount: number
          currency?: string | null
          invoice_id?: string
          invoice_number?: string | null
          pdf_link?: string | null
          status?: string | null
          tax?: number | null
          timestamp?: string
          user_id: string
        }
        Update: {
          amount?: number
          currency?: string | null
          invoice_id?: string
          invoice_number?: string | null
          pdf_link?: string | null
          status?: string | null
          tax?: number | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      ip_blocklist: {
        Row: {
          blocked_at: string | null
          blocked_by: string
          expires_at: string | null
          id: string
          ip_address: string
          is_permanent: boolean | null
          reason: string
          unblocked_at: string | null
          unblocked_by: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_by: string
          expires_at?: string | null
          id?: string
          ip_address: string
          is_permanent?: boolean | null
          reason: string
          unblocked_at?: string | null
          unblocked_by?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string
          expires_at?: string | null
          id?: string
          ip_address?: string
          is_permanent?: boolean | null
          reason?: string
          unblocked_at?: string | null
          unblocked_by?: string | null
        }
        Relationships: []
      }
      ip_intelligence: {
        Row: {
          blacklist_reason: string | null
          city: string | null
          country_code: string | null
          created_at: string | null
          first_seen_at: string | null
          id: string
          ip_address: string
          is_blacklisted: boolean | null
          is_datacenter: boolean | null
          is_proxy: boolean | null
          is_tor: boolean | null
          is_vpn: boolean | null
          isp: string | null
          last_seen_at: string | null
          org: string | null
          region: string | null
          request_count: number | null
          risk_score: number | null
        }
        Insert: {
          blacklist_reason?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          first_seen_at?: string | null
          id?: string
          ip_address: string
          is_blacklisted?: boolean | null
          is_datacenter?: boolean | null
          is_proxy?: boolean | null
          is_tor?: boolean | null
          is_vpn?: boolean | null
          isp?: string | null
          last_seen_at?: string | null
          org?: string | null
          region?: string | null
          request_count?: number | null
          risk_score?: number | null
        }
        Update: {
          blacklist_reason?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          first_seen_at?: string | null
          id?: string
          ip_address?: string
          is_blacklisted?: boolean | null
          is_datacenter?: boolean | null
          is_proxy?: boolean | null
          is_tor?: boolean | null
          is_vpn?: boolean | null
          isp?: string | null
          last_seen_at?: string | null
          org?: string | null
          region?: string | null
          request_count?: number | null
          risk_score?: number | null
        }
        Relationships: []
      }
      ip_locks: {
        Row: {
          created_at: string
          device: string | null
          ip: string
          lock_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device?: string | null
          ip: string
          lock_id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device?: string | null
          ip?: string
          lock_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ip_whitelist: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          is_active: boolean | null
          label: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          is_active?: boolean | null
          label?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          is_active?: boolean | null
          label?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_execution_logs: {
        Row: {
          completed_at: string | null
          error: string | null
          id: string
          job_id: string | null
          job_type: string
          result: Json | null
          servers_processed: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          error?: string | null
          id?: string
          job_id?: string | null
          job_type: string
          result?: Json | null
          servers_processed?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          error?: string | null
          id?: string
          job_id?: string | null
          job_type?: string
          result?: Json | null
          servers_processed?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_execution_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "background_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          doc_file: string | null
          doc_type: string
          kyc_id: string
          rejection_reason: string | null
          status: string | null
          timestamp: string
          user_id: string
          verified_by: string | null
        }
        Insert: {
          doc_file?: string | null
          doc_type: string
          kyc_id?: string
          rejection_reason?: string | null
          status?: string | null
          timestamp?: string
          user_id: string
          verified_by?: string | null
        }
        Update: {
          doc_file?: string | null
          doc_type?: string
          kyc_id?: string
          rejection_reason?: string | null
          status?: string | null
          timestamp?: string
          user_id?: string
          verified_by?: string | null
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
      lead_conversions: {
        Row: {
          commission: number | null
          conversion_id: string
          converted_by: string | null
          lead_id: string | null
          product_id: string | null
          revenue: number | null
          timestamp: string
        }
        Insert: {
          commission?: number | null
          conversion_id?: string
          converted_by?: string | null
          lead_id?: string | null
          product_id?: string | null
          revenue?: number | null
          timestamp?: string
        }
        Update: {
          commission?: number | null
          conversion_id?: string
          converted_by?: string | null
          lead_id?: string | null
          product_id?: string | null
          revenue?: number | null
          timestamp?: string
        }
        Relationships: []
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
      lead_fraud_detection: {
        Row: {
          auto_rejected: boolean | null
          bulk_submission_detected: boolean | null
          created_at: string | null
          device_fingerprint: string | null
          duplicate_of: string | null
          email_valid: boolean | null
          fraud_indicators: string[] | null
          id: string
          ip_address: string | null
          is_disposable_email: boolean | null
          is_duplicate: boolean | null
          is_throwaway_phone: boolean | null
          lead_id: string | null
          phone_valid: boolean | null
          quarantined: boolean | null
          rejection_reason: string | null
          reviewed_by: string | null
          spam_patterns: Json | null
          status: string | null
          submitted_by: string | null
          validation_score: number | null
        }
        Insert: {
          auto_rejected?: boolean | null
          bulk_submission_detected?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          duplicate_of?: string | null
          email_valid?: boolean | null
          fraud_indicators?: string[] | null
          id?: string
          ip_address?: string | null
          is_disposable_email?: boolean | null
          is_duplicate?: boolean | null
          is_throwaway_phone?: boolean | null
          lead_id?: string | null
          phone_valid?: boolean | null
          quarantined?: boolean | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          spam_patterns?: Json | null
          status?: string | null
          submitted_by?: string | null
          validation_score?: number | null
        }
        Update: {
          auto_rejected?: boolean | null
          bulk_submission_detected?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          duplicate_of?: string | null
          email_valid?: boolean | null
          fraud_indicators?: string[] | null
          id?: string
          ip_address?: string | null
          is_disposable_email?: boolean | null
          is_duplicate?: boolean | null
          is_throwaway_phone?: boolean | null
          lead_id?: string | null
          phone_valid?: boolean | null
          quarantined?: boolean | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          spam_patterns?: Json | null
          status?: string | null
          submitted_by?: string | null
          validation_score?: number | null
        }
        Relationships: []
      }
      lead_history: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string
          new_status: string
          notes: string | null
          old_status: string | null
          updated_by: string | null
          updated_by_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id: string
          new_status: string
          notes?: string | null
          old_status?: string | null
          updated_by?: string | null
          updated_by_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
          updated_by?: string | null
          updated_by_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
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
      legal_documents: {
        Row: {
          created_at: string | null
          doc_type: string
          effective_date: string | null
          file_url: string | null
          id: string
          region: string[] | null
          requires_signature: boolean | null
          status: string | null
          title: string
          version: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type: string
          effective_date?: string | null
          file_url?: string | null
          id?: string
          region?: string[] | null
          requires_signature?: boolean | null
          status?: string | null
          title: string
          version?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: string
          effective_date?: string | null
          file_url?: string | null
          id?: string
          region?: string[] | null
          requires_signature?: boolean | null
          status?: string | null
          title?: string
          version?: string | null
        }
        Relationships: []
      }
      legal_logs: {
        Row: {
          action_type: string
          compliance_flag: boolean | null
          created_at: string
          description: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          module_affected: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          compliance_flag?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module_affected?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          compliance_flag?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module_affected?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      legal_review_cases: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          decision_reason: string | null
          documents: Json | null
          id: string
          internal_notes: string | null
          priority: string
          reference_id: string | null
          review_type: string
          reviewed_at: string | null
          reviewer_notes: string | null
          risk_factors: Json | null
          risk_score: number | null
          status: string
          submitted_at: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          decision_reason?: string | null
          documents?: Json | null
          id?: string
          internal_notes?: string | null
          priority?: string
          reference_id?: string | null
          review_type: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          decision_reason?: string | null
          documents?: Json | null
          id?: string
          internal_notes?: string | null
          priority?: string
          reference_id?: string | null
          review_type?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      license_compliance: {
        Row: {
          allowed_domains: string[] | null
          clone_detection_enabled: boolean | null
          created_at: string | null
          current_activations: number | null
          domain: string | null
          expires_at: string | null
          id: string
          is_transferable: boolean | null
          last_validated_at: string | null
          license_key: string
          max_activations: number | null
          no_resale: boolean | null
          product_id: string
          status: string | null
          user_id: string
          watermark_required: boolean | null
        }
        Insert: {
          allowed_domains?: string[] | null
          clone_detection_enabled?: boolean | null
          created_at?: string | null
          current_activations?: number | null
          domain?: string | null
          expires_at?: string | null
          id?: string
          is_transferable?: boolean | null
          last_validated_at?: string | null
          license_key: string
          max_activations?: number | null
          no_resale?: boolean | null
          product_id: string
          status?: string | null
          user_id: string
          watermark_required?: boolean | null
        }
        Update: {
          allowed_domains?: string[] | null
          clone_detection_enabled?: boolean | null
          created_at?: string | null
          current_activations?: number | null
          domain?: string | null
          expires_at?: string | null
          id?: string
          is_transferable?: boolean | null
          last_validated_at?: string | null
          license_key?: string
          max_activations?: number | null
          no_resale?: boolean | null
          product_id?: string
          status?: string | null
          user_id?: string
          watermark_required?: boolean | null
        }
        Relationships: []
      }
      live_activity_logs: {
        Row: {
          abnormal_reason: string | null
          action_description: string | null
          action_type: Database["public"]["Enums"]["activity_action_type"]
          created_at: string | null
          device_info: string | null
          duration_seconds: number | null
          id: string
          ip_address: string | null
          is_abnormal: boolean | null
          metadata: Json | null
          page_url: string | null
          status: Database["public"]["Enums"]["activity_status"] | null
          user_agent: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          abnormal_reason?: string | null
          action_description?: string | null
          action_type: Database["public"]["Enums"]["activity_action_type"]
          created_at?: string | null
          device_info?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          is_abnormal?: boolean | null
          metadata?: Json | null
          page_url?: string | null
          status?: Database["public"]["Enums"]["activity_status"] | null
          user_agent?: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          abnormal_reason?: string | null
          action_description?: string | null
          action_type?: Database["public"]["Enums"]["activity_action_type"]
          created_at?: string | null
          device_info?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          is_abnormal?: boolean | null
          metadata?: Json | null
          page_url?: string | null
          status?: Database["public"]["Enums"]["activity_status"] | null
          user_agent?: string | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      localization: {
        Row: {
          content_key: string
          content_value: string
          context: string | null
          created_at: string | null
          id: string
          lang_code: string
        }
        Insert: {
          content_key: string
          content_value: string
          context?: string | null
          created_at?: string | null
          id?: string
          lang_code: string
        }
        Update: {
          content_key?: string
          content_value?: string
          context?: string | null
          created_at?: string | null
          id?: string
          lang_code?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempt_type: string | null
          created_at: string | null
          device_fingerprint: string | null
          email: string
          failure_reason: string | null
          id: string
          ip_address: string
          success: boolean | null
        }
        Insert: {
          attempt_type?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          email: string
          failure_reason?: string | null
          id?: string
          ip_address: string
          success?: boolean | null
        }
        Update: {
          attempt_type?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: string
          success?: boolean | null
        }
        Relationships: []
      }
      login_history: {
        Row: {
          attempt_status: string | null
          created_at: string | null
          device_info: string | null
          failure_reason: string | null
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          attempt_status?: string | null
          created_at?: string | null
          device_info?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          attempt_status?: string | null
          created_at?: string | null
          device_info?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: []
      }
      login_locations: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          is_impossible_travel: boolean | null
          latitude: number | null
          login_at: string | null
          longitude: number | null
          previous_location_id: string | null
          session_id: string | null
          travel_speed_kmh: number | null
          user_id: string
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_impossible_travel?: boolean | null
          latitude?: number | null
          login_at?: string | null
          longitude?: number | null
          previous_location_id?: string | null
          session_id?: string | null
          travel_speed_kmh?: number | null
          user_id: string
        }
        Update: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_impossible_travel?: boolean | null
          latitude?: number | null
          login_at?: string | null
          longitude?: number | null
          previous_location_id?: string | null
          session_id?: string | null
          travel_speed_kmh?: number | null
          user_id?: string
        }
        Relationships: []
      }
      login_whitelist: {
        Row: {
          added_by: string | null
          added_by_role: string | null
          created_at: string | null
          device_whitelist: string[] | null
          email: string
          id: string
          ip_whitelist: string[] | null
          is_active: boolean | null
          last_login_at: string | null
          last_login_device: string | null
          last_login_ip: string | null
          login_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_by?: string | null
          added_by_role?: string | null
          created_at?: string | null
          device_whitelist?: string[] | null
          email: string
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_device?: string | null
          last_login_ip?: string | null
          login_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          added_by?: string | null
          added_by_role?: string | null
          created_at?: string | null
          device_whitelist?: string[] | null
          email?: string
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_device?: string | null
          last_login_ip?: string | null
          login_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          channel: string
          conversion_rate: number | null
          created_at: string
          created_by: string | null
          end_date: string | null
          franchise_id: string | null
          id: string
          influencer_id: string | null
          leads_generated: number | null
          name: string
          spent: number | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          channel: string
          conversion_rate?: number | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          franchise_id?: string | null
          id?: string
          influencer_id?: string | null
          leads_generated?: number | null
          name: string
          spent?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          channel?: string
          conversion_rate?: number | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          franchise_id?: string | null
          id?: string
          influencer_id?: string | null
          leads_generated?: number | null
          name?: string
          spent?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          product_id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          product_id: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          product_id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      marketplace_banners: {
        Row: {
          created_at: string
          created_by: string | null
          cta_link: string | null
          cta_text: string | null
          display_order: number
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean
          product_id: string | null
          starts_at: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          product_id?: string | null
          starts_at?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          product_id?: string | null
          starts_at?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_banners_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      marketplace_featured: {
        Row: {
          display_order: number
          expires_at: string | null
          featured_at: string
          id: string
          is_active: boolean
          product_id: string
          section_id: string
        }
        Insert: {
          display_order?: number
          expires_at?: string | null
          featured_at?: string
          id?: string
          is_active?: boolean
          product_id: string
          section_id: string
        }
        Update: {
          display_order?: number
          expires_at?: string | null
          featured_at?: string
          id?: string
          is_active?: boolean
          product_id?: string
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_featured_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "marketplace_featured_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_order_items: {
        Row: {
          created_at: string
          deployed: boolean
          discount_percent: number | null
          id: string
          license_key: string | null
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          deployed?: boolean
          discount_percent?: number | null
          id?: string
          license_key?: string | null
          order_id: string
          product_id: string
          product_name: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          deployed?: boolean
          discount_percent?: number | null
          id?: string
          license_key?: string | null
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      marketplace_order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_status: string
          old_status: string | null
          order_id: string
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status: string
          old_status?: string | null
          order_id: string
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status?: string
          old_status?: string | null
          order_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_orders: {
        Row: {
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          discount_amount: number
          final_amount: number
          franchise_id: string | null
          id: string
          metadata: Json | null
          notes: string | null
          order_number: string
          payment_status: string
          requirements: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          discount_amount?: number
          final_amount?: number
          franchise_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_number: string
          payment_status?: string
          requirements?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          discount_amount?: number
          final_amount?: number
          franchise_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_number?: string
          payment_status?: string
          requirements?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      marketplace_sections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          filter_criteria: Json | null
          icon: string | null
          id: string
          is_active: boolean
          max_items: number | null
          section_type: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          filter_criteria?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean
          max_items?: number | null
          section_type?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          filter_criteria?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean
          max_items?: number | null
          section_type?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      masked_identities: {
        Row: {
          created_at: string | null
          id: string
          masked_email: string
          masked_phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          masked_email: string
          masked_phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          masked_email?: string
          masked_phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      master_access_checks: {
        Row: {
          action: string
          check_permission: boolean | null
          check_rental: boolean | null
          check_risk_score: boolean | null
          check_role_scope: boolean | null
          check_system_lock: boolean | null
          check_user_status: boolean | null
          created_at: string | null
          denial_reason: string | null
          device_fingerprint: string | null
          entity_id: string | null
          entity_type: string | null
          final_result: boolean
          id: string
          ip_address: string | null
          module: string | null
          permission_passed: boolean | null
          rental_passed: boolean | null
          risk_score: number | null
          risk_score_passed: boolean | null
          role_scope_passed: boolean | null
          system_lock_passed: boolean | null
          user_id: string | null
          user_status_passed: boolean | null
        }
        Insert: {
          action: string
          check_permission?: boolean | null
          check_rental?: boolean | null
          check_risk_score?: boolean | null
          check_role_scope?: boolean | null
          check_system_lock?: boolean | null
          check_user_status?: boolean | null
          created_at?: string | null
          denial_reason?: string | null
          device_fingerprint?: string | null
          entity_id?: string | null
          entity_type?: string | null
          final_result: boolean
          id?: string
          ip_address?: string | null
          module?: string | null
          permission_passed?: boolean | null
          rental_passed?: boolean | null
          risk_score?: number | null
          risk_score_passed?: boolean | null
          role_scope_passed?: boolean | null
          system_lock_passed?: boolean | null
          user_id?: string | null
          user_status_passed?: boolean | null
        }
        Update: {
          action?: string
          check_permission?: boolean | null
          check_rental?: boolean | null
          check_risk_score?: boolean | null
          check_role_scope?: boolean | null
          check_system_lock?: boolean | null
          check_user_status?: boolean | null
          created_at?: string | null
          denial_reason?: string | null
          device_fingerprint?: string | null
          entity_id?: string | null
          entity_type?: string | null
          final_result?: boolean
          id?: string
          ip_address?: string | null
          module?: string | null
          permission_passed?: boolean | null
          rental_passed?: boolean | null
          risk_score?: number | null
          risk_score_passed?: boolean | null
          role_scope_passed?: boolean | null
          system_lock_passed?: boolean | null
          user_id?: string | null
          user_status_passed?: boolean | null
        }
        Relationships: []
      }
      master_admin_activity_log: {
        Row: {
          action: string
          action_category: string
          blackbox_event_id: string | null
          created_at: string
          id: string
          ip_address: string | null
          super_admin_id: string | null
          target_entity_id: string | null
          target_entity_type: string | null
        }
        Insert: {
          action: string
          action_category: string
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          super_admin_id?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
        }
        Update: {
          action?: string
          action_category?: string
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          super_admin_id?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_admin_activity_log_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_admin_activity_log_super_admin_id_fkey"
            columns: ["super_admin_id"]
            isOneToOne: false
            referencedRelation: "master_super_admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      master_ai_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_description: string | null
          alert_title: string
          alert_type: string
          auto_action_taken: string | null
          blackbox_event_id: string | null
          created_at: string
          id: string
          is_acknowledged: boolean | null
          is_resolved: boolean | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          source_module: string
          target_entity_id: string | null
          target_entity_type: string | null
          target_user_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_description?: string | null
          alert_title: string
          alert_type: string
          auto_action_taken?: string | null
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          is_acknowledged?: boolean | null
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          source_module: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          target_user_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_description?: string | null
          alert_title?: string
          alert_type?: string
          auto_action_taken?: string | null
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          is_acknowledged?: boolean | null
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source_module?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_ai_alerts_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
        ]
      }
      master_ai_behavior_scores: {
        Row: {
          anomaly_factors: Json | null
          anomaly_level: string
          behavior_score: number
          created_at: string
          evaluated_at: string
          flagged_reason: string | null
          id: string
          is_flagged: boolean | null
          last_action_pattern: Json | null
          last_login_pattern: Json | null
          pattern_analysis: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anomaly_factors?: Json | null
          anomaly_level?: string
          behavior_score?: number
          created_at?: string
          evaluated_at?: string
          flagged_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          last_action_pattern?: Json | null
          last_login_pattern?: Json | null
          pattern_analysis?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anomaly_factors?: Json | null
          anomaly_level?: string
          behavior_score?: number
          created_at?: string
          evaluated_at?: string
          flagged_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          last_action_pattern?: Json | null
          last_login_pattern?: Json | null
          pattern_analysis?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_approval_steps: {
        Row: {
          approval_id: string | null
          approver_role: string
          approver_user_id: string | null
          blackbox_event_id: string | null
          created_at: string
          decision_at: string | null
          decision_notes: string | null
          id: string
          status: string
          step_number: number
        }
        Insert: {
          approval_id?: string | null
          approver_role: string
          approver_user_id?: string | null
          blackbox_event_id?: string | null
          created_at?: string
          decision_at?: string | null
          decision_notes?: string | null
          id?: string
          status?: string
          step_number: number
        }
        Update: {
          approval_id?: string | null
          approver_role?: string
          approver_user_id?: string | null
          blackbox_event_id?: string | null
          created_at?: string
          decision_at?: string | null
          decision_notes?: string | null
          id?: string
          status?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "master_approval_steps_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "master_approvals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_approval_steps_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
        ]
      }
      master_approvals: {
        Row: {
          created_at: string
          current_approvers: number | null
          expires_at: string | null
          id: string
          metadata: Json | null
          priority: string | null
          request_description: string | null
          request_title: string
          request_type: string
          requested_by: string
          requested_by_role: string | null
          required_approvers: number | null
          risk_factors: Json | null
          risk_score: number
          status: string
          target_entity_id: string | null
          target_entity_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_approvers?: number | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          request_description?: string | null
          request_title: string
          request_type: string
          requested_by: string
          requested_by_role?: string | null
          required_approvers?: number | null
          risk_factors?: Json | null
          risk_score?: number
          status?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_approvers?: number | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          request_description?: string | null
          request_title?: string
          request_type?: string
          requested_by?: string
          requested_by_role?: string | null
          required_approvers?: number | null
          risk_factors?: Json | null
          risk_score?: number
          status?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      master_audit_exports: {
        Row: {
          created_at: string
          date_range_end: string | null
          date_range_start: string | null
          download_count: number | null
          expires_at: string | null
          export_scope: Json
          export_type: string
          file_path: string | null
          file_size_bytes: number | null
          id: string
          max_downloads: number | null
          requested_by: string
          status: string
          watermark_hash: string
        }
        Insert: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          download_count?: number | null
          expires_at?: string | null
          export_scope?: Json
          export_type: string
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          max_downloads?: number | null
          requested_by: string
          status?: string
          watermark_hash?: string
        }
        Update: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          download_count?: number | null
          expires_at?: string | null
          export_scope?: Json
          export_type?: string
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          max_downloads?: number | null
          requested_by?: string
          status?: string
          watermark_hash?: string
        }
        Relationships: []
      }
      master_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
          user_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      master_blackbox_hash_chain: {
        Row: {
          blackbox_event_id: string
          chain_hash: string
          created_at: string | null
          event_hash: string
          id: string
          previous_hash: string
          sequence_number: number
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          blackbox_event_id: string
          chain_hash: string
          created_at?: string | null
          event_hash: string
          id?: string
          previous_hash: string
          sequence_number: number
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          blackbox_event_id?: string
          chain_hash?: string
          created_at?: string | null
          event_hash?: string
          id?: string
          previous_hash?: string
          sequence_number?: number
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_blackbox_hash_chain_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
        ]
      }
      master_continents: {
        Row: {
          code: string
          created_at: string
          id: string
          metadata: Json | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_countries: {
        Row: {
          continent_id: string | null
          created_at: string
          id: string
          iso_code: string
          metadata: Json | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          continent_id?: string | null
          created_at?: string
          id?: string
          iso_code: string
          metadata?: Json | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          continent_id?: string | null
          created_at?: string
          id?: string
          iso_code?: string
          metadata?: Json | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_countries_continent_id_fkey"
            columns: ["continent_id"]
            isOneToOne: false
            referencedRelation: "master_continents"
            referencedColumns: ["id"]
          },
        ]
      }
      master_device_fingerprints: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          blocked_reason: string | null
          browser: string | null
          created_at: string | null
          device_name: string | null
          fingerprint_hash: string
          first_seen_at: string | null
          geo_location: string | null
          id: string
          ip_address: string | null
          is_blocked: boolean | null
          is_trusted: boolean | null
          last_seen_at: string | null
          os: string | null
          trust_level: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          browser?: string | null
          created_at?: string | null
          device_name?: string | null
          fingerprint_hash: string
          first_seen_at?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_blocked?: boolean | null
          is_trusted?: boolean | null
          last_seen_at?: string | null
          os?: string | null
          trust_level?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          browser?: string | null
          created_at?: string | null
          device_name?: string | null
          fingerprint_hash?: string
          first_seen_at?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_blocked?: boolean | null
          is_trusted?: boolean | null
          last_seen_at?: string | null
          os?: string | null
          trust_level?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      master_global_rules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          impact_level: string | null
          is_locked: boolean | null
          rule_code: string
          rule_logic: Json
          rule_name: string
          rule_type: string
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          impact_level?: string | null
          is_locked?: boolean | null
          rule_code: string
          rule_logic?: Json
          rule_name: string
          rule_type: string
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          impact_level?: string | null
          is_locked?: boolean | null
          rule_code?: string
          rule_logic?: Json
          rule_name?: string
          rule_type?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      master_ip_watchlist: {
        Row: {
          block_reason: string | null
          blocked_at: string | null
          blocked_by: string | null
          created_at: string
          expires_at: string | null
          hit_count: number | null
          id: string
          ip_address: string
          is_blocked: boolean
          last_seen_at: string | null
          metadata: Json | null
          risk_level: string
          updated_at: string
        }
        Insert: {
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string
          expires_at?: string | null
          hit_count?: number | null
          id?: string
          ip_address: string
          is_blocked?: boolean
          last_seen_at?: string | null
          metadata?: Json | null
          risk_level?: string
          updated_at?: string
        }
        Update: {
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string
          expires_at?: string | null
          hit_count?: number | null
          id?: string
          ip_address?: string
          is_blocked?: boolean
          last_seen_at?: string | null
          metadata?: Json | null
          risk_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_live_activity: {
        Row: {
          action_description: string | null
          action_name: string
          blackbox_event_id: string | null
          created_at: string
          id: string
          payload: Json | null
          severity: string
          source_module: string
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action_description?: string | null
          action_name: string
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          severity?: string
          source_module: string
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action_description?: string | null
          action_name?: string
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          severity?: string
          source_module?: string
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_live_activity_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
        ]
      }
      master_login_attempts: {
        Row: {
          anomaly_reasons: Json | null
          attempt_type: string
          captcha_passed: boolean | null
          captcha_required: boolean | null
          created_at: string | null
          device_fingerprint: string | null
          email: string | null
          failure_reason: string | null
          geo_location: string | null
          id: string
          ip_address: string
          is_anomaly: boolean | null
          risk_score: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          anomaly_reasons?: Json | null
          attempt_type: string
          captcha_passed?: boolean | null
          captcha_required?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          email?: string | null
          failure_reason?: string | null
          geo_location?: string | null
          id?: string
          ip_address: string
          is_anomaly?: boolean | null
          risk_score?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          anomaly_reasons?: Json | null
          attempt_type?: string
          captcha_passed?: boolean | null
          captcha_required?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          email?: string | null
          failure_reason?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string
          is_anomaly?: boolean | null
          risk_score?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      master_permission_grants: {
        Row: {
          created_at: string
          expires_at: string | null
          grant_type: string
          granted_by: string | null
          id: string
          permission_id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          grant_type?: string
          granted_by?: string | null
          id?: string
          permission_id: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          grant_type?: string
          granted_by?: string | null
          id?: string
          permission_id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_permission_grants_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "master_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_permission_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "master_users"
            referencedColumns: ["id"]
          },
        ]
      }
      master_permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_sensitive: boolean | null
          module_name: string
          permission_code: string
          permission_name: string
          requires_2fa: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          module_name: string
          permission_code: string
          permission_name: string
          requires_2fa?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          module_name?: string
          permission_code?: string
          permission_name?: string
          requires_2fa?: boolean | null
        }
        Relationships: []
      }
      master_rate_limit_tracking: {
        Row: {
          cooldown_until: string | null
          created_at: string | null
          id: string
          identifier: string
          identifier_type: string
          is_blocked: boolean | null
          rate_limit_id: string | null
          request_count: number | null
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          cooldown_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          identifier_type: string
          is_blocked?: boolean | null
          rate_limit_id?: string | null
          request_count?: number | null
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          cooldown_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          is_blocked?: boolean | null
          rate_limit_id?: string | null
          request_count?: number | null
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_rate_limit_tracking_rate_limit_id_fkey"
            columns: ["rate_limit_id"]
            isOneToOne: false
            referencedRelation: "master_rate_limits"
            referencedColumns: ["id"]
          },
        ]
      }
      master_rate_limits: {
        Row: {
          cooldown_seconds: number | null
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          limit_type: string
          max_requests: number
          updated_at: string | null
          window_seconds: number
        }
        Insert: {
          cooldown_seconds?: number | null
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          limit_type: string
          max_requests: number
          updated_at?: string | null
          window_seconds: number
        }
        Update: {
          cooldown_seconds?: number | null
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          limit_type?: string
          max_requests?: number
          updated_at?: string | null
          window_seconds?: number
        }
        Relationships: []
      }
      master_rentable_features: {
        Row: {
          base_price: number | null
          created_at: string
          description: string | null
          feature_code: string
          feature_name: string
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          module_name: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          created_at?: string
          description?: string | null
          feature_code: string
          feature_name: string
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          module_name: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          created_at?: string
          description?: string | null
          feature_code?: string
          feature_name?: string
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          module_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_rental_plans: {
        Row: {
          created_at: string
          currency: string | null
          duration_type: string
          duration_value: number
          id: string
          is_active: boolean | null
          metadata: Json | null
          plan_code: string
          plan_name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          duration_type: string
          duration_value?: number
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          plan_code: string
          plan_name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          duration_type?: string
          duration_value?: number
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          plan_code?: string
          plan_name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      master_rental_usage_logs: {
        Row: {
          id: string
          ip_address: string | null
          logged_at: string
          rental_id: string | null
          usage_metric: Json | null
          usage_type: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          logged_at?: string
          rental_id?: string | null
          usage_metric?: Json | null
          usage_type: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          logged_at?: string
          rental_id?: string | null
          usage_metric?: Json | null
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_rental_usage_logs_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "master_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      master_rentals: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          end_time: string
          feature_id: string | null
          id: string
          max_usage: number | null
          metadata: Json | null
          plan_id: string | null
          revoke_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          start_time: string
          status: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          end_time: string
          feature_id?: string | null
          id?: string
          max_usage?: number | null
          metadata?: Json | null
          plan_id?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          end_time?: string
          feature_id?: string | null
          id?: string
          max_usage?: number | null
          metadata?: Json | null
          plan_id?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_rentals_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "master_rentable_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_rentals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "master_rental_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      master_replay_protection: {
        Row: {
          endpoint: string
          expires_at: string
          id: string
          ip_address: string | null
          request_hash: string
          request_id: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          endpoint: string
          expires_at: string
          id?: string
          ip_address?: string | null
          request_hash: string
          request_id: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          endpoint?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          request_hash?: string
          request_id?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      master_risk_entity_scores: {
        Row: {
          calculated_at: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          previous_value: number | null
          risk_factors: Json | null
          risk_level: string
          risk_value: number
          trend: string | null
        }
        Insert: {
          calculated_at?: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          previous_value?: number | null
          risk_factors?: Json | null
          risk_level?: string
          risk_value?: number
          trend?: string | null
        }
        Update: {
          calculated_at?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          previous_value?: number | null
          risk_factors?: Json | null
          risk_level?: string
          risk_value?: number
          trend?: string | null
        }
        Relationships: []
      }
      master_role_permissions: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "master_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "master_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      master_roles: {
        Row: {
          can_be_deleted: boolean | null
          created_at: string
          display_name: string
          hierarchy_level: number
          id: string
          is_system_role: boolean | null
          metadata: Json | null
          name: string
          scope_level: string
          updated_at: string
        }
        Insert: {
          can_be_deleted?: boolean | null
          created_at?: string
          display_name: string
          hierarchy_level?: number
          id?: string
          is_system_role?: boolean | null
          metadata?: Json | null
          name: string
          scope_level?: string
          updated_at?: string
        }
        Update: {
          can_be_deleted?: boolean | null
          created_at?: string
          display_name?: string
          hierarchy_level?: number
          id?: string
          is_system_role?: boolean | null
          metadata?: Json | null
          name?: string
          scope_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_rule_execution_logs: {
        Row: {
          affected_entities: number | null
          blackbox_event_id: string | null
          executed_at: string
          executed_by: string | null
          execution_result: string
          id: string
          impact_summary: Json | null
          rule_id: string | null
        }
        Insert: {
          affected_entities?: number | null
          blackbox_event_id?: string | null
          executed_at?: string
          executed_by?: string | null
          execution_result: string
          id?: string
          impact_summary?: Json | null
          rule_id?: string | null
        }
        Update: {
          affected_entities?: number | null
          blackbox_event_id?: string | null
          executed_at?: string
          executed_by?: string | null
          execution_result?: string
          id?: string
          impact_summary?: Json | null
          rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_rule_execution_logs_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_rule_execution_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "master_global_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      master_security_events: {
        Row: {
          blackbox_event_id: string | null
          created_at: string
          device_fingerprint: string | null
          event_description: string | null
          event_type: string
          geo_location: string | null
          id: string
          ip_address: string | null
          is_resolved: boolean | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          blackbox_event_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          event_description?: string | null
          event_type: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          blackbox_event_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          event_description?: string | null
          event_type?: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_security_events_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
        ]
      }
      master_security_settings: {
        Row: {
          created_at: string | null
          id: string
          is_secret: boolean | null
          last_rotated_at: string | null
          rotation_interval_days: number | null
          rotation_required: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value_encrypted: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_secret?: boolean | null
          last_rotated_at?: string | null
          rotation_interval_days?: number | null
          rotation_required?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value_encrypted?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_secret?: boolean | null
          last_rotated_at?: string | null
          rotation_interval_days?: number | null
          rotation_required?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value_encrypted?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      master_security_threats: {
        Row: {
          auto_response: string | null
          auto_response_at: string | null
          blackbox_event_id: string | null
          created_at: string | null
          id: string
          is_resolved: boolean | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          source_ip: string | null
          source_user_id: string | null
          target_entity: string | null
          target_id: string | null
          threat_data: Json | null
          threat_type: string
        }
        Insert: {
          auto_response?: string | null
          auto_response_at?: string | null
          blackbox_event_id?: string | null
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          source_ip?: string | null
          source_user_id?: string | null
          target_entity?: string | null
          target_id?: string | null
          threat_data?: Json | null
          threat_type: string
        }
        Update: {
          auto_response?: string | null
          auto_response_at?: string | null
          blackbox_event_id?: string | null
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source_ip?: string | null
          source_user_id?: string | null
          target_entity?: string | null
          target_id?: string | null
          threat_data?: Json | null
          threat_type?: string
        }
        Relationships: []
      }
      master_super_admin_profiles: {
        Row: {
          assigned_continent_id: string | null
          authority_scope: Json
          created_at: string
          display_name: string
          id: string
          last_active_at: string | null
          risk_level: string | null
          status: string
          total_actions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_continent_id?: string | null
          authority_scope?: Json
          created_at?: string
          display_name: string
          id?: string
          last_active_at?: string | null
          risk_level?: string | null
          status?: string
          total_actions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_continent_id?: string | null
          authority_scope?: Json
          created_at?: string
          display_name?: string
          id?: string
          last_active_at?: string | null
          risk_level?: string | null
          status?: string
          total_actions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_super_admin_profiles_assigned_continent_id_fkey"
            columns: ["assigned_continent_id"]
            isOneToOne: false
            referencedRelation: "master_continents"
            referencedColumns: ["id"]
          },
        ]
      }
      master_system_locks: {
        Row: {
          activated_at: string
          activated_by: string
          blackbox_event_id: string | null
          created_at: string
          id: string
          is_active: boolean
          lock_scope: string
          lock_type: string
          reason: string
          release_notes: string | null
          released_at: string | null
          released_by: string | null
          scheduled_release_at: string | null
          severity: string
          target_id: string | null
          target_name: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string
          activated_by: string
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          lock_scope: string
          lock_type?: string
          reason: string
          release_notes?: string | null
          released_at?: string | null
          released_by?: string | null
          scheduled_release_at?: string | null
          severity?: string
          target_id?: string | null
          target_name?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string
          activated_by?: string
          blackbox_event_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          lock_scope?: string
          lock_type?: string
          reason?: string
          release_notes?: string | null
          released_at?: string | null
          released_by?: string | null
          scheduled_release_at?: string | null
          severity?: string
          target_id?: string | null
          target_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_system_locks_blackbox_event_id_fkey"
            columns: ["blackbox_event_id"]
            isOneToOne: false
            referencedRelation: "blackbox_events"
            referencedColumns: ["id"]
          },
        ]
      }
      master_system_settings: {
        Row: {
          created_at: string
          id: string
          is_encrypted: boolean | null
          is_locked: boolean | null
          last_modified_by: string | null
          setting_key: string
          setting_type: string | null
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_encrypted?: boolean | null
          is_locked?: boolean | null
          last_modified_by?: string | null
          setting_key: string
          setting_type?: string | null
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_encrypted?: boolean | null
          is_locked?: boolean | null
          last_modified_by?: string | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_token_registry: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          expires_at: string
          geo_location: string | null
          id: string
          ip_address: string | null
          is_revoked: boolean | null
          issued_at: string | null
          last_used_at: string | null
          revoke_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          token_hash: string
          token_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_revoked?: boolean | null
          issued_at?: string | null
          last_used_at?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          token_hash: string
          token_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_revoked?: boolean | null
          issued_at?: string | null
          last_used_at?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          token_hash?: string
          token_type?: string
          user_id?: string
        }
        Relationships: []
      }
      master_user_sessions: {
        Row: {
          device_fingerprint: string | null
          expires_at: string
          geo_location: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_activity_at: string | null
          session_token_hash: string
          started_at: string
          terminated_at: string | null
          terminated_reason: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_fingerprint?: string | null
          expires_at: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity_at?: string | null
          session_token_hash: string
          started_at?: string
          terminated_at?: string | null
          terminated_reason?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_fingerprint?: string | null
          expires_at?: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity_at?: string | null
          session_token_hash?: string
          started_at?: string
          terminated_at?: string | null
          terminated_reason?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "master_users"
            referencedColumns: ["id"]
          },
        ]
      }
      master_users: {
        Row: {
          assigned_continent_id: string | null
          assigned_country_ids: string[] | null
          auth_user_id: string | null
          created_at: string
          email: string
          failed_login_count: number | null
          id: string
          is_2fa_enabled: boolean | null
          last_login_at: string | null
          last_login_ip: string | null
          login_count: number | null
          metadata: Json | null
          name: string
          role_id: string | null
          status: string
          status_reason: string | null
          updated_at: string
        }
        Insert: {
          assigned_continent_id?: string | null
          assigned_country_ids?: string[] | null
          auth_user_id?: string | null
          created_at?: string
          email: string
          failed_login_count?: number | null
          id?: string
          is_2fa_enabled?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          login_count?: number | null
          metadata?: Json | null
          name: string
          role_id?: string | null
          status?: string
          status_reason?: string | null
          updated_at?: string
        }
        Update: {
          assigned_continent_id?: string | null
          assigned_country_ids?: string[] | null
          auth_user_id?: string | null
          created_at?: string
          email?: string
          failed_login_count?: number | null
          id?: string
          is_2fa_enabled?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          login_count?: number | null
          metadata?: Json | null
          name?: string
          role_id?: string | null
          status?: string
          status_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_users_assigned_continent_id_fkey"
            columns: ["assigned_continent_id"]
            isOneToOne: false
            referencedRelation: "master_continents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "master_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_approval_queue: {
        Row: {
          assigned_admin: string | null
          created_at: string | null
          id: string
          message_id: string
          notes: string | null
          priority: string | null
        }
        Insert: {
          assigned_admin?: string | null
          created_at?: string | null
          id?: string
          message_id: string
          notes?: string | null
          priority?: string | null
        }
        Update: {
          assigned_admin?: string | null
          created_at?: string | null
          id?: string
          message_id?: string
          notes?: string | null
          priority?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_approval_queue_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "personal_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          action_data: Json | null
          action_description: string | null
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          is_used: boolean | null
          otp_code: string
          otp_type: string
          user_agent: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          action_data?: Json | null
          action_description?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_used?: boolean | null
          otp_code: string
          otp_type: string
          user_agent?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          action_data?: Json | null
          action_description?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_used?: boolean | null
          otp_code?: string
          otp_type?: string
          user_agent?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      password_verifications: {
        Row: {
          action_type: string
          device_fingerprint: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          action_type: string
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          action_type?: string
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      payment_attempts: {
        Row: {
          ai_followed_up: boolean | null
          ai_followup_count: number | null
          ai_followup_last_at: string | null
          ai_followup_response: string | null
          amount: number | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          failure_reason: string | null
          id: string
          payment_type: string | null
          phone: string | null
          product_id: string | null
          product_name: string | null
          resolved: boolean | null
          session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          user_issue_reported: string | null
        }
        Insert: {
          ai_followed_up?: boolean | null
          ai_followup_count?: number | null
          ai_followup_last_at?: string | null
          ai_followup_response?: string | null
          amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          payment_type?: string | null
          phone?: string | null
          product_id?: string | null
          product_name?: string | null
          resolved?: boolean | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_issue_reported?: string | null
        }
        Update: {
          ai_followed_up?: boolean | null
          ai_followup_count?: number | null
          ai_followup_last_at?: string | null
          ai_followup_response?: string | null
          amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          payment_type?: string | null
          phone?: string | null
          product_id?: string | null
          product_name?: string | null
          resolved?: boolean | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_issue_reported?: string | null
        }
        Relationships: []
      }
      payout_limits_config: {
        Row: {
          auto_approve_threshold: number
          created_at: string | null
          daily_limit: number
          id: string
          is_active: boolean | null
          monthly_limit: number
          requires_manual_review: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          auto_approve_threshold?: number
          created_at?: string | null
          daily_limit?: number
          id?: string
          is_active?: boolean | null
          monthly_limit?: number
          requires_manual_review?: boolean | null
          role: string
          updated_at?: string | null
        }
        Update: {
          auto_approve_threshold?: number
          created_at?: string | null
          daily_limit?: number
          id?: string
          is_active?: boolean | null
          monthly_limit?: number
          requires_manual_review?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payout_records: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          description: string | null
          developer_id: string
          id: string
          payment_method: string | null
          processed_at: string | null
          status: string
          task_id: string | null
          transaction_ref: string | null
          type: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          developer_id: string
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          task_id?: string | null
          transaction_ref?: string | null
          type: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          task_id?: string | null
          transaction_ref?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_records_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_records_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          bank_details: Json | null
          device_fingerprint: string | null
          idempotency_key: string | null
          ip_address: string | null
          payment_method: string | null
          payout_id: string
          processed_by: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          requested_at: string | null
          status: string | null
          timestamp: string
          user_id: string
          user_role: string | null
          wallet_debited: boolean | null
          wallet_debited_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          device_fingerprint?: string | null
          idempotency_key?: string | null
          ip_address?: string | null
          payment_method?: string | null
          payout_id?: string
          processed_by?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string | null
          timestamp?: string
          user_id: string
          user_role?: string | null
          wallet_debited?: boolean | null
          wallet_debited_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          device_fingerprint?: string | null
          idempotency_key?: string | null
          ip_address?: string | null
          payment_method?: string | null
          payout_id?: string
          processed_by?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string | null
          timestamp?: string
          user_id?: string
          user_role?: string | null
          wallet_debited?: boolean | null
          wallet_debited_at?: string | null
        }
        Relationships: []
      }
      penalty_records: {
        Row: {
          actions_taken: Json | null
          appeal_decision_notes: string | null
          appeal_reviewed_at: string | null
          appeal_reviewed_by: string | null
          appeal_status: string | null
          appeal_submitted_at: string | null
          appeal_text: string | null
          audit_trail_id: string | null
          can_appeal: boolean | null
          created_at: string | null
          evidence: string | null
          evidence_urls: Json | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_auto_triggered: boolean | null
          issued_at: string
          issued_by: string | null
          issued_by_role: Database["public"]["Enums"]["app_role"] | null
          lift_reason: string | null
          lifted_at: string | null
          lifted_by: string | null
          penalty_level: number
          reason: string
          trigger_rule_id: string | null
          updated_at: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
          violation_type: string
        }
        Insert: {
          actions_taken?: Json | null
          appeal_decision_notes?: string | null
          appeal_reviewed_at?: string | null
          appeal_reviewed_by?: string | null
          appeal_status?: string | null
          appeal_submitted_at?: string | null
          appeal_text?: string | null
          audit_trail_id?: string | null
          can_appeal?: boolean | null
          created_at?: string | null
          evidence?: string | null
          evidence_urls?: Json | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_triggered?: boolean | null
          issued_at?: string
          issued_by?: string | null
          issued_by_role?: Database["public"]["Enums"]["app_role"] | null
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          penalty_level: number
          reason: string
          trigger_rule_id?: string | null
          updated_at?: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
          violation_type: string
        }
        Update: {
          actions_taken?: Json | null
          appeal_decision_notes?: string | null
          appeal_reviewed_at?: string | null
          appeal_reviewed_by?: string | null
          appeal_status?: string | null
          appeal_submitted_at?: string | null
          appeal_text?: string | null
          audit_trail_id?: string | null
          can_appeal?: boolean | null
          created_at?: string | null
          evidence?: string | null
          evidence_urls?: Json | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_triggered?: boolean | null
          issued_at?: string
          issued_by?: string | null
          issued_by_role?: Database["public"]["Enums"]["app_role"] | null
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          penalty_level?: number
          reason?: string
          trigger_rule_id?: string | null
          updated_at?: string | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
          violation_type?: string
        }
        Relationships: []
      }
      performance_scores: {
        Row: {
          communication_score: number | null
          created_at: string
          developer_id: string
          id: string
          incentives_earned: number | null
          on_time_percentage: number | null
          overall_score: number | null
          penalties_applied: number | null
          period_end: string
          period_start: string
          quality_score: number | null
          speed_score: number | null
          tasks_completed: number | null
          tasks_on_time: number | null
          total_hours_worked: number | null
          updated_at: string
        }
        Insert: {
          communication_score?: number | null
          created_at?: string
          developer_id: string
          id?: string
          incentives_earned?: number | null
          on_time_percentage?: number | null
          overall_score?: number | null
          penalties_applied?: number | null
          period_end: string
          period_start: string
          quality_score?: number | null
          speed_score?: number | null
          tasks_completed?: number | null
          tasks_on_time?: number | null
          total_hours_worked?: number | null
          updated_at?: string
        }
        Update: {
          communication_score?: number | null
          created_at?: string
          developer_id?: string
          id?: string
          incentives_earned?: number | null
          on_time_percentage?: number | null
          overall_score?: number | null
          penalties_applied?: number | null
          period_end?: string
          period_start?: string
          quality_score?: number | null
          speed_score?: number | null
          tasks_completed?: number | null
          tasks_on_time?: number | null
          total_hours_worked?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_scores_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          admin_access: boolean | null
          created_at: string
          id: string
          module_name: string
          read_access: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          write_access: boolean | null
        }
        Insert: {
          admin_access?: boolean | null
          created_at?: string
          id?: string
          module_name: string
          read_access?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          write_access?: boolean | null
        }
        Update: {
          admin_access?: boolean | null
          created_at?: string
          id?: string
          module_name?: string
          read_access?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          write_access?: boolean | null
        }
        Relationships: []
      }
      personal_chat_messages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: string | null
          created_at: string | null
          file_name: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          read_at: string | null
          receiver_id: string
          rejection_reason: string | null
          sender_id: string
          status: string | null
          thread_id: string
          updated_at: string | null
          voice_duration: number | null
          voice_url: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          read_at?: string | null
          receiver_id: string
          rejection_reason?: string | null
          sender_id: string
          status?: string | null
          thread_id: string
          updated_at?: string | null
          voice_duration?: number | null
          voice_url?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          read_at?: string | null
          receiver_id?: string
          rejection_reason?: string | null
          sender_id?: string
          status?: string | null
          thread_id?: string
          updated_at?: string | null
          voice_duration?: number | null
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "personal_chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_chat_threads: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          participant_one: string
          participant_two: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          participant_one: string
          participant_two: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          participant_one?: string
          participant_two?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_ai_services: {
        Row: {
          api_key_ref: string | null
          auto_stop_on_unpaid: boolean | null
          cost_month: number | null
          cost_today: number | null
          created_at: string | null
          id: string
          last_used_at: string | null
          linked_module: string | null
          model: string | null
          name: string
          paid_status: string | null
          provider: string | null
          risk_level: string | null
          status: string | null
          type: string
          updated_at: string | null
          usage_month: number | null
          usage_today: number | null
        }
        Insert: {
          api_key_ref?: string | null
          auto_stop_on_unpaid?: boolean | null
          cost_month?: number | null
          cost_today?: number | null
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          linked_module?: string | null
          model?: string | null
          name: string
          paid_status?: string | null
          provider?: string | null
          risk_level?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          usage_month?: number | null
          usage_today?: number | null
        }
        Update: {
          api_key_ref?: string | null
          auto_stop_on_unpaid?: boolean | null
          cost_month?: number | null
          cost_today?: number | null
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          linked_module?: string | null
          model?: string | null
          name?: string
          paid_status?: string | null
          provider?: string | null
          risk_level?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          usage_month?: number | null
          usage_today?: number | null
        }
        Relationships: []
      }
      platform_api_services: {
        Row: {
          api_key_ref: string | null
          auto_stop_on_unpaid: boolean | null
          billing_status: string | null
          cost_per_call: number | null
          created_at: string | null
          endpoint: string | null
          id: string
          last_call_at: string | null
          linked_ai_id: string | null
          linked_module: string | null
          monthly_cost: number | null
          name: string
          provider: string | null
          status: string | null
          type: string | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          api_key_ref?: string | null
          auto_stop_on_unpaid?: boolean | null
          billing_status?: string | null
          cost_per_call?: number | null
          created_at?: string | null
          endpoint?: string | null
          id?: string
          last_call_at?: string | null
          linked_ai_id?: string | null
          linked_module?: string | null
          monthly_cost?: number | null
          name: string
          provider?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          api_key_ref?: string | null
          auto_stop_on_unpaid?: boolean | null
          billing_status?: string | null
          cost_per_call?: number | null
          created_at?: string | null
          endpoint?: string | null
          id?: string
          last_call_at?: string | null
          linked_ai_id?: string | null
          linked_module?: string | null
          monthly_cost?: number | null
          name?: string
          provider?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_api_services_linked_ai_id_fkey"
            columns: ["linked_ai_id"]
            isOneToOne: false
            referencedRelation: "platform_ai_services"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_apk_builds: {
        Row: {
          app_name: string
          build_type: string | null
          built_at: string | null
          created_at: string | null
          demo_id: string | null
          download_count: number | null
          download_url: string | null
          error_log: string | null
          file_size: string | null
          id: string
          license_locked: boolean | null
          product_id: string | null
          progress: number | null
          signed: boolean | null
          status: string | null
          version: string | null
        }
        Insert: {
          app_name: string
          build_type?: string | null
          built_at?: string | null
          created_at?: string | null
          demo_id?: string | null
          download_count?: number | null
          download_url?: string | null
          error_log?: string | null
          file_size?: string | null
          id?: string
          license_locked?: boolean | null
          product_id?: string | null
          progress?: number | null
          signed?: boolean | null
          status?: string | null
          version?: string | null
        }
        Update: {
          app_name?: string
          build_type?: string | null
          built_at?: string | null
          created_at?: string | null
          demo_id?: string | null
          download_count?: number | null
          download_url?: string | null
          error_log?: string | null
          file_size?: string | null
          id?: string
          license_locked?: boolean | null
          product_id?: string | null
          progress?: number | null
          signed?: boolean | null
          status?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_apk_builds_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "platform_demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_apk_builds_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "platform_products"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_approvals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          priority: string | null
          rejection_reason: string | null
          request_data: Json
          request_type: string
          requester_id: string | null
          requester_role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          rejection_reason?: string | null
          request_data?: Json
          request_type: string
          requester_id?: string | null
          requester_role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          rejection_reason?: string | null
          request_data?: Json
          request_type?: string
          requester_id?: string | null
          requester_role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_automation_rules: {
        Row: {
          action_data: Json | null
          action_type: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          name: string
          trigger_condition: string
          trigger_count: number | null
          trigger_module: string | null
          updated_at: string | null
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name: string
          trigger_condition: string
          trigger_count?: number | null
          trigger_module?: string | null
          updated_at?: string | null
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name?: string
          trigger_condition?: string
          trigger_count?: number | null
          trigger_module?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_billing: {
        Row: {
          amount: number
          auto_deduct: boolean | null
          created_at: string | null
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          module: string
          module_id: string | null
          paid: boolean | null
          paid_at: string | null
          paid_by: string | null
          payment_method: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          auto_deduct?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          module: string
          module_id?: string | null
          paid?: boolean | null
          paid_at?: string | null
          paid_by?: string | null
          payment_method?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          auto_deduct?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          module?: string
          module_id?: string | null
          paid?: boolean | null
          paid_at?: string | null
          paid_by?: string | null
          payment_method?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_demos: {
        Row: {
          auto_repair: boolean | null
          created_at: string | null
          error_log: string | null
          health_status: string | null
          id: string
          last_health_check: string | null
          name: string
          product_id: string | null
          server_id: string | null
          updated_at: string | null
          url: string | null
          version: string | null
        }
        Insert: {
          auto_repair?: boolean | null
          created_at?: string | null
          error_log?: string | null
          health_status?: string | null
          id?: string
          last_health_check?: string | null
          name: string
          product_id?: string | null
          server_id?: string | null
          updated_at?: string | null
          url?: string | null
          version?: string | null
        }
        Update: {
          auto_repair?: boolean | null
          created_at?: string | null
          error_log?: string | null
          health_status?: string | null
          id?: string
          last_health_check?: string | null
          name?: string
          product_id?: string | null
          server_id?: string | null
          updated_at?: string | null
          url?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_demos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "platform_products"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_files: {
        Row: {
          ai_analysis: Json | null
          ai_processed: boolean | null
          created_at: string | null
          id: string
          linked_id: string | null
          linked_module: string | null
          mime_type: string | null
          name: string
          size_bytes: number | null
          storage_path: string | null
          type: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_processed?: boolean | null
          created_at?: string | null
          id?: string
          linked_id?: string | null
          linked_module?: string | null
          mime_type?: string | null
          name: string
          size_bytes?: number | null
          storage_path?: string | null
          type?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_processed?: boolean | null
          created_at?: string | null
          id?: string
          linked_id?: string | null
          linked_module?: string | null
          mime_type?: string | null
          name?: string
          size_bytes?: number | null
          storage_path?: string | null
          type?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      platform_leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          converted_at: string | null
          created_at: string | null
          email: string | null
          id: string
          main_category: string | null
          metadata: Json | null
          micro_category: string | null
          name: string | null
          nano_category: string | null
          notes: string | null
          phone: string | null
          product_interest: string | null
          score: number | null
          source: string
          status: string | null
          sub_category: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          converted_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          main_category?: string | null
          metadata?: Json | null
          micro_category?: string | null
          name?: string | null
          nano_category?: string | null
          notes?: string | null
          phone?: string | null
          product_interest?: string | null
          score?: number | null
          source: string
          status?: string | null
          sub_category?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          converted_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          main_category?: string | null
          metadata?: Json | null
          micro_category?: string | null
          name?: string | null
          nano_category?: string | null
          notes?: string | null
          phone?: string | null
          product_interest?: string | null
          score?: number | null
          source?: string
          status?: string | null
          sub_category?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_leads_product_interest_fkey"
            columns: ["product_interest"]
            isOneToOne: false
            referencedRelation: "platform_products"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          actor_type: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          is_sealed: boolean | null
          module: string | null
          new_value: Json | null
          old_value: Json | null
          payload: Json | null
          severity: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          actor_type?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_sealed?: boolean | null
          module?: string | null
          new_value?: Json | null
          old_value?: Json | null
          payload?: Json | null
          severity?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          actor_type?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_sealed?: boolean | null
          module?: string | null
          new_value?: Json | null
          old_value?: Json | null
          payload?: Json | null
          severity?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      platform_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          dismissed: boolean | null
          id: string
          message: string | null
          module: string | null
          seen: boolean | null
          seen_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          dismissed?: boolean | null
          id?: string
          message?: string | null
          module?: string | null
          seen?: boolean | null
          seen_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          dismissed?: boolean | null
          id?: string
          message?: string | null
          module?: string | null
          seen?: boolean | null
          seen_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      platform_permissions: {
        Row: {
          action: string
          allowed: boolean | null
          created_at: string | null
          id: string
          module: string
          role_id: string | null
        }
        Insert: {
          action: string
          allowed?: boolean | null
          created_at?: string | null
          id?: string
          module: string
          role_id?: string | null
        }
        Update: {
          action?: string
          allowed?: boolean | null
          created_at?: string | null
          id?: string
          module?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "platform_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_products: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          demo_status: string | null
          description: string | null
          id: string
          live_status: string | null
          metadata: Json | null
          name: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          demo_status?: string | null
          description?: string | null
          id?: string
          live_status?: string | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          demo_status?: string | null
          description?: string | null
          id?: string
          live_status?: string | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      platform_roles: {
        Row: {
          approval_required: boolean | null
          created_at: string | null
          hierarchy_level: number | null
          id: string
          permission_json: Json | null
          role_name: string
          updated_at: string | null
        }
        Insert: {
          approval_required?: boolean | null
          created_at?: string | null
          hierarchy_level?: number | null
          id?: string
          permission_json?: Json | null
          role_name: string
          updated_at?: string | null
        }
        Update: {
          approval_required?: boolean | null
          created_at?: string | null
          hierarchy_level?: number | null
          id?: string
          permission_json?: Json | null
          role_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_seo_tasks: {
        Row: {
          auto_fix: boolean | null
          created_at: string | null
          domain: string | null
          fix_status: string | null
          fixed_at: string | null
          fixed_by: string | null
          id: string
          issue: string | null
          issue_type: string | null
          keyword: string | null
          page: string
          seo_score: number | null
          severity: string | null
          traffic: number | null
          updated_at: string | null
        }
        Insert: {
          auto_fix?: boolean | null
          created_at?: string | null
          domain?: string | null
          fix_status?: string | null
          fixed_at?: string | null
          fixed_by?: string | null
          id?: string
          issue?: string | null
          issue_type?: string | null
          keyword?: string | null
          page: string
          seo_score?: number | null
          severity?: string | null
          traffic?: number | null
          updated_at?: string | null
        }
        Update: {
          auto_fix?: boolean | null
          created_at?: string | null
          domain?: string | null
          fix_status?: string | null
          fixed_at?: string | null
          fixed_by?: string | null
          id?: string
          issue?: string | null
          issue_type?: string | null
          keyword?: string | null
          page?: string
          seo_score?: number | null
          severity?: string | null
          traffic?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_servers: {
        Row: {
          auto_scale: boolean | null
          cost_monthly: number | null
          cpu_usage: number | null
          created_at: string | null
          disk_usage: number | null
          domain: string | null
          id: string
          ip: string | null
          last_heartbeat: string | null
          name: string | null
          provider: string | null
          ram_usage: number | null
          region: string | null
          ssl_enabled: boolean | null
          ssl_expiry: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auto_scale?: boolean | null
          cost_monthly?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          disk_usage?: number | null
          domain?: string | null
          id?: string
          ip?: string | null
          last_heartbeat?: string | null
          name?: string | null
          provider?: string | null
          ram_usage?: number | null
          region?: string | null
          ssl_enabled?: boolean | null
          ssl_expiry?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_scale?: boolean | null
          cost_monthly?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          disk_usage?: number | null
          domain?: string | null
          id?: string
          ip?: string | null
          last_heartbeat?: string | null
          name?: string | null
          provider?: string | null
          ram_usage?: number | null
          region?: string | null
          ssl_enabled?: boolean | null
          ssl_expiry?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_voice_commands: {
        Row: {
          ai_interpretation: Json | null
          command_text: string
          command_type: string | null
          created_at: string | null
          executed_action: string | null
          id: string
          result: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          ai_interpretation?: Json | null
          command_text: string
          command_type?: string | null
          created_at?: string | null
          executed_action?: string | null
          id?: string
          result?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          ai_interpretation?: Json | null
          command_text?: string
          command_type?: string | null
          created_at?: string | null
          executed_action?: string | null
          id?: string
          result?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prime_feature_access: {
        Row: {
          created_at: string
          expires_at: string | null
          feature_name: string
          feature_type: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          prime_user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          feature_name: string
          feature_type?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          prime_user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          feature_name?: string
          feature_type?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          prime_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prime_feature_access_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prime_hosting_status: {
        Row: {
          allocated_resources: Json | null
          cdn_enabled: boolean | null
          created_at: string
          custom_domain: string | null
          hosting_tier: string | null
          id: string
          last_check_at: string | null
          prime_user_id: string
          ssl_enabled: boolean | null
          status: string | null
          updated_at: string
          uptime_percentage: number | null
        }
        Insert: {
          allocated_resources?: Json | null
          cdn_enabled?: boolean | null
          created_at?: string
          custom_domain?: string | null
          hosting_tier?: string | null
          id?: string
          last_check_at?: string | null
          prime_user_id: string
          ssl_enabled?: boolean | null
          status?: string | null
          updated_at?: string
          uptime_percentage?: number | null
        }
        Update: {
          allocated_resources?: Json | null
          cdn_enabled?: boolean | null
          created_at?: string
          custom_domain?: string | null
          hosting_tier?: string | null
          id?: string
          last_check_at?: string | null
          prime_user_id?: string
          ssl_enabled?: boolean | null
          status?: string | null
          updated_at?: string
          uptime_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prime_hosting_status_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prime_performance_reports: {
        Row: {
          avg_resolution_hours: number | null
          compensations_received: number | null
          created_at: string
          developer_assignments: number | null
          generated_at: string | null
          id: string
          prime_user_id: string
          report_period_end: string
          report_period_start: string
          satisfaction_avg: number | null
          sla_compliance_rate: number | null
          support_threads: number | null
          tickets_resolved: number | null
          total_tickets: number | null
        }
        Insert: {
          avg_resolution_hours?: number | null
          compensations_received?: number | null
          created_at?: string
          developer_assignments?: number | null
          generated_at?: string | null
          id?: string
          prime_user_id: string
          report_period_end: string
          report_period_start: string
          satisfaction_avg?: number | null
          sla_compliance_rate?: number | null
          support_threads?: number | null
          tickets_resolved?: number | null
          total_tickets?: number | null
        }
        Update: {
          avg_resolution_hours?: number | null
          compensations_received?: number | null
          created_at?: string
          developer_assignments?: number | null
          generated_at?: string | null
          id?: string
          prime_user_id?: string
          report_period_end?: string
          report_period_start?: string
          satisfaction_avg?: number | null
          sla_compliance_rate?: number | null
          support_threads?: number | null
          tickets_resolved?: number | null
          total_tickets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prime_performance_reports_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prime_upgrade_history: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          new_tier: string
          payment_method: string | null
          previous_tier: string | null
          prime_user_id: string
          processed_by: string | null
          reason: string | null
          transaction_ref: string | null
          upgrade_type: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          new_tier: string
          payment_method?: string | null
          previous_tier?: string | null
          prime_user_id: string
          processed_by?: string | null
          reason?: string | null
          transaction_ref?: string | null
          upgrade_type?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          new_tier?: string
          payment_method?: string | null
          previous_tier?: string | null
          prime_user_id?: string
          processed_by?: string | null
          reason?: string | null
          transaction_ref?: string | null
          upgrade_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prime_upgrade_history_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prime_user_profiles: {
        Row: {
          auto_renewal: boolean | null
          created_at: string
          dedicated_developer_id: string | null
          downgrade_reason: string | null
          email: string
          full_name: string
          grace_period_days: number | null
          id: string
          masked_email: string | null
          masked_phone: string | null
          phone: string | null
          priority_level: number | null
          region: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
          vip_badge_enabled: boolean | null
        }
        Insert: {
          auto_renewal?: boolean | null
          created_at?: string
          dedicated_developer_id?: string | null
          downgrade_reason?: string | null
          email: string
          full_name: string
          grace_period_days?: number | null
          id?: string
          masked_email?: string | null
          masked_phone?: string | null
          phone?: string | null
          priority_level?: number | null
          region?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
          vip_badge_enabled?: boolean | null
        }
        Update: {
          auto_renewal?: boolean | null
          created_at?: string
          dedicated_developer_id?: string | null
          downgrade_reason?: string | null
          email?: string
          full_name?: string
          grace_period_days?: number | null
          id?: string
          masked_email?: string | null
          masked_phone?: string | null
          phone?: string | null
          priority_level?: number | null
          region?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          vip_badge_enabled?: boolean | null
        }
        Relationships: []
      }
      prime_wallet_usage: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          prime_user_id: string
          reference_id: string | null
          reference_type: string | null
          status: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          prime_user_id: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          prime_user_id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "prime_wallet_usage_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      priority_ticket_logs: {
        Row: {
          assigned_developer_id: string | null
          created_at: string
          description: string | null
          escalated_to: string | null
          escalation_reason: string | null
          id: string
          prime_user_id: string
          priority_level: number | null
          resolution_notes: string | null
          resolved_at: string | null
          satisfaction_rating: number | null
          sla_deadline: string | null
          sla_target_hours: number | null
          status: string | null
          subject: string
          ticket_type: string
          updated_at: string
        }
        Insert: {
          assigned_developer_id?: string | null
          created_at?: string
          description?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          prime_user_id: string
          priority_level?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          sla_deadline?: string | null
          sla_target_hours?: number | null
          status?: string | null
          subject: string
          ticket_type: string
          updated_at?: string
        }
        Update: {
          assigned_developer_id?: string | null
          created_at?: string
          description?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          prime_user_id?: string
          priority_level?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          sla_deadline?: string | null
          sla_target_hours?: number | null
          status?: string | null
          subject?: string
          ticket_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "priority_ticket_logs_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_transactions: {
        Row: {
          amount: number
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          processed_at: string | null
          response_data: Json | null
          status: string
          transaction_id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          processed_at?: string | null
          response_data?: Json | null
          status?: string
          transaction_id: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          processed_at?: string | null
          response_data?: Json | null
          status?: string
          transaction_id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      product_action_logs: {
        Row: {
          action: string
          action_details: Json | null
          created_at: string | null
          id: string
          performed_by: string | null
          performer_role: Database["public"]["Enums"]["app_role"] | null
          product_id: string | null
          product_name: string
        }
        Insert: {
          action: string
          action_details?: Json | null
          created_at?: string | null
          id?: string
          performed_by?: string | null
          performer_role?: Database["public"]["Enums"]["app_role"] | null
          product_id?: string | null
          product_name: string
        }
        Update: {
          action?: string
          action_details?: Json | null
          created_at?: string | null
          id?: string
          performed_by?: string | null
          performer_role?: Database["public"]["Enums"]["app_role"] | null
          product_id?: string | null
          product_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_action_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_demo_mappings: {
        Row: {
          demo_id: string
          id: string
          linked_at: string | null
          linked_by: string | null
          product_id: string
        }
        Insert: {
          demo_id: string
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          product_id: string
        }
        Update: {
          demo_id?: string
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_demo_mappings_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_demo_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_modules: {
        Row: {
          additional_price: number | null
          created_at: string | null
          description: string | null
          id: string
          is_core: boolean | null
          name: string
          product_id: string | null
          status: string | null
        }
        Insert: {
          additional_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_core?: boolean | null
          name: string
          product_id?: string | null
          status?: string | null
        }
        Update: {
          additional_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_core?: boolean | null
          name?: string
          product_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      product_versions: {
        Row: {
          changes_notes: string | null
          created_at: string
          product_id: string | null
          release_date: string | null
          version_id: string
          version_number: string
        }
        Insert: {
          changes_notes?: string | null
          created_at?: string
          product_id?: string | null
          release_date?: string | null
          version_id?: string
          version_number: string
        }
        Update: {
          changes_notes?: string | null
          created_at?: string
          product_id?: string | null
          release_date?: string | null
          version_id?: string
          version_number?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          business_category_id: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          features_json: Json | null
          has_broken_demo: boolean | null
          is_active: boolean | null
          lifetime_price: number | null
          monthly_price: number | null
          pricing_model: string | null
          product_id: string
          product_name: string
          product_type: string | null
          status: string | null
          subcategory_id: string | null
          tech_stack: string | null
          updated_at: string
        }
        Insert: {
          business_category_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          features_json?: Json | null
          has_broken_demo?: boolean | null
          is_active?: boolean | null
          lifetime_price?: number | null
          monthly_price?: number | null
          pricing_model?: string | null
          product_id?: string
          product_name: string
          product_type?: string | null
          status?: string | null
          subcategory_id?: string | null
          tech_stack?: string | null
          updated_at?: string
        }
        Update: {
          business_category_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          features_json?: Json | null
          has_broken_demo?: boolean | null
          is_active?: boolean | null
          lifetime_price?: number | null
          monthly_price?: number | null
          pricing_model?: string | null
          product_id?: string
          product_name?: string
          product_type?: string | null
          status?: string | null
          subcategory_id?: string | null
          tech_stack?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_category_id_fkey"
            columns: ["business_category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "business_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          language: string | null
          last_seen_at: string | null
          phone: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_seen_at?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_seen_at?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_status: string
          notes: string | null
          old_status: string | null
          project_id: string
          status_message: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status: string
          notes?: string | null
          old_status?: string | null
          project_id: string
          status_message?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
          project_id?: string
          status_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_status_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      promise_audit_logs: {
        Row: {
          action_by: string
          action_by_role: string
          action_type: string
          id: string
          ip_address: string | null
          is_system_action: boolean | null
          new_data: Json | null
          new_status: string | null
          previous_data: Json | null
          previous_status: string | null
          promise_id: string
          reason: string | null
          server_timestamp: string
          signature: string | null
          user_agent: string | null
        }
        Insert: {
          action_by: string
          action_by_role: string
          action_type: string
          id?: string
          ip_address?: string | null
          is_system_action?: boolean | null
          new_data?: Json | null
          new_status?: string | null
          previous_data?: Json | null
          previous_status?: string | null
          promise_id: string
          reason?: string | null
          server_timestamp?: string
          signature?: string | null
          user_agent?: string | null
        }
        Update: {
          action_by?: string
          action_by_role?: string
          action_type?: string
          id?: string
          ip_address?: string | null
          is_system_action?: boolean | null
          new_data?: Json | null
          new_status?: string | null
          previous_data?: Json | null
          previous_status?: string | null
          promise_id?: string
          reason?: string | null
          server_timestamp?: string
          signature?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promise_audit_logs_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promise_audit_logs_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_tracker_view"
            referencedColumns: ["promise_id"]
          },
        ]
      }
      promise_escalation_logs: {
        Row: {
          auto_triggered: boolean | null
          created_at: string
          escalated_by: string | null
          escalated_to: string[]
          from_level: number
          id: string
          promise_id: string
          reason: string | null
          to_level: number
        }
        Insert: {
          auto_triggered?: boolean | null
          created_at?: string
          escalated_by?: string | null
          escalated_to: string[]
          from_level?: number
          id?: string
          promise_id: string
          reason?: string | null
          to_level?: number
        }
        Update: {
          auto_triggered?: boolean | null
          created_at?: string
          escalated_by?: string | null
          escalated_to?: string[]
          from_level?: number
          id?: string
          promise_id?: string
          reason?: string | null
          to_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "promise_escalation_logs_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promise_escalation_logs_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_tracker_view"
            referencedColumns: ["promise_id"]
          },
        ]
      }
      promise_export_logs: {
        Row: {
          data_masked: boolean | null
          export_format: string
          exported_at: string | null
          exporter_id: string
          exporter_role: string
          filter_criteria: Json | null
          id: string
          records_exported: number | null
          server_timestamp: string | null
        }
        Insert: {
          data_masked?: boolean | null
          export_format: string
          exported_at?: string | null
          exporter_id: string
          exporter_role: string
          filter_criteria?: Json | null
          id?: string
          records_exported?: number | null
          server_timestamp?: string | null
        }
        Update: {
          data_masked?: boolean | null
          export_format?: string
          exported_at?: string | null
          exporter_id?: string
          exporter_role?: string
          filter_criteria?: Json | null
          id?: string
          records_exported?: number | null
          server_timestamp?: string | null
        }
        Relationships: []
      }
      promise_fines: {
        Row: {
          applied_at: string
          created_at: string
          developer_id: string
          fine_amount: number
          fine_reason: string
          fine_type: string
          id: string
          paid_at: string | null
          payment_cut_percent: number | null
          promise_id: string
          status: string
          waived_at: string | null
          waived_by: string | null
          waiver_reason: string | null
        }
        Insert: {
          applied_at?: string
          created_at?: string
          developer_id: string
          fine_amount?: number
          fine_reason: string
          fine_type?: string
          id?: string
          paid_at?: string | null
          payment_cut_percent?: number | null
          promise_id: string
          status?: string
          waived_at?: string | null
          waived_by?: string | null
          waiver_reason?: string | null
        }
        Update: {
          applied_at?: string
          created_at?: string
          developer_id?: string
          fine_amount?: number
          fine_reason?: string
          fine_type?: string
          id?: string
          paid_at?: string | null
          payment_cut_percent?: number | null
          promise_id?: string
          status?: string
          waived_at?: string | null
          waived_by?: string | null
          waiver_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promise_fines_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promise_fines_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_tracker_view"
            referencedColumns: ["promise_id"]
          },
        ]
      }
      promise_logs: {
        Row: {
          acknowledged_at: string | null
          approval_required: boolean | null
          approved_at: string | null
          approved_by: string | null
          assigned_role: string | null
          auto_escalation_enabled: boolean | null
          breach_reason: string | null
          confirmed_at: string | null
          confirmed_by_developer: boolean | null
          created_at: string
          deadline: string
          developer_id: string
          escalated_at: string | null
          escalated_to: string[] | null
          escalation_level: number | null
          extended_by: string | null
          extended_count: number | null
          extended_deadline: string | null
          final_audit_log_id: string | null
          fine_amount: number | null
          finished_time: string | null
          fulfillment_verified_at: string | null
          fulfillment_verified_by: string | null
          id: string
          is_locked: boolean | null
          last_status_change_at: string | null
          linked_demo_id: string | null
          linked_order_id: string | null
          linked_task_verified: boolean | null
          on_time_bonus: boolean | null
          penalty_amount: number | null
          priority: string | null
          promise_time: string
          promise_type: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          responsible_user_id: string | null
          reward_amount: number | null
          score_effect: number | null
          status: Database["public"]["Enums"]["promise_status"]
          status_change_count: number | null
          task_id: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_role?: string | null
          auto_escalation_enabled?: boolean | null
          breach_reason?: string | null
          confirmed_at?: string | null
          confirmed_by_developer?: boolean | null
          created_at?: string
          deadline: string
          developer_id: string
          escalated_at?: string | null
          escalated_to?: string[] | null
          escalation_level?: number | null
          extended_by?: string | null
          extended_count?: number | null
          extended_deadline?: string | null
          final_audit_log_id?: string | null
          fine_amount?: number | null
          finished_time?: string | null
          fulfillment_verified_at?: string | null
          fulfillment_verified_by?: string | null
          id?: string
          is_locked?: boolean | null
          last_status_change_at?: string | null
          linked_demo_id?: string | null
          linked_order_id?: string | null
          linked_task_verified?: boolean | null
          on_time_bonus?: boolean | null
          penalty_amount?: number | null
          priority?: string | null
          promise_time?: string
          promise_type?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          responsible_user_id?: string | null
          reward_amount?: number | null
          score_effect?: number | null
          status?: Database["public"]["Enums"]["promise_status"]
          status_change_count?: number | null
          task_id: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_role?: string | null
          auto_escalation_enabled?: boolean | null
          breach_reason?: string | null
          confirmed_at?: string | null
          confirmed_by_developer?: boolean | null
          created_at?: string
          deadline?: string
          developer_id?: string
          escalated_at?: string | null
          escalated_to?: string[] | null
          escalation_level?: number | null
          extended_by?: string | null
          extended_count?: number | null
          extended_deadline?: string | null
          final_audit_log_id?: string | null
          fine_amount?: number | null
          finished_time?: string | null
          fulfillment_verified_at?: string | null
          fulfillment_verified_by?: string | null
          id?: string
          is_locked?: boolean | null
          last_status_change_at?: string | null
          linked_demo_id?: string | null
          linked_order_id?: string | null
          linked_task_verified?: boolean | null
          on_time_bonus?: boolean | null
          penalty_amount?: number | null
          priority?: string | null
          promise_time?: string
          promise_type?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          responsible_user_id?: string | null
          reward_amount?: number | null
          score_effect?: number | null
          status?: Database["public"]["Enums"]["promise_status"]
          status_change_count?: number | null
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promise_logs_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promise_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      promise_view_logs: {
        Row: {
          id: string
          ip_address: string | null
          promise_id: string | null
          server_timestamp: string | null
          session_id: string | null
          user_agent: string | null
          view_type: string
          viewed_at: string | null
          viewer_id: string
          viewer_role: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          promise_id?: string | null
          server_timestamp?: string | null
          session_id?: string | null
          user_agent?: string | null
          view_type?: string
          viewed_at?: string | null
          viewer_id: string
          viewer_role: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          promise_id?: string | null
          server_timestamp?: string | null
          session_id?: string | null
          user_agent?: string | null
          view_type?: string
          viewed_at?: string | null
          viewer_id?: string
          viewer_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "promise_view_logs_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promise_view_logs_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promise_tracker_view"
            referencedColumns: ["promise_id"]
          },
        ]
      }
      promo_assets: {
        Row: {
          asset_type: string | null
          campaign_id: string | null
          created_at: string | null
          created_by: string | null
          file_name: string | null
          file_path: string
          id: string
          usage_count: number | null
        }
        Insert: {
          asset_type?: string | null
          campaign_id?: string | null
          created_at?: string | null
          created_by?: string | null
          file_name?: string | null
          file_path: string
          id?: string
          usage_count?: number | null
        }
        Update: {
          asset_type?: string | null
          campaign_id?: string | null
          created_at?: string | null
          created_by?: string | null
          file_name?: string | null
          file_path?: string
          id?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      quick_support_requests: {
        Row: {
          ai_suggested_solution: string | null
          assigned_to: string | null
          attachments: Json | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          request_type: string | null
          resolution_notes: string | null
          resolved_at: string | null
          response_time_minutes: number | null
          status: string | null
          subject: string
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          ai_suggested_solution?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          request_type?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          response_time_minutes?: number | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          ai_suggested_solution?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          request_type?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          response_time_minutes?: number | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_count: number | null
          action_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          is_blocked: boolean | null
          user_id: string | null
          window_end: string | null
          window_start: string | null
        }
        Insert: {
          action_count?: number | null
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_blocked?: boolean | null
          user_id?: string | null
          window_end?: string | null
          window_start?: string | null
        }
        Update: {
          action_count?: number | null
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_blocked?: boolean | null
          user_id?: string | null
          window_end?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      rd_ideas: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          implementation_notes: string | null
          priority: string | null
          status: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          votes: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          implementation_notes?: string | null
          priority?: string | null
          status?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string
          votes?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          implementation_notes?: string | null
          priority?: string | null
          status?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string
          votes?: number | null
        }
        Relationships: []
      }
      realtime_threat_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          affected_module: string | null
          affected_user_id: string | null
          ai_confidence: number | null
          alert_id: string
          alert_type: string
          auto_mitigated: boolean | null
          created_at: string
          description: string
          device_fingerprint: string | null
          id: string
          metadata: Json | null
          mitigation_action: string | null
          recommended_action: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          source_ip: unknown
          threat_level: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_module?: string | null
          affected_user_id?: string | null
          ai_confidence?: number | null
          alert_id: string
          alert_type: string
          auto_mitigated?: boolean | null
          created_at?: string
          description: string
          device_fingerprint?: string | null
          id?: string
          metadata?: Json | null
          mitigation_action?: string | null
          recommended_action?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          source_ip?: unknown
          threat_level: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_module?: string | null
          affected_user_id?: string | null
          ai_confidence?: number | null
          alert_id?: string
          alert_type?: string
          auto_mitigated?: boolean | null
          created_at?: string
          description?: string
          device_fingerprint?: string | null
          id?: string
          metadata?: Json | null
          mitigation_action?: string | null
          recommended_action?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          source_ip?: unknown
          threat_level?: string
          title?: string
        }
        Relationships: []
      }
      refund_requests: {
        Row: {
          ai_confidence_score: number | null
          ai_recommendation: string | null
          amount: number
          approved_amount: number | null
          chargeback_reference: string | null
          created_at: string | null
          currency: string | null
          fraud_score: number | null
          id: string
          processed_at: string | null
          reason: string
          reason_category: string | null
          review_notes: string | null
          reviewed_by: string | null
          sale_id: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          ai_confidence_score?: number | null
          ai_recommendation?: string | null
          amount: number
          approved_amount?: number | null
          chargeback_reference?: string | null
          created_at?: string | null
          currency?: string | null
          fraud_score?: number | null
          id?: string
          processed_at?: string | null
          reason: string
          reason_category?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          sale_id?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          ai_confidence_score?: number | null
          ai_recommendation?: string | null
          amount?: number
          approved_amount?: number | null
          chargeback_reference?: string | null
          created_at?: string | null
          currency?: string | null
          fraud_score?: number | null
          id?: string
          processed_at?: string | null
          reason?: string
          reason_category?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          sale_id?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      regional_compliance_requirements: {
        Row: {
          created_at: string | null
          description: string | null
          documentation_url: string | null
          enforcement_level: string | null
          id: string
          is_active: boolean | null
          is_mandatory: boolean | null
          penalty_info: string | null
          region_code: string
          requirement_name: string
          requirement_type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          enforcement_level?: string | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          penalty_info?: string | null
          region_code: string
          requirement_name: string
          requirement_type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          enforcement_level?: string | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          penalty_info?: string | null
          region_code?: string
          requirement_name?: string
          requirement_type?: string
        }
        Relationships: []
      }
      regional_tax_rules: {
        Row: {
          applies_to: string[] | null
          country_code: string
          created_at: string | null
          effective_from: string
          effective_until: string | null
          exemption_categories: string[] | null
          id: string
          is_active: boolean | null
          is_compound: boolean | null
          state_code: string | null
          tax_id_label: string | null
          tax_name: string
          tax_rate: number
        }
        Insert: {
          applies_to?: string[] | null
          country_code: string
          created_at?: string | null
          effective_from: string
          effective_until?: string | null
          exemption_categories?: string[] | null
          id?: string
          is_active?: boolean | null
          is_compound?: boolean | null
          state_code?: string | null
          tax_id_label?: string | null
          tax_name: string
          tax_rate: number
        }
        Update: {
          applies_to?: string[] | null
          country_code?: string
          created_at?: string | null
          effective_from?: string
          effective_until?: string | null
          exemption_categories?: string[] | null
          id?: string
          is_active?: boolean | null
          is_compound?: boolean | null
          state_code?: string | null
          tax_id_label?: string | null
          tax_name?: string
          tax_rate?: number
        }
        Relationships: []
      }
      rentable_features: {
        Row: {
          created_at: string | null
          description: string | null
          feature_code: string
          feature_name: string
          id: string
          is_active: boolean | null
          module_code: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_code: string
          feature_name: string
          id?: string
          is_active?: boolean | null
          module_code: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_code?: string
          feature_name?: string
          id?: string
          is_active?: boolean | null
          module_code?: string
        }
        Relationships: []
      }
      rental_activity: {
        Row: {
          bounce: boolean | null
          click_heatmap: Json | null
          conversion_action: string | null
          created_at: string
          demo_id: string
          duration_seconds: number | null
          id: string
          pages_visited: Json | null
          rental_link_id: string
          session_end: string | null
          session_start: string | null
          visitor_browser: string | null
          visitor_city: string | null
          visitor_country: string | null
          visitor_device: string | null
          visitor_ip: string | null
        }
        Insert: {
          bounce?: boolean | null
          click_heatmap?: Json | null
          conversion_action?: string | null
          created_at?: string
          demo_id: string
          duration_seconds?: number | null
          id?: string
          pages_visited?: Json | null
          rental_link_id: string
          session_end?: string | null
          session_start?: string | null
          visitor_browser?: string | null
          visitor_city?: string | null
          visitor_country?: string | null
          visitor_device?: string | null
          visitor_ip?: string | null
        }
        Update: {
          bounce?: boolean | null
          click_heatmap?: Json | null
          conversion_action?: string | null
          created_at?: string
          demo_id?: string
          duration_seconds?: number | null
          id?: string
          pages_visited?: Json | null
          rental_link_id?: string
          session_end?: string | null
          session_start?: string | null
          visitor_browser?: string | null
          visitor_city?: string | null
          visitor_country?: string | null
          visitor_device?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_activity_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_activity_rental_link_id_fkey"
            columns: ["rental_link_id"]
            isOneToOne: false
            referencedRelation: "demo_rental_links"
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
      rental_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          duration_type: string
          duration_value: number | null
          id: string
          is_active: boolean | null
          plan_name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          duration_type: string
          duration_value?: number | null
          id?: string
          is_active?: boolean | null
          plan_name: string
          price: number
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          duration_type?: string
          duration_value?: number | null
          id?: string
          is_active?: boolean | null
          plan_name?: string
          price?: number
        }
        Relationships: []
      }
      rentals: {
        Row: {
          assigned_by_super_admin_id: string | null
          assigned_to_user_id: string
          auto_renew: boolean | null
          created_at: string | null
          end_time: string
          feature_id: string
          id: string
          plan_id: string
          start_time: string
          status: string | null
        }
        Insert: {
          assigned_by_super_admin_id?: string | null
          assigned_to_user_id: string
          auto_renew?: boolean | null
          created_at?: string | null
          end_time: string
          feature_id: string
          id?: string
          plan_id: string
          start_time?: string
          status?: string | null
        }
        Update: {
          assigned_by_super_admin_id?: string | null
          assigned_to_user_id?: string
          auto_renew?: boolean | null
          created_at?: string | null
          end_time?: string
          feature_id?: string
          id?: string
          plan_id?: string
          start_time?: string
          status?: string | null
        }
        Relationships: []
      }
      reputation_scores: {
        Row: {
          complaint_ratio: number | null
          created_at: string
          delivery_accuracy: number | null
          entity_id: string
          entity_type: string
          failed_transactions: number | null
          fraud_incidents: number | null
          id: string
          lead_assignment_priority: string | null
          payout_priority: string | null
          performance_rating: number | null
          star_rating: number | null
          successful_transactions: number | null
          total_transactions: number | null
          trust_index: number | null
          updated_at: string
          wallet_privilege_level: string | null
        }
        Insert: {
          complaint_ratio?: number | null
          created_at?: string
          delivery_accuracy?: number | null
          entity_id: string
          entity_type: string
          failed_transactions?: number | null
          fraud_incidents?: number | null
          id?: string
          lead_assignment_priority?: string | null
          payout_priority?: string | null
          performance_rating?: number | null
          star_rating?: number | null
          successful_transactions?: number | null
          total_transactions?: number | null
          trust_index?: number | null
          updated_at?: string
          wallet_privilege_level?: string | null
        }
        Update: {
          complaint_ratio?: number | null
          created_at?: string
          delivery_accuracy?: number | null
          entity_id?: string
          entity_type?: string
          failed_transactions?: number | null
          fraud_incidents?: number | null
          id?: string
          lead_assignment_priority?: string | null
          payout_priority?: string | null
          performance_rating?: number | null
          star_rating?: number | null
          successful_transactions?: number | null
          total_transactions?: number | null
          trust_index?: number | null
          updated_at?: string
          wallet_privilege_level?: string | null
        }
        Relationships: []
      }
      research_suggestions: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_by: string | null
          suggestion_id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_by?: string | null
          suggestion_id?: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_by?: string | null
          suggestion_id?: string
          title?: string
        }
        Relationships: []
      }
      reseller_accounts: {
        Row: {
          address: string | null
          certification_date: string | null
          certification_score: number | null
          city: string | null
          commission_rate: number | null
          country: string | null
          created_at: string
          email: string
          franchise_id: string | null
          full_name: string
          id: string
          joined_at: string | null
          kyc_documents: Json | null
          kyc_status: string | null
          language_preference: string | null
          last_active_at: string | null
          masked_email: string | null
          masked_phone: string | null
          phone: string
          pincode: string | null
          reseller_code: string
          sales_target_monthly: number | null
          state: string | null
          status: string | null
          total_leads_converted: number | null
          total_sales: number | null
          training_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          certification_date?: string | null
          certification_score?: number | null
          city?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          email: string
          franchise_id?: string | null
          full_name: string
          id?: string
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          language_preference?: string | null
          last_active_at?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          phone: string
          pincode?: string | null
          reseller_code: string
          sales_target_monthly?: number | null
          state?: string | null
          status?: string | null
          total_leads_converted?: number | null
          total_sales?: number | null
          training_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          certification_date?: string | null
          certification_score?: number | null
          city?: string | null
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          email?: string
          franchise_id?: string | null
          full_name?: string
          id?: string
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          language_preference?: string | null
          last_active_at?: string | null
          masked_email?: string | null
          masked_phone?: string | null
          phone?: string
          pincode?: string | null
          reseller_code?: string
          sales_target_monthly?: number | null
          state?: string | null
          status?: string | null
          total_leads_converted?: number | null
          total_sales?: number | null
          training_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_accounts_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          device_info: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          reseller_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          reseller_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          reseller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_activity_logs_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_applications: {
        Row: {
          application_type: string
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          id_proof_uploaded: boolean
          payment_amount: number | null
          payment_date: string | null
          payment_reference: string | null
          payment_status: string | null
          phone: string | null
          promise_acknowledged: boolean
          rejection_reason: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          status: string
          terms_accepted: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          application_type?: string
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          id_proof_uploaded?: boolean
          payment_amount?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          phone?: string | null
          promise_acknowledged?: boolean
          rejection_reason?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          terms_accepted?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          application_type?: string
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          id_proof_uploaded?: boolean
          payment_amount?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          phone?: string | null
          promise_acknowledged?: boolean
          rejection_reason?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          terms_accepted?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reseller_commissions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bonus_amount: number | null
          commission_amount: number
          commission_rate: number
          commission_type: string
          created_at: string
          credited_at: string | null
          description: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          reseller_id: string
          sale_amount: number
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bonus_amount?: number | null
          commission_amount: number
          commission_rate: number
          commission_type: string
          created_at?: string
          credited_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          reseller_id: string
          sale_amount: number
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bonus_amount?: number | null
          commission_amount?: number
          commission_rate?: number
          commission_type?: string
          created_at?: string
          credited_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          reseller_id?: string
          sale_amount?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_commissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "reseller_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_commissions_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_demo_clicks: {
        Row: {
          ai_fraud_score: number | null
          browser: string | null
          city: string | null
          clicked_at: string | null
          converted: boolean | null
          country: string | null
          demo_id: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          is_fake_click: boolean | null
          lead_id: string | null
          referrer: string | null
          reseller_id: string
          session_duration: number | null
          tracking_id: string
        }
        Insert: {
          ai_fraud_score?: number | null
          browser?: string | null
          city?: string | null
          clicked_at?: string | null
          converted?: boolean | null
          country?: string | null
          demo_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_fake_click?: boolean | null
          lead_id?: string | null
          referrer?: string | null
          reseller_id: string
          session_duration?: number | null
          tracking_id: string
        }
        Update: {
          ai_fraud_score?: number | null
          browser?: string | null
          city?: string | null
          clicked_at?: string | null
          converted?: boolean | null
          country?: string | null
          demo_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_fake_click?: boolean | null
          lead_id?: string | null
          referrer?: string | null
          reseller_id?: string
          session_duration?: number | null
          tracking_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_demo_clicks_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_demo_clicks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "reseller_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_demo_clicks_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_escalations: {
        Row: {
          attachments: Json | null
          created_at: string
          description: string
          escalated_to: string | null
          escalated_to_role: string | null
          escalation_type: string
          id: string
          lead_id: string | null
          priority: string | null
          reseller_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          subject: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          description: string
          escalated_to?: string | null
          escalated_to_role?: string | null
          escalation_type: string
          id?: string
          lead_id?: string | null
          priority?: string | null
          reseller_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          description?: string
          escalated_to?: string | null
          escalated_to_role?: string | null
          escalation_type?: string
          id?: string
          lead_id?: string | null
          priority?: string | null
          reseller_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_escalations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "reseller_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_escalations_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_leads: {
        Row: {
          ai_notes: string | null
          assigned_at: string | null
          city: string | null
          commission_earned: number | null
          conversion_probability: number | null
          converted_at: string | null
          created_at: string
          demo_clicked_at: string | null
          demo_link_id: string | null
          demo_requested: boolean | null
          follow_up_count: number | null
          franchise_id: string | null
          id: string
          industry: string | null
          last_follow_up: string | null
          lead_name: string
          lead_score: number | null
          masked_contact: string | null
          next_follow_up: string | null
          original_lead_id: string | null
          priority: string | null
          region: string | null
          reseller_id: string
          sale_value: number | null
          status: string | null
        }
        Insert: {
          ai_notes?: string | null
          assigned_at?: string | null
          city?: string | null
          commission_earned?: number | null
          conversion_probability?: number | null
          converted_at?: string | null
          created_at?: string
          demo_clicked_at?: string | null
          demo_link_id?: string | null
          demo_requested?: boolean | null
          follow_up_count?: number | null
          franchise_id?: string | null
          id?: string
          industry?: string | null
          last_follow_up?: string | null
          lead_name: string
          lead_score?: number | null
          masked_contact?: string | null
          next_follow_up?: string | null
          original_lead_id?: string | null
          priority?: string | null
          region?: string | null
          reseller_id: string
          sale_value?: number | null
          status?: string | null
        }
        Update: {
          ai_notes?: string | null
          assigned_at?: string | null
          city?: string | null
          commission_earned?: number | null
          conversion_probability?: number | null
          converted_at?: string | null
          created_at?: string
          demo_clicked_at?: string | null
          demo_link_id?: string | null
          demo_requested?: boolean | null
          follow_up_count?: number | null
          franchise_id?: string | null
          id?: string
          industry?: string | null
          last_follow_up?: string | null
          lead_name?: string
          lead_score?: number | null
          masked_contact?: string | null
          next_follow_up?: string | null
          original_lead_id?: string | null
          priority?: string | null
          region?: string | null
          reseller_id?: string
          sale_value?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_leads_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_leads_original_lead_id_fkey"
            columns: ["original_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_leads_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_payouts: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          bank_details: Json | null
          created_at: string
          id: string
          notes: string | null
          payment_method: string | null
          payout_type: string
          processed_at: string | null
          requested_at: string | null
          reseller_id: string
          status: string | null
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payout_type: string
          processed_at?: string | null
          requested_at?: string | null
          reseller_id: string
          status?: string | null
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          bank_details?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payout_type?: string
          processed_at?: string | null
          requested_at?: string | null
          reseller_id?: string
          status?: string | null
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_payouts_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_territory_map: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string
          franchise_id: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          reseller_id: string
          territory_code: string | null
          territory_name: string
          territory_type: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          franchise_id?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          reseller_id: string
          territory_code?: string | null
          territory_name: string
          territory_type: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          franchise_id?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          reseller_id?: string
          territory_code?: string | null
          territory_name?: string
          territory_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_territory_map_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchise_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_territory_map_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_training: {
        Row: {
          ai_feedback: string | null
          attempts: number | null
          certificate_issued: boolean | null
          certificate_url: string | null
          completed_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          max_score: number | null
          module_name: string
          module_type: string | null
          passed: boolean | null
          reseller_id: string
          score: number
        }
        Insert: {
          ai_feedback?: string | null
          attempts?: number | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          max_score?: number | null
          module_name: string
          module_type?: string | null
          passed?: boolean | null
          reseller_id: string
          score: number
        }
        Update: {
          ai_feedback?: string | null
          attempts?: number | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          max_score?: number | null
          module_name?: string
          module_type?: string | null
          passed?: boolean | null
          reseller_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "reseller_training_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_wallet: {
        Row: {
          available_balance: number
          created_at: string
          id: string
          last_payout_at: string | null
          pending_balance: number
          reseller_id: string
          total_bonus: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          id?: string
          last_payout_at?: string | null
          pending_balance?: number
          reseller_id: string
          total_bonus?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          id?: string
          last_payout_at?: string | null
          pending_balance?: number
          reseller_id?: string
          total_bonus?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_wallet_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: true
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          reseller_id: string
          status: string | null
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          reseller_id: string
          status?: string | null
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          reseller_id?: string
          status?: string | null
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_wallet_transactions_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "reseller_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "reseller_wallet"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          action_taken: string | null
          alert_type: string
          auto_action_available: boolean | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          indicators: Json | null
          is_active: boolean | null
          recommended_action: string | null
          risk_level: string | null
          risk_score: number | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type: string
          auto_action_available?: boolean | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          indicators?: Json | null
          is_active?: boolean | null
          recommended_action?: string | null
          risk_level?: string | null
          risk_score?: number | null
          severity: string
          title: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_taken?: string | null
          alert_type?: string
          auto_action_available?: boolean | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          indicators?: Json | null
          is_active?: boolean | null
          recommended_action?: string | null
          risk_level?: string | null
          risk_score?: number | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_audit_trail: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          calculation_details: Json | null
          created_at: string
          escalation_trace: Json | null
          id: string
          ip_address: string | null
          reasoning: Json | null
          risk_score_after: number | null
          risk_score_before: number | null
          trigger_type: string | null
          user_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          calculation_details?: Json | null
          created_at?: string
          escalation_trace?: Json | null
          id?: string
          ip_address?: string | null
          reasoning?: Json | null
          risk_score_after?: number | null
          risk_score_before?: number | null
          trigger_type?: string | null
          user_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          calculation_details?: Json | null
          created_at?: string
          escalation_trace?: Json | null
          id?: string
          ip_address?: string | null
          reasoning?: Json | null
          risk_score_after?: number | null
          risk_score_before?: number | null
          trigger_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      risk_escalations: {
        Row: {
          action_details: Json | null
          action_taken: string
          auto_triggered: boolean | null
          created_at: string
          escalation_level: number
          id: string
          notification_sent: boolean | null
          reversal_reason: string | null
          reversed: boolean | null
          reversed_at: string | null
          reversed_by: string | null
          risk_score_at_time: number | null
          trigger_event_id: string | null
          trigger_reason: string
          triggered_by: string | null
          user_id: string
        }
        Insert: {
          action_details?: Json | null
          action_taken: string
          auto_triggered?: boolean | null
          created_at?: string
          escalation_level: number
          id?: string
          notification_sent?: boolean | null
          reversal_reason?: string | null
          reversed?: boolean | null
          reversed_at?: string | null
          reversed_by?: string | null
          risk_score_at_time?: number | null
          trigger_event_id?: string | null
          trigger_reason: string
          triggered_by?: string | null
          user_id: string
        }
        Update: {
          action_details?: Json | null
          action_taken?: string
          auto_triggered?: boolean | null
          created_at?: string
          escalation_level?: number
          id?: string
          notification_sent?: boolean | null
          reversal_reason?: string | null
          reversed?: boolean | null
          reversed_at?: string | null
          reversed_by?: string | null
          risk_score_at_time?: number | null
          trigger_event_id?: string | null
          trigger_reason?: string
          triggered_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_escalations_trigger_event_id_fkey"
            columns: ["trigger_event_id"]
            isOneToOne: false
            referencedRelation: "risk_events"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_events: {
        Row: {
          created_at: string
          description: string | null
          device_fingerprint: string | null
          event_category: string
          event_type: string
          geo_location: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          risk_contribution: number | null
          severity: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          device_fingerprint?: string | null
          event_category: string
          event_type: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_contribution?: number | null
          severity?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          device_fingerprint?: string | null
          event_category?: string
          event_type?: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_contribution?: number | null
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_scores: {
        Row: {
          auto_action_taken: string | null
          behavior_score: number | null
          commission_score: number | null
          created_at: string
          current_score: number
          device_score: number | null
          escalation_level: number | null
          factors: Json | null
          id: string
          last_calculated_at: string | null
          lead_score: number | null
          login_pattern_score: number | null
          previous_score: number | null
          risk_level: string
          transaction_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_action_taken?: string | null
          behavior_score?: number | null
          commission_score?: number | null
          created_at?: string
          current_score?: number
          device_score?: number | null
          escalation_level?: number | null
          factors?: Json | null
          id?: string
          last_calculated_at?: string | null
          lead_score?: number | null
          login_pattern_score?: number | null
          previous_score?: number | null
          risk_level?: string
          transaction_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_action_taken?: string | null
          behavior_score?: number | null
          commission_score?: number | null
          created_at?: string
          current_score?: number
          device_score?: number | null
          escalation_level?: number | null
          factors?: Json | null
          id?: string
          last_calculated_at?: string | null
          lead_score?: number | null
          login_pattern_score?: number | null
          previous_score?: number | null
          risk_level?: string
          transaction_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_watchlist: {
        Row: {
          added_by: string | null
          auto_added: boolean | null
          created_at: string
          current_status: string | null
          expires_at: string | null
          id: string
          notes: string | null
          reason: string
          trigger_threshold: number | null
          updated_at: string
          user_id: string
          watchlist_type: string
        }
        Insert: {
          added_by?: string | null
          auto_added?: boolean | null
          created_at?: string
          current_status?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          reason: string
          trigger_threshold?: number | null
          updated_at?: string
          user_id: string
          watchlist_type: string
        }
        Update: {
          added_by?: string | null
          auto_added?: boolean | null
          created_at?: string
          current_status?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          reason?: string
          trigger_threshold?: number | null
          updated_at?: string
          user_id?: string
          watchlist_type?: string
        }
        Relationships: []
      }
      rnd_suggestions: {
        Row: {
          approved_by: string | null
          created_at: string
          feature_description: string | null
          feature_title: string
          id: string
          priority: string | null
          status: string | null
          suggested_by: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          feature_description?: string | null
          feature_title: string
          id?: string
          priority?: string | null
          status?: string | null
          suggested_by: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          feature_description?: string | null
          feature_title?: string
          id?: string
          priority?: string | null
          status?: string | null
          suggested_by?: string
        }
        Relationships: []
      }
      role_activity_log: {
        Row: {
          action_object: string | null
          action_type: string
          created_at: string | null
          device: string | null
          geo_location: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          risk_flag: string | null
          role_id: string
          role_type: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          action_object?: string | null
          action_type: string
          created_at?: string | null
          device?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          risk_flag?: string | null
          role_id: string
          role_type: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          action_object?: string | null
          action_type?: string
          created_at?: string | null
          device?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          risk_flag?: string | null
          role_id?: string
          role_type?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      role_clause_agreements: {
        Row: {
          accepted_at: string
          clause_id: string
          clause_version: string
          created_at: string | null
          device_fingerprint: string | null
          id: string
          invalidated_at: string | null
          invalidated_reason: string | null
          ip_address: string | null
          is_valid: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          clause_id: string
          clause_version: string
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          invalidated_at?: string | null
          invalidated_reason?: string | null
          ip_address?: string | null
          is_valid?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          clause_id?: string
          clause_version?: string
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          invalidated_at?: string | null
          invalidated_reason?: string | null
          ip_address?: string | null
          is_valid?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          action: string
          created_at: string
          id: string
          module_name: string
          permission_name: string
          role_name: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          module_name: string
          permission_name: string
          role_name: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          module_name?: string
          permission_name?: string
          role_name?: string
        }
        Relationships: []
      }
      role_restrictions: {
        Row: {
          allowed_countries: string[] | null
          created_at: string | null
          geo_restriction: boolean | null
          id: string
          ip_restriction: boolean | null
          max_devices: number | null
          max_sessions: number | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          allowed_countries?: string[] | null
          created_at?: string | null
          geo_restriction?: boolean | null
          id?: string
          ip_restriction?: boolean | null
          max_devices?: number | null
          max_sessions?: number | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          allowed_countries?: string[] | null
          created_at?: string | null
          geo_restriction?: boolean | null
          id?: string
          ip_restriction?: boolean | null
          max_devices?: number | null
          max_sessions?: number | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          is_active: boolean | null
          role_id: string
          role_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_active?: boolean | null
          role_id?: string
          role_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          is_active?: boolean | null
          role_id?: string
          role_name?: string
        }
        Relationships: []
      }
      rule_execution_logs: {
        Row: {
          affected_entities: Json | null
          executed_at: string | null
          executed_by_super_admin_id: string | null
          execution_duration_ms: number | null
          execution_result: string
          id: string
          rule_id: string
          trigger_type: string
        }
        Insert: {
          affected_entities?: Json | null
          executed_at?: string | null
          executed_by_super_admin_id?: string | null
          execution_duration_ms?: number | null
          execution_result: string
          id?: string
          rule_id: string
          trigger_type: string
        }
        Update: {
          affected_entities?: Json | null
          executed_at?: string | null
          executed_by_super_admin_id?: string | null
          execution_duration_ms?: number | null
          execution_result?: string
          id?: string
          rule_id?: string
          trigger_type?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          created_at: string | null
          created_by_super_admin_id: string | null
          id: string
          priority: number | null
          rule_logic: Json
          rule_name: string
          rule_type: string
          scope_definition: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_super_admin_id?: string | null
          id?: string
          priority?: number | null
          rule_logic?: Json
          rule_name: string
          rule_type: string
          scope_definition?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_super_admin_id?: string | null
          id?: string
          priority?: number | null
          rule_logic?: Json
          rule_name?: string
          rule_type?: string
          scope_definition?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sa_approval_queue: {
        Row: {
          action_payload: Json | null
          action_type: string
          created_at: string | null
          id: string
          priority: string | null
          requested_by_id: string
          requested_by_role: Database["public"]["Enums"]["app_role"]
          review_notes: string | null
          review_time: string | null
          reviewed_by_super_admin_id: string | null
          status: string | null
        }
        Insert: {
          action_payload?: Json | null
          action_type: string
          created_at?: string | null
          id?: string
          priority?: string | null
          requested_by_id: string
          requested_by_role: Database["public"]["Enums"]["app_role"]
          review_notes?: string | null
          review_time?: string | null
          reviewed_by_super_admin_id?: string | null
          status?: string | null
        }
        Update: {
          action_payload?: Json | null
          action_type?: string
          created_at?: string | null
          id?: string
          priority?: string | null
          requested_by_id?: string
          requested_by_role?: Database["public"]["Enums"]["app_role"]
          review_notes?: string | null
          review_time?: string | null
          reviewed_by_super_admin_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sa_approval_queue_reviewed_by_super_admin_id_fkey"
            columns: ["reviewed_by_super_admin_id"]
            isOneToOne: false
            referencedRelation: "super_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_assist_ai_logs: {
        Row: {
          action_recommended: string | null
          action_taken: string | null
          ai_analysis: Json | null
          auto_handled: boolean | null
          event_type: string
          id: string
          risk_level: string | null
          session_id: string | null
          timestamp: string | null
        }
        Insert: {
          action_recommended?: string | null
          action_taken?: string | null
          ai_analysis?: Json | null
          auto_handled?: boolean | null
          event_type: string
          id?: string
          risk_level?: string | null
          session_id?: string | null
          timestamp?: string | null
        }
        Update: {
          action_recommended?: string | null
          action_taken?: string | null
          ai_analysis?: Json | null
          auto_handled?: boolean | null
          event_type?: string
          id?: string
          risk_level?: string | null
          session_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safe_assist_ai_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "safe_assist_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_assist_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          recipients: string[]
          session_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          recipients?: string[]
          session_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          recipients?: string[]
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "remote_assist_alerts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "safe_assist_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_assist_events: {
        Row: {
          actor_type: string
          event_data: Json
          event_type: string
          id: string
          session_id: string
          timestamp: string
        }
        Insert: {
          actor_type: string
          event_data?: Json
          event_type: string
          id?: string
          session_id: string
          timestamp?: string
        }
        Update: {
          actor_type?: string
          event_data?: Json
          event_type?: string
          id?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "remote_assist_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "safe_assist_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_assist_mask_patterns: {
        Row: {
          created_at: string
          field_type: string
          id: string
          is_active: boolean
          pattern_name: string
          selector_pattern: string
        }
        Insert: {
          created_at?: string
          field_type: string
          id?: string
          is_active?: boolean
          pattern_name: string
          selector_pattern: string
        }
        Update: {
          created_at?: string
          field_type?: string
          id?: string
          is_active?: boolean
          pattern_name?: string
          selector_pattern?: string
        }
        Relationships: []
      }
      safe_assist_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          notification_type: string
          read_at: string | null
          session_id: string | null
          severity: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          notification_type: string
          read_at?: string | null
          session_id?: string | null
          severity?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          notification_type?: string
          read_at?: string | null
          session_id?: string | null
          severity?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safe_assist_notifications_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "safe_assist_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      safe_assist_sessions: {
        Row: {
          agent_device_fingerprint: string | null
          agent_entered_user_code: string | null
          agent_ip_address: string | null
          agent_masked_id: string | null
          agent_watermark_text: string | null
          ai_flags: Json | null
          ai_monitoring_enabled: boolean | null
          ai_risk_score: number | null
          client_notified_at: string | null
          created_at: string
          dual_verified: boolean | null
          end_reason: string | null
          ended_at: string | null
          ended_by: string | null
          expires_at: string
          id: string
          is_recording_enabled: boolean
          max_duration_minutes: number
          mode: Database["public"]["Enums"]["remote_assist_mode"]
          recording_url: string | null
          session_code: string
          started_at: string | null
          status: Database["public"]["Enums"]["remote_assist_status"]
          support_agent_id: string | null
          support_agent_role: Database["public"]["Enums"]["app_role"] | null
          user_consent_at: string | null
          user_consent_given: boolean
          user_device_fingerprint: string | null
          user_entered_agent_code: string | null
          user_id: string
          user_ip_address: string | null
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          agent_device_fingerprint?: string | null
          agent_entered_user_code?: string | null
          agent_ip_address?: string | null
          agent_masked_id?: string | null
          agent_watermark_text?: string | null
          ai_flags?: Json | null
          ai_monitoring_enabled?: boolean | null
          ai_risk_score?: number | null
          client_notified_at?: string | null
          created_at?: string
          dual_verified?: boolean | null
          end_reason?: string | null
          ended_at?: string | null
          ended_by?: string | null
          expires_at?: string
          id?: string
          is_recording_enabled?: boolean
          max_duration_minutes?: number
          mode?: Database["public"]["Enums"]["remote_assist_mode"]
          recording_url?: string | null
          session_code: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["remote_assist_status"]
          support_agent_id?: string | null
          support_agent_role?: Database["public"]["Enums"]["app_role"] | null
          user_consent_at?: string | null
          user_consent_given?: boolean
          user_device_fingerprint?: string | null
          user_entered_agent_code?: string | null
          user_id: string
          user_ip_address?: string | null
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          agent_device_fingerprint?: string | null
          agent_entered_user_code?: string | null
          agent_ip_address?: string | null
          agent_masked_id?: string | null
          agent_watermark_text?: string | null
          ai_flags?: Json | null
          ai_monitoring_enabled?: boolean | null
          ai_risk_score?: number | null
          client_notified_at?: string | null
          created_at?: string
          dual_verified?: boolean | null
          end_reason?: string | null
          ended_at?: string | null
          ended_by?: string | null
          expires_at?: string
          id?: string
          is_recording_enabled?: boolean
          max_duration_minutes?: number
          mode?: Database["public"]["Enums"]["remote_assist_mode"]
          recording_url?: string | null
          session_code?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["remote_assist_status"]
          support_agent_id?: string | null
          support_agent_role?: Database["public"]["Enums"]["app_role"] | null
          user_consent_at?: string | null
          user_consent_given?: boolean
          user_device_fingerprint?: string | null
          user_entered_agent_code?: string | null
          user_id?: string
          user_ip_address?: string | null
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      scaling_events: {
        Row: {
          completed_at: string | null
          cooldown_until: string | null
          cpu_after: number | null
          cpu_before: number | null
          created_at: string | null
          error_message: string | null
          id: string
          policy_id: string | null
          ram_after: number | null
          ram_before: number | null
          scale_direction: string | null
          server_id: string | null
          status: string | null
          storage_after: number | null
          storage_before: number | null
          threshold_value: number | null
          trigger_reason: string
          trigger_value: number | null
        }
        Insert: {
          completed_at?: string | null
          cooldown_until?: string | null
          cpu_after?: number | null
          cpu_before?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          policy_id?: string | null
          ram_after?: number | null
          ram_before?: number | null
          scale_direction?: string | null
          server_id?: string | null
          status?: string | null
          storage_after?: number | null
          storage_before?: number | null
          threshold_value?: number | null
          trigger_reason: string
          trigger_value?: number | null
        }
        Update: {
          completed_at?: string | null
          cooldown_until?: string | null
          cpu_after?: number | null
          cpu_before?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          policy_id?: string | null
          ram_after?: number | null
          ram_before?: number | null
          scale_direction?: string | null
          server_id?: string | null
          status?: string | null
          storage_after?: number | null
          storage_before?: number | null
          threshold_value?: number | null
          trigger_reason?: string
          trigger_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scaling_events_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "auto_scaling_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scaling_events_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      school_academic_years: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          institution_id: string | null
          is_current: boolean | null
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          institution_id?: string | null
          is_current?: boolean | null
          name: string
          start_date: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          institution_id?: string | null
          is_current?: boolean | null
          name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_academic_years_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_attendance: {
        Row: {
          attendance_date: string
          created_at: string | null
          id: string
          marked_by: string | null
          remarks: string | null
          section_id: string | null
          status: string
          student_id: string | null
        }
        Insert: {
          attendance_date: string
          created_at?: string | null
          id?: string
          marked_by?: string | null
          remarks?: string | null
          section_id?: string | null
          status: string
          student_id?: string | null
        }
        Update: {
          attendance_date?: string
          created_at?: string | null
          id?: string
          marked_by?: string | null
          remarks?: string | null
          section_id?: string | null
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_attendance_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "school_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "school_students"
            referencedColumns: ["id"]
          },
        ]
      }
      school_branches: {
        Row: {
          address: string | null
          city: string | null
          code: string
          created_at: string | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          name: string
          phone: string | null
          principal_user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name: string
          phone?: string | null
          principal_user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name?: string
          phone?: string | null
          principal_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_branches_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_class_subjects: {
        Row: {
          class_id: string | null
          created_at: string | null
          id: string
          is_mandatory: boolean | null
          periods_per_week: number | null
          subject_id: string | null
          teacher_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          periods_per_week?: number | null
          subject_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          periods_per_week?: number | null
          subject_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_class_subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_class_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "school_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_class_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      school_classes: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          name: string
          numeric_level: number | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name: string
          numeric_level?: number | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name?: string
          numeric_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "school_classes_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_exam_results: {
        Row: {
          created_at: string | null
          entered_by: string | null
          examination_id: string | null
          grade: string | null
          id: string
          marks_obtained: number | null
          max_marks: number | null
          remarks: string | null
          student_id: string | null
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          entered_by?: string | null
          examination_id?: string | null
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          max_marks?: number | null
          remarks?: string | null
          student_id?: string | null
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          entered_by?: string | null
          examination_id?: string | null
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          max_marks?: number | null
          remarks?: string | null
          student_id?: string | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_exam_results_entered_by_fkey"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_exam_results_examination_id_fkey"
            columns: ["examination_id"]
            isOneToOne: false
            referencedRelation: "school_examinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_exam_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "school_students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_exam_results_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "school_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      school_examinations: {
        Row: {
          academic_year_id: string | null
          created_at: string | null
          end_date: string | null
          exam_type: string | null
          id: string
          institution_id: string | null
          is_published: boolean | null
          name: string
          start_date: string | null
        }
        Insert: {
          academic_year_id?: string | null
          created_at?: string | null
          end_date?: string | null
          exam_type?: string | null
          id?: string
          institution_id?: string | null
          is_published?: boolean | null
          name: string
          start_date?: string | null
        }
        Update: {
          academic_year_id?: string | null
          created_at?: string | null
          end_date?: string | null
          exam_type?: string | null
          id?: string
          institution_id?: string | null
          is_published?: boolean | null
          name?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_examinations_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "school_academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_examinations_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_fee_payments: {
        Row: {
          amount: number
          collected_by: string | null
          created_at: string | null
          fee_structure_id: string | null
          id: string
          payment_date: string
          payment_method: string | null
          receipt_number: string | null
          remarks: string | null
          status: string | null
          student_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          collected_by?: string | null
          created_at?: string | null
          fee_structure_id?: string | null
          id?: string
          payment_date: string
          payment_method?: string | null
          receipt_number?: string | null
          remarks?: string | null
          status?: string | null
          student_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          collected_by?: string | null
          created_at?: string | null
          fee_structure_id?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          receipt_number?: string | null
          remarks?: string | null
          status?: string | null
          student_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_fee_payments_collected_by_fkey"
            columns: ["collected_by"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_fee_payments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "school_fee_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "school_students"
            referencedColumns: ["id"]
          },
        ]
      }
      school_fee_structure: {
        Row: {
          academic_year_id: string | null
          amount: number
          class_id: string | null
          created_at: string | null
          due_date: string | null
          fee_type: string
          id: string
          institution_id: string | null
          is_mandatory: boolean | null
        }
        Insert: {
          academic_year_id?: string | null
          amount: number
          class_id?: string | null
          created_at?: string | null
          due_date?: string | null
          fee_type: string
          id?: string
          institution_id?: string | null
          is_mandatory?: boolean | null
        }
        Update: {
          academic_year_id?: string | null
          amount?: number
          class_id?: string | null
          created_at?: string | null
          due_date?: string | null
          fee_type?: string
          id?: string
          institution_id?: string | null
          is_mandatory?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "school_fee_structure_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "school_academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_fee_structure_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_fee_structure_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_hostel_rooms: {
        Row: {
          block: string | null
          branch_id: string | null
          capacity: number | null
          created_at: string | null
          floor: number | null
          id: string
          institution_id: string | null
          is_available: boolean | null
          monthly_fee: number | null
          room_number: string
          room_type: string | null
        }
        Insert: {
          block?: string | null
          branch_id?: string | null
          capacity?: number | null
          created_at?: string | null
          floor?: number | null
          id?: string
          institution_id?: string | null
          is_available?: boolean | null
          monthly_fee?: number | null
          room_number: string
          room_type?: string | null
        }
        Update: {
          block?: string | null
          branch_id?: string | null
          capacity?: number | null
          created_at?: string | null
          floor?: number | null
          id?: string
          institution_id?: string | null
          is_available?: boolean | null
          monthly_fee?: number | null
          room_number?: string
          room_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_hostel_rooms_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "school_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_hostel_rooms_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_institutions: {
        Row: {
          address: string | null
          city: string | null
          code: string
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      school_library_books: {
        Row: {
          author: string | null
          available_quantity: number | null
          category: string | null
          created_at: string | null
          id: string
          institution_id: string | null
          isbn: string | null
          location: string | null
          publisher: string | null
          quantity: number | null
          title: string
        }
        Insert: {
          author?: string | null
          available_quantity?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string | null
          isbn?: string | null
          location?: string | null
          publisher?: string | null
          quantity?: number | null
          title: string
        }
        Update: {
          author?: string | null
          available_quantity?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string | null
          isbn?: string | null
          location?: string | null
          publisher?: string | null
          quantity?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_library_books_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_library_transactions: {
        Row: {
          book_id: string | null
          borrower_id: string
          borrower_type: string | null
          created_at: string | null
          due_date: string
          fine_amount: number | null
          id: string
          issue_date: string
          return_date: string | null
          status: string | null
        }
        Insert: {
          book_id?: string | null
          borrower_id: string
          borrower_type?: string | null
          created_at?: string | null
          due_date: string
          fine_amount?: number | null
          id?: string
          issue_date: string
          return_date?: string | null
          status?: string | null
        }
        Update: {
          book_id?: string | null
          borrower_id?: string
          borrower_type?: string | null
          created_at?: string | null
          due_date?: string
          fine_amount?: number | null
          id?: string
          issue_date?: string
          return_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_library_transactions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "school_library_books"
            referencedColumns: ["id"]
          },
        ]
      }
      school_notices: {
        Row: {
          attachment_url: string | null
          branch_id: string | null
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          institution_id: string | null
          is_published: boolean | null
          notice_type: string | null
          published_at: string | null
          target_audience: string[] | null
          title: string
        }
        Insert: {
          attachment_url?: string | null
          branch_id?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          institution_id?: string | null
          is_published?: boolean | null
          notice_type?: string | null
          published_at?: string | null
          target_audience?: string[] | null
          title: string
        }
        Update: {
          attachment_url?: string | null
          branch_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          institution_id?: string | null
          is_published?: boolean | null
          notice_type?: string | null
          published_at?: string | null
          target_audience?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_notices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "school_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_notices_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_parents: {
        Row: {
          address: string | null
          annual_income: string | null
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          occupation: string | null
          phone: string | null
          relation: string
          student_id: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          annual_income?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          occupation?: string | null
          phone?: string | null
          relation: string
          student_id?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          annual_income?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          occupation?: string | null
          phone?: string | null
          relation?: string
          student_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "school_students"
            referencedColumns: ["id"]
          },
        ]
      }
      school_sections: {
        Row: {
          branch_id: string | null
          capacity: number | null
          class_id: string | null
          class_teacher_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          room_number: string | null
        }
        Insert: {
          branch_id?: string | null
          capacity?: number | null
          class_id?: string | null
          class_teacher_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          room_number?: string | null
        }
        Update: {
          branch_id?: string | null
          capacity?: number | null
          class_id?: string | null
          class_teacher_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          room_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_sections_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "school_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_sections_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_sections_class_teacher_id_fkey"
            columns: ["class_teacher_id"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      school_staff: {
        Row: {
          address: string | null
          branch_id: string | null
          created_at: string | null
          department: string | null
          designation: string | null
          emergency_contact: string | null
          employee_id: string
          experience_years: number | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          joining_date: string | null
          phone: string | null
          qualification: string | null
          salary_grade: string | null
          staff_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          branch_id?: string | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          emergency_contact?: string | null
          employee_id: string
          experience_years?: number | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          joining_date?: string | null
          phone?: string | null
          qualification?: string | null
          salary_grade?: string | null
          staff_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          branch_id?: string | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          emergency_contact?: string | null
          employee_id?: string
          experience_years?: number | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          joining_date?: string | null
          phone?: string | null
          qualification?: string | null
          salary_grade?: string | null
          staff_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_staff_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "school_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_staff_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_staff_attendance: {
        Row: {
          attendance_date: string
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          id: string
          leave_type: string | null
          remarks: string | null
          staff_id: string | null
          status: string
        }
        Insert: {
          attendance_date: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          id?: string
          leave_type?: string | null
          remarks?: string | null
          staff_id?: string | null
          status: string
        }
        Update: {
          attendance_date?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          id?: string
          leave_type?: string | null
          remarks?: string | null
          staff_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_staff_attendance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      school_students: {
        Row: {
          address: string | null
          admission_date: string | null
          admission_number: string
          blood_group: string | null
          branch_id: string | null
          city: string | null
          created_at: string | null
          current_class_id: string | null
          current_section_id: string | null
          date_of_birth: string | null
          gender: string | null
          hostel_room_id: string | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          photo_url: string | null
          pincode: string | null
          previous_school: string | null
          roll_number: string | null
          state: string | null
          status: string | null
          transport_route_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          admission_number: string
          blood_group?: string | null
          branch_id?: string | null
          city?: string | null
          created_at?: string | null
          current_class_id?: string | null
          current_section_id?: string | null
          date_of_birth?: string | null
          gender?: string | null
          hostel_room_id?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          photo_url?: string | null
          pincode?: string | null
          previous_school?: string | null
          roll_number?: string | null
          state?: string | null
          status?: string | null
          transport_route_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          admission_number?: string
          blood_group?: string | null
          branch_id?: string | null
          city?: string | null
          created_at?: string | null
          current_class_id?: string | null
          current_section_id?: string | null
          date_of_birth?: string | null
          gender?: string | null
          hostel_room_id?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          photo_url?: string | null
          pincode?: string | null
          previous_school?: string | null
          roll_number?: string | null
          state?: string | null
          status?: string | null
          transport_route_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_students_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "school_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_students_current_class_id_fkey"
            columns: ["current_class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_students_current_section_id_fkey"
            columns: ["current_section_id"]
            isOneToOne: false
            referencedRelation: "school_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_subjects: {
        Row: {
          code: string
          created_at: string | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          name: string
          subject_type: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name: string
          subject_type?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name?: string
          subject_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_subjects_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_timetable: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string | null
          id: string
          period_number: number | null
          room_number: string | null
          section_id: string | null
          start_time: string | null
          subject_id: string | null
          teacher_id: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          period_number?: number | null
          room_number?: string | null
          section_id?: string | null
          start_time?: string | null
          subject_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          period_number?: number | null
          room_number?: string | null
          section_id?: string | null
          start_time?: string | null
          subject_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_timetable_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "school_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "school_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_timetable_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "school_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      school_transport_routes: {
        Row: {
          capacity: number | null
          created_at: string | null
          driver_name: string | null
          driver_phone: string | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          monthly_fee: number | null
          route_name: string
          route_number: string | null
          vehicle_number: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          monthly_fee?: number | null
          route_name: string
          route_number?: string | null
          vehicle_number?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          monthly_fee?: number | null
          route_name?: string
          route_number?: string | null
          vehicle_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_transport_routes_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "school_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_transport_stops: {
        Row: {
          created_at: string | null
          drop_time: string | null
          id: string
          pickup_time: string | null
          route_id: string | null
          stop_name: string
          stop_order: number | null
        }
        Insert: {
          created_at?: string | null
          drop_time?: string | null
          id?: string
          pickup_time?: string | null
          route_id?: string | null
          stop_name: string
          stop_order?: number | null
        }
        Update: {
          created_at?: string | null
          drop_time?: string | null
          id?: string
          pickup_time?: string | null
          route_id?: string | null
          stop_name?: string
          stop_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "school_transport_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "school_transport_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      security_alerts: {
        Row: {
          affected_role: string | null
          affected_user_id: string | null
          alert_id: string
          created_at: string | null
          description: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          source: string
        }
        Insert: {
          affected_role?: string | null
          affected_user_id?: string | null
          alert_id?: string
          created_at?: string | null
          description: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source: string
        }
        Update: {
          affected_role?: string | null
          affected_user_id?: string | null
          alert_id?: string
          created_at?: string | null
          description?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source?: string
        }
        Relationships: []
      }
      security_breach_attempts: {
        Row: {
          attempt_type: string
          attempted_action: string | null
          attempted_resource: string | null
          blocked: boolean | null
          created_at: string | null
          device_fingerprint: string | null
          geo_location: string | null
          id: string
          ip_address: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attempt_type: string
          attempted_action?: string | null
          attempted_resource?: string | null
          blocked?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attempt_type?: string
          attempted_action?: string | null
          attempted_resource?: string | null
          blocked?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          affected_user_id: string | null
          detected_at: string | null
          device_fingerprint: string | null
          event_type: string
          geo_location: string | null
          id: string
          ip_address: string | null
          is_resolved: boolean | null
          severity: string | null
          user_agent: string | null
        }
        Insert: {
          affected_user_id?: string | null
          detected_at?: string | null
          device_fingerprint?: string | null
          event_type: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          severity?: string | null
          user_agent?: string | null
        }
        Update: {
          affected_user_id?: string | null
          detected_at?: string | null
          device_fingerprint?: string | null
          event_type?: string
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          severity?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          device: string | null
          event_details: string | null
          event_type: string
          ip: string | null
          log_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          device?: string | null
          event_details?: string | null
          event_type: string
          ip?: string | null
          log_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          device?: string | null
          event_details?: string | null
          event_type?: string
          ip?: string | null
          log_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_tokens: {
        Row: {
          device_fingerprint: string
          expires_at: string
          id: string
          ip_address: unknown
          issued_at: string
          max_usage: number | null
          metadata: Json | null
          parent_token_id: string | null
          revoked_at: string | null
          revoked_reason: string | null
          token_hash: string
          token_type: string
          usage_count: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_fingerprint: string
          expires_at: string
          id?: string
          ip_address?: unknown
          issued_at?: string
          max_usage?: number | null
          metadata?: Json | null
          parent_token_id?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          token_hash: string
          token_type: string
          usage_count?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_fingerprint?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          issued_at?: string
          max_usage?: number | null
          metadata?: Json | null
          parent_token_id?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          token_hash?: string
          token_type?: string
          usage_count?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_tokens_parent_token_id_fkey"
            columns: ["parent_token_id"]
            isOneToOne: false
            referencedRelation: "security_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          created_at: string | null
          current_rank: number | null
          id: string
          keyword: string
          module: string
          region: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          current_rank?: number | null
          id?: string
          keyword: string
          module: string
          region?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          current_rank?: number | null
          id?: string
          keyword?: string
          module?: string
          region?: string | null
          status?: string | null
        }
        Relationships: []
      }
      seo_manager: {
        Row: {
          created_at: string
          id: string
          keyword: string
          meta_description: string | null
          meta_title: string | null
          module_target: string
          rank_position: number | null
          region: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          keyword: string
          meta_description?: string | null
          meta_title?: string | null
          module_target: string
          rank_position?: number | null
          region?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          keyword?: string
          meta_description?: string | null
          meta_title?: string | null
          module_target?: string
          rank_position?: number | null
          region?: string | null
          status?: string | null
        }
        Relationships: []
      }
      seo_meta: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          description: string | null
          id: string
          keywords: string[] | null
          og_image: string | null
          page_path: string
          robots: string | null
          title: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          og_image?: string | null
          page_path: string
          robots?: string | null
          title?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          og_image?: string | null
          page_path?: string
          robots?: string | null
          title?: string | null
        }
        Relationships: []
      }
      seo_reports: {
        Row: {
          clicks: number | null
          created_at: string | null
          id: string
          impressions: number | null
          keyword_id: string | null
          position: number | null
          report_date: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          impressions?: number | null
          keyword_id?: string | null
          position?: number | null
          report_date: string
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          impressions?: number | null
          keyword_id?: string | null
          position?: number | null
          report_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_reports_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "seo_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      server_actions: {
        Row: {
          action_type: string
          after_state: Json | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          before_state: Json | null
          created_at: string | null
          executed_at: string | null
          id: string
          rejection_reason: string | null
          requested_by: string
          risk_level: string
          server_id: string | null
        }
        Insert: {
          action_type: string
          after_state?: Json | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          before_state?: Json | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          rejection_reason?: string | null
          requested_by: string
          risk_level: string
          server_id?: string | null
        }
        Update: {
          action_type?: string
          after_state?: Json | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          before_state?: Json | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          rejection_reason?: string | null
          requested_by?: string
          risk_level?: string
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_actions_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_ai_analysis: {
        Row: {
          analysis_result: Json
          analysis_type: string
          analyzed_at: string | null
          analyzed_by: string | null
          created_at: string | null
          health_score: number | null
          id: string
          recommendations: string[] | null
          risk_score: number | null
          server_id: string | null
          suggestions: Json | null
          threats_detected: Json | null
        }
        Insert: {
          analysis_result?: Json
          analysis_type: string
          analyzed_at?: string | null
          analyzed_by?: string | null
          created_at?: string | null
          health_score?: number | null
          id?: string
          recommendations?: string[] | null
          risk_score?: number | null
          server_id?: string | null
          suggestions?: Json | null
          threats_detected?: Json | null
        }
        Update: {
          analysis_result?: Json
          analysis_type?: string
          analyzed_at?: string | null
          analyzed_by?: string | null
          created_at?: string | null
          health_score?: number | null
          id?: string
          recommendations?: string[] | null
          risk_score?: number | null
          server_id?: string | null
          suggestions?: Json | null
          threats_detected?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "server_ai_analysis_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          message: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          server_id: string | null
          severity: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          server_id?: string | null
          severity?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          server_id?: string | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_alerts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_audit_logs: {
        Row: {
          action: string
          after_state: Json | null
          approval_id: string | null
          before_state: Json | null
          created_at: string | null
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          performed_by: string
          risk_level: string | null
          server_id: string | null
        }
        Insert: {
          action: string
          after_state?: Json | null
          approval_id?: string | null
          before_state?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          performed_by: string
          risk_level?: string | null
          server_id?: string | null
        }
        Update: {
          action?: string
          after_state?: Json | null
          approval_id?: string | null
          before_state?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          performed_by?: string
          risk_level?: string | null
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_audit_logs_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "server_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_audit_logs_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_backups: {
        Row: {
          backup_name: string
          backup_type: string
          checksum: string | null
          completed_at: string | null
          created_at: string
          encryption_enabled: boolean | null
          encryption_key_id: string | null
          error_message: string | null
          expires_at: string | null
          id: string
          is_auto_backup: boolean | null
          metadata: Json | null
          restore_point_id: string | null
          retention_days: number | null
          server_id: string | null
          size_gb: number | null
          started_at: string | null
          status: string | null
          storage_location: string | null
          triggered_by: string | null
        }
        Insert: {
          backup_name: string
          backup_type: string
          checksum?: string | null
          completed_at?: string | null
          created_at?: string
          encryption_enabled?: boolean | null
          encryption_key_id?: string | null
          error_message?: string | null
          expires_at?: string | null
          id?: string
          is_auto_backup?: boolean | null
          metadata?: Json | null
          restore_point_id?: string | null
          retention_days?: number | null
          server_id?: string | null
          size_gb?: number | null
          started_at?: string | null
          status?: string | null
          storage_location?: string | null
          triggered_by?: string | null
        }
        Update: {
          backup_name?: string
          backup_type?: string
          checksum?: string | null
          completed_at?: string | null
          created_at?: string
          encryption_enabled?: boolean | null
          encryption_key_id?: string | null
          error_message?: string | null
          expires_at?: string | null
          id?: string
          is_auto_backup?: boolean | null
          metadata?: Json | null
          restore_point_id?: string | null
          retention_days?: number | null
          server_id?: string | null
          size_gb?: number | null
          started_at?: string | null
          status?: string | null
          storage_location?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_backups_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_billing: {
        Row: {
          bandwidth_used_gb: number | null
          base_cost: number | null
          billing_period_end: string
          billing_period_start: string
          cpu_hours: number | null
          created_at: string | null
          id: string
          invoice_id: string | null
          is_paid: boolean | null
          server_id: string | null
          storage_gb_hours: number | null
          total_cost: number | null
          usage_cost: number | null
        }
        Insert: {
          bandwidth_used_gb?: number | null
          base_cost?: number | null
          billing_period_end: string
          billing_period_start: string
          cpu_hours?: number | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          is_paid?: boolean | null
          server_id?: string | null
          storage_gb_hours?: number | null
          total_cost?: number | null
          usage_cost?: number | null
        }
        Update: {
          bandwidth_used_gb?: number | null
          base_cost?: number | null
          billing_period_end?: string
          billing_period_start?: string
          cpu_hours?: number | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          is_paid?: boolean | null
          server_id?: string | null
          storage_gb_hours?: number | null
          total_cost?: number | null
          usage_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "server_billing_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_health: {
        Row: {
          consecutive_failures: number | null
          created_at: string | null
          health_score: number | null
          id: string
          is_healthy: boolean | null
          last_check_at: string | null
          server_id: string | null
          sla_uptime: number | null
          updated_at: string | null
        }
        Insert: {
          consecutive_failures?: number | null
          created_at?: string | null
          health_score?: number | null
          id?: string
          is_healthy?: boolean | null
          last_check_at?: string | null
          server_id?: string | null
          sla_uptime?: number | null
          updated_at?: string | null
        }
        Update: {
          consecutive_failures?: number | null
          created_at?: string | null
          health_score?: number | null
          id?: string
          is_healthy?: boolean | null
          last_check_at?: string | null
          server_id?: string | null
          sla_uptime?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_health_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: true
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_incidents: {
        Row: {
          alert_id: string | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          escalated: boolean | null
          escalated_to: string | null
          id: string
          priority: string
          resolution_notes: string | null
          server_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          alert_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          escalated?: boolean | null
          escalated_to?: string | null
          id?: string
          priority?: string
          resolution_notes?: string | null
          server_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          alert_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          escalated?: boolean | null
          escalated_to?: string | null
          id?: string
          priority?: string
          resolution_notes?: string | null
          server_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_incidents_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "server_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_incidents_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_instances: {
        Row: {
          ai_health_score: number | null
          ai_risk_score: number | null
          ai_suggestions: Json | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          auto_scaling_enabled: boolean | null
          auto_setup_completed: boolean | null
          compliance_status: string | null
          cpu_cores: number | null
          created_at: string
          created_by: string | null
          current_cpu_usage: number | null
          current_disk_usage: number | null
          current_memory_usage: number | null
          health_status: string | null
          id: string
          ip_address: string | null
          is_user_submitted: boolean | null
          last_ai_analysis: string | null
          last_health_check: string | null
          max_instances: number | null
          min_instances: number | null
          os_type: string | null
          protection_enabled: boolean | null
          protection_level: string | null
          ram_gb: number | null
          region: string
          rejection_reason: string | null
          server_code: string
          server_name: string
          server_type: string
          setup_config: Json | null
          status: string | null
          storage_gb: number | null
          submitted_by: string | null
          tags: string[] | null
          threat_alerts: Json | null
          updated_at: string
          uptime_percentage: number | null
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          ai_health_score?: number | null
          ai_risk_score?: number | null
          ai_suggestions?: Json | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          auto_scaling_enabled?: boolean | null
          auto_setup_completed?: boolean | null
          compliance_status?: string | null
          cpu_cores?: number | null
          created_at?: string
          created_by?: string | null
          current_cpu_usage?: number | null
          current_disk_usage?: number | null
          current_memory_usage?: number | null
          health_status?: string | null
          id?: string
          ip_address?: string | null
          is_user_submitted?: boolean | null
          last_ai_analysis?: string | null
          last_health_check?: string | null
          max_instances?: number | null
          min_instances?: number | null
          os_type?: string | null
          protection_enabled?: boolean | null
          protection_level?: string | null
          ram_gb?: number | null
          region: string
          rejection_reason?: string | null
          server_code: string
          server_name: string
          server_type: string
          setup_config?: Json | null
          status?: string | null
          storage_gb?: number | null
          submitted_by?: string | null
          tags?: string[] | null
          threat_alerts?: Json | null
          updated_at?: string
          uptime_percentage?: number | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          ai_health_score?: number | null
          ai_risk_score?: number | null
          ai_suggestions?: Json | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          auto_scaling_enabled?: boolean | null
          auto_setup_completed?: boolean | null
          compliance_status?: string | null
          cpu_cores?: number | null
          created_at?: string
          created_by?: string | null
          current_cpu_usage?: number | null
          current_disk_usage?: number | null
          current_memory_usage?: number | null
          health_status?: string | null
          id?: string
          ip_address?: string | null
          is_user_submitted?: boolean | null
          last_ai_analysis?: string | null
          last_health_check?: string | null
          max_instances?: number | null
          min_instances?: number | null
          os_type?: string | null
          protection_enabled?: boolean | null
          protection_level?: string | null
          ram_gb?: number | null
          region?: string
          rejection_reason?: string | null
          server_code?: string
          server_name?: string
          server_type?: string
          setup_config?: Json | null
          status?: string | null
          storage_gb?: number | null
          submitted_by?: string | null
          tags?: string[] | null
          threat_alerts?: Json | null
          updated_at?: string
          uptime_percentage?: number | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      server_manager_accounts: {
        Row: {
          allowed_ips: string[] | null
          assigned_continents: string[] | null
          assigned_servers: string[] | null
          can_restart_production: boolean | null
          can_restore_backups: boolean | null
          created_at: string | null
          id: string
          ip_locked: boolean | null
          last_login_time: string | null
          login_device: string | null
          max_approval_level: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allowed_ips?: string[] | null
          assigned_continents?: string[] | null
          assigned_servers?: string[] | null
          can_restart_production?: boolean | null
          can_restore_backups?: boolean | null
          created_at?: string | null
          id?: string
          ip_locked?: boolean | null
          last_login_time?: string | null
          login_device?: string | null
          max_approval_level?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allowed_ips?: string[] | null
          assigned_continents?: string[] | null
          assigned_servers?: string[] | null
          can_restart_production?: boolean | null
          can_restore_backups?: boolean | null
          created_at?: string | null
          id?: string
          ip_locked?: boolean | null
          last_login_time?: string | null
          login_device?: string | null
          max_approval_level?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      server_metrics_cache: {
        Row: {
          cpu_percent: number | null
          disk_percent: number | null
          health_score: number | null
          last_updated: string | null
          network_in: number | null
          network_out: number | null
          ram_percent: number | null
          server_id: string
          status: string | null
        }
        Insert: {
          cpu_percent?: number | null
          disk_percent?: number | null
          health_score?: number | null
          last_updated?: string | null
          network_in?: number | null
          network_out?: number | null
          ram_percent?: number | null
          server_id: string
          status?: string | null
        }
        Update: {
          cpu_percent?: number | null
          disk_percent?: number | null
          health_score?: number | null
          last_updated?: string | null
          network_in?: number | null
          network_out?: number | null
          ram_percent?: number | null
          server_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_metrics_cache_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: true
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_metrics_history: {
        Row: {
          active_connections: number | null
          cpu_usage: number | null
          disk_usage: number | null
          error_count: number | null
          id: string
          memory_usage: number | null
          network_in_mbps: number | null
          network_out_mbps: number | null
          recorded_at: string
          request_count: number | null
          response_time_ms: number | null
          server_id: string | null
        }
        Insert: {
          active_connections?: number | null
          cpu_usage?: number | null
          disk_usage?: number | null
          error_count?: number | null
          id?: string
          memory_usage?: number | null
          network_in_mbps?: number | null
          network_out_mbps?: number | null
          recorded_at?: string
          request_count?: number | null
          response_time_ms?: number | null
          server_id?: string | null
        }
        Update: {
          active_connections?: number | null
          cpu_usage?: number | null
          disk_usage?: number | null
          error_count?: number | null
          id?: string
          memory_usage?: number | null
          network_in_mbps?: number | null
          network_out_mbps?: number | null
          recorded_at?: string
          request_count?: number | null
          response_time_ms?: number | null
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_metrics_history_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_performance: {
        Row: {
          avg_latency_ms: number | null
          error_rate: number | null
          id: string
          last_calculated: string | null
          performance_score: number | null
          server_id: string | null
          sla_percent: number | null
          uptime_percent: number | null
        }
        Insert: {
          avg_latency_ms?: number | null
          error_rate?: number | null
          id?: string
          last_calculated?: string | null
          performance_score?: number | null
          server_id?: string | null
          sla_percent?: number | null
          uptime_percent?: number | null
        }
        Update: {
          avg_latency_ms?: number | null
          error_rate?: number | null
          id?: string
          last_calculated?: string | null
          performance_score?: number | null
          server_id?: string | null
          sla_percent?: number | null
          uptime_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "server_performance_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_plans: {
        Row: {
          bandwidth_tb: number
          cpu_cores: number
          created_at: string | null
          id: string
          is_active: boolean | null
          is_recommended: boolean | null
          plan_name: string
          plan_type: string
          price_monthly: number
          price_yearly: number | null
          ram_gb: number
          recommended_for: string[] | null
          regions: string[] | null
          storage_gb: number
        }
        Insert: {
          bandwidth_tb?: number
          cpu_cores: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_recommended?: boolean | null
          plan_name: string
          plan_type: string
          price_monthly: number
          price_yearly?: number | null
          ram_gb: number
          recommended_for?: string[] | null
          regions?: string[] | null
          storage_gb: number
        }
        Update: {
          bandwidth_tb?: number
          cpu_cores?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_recommended?: boolean | null
          plan_name?: string
          plan_type?: string
          price_monthly?: number
          price_yearly?: number | null
          ram_gb?: number
          recommended_for?: string[] | null
          regions?: string[] | null
          storage_gb?: number
        }
        Relationships: []
      }
      server_protection_events: {
        Row: {
          auto_resolved: boolean | null
          blocked: boolean | null
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          server_id: string | null
          severity: string | null
          source_ip: string | null
        }
        Insert: {
          auto_resolved?: boolean | null
          blocked?: boolean | null
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          server_id?: string | null
          severity?: string | null
          source_ip?: string | null
        }
        Update: {
          auto_resolved?: boolean | null
          blocked?: boolean | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          server_id?: string | null
          severity?: string | null
          source_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_protection_events_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_purchases: {
        Row: {
          amount: number
          auto_backup: boolean | null
          completed_at: string | null
          created_at: string | null
          firewall_preset: string | null
          id: string
          os: string | null
          payment_method: string
          plan_id: string | null
          region: string
          scaling_rules: Json | null
          server_id: string | null
          status: string
          user_id: string
          wallet_transaction_id: string | null
        }
        Insert: {
          amount: number
          auto_backup?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          firewall_preset?: string | null
          id?: string
          os?: string | null
          payment_method?: string
          plan_id?: string | null
          region: string
          scaling_rules?: Json | null
          server_id?: string | null
          status?: string
          user_id: string
          wallet_transaction_id?: string | null
        }
        Update: {
          amount?: number
          auto_backup?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          firewall_preset?: string | null
          id?: string
          os?: string | null
          payment_method?: string
          plan_id?: string | null
          region?: string
          scaling_rules?: Json | null
          server_id?: string | null
          status?: string
          user_id?: string
          wallet_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_purchases_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "server_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_purchases_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_setup_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          error_message: string | null
          id: string
          max_retries: number | null
          output: string | null
          retry_count: number | null
          server_id: string | null
          started_at: string | null
          status: string | null
          step_name: string
          step_order: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          output?: string | null
          retry_count?: number | null
          server_id?: string | null
          started_at?: string | null
          status?: string | null
          step_name: string
          step_order: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          output?: string | null
          retry_count?: number | null
          server_id?: string | null
          started_at?: string | null
          status?: string | null
          step_name?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "server_setup_logs_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_submission_requests: {
        Row: {
          additional_notes: string | null
          ai_pre_check_result: Json | null
          ai_risk_assessment: Json | null
          compliance_requirements: string[] | null
          created_at: string | null
          created_server_id: string | null
          expected_usage: string | null
          hostname: string | null
          id: string
          ip_address: string | null
          provider: string | null
          purpose: string | null
          region: string | null
          rejection_reason: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          server_name: string
          server_type: string
          status: string | null
          updated_at: string | null
          user_id: string
          user_role: string
        }
        Insert: {
          additional_notes?: string | null
          ai_pre_check_result?: Json | null
          ai_risk_assessment?: Json | null
          compliance_requirements?: string[] | null
          created_at?: string | null
          created_server_id?: string | null
          expected_usage?: string | null
          hostname?: string | null
          id?: string
          ip_address?: string | null
          provider?: string | null
          purpose?: string | null
          region?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          server_name: string
          server_type: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          user_role: string
        }
        Update: {
          additional_notes?: string | null
          ai_pre_check_result?: Json | null
          ai_risk_assessment?: Json | null
          compliance_requirements?: string[] | null
          created_at?: string | null
          created_server_id?: string | null
          expected_usage?: string | null
          hostname?: string | null
          id?: string
          ip_address?: string | null
          provider?: string | null
          purpose?: string | null
          region?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          server_name?: string
          server_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_submission_requests_created_server_id_fkey"
            columns: ["created_server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      server_webhooks: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          last_attempt: string | null
          payload: Json
          retry_count: number | null
          server_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          last_attempt?: string | null
          payload: Json
          retry_count?: number | null
          server_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          last_attempt?: string | null
          payload?: Json
          retry_count?: number | null
          server_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_webhooks_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "server_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      session_security: {
        Row: {
          allowed_ips: string[] | null
          created_at: string | null
          force_logout_at: string | null
          id: string
          ip_locked: boolean | null
          last_activity_at: string | null
          require_email_verify_for_critical: boolean | null
          require_password_for_delete: boolean | null
          require_password_for_financial: boolean | null
          session_started_at: string | null
          session_timeout_minutes: number | null
          session_token_hash: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allowed_ips?: string[] | null
          created_at?: string | null
          force_logout_at?: string | null
          id?: string
          ip_locked?: boolean | null
          last_activity_at?: string | null
          require_email_verify_for_critical?: boolean | null
          require_password_for_delete?: boolean | null
          require_password_for_financial?: boolean | null
          session_started_at?: string | null
          session_timeout_minutes?: number | null
          session_token_hash?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allowed_ips?: string[] | null
          created_at?: string | null
          force_logout_at?: string | null
          id?: string
          ip_locked?: boolean | null
          last_activity_at?: string | null
          require_email_verify_for_critical?: boolean | null
          require_password_for_delete?: boolean | null
          require_password_for_financial?: boolean | null
          session_started_at?: string | null
          session_timeout_minutes?: number | null
          session_token_hash?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sla_monitoring: {
        Row: {
          actual_hours: number | null
          breach_reason: string | null
          compensation_amount: number | null
          compensation_credited: boolean | null
          created_at: string
          id: string
          prime_user_id: string
          sla_met: boolean | null
          sla_type: string
          target_hours: number
          task_id: string | null
          ticket_id: string | null
        }
        Insert: {
          actual_hours?: number | null
          breach_reason?: string | null
          compensation_amount?: number | null
          compensation_credited?: boolean | null
          created_at?: string
          id?: string
          prime_user_id: string
          sla_met?: boolean | null
          sla_type: string
          target_hours?: number
          task_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          actual_hours?: number | null
          breach_reason?: string | null
          compensation_amount?: number | null
          compensation_credited?: boolean | null
          created_at?: string
          id?: string
          prime_user_id?: string
          sla_met?: boolean | null
          sla_type?: string
          target_hours?: number
          task_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sla_monitoring_prime_user_id_fkey"
            columns: ["prime_user_id"]
            isOneToOne: false
            referencedRelation: "prime_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sla_monitoring_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "priority_ticket_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      software_catalog: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string | null
          demo_id: string | null
          demo_url: string | null
          id: string
          is_demo_registered: boolean | null
          name: string
          type: string
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          demo_id?: string | null
          demo_url?: string | null
          id?: string
          is_demo_registered?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          demo_id?: string | null
          demo_url?: string | null
          id?: string
          is_demo_registered?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "software_catalog_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          default_discount: number | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          sport_type: string
          start_date: string
          team1_color: string | null
          team1_name: string | null
          team2_color: string | null
          team2_name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          default_discount?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          sport_type: string
          start_date: string
          team1_color?: string | null
          team1_name?: string | null
          team2_color?: string | null
          team2_name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          default_discount?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sport_type?: string
          start_date?: string
          team1_color?: string | null
          team1_name?: string | null
          team2_color?: string | null
          team2_name?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          activated_at: string | null
          amount: number | null
          created_at: string
          expired_at: string | null
          plan: string
          status: string | null
          sub_id: string
          user_id: string
          validity: number | null
        }
        Insert: {
          activated_at?: string | null
          amount?: number | null
          created_at?: string
          expired_at?: string | null
          plan: string
          status?: string | null
          sub_id?: string
          user_id: string
          validity?: number | null
        }
        Update: {
          activated_at?: string | null
          amount?: number | null
          created_at?: string
          expired_at?: string | null
          plan?: string
          status?: string | null
          sub_id?: string
          user_id?: string
          validity?: number | null
        }
        Relationships: []
      }
      super_admin: {
        Row: {
          allowed_ip_ranges: string[] | null
          continent: string
          countries_managed: number | null
          created_at: string | null
          current_device: string | null
          failed_login_count: number | null
          force_password_change: boolean | null
          id: string
          last_login_at: string | null
          last_login_device: string | null
          last_login_ip: string | null
          last_login_time: string | null
          locked_until: string | null
          login_status: string | null
          max_session_duration_minutes: number | null
          name: string
          requires_2fa: boolean | null
          risk_score: number | null
          security_clearance: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allowed_ip_ranges?: string[] | null
          continent: string
          countries_managed?: number | null
          created_at?: string | null
          current_device?: string | null
          failed_login_count?: number | null
          force_password_change?: boolean | null
          id?: string
          last_login_at?: string | null
          last_login_device?: string | null
          last_login_ip?: string | null
          last_login_time?: string | null
          locked_until?: string | null
          login_status?: string | null
          max_session_duration_minutes?: number | null
          name: string
          requires_2fa?: boolean | null
          risk_score?: number | null
          security_clearance?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allowed_ip_ranges?: string[] | null
          continent?: string
          countries_managed?: number | null
          created_at?: string | null
          current_device?: string | null
          failed_login_count?: number | null
          force_password_change?: boolean | null
          id?: string
          last_login_at?: string | null
          last_login_device?: string | null
          last_login_ip?: string | null
          last_login_time?: string | null
          locked_until?: string | null
          login_status?: string | null
          max_session_duration_minutes?: number | null
          name?: string
          requires_2fa?: boolean | null
          risk_score?: number | null
          security_clearance?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      super_admin_action_log: {
        Row: {
          action_category: string
          action_type: string
          admin_id: string
          confirmation_provided: boolean | null
          created_at: string | null
          device_fingerprint: string | null
          error_message: string | null
          execution_time_ms: number | null
          geo_location: string | null
          id: string
          ip_address: string | null
          new_state: Json | null
          previous_state: Json | null
          reason: string | null
          requires_confirmation: boolean | null
          risk_level: string | null
          scope_type: string | null
          scope_value: string | null
          session_id: string | null
          signature: string | null
          status: string
          target_id: string | null
          target_name: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_category: string
          action_type: string
          admin_id: string
          confirmation_provided?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          new_state?: Json | null
          previous_state?: Json | null
          reason?: string | null
          requires_confirmation?: boolean | null
          risk_level?: string | null
          scope_type?: string | null
          scope_value?: string | null
          session_id?: string | null
          signature?: string | null
          status: string
          target_id?: string | null
          target_name?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_category?: string
          action_type?: string
          admin_id?: string
          confirmation_provided?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          new_state?: Json | null
          previous_state?: Json | null
          reason?: string | null
          requires_confirmation?: boolean | null
          risk_level?: string | null
          scope_type?: string | null
          scope_value?: string | null
          session_id?: string | null
          signature?: string | null
          status?: string
          target_id?: string | null
          target_name?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      super_admin_actions: {
        Row: {
          action_category: string
          action_data: Json | null
          action_type: string
          created_at: string | null
          device_fingerprint: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          ip_address: string | null
          is_sensitive: boolean | null
          requires_approval: boolean | null
          result_status: string | null
          scope_context: Json | null
          session_id: string | null
          target_entity: string | null
          target_id: string | null
          user_id: string
        }
        Insert: {
          action_category: string
          action_data?: Json | null
          action_type: string
          created_at?: string | null
          device_fingerprint?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          is_sensitive?: boolean | null
          requires_approval?: boolean | null
          result_status?: string | null
          scope_context?: Json | null
          session_id?: string | null
          target_entity?: string | null
          target_id?: string | null
          user_id: string
        }
        Update: {
          action_category?: string
          action_data?: Json | null
          action_type?: string
          created_at?: string | null
          device_fingerprint?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          is_sensitive?: boolean | null
          requires_approval?: boolean | null
          result_status?: string | null
          scope_context?: Json | null
          session_id?: string | null
          target_entity?: string | null
          target_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "super_admin_actions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "super_admin_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_activity_log: {
        Row: {
          action: string
          action_data: Json | null
          created_at: string | null
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          module: string
          risk_score: number | null
          session_id: string | null
          super_admin_id: string
          target_entity: string | null
          target_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          action_data?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          module: string
          risk_score?: number | null
          session_id?: string | null
          super_admin_id: string
          target_entity?: string | null
          target_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          action_data?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          module?: string
          risk_score?: number | null
          session_id?: string | null
          super_admin_id?: string
          target_entity?: string | null
          target_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      super_admin_admin_management: {
        Row: {
          action_type: string
          actor_id: string
          created_at: string | null
          hierarchy_validated: boolean | null
          id: string
          new_state: Json | null
          previous_state: Json | null
          role_assigned: string | null
          scope_assigned: Json | null
          scope_validated: boolean | null
          target_admin_id: string | null
        }
        Insert: {
          action_type: string
          actor_id: string
          created_at?: string | null
          hierarchy_validated?: boolean | null
          id?: string
          new_state?: Json | null
          previous_state?: Json | null
          role_assigned?: string | null
          scope_assigned?: Json | null
          scope_validated?: boolean | null
          target_admin_id?: string | null
        }
        Update: {
          action_type?: string
          actor_id?: string
          created_at?: string | null
          hierarchy_validated?: boolean | null
          id?: string
          new_state?: Json | null
          previous_state?: Json | null
          role_assigned?: string | null
          scope_assigned?: Json | null
          scope_validated?: boolean | null
          target_admin_id?: string | null
        }
        Relationships: []
      }
      super_admin_approvals: {
        Row: {
          approval_steps: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          request_data: Json
          request_type: string
          requested_by: string
          requested_by_role: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_factors: Json | null
          risk_score: number | null
          scope_context: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_steps?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          request_data: Json
          request_type: string
          requested_by: string
          requested_by_role: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          scope_context?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_steps?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          request_data?: Json
          request_type?: string
          requested_by?: string
          requested_by_role?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          scope_context?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      super_admin_audit_access: {
        Row: {
          access_duration_seconds: number | null
          access_type: string
          accessed_module: string
          created_at: string | null
          export_approved: boolean | null
          export_approved_by: string | null
          export_requested: boolean | null
          filter_criteria: Json | null
          id: string
          records_viewed: number | null
          session_id: string | null
          user_id: string
          watermark_applied: boolean | null
        }
        Insert: {
          access_duration_seconds?: number | null
          access_type: string
          accessed_module: string
          created_at?: string | null
          export_approved?: boolean | null
          export_approved_by?: string | null
          export_requested?: boolean | null
          filter_criteria?: Json | null
          id?: string
          records_viewed?: number | null
          session_id?: string | null
          user_id: string
          watermark_applied?: boolean | null
        }
        Update: {
          access_duration_seconds?: number | null
          access_type?: string
          accessed_module?: string
          created_at?: string | null
          export_approved?: boolean | null
          export_approved_by?: string | null
          export_requested?: boolean | null
          filter_criteria?: Json | null
          id?: string
          records_viewed?: number | null
          session_id?: string | null
          user_id?: string
          watermark_applied?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "super_admin_audit_access_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "super_admin_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_dashboard_views: {
        Row: {
          id: string
          super_admin_id: string
          view_duration_seconds: number | null
          viewed_at: string | null
          widget_code: string
        }
        Insert: {
          id?: string
          super_admin_id: string
          view_duration_seconds?: number | null
          viewed_at?: string | null
          widget_code: string
        }
        Update: {
          id?: string
          super_admin_id?: string
          view_duration_seconds?: number | null
          viewed_at?: string | null
          widget_code?: string
        }
        Relationships: []
      }
      super_admin_dashboard_widgets: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          position_index: number | null
          super_admin_id: string
          widget_code: string
          widget_config: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          position_index?: number | null
          super_admin_id: string
          widget_code: string
          widget_config?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          position_index?: number | null
          super_admin_id?: string
          widget_code?: string
          widget_config?: Json | null
        }
        Relationships: []
      }
      super_admin_live_activity_views: {
        Row: {
          alerts_acknowledged: number | null
          created_at: string | null
          events_observed: number | null
          filters_applied: Json | null
          id: string
          session_id: string | null
          user_id: string
          view_ended_at: string | null
          view_started_at: string | null
        }
        Insert: {
          alerts_acknowledged?: number | null
          created_at?: string | null
          events_observed?: number | null
          filters_applied?: Json | null
          id?: string
          session_id?: string | null
          user_id: string
          view_ended_at?: string | null
          view_started_at?: string | null
        }
        Update: {
          alerts_acknowledged?: number | null
          created_at?: string | null
          events_observed?: number | null
          filters_applied?: Json | null
          id?: string
          session_id?: string | null
          user_id?: string
          view_ended_at?: string | null
          view_started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "super_admin_live_activity_views_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "super_admin_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_locks: {
        Row: {
          affected_users: number | null
          created_at: string | null
          force_logout_triggered: boolean | null
          global_request_status: string | null
          id: string
          is_active: boolean | null
          is_global_request: boolean | null
          lock_reason: string
          lock_target: string
          lock_target_id: string | null
          lock_type: string
          locked_by: string
          scope_context: Json | null
          unlock_reason: string | null
          unlocked_at: string | null
          unlocked_by: string | null
          updated_at: string | null
        }
        Insert: {
          affected_users?: number | null
          created_at?: string | null
          force_logout_triggered?: boolean | null
          global_request_status?: string | null
          id?: string
          is_active?: boolean | null
          is_global_request?: boolean | null
          lock_reason: string
          lock_target: string
          lock_target_id?: string | null
          lock_type: string
          locked_by: string
          scope_context?: Json | null
          unlock_reason?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
          updated_at?: string | null
        }
        Update: {
          affected_users?: number | null
          created_at?: string | null
          force_logout_triggered?: boolean | null
          global_request_status?: string | null
          id?: string
          is_active?: boolean | null
          is_global_request?: boolean | null
          lock_reason?: string
          lock_target?: string
          lock_target_id?: string | null
          lock_type?: string
          locked_by?: string
          scope_context?: Json | null
          unlock_reason?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      super_admin_module_actions: {
        Row: {
          action: string
          action_data: Json | null
          action_time: string | null
          id: string
          module_id: string
          super_admin_id: string
        }
        Insert: {
          action: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          module_id: string
          super_admin_id: string
        }
        Update: {
          action?: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          module_id?: string
          super_admin_id?: string
        }
        Relationships: []
      }
      super_admin_module_controls: {
        Row: {
          access_level: string | null
          created_at: string | null
          disabled_at: string | null
          disabled_by: string | null
          enabled_at: string | null
          enabled_by: string | null
          id: string
          is_enabled: boolean | null
          last_used_at: string | null
          module_name: string
          restrictions: Json | null
          scope_type: string
          scope_value: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          disabled_at?: string | null
          disabled_by?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used_at?: string | null
          module_name: string
          restrictions?: Json | null
          scope_type: string
          scope_value: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          disabled_at?: string | null
          disabled_by?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_enabled?: boolean | null
          last_used_at?: string | null
          module_name?: string
          restrictions?: Json | null
          scope_type?: string
          scope_value?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      super_admin_permission_views: {
        Row: {
          id: string
          permission_id: string
          super_admin_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          permission_id: string
          super_admin_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          permission_id?: string
          super_admin_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      super_admin_profiles: {
        Row: {
          assigned_continent_id: string | null
          assigned_country_id: string | null
          authority_scope: string | null
          can_lock_scope: boolean | null
          can_manage_admins: boolean | null
          can_manage_rentals: boolean | null
          can_manage_rules: boolean | null
          can_manage_security: boolean | null
          can_manage_users: boolean | null
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_continent_id?: string | null
          assigned_country_id?: string | null
          authority_scope?: string | null
          can_lock_scope?: boolean | null
          can_manage_admins?: boolean | null
          can_manage_rentals?: boolean | null
          can_manage_rules?: boolean | null
          can_manage_security?: boolean | null
          can_manage_users?: boolean | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_continent_id?: string | null
          assigned_country_id?: string | null
          authority_scope?: string | null
          can_lock_scope?: boolean | null
          can_manage_admins?: boolean | null
          can_manage_rentals?: boolean | null
          can_manage_rules?: boolean | null
          can_manage_security?: boolean | null
          can_manage_users?: boolean | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      super_admin_region_actions: {
        Row: {
          action: string
          action_data: Json | null
          action_time: string | null
          id: string
          region_id: string
          region_type: string
          super_admin_id: string
        }
        Insert: {
          action: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          region_id: string
          region_type: string
          super_admin_id: string
        }
        Update: {
          action?: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          region_id?: string
          region_type?: string
          super_admin_id?: string
        }
        Relationships: []
      }
      super_admin_rental_actions: {
        Row: {
          action: string
          action_data: Json | null
          action_time: string | null
          id: string
          rental_id: string
          super_admin_id: string
        }
        Insert: {
          action: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          rental_id: string
          super_admin_id: string
        }
        Update: {
          action?: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          rental_id?: string
          super_admin_id?: string
        }
        Relationships: []
      }
      super_admin_rentals: {
        Row: {
          assigned_by: string
          assigned_to: string
          auto_revoke: boolean | null
          created_at: string | null
          extended_count: number | null
          feature_name: string
          id: string
          is_active: boolean | null
          last_extended_at: string | null
          rental_end: string
          rental_start: string | null
          revoke_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          scope_context: Json | null
          updated_at: string | null
          usage_stats: Json | null
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          auto_revoke?: boolean | null
          created_at?: string | null
          extended_count?: number | null
          feature_name: string
          id?: string
          is_active?: boolean | null
          last_extended_at?: string | null
          rental_end: string
          rental_start?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          scope_context?: Json | null
          updated_at?: string | null
          usage_stats?: Json | null
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          auto_revoke?: boolean | null
          created_at?: string | null
          extended_count?: number | null
          feature_name?: string
          id?: string
          is_active?: boolean | null
          last_extended_at?: string | null
          rental_end?: string
          rental_start?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          scope_context?: Json | null
          updated_at?: string | null
          usage_stats?: Json | null
        }
        Relationships: []
      }
      super_admin_risk_views: {
        Row: {
          anomaly_data: Json | null
          created_at: string | null
          id: string
          manual_review_triggered: boolean | null
          review_notes: string | null
          risk_score_viewed: number | null
          target_entity_id: string | null
          view_type: string
          viewer_id: string
        }
        Insert: {
          anomaly_data?: Json | null
          created_at?: string | null
          id?: string
          manual_review_triggered?: boolean | null
          review_notes?: string | null
          risk_score_viewed?: number | null
          target_entity_id?: string | null
          view_type: string
          viewer_id: string
        }
        Update: {
          anomaly_data?: Json | null
          created_at?: string | null
          id?: string
          manual_review_triggered?: boolean | null
          review_notes?: string | null
          risk_score_viewed?: number | null
          target_entity_id?: string | null
          view_type?: string
          viewer_id?: string
        }
        Relationships: []
      }
      super_admin_role_views: {
        Row: {
          id: string
          role_id: string
          super_admin_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          role_id: string
          super_admin_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          role_id?: string
          super_admin_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      super_admin_rule_executions: {
        Row: {
          affected_entities: Json | null
          created_at: string | null
          error_details: string | null
          execution_duration_ms: number | null
          execution_result: string
          id: string
          rule_id: string | null
          trigger_context: Json | null
          triggered_by: string
        }
        Insert: {
          affected_entities?: Json | null
          created_at?: string | null
          error_details?: string | null
          execution_duration_ms?: number | null
          execution_result: string
          id?: string
          rule_id?: string | null
          trigger_context?: Json | null
          triggered_by: string
        }
        Update: {
          affected_entities?: Json | null
          created_at?: string | null
          error_details?: string | null
          execution_duration_ms?: number | null
          execution_result?: string
          id?: string
          rule_id?: string | null
          trigger_context?: Json | null
          triggered_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "super_admin_rule_executions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "super_admin_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_rules: {
        Row: {
          activated_at: string | null
          created_at: string | null
          created_by: string
          deactivated_at: string | null
          execution_count: number | null
          id: string
          impact_assessment: Json | null
          is_active: boolean | null
          is_simulated: boolean | null
          last_executed_at: string | null
          rule_logic: Json
          rule_name: string
          rule_type: string
          scope_type: string
          scope_value: string
          simulation_results: Json | null
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          created_by: string
          deactivated_at?: string | null
          execution_count?: number | null
          id?: string
          impact_assessment?: Json | null
          is_active?: boolean | null
          is_simulated?: boolean | null
          last_executed_at?: string | null
          rule_logic: Json
          rule_name: string
          rule_type: string
          scope_type: string
          scope_value: string
          simulation_results?: Json | null
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          created_by?: string
          deactivated_at?: string | null
          execution_count?: number | null
          id?: string
          impact_assessment?: Json | null
          is_active?: boolean | null
          is_simulated?: boolean | null
          last_executed_at?: string | null
          rule_logic?: Json
          rule_name?: string
          rule_type?: string
          scope_type?: string
          scope_value?: string
          simulation_results?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      super_admin_scope_assignments: {
        Row: {
          assigned_by: string | null
          assignment_reason: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          parent_scope_id: string | null
          scope_type: string
          scope_value: string
          updated_at: string | null
          user_id: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          assigned_by?: string | null
          assignment_reason?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_scope_id?: string | null
          scope_type: string
          scope_value: string
          updated_at?: string | null
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          assigned_by?: string | null
          assignment_reason?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_scope_id?: string | null
          scope_type?: string
          scope_value?: string
          updated_at?: string | null
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "super_admin_scope_assignments_parent_scope_id_fkey"
            columns: ["parent_scope_id"]
            isOneToOne: false
            referencedRelation: "super_admin_scope_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_security_actions: {
        Row: {
          action: string
          action_data: Json | null
          action_time: string | null
          id: string
          security_event_id: string
          super_admin_id: string
        }
        Insert: {
          action: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          security_event_id: string
          super_admin_id: string
        }
        Update: {
          action?: string
          action_data?: Json | null
          action_time?: string | null
          id?: string
          security_event_id?: string
          super_admin_id?: string
        }
        Relationships: []
      }
      super_admin_security_events: {
        Row: {
          action_taken: string | null
          action_taken_at: string | null
          action_taken_by: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          is_resolved: boolean | null
          resolution_notes: string | null
          scope_context: Json | null
          severity: string | null
          source_ip: string | null
          target_user_id: string | null
        }
        Insert: {
          action_taken?: string | null
          action_taken_at?: string | null
          action_taken_by?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          is_resolved?: boolean | null
          resolution_notes?: string | null
          scope_context?: Json | null
          severity?: string | null
          source_ip?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_taken?: string | null
          action_taken_at?: string | null
          action_taken_by?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          is_resolved?: boolean | null
          resolution_notes?: string | null
          scope_context?: Json | null
          severity?: string | null
          source_ip?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      super_admin_sessions: {
        Row: {
          assigned_scope: Json | null
          created_at: string | null
          device_fingerprint: string | null
          force_logged_out: boolean | null
          geo_location: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_activity_at: string | null
          login_at: string | null
          logout_at: string | null
          logout_reason: string | null
          session_token: string
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          assigned_scope?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          force_logged_out?: boolean | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity_at?: string | null
          login_at?: string | null
          logout_at?: string | null
          logout_reason?: string | null
          session_token: string
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          assigned_scope?: Json | null
          created_at?: string | null
          device_fingerprint?: string | null
          force_logged_out?: boolean | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity_at?: string | null
          login_at?: string | null
          logout_at?: string | null
          logout_reason?: string | null
          session_token?: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      super_admin_user_actions: {
        Row: {
          action_data: Json | null
          action_type: string
          admin_user_id: string
          created_at: string | null
          id: string
          permission_checked: boolean | null
          result_status: string | null
          scope_validated: boolean | null
          target_user_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          admin_user_id: string
          created_at?: string | null
          id?: string
          permission_checked?: boolean | null
          result_status?: string | null
          scope_validated?: boolean | null
          target_user_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          id?: string
          permission_checked?: boolean | null
          result_status?: string | null
          scope_validated?: boolean | null
          target_user_id?: string
        }
        Relationships: []
      }
      super_admin_user_views: {
        Row: {
          id: string
          super_admin_id: string
          user_id: string
          view_context: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          super_admin_id: string
          user_id: string
          view_context?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          super_admin_id?: string
          user_id?: string
          view_context?: string | null
          viewed_at?: string | null
        }
        Relationships: []
      }
      support_chatbots: {
        Row: {
          ai_model: string
          channel: string
          created_at: string
          created_by: string | null
          fallback_message: string | null
          id: string
          language_count: number | null
          name: string
          status: string
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          ai_model?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          fallback_message?: string | null
          id?: string
          language_count?: number | null
          name: string
          status?: string
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          ai_model?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          fallback_message?: string | null
          id?: string
          language_count?: number | null
          name?: string
          status?: string
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      suspicious_activity: {
        Row: {
          details: Json | null
          flagged_at: string | null
          id: string
          reason: string
          resolved_at: string | null
          severity: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          details?: Json | null
          flagged_at?: string | null
          id?: string
          reason: string
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          details?: Json | null
          flagged_at?: string | null
          id?: string
          reason?: string
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      suspicious_activity_reports: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          filed_at: string | null
          filed_by: string | null
          id: string
          regulatory_reference: string | null
          risk_indicators: string[] | null
          status: string | null
          total_amount: number | null
          transaction_ids: string[] | null
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          filed_at?: string | null
          filed_by?: string | null
          id?: string
          regulatory_reference?: string | null
          risk_indicators?: string[] | null
          status?: string | null
          total_amount?: number | null
          transaction_ids?: string[] | null
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          filed_at?: string | null
          filed_by?: string | null
          id?: string
          regulatory_reference?: string | null
          risk_indicators?: string[] | null
          status?: string | null
          total_amount?: number | null
          transaction_ids?: string[] | null
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: []
      }
      sv_ai_models: {
        Row: {
          api_endpoint: string | null
          cost_per_unit: number | null
          created_at: string
          id: string
          name: string
          provider: string
          region: string | null
          status: string
          type: string
          unit_type: string | null
          updated_at: string
          version: string
        }
        Insert: {
          api_endpoint?: string | null
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          name: string
          provider: string
          region?: string | null
          status?: string
          type: string
          unit_type?: string | null
          updated_at?: string
          version: string
        }
        Update: {
          api_endpoint?: string | null
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          name?: string
          provider?: string
          region?: string | null
          status?: string
          type?: string
          unit_type?: string | null
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      sv_android_apks: {
        Row: {
          channel: string
          created_at: string
          download_url: string | null
          file_size_mb: number | null
          id: string
          min_sdk_version: number | null
          release_notes: string | null
          released_at: string | null
          released_by: string | null
          status: string
          target_sdk_version: number | null
          updated_at: string
          version: string
          version_code: number
        }
        Insert: {
          channel?: string
          created_at?: string
          download_url?: string | null
          file_size_mb?: number | null
          id?: string
          min_sdk_version?: number | null
          release_notes?: string | null
          released_at?: string | null
          released_by?: string | null
          status?: string
          target_sdk_version?: number | null
          updated_at?: string
          version: string
          version_code: number
        }
        Update: {
          channel?: string
          created_at?: string
          download_url?: string | null
          file_size_mb?: number | null
          id?: string
          min_sdk_version?: number | null
          release_notes?: string | null
          released_at?: string | null
          released_by?: string | null
          status?: string
          target_sdk_version?: number | null
          updated_at?: string
          version?: string
          version_code?: number
        }
        Relationships: []
      }
      sv_apk_configs: {
        Row: {
          ai_enabled: boolean | null
          allowed_models: string[] | null
          analytics_enabled: boolean | null
          apk_id: string
          crash_reporting: boolean | null
          created_at: string
          debug_mode: boolean | null
          feature_flags: Json | null
          id: string
          logging_enabled: boolean | null
          max_offline_cache_mb: number | null
          offline_mode: boolean | null
          sync_interval_minutes: number | null
          updated_at: string
        }
        Insert: {
          ai_enabled?: boolean | null
          allowed_models?: string[] | null
          analytics_enabled?: boolean | null
          apk_id: string
          crash_reporting?: boolean | null
          created_at?: string
          debug_mode?: boolean | null
          feature_flags?: Json | null
          id?: string
          logging_enabled?: boolean | null
          max_offline_cache_mb?: number | null
          offline_mode?: boolean | null
          sync_interval_minutes?: number | null
          updated_at?: string
        }
        Update: {
          ai_enabled?: boolean | null
          allowed_models?: string[] | null
          analytics_enabled?: boolean | null
          apk_id?: string
          crash_reporting?: boolean | null
          created_at?: string
          debug_mode?: boolean | null
          feature_flags?: Json | null
          id?: string
          logging_enabled?: boolean | null
          max_offline_cache_mb?: number | null
          offline_mode?: boolean | null
          sync_interval_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sv_apk_configs_apk_id_fkey"
            columns: ["apk_id"]
            isOneToOne: false
            referencedRelation: "sv_android_apks"
            referencedColumns: ["id"]
          },
        ]
      }
      sv_demo_attendance: {
        Row: {
          attended: boolean | null
          converted: boolean | null
          country: string | null
          created_at: string
          demo_id: string
          feedback_score: number | null
          feedback_text: string | null
          guest_email: string | null
          guest_name: string | null
          id: string
          join_time: string | null
          leave_time: string | null
          schedule_id: string | null
          user_id: string | null
        }
        Insert: {
          attended?: boolean | null
          converted?: boolean | null
          country?: string | null
          created_at?: string
          demo_id: string
          feedback_score?: number | null
          feedback_text?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          schedule_id?: string | null
          user_id?: string | null
        }
        Update: {
          attended?: boolean | null
          converted?: boolean | null
          country?: string | null
          created_at?: string
          demo_id?: string
          feedback_score?: number | null
          feedback_text?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          schedule_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sv_demo_attendance_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "sv_demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sv_demo_attendance_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "sv_demo_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      sv_demo_schedules: {
        Row: {
          created_at: string
          demo_id: string
          host_user_id: string | null
          id: string
          max_attendees: number | null
          reminder_sent: boolean | null
          scheduled_date: string
          scheduled_time: string
          status: string | null
          timezone: string
        }
        Insert: {
          created_at?: string
          demo_id: string
          host_user_id?: string | null
          id?: string
          max_attendees?: number | null
          reminder_sent?: boolean | null
          scheduled_date: string
          scheduled_time: string
          status?: string | null
          timezone?: string
        }
        Update: {
          created_at?: string
          demo_id?: string
          host_user_id?: string | null
          id?: string
          max_attendees?: number | null
          reminder_sent?: boolean | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string | null
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "sv_demo_schedules_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "sv_demos"
            referencedColumns: ["id"]
          },
        ]
      }
      sv_demos: {
        Row: {
          created_at: string
          created_by: string | null
          demo_type: string
          description: string | null
          duration_minutes: number | null
          id: string
          join_url: string | null
          name: string
          product: string
          recording_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          demo_type?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          join_url?: string | null
          name: string
          product: string
          recording_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          demo_type?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          join_url?: string | null
          name?: string
          product?: string
          recording_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sv_model_configs: {
        Row: {
          created_at: string
          enabled: boolean | null
          id: string
          max_tokens: number | null
          model_id: string
          priority: number | null
          quota: number | null
          quota_period: string | null
          rate_limit: number | null
          rate_limit_window: string | null
          temperature: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean | null
          id?: string
          max_tokens?: number | null
          model_id: string
          priority?: number | null
          quota?: number | null
          quota_period?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          id?: string
          max_tokens?: number | null
          model_id?: string
          priority?: number | null
          quota?: number | null
          quota_period?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sv_model_configs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "sv_ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      sv_model_routing: {
        Row: {
          conditions: Json | null
          created_at: string
          fallback_model_id: string | null
          id: string
          is_active: boolean | null
          name: string
          primary_model_id: string
          priority: number | null
          request_type: string
          updated_at: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          fallback_model_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          primary_model_id: string
          priority?: number | null
          request_type: string
          updated_at?: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          fallback_model_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          primary_model_id?: string
          priority?: number | null
          request_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sv_model_routing_fallback_model_id_fkey"
            columns: ["fallback_model_id"]
            isOneToOne: false
            referencedRelation: "sv_ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sv_model_routing_primary_model_id_fkey"
            columns: ["primary_model_id"]
            isOneToOne: false
            referencedRelation: "sv_ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      sv_permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          module: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
        }
        Relationships: []
      }
      sv_prompts: {
        Row: {
          created_at: string
          created_by: string | null
          environment: string
          id: string
          is_active: boolean | null
          model_id: string | null
          name: string
          system_prompt: string | null
          updated_at: string
          user_prompt_template: string | null
          variables: Json | null
          version: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          environment?: string
          id?: string
          is_active?: boolean | null
          model_id?: string | null
          name: string
          system_prompt?: string | null
          updated_at?: string
          user_prompt_template?: string | null
          variables?: Json | null
          version?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          environment?: string
          id?: string
          is_active?: boolean | null
          model_id?: string | null
          name?: string
          system_prompt?: string | null
          updated_at?: string
          user_prompt_template?: string | null
          variables?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "sv_prompts_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "sv_ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      sv_role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sv_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "sv_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sv_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "sv_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      sv_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean | null
          role_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          role_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          role_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_activity_log: {
        Row: {
          action_type: string
          actor_id: string | null
          actor_role: string
          hash_signature: string | null
          log_id: string
          metadata: Json | null
          risk_level: string | null
          target: string | null
          target_id: string | null
          timestamp: string | null
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          actor_role: string
          hash_signature?: string | null
          log_id?: string
          metadata?: Json | null
          risk_level?: string | null
          target?: string | null
          target_id?: string | null
          timestamp?: string | null
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          actor_role?: string
          hash_signature?: string | null
          log_id?: string
          metadata?: Json | null
          risk_level?: string | null
          target?: string | null
          target_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          auto_action_taken: string | null
          created_at: string | null
          id: string
          message: string | null
          severity: string | null
          source_id: string | null
          source_table: string
          status: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          auto_action_taken?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          severity?: string | null
          source_id?: string | null
          source_table: string
          status?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          auto_action_taken?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          severity?: string | null
          source_id?: string | null
          source_table?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      system_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          source_role: string | null
          source_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          source_role?: string | null
          source_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          source_role?: string | null
          source_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_financial_config: {
        Row: {
          config_key: string
          config_value: Json
          id: string
          is_active: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value?: Json
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      system_health: {
        Row: {
          id: string
          metric: string
          status: string | null
          timestamp: string
          unit: string | null
          value: number | null
        }
        Insert: {
          id?: string
          metric: string
          status?: string | null
          timestamp?: string
          unit?: string | null
          value?: number | null
        }
        Update: {
          id?: string
          metric?: string
          status?: string | null
          timestamp?: string
          unit?: string | null
          value?: number | null
        }
        Relationships: []
      }
      system_locks: {
        Row: {
          expires_at: string | null
          force_logout_triggered: boolean | null
          id: string
          is_active: boolean | null
          lock_scope: string
          lock_type: string | null
          locked_at: string | null
          locked_by_super_admin_id: string | null
          metadata: Json | null
          reason: string
          scope_type: string | null
          scope_value: string | null
          target_id: string | null
          target_name: string | null
          unlock_reason: string | null
          unlocked_at: string | null
          unlocked_by: string | null
        }
        Insert: {
          expires_at?: string | null
          force_logout_triggered?: boolean | null
          id?: string
          is_active?: boolean | null
          lock_scope: string
          lock_type?: string | null
          locked_at?: string | null
          locked_by_super_admin_id?: string | null
          metadata?: Json | null
          reason: string
          scope_type?: string | null
          scope_value?: string | null
          target_id?: string | null
          target_name?: string | null
          unlock_reason?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
        }
        Update: {
          expires_at?: string | null
          force_logout_triggered?: boolean | null
          id?: string
          is_active?: boolean | null
          lock_scope?: string
          lock_type?: string | null
          locked_at?: string | null
          locked_by_super_admin_id?: string | null
          metadata?: Json | null
          reason?: string
          scope_type?: string | null
          scope_value?: string | null
          target_id?: string | null
          target_name?: string | null
          unlock_reason?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_critical: boolean | null
          module_code: string
          module_name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_critical?: boolean | null
          module_code: string
          module_name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_critical?: boolean | null
          module_code?: string
          module_name?: string
          status?: string | null
        }
        Relationships: []
      }
      system_requests: {
        Row: {
          action_type: string
          created_at: string
          id: string
          payload_json: Json
          role_type: string | null
          source: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          payload_json?: Json
          role_type?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          payload_json?: Json
          role_type?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: string | null
        }
        Relationships: []
      }
      task_activity: {
        Row: {
          action: string
          created_at: string | null
          id: string
          performed_by_id: string
          performed_by_role: Database["public"]["Enums"]["app_role"]
          remarks: string | null
          task_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          performed_by_id: string
          performed_by_role: Database["public"]["Enums"]["app_role"]
          remarks?: string | null
          task_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          performed_by_id?: string
          performed_by_role?: Database["public"]["Enums"]["app_role"]
          remarks?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_activity_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task_master"
            referencedColumns: ["id"]
          },
        ]
      }
      task_deliveries: {
        Row: {
          commit_url: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_type: string | null
          developer_id: string
          files_json: Json | null
          id: string
          notes: string | null
          quality_score: number | null
          review_status: string | null
          reviewed_by: string | null
          task_id: string
        }
        Insert: {
          commit_url?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_type?: string | null
          developer_id: string
          files_json?: Json | null
          id?: string
          notes?: string | null
          quality_score?: number | null
          review_status?: string | null
          reviewed_by?: string | null
          task_id: string
        }
        Update: {
          commit_url?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_type?: string | null
          developer_id?: string
          files_json?: Json | null
          id?: string
          notes?: string | null
          quality_score?: number | null
          review_status?: string | null
          reviewed_by?: string | null
          task_id?: string
        }
        Relationships: []
      }
      task_logs: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          developer_id: string | null
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          task_id: string
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          developer_id?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          task_id: string
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          developer_id?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_logs_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_master: {
        Row: {
          assigned_to_id: string | null
          assigned_to_role: Database["public"]["Enums"]["app_role"]
          created_at: string | null
          created_by_super_admin_id: string | null
          deadline: string | null
          description: string | null
          id: string
          priority: string | null
          progress_percentage: number | null
          status: string | null
          task_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to_id?: string | null
          assigned_to_role: Database["public"]["Enums"]["app_role"]
          created_at?: string | null
          created_by_super_admin_id?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          progress_percentage?: number | null
          status?: string | null
          task_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to_id?: string | null
          assigned_to_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string | null
          created_by_super_admin_id?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          progress_percentage?: number | null
          status?: string | null
          task_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_master_created_by_super_admin_id_fkey"
            columns: ["created_by_super_admin_id"]
            isOneToOne: false
            referencedRelation: "super_admin"
            referencedColumns: ["id"]
          },
        ]
      }
      task_timers: {
        Row: {
          created_at: string | null
          developer_id: string
          end_time: string | null
          id: string
          is_paused: boolean | null
          start_time: string | null
          status: string | null
          task_id: string
          total_seconds: number | null
        }
        Insert: {
          created_at?: string | null
          developer_id: string
          end_time?: string | null
          id?: string
          is_paused?: boolean | null
          start_time?: string | null
          status?: string | null
          task_id: string
          total_seconds?: number | null
        }
        Update: {
          created_at?: string | null
          developer_id?: string
          end_time?: string | null
          id?: string
          is_paused?: boolean | null
          start_time?: string | null
          status?: string | null
          task_id?: string
          total_seconds?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to_dev: string | null
          created_at: string
          created_by: string | null
          difficulty: string | null
          end_time: string | null
          lead_id: string | null
          priority: string | null
          product_id: string | null
          promised_time: string | null
          remarks: string | null
          start_time: string | null
          status: string | null
          task_id: string
          updated_at: string
        }
        Insert: {
          assigned_to_dev?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          end_time?: string | null
          lead_id?: string | null
          priority?: string | null
          product_id?: string | null
          promised_time?: string | null
          remarks?: string | null
          start_time?: string | null
          status?: string | null
          task_id?: string
          updated_at?: string
        }
        Update: {
          assigned_to_dev?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          end_time?: string | null
          lead_id?: string | null
          priority?: string | null
          product_id?: string | null
          promised_time?: string | null
          remarks?: string | null
          start_time?: string | null
          status?: string | null
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      threat_intelligence: {
        Row: {
          ai_analysis: Json | null
          confidence_score: number
          created_at: string
          expires_at: string | null
          first_seen: string
          id: string
          indicator_type: string
          indicator_value: string
          is_active: boolean | null
          last_seen: string
          mitigation_applied: boolean | null
          mitigation_details: string | null
          occurrence_count: number | null
          source: string
          threat_level: string
          threat_type: string
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_score: number
          created_at?: string
          expires_at?: string | null
          first_seen?: string
          id?: string
          indicator_type: string
          indicator_value: string
          is_active?: boolean | null
          last_seen?: string
          mitigation_applied?: boolean | null
          mitigation_details?: string | null
          occurrence_count?: number | null
          source: string
          threat_level: string
          threat_type: string
        }
        Update: {
          ai_analysis?: Json | null
          confidence_score?: number
          created_at?: string
          expires_at?: string | null
          first_seen?: string
          id?: string
          indicator_type?: string
          indicator_value?: string
          is_active?: boolean | null
          last_seen?: string
          mitigation_applied?: boolean | null
          mitigation_details?: string | null
          occurrence_count?: number | null
          source?: string
          threat_level?: string
          threat_type?: string
        }
        Relationships: []
      }
      training_logs: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          created_at: string
          id: string
          module: string
          progress: number | null
          score: number | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          module: string
          progress?: number | null
          score?: number | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          module?: string
          progress?: number | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      transaction_monitoring: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          flag_reason: string | null
          geo_check_passed: boolean | null
          hold_reason: string | null
          id: string
          is_flagged: boolean | null
          is_held: boolean | null
          pattern_check_passed: boolean | null
          released_at: string | null
          released_by: string | null
          requires_2fa: boolean | null
          risk_factors: string[] | null
          risk_score: number | null
          transaction_id: string | null
          transaction_type: string | null
          user_id: string
          velocity_check_passed: boolean | null
          wallet_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          flag_reason?: string | null
          geo_check_passed?: boolean | null
          hold_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          is_held?: boolean | null
          pattern_check_passed?: boolean | null
          released_at?: string | null
          released_by?: string | null
          requires_2fa?: boolean | null
          risk_factors?: string[] | null
          risk_score?: number | null
          transaction_id?: string | null
          transaction_type?: string | null
          user_id: string
          velocity_check_passed?: boolean | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          flag_reason?: string | null
          geo_check_passed?: boolean | null
          hold_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          is_held?: boolean | null
          pattern_check_passed?: boolean | null
          released_at?: string | null
          released_by?: string | null
          requires_2fa?: boolean | null
          risk_factors?: string[] | null
          risk_score?: number | null
          transaction_id?: string | null
          transaction_type?: string | null
          user_id?: string
          velocity_check_passed?: boolean | null
          wallet_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          reference: string | null
          related_role: Database["public"]["Enums"]["app_role"] | null
          related_sale: string | null
          related_user: string | null
          status: string | null
          timestamp: string
          transaction_id: string
          type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          reference?: string | null
          related_role?: Database["public"]["Enums"]["app_role"] | null
          related_sale?: string | null
          related_user?: string | null
          status?: string | null
          timestamp?: string
          transaction_id?: string
          type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          reference?: string | null
          related_role?: Database["public"]["Enums"]["app_role"] | null
          related_sale?: string | null
          related_user?: string | null
          status?: string | null
          timestamp?: string
          transaction_id?: string
          type?: string
          wallet_id?: string | null
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          browser: string | null
          created_at: string | null
          device_fingerprint: string
          device_name: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          is_trusted: boolean | null
          last_used_at: string | null
          location: string | null
          os: string | null
          revoked_at: string | null
          revoked_by: string | null
          trust_expires_at: string | null
          user_id: string
        }
        Insert: {
          browser?: string | null
          created_at?: string | null
          device_fingerprint: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_trusted?: boolean | null
          last_used_at?: string | null
          location?: string | null
          os?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          trust_expires_at?: string | null
          user_id: string
        }
        Update: {
          browser?: string | null
          created_at?: string | null
          device_fingerprint?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_trusted?: boolean | null
          last_used_at?: string | null
          location?: string | null
          os?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          trust_expires_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      unified_wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          status: string | null
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unified_wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "unified_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_wallets: {
        Row: {
          available_balance: number
          created_at: string
          currency: string
          id: string
          is_frozen: boolean | null
          pending_balance: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          available_balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_frozen?: boolean | null
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          available_balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_frozen?: boolean | null
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
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
      user_2fa_settings: {
        Row: {
          authenticator_secret: string | null
          authenticator_verified: boolean | null
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_2fa_enabled: boolean | null
          last_otp_sent_at: string | null
          otp_rate_limit_until: string | null
          phone_number: string | null
          phone_verified: boolean | null
          preferred_method: string | null
          require_otp_for_actions: boolean | null
          require_otp_for_login: boolean | null
          trusted_devices: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          authenticator_secret?: string | null
          authenticator_verified?: boolean | null
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_2fa_enabled?: boolean | null
          last_otp_sent_at?: string | null
          otp_rate_limit_until?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_method?: string | null
          require_otp_for_actions?: boolean | null
          require_otp_for_login?: boolean | null
          trusted_devices?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          authenticator_secret?: string | null
          authenticator_verified?: boolean | null
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_2fa_enabled?: boolean | null
          last_otp_sent_at?: string | null
          otp_rate_limit_until?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_method?: string | null
          require_otp_for_actions?: boolean | null
          require_otp_for_login?: boolean | null
          trusted_devices?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_agreements: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          ip_address: string | null
          signed_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          ip_address?: string | null
          signed_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          ip_address?: string | null
          signed_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_agreements_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "legal_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          consent_type: string
          consent_version: string
          created_at: string | null
          expires_at: string | null
          granted_at: string | null
          id: string
          ip_address: string | null
          is_granted: boolean
          region: string | null
          revoked_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type: string
          consent_version: string
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          is_granted?: boolean
          region?: string | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: string
          consent_version?: string
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          is_granted?: boolean
          region?: string | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_demo_history: {
        Row: {
          demo_id: string | null
          duration_seconds: number | null
          id: string
          interaction_count: number | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          demo_id?: string | null
          duration_seconds?: number | null
          id?: string
          interaction_count?: number | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          demo_id?: string | null
          duration_seconds?: number | null
          id?: string
          interaction_count?: number | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_demo_history_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_licenses: {
        Row: {
          activated_at: string | null
          created_at: string
          current_installations: number | null
          expires_at: string | null
          id: string
          license_key: string
          license_type: string
          max_installations: number | null
          metadata: Json | null
          order_item_id: string | null
          product_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          current_installations?: number | null
          expires_at?: string | null
          id?: string
          license_key: string
          license_type?: string
          max_installations?: number | null
          metadata?: Json | null
          order_item_id?: string | null
          product_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          current_installations?: number | null
          expires_at?: string | null
          id?: string
          license_key?: string
          license_type?: string
          max_installations?: number | null
          metadata?: Json | null
          order_item_id?: string | null
          product_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_licenses_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_licenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string
          dismissed_at: string | null
          event_type: string | null
          id: string
          is_buzzer: boolean | null
          is_dismissed: boolean | null
          is_read: boolean | null
          message: string
          read_at: string | null
          role_target: string[] | null
          type: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          dismissed_at?: string | null
          event_type?: string | null
          id?: string
          is_buzzer?: boolean | null
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message: string
          read_at?: string | null
          role_target?: string[] | null
          type: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          dismissed_at?: string | null
          event_type?: string | null
          id?: string
          is_buzzer?: boolean | null
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          role_target?: string[] | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_online_status: {
        Row: {
          current_page: string | null
          device_info: string | null
          force_logged_out: boolean | null
          id: string
          ip_address: string | null
          is_online: boolean | null
          last_seen_at: string | null
          pending_approval: boolean | null
          session_started_at: string | null
          updated_at: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          current_page?: string | null
          device_info?: string | null
          force_logged_out?: boolean | null
          id?: string
          ip_address?: string | null
          is_online?: boolean | null
          last_seen_at?: string | null
          pending_approval?: boolean | null
          session_started_at?: string | null
          updated_at?: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          current_page?: string | null
          device_info?: string | null
          force_logged_out?: boolean | null
          id?: string
          ip_address?: string | null
          is_online?: boolean | null
          last_seen_at?: string | null
          pending_approval?: boolean | null
          session_started_at?: string | null
          updated_at?: string | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          last_active_at: string | null
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          total_purchases: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_active_at?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          total_purchases?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_active_at?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          total_purchases?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
          wallet_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_purchases: {
        Row: {
          access_expires_at: string | null
          access_granted_at: string | null
          amount: number
          created_at: string | null
          currency: string | null
          demo_id: string | null
          id: string
          payment_method: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          amount: number
          created_at?: string | null
          currency?: string | null
          demo_id?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          amount?: number
          created_at?: string | null
          currency?: string | null
          demo_id?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          force_logged_out_at: string | null
          force_logged_out_by: string | null
          id: string
          rejection_reason: string | null
          role: Database["public"]["Enums"]["app_role"]
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          two_factor_verified_at: string | null
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          force_logged_out_at?: string | null
          force_logged_out_by?: string | null
          id?: string
          rejection_reason?: string | null
          role: Database["public"]["Enums"]["app_role"]
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          two_factor_verified_at?: string | null
          user_id: string
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          force_logged_out_at?: string | null
          force_logged_out_by?: string | null
          id?: string
          rejection_reason?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          two_factor_verified_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          country: string | null
          created_at: string | null
          device_info: string | null
          force_logout_flag: boolean | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          location: string | null
          login_at: string | null
          logout_at: string | null
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          device_info?: string | null
          force_logout_flag?: boolean | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_at?: string | null
          logout_at?: string | null
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          device_info?: string | null
          force_logout_flag?: boolean | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_at?: string | null
          logout_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_status_history: {
        Row: {
          changed_at: string | null
          changed_by_super_admin_id: string | null
          id: string
          new_status: string
          old_status: string | null
          reason: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by_super_admin_id?: string | null
          id?: string
          new_status: string
          old_status?: string | null
          reason?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by_super_admin_id?: string | null
          id?: string
          new_status?: string
          old_status?: string | null
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          ticket_number: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          ticket_number?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          ticket_number?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      verification_records: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          agreement_accepted_at: string | null
          agreement_ip_address: string | null
          agreement_version: string | null
          asn_info: Json | null
          asn_score: number | null
          country_code: string | null
          country_risk_score: number | null
          created_at: string | null
          current_step: string
          date_of_birth: string | null
          device_fingerprint: string | null
          device_score: number | null
          full_name: string | null
          id: string
          id_document_back_url: string | null
          id_document_front_url: string | null
          identity_verified_at: string | null
          identity_verified_by: string | null
          ip_reputation_score: number | null
          is_activated: boolean | null
          legal_review_notes: string | null
          legal_review_status: string | null
          legal_reviewed_at: string | null
          legal_reviewer_id: string | null
          liveness_photo_url: string | null
          rejection_reason: string | null
          requires_resubmission: boolean | null
          resubmission_count: number | null
          risk_assessed_at: string | null
          risk_factors: Json | null
          risk_score: number | null
          role: Database["public"]["Enums"]["app_role"]
          step_statuses: Json
          updated_at: string | null
          user_id: string
          violation_history_score: number | null
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          agreement_accepted_at?: string | null
          agreement_ip_address?: string | null
          agreement_version?: string | null
          asn_info?: Json | null
          asn_score?: number | null
          country_code?: string | null
          country_risk_score?: number | null
          created_at?: string | null
          current_step?: string
          date_of_birth?: string | null
          device_fingerprint?: string | null
          device_score?: number | null
          full_name?: string | null
          id?: string
          id_document_back_url?: string | null
          id_document_front_url?: string | null
          identity_verified_at?: string | null
          identity_verified_by?: string | null
          ip_reputation_score?: number | null
          is_activated?: boolean | null
          legal_review_notes?: string | null
          legal_review_status?: string | null
          legal_reviewed_at?: string | null
          legal_reviewer_id?: string | null
          liveness_photo_url?: string | null
          rejection_reason?: string | null
          requires_resubmission?: boolean | null
          resubmission_count?: number | null
          risk_assessed_at?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          role: Database["public"]["Enums"]["app_role"]
          step_statuses?: Json
          updated_at?: string | null
          user_id: string
          violation_history_score?: number | null
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          agreement_accepted_at?: string | null
          agreement_ip_address?: string | null
          agreement_version?: string | null
          asn_info?: Json | null
          asn_score?: number | null
          country_code?: string | null
          country_risk_score?: number | null
          created_at?: string | null
          current_step?: string
          date_of_birth?: string | null
          device_fingerprint?: string | null
          device_score?: number | null
          full_name?: string | null
          id?: string
          id_document_back_url?: string | null
          id_document_front_url?: string | null
          identity_verified_at?: string | null
          identity_verified_by?: string | null
          ip_reputation_score?: number | null
          is_activated?: boolean | null
          legal_review_notes?: string | null
          legal_review_status?: string | null
          legal_reviewed_at?: string | null
          legal_reviewer_id?: string | null
          liveness_photo_url?: string | null
          rejection_reason?: string | null
          requires_resubmission?: boolean | null
          resubmission_count?: number | null
          risk_assessed_at?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          step_statuses?: Json
          updated_at?: string | null
          user_id?: string
          violation_history_score?: number | null
        }
        Relationships: []
      }
      verified_action_logs: {
        Row: {
          action_data: Json | null
          action_target: string | null
          action_type: string
          approval_id: string | null
          created_at: string | null
          error_message: string | null
          geo_location: string | null
          id: string
          ip_address: string | null
          otp_verification_id: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string
          user_role: string | null
          verification_method: string | null
        }
        Insert: {
          action_data?: Json | null
          action_target?: string | null
          action_type: string
          approval_id?: string | null
          created_at?: string | null
          error_message?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          otp_verification_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id: string
          user_role?: string | null
          verification_method?: string | null
        }
        Update: {
          action_data?: Json | null
          action_target?: string | null
          action_type?: string
          approval_id?: string | null
          created_at?: string | null
          error_message?: string | null
          geo_location?: string | null
          id?: string
          ip_address?: string | null
          otp_verification_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string
          user_role?: string | null
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verified_action_logs_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "action_approval_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verified_action_logs_otp_verification_id_fkey"
            columns: ["otp_verification_id"]
            isOneToOne: false
            referencedRelation: "otp_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_logs: {
        Row: {
          audio_path: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          language: string | null
          room_id: string | null
          sender_id: string
          transcript: string | null
        }
        Insert: {
          audio_path?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          language?: string | null
          room_id?: string | null
          sender_id: string
          transcript?: string | null
        }
        Update: {
          audio_path?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          language?: string | null
          room_id?: string | null
          sender_id?: string
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_logs_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_audit_log: {
        Row: {
          amount: number | null
          approval_status: string | null
          approved_by: string | null
          created_at: string | null
          device_fingerprint: string | null
          error_message: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          new_balance: number | null
          operation_type: string
          previous_balance: number | null
          status: string
          transaction_id: string | null
          user_agent: string | null
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          amount?: number | null
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_balance?: number | null
          operation_type: string
          previous_balance?: number | null
          status: string
          transaction_id?: string | null
          user_agent?: string | null
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number | null
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_balance?: number | null
          operation_type?: string
          previous_balance?: number | null
          status?: string
          transaction_id?: string | null
          user_agent?: string | null
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: []
      }
      wallet_compliance_checks: {
        Row: {
          action_taken: string | null
          check_type: string
          created_at: string | null
          details: Json | null
          id: string
          report_filed: boolean | null
          report_reference: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: string | null
          status: string | null
          triggered_rules: string[] | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          action_taken?: string | null
          check_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          report_filed?: boolean | null
          report_reference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          status?: string | null
          triggered_rules?: string[] | null
          user_id: string
          wallet_id: string
        }
        Update: {
          action_taken?: string | null
          check_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          report_filed?: boolean | null
          report_reference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          status?: string | null
          triggered_rules?: string[] | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string
          currency: string | null
          updated_at: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          updated_at?: string
          user_id: string
          wallet_id?: string
        }
        Update: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          updated_at?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: []
      }
      websocket_connections: {
        Row: {
          channel: string
          connected_at: string | null
          id: string
          is_active: boolean | null
          last_ping_at: string | null
          metadata: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          channel: string
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          last_ping_at?: string | null
          metadata?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          channel?: string
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          last_ping_at?: string | null
          metadata?: Json | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      websocket_events: {
        Row: {
          channel: string
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          server_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          server_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          server_id?: string | null
        }
        Relationships: []
      }
      zero_trust_verifications: {
        Row: {
          action_allowed: boolean
          anomalies_detected: Json | null
          created_at: string
          denial_reason: string | null
          device_fingerprint: string
          factors_verified: Json | null
          geolocation: Json | null
          id: string
          ip_address: unknown
          risk_score: number | null
          session_token_hash: string | null
          user_id: string
          verification_duration_ms: number | null
          verification_result: boolean
          verification_type: string
        }
        Insert: {
          action_allowed: boolean
          anomalies_detected?: Json | null
          created_at?: string
          denial_reason?: string | null
          device_fingerprint: string
          factors_verified?: Json | null
          geolocation?: Json | null
          id?: string
          ip_address?: unknown
          risk_score?: number | null
          session_token_hash?: string | null
          user_id: string
          verification_duration_ms?: number | null
          verification_result: boolean
          verification_type: string
        }
        Update: {
          action_allowed?: boolean
          anomalies_detected?: Json | null
          created_at?: string
          denial_reason?: string | null
          device_fingerprint?: string
          factors_verified?: Json | null
          geolocation?: Json | null
          id?: string
          ip_address?: unknown
          risk_score?: number | null
          session_token_hash?: string | null
          user_id?: string
          verification_duration_ms?: number | null
          verification_result?: boolean
          verification_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      promise_manager_metrics: {
        Row: {
          active_escalations: number | null
          breached: number | null
          fulfilled: number | null
          fulfillment_rate: number | null
          overdue: number | null
          pending_approval: number | null
          total_active: number | null
          total_promises: number | null
        }
        Relationships: []
      }
      promise_tracker_metrics: {
        Row: {
          active_promises: number | null
          escalated_promises: number | null
          fulfilled_promises: number | null
          last_updated: string | null
          overdue_promises: number | null
          pending_approval: number | null
          total_promises: number | null
        }
        Relationships: []
      }
      promise_tracker_view: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assigned_role: string | null
          assigned_user_masked: string | null
          breach_reason: string | null
          created_at: string | null
          due_date: string | null
          escalated_at: string | null
          escalation_level: number | null
          extended_count: number | null
          finished_time: string | null
          is_locked: boolean | null
          linked_module: string | null
          priority: string | null
          promise_id: string | null
          promise_type: string | null
          remaining_minutes: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["promise_status"] | null
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: never
          assigned_role?: never
          assigned_user_masked?: never
          breach_reason?: string | null
          created_at?: string | null
          due_date?: string | null
          escalated_at?: string | null
          escalation_level?: number | null
          extended_count?: number | null
          finished_time?: string | null
          is_locked?: boolean | null
          linked_module?: never
          priority?: string | null
          promise_id?: string | null
          promise_type?: string | null
          remaining_minutes?: never
          start_date?: string | null
          status?: Database["public"]["Enums"]["promise_status"] | null
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: never
          assigned_role?: never
          assigned_user_masked?: never
          breach_reason?: string | null
          created_at?: string | null
          due_date?: string | null
          escalated_at?: string | null
          escalation_level?: number | null
          extended_count?: number | null
          finished_time?: string | null
          is_locked?: boolean | null
          linked_module?: never
          priority?: string | null
          promise_id?: string | null
          promise_type?: string | null
          remaining_minutes?: never
          start_date?: string | null
          status?: Database["public"]["Enums"]["promise_status"] | null
          task_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promise_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "developer_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_compliance_status: {
        Row: {
          active_penalties: number | null
          highest_penalty_level: number | null
          is_verified: boolean | null
          last_agreement_date: string | null
          risk_score: number | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
          verification_step: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_to_audit_chain: {
        Args: {
          p_action_type: string
          p_data: Json
          p_module: string
          p_user_id: string
        }
        Returns: string
      }
      add_to_login_whitelist: {
        Args: {
          p_device_whitelist?: string[]
          p_email: string
          p_ip_whitelist?: string[]
          p_target_user_id: string
        }
        Returns: Json
      }
      approve_payout: {
        Args: { p_approver_id: string; p_payout_id: string }
        Returns: Json
      }
      approve_promise: {
        Args: { p_approver_id: string; p_promise_id: string }
        Returns: Json
      }
      approve_promise_strict: {
        Args: { p_approver_id: string; p_promise_id: string }
        Returns: Json
      }
      approve_user: {
        Args: { _approver_id: string; _target_user_id: string }
        Returns: boolean
      }
      authorize_role_access: { Args: { _user_id: string }; Returns: boolean }
      auto_expire_rentals: { Args: never; Returns: number }
      breach_promise_with_penalty: {
        Args: { p_promise_id: string; p_reason?: string }
        Returns: Json
      }
      bulk_create_demos: {
        Args: { _demos: Json }
        Returns: {
          demo_id: string
          demo_name: string
          status: string
        }[]
      }
      calculate_regional_tax: {
        Args: {
          p_amount: number
          p_category?: string
          p_country_code: string
          p_state_code: string
        }
        Returns: Json
      }
      can_access_demos: { Args: { _user_id: string }; Returns: boolean }
      can_access_finance: { Args: { _user_id: string }; Returns: boolean }
      can_access_internal_channel: {
        Args: { _channel_id: string; _user_id: string }
        Returns: boolean
      }
      can_manage_demos: { Args: { _user_id: string }; Returns: boolean }
      can_manage_developers: { Args: { _user_id: string }; Returns: boolean }
      can_manage_franchises: { Args: { _user_id: string }; Returns: boolean }
      can_manage_influencers: { Args: { _user_id: string }; Returns: boolean }
      can_manage_leads: { Args: { _user_id: string }; Returns: boolean }
      can_manage_prime_users: { Args: { _user_id: string }; Returns: boolean }
      can_manage_resellers: { Args: { _user_id: string }; Returns: boolean }
      can_view_leads: { Args: { _user_id: string }; Returns: boolean }
      check_access_allowed: {
        Args: {
          p_device_fingerprint: string
          p_email?: string
          p_ip_address: string
        }
        Returns: Json
      }
      check_auto_healing: {
        Args: never
        Returns: {
          heal_reason: string
          needs_healing: boolean
          server_id: string
        }[]
      }
      check_auto_scaling:
        | {
            Args: never
            Returns: {
              needs_scaling: boolean
              scale_reason: string
              server_id: string
            }[]
          }
        | { Args: { p_server_id: string }; Returns: Json }
      check_box_action_permission: {
        Args: { _action_type: string; _box_type: string; _user_id: string }
        Returns: boolean
      }
      check_financial_mode: { Args: never; Returns: Json }
      check_force_logout: { Args: { check_user_id: string }; Returns: string }
      check_login_rate_limit: {
        Args: { p_email: string; p_ip_address: string }
        Returns: Json
      }
      check_rate_limit: {
        Args: {
          p_action_type: string
          p_max_requests?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: Json
      }
      check_rental_active: {
        Args: { p_feature_code: string; p_user_id: string }
        Returns: boolean
      }
      check_session_valid: { Args: { p_user_id: string }; Returns: Json }
      check_super_admin_authorization: {
        Args: { p_action: string; p_target_scope?: Json; p_user_id: string }
        Returns: Json
      }
      clear_failed_logins: { Args: { p_email: string }; Returns: undefined }
      clear_force_logout: { Args: { clear_user_id: string }; Returns: boolean }
      complete_promise_with_reward: {
        Args: { p_promise_id: string }
        Returns: Json
      }
      confirm_developer_commitment: {
        Args: { p_promise_id: string }
        Returns: Json
      }
      create_demo_order: {
        Args: {
          p_client_domain: string
          p_client_email: string
          p_client_name: string
          p_demo_id: string
          p_requirements?: Json
        }
        Returns: string
      }
      create_demo_report_card: {
        Args: {
          _action_type: string
          _demo_id: string
          _demo_name: string
          _demo_status?: string
          _error_details?: string
          _fix_details?: string
          _new_values?: Json
          _old_values?: Json
          _sector?: string
          _sub_category?: string
          _uptime_state?: string
        }
        Returns: string
      }
      create_promise_with_validation: {
        Args: {
          p_assigned_role: string
          p_deadline: string
          p_developer_id: string
          p_priority: string
          p_promise_type: string
          p_responsible_user_id?: string
          p_task_id: string
        }
        Returns: Json
      }
      create_remote_assist_session: { Args: never; Returns: Json }
      create_super_admin_session: {
        Args: {
          p_device_fingerprint: string
          p_ip_address: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: Json
      }
      create_threat_alert: {
        Args: {
          p_affected_module?: string
          p_affected_user_id?: string
          p_ai_confidence?: number
          p_alert_type: string
          p_auto_mitigate?: boolean
          p_description: string
          p_device_fingerprint?: string
          p_recommended_action?: string
          p_source_ip?: unknown
          p_threat_level: string
          p_title: string
        }
        Returns: string
      }
      end_remote_assist_session: {
        Args: { p_reason?: string; p_session_id: string }
        Returns: Json
      }
      end_user_safe_assist_on_logout: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      escalate_overdue_promise: {
        Args: { p_promise_id: string }
        Returns: Json
      }
      escalate_overdue_promises: { Args: never; Returns: number }
      exceeds_workload_threshold: {
        Args: { _developer_id: string }
        Returns: boolean
      }
      execute_auto_scale: {
        Args: {
          p_new_cpu: number
          p_new_ram: number
          p_reason: string
          p_server_id: string
          p_trigger_value: number
        }
        Returns: Json
      }
      force_end_all_assist_sessions: {
        Args: { p_reason: string }
        Returns: Json
      }
      force_end_assist_session: {
        Args: { p_end_type?: string; p_reason: string; p_session_id: string }
        Returns: Json
      }
      force_logout_all_except_master: {
        Args: { admin_user_id: string }
        Returns: number
      }
      force_logout_user: {
        Args: { admin_user_id: string; target_user_id: string }
        Returns: boolean
      }
      fulfill_promise_strict: {
        Args: {
          p_force_close?: boolean
          p_fulfiller_id: string
          p_promise_id: string
        }
        Returns: Json
      }
      generate_backup_codes: { Args: { p_user_id: string }; Returns: string[] }
      generate_daily_demo_id: { Args: { p_demo_id: string }; Returns: string }
      generate_deployment_license: { Args: never; Returns: string }
      generate_otp: {
        Args: {
          p_action_data?: Json
          p_action_description?: string
          p_otp_type: string
          p_user_id: string
        }
        Returns: string
      }
      generate_server_metrics: { Args: never; Returns: undefined }
      generate_session_code: { Args: never; Returns: string }
      generate_user_verification_code: { Args: never; Returns: string }
      get_area_manager_region: { Args: { _user_id: string }; Returns: string }
      get_developer_id: { Args: { _user_id: string }; Returns: string }
      get_franchise_id: { Args: { _user_id: string }; Returns: string }
      get_influencer_id: { Args: { _user_id: string }; Returns: string }
      get_prime_user_id: { Args: { _user_id: string }; Returns: string }
      get_reseller_id: { Args: { _user_id: string }; Returns: string }
      get_risk_level: { Args: { score: number }; Returns: string }
      get_user_penalty_level: { Args: { _user_id: string }; Returns: number }
      get_users_for_approval: {
        Args: { viewer_role: string }
        Returns: {
          approval_status: string
          approved_at: string
          approved_by: string
          created_at: string
          id: string
          role: string
          user_id: string
        }[]
      }
      give_remote_assist_consent: {
        Args: { p_session_id: string }
        Returns: Json
      }
      has_active_penalty: {
        Args: { _min_level?: number; _user_id: string }
        Returns: boolean
      }
      has_overlapping_promise: {
        Args: { _deadline: string; _developer_id: string }
        Returns: boolean
      }
      has_pending_withdrawal: {
        Args: { p_amount: number; p_user_id: string }
        Returns: boolean
      }
      has_privileged_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_demo_manager: { Args: { _user_id?: string }; Returns: boolean }
      is_developer_verified: { Args: { p_user_id: string }; Returns: boolean }
      is_device_trusted: {
        Args: { p_fingerprint: string; p_user_id: string }
        Returns: boolean
      }
      is_franchise: { Args: { _user_id: string }; Returns: boolean }
      is_in_area_manager_region: {
        Args: { _area_manager_id: string; _target_user_id: string }
        Returns: boolean
      }
      is_influencer: { Args: { _user_id: string }; Returns: boolean }
      is_master: { Args: never; Returns: boolean }
      is_password_recently_verified: {
        Args: { p_action_type: string; p_user_id: string }
        Returns: boolean
      }
      is_platform_admin: { Args: { user_id: string }; Returns: boolean }
      is_prime_user: { Args: { _user_id: string }; Returns: boolean }
      is_reseller: { Args: { _user_id: string }; Returns: boolean }
      is_server_manager: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_system_locked: {
        Args: { p_scope?: string; p_target_id?: string }
        Returns: boolean
      }
      is_user_approved: { Args: { _user_id: string }; Returns: boolean }
      is_user_verified: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      issue_penalty: {
        Args: {
          _auto_triggered?: boolean
          _evidence?: string
          _penalty_level: number
          _reason: string
          _user_id: string
          _user_role: Database["public"]["Enums"]["app_role"]
          _violation_type: string
        }
        Returns: string
      }
      issue_security_token: {
        Args: {
          p_device_fingerprint: string
          p_ip_address?: unknown
          p_max_usage?: number
          p_token_type: string
          p_user_agent?: string
          p_user_id: string
          p_validity_minutes?: number
        }
        Returns: {
          token_hash: string
          token_id: string
        }[]
      }
      join_remote_assist_session: {
        Args: { p_session_code: string }
        Returns: Json
      }
      log_activity: {
        Args: {
          p_action_type: Database["public"]["Enums"]["activity_action_type"]
          p_description?: string
          p_metadata?: Json
          p_page_url?: string
          p_status?: Database["public"]["Enums"]["activity_status"]
        }
        Returns: string
      }
      log_compliance_audit: {
        Args: {
          p_action: string
          p_actor_id: string
          p_actor_role: Database["public"]["Enums"]["app_role"]
          p_compliance_tags?: string[]
          p_entity_id: string
          p_entity_type: string
          p_ip_address?: string
          p_new_values?: Json
          p_old_values?: Json
        }
        Returns: string
      }
      log_promise_export: {
        Args: {
          p_export_format: string
          p_filter_criteria?: Json
          p_records_exported?: number
        }
        Returns: string
      }
      log_promise_view: {
        Args: {
          p_ip_address?: string
          p_promise_id?: string
          p_session_id?: string
          p_user_agent?: string
          p_view_type?: string
        }
        Returns: string
      }
      log_risk_audit: {
        Args: {
          p_action: string
          p_actor_id?: string
          p_actor_role?: string
          p_calculation?: Json
          p_reasoning?: Json
          p_score_after: number
          p_score_before: number
          p_trigger_type: string
          p_user_id: string
        }
        Returns: string
      }
      log_safe_assist_ai_event: {
        Args: {
          p_analysis: Json
          p_auto_handle?: boolean
          p_event_type: string
          p_recommended_action: string
          p_risk_level: string
          p_session_id: string
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_action_details?: Json
          p_device_fingerprint?: string
          p_event_type: string
          p_ip_address?: string
          p_user_id: string
        }
        Returns: string
      }
      log_super_admin_action: {
        Args: {
          p_action_category: string
          p_action_type: string
          p_admin_id: string
          p_ip_address?: string
          p_new_state?: Json
          p_previous_state?: Json
          p_reason?: string
          p_risk_level?: string
          p_status?: string
          p_target_id?: string
          p_target_type?: string
        }
        Returns: string
      }
      log_to_blackbox: {
        Args: {
          p_device_fingerprint?: string
          p_entity_id?: string
          p_entity_type?: string
          p_event_type: string
          p_geo_location?: string
          p_ip_address?: string
          p_metadata?: Json
          p_module_name: string
          p_risk_score?: number
          p_role_name?: string
          p_user_id?: string
        }
        Returns: string
      }
      log_unauthorized_demo_attempt: {
        Args: {
          _action_attempted: string
          _demo_id?: string
          _user_id: string
          _user_role: string
        }
        Returns: string
      }
      master_auto_threat_response: {
        Args: { p_threat_id: string }
        Returns: Json
      }
      master_check_access: {
        Args: {
          p_action: string
          p_device_fingerprint?: string
          p_entity_id?: string
          p_entity_type?: string
          p_ip_address?: string
          p_module?: string
          p_user_id: string
        }
        Returns: Json
      }
      master_check_login_security: {
        Args: {
          p_device_fingerprint: string
          p_email: string
          p_geo_location?: string
          p_ip_address: string
        }
        Returns: Json
      }
      master_check_rate_limit: {
        Args: {
          p_endpoint: string
          p_identifier: string
          p_identifier_type: string
        }
        Returns: Json
      }
      master_check_replay: {
        Args: {
          p_endpoint: string
          p_ip_address: string
          p_request_hash: string
          p_request_id: string
          p_user_id: string
        }
        Returns: Json
      }
      master_revoke_user_tokens: {
        Args: { p_reason: string; p_revoked_by?: string; p_user_id: string }
        Returns: number
      }
      master_user_has_permission: {
        Args: { p_permission_code: string; p_user_id: string }
        Returns: boolean
      }
      master_verify_hash_chain: {
        Args: { p_end_sequence?: number; p_start_sequence?: number }
        Returns: Json
      }
      normalize_demo_url: { Args: { url: string }; Returns: string }
      reject_payout: {
        Args: { p_payout_id: string; p_reason?: string; p_rejector_id: string }
        Returns: Json
      }
      reject_promise: {
        Args: { p_promise_id: string; p_reason?: string; p_rejector_id: string }
        Returns: Json
      }
      reject_promise_strict: {
        Args: { p_promise_id: string; p_reason: string; p_rejector_id: string }
        Returns: Json
      }
      reject_user: {
        Args: {
          _reason?: string
          _rejector_id: string
          _target_user_id: string
        }
        Returns: boolean
      }
      remove_from_login_whitelist: {
        Args: { p_target_user_id: string }
        Returns: Json
      }
      request_withdrawal: {
        Args: {
          p_amount: number
          p_device_fingerprint?: string
          p_ip_address?: string
          p_payment_method?: string
          p_user_id: string
        }
        Returns: Json
      }
      requires_otp_verification: {
        Args: { p_action_type: string; p_user_id: string }
        Returns: boolean
      }
      review_developer_registration: {
        Args: {
          p_action: string
          p_notes?: string
          p_registration_id: string
          p_rejection_reason?: string
        }
        Returns: Json
      }
      set_financial_mode: {
        Args: { p_admin_id: string; p_mode: string; p_reason: string }
        Returns: Json
      }
      submit_developer_registration: {
        Args: { p_registration_id: string }
        Returns: Json
      }
      track_failed_login: {
        Args: {
          p_device_fingerprint?: string
          p_email: string
          p_ip_address: string
        }
        Returns: Json
      }
      update_online_status: {
        Args: { p_current_page?: string; p_is_online: boolean }
        Returns: boolean
      }
      update_risk_score: {
        Args: {
          p_behavior_score?: number
          p_commission_score?: number
          p_device_score?: number
          p_factors?: Json
          p_lead_score?: number
          p_login_score?: number
          p_transaction_score?: number
          p_user_id: string
        }
        Returns: {
          auto_action_taken: string | null
          behavior_score: number | null
          commission_score: number | null
          created_at: string
          current_score: number
          device_score: number | null
          escalation_level: number | null
          factors: Json | null
          id: string
          last_calculated_at: string | null
          lead_score: number | null
          login_pattern_score: number | null
          previous_score: number | null
          risk_level: string
          transaction_score: number | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "risk_scores"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      validate_promise_integrity: {
        Args: { p_promise_id: string }
        Returns: Json
      }
      validate_super_admin_session: {
        Args: {
          p_device_fingerprint: string
          p_ip_address: string
          p_session_token: string
          p_user_id: string
        }
        Returns: Json
      }
      validate_user_route_access: {
        Args: { p_route: string; p_user_id: string }
        Returns: boolean
      }
      verify_audit_chain: {
        Args: never
        Returns: {
          broken_at_block: number
          error_message: string
          is_valid: boolean
          last_verified_block: number
        }[]
      }
      verify_backup_code: {
        Args: { p_code: string; p_user_id: string }
        Returns: boolean
      }
      verify_deployment_request: {
        Args: {
          p_license_key: string
          p_request_domain: string
          p_request_ip: string
          p_user_agent?: string
        }
        Returns: Json
      }
      verify_login_allowed: {
        Args: {
          p_device_fingerprint: string
          p_email: string
          p_ip_address: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: Json
      }
      verify_otp: {
        Args: { p_otp_code: string; p_otp_type: string; p_user_id: string }
        Returns: Json
      }
      verify_safe_assist_connection: {
        Args: {
          p_agent_code: string
          p_is_agent: boolean
          p_session_id: string
          p_user_code: string
        }
        Returns: Json
      }
      zero_trust_verify: {
        Args: {
          p_action: string
          p_device_fingerprint: string
          p_geolocation?: Json
          p_ip_address?: unknown
          p_user_id: string
        }
        Returns: {
          allowed: boolean
          denial_reason: string
          required_factors: string[]
          risk_score: number
        }[]
      }
    }
    Enums: {
      activity_action_type:
        | "login"
        | "logout"
        | "page_navigation"
        | "demo_interaction"
        | "copy_attempt"
        | "link_edit"
        | "approval_request"
        | "force_logout"
        | "task_update"
        | "lead_action"
        | "chat_message"
        | "file_access"
        | "settings_change"
        | "error"
      activity_status: "success" | "fail" | "blocked" | "pending" | "warning"
      ai_module:
        | "seo"
        | "chatbot"
        | "dev_assist"
        | "ocr"
        | "image_gen"
        | "translation"
        | "analytics"
        | "other"
      ai_provider: "openai" | "gemini" | "claude" | "lovable_ai" | "other"
      app_role:
        | "super_admin"
        | "demo_manager"
        | "franchise"
        | "reseller"
        | "client"
        | "prime"
        | "developer"
        | "influencer"
        | "marketing_manager"
        | "client_success"
        | "seo_manager"
        | "lead_manager"
        | "task_manager"
        | "rnd_manager"
        | "performance_manager"
        | "finance_manager"
        | "legal_compliance"
        | "hr_manager"
        | "support"
        | "ai_manager"
        | "admin"
        | "api_security"
        | "r_and_d"
        | "master"
        | "safe_assist"
        | "assist_manager"
        | "promise_tracker"
        | "promise_management"
        | "area_manager"
        | "server_manager"
        | "product_demo_manager"
        | "boss_owner"
        | "ceo"
        | "reseller_manager"
      critical_action_type:
        | "delete_data"
        | "edit_financial"
        | "add_user"
        | "remove_user"
        | "change_role"
        | "server_action"
        | "bulk_operation"
        | "export_data"
        | "change_settings"
        | "ai_action"
      demo_lifecycle_status: "pending" | "active" | "disabled" | "archived"
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
      developer_verification_status:
        | "submitted"
        | "under_review"
        | "verified"
        | "rejected"
        | "pending_documents"
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
      offer_event_type: "festival" | "sports" | "custom"
      promise_status:
        | "pending_approval"
        | "assigned"
        | "promised"
        | "in_progress"
        | "breached"
        | "completed"
      remote_assist_mode: "view_only" | "guided_cursor"
      remote_assist_status:
        | "pending"
        | "active"
        | "ended"
        | "expired"
        | "cancelled"
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
      activity_action_type: [
        "login",
        "logout",
        "page_navigation",
        "demo_interaction",
        "copy_attempt",
        "link_edit",
        "approval_request",
        "force_logout",
        "task_update",
        "lead_action",
        "chat_message",
        "file_access",
        "settings_change",
        "error",
      ],
      activity_status: ["success", "fail", "blocked", "pending", "warning"],
      ai_module: [
        "seo",
        "chatbot",
        "dev_assist",
        "ocr",
        "image_gen",
        "translation",
        "analytics",
        "other",
      ],
      ai_provider: ["openai", "gemini", "claude", "lovable_ai", "other"],
      app_role: [
        "super_admin",
        "demo_manager",
        "franchise",
        "reseller",
        "client",
        "prime",
        "developer",
        "influencer",
        "marketing_manager",
        "client_success",
        "seo_manager",
        "lead_manager",
        "task_manager",
        "rnd_manager",
        "performance_manager",
        "finance_manager",
        "legal_compliance",
        "hr_manager",
        "support",
        "ai_manager",
        "admin",
        "api_security",
        "r_and_d",
        "master",
        "safe_assist",
        "assist_manager",
        "promise_tracker",
        "promise_management",
        "area_manager",
        "server_manager",
        "product_demo_manager",
        "boss_owner",
        "ceo",
        "reseller_manager",
      ],
      critical_action_type: [
        "delete_data",
        "edit_financial",
        "add_user",
        "remove_user",
        "change_role",
        "server_action",
        "bulk_operation",
        "export_data",
        "change_settings",
        "ai_action",
      ],
      demo_lifecycle_status: ["pending", "active", "disabled", "archived"],
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
      developer_verification_status: [
        "submitted",
        "under_review",
        "verified",
        "rejected",
        "pending_documents",
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
      offer_event_type: ["festival", "sports", "custom"],
      promise_status: [
        "pending_approval",
        "assigned",
        "promised",
        "in_progress",
        "breached",
        "completed",
      ],
      remote_assist_mode: ["view_only", "guided_cursor"],
      remote_assist_status: [
        "pending",
        "active",
        "ended",
        "expired",
        "cancelled",
      ],
    },
  },
} as const
