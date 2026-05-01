import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, ArrowRight, Check, X, Lock, Shield, Link2, Users,
} from 'lucide-react';

const stats = [
  {
    value: '€10T+',
    label: 'EU household deposits sitting in low-yield savings (ECB, Q3 2025)',
  },
  {
    value: '€100',
    label: 'Minimum investment on VaultCapital. The same deals, a fraction of the ticket',
  },
  {
    value: '€10B',
    label: 'Estimated serviceable market for retail-accessible private startup exposure',
  },
];

const comparison = [
  {
    title: 'Traditional Crowdfunding',
    icon: X,
    iconClass: 'text-muted-foreground',
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
    iconClass: 'text-primary',
    highlight: true,
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
    iconClass: 'text-muted-foreground',
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
    points: [
      'Python and C++ development',
      'Quantitative modeling and algorithmic systems',
      '1st place, Math Olympics. Campania region',
    ],
  },
];

const moat = [
  {
    icon: Shield,
    title: 'Regulatory First',
    body: 'We designed for ECSPR compliance from day one. License application, SPV structure, investor protections, KIIS documentation. Not bolted on after the fact.',
  },
  {
    icon: Link2,
    title: 'Aligned Incentives',
    body: 'We charge a 2% exit fee only on profit. If investors lose money, we earn nothing. Our revenue is structurally tied to investor success.',
  },
  {
    icon: Users,
    title: 'Founder-Built',
    body: 'Every product decision comes from people who understand both the financial markets and the code. No middle layer between vision and execution.',
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
        <div className="container relative px-4 py-14 sm:py-20 md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              Our Story
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight sm:mt-4 sm:text-4xl md:text-6xl">
              Venture investing for the rest of us.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-background/70 sm:mt-6 sm:text-base md:text-lg">
              We are a team of four Bocconi and Federico II students who got tired of watching
              the best startup deals go exclusively to VCs and wealthy insiders. So we built
              the infrastructure to change that.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — The Problem */}
      <section className="border-b border-border bg-background">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
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
            <div className="grid gap-3 sm:gap-4">
              {stats.map((s) => (
                <Card key={s.value} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl">
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm md:text-base">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Our Solution */}
      <section className="border-b border-border bg-muted/30">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Structured access. Not crowdfunding.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              Most platforms give retail investors unstructured exposure to startups.
              We give them institutional-grade infrastructure at retail scale.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {comparison.map((col) => {
              const Icon = col.icon;
              return (
                <Card
                  key={col.title}
                  className={
                    col.highlight
                      ? 'border-2 border-primary shadow-lg md:scale-[1.02]'
                      : 'border border-border'
                  }
                >
                  <CardContent className="flex h-full flex-col p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          col.highlight ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${col.iconClass}`} />
                      </div>
                      <h3 className="text-base font-semibold sm:text-lg">{col.title}</h3>
                    </div>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {col.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                              col.highlight ? 'bg-primary' : 'bg-muted-foreground/40'
                            }`}
                          />
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

      {/* SECTION 4 — Team */}
      <section className="border-b border-border bg-background">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Meet the team</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              Four students building the infrastructure that did not exist.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {team.map((m) => (
              <Card key={m.name} className="transition-shadow hover:shadow-md">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground sm:h-14 sm:w-14 sm:text-lg">
                      {m.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-tight sm:text-lg">{m.name}</h3>
                      <p className="text-xs font-medium text-primary sm:text-sm">{m.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground sm:mt-4 sm:text-sm">{m.university}</p>
                  <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
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

      {/* SECTION 5 — Moat */}
      <section className="border-b border-border bg-muted/30">
        <div className="container px-4 py-12 sm:py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
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
                <Card key={m.title} className="border border-border">
                  <CardContent className="p-5 sm:p-6">
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

      {/* SECTION 6 — CTA */}
      <section className="bg-foreground text-background">
        <div className="container px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Invest in the companies of the future.
            </h2>
            <p className="mt-4 text-base text-background/70 md:text-lg">
              Starting from €100. No wealth requirements. No gatekeeping.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
