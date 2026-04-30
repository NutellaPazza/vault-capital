// VaultCapital Type Definitions

export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';
export type InvestorType = 'non_sophisticated' | 'sophisticated';
export type KYCStatus = 'not_started' | 'pending' | 'verified';
export type DealStage = 'pre-seed' | 'seed' | 'series-a';
export type DealStatus = 'upcoming' | 'live' | 'filled' | 'failed' | 'closed';
export type PoolStatus = 'upcoming' | 'live' | 'filled' | 'failed' | 'processing' | 'settling' | 'active' | 'exit_completed';
export type ListingStatus = 'active' | 'sold' | 'cancelled';
export type TransactionType = 'deposit' | 'withdraw' | 'invest' | 'pool_refund' | 'market_buy' | 'market_sell' | 'exit_distribution' | 'fee';

export interface User {
  id: string;
  name: string;
  email: string;
  risk_profile: RiskProfile;
  kyc_status: KYCStatus;
  wallet_balance_eur: number;
  created_at: string;
  notification_preferences: {
    new_pools: boolean;
    portfolio_updates: boolean;
    marketplace_activity: boolean;
  };
  pool_interests: {
    industries: string[];
    stages: DealStage[];
  };
  investor_type?: InvestorType;
  net_worth?: number;
}

export interface DealFounder {
  name: string;
  role: string;
  linkedin_url?: string;
  education?: string;
  background?: string;
}

export interface CompanyUpdate {
  date: string;
  headline: string;
  summary: string;
}

export interface ExitObjective {
  label: string;
  value: string;
}

export interface StartupDeal {
  id: string;
  startup_name: string;
  industry: string;
  sector_type: 'B2B' | 'B2C' | 'B2B2C';
  country: string;
  website_url?: string;
  stage: DealStage;
  short_description: string;
  long_description: string;
  highlights: string[];
  risks: string[];
  valuation_pre_money: number;
  offer_target_eur: number;
  offer_equity_percent: number;
  min_ticket_eur: number;
  docs: {
    pitch_deck_url: string;
    data_room_url: string;
  };
  status: DealStatus;
  logo_url?: string;
  founders: DealFounder[];
  accelerator?: string;
  last_valuation_date?: string;
  last_valuation_note?: string;
  company_updates: CompanyUpdate[];
  exit_objectives: ExitObjective[];
}

export interface Pool {
  id: string;
  deal_id: string;
  target_eur: number;
  raised_eur: number;
  start_datetime: string;
  end_datetime: string;
  investors_count: number;
  fee_entry_percent: number;
  fee_carry_percent: number;
  pool_status: PoolStatus;
}

export interface Position {
  id: string;
  user_id: string;
  pool_id: string;
  invested_eur: number;
  ownership_percent_of_spv: number;
  current_estimated_value_eur: number;
  lockup: boolean;
  is_listed_on_market: boolean;
  created_at: string;
}

export interface MarketplaceListing {
  id: string;
  seller_user_id: string;
  pool_id: string;
  position_id: string;
  percent_of_position_for_sale: number;
  ask_price_eur: number;
  created_at: string;
  status: ListingStatus;
  fee_marketplace_percent: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount_eur: number;
  timestamp: string;
  meta: {
    pool_id?: string;
    listing_id?: string;
    notes?: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'pool' | 'portfolio' | 'marketplace' | 'system';
  link?: string;
}

// Helper types
export interface PoolWithDeal extends Pool {
  deal: StartupDeal;
}

export interface PositionWithPool extends Position {
  pool: Pool;
  deal: StartupDeal;
}

export interface ListingWithDetails extends MarketplaceListing {
  pool: Pool;
  deal: StartupDeal;
  seller: User;
  position: Position;
}

// Marketplace Offer Types
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface MarketplaceOffer {
  id: string;
  listing_id: string;
  buyer_user_id: string;
  offer_price_eur: number;
  offer_message?: string;
  status: OfferStatus;
  created_at: string;
}

// Startup Application Types
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted';

export interface Founder {
  name: string;
  role: string;
  linkedin_url?: string;
}

export interface InternalNote {
  id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface StartupApplication {
  id: string;
  startup_name: string;
  website?: string;
  country: string;
  industry: string;
  stage: DealStage;
  founding_year?: number;
  team_size?: number;
  contact_email: string;
  founders: Founder[];
  pitch_summary: string;
  problem: string;
  solution: string;
  traction?: string;
  deck_url: string;
  demo_url?: string;
  data_room_url?: string;
  fundraising_target_eur: number;
  offering_equity_percent: number;
  valuation_pre_money_eur?: number;
  use_of_funds: string[];
  status: ApplicationStatus;
  internal_notes: InternalNote[];
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}
