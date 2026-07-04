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
      ad_banners: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          id: string
          image_url: string
          link_url: string | null
          placement: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          link_url?: string | null
          placement?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          link_url?: string | null
          placement?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admission_applications: {
        Row: {
          address: string
          city: string
          cnic_bform: string | null
          course_interest: string
          created_at: string
          date_of_birth: string
          email: string
          father_name: string | null
          full_name: string
          gender: string
          guardian_name: string
          guardian_phone: string
          id: string
          message: string | null
          phone: string
          previous_education: string
          status: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          address: string
          city: string
          cnic_bform?: string | null
          course_interest: string
          created_at?: string
          date_of_birth: string
          email: string
          father_name?: string | null
          full_name: string
          gender: string
          guardian_name: string
          guardian_phone: string
          id?: string
          message?: string | null
          phone: string
          previous_education: string
          status?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string
          city?: string
          cnic_bform?: string | null
          course_interest?: string
          created_at?: string
          date_of_birth?: string
          email?: string
          father_name?: string | null
          full_name?: string
          gender?: string
          guardian_name?: string
          guardian_phone?: string
          id?: string
          message?: string | null
          phone?: string
          previous_education?: string
          status?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          display_order: number
          duration: string | null
          enrollment_status: string
          features: string[] | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          schedule: string | null
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          duration?: string | null
          enrollment_status?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          schedule?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          duration?: string | null
          enrollment_status?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          schedule?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      faculty_members: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          experience: string
          expertise: string[]
          id: string
          name: string
          photo_url: string | null
          qualifications: string[]
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          experience?: string
          expertise?: string[]
          id?: string
          name: string
          photo_url?: string | null
          qualifications?: string[]
          role: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          experience?: string
          expertise?: string[]
          id?: string
          name?: string
          photo_url?: string | null
          qualifications?: string[]
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      fee_records: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          fee_type: string
          id: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          receipt_number: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          fee_type?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          fee_type?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          active: boolean
          content: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          metadata: Json | null
          page: string
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          metadata?: Json | null
          page: string
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          metadata?: Json | null
          page?: string
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      school_diary: {
        Row: {
          active: boolean
          category: string
          content: string
          created_at: string
          entry_date: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          content: string
          created_at?: string
          entry_date?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          map_embed_url: string | null
          office_hours: string | null
          phone: string | null
          site_name: string
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          social_whatsapp: string | null
          social_youtube: string | null
          tagline: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          map_embed_url?: string | null
          office_hours?: string | null
          phone?: string | null
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_whatsapp?: string | null
          social_youtube?: string | null
          tagline?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          map_embed_url?: string | null
          office_hours?: string | null
          phone?: string | null
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_whatsapp?: string | null
          social_youtube?: string | null
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          address: string
          city: string
          course: string
          created_at: string
          date_of_birth: string
          email: string
          enrollment_date: string
          full_name: string
          gender: string
          guardian_name: string
          guardian_phone: string
          id: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          course: string
          created_at?: string
          date_of_birth: string
          email: string
          enrollment_date?: string
          full_name: string
          gender: string
          guardian_name: string
          guardian_phone: string
          id?: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          course?: string
          created_at?: string
          date_of_birth?: string
          email?: string
          enrollment_date?: string
          full_name?: string
          gender?: string
          guardian_name?: string
          guardian_phone?: string
          id?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean
          content: string
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          name: string
          rating: number
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          content: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name: string
          rating?: number
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name?: string
          rating?: number
          role?: string
          updated_at?: string
        }
        Relationships: []
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
