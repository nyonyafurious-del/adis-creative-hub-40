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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          categories: string[] | null
          content: string | null
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          read_time: number | null
          slug: string
          status: Database["public"]["Enums"]["page_status"]
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          categories?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          status?: Database["public"]["Enums"]["page_status"]
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          categories?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["page_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string | null
          email: string | null
          form_type: string
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          name: string | null
          phone: string | null
          service_interest: string | null
          source: string | null
          timeline: string | null
          updated_at: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          form_type: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          service_interest?: string | null
          source?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          form_type?: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          service_interest?: string | null
          source?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          created_by: string | null
          file_path: string
          file_size: number | null
          filename: string
          id: string
          metadata: Json | null
          mime_type: string | null
          original_name: string
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by?: string | null
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          original_name: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          original_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          seo_data: Json | null
          slug: string
          status: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          seo_data?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          seo_data?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["page_status"]
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          categories: string[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          featured_image: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          project_url: string | null
          short_description: string | null
          sort_order: number | null
          status: Database["public"]["Enums"]["page_status"]
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          project_url?: string | null
          short_description?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status"]
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          project_url?: string | null
          short_description?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          features: string[] | null
          icon: string | null
          id: string
          is_popular: boolean | null
          price: number | null
          price_text: string | null
          short_description: string | null
          sort_order: number | null
          status: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          is_popular?: boolean | null
          price?: number | null
          price_text?: string | null
          short_description?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          is_popular?: boolean | null
          price?: number | null
          price_text?: string | null
          short_description?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status"]
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_company: string | null
          author_name: string
          author_photo: string | null
          author_role: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_featured: boolean | null
          rating: number | null
          sort_order: number | null
          status: Database["public"]["Enums"]["page_status"]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          author_company?: string | null
          author_name: string
          author_photo?: string | null
          author_role?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          author_company?: string | null
          author_name?: string
          author_photo?: string | null
          author_role?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["page_status"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
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
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      integration_type:
        | "google_analytics"
        | "meta_pixel"
        | "calendly"
        | "whatsapp"
        | "tawk_to"
        | "crisp_chat"
      page_status: "draft" | "published" | "archived"
      user_role: "admin" | "editor"
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
      integration_type: [
        "google_analytics",
        "meta_pixel",
        "calendly",
        "whatsapp",
        "tawk_to",
        "crisp_chat",
      ],
      page_status: ["draft", "published", "archived"],
      user_role: ["admin", "editor"],
    },
  },
} as const
