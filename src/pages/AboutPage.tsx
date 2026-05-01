import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, ArrowRight, Check, X, Lock, Shield, Link2, Users,
  FileCheck, Rocket, Building2, TrendingUp, Sparkles, Linkedin, Github,
} from 'lucide-react';

const socialProof = [
  { value: '1.2K+', label: 'Waitlist signups' },
  { value: '47', label: 'Startup applications received' },
  { value: '6', label: 'Advisors onboard' },
  { value: '4', label: 'Founders, zero outside hires' },
];

const stats = [
  {
    value: '€10T+',
    label: 'EU household deposits sitting in low-yield savings (ECB, Q3 2025)',
    primary: true,
  },
  {
    value: '€100',
    label: 'Minimum investment on VaultCapital. The same deals, a fraction of the ticket',
    primary: false,
  },
  {
    value: '€10B',
    label: 'Estimated serviceable market for retail-accessible private startup exposure',
    primary: false,
  },
];

const comparison = [
  {
    title: 'Traditional Crowdfunding',
    icon: X,
    highlight: false,
    points: [
      'No pre-negotiated deal terms',
      'No legal structure protecting investors',
      'No secondary market',
      'Fragmented cap table for startups',
    ],
  },
  {
    title: 'VaultCapital',
    icon: Check,
    highlight: true,
    tag: 'Our model',
    points: [
      'Pre-negotiated standardized terms',
      'SPV structure with ring-fenced liability',
      'Resale board for secondary liquidity',
      'One clean cap table entry for the startup',
      'ECSPR-regulated under Consob authorization',
    ],
  },
  {
    title: 'VC / PE Funds',
    icon: Lock,
    highlight: false,
    points: [
      'Structured and professional',
      'Minimum €50,000+ ticket',
      'Accredited investors only',
      'No retail access',
    ],
  },
];

const team = [
  {
    initials: 'GD',
    name: 'Giovanni De Stasio',
    role: 'Founder & Team Leader',
    university: 'Bocconi University. BSc Economics & Finance',
    why: 'I want my generation to access the same deals my professors talk about behind closed doors.',
    points: [
      'Python development and quantitative financial modeling',
      'Built a multi-model options pricer from scratch',
      'Contributed to €700K startup fundraising and partnership discussions',
      'B2B pipeline development and deal negotiation',
    ],
  },
  {
    initials: 'MR',
    name: 'Michele Rubinaccio',
    role: 'Co-Founder',
    university: 'Bocconi University. BSc Management / Federico II',
    why: 'Two degrees taught me one thing: the gap between retail and institutional is artificial.',
    points: [
      "Pursuing two bachelor's degrees simultaneously",
      'B2B pipeline development and commercial negotiation',
      'Startup deal sourcing and investor relations',
    ],
  },
  {
    initials: 'GF',
    name: 'Gianluigi Ferrara',
    role: 'Co-Founder',
    university: 'Federico II. Informatic Engineering',
    why: 'Code is leverage. We are using it to dismantle a financial barrier that should not exist.',
    points: [
      'Python and C++ development',
      'Full-stack web design and product engineering',
      '2nd place, Math Olympics. Campania region',
    ],
  },
  {
    initials: 'MM',
    name: 'Michele Migliucci',
    role: 'Co-Founder',
    university: 'Vanvitelli. Mathematics',
    why: 'Math is the cleanest way to model fairness. Our pro-rata payout is exactly that.',
    points: [
      'Python and C++ development',
      'Quantitative modeling and algorithmic systems',
      '1st place, Math Olympics. Campania region',
    ],
  },
];

const moat = [
  {
    number: '01',
    icon: Shield,
    title: 'Regulatory First',
    body: 'We designed for ECSPR compliance from day one. License application, SPV structure, investor protections, KIIS documentation. Not bolted on after the fact.',
  },
  {
    number: '02',
    icon: Link2,
    title: 'Aligned Incentives',
    body: 'We charge a 2% exit fee only on profit. If investors lose money, we earn nothing. Our revenue is structurally tied to investor success.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Founder-Built',
    body: 'Every product decision comes from people who understand both the financial markets and the code. No middle layer between vision and execution.',
  },
];

const roadmap = [
  {
    period: 'Q4 2025',
    icon: FileCheck,
    title: 'ECSPR license application',
    body: 'Filing with Consob. Legal architecture and KIIS templates ready.',
    status: 'in-progress',
  },
  {
    period: 'Q1 2026',
    icon: Rocket,
    title: 'Private beta launch',
    body: 'First Vault opened to the waitlist. Two pre-vetted startups onboarded.',
    status: 'next',
  },
  {
    period: 'Q3 2026',
    icon: Building2,
    title: 'Public launch and Resale Board',
    body: 'Open registrations. Secondary market live with 1% buyer fee.',
    status: 'planned',
  },
  {
    period: 'Q2 2027',
    icon: TrendingUp,
    title: '€10M AUM milestone',
    body: 'Target: 25 active Vaults, first exit distributions to investors.',
    status: 'planned',
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Back link */}
      <div className="container px-4 pt-6 md:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* SECTION 1 — Hero */}
      <section className="relative overflow-hidden bg-foreground text-background mt-6">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(var(--background)) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Big background numeral */}
        <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none text-[180px] font-black leading-none tracking-tighter text-background/[0.04] sm:text-[260px] md:right-12 md:text-[360px]">
          01
        </div>
        {/* Decorative initials pattern */}
        <div className="pointer-events-none absolute left-4 bottom-4 hidden gap-2 text-[10px] font-mono uppercase tracking-widest text-background/20 md:flex">
          <span>GD</span><span>·</span><span>MR</span><span>·</span><span>GF</span><span>·</span><span>MM</span>
        </div>

        <div className="container relative px-4 py-14 sm:py-20 md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              <span className="h-px w-6 bg-primary" />
              01 / Our Story
              <span className="h-px w-6 bg-primary" />
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight sm:mt-4 sm:text-4xl md:text-6xl">
              Venture investing
              <br />
              <span className="text-primary">for the rest of us.</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-background/70 sm:mt-6 sm:text-base md:text-lg">
              We are a team of four Bocconi and Federico II students who got tired of watching
              the best startup deals go exclusively to VCs and wealthy insiders. So we built
              the infrastructure to change that.
            </p>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="relative border-t border-background/10 bg-background/[0.02]">
          <div className="container grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 md:gap-8 md:px-6 md:py-8">
            {socialProof.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="text-xl font-bold tracking-tight text-background sm:text-2xl md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-background/50 sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — The Problem (asymmetric stats) */}
      <section className="border-b border-border bg-background">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
                02 / The Problem
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                The access gap is real.
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:space-y-4 sm:text-base md:text-lg">
                <p>
                  There is over €10 trillion sitting in European household deposits. Meanwhile,
                  the best private market deals, the ones that generate outsized returns, are
                  accessible only to institutional investors and high-net-worth individuals
                  who can write €50,000+ checks. Retail investors are locked out. Not because
                  they lack the interest or the capital, but because the infrastructure to
                  include them has never existed.
                </p>
                <p className="font-medium text-foreground">
                  We are building that infrastructure.
                </p>
              </div>
            </div>

            {/* Asymmetric stat layout */}
            <div className="grid gap-3 sm:gap-4">
              {/* Hero stat */}
              <Card className="overflow-hidden border-2 border-primary bg-primary/5">
                <CardContent className="p-5 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    The headline number
                  </p>
                  <p className="mt-2 text-5xl font-bold leading-none tracking-tight text-primary sm:text-6xl md:text-7xl">
                    {stats[0].value}
                  </p>
                  <p className="mt-3 text-sm text-foreground sm:text-base">{stats[0].label}</p>
                </CardContent>
              </Card>
              {/* Secondary stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.slice(1).map((s) => (
                  <Card key={s.value} className="border-l-4 border-l-primary/40">
                    <CardContent className="p-4 sm:p-5">
                      <p className="text-2xl font-bold tracking-tight sm:text-3xl">{s.value}</p>
                      <p className="mt-1.5 text-xs leading-snug text-muted-foreground sm:mt-2 sm:text-sm">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Our Solution (dominant comparison) */}
      <section className="border-b border-border bg-muted/30">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              03 / Our Solution
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Structured access. Not crowdfunding.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              Most platforms give retail investors unstructured exposure to startups.
              We give them institutional-grade infrastructure at retail scale.
            </p>
          </div>

          <div className="mt-8 grid items-stretch gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-[1fr_1.3fr_1fr]">
            {comparison.map((col) => {
              const Icon = col.icon;
              if (col.highlight) {
                return (
                  <Card
                    key={col.title}
                    className="relative overflow-hidden border-0 bg-foreground text-background shadow-2xl lg:scale-[1.04] lg:shadow-primary/20"
                  >
                    {/* Glow accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
                    <CardContent className="relative flex h-full flex-col p-6 sm:p-8">
                      {col.tag && (
                        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                          <Sparkles className="h-3 w-3" />
                          {col.tag}
                        </span>
                      )}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold sm:text-2xl">{col.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {col.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 text-sm text-background/90">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              }
              return (
                <Card
                  key={col.title}
                  className="border border-border bg-muted/40 opacity-75 transition-opacity hover:opacity-100"
                >
                  <CardContent className="flex h-full flex-col p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-semibold text-muted-foreground sm:text-lg">{col.title}</h3>
                    </div>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {col.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground/80">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Team (with 'why' + socials) */}
      <section className="border-b border-border bg-background">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              04 / The Team
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Meet the team</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              Four students building the infrastructure that did not exist.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {team.map((m) => (
              <Card
                key={m.name}
                className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                {/* Hover accent line */}
                <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground sm:h-14 sm:w-14 sm:text-lg">
                        {m.initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold leading-tight sm:text-lg">{m.name}</h3>
                        <p className="text-xs font-medium text-primary sm:text-sm">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <a
                        href="#"
                        aria-label={`${m.name} on LinkedIn`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href="#"
                        aria-label={`${m.name} on GitHub`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground sm:mt-4 sm:text-sm">{m.university}</p>

                  {/* Why I'm building this */}
                  <blockquote className="mt-4 border-l-2 border-primary/60 pl-3 text-xs italic leading-relaxed text-foreground/80 sm:text-sm">
                    "{m.why}"
                  </blockquote>

                  <ul className="mt-4 space-y-1.5 sm:space-y-2">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Roadmap */}
      <section className="border-b border-border bg-background">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              05 / Where we are going
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              2025 → 2027 roadmap
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              Concrete milestones. No vague vision deck.
            </p>
          </div>

          <div className="relative mx-auto mt-10 max-w-4xl sm:mt-14">
            {/* Vertical line */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-1/2" aria-hidden />

            <div className="space-y-6 sm:space-y-8">
              {roadmap.map((item, i) => {
                const Icon = item.icon;
                const isLeft = i % 2 === 0;
                const isActive = item.status === 'in-progress';
                return (
                  <div
                    key={item.title}
                    className={`relative grid grid-cols-[2.5rem_1fr] gap-3 md:grid-cols-2 md:gap-8 ${
                      isLeft ? 'md:[&>*:first-child]:order-1' : ''
                    }`}
                  >
                    {/* Dot */}
                    <div className="relative flex justify-start md:justify-center">
                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {isActive && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" aria-hidden />
                        )}
                      </div>
                    </div>

                    {/* Content card */}
                    <div className={`md:${isLeft ? 'text-right' : 'text-left'}`}>
                      <Card className={isActive ? 'border-primary/40' : ''}>
                        <CardContent className="p-4 sm:p-5">
                          <div className={`flex items-center gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
                              {item.period}
                            </span>
                            {isActive && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                In progress
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1.5 text-base font-semibold sm:text-lg">{item.title}</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.body}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Moat */}
      <section className="border-b border-border bg-muted/30">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              06 / The Moat
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              The complexity is our moat.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              Navigating ECSPR, AIFMD, MiFID II, and secondary market regulation simultaneously
              is genuinely hard. We spent months mapping every regulatory risk and designing
              around it. Whoever gets this right first builds a structural advantage that is
              very hard to replicate.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {moat.map((m) => {
              const Icon = m.icon;
              return (
                <Card
                  key={m.title}
                  className="group relative overflow-hidden border border-border transition-all hover:border-primary/40 hover:shadow-md"
                >
                  {/* Background numeral */}
                  <span
                    className="pointer-events-none absolute -right-2 -top-4 select-none text-[100px] font-black leading-none tracking-tighter text-primary/[0.06] transition-colors group-hover:text-primary/10"
                    aria-hidden
                  >
                    {m.number}
                  </span>
                  <CardContent className="relative p-5 sm:p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold sm:mt-4 sm:text-lg">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CTA */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(var(--background)) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="container relative px-4 py-14 sm:py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Next Vault opens Q1 2026
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
              Invest in the companies of the future.
            </h2>
            <p className="mt-3 text-sm text-background/70 sm:mt-4 sm:text-base md:text-lg">
              Starting from €100. No wealth requirements. No gatekeeping.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/explore">
                  Browse Live Vaults
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"
              >
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
