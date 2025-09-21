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
        Relationships: []
      }
      bookings: {
        Row: {
          address: string | null
          attachments: string[] | null
          base_price: number
          city: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          created_by_type: string | null
          customer_id: string | null
          description: string | null
          discount_percent: number | null
          email: string | null
          final_price: number
          hourly_rate: number | null
          hours_estimated: number | null
          id: string
          internal_notes: string | null
          labor_share: number | null
          materials: number | null
          name: string | null
          organization_id: string | null
          phone: string | null
          photos: string[] | null
          postal_code: string | null
          price_type: string | null
          property_id: string | null
          rot_eligible: boolean | null
          rot_rut_type: string | null
          rut_eligible: boolean | null
          scheduled_date: string | null
          scheduled_time_end: string | null
          scheduled_time_start: string | null
          service_id: string
          service_name: string
          service_variant: string | null
          source: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          technician_id: string | null
          updated_at: string | null
          vat_percent: number | null
        }
        Insert: {
          address?: string | null
          attachments?: string[] | null
          base_price: number
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_type?: string | null
          customer_id?: string | null
          description?: string | null
          discount_percent?: number | null
          email?: string | null
          final_price: number
          hourly_rate?: number | null
          hours_estimated?: number | null
          id?: string
          internal_notes?: string | null
          labor_share?: number | null
          materials?: number | null
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          photos?: string[] | null
          postal_code?: string | null
          price_type?: string | null
          property_id?: string | null
          rot_eligible?: boolean | null
          rot_rut_type?: string | null
          rut_eligible?: boolean | null
          scheduled_date?: string | null
          scheduled_time_end?: string | null
          scheduled_time_start?: string | null
          service_id: string
          service_name: string
          service_variant?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          technician_id?: string | null
          updated_at?: string | null
          vat_percent?: number | null
        }
        Update: {
          address?: string | null
          attachments?: string[] | null
          base_price?: number
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_type?: string | null
          customer_id?: string | null
          description?: string | null
          discount_percent?: number | null
          email?: string | null
          final_price?: number
          hourly_rate?: number | null
          hours_estimated?: number | null
          id?: string
          internal_notes?: string | null
          labor_share?: number | null
          materials?: number | null
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          photos?: string[] | null
          postal_code?: string | null
          price_type?: string | null
          property_id?: string | null
          rot_eligible?: boolean | null
          rot_rut_type?: string | null
          rut_eligible?: boolean | null
          scheduled_date?: string | null
          scheduled_time_end?: string | null
          scheduled_time_start?: string | null
          service_id?: string
          service_name?: string
          service_variant?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          technician_id?: string | null
          updated_at?: string | null
          vat_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        ]
      }
      events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
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
      i18n_resources: {
        Row: {
          id: number
          key: string
          locale: string
          ns: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          id?: number
          key: string
          locale: string
          ns: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          id?: number
          key?: string
          locale?: string
          ns?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          booking_id: string | null
          created_at: string | null
          customer_id: string
          discount_amount: number | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          line_items: Json
          organization_id: string | null
          paid_at: string | null
          pdf_url: string | null
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
          customer_id: string
          discount_amount?: number | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          line_items?: Json
          organization_id?: string | null
          paid_at?: string | null
          pdf_url?: string | null
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
          customer_id?: string
          discount_amount?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          line_items?: Json
          organization_id?: string | null
          paid_at?: string | null
          pdf_url?: string | null
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
            referencedRelation: "profiles"
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
            referencedRelation: "quotes"
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
          expires_at: string | null
          id: string
          job_id: string
          message: string | null
          requested_at: string
          requested_by: string
          responded_at: string | null
          response_message: string | null
          staff_id: string
          status: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          job_id: string
          message?: string | null
          requested_at?: string
          requested_by: string
          responded_at?: string | null
          response_message?: string | null
          staff_id: string
          status?: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          job_id?: string
          message?: string | null
          requested_at?: string
          requested_by?: string
          responded_at?: string | null
          response_message?: string | null
          staff_id?: string
          status?: string
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
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
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
      jobs: {
        Row: {
          address: string | null
          assigned_at: string | null
          assigned_worker_id: string | null
          city: string | null
          created_at: string
          customer_id: string | null
          description: string | null
          due_date: string | null
          fixed_price: number | null
          hourly_rate: number | null
          id: string
          pool_enabled: boolean
          postal_code: string | null
          pricing_mode: string
          property_id: string | null
          rot_rut: Json
          source_id: string
          source_type: string
          start_scheduled_at: string | null
          status: string
          title: string | null
        }
        Insert: {
          address?: string | null
          assigned_at?: string | null
          assigned_worker_id?: string | null
          city?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          pool_enabled?: boolean
          postal_code?: string | null
          pricing_mode: string
          property_id?: string | null
          rot_rut?: Json
          source_id: string
          source_type: string
          start_scheduled_at?: string | null
          status?: string
          title?: string | null
        }
        Update: {
          address?: string | null
          assigned_at?: string | null
          assigned_worker_id?: string | null
          city?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          pool_enabled?: boolean
          postal_code?: string | null
          pricing_mode?: string
          property_id?: string | null
          rot_rut?: Json
          source_id?: string
          source_type?: string
          start_scheduled_at?: string | null
          status?: string
          title?: string | null
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
            foreignKeyName: "loyalty_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
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
      organization_members: {
        Row: {
          id: string
          joined_at: string | null
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["user_role"]
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
          role: string | null
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
          role?: string | null
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
          role?: string | null
          total_spent?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
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
        ]
      }
      quote_requests: {
        Row: {
          address: string | null
          attachments: Json | null
          city: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          created_by_type: string | null
          customer_id: string | null
          description: string | null
          email: string | null
          estimated_hours: number | null
          hourly_rate: number | null
          id: string
          message: string | null
          name: string | null
          phone: string | null
          postal_code: string | null
          price_type: string | null
          rot_rut_type: string | null
          service_id: string
          service_name: string | null
          source: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          attachments?: Json | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_type?: string | null
          customer_id?: string | null
          description?: string | null
          email?: string | null
          estimated_hours?: number | null
          hourly_rate?: number | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          price_type?: string | null
          rot_rut_type?: string | null
          service_id: string
          service_name?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          attachments?: Json | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_type?: string | null
          customer_id?: string | null
          description?: string | null
          email?: string | null
          estimated_hours?: number | null
          hourly_rate?: number | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          price_type?: string | null
          rot_rut_type?: string | null
          service_id?: string
          service_name?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          created_by: string | null
          customer_address: string | null
          customer_city: string | null
          customer_email: string | null
          customer_id: string
          customer_name: string | null
          customer_phone: string | null
          customer_postal_code: string | null
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
          customer_id: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
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
          customer_id?: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
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
            foreignKeyName: "fk_quotes_source_booking"
            columns: ["source_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quotes_source_quote_request"
            columns: ["source_quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      translations: {
        Row: {
          entity_id: string
          entity_type: string
          field: string
          id: number
          locale: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          entity_id: string
          entity_type: string
          field: string
          id?: number
          locale: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          entity_id?: string
          entity_type?: string
          field?: string
          id?: number
          locale?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string
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
            foreignKeyName: "voucher_usage_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "work_orders_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_job_to_worker: {
        Args: { p_job_id: string; p_worker_id: string }
        Returns: boolean
      }
      claim_job: {
        Args: { p_job_id: string }
        Returns: boolean
      }
      complete_job: {
        Args: { p_job_id: string }
        Returns: boolean
      }
      create_booking_secure: {
        Args: { p: Json }
        Returns: string
      }
      create_expense_entry: {
        Args: { p: Json }
        Returns: string
      }
      create_job_from_booking: {
        Args: { p_booking_id: string }
        Returns: string
      }
      create_job_from_quote: {
        Args: { p_quote_id: string }
        Returns: string
      }
      create_material_entry: {
        Args: { p: Json }
        Returns: string
      }
      create_quote_request_secure: {
        Args: { p: Json }
        Returns: string
      }
      create_time_entry: {
        Args: { p: Json }
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_invoice_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_next_staff_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_organizations: {
        Args: { user_uuid: string }
        Returns: {
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_admin_or_owner: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_organization_admin: {
        Args: { org_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_organization_member: {
        Args: { org_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_owner: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_worker: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      kpi_today: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
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
      organization_has_members: {
        Args: { org_uuid: string }
        Returns: boolean
      }
      prepare_invoice_from_job: {
        Args: { p_job_id: string }
        Returns: Json
      }
      track_product_view: {
        Args: { p_product_id: string }
        Returns: undefined
      }
      update_job_status: {
        Args: { p_job_id: string; p_status: string }
        Returns: boolean
      }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
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
      user_role:
        | "admin"
        | "member"
        | "ekonomi"
        | "beställare"
        | "tekniker"
        | "owner"
        | "customer"
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
      ],
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
      user_role: [
        "admin",
        "member",
        "ekonomi",
        "beställare",
        "tekniker",
        "owner",
        "customer",
      ],
      user_type: ["private", "company", "brf"],
    },
  },
} as const
