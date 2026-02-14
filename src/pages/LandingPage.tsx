import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import ReturnSimulator from '@/components/landing/ReturnSimulator';
import StartupCta from '@/components/landing/StartupCta';
import RiskDisclaimer from '@/components/landing/RiskDisclaimer';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, Building2, PieChart, ArrowRight, Shield, 
  Eye, HelpCircle, BookOpen 
} from 'lucide-react';

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
    description: 'SPV structure, fee breakdown, exit process, dividends — everything explained in detail.',
    link: '/how-it-works',
    cta: 'Read More',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Answers to the most common questions about investing, risks, fees, and the marketplace.',
    link: '/faq',
    cta: 'View FAQ',
  },
];

const highlights = [
  {
    icon: Building2,
    title: 'Curated Deals',
    description: 'Access pre-negotiated terms with vetted European startups. Rigorous due diligence on every deal.',
  },
  {
    icon: Shield,
    title: 'SPV Protected',
    description: 'Each investment is held in a legally independent SPV. Your capital is separated and protected.',
  },
  {
    icon: PieChart,
    title: 'Secondary Market',
    description: 'Trade your positions on our marketplace. Liquidity when you need it — don\'t wait for exits.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description: 'Regular startup updates, real-time portfolio tracking, and clear risk disclosures.',
  },
];

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Highlights */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Why VaultCapital?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(h => (
              <div key={h.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <h.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReturnSimulator />

      {/* Navigation Cards to Subpages */}
      <section className="container py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Learn More</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map(s => (
            <Card key={s.title} className="group transition-shadow hover:shadow-lg">
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
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Investing?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Join a growing community of investors accessing private startup deals from just €100.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container">
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 VaultCapital</span>
            <span>•</span>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <span>•</span>
            <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-foreground">FAQ</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
