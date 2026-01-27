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
      api_activity_logs: {
        Row: {
          action: string
          created_at: string
          duration_ms: number | null
          endpoint: string
          error_message: string | null
          id: string
          ip_address: string | null
          request_data: Json | null
          response_data: Json | null
          response_status: number | null
          server_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          duration_ms?: number | null
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          request_data?: Json | null
          response_data?: Json | null
          response_status?: number | null
          server_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          duration_ms?: number | null
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          request_data?: Json | null
          response_data?: Json | null
          response_status?: number | null
          server_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_activity_logs_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "hosting_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action_type: string
          actor_id: string | null
          actor_role: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          actor_role?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          actor_role?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      canned_responses: {
        Row: {
          category: string
          content: string
          content_bn: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          shortcut: string | null
          sort_order: number | null
          title: string
          title_bn: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          content_bn?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          shortcut?: string | null
          sort_order?: number | null
          title: string
          title_bn?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          content_bn?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          shortcut?: string | null
          sort_order?: number | null
          title?: string
          title_bn?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      domain_pricing: {
        Row: {
          created_at: string
          extension: string
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          registration_price: number
          renewal_price: number
          sort_order: number | null
          transfer_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          extension: string
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          registration_price: number
          renewal_price: number
          sort_order?: number | null
          transfer_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          extension?: string
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          registration_price?: number
          renewal_price?: number
          sort_order?: number | null
          transfer_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json | null
          created_at: string
          error_code: string
          id: string
          message: string
          session_id: string | null
          severity: string
          source: string
          stack_trace: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          error_code: string
          id?: string
          message: string
          session_id?: string | null
          severity?: string
          source?: string
          stack_trace?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          error_code?: string
          id?: string
          message?: string
          session_id?: string | null
          severity?: string
          source?: string
          stack_trace?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hosting_accounts: {
        Row: {
          bandwidth_limit_mb: number | null
          bandwidth_used_mb: number | null
          cpanel_username: string
          created_at: string
          databases_limit: number | null
          databases_used: number | null
          disk_limit_mb: number | null
          disk_used_mb: number | null
          domain: string
          email_accounts_limit: number | null
          email_accounts_used: number | null
          id: string
          ip_address: string | null
          last_synced_at: string | null
          order_id: string
          php_version: string | null
          provisioned_at: string | null
          server_id: string
          ssl_status: string | null
          status: string
          suspended_at: string | null
          suspension_reason: string | null
          updated_at: string
          user_id: string
          whm_package: string | null
        }
        Insert: {
          bandwidth_limit_mb?: number | null
          bandwidth_used_mb?: number | null
          cpanel_username: string
          created_at?: string
          databases_limit?: number | null
          databases_used?: number | null
          disk_limit_mb?: number | null
          disk_used_mb?: number | null
          domain: string
          email_accounts_limit?: number | null
          email_accounts_used?: number | null
          id?: string
          ip_address?: string | null
          last_synced_at?: string | null
          order_id: string
          php_version?: string | null
          provisioned_at?: string | null
          server_id: string
          ssl_status?: string | null
          status?: string
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string
          user_id: string
          whm_package?: string | null
        }
        Update: {
          bandwidth_limit_mb?: number | null
          bandwidth_used_mb?: number | null
          cpanel_username?: string
          created_at?: string
          databases_limit?: number | null
          databases_used?: number | null
          disk_limit_mb?: number | null
          disk_used_mb?: number | null
          domain?: string
          email_accounts_limit?: number | null
          email_accounts_used?: number | null
          id?: string
          ip_address?: string | null
          last_synced_at?: string | null
          order_id?: string
          php_version?: string | null
          provisioned_at?: string | null
          server_id?: string
          ssl_status?: string | null
          status?: string
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string
          user_id?: string
          whm_package?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hosting_accounts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hosting_accounts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "hosting_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      hosting_plans: {
        Row: {
          bandwidth: string | null
          category: string
          created_at: string
          databases: string | null
          description: string | null
          description_bn: string | null
          email_accounts: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          monthly_price: number
          name: string
          name_bn: string | null
          slug: string
          sort_order: number | null
          storage: string | null
          updated_at: string
          websites: string | null
          yearly_price: number
        }
        Insert: {
          bandwidth?: string | null
          category: string
          created_at?: string
          databases?: string | null
          description?: string | null
          description_bn?: string | null
          email_accounts?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          monthly_price: number
          name: string
          name_bn?: string | null
          slug: string
          sort_order?: number | null
          storage?: string | null
          updated_at?: string
          websites?: string | null
          yearly_price: number
        }
        Update: {
          bandwidth?: string | null
          category?: string
          created_at?: string
          databases?: string | null
          description?: string | null
          description_bn?: string | null
          email_accounts?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          monthly_price?: number
          name?: string
          name_bn?: string | null
          slug?: string
          sort_order?: number | null
          storage?: string | null
          updated_at?: string
          websites?: string | null
          yearly_price?: number
        }
        Relationships: []
      }
      hosting_servers: {
        Row: {
          api_type: string
          created_at: string
          current_accounts: number | null
          hostname: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          location: string | null
          max_accounts: number | null
          name: string
          nameservers: Json | null
          server_type: string
          updated_at: string
        }
        Insert: {
          api_type: string
          created_at?: string
          current_accounts?: number | null
          hostname: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          max_accounts?: number | null
          name: string
          nameservers?: Json | null
          server_type: string
          updated_at?: string
        }
        Update: {
          api_type?: string
          created_at?: string
          current_accounts?: number | null
          hostname?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          max_accounts?: number | null
          name?: string
          nameservers?: Json | null
          server_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          payment_id: string
          pdf_url: string | null
          status: string
          tax: number | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          payment_id: string
          pdf_url?: string | null
          status?: string
          tax?: number | null
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          payment_id?: string
          pdf_url?: string | null
          status?: string
          tax?: number | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_type: string
          attempts_count: number
          created_at: string
          first_attempt_at: string
          id: string
          identifier: string
          last_attempt_at: string
          locked_until: string | null
        }
        Insert: {
          attempt_type?: string
          attempts_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          identifier: string
          last_attempt_at?: string
          locked_until?: string | null
        }
        Update: {
          attempt_type?: string
          attempts_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          identifier?: string
          last_attempt_at?: string
          locked_until?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          created_at: string
          domain_name: string | null
          expiry_date: string | null
          hosting_plan_id: string | null
          id: string
          item_details: Json | null
          item_name: string
          notes: string | null
          order_number: string
          order_type: string
          start_date: string | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          domain_name?: string | null
          expiry_date?: string | null
          hosting_plan_id?: string | null
          id?: string
          item_details?: Json | null
          item_name: string
          notes?: string | null
          order_number: string
          order_type: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          domain_name?: string | null
          expiry_date?: string | null
          hosting_plan_id?: string | null
          id?: string
          item_details?: Json | null
          item_name?: string
          notes?: string | null
          order_number?: string
          order_type?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_hosting_plan_id_fkey"
            columns: ["hosting_plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          fee: number | null
          id: string
          invoice_id: string | null
          metadata: Json | null
          order_id: string
          paid_at: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          fee?: number | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          order_id: string
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          fee?: number | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          order_id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      provisioning_queue: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string
          id: string
          last_error: string | null
          max_attempts: number | null
          order_id: string
          scheduled_at: string
          server_id: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          order_id: string
          scheduled_at?: string
          server_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          order_id?: string
          scheduled_at?: string
          server_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provisioning_queue_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provisioning_queue_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "hosting_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          closed_at: string | null
          created_at: string
          description: string | null
          id: string
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          ticket_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_staff_reply: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_staff_reply?: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_staff_reply?: boolean
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
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
          role?: Database["public"]["Enums"]["app_role"]
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
      webhook_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string | null
          id: string
          invoice_id: string | null
          payload: Json
          processed_at: string | null
          provider: string
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type?: string | null
          id?: string
          invoice_id?: string | null
          payload: Json
          processed_at?: string | null
          provider?: string
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string | null
          id?: string
          invoice_id?: string | null
          payload?: Json
          processed_at?: string | null
          provider?: string
          status?: string
        }
        Relationships: []
      }
      whm_package_mappings: {
        Row: {
          created_at: string
          hosting_plan_id: string
          id: string
          is_active: boolean | null
          server_id: string
          updated_at: string
          whm_package_name: string
        }
        Insert: {
          created_at?: string
          hosting_plan_id: string
          id?: string
          is_active?: boolean | null
          server_id: string
          updated_at?: string
          whm_package_name: string
        }
        Update: {
          created_at?: string
          hosting_plan_id?: string
          id?: string
          is_active?: boolean | null
          server_id?: string
          updated_at?: string
          whm_package_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "whm_package_mappings_hosting_plan_id_fkey"
            columns: ["hosting_plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whm_package_mappings_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "hosting_servers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_agents: {
        Row: {
          email: string | null
          full_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_lockout_minutes?: number
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: {
          attempts_remaining: number
          is_locked: boolean
          locked_until: string
          message: string
        }[]
      }
      cleanup_old_login_attempts: { Args: never; Returns: number }
      generate_cpanel_username: {
        Args: { domain_name: string }
        Returns: string
      }
      generate_invoice_number: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      generate_ticket_number: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_action_type: string
          p_actor_id: string
          p_actor_role: string
          p_ip_address?: string
          p_metadata?: Json
          p_target_id?: string
          p_target_type?: string
          p_user_agent?: string
        }
        Returns: string
      }
      log_error: {
        Args: {
          p_context?: Json
          p_error_code: string
          p_message: string
          p_session_id?: string
          p_severity?: string
          p_source?: string
          p_stack_trace?: string
          p_url?: string
          p_user_id?: string
        }
        Returns: string
      }
      record_login_attempt: {
        Args: {
          p_identifier: string
          p_lockout_minutes?: number
          p_max_attempts?: number
          p_success?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "customer" | "admin"
      billing_cycle: "monthly" | "yearly" | "lifetime"
      order_status:
        | "pending"
        | "processing"
        | "completed"
        | "cancelled"
        | "refunded"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "cancelled"
        | "refunded"
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
      app_role: ["customer", "admin"],
      billing_cycle: ["monthly", "yearly", "lifetime"],
      order_status: [
        "pending",
        "processing",
        "completed",
        "cancelled",
        "refunded",
      ],
      payment_status: [
        "pending",
        "completed",
        "failed",
        "cancelled",
        "refunded",
      ],
    },
  },
} as const
