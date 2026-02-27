import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Search, Clock, Shield, TrendingUp, ArrowLeft, CheckCircle,
  Banknote, Scale, Vote, Coins, FileText, HandCoins, Users,
  ArrowRight, Building2, PieChart, AlertTriangle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const steps = [
  {
    icon: Search,
    title: '1. Deal Sourcing & Due Diligence',
    description: 'Our team identifies high-potential startups across Europe. We conduct thorough due diligence — analyzing the team, market opportunity, traction, financials, and legal structure. Only startups that pass our rigorous selection process are presented to investors.',
  },
  {
    icon: Clock,
    title: '2. Pool Opens (72 Hours)',
    description: 'When a deal is approved, we open an investment pool for exactly 72 hours. During this window, investors can commit capital starting from just €100. The pool has a target raise amount and a minimum that must be met for the deal to proceed.',
  },
  {
    icon: Shield,
    title: '3. SPV Formation & Investment',
    description: 'Once the pool closes successfully, VaultCapital creates a Special Purpose Vehicle (SPV) — a separate legal entity that pools all investor capital. The SPV then invests directly in the startup on behalf of all participants under pre-negotiated terms.',
  },
  {
    icon: TrendingUp,
    title: '4. Ownership & Monitoring',
    description: 'Your position appears in your portfolio with your ownership percentage, estimated value, and all startup updates. You can hold your position or list it on the resale board.',
  },
  {
    icon: HandCoins,
    title: '5. Exit Objectives & Distribution',
    description: 'Each vault includes exit objectives, set by VaultCapital based on the company, stage, and market. These objectives explain what we aim for — such as a target return multiple, revenue growth milestones, or a valuation threshold.',
    extraParagraphs: [
      'Exit events (acquisition, IPO, or a secondary sale opportunity) may create liquidity, but we don\'t automatically sell. We act based on the vault\'s objectives and the best available execution at the time.',
      'When a sale happens, proceeds are distributed pro rata to investors after fees (carry applies only on profit).',
    ],
    disclaimer: 'Objectives are targets, not guarantees.',
  },
];

const HowItWorksPage = () => (
  <div className="container py-8">
    <Button variant="ghost" size="sm" className="mb-6" asChild>
      <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Home</Link>
    </Button>

    <div className="mb-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">How VaultCapital Works</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        From deal sourcing to exit distribution here's how we make private startup investing accessible, transparent, and secure.
      </p>
    </div>

    {/* Process Steps */}
    <section className="mb-16">
      <div className="space-y-6">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardContent className="flex gap-6 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {'extraParagraphs' in step && (step as any).extraParagraphs?.map((p: string, i: number) => (
                  <p key={i} className="mt-2 text-muted-foreground">{p}</p>
                ))}
                {'disclaimer' in step && (step as any).disclaimer && (
                  <p className="mt-3 text-xs font-medium text-muted-foreground/70 italic">{(step as any).disclaimer}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <Separator className="mb-16" />

    {/* Legal Structure (SPV) — DETAILED */}
    <section className="mb-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Legal Structure (SPV)</h2>
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">What is an SPV?</h3>
            </div>
            <p className="mb-4 text-muted-foreground">
              A Special Purpose Vehicle (SPV) is an independent legal entity created specifically to hold a single investment. 
              When you invest through VaultCapital, your capital is pooled into an SPV alongside other investors. 
              This SPV — not VaultCapital directly — makes the investment in the startup.
            </p>
            <p className="text-muted-foreground">
              This means your investment is legally separated from VaultCapital's operating business. 
              Even if VaultCapital ceases operations, the SPV holding your investment continues to exist 
              as a separate legal entity with its own rights.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Governance & Voting Rights</h3>
            </div>
            <p className="mb-4 text-muted-foreground">
              VaultCapital acts as the <strong>nominee and manager</strong> of each SPV. This means:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span><strong>Voting rights</strong> are exercised by VaultCapital on behalf of all pool participants. This simplifies governance and ensures a single, coherent voice at the cap table.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span><strong>Investors hold economic rights only</strong> — you benefit from capital appreciation, dividends, and exit proceeds proportional to your investment. You do not have direct voting power in the startup's decisions.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span><strong>Major decisions</strong> (e.g., whether to accept an acquisition offer, participate in follow on rounds, or exit) are handled by VaultCapital's investment committee under a documented policy. Investors receive updates before and after major actions when possible.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span><strong>Conflict of interest policy:</strong> VaultCapital does not invest its own capital alongside pool investors to avoid conflicts. Our revenue comes exclusively from fees. Any potential conflicts are disclosed deal by deal.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Coins className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Dividends & Distributions</h3>
            </div>
            <p className="mb-4 text-muted-foreground">
              If a startup in your portfolio pays dividends, here's how it works:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Dividends are received by the SPV and distributed <strong>pro-rata</strong> to all investors based on their ownership percentage.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Distributions are credited directly to your VaultCapital wallet balance.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Note: Most early-stage startups do <strong>not</strong> pay dividends. Returns typically come from exit events (acquisitions, IPOs).</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Tax implications of dividends and capital gains are the investor's responsibility. VaultCapital provides annual statements for tax reporting.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Exit Process — Step by Step</h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold">1. A liquidity opportunity appears</h4>
                <p className="text-sm text-muted-foreground">
                  An acquisition, IPO, or a secondary sale opportunity may create liquidity.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold">2. We check the vault's exit objectives</h4>
                <p className="text-sm text-muted-foreground">
                  We compare the opportunity to the vault's objectives and current market conditions. We may sell, sell partially, or hold.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold">3. Execution and settlement</h4>
                <p className="text-sm text-muted-foreground">
                  If we proceed, the SPV completes the transaction and receives proceeds.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold">4. Carry fee (profit only)</h4>
                <p className="text-sm text-muted-foreground">
                  If proceeds exceed invested capital, a 2% carry is applied on profit only. If there's no profit, no carry is charged.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold">5. Distribution to investors</h4>
                <p className="text-sm text-muted-foreground">
                  Net proceeds are distributed pro rata to investors' wallets. A transaction summary is shown in the vault and wallet history.
                </p>
              </div>
              <p className="text-xs text-muted-foreground/70 italic">
                If no liquidity event occurs, the position remains illiquid until an opportunity is available.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">What Happens If the Pool Doesn't Reach Its Target?</h3>
            </div>
            <p className="text-muted-foreground">
              If a pool doesn't reach its minimum funding target within the 72-hour window, <strong>the pool fails</strong> and 
              all committed capital is automatically refunded to investors' wallets. No fees are charged on failed pools. 
              You'll receive a notification and the full amount will appear back in your wallet within 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator className="mb-16" />

    {/* Fee Structure — DETAILED */}
    <section className="mb-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Fee Structure</h2>
      <div className="mx-auto max-w-4xl">
        <p className="mb-8 text-center text-muted-foreground">
          We believe in simple, transparent pricing. No hidden fees, no annual management fees. 
          You only pay when you invest or when you profit.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-primary/20">
            <CardContent className="p-6 text-center">
              <Banknote className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="text-4xl font-bold text-primary">2%</p>
              <h3 className="mt-2 text-lg font-semibold">Entry Fee</h3>
              <Separator className="my-4" />
              <ul className="space-y-2 text-left text-sm text-muted-foreground">
                <li>• Applied at the time of investment</li>
                <li>• Deducted from your invested amount</li>
                <li>• Covers deal sourcing, due diligence, SPV formation, and legal costs</li>
                <li>• Example: Invest €1,000 → €980 goes into the pool, €20 entry fee</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="text-4xl font-bold text-primary">2%</p>
              <h3 className="mt-2 text-lg font-semibold">Carry Fee</h3>
              <Separator className="my-4" />
              <ul className="space-y-2 text-left text-sm text-muted-foreground">
                <li>• Applied only on profits at exit</li>
                <li>• No profit = no carry fee</li>
                <li>• Calculated on the difference between exit proceeds and original investment</li>
                <li>• Example: Invest €1,000, exit at €5,000 → profit €4,000 → carry fee €80</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6 text-center">
              <PieChart className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="text-4xl font-bold text-primary">1%</p>
              <h3 className="mt-2 text-lg font-semibold">Marketplace Fee</h3>
              <Separator className="my-4" />
              <ul className="space-y-2 text-left text-sm text-muted-foreground">
                <li>• Applied on resale board transactions</li>
                <li>• Paid by the buyer, not the seller</li>
                <li>• Covers transaction processing and position transfer</li>
                <li>• Example: Buy a €5,000 listing → you pay €5,050 total</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="mb-3 text-lg font-semibold">What We Don't Charge</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" /> No annual management fees
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" /> No account maintenance fees
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" /> No withdrawal fees
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" /> No fees on failed pools (full refund)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* CTA */}
    <section className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
      <h2 className="mb-4 text-3xl font-bold">Questions?</h2>
      <p className="mb-8 text-primary-foreground/80">Check our FAQ for detailed answers or contact us directly.</p>
      <div className="flex justify-center gap-4">
        <Button size="lg" variant="secondary" asChild>
          <Link to="/faq">Read FAQ</Link>
        </Button>
        <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default HowItWorksPage;
