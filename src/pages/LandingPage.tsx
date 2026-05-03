import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import ReturnSimulator from '@/components/landing/ReturnSimulator';
import StartupCta from '@/components/landing/StartupCta';
import RiskDisclaimer from '@/components/landing/RiskDisclaimer';
import SocialProof from '@/components/landing/SocialProof';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users, FileText, Network, Tag, Receipt,
  ArrowRight, HelpCircle, BookOpen
} from 'lucide-react';

const highlights = [
  {
    icon: FileText,
    title: 'Pre negotiated deals',
    description: 'We negotiate terms first. You decide if you want in.',
  },
  {
    icon: Network,
    title: 'SPV structure',
    description: 'One SPV on the cap table. Investors get economic exposure, not voting rights.',
  },
  {
    icon: Tag,
    title: 'Resale board',
    description: 'List your position for sale. Liquidity is not guaranteed.',
  },
  {
    icon: Receipt,
    title: 'Transparent fees',
    description: 'Fees are shown before you invest and after an exit. No hidden charges.',
  },
];

const sections = [
  {
    icon: Users,
    title: 'About Us',
    description: 'Meet the team, learn our mission, and discover why investors trust VaultCapital.',
    link: '/about',
    cta: 'Learn More',
  },
  {
    icon: BookOpen,
    title: 'How It Works',
    description: 'SPV structure, fee breakdown, exit process, dividends. Everything explained in detail.',
    link: '/how-it-works',
    cta: 'Read More',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Answers to the most common questions about investing, risks, fees, and the resale board.',
    link: '/faq',
    cta: 'View FAQ',
  },
];

const LandingPage = () => {
  return (
    <div className="dot-grid-bg flex flex-col">
      <HeroSection />

      {/* Why VaultCapital */}
      <section className="py-8 md:py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-3xl font-bold">Why VaultCapital?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(h => (
              <div
                key={h.title}
                className="hover-lift rounded-xl border bg-card p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <h.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1.5 font-semibold">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SocialProof />
      <HowItWorks />
      <ReturnSimulator />

      {/* Navigation Cards */}
      <section className="container py-8 md:py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Learn More</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map(s => (
            <Card key={s.title} className="hover-lift group">
              <CardContent className="flex flex-col p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{s.description}</p>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link to={s.link}>
                    {s.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <StartupCta />
      <RiskDisclaimer />

      {/* Final CTA */}
      <section className="bg-primary py-8 md:py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to start?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Browse live vaults and invest starting from €100.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/explore">Explore Vaults</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container">
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Fees shown upfront. No hidden charges.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground md:text-sm md:gap-x-4">
            <span>© 2025 VaultCapital</span>
            <span className="hidden sm:inline">•</span>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <span>•</span>
            <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-foreground">FAQ</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <span>•</span>
            <Link to="/regulatory" className="hover:text-foreground">Regulatory</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
