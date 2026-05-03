import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/appStore';

interface AuthContextValue {
  session: Session | null;
  authUser: SupabaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  authUser: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe FIRST, then read existing session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        // Clear store on logout
        useAppStore.setState({
          isAuthenticated: false,
          currentUser: null,
          isAdmin: false,
        });
      } else {
        // Defer profile load (avoid deadlocks per Supabase guidance)
        setTimeout(() => loadProfile(newSession.user.id), 0);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        loadProfile(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const [
      { data: profile },
      { data: roles },
      { data: dbDeals },
      { data: dbPools },
      { data: dbPositions },
      { data: dbTx },
      { data: dbNotifs },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
      supabase.from('deals').select('*'),
      supabase.from('pools').select('*'),
      supabase.from('positions').select('*').eq('user_id', userId),
      supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    if (!profile) return;

    const isAdmin = !!roles?.some(r => r.role === 'admin');

    const mappedDeals = (dbDeals || []).map((d: any) => ({
      id: d.id,
      startup_name: d.startup_name,
      industry: d.industry,
      sector_type: d.sector_type,
      country: d.country,
      website_url: d.website_url || undefined,
      stage: d.stage,
      short_description: d.short_description,
      long_description: d.long_description,
      highlights: d.highlights || [],
      risks: d.risks || [],
      valuation_pre_money: Number(d.valuation_pre_money),
      offer_target_eur: Number(d.offer_target_eur),
      offer_equity_percent: Number(d.offer_equity_percent),
      min_ticket_eur: Number(d.min_ticket_eur),
      docs: d.docs || { pitch_deck_url: '', data_room_url: '' },
      status: d.status,
      logo_url: d.logo_url || undefined,
      founders: d.founders || [],
      accelerator: d.accelerator || undefined,
      last_valuation_date: d.last_valuation_date || undefined,
      last_valuation_note: d.last_valuation_note || undefined,
      company_updates: d.company_updates || [],
      exit_objectives: d.exit_objectives || [],
    }));

    const mappedPools = (dbPools || []).map((p: any) => ({
      id: p.id,
      deal_id: p.deal_id,
      target_eur: Number(p.target_eur),
      raised_eur: Number(p.raised_eur),
      start_datetime: p.start_datetime,
      end_datetime: p.end_datetime,
      investors_count: p.investors_count,
      fee_entry_percent: Number(p.fee_entry_percent),
      fee_carry_percent: Number(p.fee_carry_percent),
      pool_status: p.pool_status,
    }));

    useAppStore.setState({
      isAuthenticated: true,
      isAdmin,
      demoMode: false,
      // Real users: vaults from DB, no mock user data
      deals: mappedDeals,
      pools: mappedPools,
      positions: [],
      listings: [],
      transactions: [],
      notifications: [],
      offers: [],
      allUsers: [],
      toastedNotificationIds: [],
      currentUser: {
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        risk_profile: profile.risk_profile as any,
        kyc_status: profile.kyc_status as any,
        wallet_balance_eur: Number(profile.wallet_balance_eur),
        created_at: profile.created_at,
        notification_preferences: profile.notification_preferences as any,
        pool_interests: profile.pool_interests as any,
        investor_type: profile.investor_type as any,
        net_worth: profile.net_worth ? Number(profile.net_worth) : undefined,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, authUser: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
