import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const KNOWLEDGE_TEST_LS_KEY = 'vc.knowledgeTest.completed';

interface Question {
  q: string;
  options: { label: string; value: string }[];
  correct: string;
}

const QUESTIONS: Question[] = [
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
      { label: 'No — the only exit is the resale board', value: 'C' },
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

interface Props {
  open: boolean;
  onClose: () => void;
  onPass: () => void;
}

export const KnowledgeTestModal = ({ open, onClose, onPass }: Props) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>('');
  const [phase, setPhase] = useState<'quiz' | 'warning'>('quiz');
  const [acknowledged, setAcknowledged] = useState(false);

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setCurrent('');
    setPhase('quiz');
    setAcknowledged(false);
  };

  const handleNext = () => {
    if (!current) return;
    const newAnswers = [...answers, current];
    setAnswers(newAnswers);
    setCurrent('');

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // Evaluate
      const score = newAnswers.reduce(
        (acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0),
        0,
      );
      if (score >= 3) {
        localStorage.setItem(KNOWLEDGE_TEST_LS_KEY, JSON.stringify({ passed: true, date: new Date().toISOString() }));
        onPass();
        reset();
      } else {
        setPhase('warning');
      }
    }
  };

  const handleAcknowledge = () => {
    localStorage.setItem(KNOWLEDGE_TEST_LS_KEY, JSON.stringify({ passed: false, acknowledged: true, date: new Date().toISOString() }));
    onPass();
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg">
        {phase === 'quiz' ? (
          <>
            <DialogHeader>
              <DialogTitle>Knowledge Test</DialogTitle>
              <DialogDescription>
                A quick check before your first investment, required by ECSPR Article 21.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Question {step + 1} of {QUESTIONS.length}</span>
                  <span>{Math.round(((step) / QUESTIONS.length) * 100)}%</span>
                </div>
                <Progress value={(step / QUESTIONS.length) * 100} className="h-1.5" />
              </div>

              <div>
                <p className="mb-3 font-medium">{QUESTIONS[step].q}</p>
                <RadioGroup value={current} onValueChange={setCurrent} className="space-y-2">
                  {QUESTIONS[step].options.map(opt => (
                    <Label
                      key={opt.value}
                      htmlFor={`opt-${opt.value}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-normal hover:bg-muted/50"
                    >
                      <RadioGroupItem id={`opt-${opt.value}`} value={opt.value} />
                      <span>{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleNext} disabled={!current}>
                {step + 1 === QUESTIONS.length ? 'Submit' : 'Next'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Risk Warning — Required Acknowledgment
              </DialogTitle>
              <DialogDescription>
                Your answers indicate you may not yet be familiar with key risks. Please read and
                acknowledge the warning below before continuing.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 rounded-lg border border-warning/40 bg-warning/5 p-4 text-sm text-foreground/80">
              <p>• Startup investments carry a high risk of total loss.</p>
              <p>• Your capital is illiquid: after the vault closes, the only exit is the resale board, and liquidity is not guaranteed.</p>
              <p>• Past performance does not predict future results.</p>
              <p>• VaultCapital does not provide investment advice.</p>
            </div>

            <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm font-normal">
              <Checkbox
                checked={acknowledged}
                onCheckedChange={(v) => setAcknowledged(v === true)}
                className="mt-0.5"
              />
              <span>
                I understand that startup investments are high risk and I may lose all my capital.
              </span>
            </Label>

            <DialogFooter>
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAcknowledge} disabled={!acknowledged}>
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> I Acknowledge
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const hasCompletedKnowledgeTest = (): boolean => {
  try {
    const raw = localStorage.getItem(KNOWLEDGE_TEST_LS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.passed === true || parsed?.acknowledged === true;
  } catch {
    return false;
  }
};

export default KnowledgeTestModal;
