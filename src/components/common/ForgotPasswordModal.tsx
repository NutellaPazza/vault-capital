import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Mail, KeyRound, CheckCircle2, Eye, EyeOff, Check, X, Copy, RotateCcw, ShieldAlert } from 'lucide-react';

const passwordChecks = (pwd: string) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /[0-9]/.test(pwd),
  special: /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]/.test(pwd),
});

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

const TOTAL_STEPS = 3;
export const MAX_CODE_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 30;

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const ForgotPasswordModal = ({ open, onOpenChange, defaultEmail = '' }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState(defaultEmail);
  const [mockCode, setMockCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_CODE_ATTEMPTS);
  const [locked, setLocked] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCooldownInterval = () => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }
  };

  const startCooldown = () => {
    clearCooldownInterval();
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    cooldownIntervalRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearCooldownInterval();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      setStep(1);
      setEmail(defaultEmail);
      setMockCode('');
      setCodeInput('');
      setAttemptsLeft(MAX_CODE_ATTEMPTS);
      setLocked(false);
      setResendCooldown(0);
      clearCooldownInterval();
      setNewPassword('');
      setShowPassword(false);
      setDone(false);
    }
  }, [open, defaultEmail]);

  useEffect(() => () => clearCooldownInterval(), []);

  const checks = passwordChecks(newPassword);
  const passwordStrong = Object.values(checks).every(Boolean);

  const handleSendEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const code = generateCode();
    setMockCode(code);
    setAttemptsLeft(MAX_CODE_ATTEMPTS);
    setLocked(false);
    setCodeInput('');
    setIsLoading(false);
    toast({ title: 'Reset link sent', description: `A reset code was sent to ${email}.` });
    setStep(2);
    startCooldown();
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || locked) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const code = generateCode();
    setMockCode(code);
    setCodeInput('');
    setAttemptsLeft(MAX_CODE_ATTEMPTS);
    setIsLoading(false);
    toast({ title: 'Code resent', description: `A new reset code was sent to ${email}.` });
    startCooldown();
  };

  const handleStartOver = () => {
    setStep(1);
    setMockCode('');
    setCodeInput('');
    setAttemptsLeft(MAX_CODE_ATTEMPTS);
    setLocked(false);
    setResendCooldown(0);
    clearCooldownInterval();
  };

  const handleVerifyCode = () => {
    if (locked) return;
    if (codeInput.trim() !== mockCode) {
      const next = attemptsLeft - 1;
      setAttemptsLeft(next);
      if (next <= 0) {
        setLocked(true);
        toast({
          title: 'Too many attempts',
          description: "You've reached the maximum number of attempts. Please start over.",
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Invalid code',
          description: `The code does not match. ${next} attempt${next === 1 ? '' : 's'} remaining.`,
          variant: 'destructive',
        });
      }
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (!passwordStrong) {
      toast({ title: 'Weak password', description: 'Password does not meet all requirements.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setIsLoading(false);
    setDone(true);
    toast({ title: 'Password updated', description: 'You can now sign in with your new password.' });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(mockCode);
      toast({ title: 'Code copied', description: 'Mock code copied to clipboard.' });
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}</span>
              <span>{Math.round((Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100)}%</span>
            </div>
            <Progress value={(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100} className="h-1.5" />
          </div>
          {!done && step === 1 && (
            <>
              <DialogTitle>Reset your password</DialogTitle>
              <DialogDescription>
                Enter your email and we'll send you a reset code.
              </DialogDescription>
            </>
          )}
          {!done && step === 2 && (
            <>
              <DialogTitle>Enter your code</DialogTitle>
              <DialogDescription>
                We sent a 6-digit code to {email}. Enter it below to continue.
              </DialogDescription>
            </>
          )}
          {!done && step === 3 && (
            <>
              <DialogTitle>Set a new password</DialogTitle>
              <DialogDescription>
                Choose a strong password to secure your account.
              </DialogDescription>
            </>
          )}
          {done && (
            <>
              <DialogTitle>Password updated</DialogTitle>
              <DialogDescription>
                Your password has been reset. You can now sign in.
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {!done && step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fp-email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fp-email"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={isLoading || !email}>
                {isLoading ? 'Sending...' : (
                  <>Send reset code <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        )}

        {!done && step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-xs">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Demo mode. Mock code:</span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <div className="font-mono text-lg tracking-[0.4em] text-foreground" data-testid="mock-code">{mockCode}</div>
              <p className="mt-1 text-muted-foreground">
                In production this would be sent by email. For the demo it's shown here.
              </p>
            </div>

            {locked ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm"
              >
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <div className="font-medium text-destructive">Too many attempts</div>
                  <div className="text-muted-foreground">
                    You've reached the maximum of {MAX_CODE_ATTEMPTS} attempts. Start over to receive a new code.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="fp-code">Verification code</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fp-code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit code"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ''))}
                    className="pl-9 font-mono tracking-widest"
                    disabled={locked}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span data-testid="attempts-left">
                    {attemptsLeft} of {MAX_CODE_ATTEMPTS} attempts remaining
                  </span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isLoading}
                    className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                    data-testid="resend-button"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {locked ? (
                <Button onClick={handleStartOver} variant="destructive">
                  <RotateCcw className="mr-2 h-4 w-4" /> Start over
                </Button>
              ) : (
                <Button onClick={handleVerifyCode} disabled={codeInput.length !== 6 || isLoading}>
                  Verify <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {!done && step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fp-newpwd">New password</Label>
              <div className="relative">
                <Input
                  id="fp-newpwd"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              {newPassword.length > 0 && (
                <ul className="space-y-1 pt-1 text-xs">
                  {[
                    { ok: checks.length, label: 'At least 8 characters' },
                    { ok: checks.upper, label: 'One uppercase letter' },
                    { ok: checks.lower, label: 'One lowercase letter' },
                    { ok: checks.number, label: 'One number' },
                    { ok: checks.special, label: 'One special character' },
                  ].map((r, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {r.ok ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className="text-muted-foreground">{r.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(2)} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleResetPassword} disabled={isLoading || !passwordStrong}>
                {isLoading ? 'Updating...' : 'Update password'}
              </Button>
            </div>
          </div>
        )}

        {done && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-sm">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-700 dark:text-green-400">All set</div>
                <div className="text-muted-foreground">
                  Your password has been updated. Sign in with your new credentials.
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
