export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number
          end_time: string
          id: string
          is_recurring: boolean
          location: string | null
          notes: string | null
          parent_appointment_id: string | null
          patient_id: string
          provider_name: string | null
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_pattern: Database["public"]["Enums"]["recurrence_pattern"]
          reminder_minutes_before: number | null
          send_reminder: boolean
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at: string
        }
        Insert: {
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number
          end_time: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          notes?: string | null
          parent_appointment_id?: string | null
          patient_id: string
          provider_name?: string | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: Database["public"]["Enums"]["recurrence_pattern"]
          reminder_minutes_before?: number | null
          send_reminder?: boolean
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at?: string
        }
        Update: {
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number
          end_time?: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          notes?: string | null
          parent_appointment_id?: string | null
          patient_id?: string
          provider_name?: string | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: Database["public"]["Enums"]["recurrence_pattern"]
          reminder_minutes_before?: number | null
          send_reminder?: boolean
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_parent_appointment_id_fkey"
            columns: ["parent_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      letter_templates: {
        Row: {
          category: Database["public"]["Enums"]["template_category"]
          content: Json
          created_at: string | null
          created_by: string
          id: string
          is_default: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["template_category"]
          content: Json
          created_at?: string | null
          created_by: string
          id?: string
          is_default?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["template_category"]
          content?: Json
          created_at?: string | null
          created_by?: string
          id?: string
          is_default?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_relationships: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          related_patient_id: string | null
          related_person_email: string | null
          related_person_name: string | null
          related_person_phone: string | null
          relationship_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          related_patient_id?: string | null
          related_person_email?: string | null
          related_person_name?: string | null
          related_person_phone?: string | null
          relationship_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          related_patient_id?: string | null
          related_person_email?: string | null
          related_person_name?: string | null
          related_person_phone?: string | null
          relationship_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_relationships_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_relationships_related_patient_id_fkey"
            columns: ["related_patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_superbills: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          superbill_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          superbill_id: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          superbill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_superbills_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          allergies: string | null
          avatar_url: string | null
          city: string | null
          common_complaints: Json | null
          country: string | null
          created_at: string
          created_by: string | null
          default_cpt_codes: Json | null
          default_icd_codes: Json | null
          dob: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employer: string | null
          gender: string | null
          id: string
          insurance_group_number: string | null
          insurance_policy_number: string | null
          insurance_provider: string | null
          insurance_subscriber_dob: string | null
          insurance_subscriber_name: string | null
          last_visit_date: string | null
          marital_status: string | null
          medical_history: string | null
          medications: string | null
          name: string
          occupation: string | null
          patient_status: string | null
          phone: string | null
          preferred_communication: string | null
          primary_care_physician: string | null
          referring_physician: string | null
          secondary_phone: string | null
          state: string | null
          total_billed: number | null
          updated_at: string
          visit_count: number | null
          work_phone: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string | null
          avatar_url?: string | null
          city?: string | null
          common_complaints?: Json | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          default_cpt_codes?: Json | null
          default_icd_codes?: Json | null
          dob: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          gender?: string | null
          id?: string
          insurance_group_number?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          insurance_subscriber_dob?: string | null
          insurance_subscriber_name?: string | null
          last_visit_date?: string | null
          marital_status?: string | null
          medical_history?: string | null
          medications?: string | null
          name: string
          occupation?: string | null
          patient_status?: string | null
          phone?: string | null
          preferred_communication?: string | null
          primary_care_physician?: string | null
          referring_physician?: string | null
          secondary_phone?: string | null
          state?: string | null
          total_billed?: number | null
          updated_at?: string
          visit_count?: number | null
          work_phone?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string | null
          avatar_url?: string | null
          city?: string | null
          common_complaints?: Json | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          default_cpt_codes?: Json | null
          default_icd_codes?: Json | null
          dob?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer?: string | null
          gender?: string | null
          id?: string
          insurance_group_number?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          insurance_subscriber_dob?: string | null
          insurance_subscriber_name?: string | null
          last_visit_date?: string | null
          marital_status?: string | null
          medical_history?: string | null
          medications?: string | null
          name?: string
          occupation?: string | null
          patient_status?: string | null
          phone?: string | null
          preferred_communication?: string | null
          primary_care_physician?: string | null
          referring_physician?: string | null
          secondary_phone?: string | null
          state?: string | null
          total_billed?: number | null
          updated_at?: string
          visit_count?: number | null
          work_phone?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      superbill_request_prefs: {
        Row: {
          auto_approve: boolean
          created_at: string
          day_of_month: number
          default_delivery: string
          default_notes: string | null
          id: string
          notify_via_email: boolean
          recurrence: Database["public"]["Enums"]["request_recurrence"]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_approve?: boolean
          created_at?: string
          day_of_month?: number
          default_delivery?: string
          default_notes?: string | null
          id?: string
          notify_via_email?: boolean
          recurrence?: Database["public"]["Enums"]["request_recurrence"]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_approve?: boolean
          created_at?: string
          day_of_month?: number
          default_delivery?: string
          default_notes?: string | null
          id?: string
          notify_via_email?: boolean
          recurrence?: Database["public"]["Enums"]["request_recurrence"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      superbill_requests: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string
          from_date: string | null
          fulfillment_superbill_id: string | null
          id: string
          notes: string | null
          patient_dob: string | null
          patient_id: string | null
          patient_name: string | null
          preferred_delivery: string | null
          status: Database["public"]["Enums"]["request_status"]
          to_date: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by: string
          from_date?: string | null
          fulfillment_superbill_id?: string | null
          id?: string
          notes?: string | null
          patient_dob?: string | null
          patient_id?: string | null
          patient_name?: string | null
          preferred_delivery?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          to_date?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string
          from_date?: string | null
          fulfillment_superbill_id?: string | null
          id?: string
          notes?: string | null
          patient_dob?: string | null
          patient_id?: string | null
          patient_name?: string | null
          preferred_delivery?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          to_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      superbill_visits: {
        Row: {
          created_at: string
          id: string
          superbill_id: string
          visit_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          superbill_id: string
          visit_id: string
        }
        Update: {
          created_at?: string
          id?: string
          superbill_id?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "superbill_visits_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      superbills: {
        Row: {
          clinic_address: string
          clinic_email: string
          clinic_name: string
          clinic_phone: string
          created_at: string
          created_by: string
          default_cpt_codes: Json | null
          default_fee: number | null
          default_icd_codes: Json | null
          default_main_complaints: Json | null
          ein: string
          id: string
          issue_date: string
          npi: string
          patient_dob: string
          patient_id: string | null
          patient_name: string
          provider_name: string
          status: string
          updated_at: string
          visits: Json
        }
        Insert: {
          clinic_address: string
          clinic_email: string
          clinic_name: string
          clinic_phone: string
          created_at?: string
          created_by?: string
          default_cpt_codes?: Json | null
          default_fee?: number | null
          default_icd_codes?: Json | null
          default_main_complaints?: Json | null
          ein: string
          id: string
          issue_date: string
          npi: string
          patient_dob: string
          patient_id?: string | null
          patient_name: string
          provider_name: string
          status?: string
          updated_at?: string
          visits?: Json
        }
        Update: {
          clinic_address?: string
          clinic_email?: string
          clinic_name?: string
          clinic_phone?: string
          created_at?: string
          created_by?: string
          default_cpt_codes?: Json | null
          default_fee?: number | null
          default_icd_codes?: Json | null
          default_main_complaints?: Json | null
          ein?: string
          id?: string
          issue_date?: string
          npi?: string
          patient_dob?: string
          patient_id?: string | null
          patient_name?: string
          provider_name?: string
          status?: string
          updated_at?: string
          visits?: Json
        }
        Relationships: [
          {
            foreignKeyName: "superbills_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          cpt_code_entries: Json | null
          cpt_codes: Json | null
          created_at: string
          fee: number | null
          icd_codes: Json | null
          id: string
          main_complaints: Json | null
          notes: string | null
          patient_id: string
          status: string | null
          superbill_id: string | null
          updated_at: string
          visit_date: string
        }
        Insert: {
          cpt_code_entries?: Json | null
          cpt_codes?: Json | null
          created_at?: string
          fee?: number | null
          icd_codes?: Json | null
          id?: string
          main_complaints?: Json | null
          notes?: string | null
          patient_id: string
          status?: string | null
          superbill_id?: string | null
          updated_at?: string
          visit_date: string
        }
        Update: {
          cpt_code_entries?: Json | null
          cpt_codes?: Json | null
          created_at?: string
          fee?: number | null
          icd_codes?: Json | null
          id?: string
          main_complaints?: Json | null
          notes?: string | null
          patient_id?: string
          status?: string | null
          superbill_id?: string | null
          updated_at?: string
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id?: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer" | "patient"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      appointment_type:
        | "consultation"
        | "follow_up"
        | "procedure"
        | "lab_work"
        | "imaging"
        | "therapy"
        | "emergency"
      recurrence_pattern: "none" | "daily" | "weekly" | "monthly" | "yearly"
      request_recurrence: "none" | "monthly" | "quarterly"
      request_status: "pending" | "in_progress" | "completed" | "rejected"
      template_category: "cover_letter" | "appeal_letter" | "general"
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
      app_role: ["admin", "editor", "viewer", "patient"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      appointment_type: [
        "consultation",
        "follow_up",
        "procedure",
        "lab_work",
        "imaging",
        "therapy",
        "emergency",
      ],
      recurrence_pattern: ["none", "daily", "weekly", "monthly", "yearly"],
      request_recurrence: ["none", "monthly", "quarterly"],
      request_status: ["pending", "in_progress", "completed", "rejected"],
      template_category: ["cover_letter", "appeal_letter", "general"],
    },
  },
} as const
