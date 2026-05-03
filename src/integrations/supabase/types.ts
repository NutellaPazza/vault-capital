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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      deals: {
        Row: {
          accelerator: string | null
          company_updates: Json
          country: string
          created_at: string
          docs: Json
          exit_objectives: Json
          founders: Json
          highlights: Json
          id: string
          industry: string
          last_valuation_date: string | null
          last_valuation_note: string | null
          logo_url: string | null
          long_description: string
          min_ticket_eur: number
          offer_equity_percent: number
          offer_target_eur: number
          risks: Json
          sector_type: string
          short_description: string
          stage: Database["public"]["Enums"]["deal_stage_t"]
          startup_name: string
          status: Database["public"]["Enums"]["deal_status_t"]
          updated_at: string
          valuation_pre_money: number
          website_url: string | null
        }
        Insert: {
          accelerator?: string | null
          company_updates?: Json
          country: string
          created_at?: string
          docs?: Json
          exit_objectives?: Json
          founders?: Json
          highlights?: Json
          id: string
          industry: string
          last_valuation_date?: string | null
          last_valuation_note?: string | null
          logo_url?: string | null
          long_description: string
          min_ticket_eur?: number
          offer_equity_percent: number
          offer_target_eur: number
          risks?: Json
          sector_type: string
          short_description: string
          stage: Database["public"]["Enums"]["deal_stage_t"]
          startup_name: string
          status?: Database["public"]["Enums"]["deal_status_t"]
          updated_at?: string
          valuation_pre_money: number
          website_url?: string | null
        }
        Update: {
          accelerator?: string | null
          company_updates?: Json
          country?: string
          created_at?: string
          docs?: Json
          exit_objectives?: Json
          founders?: Json
          highlights?: Json
          id?: string
          industry?: string
          last_valuation_date?: string | null
          last_valuation_note?: string | null
          logo_url?: string | null
          long_description?: string
          min_ticket_eur?: number
          offer_equity_percent?: number
          offer_target_eur?: number
          risks?: Json
          sector_type?: string
          short_description?: string
          stage?: Database["public"]["Enums"]["deal_stage_t"]
          startup_name?: string
          status?: Database["public"]["Enums"]["deal_status_t"]
          updated_at?: string
          valuation_pre_money?: number
          website_url?: string | null
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          ask_price_eur: number
          created_at: string
          fee_marketplace_percent: number
          id: string
          percent_of_position_for_sale: number
          pool_id: string
          position_id: string
          seller_user_id: string
          status: Database["public"]["Enums"]["listing_status_t"]
          updated_at: string
        }
        Insert: {
          ask_price_eur: number
          created_at?: string
          fee_marketplace_percent?: number
          id?: string
          percent_of_position_for_sale: number
          pool_id: string
          position_id: string
          seller_user_id: string
          status?: Database["public"]["Enums"]["listing_status_t"]
          updated_at?: string
        }
        Update: {
          ask_price_eur?: number
          created_at?: string
          fee_marketplace_percent?: number
          id?: string
          percent_of_position_for_sale?: number
          pool_id?: string
          position_id?: string
          seller_user_id?: string
          status?: Database["public"]["Enums"]["listing_status_t"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_offers: {
        Row: {
          buyer_user_id: string
          created_at: string
          id: string
          listing_id: string
          offer_message: string | null
          offer_price_eur: number
          status: Database["public"]["Enums"]["offer_status_t"]
          updated_at: string
        }
        Insert: {
          buyer_user_id: string
          created_at?: string
          id?: string
          listing_id: string
          offer_message?: string | null
          offer_price_eur: number
          status?: Database["public"]["Enums"]["offer_status_t"]
          updated_at?: string
        }
        Update: {
          buyer_user_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          offer_message?: string | null
          offer_price_eur?: number
          status?: Database["public"]["Enums"]["offer_status_t"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notif_type_t"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: Database["public"]["Enums"]["notif_type_t"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notif_type_t"]
          user_id?: string
        }
        Relationships: []
      }
      pools: {
        Row: {
          created_at: string
          deal_id: string
          end_datetime: string
          fee_carry_percent: number
          fee_entry_percent: number
          id: string
          investors_count: number
          pool_status: Database["public"]["Enums"]["pool_status_t"]
          raised_eur: number
          start_datetime: string
          target_eur: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          end_datetime: string
          fee_carry_percent?: number
          fee_entry_percent?: number
          id: string
          investors_count?: number
          pool_status?: Database["public"]["Enums"]["pool_status_t"]
          raised_eur?: number
          start_datetime: string
          target_eur: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          end_datetime?: string
          fee_carry_percent?: number
          fee_entry_percent?: number
          id?: string
          investors_count?: number
          pool_status?: Database["public"]["Enums"]["pool_status_t"]
          raised_eur?: number
          start_datetime?: string
          target_eur?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pools_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          created_at: string
          current_estimated_value_eur: number
          id: string
          invested_eur: number
          is_listed_on_market: boolean
          lockup: boolean
          ownership_percent_of_spv: number
          pool_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_estimated_value_eur: number
          id?: string
          invested_eur: number
          is_listed_on_market?: boolean
          lockup?: boolean
          ownership_percent_of_spv: number
          pool_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_estimated_value_eur?: number
          id?: string
          invested_eur?: number
          is_listed_on_market?: boolean
          lockup?: boolean
          ownership_percent_of_spv?: number
          pool_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          investor_type: Database["public"]["Enums"]["investor_type_t"] | null
          kyc_status: Database["public"]["Enums"]["kyc_status_t"]
          name: string
          net_worth: number | null
          notification_preferences: Json
          pool_interests: Json
          risk_profile: Database["public"]["Enums"]["risk_profile_t"]
          updated_at: string
          user_id: string
          wallet_balance_eur: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          investor_type?: Database["public"]["Enums"]["investor_type_t"] | null
          kyc_status?: Database["public"]["Enums"]["kyc_status_t"]
          name?: string
          net_worth?: number | null
          notification_preferences?: Json
          pool_interests?: Json
          risk_profile?: Database["public"]["Enums"]["risk_profile_t"]
          updated_at?: string
          user_id: string
          wallet_balance_eur?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          investor_type?: Database["public"]["Enums"]["investor_type_t"] | null
          kyc_status?: Database["public"]["Enums"]["kyc_status_t"]
          name?: string
          net_worth?: number | null
          notification_preferences?: Json
          pool_interests?: Json
          risk_profile?: Database["public"]["Enums"]["risk_profile_t"]
          updated_at?: string
          user_id?: string
          wallet_balance_eur?: number
        }
        Relationships: []
      }
      startup_applications: {
        Row: {
          contact_email: string
          country: string
          created_at: string
          data_room_url: string | null
          deck_url: string
          demo_url: string | null
          founders: Json
          founding_year: number | null
          fundraising_target_eur: number
          id: string
          industry: string
          internal_notes: Json
          offering_equity_percent: number
          pitch_summary: string
          problem: string
          rejection_reason: string | null
          solution: string
          stage: Database["public"]["Enums"]["deal_stage_t"]
          startup_name: string
          status: Database["public"]["Enums"]["application_status_t"]
          team_size: number | null
          traction: string | null
          updated_at: string
          use_of_funds: Json
          valuation_pre_money_eur: number | null
          website: string | null
        }
        Insert: {
          contact_email: string
          country: string
          created_at?: string
          data_room_url?: string | null
          deck_url: string
          demo_url?: string | null
          founders?: Json
          founding_year?: number | null
          fundraising_target_eur: number
          id?: string
          industry: string
          internal_notes?: Json
          offering_equity_percent: number
          pitch_summary: string
          problem: string
          rejection_reason?: string | null
          solution: string
          stage: Database["public"]["Enums"]["deal_stage_t"]
          startup_name: string
          status?: Database["public"]["Enums"]["application_status_t"]
          team_size?: number | null
          traction?: string | null
          updated_at?: string
          use_of_funds?: Json
          valuation_pre_money_eur?: number | null
          website?: string | null
        }
        Update: {
          contact_email?: string
          country?: string
          created_at?: string
          data_room_url?: string | null
          deck_url?: string
          demo_url?: string | null
          founders?: Json
          founding_year?: number | null
          fundraising_target_eur?: number
          id?: string
          industry?: string
          internal_notes?: Json
          offering_equity_percent?: number
          pitch_summary?: string
          problem?: string
          rejection_reason?: string | null
          solution?: string
          stage?: Database["public"]["Enums"]["deal_stage_t"]
          startup_name?: string
          status?: Database["public"]["Enums"]["application_status_t"]
          team_size?: number | null
          traction?: string | null
          updated_at?: string
          use_of_funds?: Json
          valuation_pre_money_eur?: number | null
          website?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_eur: number
          created_at: string
          id: string
          meta: Json
          type: Database["public"]["Enums"]["tx_type_t"]
          user_id: string
        }
        Insert: {
          amount_eur: number
          created_at?: string
          id?: string
          meta?: Json
          type: Database["public"]["Enums"]["tx_type_t"]
          user_id: string
        }
        Update: {
          amount_eur?: number
          created_at?: string
          id?: string
          meta?: Json
          type?: Database["public"]["Enums"]["tx_type_t"]
          user_id?: string
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
      place_investment: {
        Args: { _amount: number; _pool_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      application_status_t:
        | "draft"
        | "submitted"
        | "under_review"
        | "shortlisted"
        | "rejected"
        | "accepted"
      deal_stage_t: "pre-seed" | "seed" | "series-a"
      deal_status_t: "upcoming" | "live" | "filled" | "failed" | "closed"
      investor_type_t: "non_sophisticated" | "sophisticated"
      kyc_status_t: "not_started" | "pending" | "verified"
      listing_status_t: "active" | "sold" | "cancelled"
      notif_type_t: "pool" | "portfolio" | "marketplace" | "system"
      offer_status_t: "pending" | "accepted" | "rejected" | "expired"
      pool_status_t:
        | "upcoming"
        | "live"
        | "filled"
        | "failed"
        | "processing"
        | "settling"
        | "active"
        | "exit_completed"
      risk_profile_t: "conservative" | "balanced" | "aggressive"
      tx_type_t:
        | "deposit"
        | "withdraw"
        | "invest"
        | "pool_refund"
        | "market_buy"
        | "market_sell"
        | "exit_distribution"
        | "fee"
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
      application_status_t: [
        "draft",
        "submitted",
        "under_review",
        "shortlisted",
        "rejected",
        "accepted",
      ],
      deal_stage_t: ["pre-seed", "seed", "series-a"],
      deal_status_t: ["upcoming", "live", "filled", "failed", "closed"],
      investor_type_t: ["non_sophisticated", "sophisticated"],
      kyc_status_t: ["not_started", "pending", "verified"],
      listing_status_t: ["active", "sold", "cancelled"],
      notif_type_t: ["pool", "portfolio", "marketplace", "system"],
      offer_status_t: ["pending", "accepted", "rejected", "expired"],
      pool_status_t: [
        "upcoming",
        "live",
        "filled",
        "failed",
        "processing",
        "settling",
        "active",
        "exit_completed",
      ],
      risk_profile_t: ["conservative", "balanced", "aggressive"],
      tx_type_t: [
        "deposit",
        "withdraw",
        "invest",
        "pool_refund",
        "market_buy",
        "market_sell",
        "exit_distribution",
        "fee",
      ],
    },
  },
} as const
