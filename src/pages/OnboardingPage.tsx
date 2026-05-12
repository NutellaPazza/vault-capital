import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  Shield,
  Target,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Scale,
  Rocket,
} from 'lucide-react';
import type { RiskProfile, InvestorType, DealStage } from '@/types';

const SECTORS = ['Fintech', 'Healthtech', 'Climate', 'AI/ML', 'SaaS', 'Consumer', 'Deeptech', 'Mobility'];
const STAGES: { value: DealStage; label: string }[] = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
];

const RISK_OPTIONS: { value: RiskProfile; title: string; desc: string; icon: any }[] = [
  { value: 'conservative', title: 'Conservative', desc: 'Lower variance. Prefer late-stage, proven traction.', icon: Shield },
  { value: 'balanced', title: 'Balanced', desc: 'Mixed exposure across stages and sectors.', icon: Scale },
  { value: 'aggressive', title: 'Aggressive', desc: 'High upside. Comfortable with early-stage risk.', icon: Rocket },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, updateUserProfile } = useAppStore();
  const [step, setStep] = useState(0);

  const [investorType, setInvestorType] = useState<InvestorType>('non_sophisticated');
  const [netWorth, setNetWorth] = useState<string>('');
  const [risk, setRisk] = useState<RiskProfile>('balanced');
  const [sectors, setSectors] = useState<string[]>([]);
  const [stages, setStages] = useState<DealStage[]>([]);
  const [kyc, setKyc] = useState({ fullName: currentUser?.name || '', dob: '', country: '', idNumber: '' });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleSector = (s: string) =>
    setSectors(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  const toggleStage = (s: DealStage) =>
    setStages(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));

  const canContinue = () => {
    if (step === 1) return !!netWorth && Number(netWorth) >= 0;
    if (step === 3) return sectors.length > 0;
    if (step === 4) return kyc.fullName.trim().length > 1 && !!kyc.dob && kyc.country.trim().length > 1 && kyc.idNumber.trim().length > 3;
    return true;
  };

  const handleFinish = async () => {
    updateUserProfile({
      investor_type: investorType,
      net_worth: Number(netWorth) || 0,
      risk_profile: risk,
      pool_interests: { industries: sectors, stages },
      kyc_status: 'verified',
      onboarding_completed: true,
    } as any);
    toast({ title: 'Welcome aboard', description: 'Your profile is ready. Start exploring vaults.' });
    navigate('/dashboard');
  };

  const next = () => (step === totalSteps - 1 ? handleFinish() : setStep(s => s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Welcome to VaultCapital</span>
          </div>
          <Badge variant="secondary">Step {step + 1} / {totalSteps}</Badge>
        </div>
        <Progress value={progress} className="mb-8 h-1.5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Hi {currentUser.name.split(' ')[0]}, let's set up your investor profile</CardTitle>
                  <CardDescription>
                    A short 5-step setup so we can show vaults that match your goals. Your data stays private and is used only to personalize the experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3"><Target className="mt-0.5 h-4 w-4 text-primary" /><span>Define your risk appetite and sector preferences.</span></div>
                  <div className="flex items-start gap-3"><Shield className="mt-0.5 h-4 w-4 text-primary" /><span>Complete a simulated KYC check to unlock investing.</span></div>
                  <div className="flex items-start gap-3"><Layers className="mt-0.5 h-4 w-4 text-primary" /><span>Get vaults curated to your taste from day one.</span></div>
                </CardContent>
              </Card>
            )}

            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Investor classification</CardTitle>
                  <CardDescription>Required by ECSPR (EU 2020/1503). You can change this later.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { v: 'non_sophisticated' as InvestorType, t: 'Non-sophisticated', d: 'Standard retail investor with cooldown protections.' },
                      { v: 'sophisticated' as InvestorType, t: 'Sophisticated', d: 'Professional / experienced investor.' },
                    ].map(opt => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setInvestorType(opt.v)}
                        className={`rounded-lg border p-4 text-left transition ${investorType === opt.v ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                      >
                        <div className="font-medium">{opt.t}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{opt.d}</div>
                      </button>
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="nw">Estimated net worth (EUR)</Label>
                    <Input id="nw" type="number" min={0} placeholder="e.g. 50000" value={netWorth} onChange={e => setNetWorth(e.target.value)} className="mt-1.5" />
                    <p className="mt-1 text-xs text-muted-foreground">Used to enforce regulatory exposure limits.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Risk profile</CardTitle>
                  <CardDescription>Pick the strategy that best describes you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {RISK_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    const active = risk === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRisk(opt.value)}
                        className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                      >
                        <Icon className={`mt-0.5 h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <div className="font-medium">{opt.title}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</div>
                        </div>
                        {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sector & stage preferences</CardTitle>
                  <CardDescription>Select at least one sector. Stages are optional.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Sectors</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {SECTORS.map(s => {
                        const active = sectors.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSector(s)}
                            className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/40'}`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Stages</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {STAGES.map(s => {
                        const active = stages.includes(s.value);
                        return (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => toggleStage(s.value)}
                            className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/40'}`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Identity verification</CardTitle>
                  <CardDescription>
                    Simulated KYC for the MVP. In production this is handled by a regulated KYC provider (e.g. Onfido, Sumsub).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="fn">Full legal name</Label>
                      <Input id="fn" value={kyc.fullName} onChange={e => setKyc({ ...kyc, fullName: e.target.value })} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of birth</Label>
                      <Input id="dob" type="date" value={kyc.dob} onChange={e => setKyc({ ...kyc, dob: e.target.value })} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="co">Country of residence</Label>
                      <Input id="co" value={kyc.country} onChange={e => setKyc({ ...kyc, country: e.target.value })} placeholder="Italy" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="idn">ID document number</Label>
                      <Input id="idn" value={kyc.idNumber} onChange={e => setKyc({ ...kyc, idNumber: e.target.value })} placeholder="AB1234567" className="mt-1.5" />
                    </div>
                  </div>
                  <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                    <TrendingUp className="mr-1.5 inline h-3.5 w-3.5" />
                    By submitting you confirm the data is accurate. This is a demo verification and approves you instantly.
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={next} disabled={!canContinue()} className="gap-1.5">
            {step === totalSteps - 1 ? 'Complete setup' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
