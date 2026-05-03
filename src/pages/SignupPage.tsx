import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { toast } from '@/hooks/use-toast';
import { InvestorType } from '@/types';
import { KNOWLEDGE_TEST_LS_KEY } from '@/components/common/KnowledgeTestModal';
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, ShieldCheck, Eye, EyeOff, Check, X } from 'lucide-react';

const passwordChecks = (pwd: string) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /[0-9]/.test(pwd),
  special: /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]/.test(pwd),
});

const QUESTIONS = [
  {
    q: 'What happens to your investment if the startup fails?',
    options: [
      { label: 'You get your money back', value: 'A' },
      { label: 'You may lose all invested capital', value: 'B' },
      { label: 'VaultCapital compensates you', value: 'C' },
    ],
    correct: 'B',
  },
  {
    q: 'Can you withdraw your investment after a vault closes?',
    options: [
      { label: 'Yes, anytime', value: 'A' },
      { label: 'Yes, within 30 days', value: 'B' },
      { label: 'No. The only exit is the resale board', value: 'C' },
    ],
    correct: 'C',
  },
  {
    q: 'What is a Special Purpose Vehicle (SPV)?',
    options: [
      { label: 'A type of bank account', value: 'A' },
      { label: 'A separate legal entity that holds startup shares on behalf of investors', value: 'B' },
      { label: 'A government guarantee fund', value: 'C' },
    ],
    correct: 'B',
  },
  {
    q: 'Startup investments are:',
    options: [
      { label: 'Guaranteed by Consob', value: 'A' },
      { label: 'Illiquid and high risk', value: 'B' },
      { label: 'Similar to savings accounts', value: 'C' },
    ],
    correct: 'B',
  },
];

const TOTAL_STEPS = 4;

const SignupPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const pwdChecks = passwordChecks(password);
  const pwdMetCount = Object.values(pwdChecks).filter(Boolean).length;
  const categoriesMet = [pwdChecks.upper, pwdChecks.lower, pwdChecks.number, pwdChecks.special].filter(Boolean).length;
  const passwordStrong = pwdMetCount === 5;
  let strengthBars = 0;
  let strengthLabel = '';
  let strengthColor = '';
  if (password.length > 0) {
    if (passwordStrong) {
      strengthBars = 4; strengthLabel = 'Strong password'; strengthColor = 'bg-green-500';
    } else if (pwdChecks.length && categoriesMet >= 2) {
      strengthBars = 3; strengthLabel = 'Medium'; strengthColor = 'bg-yellow-500';
    } else if (pwdChecks.length && categoriesMet >= 1) {
      strengthBars = 2; strengthLabel = 'Weak'; strengthColor = 'bg-orange-500';
    } else if (pwdChecks.length) {
      strengthBars = 1; strengthLabel = 'Very weak'; strengthColor = 'bg-red-500';
    } else {
      strengthBars = 1; strengthLabel = 'Very weak'; strengthColor = 'bg-red-500';
    }
  }

  // Step 2
  const [investorType, setInvestorType] = useState<InvestorType>('non_sophisticated');
  const [netWorth, setNetWorth] = useState('');

  // Step 3
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [acknowledged, setAcknowledged] = useState(false);

  // Step 4
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRegulatory, setAgreeRegulatory] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);

  const score = QUESTIONS.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0,
  );
  const allAnswered = QUESTIONS.every((_, i) => !!answers[i]);
  const passed = allAnswered && score >= 3;
  const failed = allAnswered && score < 3;

  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep(s => Math.max(s - 1, 1));

  const handleStep1 = () => {
    if (!name || !email || !password) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email.', variant: 'destructive' });
      return;
    }
    if (!passwordStrong) {
      toast({ title: 'Weak password', description: 'Password does not meet all requirements.', variant: 'destructive' });
      return;
    }
    goNext();
  };

  const handleStep3 = () => {
    if (!allAnswered) return;
    if (failed && !acknowledged) return;
    localStorage.setItem(
      KNOWLEDGE_TEST_LS_KEY,
      JSON.stringify({
        passed,
        acknowledged: failed ? true : false,
        date: new Date().toISOString(),
      }),
    );
    goNext();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name },
      },
    });
    if (error || !data.user) {
      setIsLoading(false);
      toast({
        title: 'Signup Failed',
        description: error?.message || 'Something went wrong.',
        variant: 'destructive',
      });
      return;
    }

    // Update profile with investor info (trigger already created the row)
    if (data.user) {
      await supabase
        .from('profiles')
        .update({
          investor_type: investorType,
          ...(investorType === 'non_sophisticated' && netWorth
            ? { net_worth: parseFloat(netWorth) }
            : {}),
        })
        .eq('user_id', data.user.id);
    }

    setIsLoading(false);

    if (!data.session) {
      toast({
        title: 'Check your email',
        description: 'We sent you a confirmation link to activate your account.',
      });
      navigate('/login');
    } else {
      toast({ title: 'Account Created', description: 'Welcome to VaultCapital.' });
      navigate('/dashboard');
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin + '/dashboard',
    });
    if (result.error) {
      setIsLoading(false);
      toast({ title: 'Google sign-up failed', description: String(result.error), variant: 'destructive' });
    }
  };

  const stepTitles: Record<number, { title: string; subtitle?: string }> = {
    1: { title: 'Create your account', subtitle: 'Join VaultCapital and start investing in startups.' },
    2: {
      title: 'Tell us about your investor profile',
      subtitle: 'Required by EU Crowdfunding Regulation (ECSPR) to ensure appropriate investor protections.',
    },
    3: {
      title: 'Knowledge & Experience Assessment',
      subtitle: 'Required by EU Crowdfunding Regulation before your first investment. If you don’t pass, you can still invest after acknowledging the risk warning.',
    },
    4: { title: 'Almost done', subtitle: 'Review and confirm to create your account.' },
  };

  const current = stepTitles[step];

  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Step {step} of {TOTAL_STEPS}</span>
              <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
          </div>
          <CardTitle className="text-2xl">{current.title}</CardTitle>
          {current.subtitle && <CardDescription>{current.subtitle}</CardDescription>}
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={isLoading}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or sign up with email</span></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Alex Demo" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strengthBars ? strengthColor : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="min-w-[5.5rem] text-right text-xs font-medium text-muted-foreground">{strengthLabel}</span>
                    </div>

                    <ul className="space-y-1 text-xs">
                      {[
                        { ok: pwdChecks.length, label: 'At least 8 characters' },
                        { ok: pwdChecks.upper, label: 'One uppercase letter' },
                        { ok: pwdChecks.lower, label: 'One lowercase letter' },
                        { ok: pwdChecks.number, label: 'One number' },
                        { ok: pwdChecks.special, label: 'One special character' },
                      ].map((r, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {r.ok ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-red-500" />
                          )}
                          <span className={r.ok ? 'text-muted-foreground' : 'text-muted-foreground'}>{r.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Investor type</Label>
                <RadioGroup
                  value={investorType}
                  onValueChange={(v) => setInvestorType(v as InvestorType)}
                  className="space-y-2"
                >
                  <Label htmlFor="non_soph" className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm font-normal hover:bg-muted/50 [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem id="non_soph" value="non_sophisticated" className="mt-0.5" />
                    <div>
                      <div className="font-medium">Non-sophisticated investor</div>
                      <div className="text-muted-foreground">I am a retail investor (default protection applies).</div>
                    </div>
                  </Label>
                  <Label htmlFor="soph" className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm font-normal hover:bg-muted/50 [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem id="soph" value="sophisticated" className="mt-0.5" />
                    <div>
                      <div className="font-medium">Sophisticated investor</div>
                      <div className="text-muted-foreground">I qualify as a professional investor under MiFID II.</div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {investorType === 'non_sophisticated' && (
                <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                  <Label htmlFor="net_worth" className="text-sm">
                    Approximate net worth (optional. Used to calculate your investment cap)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Non-sophisticated investors are capped at max(€1,000 or 5% of net worth) per vault per ECSPR Art. 21.
                  </p>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">€</span>
                    <Input
                      id="net_worth"
                      type="number"
                      min="0"
                      placeholder="e.g. 50000"
                      value={netWorth}
                      onChange={(e) => setNetWorth(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is not verified at signup. Investment caps are enforced automatically by the platform.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              {QUESTIONS.map((q, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-sm font-medium">
                    {i + 1}. {q.q}
                  </p>
                  <RadioGroup
                    value={answers[i] || ''}
                    onValueChange={(v) => {
                      if (answers[i]) return; // lock once answered
                      setAnswers(prev => ({ ...prev, [i]: v }));
                    }}
                    className="space-y-1.5"
                  >
                    {q.options.map(opt => {
                      const isLocked = !!answers[i];
                      const isSelected = answers[i] === opt.value;
                      return (
                        <Label
                          key={opt.value}
                          htmlFor={`q${i}-${opt.value}`}
                          className={`flex items-center gap-3 rounded-lg border p-3 text-sm font-normal [&:has([data-state=checked])]:border-primary ${
                            isLocked
                              ? `cursor-not-allowed ${isSelected ? 'opacity-100' : 'opacity-50'}`
                              : 'cursor-pointer hover:bg-muted/50'
                          }`}
                        >
                          <RadioGroupItem id={`q${i}-${opt.value}`} value={opt.value} disabled={isLocked} />
                          <span>{opt.label}</span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                  {answers[i] && (
                    <p className="text-xs text-muted-foreground pl-1">Answer locked.</p>
                  )}
                </div>
              ))}

              {passed && (
                <div className="flex items-start gap-3 rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-700 dark:text-green-400">Assessment passed</div>
                    <div className="text-muted-foreground">You scored {score} of {QUESTIONS.length}. You can continue to the next step.</div>
                  </div>
                </div>
              )}

              {failed && (
                <div className="-mx-6 space-y-0">
                  <div className="flex items-start gap-3 border-y border-amber-500/40 bg-amber-500/10 px-6 py-4 text-sm">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <div className="font-medium text-amber-700 dark:text-amber-400">You didn’t pass the assessment</div>
                      <div className="text-muted-foreground">You scored {score} of {QUESTIONS.length}. You can still proceed, but you must read and acknowledge the risk warning below.</div>
                    </div>
                  </div>

                  <div className="bg-red-950 px-6 py-10 text-white">
                    <div className="mx-auto max-w-xl space-y-6">
                      <div className="flex flex-col items-center text-center">
                        <AlertTriangle className="!h-12 !w-12 text-red-400" strokeWidth={2} />
                        <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                          Risk Warning. Required Reading
                        </h3>
                        <p className="mt-2 text-sm text-red-300">
                          You must read and acknowledge the following before continuing.
                        </p>
                      </div>

                      <div className="h-px w-full bg-red-400/30" />

                      <div className="space-y-4 text-base leading-relaxed text-white/95">
                        <p>
                          Startup investments carry a high risk of total loss. You may lose all of the
                          capital you invest. There is no guarantee of returns or capital protection.
                        </p>
                        <p>
                          These investments are illiquid. Once a vault closes, you cannot withdraw your
                          capital. Your only exit option is the resale board, where no buyer is guaranteed.
                        </p>
                        <p>
                          Past performance of other investments is not indicative of future results.
                        </p>
                        <p>
                          VaultCapital does not provide investment advice. Nothing on this platform
                          constitutes a personalized investment recommendation.
                        </p>
                        <p>
                          Investment caps apply: non-sophisticated investors are limited to max(€1,000
                          or 5% of net worth) per vault under ECSPR Article 21.
                        </p>
                      </div>

                      <div className="h-px w-full bg-red-400/30" />

                      <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-400/40 bg-red-900/40 p-4 text-base font-normal text-white hover:bg-red-900/60">
                        <Checkbox
                          checked={acknowledged}
                          onCheckedChange={(v) => setAcknowledged(v === true)}
                          className="mt-0.5 border-red-300 data-[state=checked]:border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                        />
                        <span className="leading-relaxed">
                          I have read and fully understood the above risk warning. I acknowledge that
                          startup investing is high risk, illiquid, and I may lose all invested capital.
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-muted-foreground">
                  Please review and confirm the following before creating your account.
                </p>
              </div>

              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm font-normal">
                <Checkbox checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(v === true)} className="mt-0.5" />
                <span>
                  I have read and agree to the{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service and Conflicts of Interest Policy
                  </a>
                  .
                </span>
              </Label>

              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm font-normal">
                <Checkbox checked={agreeRegulatory} onCheckedChange={(v) => setAgreeRegulatory(v === true)} className="mt-0.5" />
                <span>
                  I have read the{' '}
                  <a
                    href="/regulatory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Regulatory & Compliance page
                  </a>{' '}
                  and understand VaultCapital operates under ECSPR (Reg. EU 2020/1503).
                </span>
              </Label>

              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm font-normal">
                <Checkbox checked={agreeAge} onCheckedChange={(v) => setAgreeAge(v === true)} className="mt-0.5" />
                <span>
                  I confirm I am at least 18 years old and a resident of the European Union.
                </span>
              </Label>

              <p className="text-xs text-muted-foreground">
                Links open in a new tab so you don't lose your progress.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {step > 1 ? (
              <Button variant="outline" onClick={goBack} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <span />
            )}

            {step === 1 && (
              <Button onClick={handleStep1} disabled={!name || !email || !passwordStrong}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === 2 && (
              <Button onClick={goNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === 3 && (
              <Button
                onClick={handleStep3}
                disabled={!allAnswered || (failed && !acknowledged)}
                variant={failed && acknowledged ? 'destructive' : 'default'}
              >
                {failed ? 'I Acknowledge. Continue' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === 4 && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !agreeTerms || !agreeRegulatory || !agreeAge}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            )}
          </div>

          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
