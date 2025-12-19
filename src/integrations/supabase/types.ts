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
      demos: {
        Row: {
          ai_category_suggestion: string | null
          ai_tech_suggestion: string | null
          backup_url: string | null
          category: string
          category_id: string | null
          created_at: string
          created_by: string | null
          demo_banner_text: string | null
          description: string | null
          disable_destructive: boolean | null
          disable_exports: boolean | null
          expiry_date: string | null
          health_check_interval: number | null
          health_score: number | null
          id: string
          is_trending: boolean | null
          last_health_check: string | null
          masked_url: string | null
          max_concurrent_logins: number | null
          multi_login_enabled: boolean | null
          renewal_date: string | null
          status: Database["public"]["Enums"]["demo_status"]
          tech_stack: Database["public"]["Enums"]["demo_tech_stack"]
          technology_id: string | null
          title: string
          updated_at: string
          uptime_percentage: number | null
          url: string
          video_fallback_url: string | null
        }
        Insert: {
          ai_category_suggestion?: string | null
          ai_tech_suggestion?: string | null
          backup_url?: string | null
          category: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          demo_banner_text?: string | null
          description?: string | null
          disable_destructive?: boolean | null
          disable_exports?: boolean | null
          expiry_date?: string | null
          health_check_interval?: number | null
          health_score?: number | null
          id?: string
          is_trending?: boolean | null
          last_health_check?: string | null
          masked_url?: string | null
          max_concurrent_logins?: number | null
          multi_login_enabled?: boolean | null
          renewal_date?: string | null
          status?: Database["public"]["Enums"]["demo_status"]
          tech_stack?: Database["public"]["Enums"]["demo_tech_stack"]
          technology_id?: string | null
          title: string
          updated_at?: string
          uptime_percentage?: number | null
          url: string
          video_fallback_url?: string | null
        }
        Update: {
          ai_category_suggestion?: string | null
          ai_tech_suggestion?: string | null
          backup_url?: string | null
          category?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          demo_banner_text?: string | null
          description?: string | null
          disable_destructive?: boolean | null
          disable_exports?: boolean | null
          expiry_date?: string | null
          health_check_interval?: number | null
          health_score?: number | null
          id?: string
          is_trending?: boolean | null
          last_health_check?: string | null
          masked_url?: string | null
          max_concurrent_logins?: number | null
          multi_login_enabled?: boolean | null
          renewal_date?: string | null
          status?: Database["public"]["Enums"]["demo_status"]
          tech_stack?: Database["public"]["Enums"]["demo_tech_stack"]
          technology_id?: string | null
          title?: string
          updated_at?: string
          uptime_percentage?: number | null
          url?: string
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
      promise_logs: {
        Row: {
          acknowledged_at: string | null
          breach_reason: string | null
          created_at: string
          deadline: string
          developer_id: string
          extended_by: string | null
          extended_count: number | null
          extended_deadline: string | null
          finished_time: string | null
          id: string
          promise_time: string
          score_effect: number | null
          status: Database["public"]["Enums"]["promise_status"]
          task_id: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          breach_reason?: string | null
          created_at?: string
          deadline: string
          developer_id: string
          extended_by?: string | null
          extended_count?: number | null
          extended_deadline?: string | null
          finished_time?: string | null
          id?: string
          promise_time?: string
          score_effect?: number | null
          status?: Database["public"]["Enums"]["promise_status"]
          task_id: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          breach_reason?: string | null
          created_at?: string
          deadline?: string
          developer_id?: string
          extended_by?: string | null
          extended_count?: number | null
          extended_deadline?: string | null
          finished_time?: string | null
          id?: string
          promise_time?: string
          score_effect?: number | null
          status?: Database["public"]["Enums"]["promise_status"]
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
      can_access_finance: { Args: { _user_id: string }; Returns: boolean }
      can_manage_demos: { Args: { _user_id: string }; Returns: boolean }
      can_manage_developers: { Args: { _user_id: string }; Returns: boolean }
      can_manage_franchises: { Args: { _user_id: string }; Returns: boolean }
      can_manage_influencers: { Args: { _user_id: string }; Returns: boolean }
      can_manage_leads: { Args: { _user_id: string }; Returns: boolean }
      can_manage_prime_users: { Args: { _user_id: string }; Returns: boolean }
      can_manage_resellers: { Args: { _user_id: string }; Returns: boolean }
      can_view_leads: { Args: { _user_id: string }; Returns: boolean }
      exceeds_workload_threshold: {
        Args: { _developer_id: string }
        Returns: boolean
      }
      get_developer_id: { Args: { _user_id: string }; Returns: string }
      get_franchise_id: { Args: { _user_id: string }; Returns: string }
      get_influencer_id: { Args: { _user_id: string }; Returns: string }
      get_prime_user_id: { Args: { _user_id: string }; Returns: string }
      get_reseller_id: { Args: { _user_id: string }; Returns: string }
      has_overlapping_promise: {
        Args: { _deadline: string; _developer_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_franchise: { Args: { _user_id: string }; Returns: boolean }
      is_influencer: { Args: { _user_id: string }; Returns: boolean }
      is_prime_user: { Args: { _user_id: string }; Returns: boolean }
      is_reseller: { Args: { _user_id: string }; Returns: boolean }
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
        | "influencer"
        | "marketing_manager"
        | "client_success"
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
      promise_status:
        | "assigned"
        | "promised"
        | "in_progress"
        | "breached"
        | "completed"
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
        "influencer",
        "marketing_manager",
        "client_success",
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
      promise_status: [
        "assigned",
        "promised",
        "in_progress",
        "breached",
        "completed",
      ],
    },
  },
} as const
