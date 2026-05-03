import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const checks = (p: string) => ({
  length: p.length >= 8,
  upper: /[A-Z]/.test(p),
  lower: /[a-z]/.test(p),
  number: /[0-9]/.test(p),
  special: /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]/.test(p),
});

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRecovery, setHasRecovery] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash; the SDK auto-creates a session.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasRecovery(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const c = checks(password);
  const strong = Object.values(c).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strong) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Password updated', description: 'You can now sign in.' });
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Set a new password</CardTitle>
          <CardDescription>Choose a strong password to secure your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasRecovery ? (
            <p className="text-sm text-muted-foreground">
              This page is only valid through the reset link sent to your email. Please request a new reset email from the sign-in page.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pwd">New password</Label>
                <div className="relative">
                  <Input id="pwd" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="pr-10" autoComplete="new-password" />
                  <button type="button" onClick={() => setShow(s => !s)} className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground" tabIndex={-1}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <ul className="space-y-1 pt-1 text-xs">
                    {[
                      { ok: c.length, label: 'At least 8 characters' },
                      { ok: c.upper, label: 'One uppercase letter' },
                      { ok: c.lower, label: 'One lowercase letter' },
                      { ok: c.number, label: 'One number' },
                      { ok: c.special, label: 'One special character' },
                    ].map((r, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {r.ok ? <Check className="h-3.5 w-3.5 text-green-600" /> : <X className="h-3.5 w-3.5 text-red-500" />}
                        <span className="text-muted-foreground">{r.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading || !strong}>
                {loading ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
