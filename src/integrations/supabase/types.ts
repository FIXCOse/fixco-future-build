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
          customer_id: string
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          line_items: Json
          organization_id: string | null
          property_id: string
          quote_number: string
          rot_amount: number | null
          rut_amount: number | null
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
          customer_id: string
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          line_items?: Json
          organization_id?: string | null
          property_id: string
          quote_number: string
          rot_amount?: number | null
          rut_amount?: number | null
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
          customer_id?: string
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          line_items?: Json
          organization_id?: string | null
          property_id?: string
          quote_number?: string
          rot_amount?: number | null
          rut_amount?: number | null
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
      staff: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          role: string
          skills: string[] | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          role: string
          skills?: string[] | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          skills?: string[] | null
          user_id?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_booking_secure: {
        Args: { p: Json }
        Returns: string
      }
      create_quote_request_secure: {
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
