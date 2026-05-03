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
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
    ]);

    if (!profile) return;

    const isAdmin = !!roles?.some(r => r.role === 'admin');

    useAppStore.setState({
      isAuthenticated: true,
      isAdmin,
      demoMode: false,
      // Clean slate: real users start with no mock data at all
      deals: [],
      pools: [],
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
