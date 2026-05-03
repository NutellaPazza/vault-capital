
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.risk_profile_t AS ENUM ('conservative', 'balanced', 'aggressive');
CREATE TYPE public.kyc_status_t AS ENUM ('not_started', 'pending', 'verified');
CREATE TYPE public.investor_type_t AS ENUM ('non_sophisticated', 'sophisticated');
CREATE TYPE public.deal_stage_t AS ENUM ('pre-seed', 'seed', 'series-a');
CREATE TYPE public.deal_status_t AS ENUM ('upcoming', 'live', 'filled', 'failed', 'closed');
CREATE TYPE public.pool_status_t AS ENUM ('upcoming', 'live', 'filled', 'failed', 'processing', 'settling', 'active', 'exit_completed');
CREATE TYPE public.listing_status_t AS ENUM ('active', 'sold', 'cancelled');
CREATE TYPE public.offer_status_t AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE public.tx_type_t AS ENUM ('deposit', 'withdraw', 'invest', 'pool_refund', 'market_buy', 'market_sell', 'exit_distribution', 'fee');
CREATE TYPE public.notif_type_t AS ENUM ('pool', 'portfolio', 'marketplace', 'system');
CREATE TYPE public.application_status_t AS ENUM ('draft', 'submitted', 'under_review', 'shortlisted', 'rejected', 'accepted');

-- ============ UPDATED_AT TRIGGER FN ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  risk_profile public.risk_profile_t NOT NULL DEFAULT 'balanced',
  kyc_status public.kyc_status_t NOT NULL DEFAULT 'not_started',
  wallet_balance_eur NUMERIC(14,2) NOT NULL DEFAULT 0,
  investor_type public.investor_type_t,
  net_worth NUMERIC(14,2),
  notification_preferences JSONB NOT NULL DEFAULT '{"new_pools":true,"portfolio_updates":true,"marketplace_activity":true}'::jsonb,
  pool_interests JSONB NOT NULL DEFAULT '{"industries":[],"stages":[]}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER_ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer function (avoid recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ DEALS ============
CREATE TABLE public.deals (
  id TEXT PRIMARY KEY,
  startup_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  sector_type TEXT NOT NULL,
  country TEXT NOT NULL,
  website_url TEXT,
  stage public.deal_stage_t NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  risks JSONB NOT NULL DEFAULT '[]'::jsonb,
  valuation_pre_money NUMERIC(14,2) NOT NULL,
  offer_target_eur NUMERIC(14,2) NOT NULL,
  offer_equity_percent NUMERIC(5,2) NOT NULL,
  min_ticket_eur NUMERIC(14,2) NOT NULL DEFAULT 100,
  docs JSONB NOT NULL DEFAULT '{}'::jsonb,
  status public.deal_status_t NOT NULL DEFAULT 'upcoming',
  logo_url TEXT,
  founders JSONB NOT NULL DEFAULT '[]'::jsonb,
  accelerator TEXT,
  last_valuation_date TEXT,
  last_valuation_note TEXT,
  company_updates JSONB NOT NULL DEFAULT '[]'::jsonb,
  exit_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_deals_updated BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ POOLS ============
CREATE TABLE public.pools (
  id TEXT PRIMARY KEY,
  deal_id TEXT NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  target_eur NUMERIC(14,2) NOT NULL,
  raised_eur NUMERIC(14,2) NOT NULL DEFAULT 0,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  investors_count INT NOT NULL DEFAULT 0,
  fee_entry_percent NUMERIC(5,2) NOT NULL DEFAULT 2,
  fee_carry_percent NUMERIC(5,2) NOT NULL DEFAULT 2,
  pool_status public.pool_status_t NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_pools_updated BEFORE UPDATE ON public.pools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_pools_deal ON public.pools(deal_id);

-- ============ POSITIONS ============
CREATE TABLE public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pool_id TEXT NOT NULL REFERENCES public.pools(id) ON DELETE CASCADE,
  invested_eur NUMERIC(14,2) NOT NULL,
  ownership_percent_of_spv NUMERIC(8,4) NOT NULL,
  current_estimated_value_eur NUMERIC(14,2) NOT NULL,
  lockup BOOLEAN NOT NULL DEFAULT TRUE,
  is_listed_on_market BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_positions_updated BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_positions_user ON public.positions(user_id);
CREATE INDEX idx_positions_pool ON public.positions(pool_id);

-- ============ MARKETPLACE LISTINGS ============
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pool_id TEXT NOT NULL REFERENCES public.pools(id) ON DELETE CASCADE,
  position_id UUID NOT NULL REFERENCES public.positions(id) ON DELETE CASCADE,
  percent_of_position_for_sale NUMERIC(5,2) NOT NULL,
  ask_price_eur NUMERIC(14,2) NOT NULL,
  status public.listing_status_t NOT NULL DEFAULT 'active',
  fee_marketplace_percent NUMERIC(5,2) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON public.marketplace_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_listings_seller ON public.marketplace_listings(seller_user_id);
CREATE INDEX idx_listings_pool ON public.marketplace_listings(pool_id);

-- ============ MARKETPLACE OFFERS ============
CREATE TABLE public.marketplace_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_price_eur NUMERIC(14,2) NOT NULL,
  offer_message TEXT,
  status public.offer_status_t NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.marketplace_offers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON public.marketplace_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_offers_listing ON public.marketplace_offers(listing_id);
CREATE INDEX idx_offers_buyer ON public.marketplace_offers(buyer_user_id);

-- ============ TRANSACTIONS ============
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.tx_type_t NOT NULL,
  amount_eur NUMERIC(14,2) NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_transactions_user ON public.transactions(user_id);

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  type public.notif_type_t NOT NULL,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- ============ STARTUP APPLICATIONS ============
CREATE TABLE public.startup_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_name TEXT NOT NULL,
  website TEXT,
  country TEXT NOT NULL,
  industry TEXT NOT NULL,
  stage public.deal_stage_t NOT NULL,
  founding_year INT,
  team_size INT,
  contact_email TEXT NOT NULL,
  founders JSONB NOT NULL DEFAULT '[]'::jsonb,
  pitch_summary TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  traction TEXT,
  deck_url TEXT NOT NULL,
  demo_url TEXT,
  data_room_url TEXT,
  fundraising_target_eur NUMERIC(14,2) NOT NULL,
  offering_equity_percent NUMERIC(5,2) NOT NULL,
  valuation_pre_money_eur NUMERIC(14,2),
  use_of_funds JSONB NOT NULL DEFAULT '[]'::jsonb,
  status public.application_status_t NOT NULL DEFAULT 'submitted',
  internal_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.startup_applications ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_apps_updated BEFORE UPDATE ON public.startup_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- user_roles
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- deals
CREATE POLICY "deals_select_authenticated" ON public.deals FOR SELECT TO authenticated USING (true);
CREATE POLICY "deals_admin_all" ON public.deals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- pools
CREATE POLICY "pools_select_authenticated" ON public.pools FOR SELECT TO authenticated USING (true);
CREATE POLICY "pools_admin_all" ON public.pools FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- positions
CREATE POLICY "positions_select_own" ON public.positions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "positions_select_admin" ON public.positions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "positions_insert_own" ON public.positions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "positions_update_own" ON public.positions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "positions_delete_own" ON public.positions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- marketplace_listings
CREATE POLICY "listings_select_authenticated" ON public.marketplace_listings FOR SELECT TO authenticated USING (true);
CREATE POLICY "listings_insert_own" ON public.marketplace_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_user_id);
CREATE POLICY "listings_update_own" ON public.marketplace_listings FOR UPDATE TO authenticated USING (auth.uid() = seller_user_id);
CREATE POLICY "listings_delete_own" ON public.marketplace_listings FOR DELETE TO authenticated USING (auth.uid() = seller_user_id);

-- marketplace_offers
CREATE POLICY "offers_select_buyer" ON public.marketplace_offers FOR SELECT TO authenticated USING (auth.uid() = buyer_user_id);
CREATE POLICY "offers_select_seller" ON public.marketplace_offers FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.marketplace_listings l WHERE l.id = listing_id AND l.seller_user_id = auth.uid())
);
CREATE POLICY "offers_insert_buyer" ON public.marketplace_offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_user_id);
CREATE POLICY "offers_update_buyer" ON public.marketplace_offers FOR UPDATE TO authenticated USING (auth.uid() = buyer_user_id);
CREATE POLICY "offers_update_seller" ON public.marketplace_offers FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.marketplace_listings l WHERE l.id = listing_id AND l.seller_user_id = auth.uid())
);

-- transactions
CREATE POLICY "tx_select_own" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tx_select_admin" ON public.transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tx_insert_own" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- notifications
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_insert_own" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- startup_applications: public insert, admin read/update
CREATE POLICY "apps_insert_public" ON public.startup_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "apps_admin_select" ON public.startup_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "apps_admin_update" ON public.startup_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "apps_admin_delete" ON public.startup_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ AUTO PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
