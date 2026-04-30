import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, Building2, PieChart, Eye, Shield, Banknote,
  Briefcase, CheckCircle, ArrowLeft, Scale, Vote, Coins,
  FileText, HandCoins, BarChart3, Globe, Lock
} from 'lucide-react';

// Team is not yet public.

const features = [
  {
    icon: Users,
    title: 'Pooled Investment',
    description: 'Invest alongside hundreds of other investors. Lower minimums (from €100), shared due diligence, and professional deal management. You get access to deals that would normally require €50K+ minimums.',
  },
  {
    icon: Building2,
    title: 'Curated Deals',
    description: 'Access pre-negotiated terms with vetted startups. Our team conducts thorough due diligence, negotiates favorable terms, and only presents deals that meet our strict criteria.',
  },
  {
    icon: PieChart,
    title: 'Secondary Market',
    description: 'Trade your positions on our marketplace. Unlike traditional startup investments that lock your capital for years, our secondary market provides liquidity when you need it.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description: 'Regular company updates, real-time portfolio tracking, detailed risk disclosures before every investment, and complete visibility into fees and structures.',
  },
  {
    icon: Globe,
    title: 'European Focus',
    description: 'We focus on the most promising startups across Europe — from pre-seed to Series A. Access opportunities in Italy, Germany, Netherlands, France, and beyond.',
  },
  {
    icon: Lock,
    title: 'Security First',
    description: 'KYC-verified investors, segregated SPV accounts, and professional fund administration. Your investment is held in a regulated legal structure.',
  },
];

const AboutPage = () => (
  <div className="container py-8">
    <Button variant="ghost" size="sm" className="mb-6" asChild>
      <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Home</Link>
    </Button>

    {/* Hero */}
    <div className="mb-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">About VaultCapital</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        We're building the future of retail startup investing. Private market deals, 
        accessible to everyone, managed with institutional-grade professionalism.
      </p>
    </div>

    {/* Mission */}
    <section className="mb-16">
      <Card className="bg-gradient-to-br from-card to-accent/20">
        <CardContent className="p-8">
          <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Startup investing has historically been reserved for wealthy individuals and institutional investors 
            with €50,000+ minimums. VaultCapital democratizes access by pooling capital from many investors 
            into professionally managed SPVs, allowing anyone to participate from just €100. We handle the 
            legal structure, due diligence, governance, and exit management — so you can focus on choosing 
            the startups you believe in.
          </p>
        </CardContent>
      </Card>
    </section>

    {/* Why VaultCapital */}
    <section className="mb-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Why VaultCapital?</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(f => (
          <Card key={f.title}>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    {/* Team */}
    <section className="mb-16">
      <h2 className="mb-4 text-center text-3xl font-bold">Our Team</h2>
      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground leading-relaxed">
            Our team combines backgrounds in fintech, venture capital, and software engineering.
            We are building VaultCapital because we believe retail investors deserve access to the
            same opportunities as institutional ones.
          </p>
        </CardContent>
      </Card>
    </section>

    {/* Transparency & Reporting */}
    <section className="mb-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Transparency & Reporting</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <Briefcase className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Company Updates</h3>
            <p className="text-sm text-muted-foreground">
              Startups in our portfolio provide regular updates — quarterly reports, milestone announcements, 
              and key business developments. You'll always know what's happening with your investments.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <BarChart3 className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Portfolio Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Real-time tracking of your investments, estimated valuations, P&L, and ownership percentages. 
              Full visibility into every position in your portfolio dashboard.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Shield className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Risk Disclosure</h3>
            <p className="text-sm text-muted-foreground">
              Clear, upfront information on risks before every investment. We never hide the fact that 
              startup investing is high-risk — we just make it accessible and transparent.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* CTA */}
    <section className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
      <h2 className="mb-4 text-3xl font-bold">Ready to Start?</h2>
      <p className="mb-8 text-primary-foreground/80">Join a growing community of investors accessing private startup deals.</p>
      <div className="flex justify-center gap-4">
        <Button size="lg" variant="secondary" asChild>
          <Link to="/signup">Create Free Account</Link>
        </Button>
        <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
          <Link to="/how-it-works">How It Works</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default AboutPage;
