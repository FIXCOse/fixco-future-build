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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          actor_user: string | null
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          occurred_at: string | null
          organization_id: string | null
          subject_id: string | null
          subject_type: string | null
          summary: string
        }
        Insert: {
          actor_user?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          organization_id?: string | null
          subject_id?: string | null
          subject_type?: string | null
          summary: string
        }
        Update: {
          actor_user?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          organization_id?: string | null
          subject_id?: string | null
          subject_type?: string | null
          summary?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          ai_response: Json
          conversation_type: string
          created_at: string | null
          id: string
          session_id: string
          updated_at: string | null
          user_feedback: Json | null
          user_id: string | null
          user_input: Json
        }
        Insert: {
          ai_response?: Json
          conversation_type: string
          created_at?: string | null
          id?: string
          session_id: string
          updated_at?: string | null
          user_feedback?: Json | null
          user_id?: string | null
          user_input?: Json
        }
        Update: {
          ai_response?: Json
          conversation_type?: string
          created_at?: string | null
          id?: string
          session_id?: string
          updated_at?: string | null
          user_feedback?: Json | null
          user_id?: string | null
          user_input?: Json
        }
        Relationships: []
      }
      ai_learning_patterns: {
        Row: {
          created_at: string | null
          id: string
          input_pattern: Json
          pattern_type: string
          success_rate: number | null
          successful_outputs: Json
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_pattern: Json
          pattern_type: string
          success_rate?: number | null
          successful_outputs?: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input_pattern?: Json
          pattern_type?: string
          success_rate?: number | null
          successful_outputs?: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor: string
          created_at: string | null
          id: number
          meta: Json | null
          target: string | null
        }
        Insert: {
          action: string
          actor: string
          created_at?: string | null
          id?: number
          meta?: Json | null
          target?: string | null
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string | null
          id?: number
          meta?: Json | null
          target?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_fkey"
            columns: ["actor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_actor_fkey"
            columns: ["actor"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_actor_fkey"
            columns: ["actor"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_actor_fkey"
            columns: ["actor"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          customer_id: string | null
          deleted_at: string | null
          file_urls: string[] | null
          id: string
          mode: string | null
          payload: Json | null
          service_slug: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          file_urls?: string[] | null
          id?: string
          mode?: string | null
          payload?: Json | null
          service_slug?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          file_urls?: string[] | null
          id?: string
          mode?: string | null
          payload?: Json | null
          service_slug?: string | null
          status?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          intent_summary: Json | null
          lead_data: Json | null
          messages: Json
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          intent_summary?: Json | null
          lead_data?: Json | null
          messages?: Json
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          intent_summary?: Json | null
          lead_data?: Json | null
          messages?: Json
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          changed_at: string | null
          created_at: string | null
          en_draft_json: Json | null
          en_last_reviewed_at: string | null
          en_live_json: Json | null
          en_path: string
          en_status: string
          id: string
          sv_json: Json
          sv_path: string
          type: string
          updated_at: string | null
          version: number
        }
        Insert: {
          changed_at?: string | null
          created_at?: string | null
          en_draft_json?: Json | null
          en_last_reviewed_at?: string | null
          en_live_json?: Json | null
          en_path: string
          en_status?: string
          id?: string
          sv_json: Json
          sv_path: string
          type: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          changed_at?: string | null
          created_at?: string | null
          en_draft_json?: Json | null
          en_last_reviewed_at?: string | null
          en_live_json?: Json | null
          en_path?: string
          en_status?: string
          id?: string
          sv_json?: Json
          sv_path?: string
          type?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          created_at: string | null
          draft: Json
          id: string
          key: string
          locale: string
          published: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          draft?: Json
          id?: string
          key: string
          locale: string
          published?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          draft?: Json
          id?: string
          key?: string
          locale?: string
          published?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          booking_count: number | null
          brf_name: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          customer_type: Database["public"]["Enums"]["customer_type"] | null
          email: string
          id: string
          last_booking_at: string | null
          name: string
          notes: string | null
          org_number: string | null
          personnummer: string | null
          phone: string | null
          postal_code: string | null
          total_spent: number | null
        }
        Insert: {
          address?: string | null
          booking_count?: number | null
          brf_name?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          email: string
          id?: string
          last_booking_at?: string | null
          name: string
          notes?: string | null
          org_number?: string | null
          personnummer?: string | null
          phone?: string | null
          postal_code?: string | null
          total_spent?: number | null
        }
        Update: {
          address?: string | null
          booking_count?: number | null
          brf_name?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          email?: string
          id?: string
          last_booking_at?: string | null
          name?: string
          notes?: string | null
          org_number?: string | null
          personnummer?: string | null
          phone?: string | null
          postal_code?: string | null
          total_spent?: number | null
        }
        Relationships: []
      }
      dispatch_queue: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          project_id: string | null
          status: string | null
          strategy: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          strategy?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          strategy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_queue_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      edit_locks: {
        Row: {
          expires_at: string
          id: string
          locked_at: string | null
          locked_by: string
          scope: string
        }
        Insert: {
          expires_at: string
          id?: string
          locked_at?: string | null
          locked_by: string
          scope: string
        }
        Update: {
          expires_at?: string
          id?: string
          locked_at?: string | null
          locked_by?: string
          scope?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_logs: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          id: string
          job_id: string
          note: string | null
          receipt_url: string | null
          worker_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          id?: string
          job_id: string
          note?: string | null
          receipt_url?: string | null
          worker_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          id?: string
          job_id?: string
          note?: string | null
          receipt_url?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          enabled: boolean
          key: string
          meta: Json | null
          updated_at: string | null
        }
        Insert: {
          enabled?: boolean
          key: string
          meta?: Json | null
          updated_at?: string | null
        }
        Update: {
          enabled?: boolean
          key?: string
          meta?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          booking_id: string | null
          created_at: string | null
          customer_id: string | null
          discount_amount: number | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          line_items: Json
          organization_id: string | null
          paid_at: string | null
          pdf_url: string | null
          public_token: string | null
          quote_id: string | null
          rot_amount: number | null
          rut_amount: number | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          total_amount: number
          updated_at: string | null
          vat_amount: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          line_items?: Json
          organization_id?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          public_token?: string | null
          quote_id?: string | null
          rot_amount?: number | null
          rut_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          total_amount: number
          updated_at?: string | null
          vat_amount: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          line_items?: Json
          organization_id?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          public_token?: string | null
          quote_id?: string | null
          rot_amount?: number | null
          rut_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_new"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          address: string | null
          admin_notes: string | null
          availability: string | null
          certificates: Json | null
          city: string | null
          company_name: string | null
          created_at: string
          cv_file_path: string | null
          date_of_birth: string
          email: string
          experience_years: number | null
          first_name: string
          gdpr_consent: boolean
          has_company: boolean | null
          has_drivers_license: boolean | null
          has_own_tools: boolean | null
          id: string
          interview_date: string | null
          last_name: string
          linkedin_url: string | null
          marketing_consent: boolean | null
          motivation: string | null
          org_number: string | null
          phone: string
          portfolio_url: string | null
          postal_code: string | null
          preferred_start_date: string | null
          profession: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          skills: Json | null
          status: string | null
          updated_at: string
          work_references: Json | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          availability?: string | null
          certificates?: Json | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          cv_file_path?: string | null
          date_of_birth: string
          email: string
          experience_years?: number | null
          first_name: string
          gdpr_consent?: boolean
          has_company?: boolean | null
          has_drivers_license?: boolean | null
          has_own_tools?: boolean | null
          id?: string
          interview_date?: string | null
          last_name: string
          linkedin_url?: string | null
          marketing_consent?: boolean | null
          motivation?: string | null
          org_number?: string | null
          phone: string
          portfolio_url?: string | null
          postal_code?: string | null
          preferred_start_date?: string | null
          profession: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string
          work_references?: Json | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          availability?: string | null
          certificates?: Json | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          cv_file_path?: string | null
          date_of_birth?: string
          email?: string
          experience_years?: number | null
          first_name?: string
          gdpr_consent?: boolean
          has_company?: boolean | null
          has_drivers_license?: boolean | null
          has_own_tools?: boolean | null
          id?: string
          interview_date?: string | null
          last_name?: string
          linkedin_url?: string | null
          marketing_consent?: boolean | null
          motivation?: string | null
          org_number?: string | null
          phone?: string
          portfolio_url?: string | null
          postal_code?: string | null
          preferred_start_date?: string | null
          profession?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string
          work_references?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      job_events: {
        Row: {
          actor: string | null
          created_at: string
          event: string
          id: string
          job_id: string
          meta: Json
        }
        Insert: {
          actor?: string | null
          created_at?: string
          event: string
          id?: string
          job_id: string
          meta?: Json
        }
        Update: {
          actor?: string | null
          created_at?: string
          event?: string
          id?: string
          job_id?: string
          meta?: Json
        }
        Relationships: [
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_locks: {
        Row: {
          id: string
          job_id: string
          locked_at: string | null
          locked_by: string
          reason: string | null
        }
        Insert: {
          id?: string
          job_id: string
          locked_at?: string | null
          locked_by: string
          reason?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          locked_at?: string | null
          locked_by?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_locks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_locks_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_locks_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_locks_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_locks_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      job_photos: {
        Row: {
          caption: string | null
          created_at: string
          file_path: string
          id: string
          job_id: string
          worker_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          file_path: string
          id?: string
          job_id: string
          worker_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          file_path?: string
          id?: string
          job_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_photos_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_requests: {
        Row: {
          deleted_at: string | null
          expires_at: string | null
          id: string
          job_id: string
          message: string | null
          requested_at: string
          requested_by: string
          responded_at: string | null
          response_message: string | null
          status: string
          worker_id: string
        }
        Insert: {
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          job_id: string
          message?: string | null
          requested_at?: string
          requested_by: string
          responded_at?: string | null
          response_message?: string | null
          status?: string
          worker_id: string
        }
        Update: {
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          job_id?: string
          message?: string | null
          requested_at?: string
          requested_by?: string
          responded_at?: string | null
          response_message?: string | null
          status?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_requests_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requests_staff_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      job_schedule_notifications: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          read: boolean | null
          scheduled_at: string
          scheduled_by: string
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          read?: boolean | null
          scheduled_at: string
          scheduled_by: string
          worker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          read?: boolean | null
          scheduled_at?: string
          scheduled_by?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_schedule_notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_scheduled_by_fkey"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_scheduled_by_fkey"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_scheduled_by_fkey"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_scheduled_by_fkey"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_schedule_notifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      job_signatures: {
        Row: {
          file_path: string
          id: string
          job_id: string
          role: string
          signed_at: string
          signed_by_name: string
        }
        Insert: {
          file_path: string
          id?: string
          job_id: string
          role: string
          signed_at?: string
          signed_by_name: string
        }
        Update: {
          file_path?: string
          id?: string
          job_id?: string
          role?: string
          signed_at?: string
          signed_by_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_signatures_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_workers: {
        Row: {
          assigned_at: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          is_lead: boolean | null
          job_id: string
          started_at: string | null
          status: string | null
          worker_id: string
        }
        Insert: {
          assigned_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_lead?: boolean | null
          job_id: string
          started_at?: string | null
          status?: string | null
          worker_id: string
        }
        Update: {
          assigned_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_lead?: boolean | null
          job_id?: string
          started_at?: string | null
          status?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_workers_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          address: string | null
          admin_set_price: number | null
          assigned_at: string | null
          assigned_worker_id: string | null
          bonus_amount: number | null
          city: string | null
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          fixed_price: number | null
          hourly_rate: number | null
          id: string
          pool_enabled: boolean
          postal_code: string | null
          pricing_mode: string
          property_id: string | null
          rot_rut: Json
          service_id: string | null
          source_id: string
          source_type: string
          start_scheduled_at: string | null
          status: string
          title: string | null
        }
        Insert: {
          address?: string | null
          admin_set_price?: number | null
          assigned_at?: string | null
          assigned_worker_id?: string | null
          bonus_amount?: number | null
          city?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          pool_enabled?: boolean
          postal_code?: string | null
          pricing_mode: string
          property_id?: string | null
          rot_rut?: Json
          service_id?: string | null
          source_id: string
          source_type: string
          start_scheduled_at?: string | null
          status?: string
          title?: string | null
        }
        Update: {
          address?: string | null
          admin_set_price?: number | null
          assigned_at?: string | null
          assigned_worker_id?: string | null
          bonus_amount?: number | null
          city?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          pool_enabled?: boolean
          postal_code?: string | null
          pricing_mode?: string
          property_id?: string | null
          rot_rut?: Json
          service_id?: string | null
          source_id?: string
          source_type?: string
          start_scheduled_at?: string | null
          status?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          estimated_quote: Json | null
          id: string
          images: Json | null
          message: string | null
          name: string | null
          phone: string | null
          postal_code: string | null
          service_interest: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          estimated_quote?: Json | null
          id?: string
          images?: Json | null
          message?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          estimated_quote?: Json | null
          id?: string
          images?: Json | null
          message?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          invoice_id: string | null
          points_change: number
          reason: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          points_change: number
          reason: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          points_change?: number
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      material_logs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          name: string
          qty: number
          sku: string | null
          supplier: string | null
          unit_price: number | null
          worker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          name: string
          qty?: number
          sku?: string | null
          supplier?: string | null
          unit_price?: number | null
          worker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          name?: string
          qty?: number
          sku?: string | null
          supplier?: string | null
          unit_price?: number | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_en: string | null
          alt_sv: string | null
          bucket: string
          created_at: string | null
          created_by: string | null
          height: number | null
          id: string
          path: string
          width: number | null
        }
        Insert: {
          alt_en?: string | null
          alt_sv?: string | null
          bucket: string
          created_at?: string | null
          created_by?: string | null
          height?: number | null
          id?: string
          path: string
          width?: number | null
        }
        Update: {
          alt_en?: string | null
          alt_sv?: string | null
          bucket?: string
          created_at?: string | null
          created_by?: string | null
          height?: number | null
          id?: string
          path?: string
          width?: number | null
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          joined_at: string | null
          organization_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          organization_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          contract_discount: number | null
          contract_terms: Json | null
          created_at: string | null
          id: string
          name: string
          org_no: string | null
          org_number: string | null
          postal_code: string | null
          type: Database["public"]["Enums"]["user_type"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contract_discount?: number | null
          contract_terms?: Json | null
          created_at?: string | null
          id?: string
          name: string
          org_no?: string | null
          org_number?: string | null
          postal_code?: string | null
          type: Database["public"]["Enums"]["user_type"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contract_discount?: number | null
          contract_terms?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          org_no?: string | null
          org_number?: string | null
          postal_code?: string | null
          type?: Database["public"]["Enums"]["user_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      payroll_entries: {
        Row: {
          created_at: string | null
          deductions: number | null
          gross_salary: number
          hourly_rate: number
          id: string
          jobs_count: number | null
          net_salary: number
          notes: string | null
          period_id: string | null
          staff_id: string | null
          total_hours: number
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          deductions?: number | null
          gross_salary: number
          hourly_rate: number
          id?: string
          jobs_count?: number | null
          net_salary: number
          notes?: string | null
          period_id?: string | null
          staff_id?: string | null
          total_hours?: number
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          deductions?: number | null
          gross_salary?: number
          hourly_rate?: number
          id?: string
          jobs_count?: number | null
          net_salary?: number
          notes?: string | null
          period_id?: string | null
          staff_id?: string | null
          total_hours?: number
          updated_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          created_at: string | null
          id: string
          locked_at: string | null
          locked_by: string | null
          notes: string | null
          paid_at: string | null
          period_end: string
          period_start: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          notes?: string | null
          paid_at?: string | null
          period_end: string
          period_start: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          notes?: string | null
          paid_at?: string | null
          period_end?: string
          period_start?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_periods_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      product_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          product_id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          product_id: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          product_id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_interactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "smart_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line: string | null
          avatar_url: string | null
          brf_name: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          language: string | null
          last_name: string | null
          loyalty_points: number | null
          loyalty_tier: Database["public"]["Enums"]["loyalty_tier"] | null
          marketing_consent: boolean | null
          org_number: string | null
          owner_onboarded: boolean | null
          owner_welcome_at: string | null
          phone: string | null
          postal_code: string | null
          total_spent: number | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          address_line?: string | null
          avatar_url?: string | null
          brf_name?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          last_name?: string | null
          loyalty_points?: number | null
          loyalty_tier?: Database["public"]["Enums"]["loyalty_tier"] | null
          marketing_consent?: boolean | null
          org_number?: string | null
          owner_onboarded?: boolean | null
          owner_welcome_at?: string | null
          phone?: string | null
          postal_code?: string | null
          total_spent?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          address_line?: string | null
          avatar_url?: string | null
          brf_name?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          loyalty_points?: number | null
          loyalty_tier?: Database["public"]["Enums"]["loyalty_tier"] | null
          marketing_consent?: boolean | null
          org_number?: string | null
          owner_onboarded?: boolean | null
          owner_welcome_at?: string | null
          phone?: string | null
          postal_code?: string | null
          total_spent?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          customer_id: string | null
          deleted_at: string | null
          id: string
          quote_id: string | null
          start_date: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          id?: string
          quote_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          id?: string
          quote_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_new"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          city: string
          created_at: string | null
          description: string | null
          id: string
          is_primary: boolean
          name: string
          notes: string | null
          organization_id: string | null
          owner_id: string | null
          photos: string[] | null
          postal_code: string
          tags: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_primary?: boolean
          name: string
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          photos?: string[] | null
          postal_code: string
          tags?: string[] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          photos?: string[] | null
          postal_code?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_messages: {
        Row: {
          author: string
          created_at: string | null
          files: string[] | null
          id: string
          message: string
          quote_id: string
        }
        Insert: {
          author: string
          created_at?: string | null
          files?: string[] | null
          id?: string
          message: string
          quote_id: string
        }
        Update: {
          author?: string
          created_at?: string | null
          files?: string[] | null
          id?: string
          message?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_messages_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_new"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_questions: {
        Row: {
          answer: string | null
          answered: boolean | null
          answered_at: string | null
          asked_at: string
          customer_email: string | null
          customer_name: string
          id: string
          question: string
          quote_id: string
        }
        Insert: {
          answer?: string | null
          answered?: boolean | null
          answered_at?: string | null
          asked_at?: string
          customer_email?: string | null
          customer_name: string
          id?: string
          question: string
          quote_id: string
        }
        Update: {
          answer?: string | null
          answered?: boolean | null
          answered_at?: string | null
          asked_at?: string
          customer_email?: string | null
          customer_name?: string
          id?: string
          question?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_questions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_new"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_rejections: {
        Row: {
          customer_email: string | null
          customer_name: string | null
          id: string
          quote_id: string
          reason: string
          reason_text: string | null
          rejected_at: string
        }
        Insert: {
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          quote_id: string
          reason: string
          reason_text?: string | null
          rejected_at?: string
        }
        Update: {
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          quote_id?: string
          reason?: string
          reason_text?: string | null
          rejected_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_rejections_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_new"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_reminders: {
        Row: {
          created_at: string
          customer_email: string
          id: string
          quote_id: string
          remind_at: string
          sent: boolean | null
          sent_at: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          id?: string
          quote_id: string
          remind_at: string
          sent?: boolean | null
          sent_at?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          id?: string
          quote_id?: string
          remind_at?: string
          sent?: boolean | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_reminders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_new"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          created_by: string | null
          customer_address: string | null
          customer_city: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          customer_postal_code: string | null
          deleted_at: string | null
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          line_items: Json
          organization_id: string | null
          project_completed_at: string | null
          project_images: Json | null
          project_notes: string | null
          project_started_at: string | null
          project_status: string | null
          property_id: string | null
          publish_as_reference: boolean | null
          quote_number: string
          reference_data: Json | null
          rot_amount: number | null
          rut_amount: number | null
          source_booking_id: string | null
          source_quote_request_id: string | null
          status: Database["public"]["Enums"]["quote_status"] | null
          subtotal: number
          title: string
          total_amount: number
          updated_at: string | null
          valid_until: string | null
          vat_amount: number
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          line_items?: Json
          organization_id?: string | null
          project_completed_at?: string | null
          project_images?: Json | null
          project_notes?: string | null
          project_started_at?: string | null
          project_status?: string | null
          property_id?: string | null
          publish_as_reference?: boolean | null
          quote_number: string
          reference_data?: Json | null
          rot_amount?: number | null
          rut_amount?: number | null
          source_booking_id?: string | null
          source_quote_request_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          subtotal: number
          title: string
          total_amount: number
          updated_at?: string | null
          valid_until?: string | null
          vat_amount: number
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          line_items?: Json
          organization_id?: string | null
          project_completed_at?: string | null
          project_images?: Json | null
          project_notes?: string | null
          project_started_at?: string | null
          project_status?: string | null
          property_id?: string | null
          publish_as_reference?: boolean | null
          quote_number?: string
          reference_data?: Json | null
          rot_amount?: number | null
          rut_amount?: number | null
          source_booking_id?: string | null
          source_quote_request_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          subtotal?: number
          title?: string
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes_new: {
        Row: {
          accepted_at: string | null
          change_req_at: string | null
          created_at: string | null
          customer_id: string | null
          declined_at: string | null
          deleted_at: string | null
          discount_amount_sek: number | null
          discount_type: string | null
          discount_value: number | null
          id: string
          items: Json | null
          number: string
          pdf_url: string | null
          public_token: string
          request_id: string | null
          rot_deduction_sek: number | null
          rot_percentage: number | null
          rut_percentage: number | null
          sent_at: string | null
          signature_date: string | null
          signature_name: string | null
          status: string | null
          subtotal_mat_sek: number | null
          subtotal_work_sek: number | null
          terms_accepted: boolean | null
          title: string
          total_sek: number
          valid_until: string | null
          vat_sek: number | null
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          change_req_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          declined_at?: string | null
          deleted_at?: string | null
          discount_amount_sek?: number | null
          discount_type?: string | null
          discount_value?: number | null
          id?: string
          items?: Json | null
          number: string
          pdf_url?: string | null
          public_token: string
          request_id?: string | null
          rot_deduction_sek?: number | null
          rot_percentage?: number | null
          rut_percentage?: number | null
          sent_at?: string | null
          signature_date?: string | null
          signature_name?: string | null
          status?: string | null
          subtotal_mat_sek?: number | null
          subtotal_work_sek?: number | null
          terms_accepted?: boolean | null
          title: string
          total_sek: number
          valid_until?: string | null
          vat_sek?: number | null
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          change_req_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          declined_at?: string | null
          deleted_at?: string | null
          discount_amount_sek?: number | null
          discount_type?: string | null
          discount_value?: number | null
          id?: string
          items?: Json | null
          number?: string
          pdf_url?: string | null
          public_token?: string
          request_id?: string | null
          rot_deduction_sek?: number | null
          rot_percentage?: number | null
          rut_percentage?: number | null
          sent_at?: string | null
          signature_date?: string | null
          signature_name?: string | null
          status?: string | null
          subtotal_mat_sek?: number | null
          subtotal_work_sek?: number | null
          terms_accepted?: boolean | null
          title?: string
          total_sek?: number
          valid_until?: string | null
          vat_sek?: number | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_new_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_projects: {
        Row: {
          category: string
          category_en: string | null
          category_sv: string
          client_initials: string
          completed_date: string
          created_at: string | null
          created_by: string | null
          description: string
          description_en: string | null
          description_sv: string
          duration: string
          features: string[] | null
          features_en: string[] | null
          features_sv: string[]
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string
          location_en: string | null
          location_sv: string
          price_amount: number
          rating: number
          rot_saving_amount: number
          rut_saving_amount: number
          sort_order: number | null
          thumbnail_image: string | null
          title: string
          title_en: string | null
          title_sv: string
          updated_at: string | null
        }
        Insert: {
          category: string
          category_en?: string | null
          category_sv: string
          client_initials: string
          completed_date: string
          created_at?: string | null
          created_by?: string | null
          description: string
          description_en?: string | null
          description_sv: string
          duration: string
          features?: string[] | null
          features_en?: string[] | null
          features_sv?: string[]
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location: string
          location_en?: string | null
          location_sv: string
          price_amount: number
          rating?: number
          rot_saving_amount?: number
          rut_saving_amount?: number
          sort_order?: number | null
          thumbnail_image?: string | null
          title: string
          title_en?: string | null
          title_sv: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          category_en?: string | null
          category_sv?: string
          client_initials?: string
          completed_date?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          description_en?: string | null
          description_sv?: string
          duration?: string
          features?: string[] | null
          features_en?: string[] | null
          features_sv?: string[]
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string
          location_en?: string | null
          location_sv?: string
          price_amount?: number
          rating?: number
          rot_saving_amount?: number
          rut_saving_amount?: number
          sort_order?: number | null
          thumbnail_image?: string | null
          title?: string
          title_en?: string | null
          title_sv?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_skills: {
        Row: {
          created_at: string
          id: string
          required: boolean
          service_id: string
          skill_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          required?: boolean
          service_id: string
          skill_id: string
        }
        Update: {
          created_at?: string
          id?: string
          required?: boolean
          service_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      service_translations: {
        Row: {
          description: string
          locale: string
          name: string
          service_id: string
          updated_at: string | null
        }
        Insert: {
          description: string
          locale: string
          name: string
          service_id: string
          updated_at?: string | null
        }
        Update: {
          description?: string
          locale?: string
          name?: string
          service_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_versions: {
        Row: {
          edited_at: string | null
          edited_by: string | null
          id: number
          service_id: string
          snapshot: Json
        }
        Insert: {
          edited_at?: string | null
          edited_by?: string | null
          id?: never
          service_id: string
          snapshot: Json
        }
        Update: {
          edited_at?: string | null
          edited_by?: string | null
          id?: never
          service_id?: string
          snapshot?: Json
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          category: string
          created_at: string
          created_by: string | null
          description_en: string | null
          description_sv: string
          id: string
          is_active: boolean
          location: string
          price_type: string
          price_unit: string
          rot_eligible: boolean
          rut_eligible: boolean
          sort_order: number | null
          sub_category: string | null
          title_en: string | null
          title_sv: string
          translation_status: string
          updated_at: string
        }
        Insert: {
          base_price: number
          category: string
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_sv: string
          id: string
          is_active?: boolean
          location?: string
          price_type?: string
          price_unit?: string
          rot_eligible?: boolean
          rut_eligible?: boolean
          sort_order?: number | null
          sub_category?: string | null
          title_en?: string | null
          title_sv: string
          translation_status?: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_sv?: string
          id?: string
          is_active?: boolean
          location?: string
          price_type?: string
          price_unit?: string
          rot_eligible?: boolean
          rut_eligible?: boolean
          sort_order?: number | null
          sub_category?: string | null
          title_en?: string | null
          title_sv?: string
          translation_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          locale: string | null
          styles: Json | null
          updated_at: string
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          locale?: string | null
          styles?: Json | null
          updated_at?: string
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          locale?: string | null
          styles?: Json | null
          updated_at?: string
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      sitemap_pings: {
        Row: {
          id: string
          pinged_at: string
          pinged_by: string | null
          response_code: number | null
          response_message: string | null
          sitemap_url: string
          status: string
        }
        Insert: {
          id?: string
          pinged_at?: string
          pinged_by?: string | null
          response_code?: number | null
          response_message?: string | null
          sitemap_url?: string
          status: string
        }
        Update: {
          id?: string
          pinged_at?: string
          pinged_by?: string | null
          response_code?: number | null
          response_message?: string | null
          sitemap_url?: string
          status?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      smart_products: {
        Row: {
          ai_features: Json | null
          average_rating: number | null
          brand: string
          category: string
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          image_url: string | null
          installation_difficulty: string | null
          installation_included: Json | null
          installation_price: number
          installation_time: string | null
          is_active: boolean | null
          model: string
          name: string
          popularity_score: number | null
          product_price: number
          purchase_count: number | null
          total_price: number | null
          total_reviews: number | null
          updated_at: string | null
          value_rating: number | null
          view_count: number | null
          warranty_years: number | null
        }
        Insert: {
          ai_features?: Json | null
          average_rating?: number | null
          brand: string
          category: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          installation_difficulty?: string | null
          installation_included?: Json | null
          installation_price?: number
          installation_time?: string | null
          is_active?: boolean | null
          model: string
          name: string
          popularity_score?: number | null
          product_price: number
          purchase_count?: number | null
          total_price?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          value_rating?: number | null
          view_count?: number | null
          warranty_years?: number | null
        }
        Update: {
          ai_features?: Json | null
          average_rating?: number | null
          brand?: string
          category?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          installation_difficulty?: string | null
          installation_included?: Json | null
          installation_price?: number
          installation_time?: string | null
          is_active?: boolean | null
          model?: string
          name?: string
          popularity_score?: number | null
          product_price?: number
          purchase_count?: number | null
          total_price?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          value_rating?: number | null
          view_count?: number | null
          warranty_years?: number | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          hourly_rate: number | null
          id: string
          invitation_accepted_at: string | null
          invitation_sent_at: string | null
          invited_by: string | null
          name: string
          phone: string | null
          postal_code: string | null
          role: string
          skills: string[] | null
          staff_id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          hourly_rate?: number | null
          id?: string
          invitation_accepted_at?: string | null
          invitation_sent_at?: string | null
          invited_by?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          role: string
          skills?: string[] | null
          staff_id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          hourly_rate?: number | null
          id?: string
          invitation_accepted_at?: string | null
          invitation_sent_at?: string | null
          invited_by?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          role?: string
          skills?: string[] | null
          staff_id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      staff_skills: {
        Row: {
          certified_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          level: number | null
          skill_id: string
          staff_id: string
        }
        Insert: {
          certified_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          level?: number | null
          skill_id: string
          staff_id: string
        }
        Update: {
          certified_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          level?: number | null
          skill_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_skills_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      time_logs: {
        Row: {
          break_min: number
          created_at: string
          ended_at: string | null
          hours: number | null
          id: string
          job_id: string
          manual_hours: number | null
          note: string | null
          started_at: string | null
          worker_id: string
        }
        Insert: {
          break_min?: number
          created_at?: string
          ended_at?: string | null
          hours?: number | null
          id?: string
          job_id: string
          manual_hours?: number | null
          note?: string | null
          started_at?: string | null
          worker_id: string
        }
        Update: {
          break_min?: number
          created_at?: string
          ended_at?: string | null
          hours?: number | null
          id?: string
          job_id?: string
          manual_hours?: number | null
          note?: string | null
          started_at?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_jobs: {
        Row: {
          created_at: string | null
          entity_id: string
          id: number
          kind: string
          last_error: string | null
          locale: string
          payload: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          id?: number
          kind: string
          last_error?: string | null
          locale?: string
          payload: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          id?: number
          kind?: string
          last_error?: string | null
          locale?: string
          payload?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      translation_keys: {
        Row: {
          checksum: string
          created_at: string | null
          default_text: string
          id: string
          is_locked: boolean
          key: string
          namespace: string
          updated_at: string | null
        }
        Insert: {
          checksum: string
          created_at?: string | null
          default_text: string
          id?: string
          is_locked?: boolean
          key: string
          namespace: string
          updated_at?: string | null
        }
        Update: {
          checksum?: string
          created_at?: string | null
          default_text?: string
          id?: string
          is_locked?: boolean
          key?: string
          namespace?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      translation_locales: {
        Row: {
          key_id: string
          locale: string
          status: string
          text: string
          updated_at: string | null
        }
        Insert: {
          key_id: string
          locale: string
          status?: string
          text: string
          updated_at?: string | null
        }
        Update: {
          key_id?: string
          locale?: string
          status?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translation_locales_key_id_fkey"
            columns: ["key_id"]
            isOneToOne: false
            referencedRelation: "translation_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      voucher_usage: {
        Row: {
          booking_id: string | null
          discount_applied: number
          id: string
          quote_id: string | null
          used_at: string | null
          user_id: string
          voucher_id: string
        }
        Insert: {
          booking_id?: string | null
          discount_applied: number
          id?: string
          quote_id?: string | null
          used_at?: string | null
          user_id: string
          voucher_id: string
        }
        Update: {
          booking_id?: string | null
          discount_applied?: number
          id?: string
          quote_id?: string | null
          used_at?: string | null
          user_id?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_usage_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_usage_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          target_organization_id: string | null
          target_service_categories: string[] | null
          target_user_type: Database["public"]["Enums"]["user_type"] | null
          title: string
          updated_at: string | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          target_organization_id?: string | null
          target_service_categories?: string[] | null
          target_user_type?: Database["public"]["Enums"]["user_type"] | null
          title: string
          updated_at?: string | null
          valid_from?: string
          valid_until: string
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          target_organization_id?: string | null
          target_service_categories?: string[] | null
          target_user_type?: Database["public"]["Enums"]["user_type"] | null
          title?: string
          updated_at?: string | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_target_organization_id_fkey"
            columns: ["target_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          booking_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          staff_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          staff_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          staff_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          job_id: string
          worker_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          job_id: string
          worker_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          job_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_daily_stats: {
        Row: {
          created_at: string | null
          date: string
          id: string
          jobs_completed: number | null
          total_earnings: number | null
          total_hours: number | null
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          jobs_completed?: number | null
          total_earnings?: number | null
          total_hours?: number | null
          worker_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          jobs_completed?: number | null
          total_earnings?: number | null
          total_hours?: number | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_daily_stats_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_daily_stats_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_detailed_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_daily_stats_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_performance_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_daily_stats_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_statistics"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_profiles: {
        Row: {
          active: boolean
          created_at: string
          name: string
          phone: string | null
          regions: string[] | null
          skills: string[] | null
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          name: string
          phone?: string | null
          regions?: string[] | null
          skills?: string[] | null
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          name?: string
          phone?: string | null
          regions?: string[] | null
          skills?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      workers: {
        Row: {
          active: boolean | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          region: string | null
          skills: Json | null
        }
        Insert: {
          active?: boolean | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          region?: string | null
          skills?: Json | null
        }
        Update: {
          active?: boolean | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          region?: string | null
          skills?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      job_worker_hours: {
        Row: {
          assigned_at: string | null
          completed_at: string | null
          is_lead: boolean | null
          job_id: string | null
          started_at: string | null
          status: string | null
          time_entries: number | null
          total_hours: number | null
          worker_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_workers_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_detailed_statistics: {
        Row: {
          avatar_url: string | null
          avg_job_hours: number | null
          completed_jobs: number | null
          completion_rate_percent: number | null
          current_streak_days: number | null
          earnings_last_30_days: number | null
          email: string | null
          fastest_job_hours: number | null
          first_name: string | null
          id: string | null
          jobs_friday: number | null
          jobs_last_30_days: number | null
          jobs_last_7_days: number | null
          jobs_monday: number | null
          jobs_saturday: number | null
          jobs_sunday: number | null
          jobs_thursday: number | null
          jobs_tuesday: number | null
          jobs_wednesday: number | null
          last_job_at: string | null
          last_name: string | null
          longest_job_hours: number | null
          overtime_jobs: number | null
          top_services: Json | null
          total_jobs: number | null
        }
        Relationships: []
      }
      worker_performance_stats: {
        Row: {
          avg_time_held_minutes: number | null
          completion_rate: number | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          return_reasons: string[] | null
          total_claimed: number | null
          total_completed: number | null
          total_returned: number | null
        }
        Relationships: []
      }
      worker_statistics: {
        Row: {
          avg_job_duration_hours: number | null
          completed_jobs: number | null
          email: string | null
          first_name: string | null
          id: string | null
          jobs_last_30_days: number | null
          last_name: string | null
          total_jobs: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_get_bookings: {
        Args: never
        Returns: {
          created_at: string
          customer_id: string
          deleted_at: string
          file_urls: string[]
          id: string
          mode: string
          payload: Json
          service_slug: string
          status: string
          updated_at: string
        }[]
      }
      admin_get_job_requests: {
        Args: { p_search_term?: string; p_status_filter?: string }
        Returns: {
          deleted_at: string
          expires_at: string
          id: string
          job_data: Json
          job_id: string
          message: string
          requested_at: string
          responded_at: string
          response_message: string
          staff_data: Json
          staff_id: string
          status: string
        }[]
      }
      assign_job_to_worker: {
        Args: { p_job_id: string; p_worker_id: string }
        Returns: boolean
      }
      check_user_is_worker: { Args: never; Returns: boolean }
      claim_job: { Args: { p_job_id: string }; Returns: Json }
      cleanup_old_deleted_quotes: { Args: never; Returns: undefined }
      cleanup_old_deleted_records: { Args: never; Returns: undefined }
      complete_job: { Args: { p_job_id: string }; Returns: boolean }
      create_booking_secure: { Args: { p: Json }; Returns: string }
      create_draft_quote_for_booking: {
        Args: { booking_id: string }
        Returns: string
      }
      create_expense_entry: { Args: { p: Json }; Returns: string }
      create_job_from_booking: {
        Args: { p_booking_id: string }
        Returns: string
      }
      create_job_from_quote: { Args: { p_quote_id: string }; Returns: string }
      create_job_from_quote_new: {
        Args: { p_quote_id: string }
        Returns: string
      }
      create_material_entry: { Args: { p: Json }; Returns: string }
      create_quote_request_secure: { Args: { p: Json }; Returns: string }
      create_time_entry: { Args: { p: Json }; Returns: string }
      debug_auth_context: { Args: never; Returns: Json }
      empty_bookings_trash: { Args: never; Returns: number }
      empty_job_requests_trash: { Args: never; Returns: number }
      empty_jobs_trash: { Args: never; Returns: number }
      empty_projects_trash: { Args: never; Returns: number }
      empty_quote_requests_trash: { Args: never; Returns: number }
      empty_quotes_new_trash: { Args: never; Returns: number }
      empty_quotes_trash: { Args: never; Returns: number }
      generate_invoice_number: { Args: never; Returns: string }
      generate_public_token: { Args: never; Returns: string }
      generate_quote_number: { Args: never; Returns: string }
      generate_quote_number_new: { Args: never; Returns: string }
      get_invoice_statistics: { Args: never; Returns: Json }
      get_next_staff_id: { Args: never; Returns: number }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_admin: { Args: { user_uuid?: string }; Returns: boolean }
      is_admin_or_owner: { Args: { user_uuid?: string }; Returns: boolean }
      is_organization_admin: {
        Args: { org_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_organization_member: {
        Args: { org_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_owner: { Args: { user_uuid?: string }; Returns: boolean }
      is_worker:
        | { Args: { user_uuid?: string }; Returns: boolean }
        | { Args: never; Returns: boolean }
      kpi_today: { Args: never; Returns: Json }
      log_activity: {
        Args: {
          p_event_type: string
          p_metadata?: Json
          p_subject_id?: string
          p_subject_type?: string
          p_summary: string
        }
        Returns: undefined
      }
      log_admin_action: {
        Args: { p_action: string; p_meta?: Json; p_target?: string }
        Returns: undefined
      }
      make_property_primary: {
        Args: { p_property_id: string }
        Returns: undefined
      }
      organization_has_members: { Args: { org_uuid: string }; Returns: boolean }
      permanently_delete_booking: {
        Args: { p_booking_id: string }
        Returns: boolean
      }
      permanently_delete_job: { Args: { p_job_id: string }; Returns: boolean }
      permanently_delete_job_request: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      permanently_delete_project: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      permanently_delete_quote: {
        Args: { p_quote_id: string }
        Returns: boolean
      }
      permanently_delete_quote_new: {
        Args: { p_quote_id: string }
        Returns: boolean
      }
      permanently_delete_quote_request: {
        Args: { p_quote_request_id: string }
        Returns: boolean
      }
      prepare_invoice_from_job: { Args: { p_job_id: string }; Returns: Json }
      refresh_worker_detailed_stats: { Args: never; Returns: undefined }
      refresh_worker_stats: { Args: never; Returns: undefined }
      reorder_services: { Args: { _service_updates: Json }; Returns: undefined }
      restore_booking: { Args: { p_booking_id: string }; Returns: boolean }
      restore_job: { Args: { p_job_id: string }; Returns: boolean }
      restore_job_request: { Args: { p_request_id: string }; Returns: boolean }
      restore_project: { Args: { p_project_id: string }; Returns: boolean }
      restore_quote: { Args: { p_quote_id: string }; Returns: boolean }
      restore_quote_new: { Args: { p_quote_id: string }; Returns: boolean }
      restore_quote_request: {
        Args: { p_quote_request_id: string }
        Returns: boolean
      }
      return_job_to_pool: {
        Args: { p_job_id: string; p_reason?: string; p_reason_text?: string }
        Returns: boolean
      }
      rpc_acquire_lock: { Args: { p_scope: string }; Returns: boolean }
      rpc_batch_publish_content: { Args: { p_items: Json }; Returns: number }
      rpc_publish_content_block: {
        Args: { p_key: string; p_locale: string }
        Returns: boolean
      }
      rpc_release_lock: { Args: { p_scope: string }; Returns: boolean }
      rpc_update_service_partial: {
        Args: { p_id: string; p_patch: Json }
        Returns: boolean
      }
      track_product_view: { Args: { p_product_id: string }; Returns: undefined }
      translate_service_to_english: {
        Args: { service_id: string }
        Returns: boolean
      }
      update_job_schedule: {
        Args: { p_end_time: string; p_job_id: string; p_start_time: string }
        Returns: boolean
      }
      update_job_status: {
        Args: { p_job_id: string; p_status: string }
        Returns: boolean
      }
      update_worker_daily_stats: { Args: never; Returns: undefined }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "new"
        | "in_review"
        | "quoted"
        | "scheduled"
        | "done"
        | "canceled"
      customer_type: "private" | "company" | "brf"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      loyalty_tier: "bronze" | "silver" | "gold" | "platinum"
      property_type:
        | "villa"
        | "lägenhet"
        | "kontor"
        | "lokal"
        | "fastighet"
        | "Villa"
        | "Lägenhet"
        | "Radhus"
        | "BRF"
        | "Företagslokal"
        | "Butik"
        | "Kontor"
        | "Lager"
        | "Sommarstuga"
        | "Övrigt"
      quote_status: "draft" | "sent" | "accepted" | "rejected" | "expired"
      user_role: "customer" | "worker" | "admin" | "owner"
      user_type: "private" | "company" | "brf"
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
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "new",
        "in_review",
        "quoted",
        "scheduled",
        "done",
        "canceled",
      ],
      customer_type: ["private", "company", "brf"],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      loyalty_tier: ["bronze", "silver", "gold", "platinum"],
      property_type: [
        "villa",
        "lägenhet",
        "kontor",
        "lokal",
        "fastighet",
        "Villa",
        "Lägenhet",
        "Radhus",
        "BRF",
        "Företagslokal",
        "Butik",
        "Kontor",
        "Lager",
        "Sommarstuga",
        "Övrigt",
      ],
      quote_status: ["draft", "sent", "accepted", "rejected", "expired"],
      user_role: ["customer", "worker", "admin", "owner"],
      user_type: ["private", "company", "brf"],
    },
  },
} as const
