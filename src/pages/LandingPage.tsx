import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Users, 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  Shield, 
  Clock, 
  PieChart,
  Rocket,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center py-16 text-center md:py-24">
        <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Invest in Private Startups{' '}
          <span className="text-primary">from €100</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Access exclusive startup deals through pooled investments. 
          Join thousands of retail investors building tomorrow's success stories.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/explore">Explore Pools</Link>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16">
          <div>
            <p className="text-3xl font-bold text-primary md:text-4xl">€2.5M+</p>
            <p className="text-sm text-muted-foreground">Capital Deployed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary md:text-4xl">15+</p>
            <p className="text-sm text-muted-foreground">Startups Funded</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary md:text-4xl">3,200+</p>
            <p className="text-sm text-muted-foreground">Investors</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Search,
                title: 'Deal Sourcing',
                description: 'We identify and negotiate exclusive deals with high-potential startups',
              },
              {
                icon: Clock,
                title: 'Pool Live 72h',
                description: 'Investment pools open for 72 hours with a minimum ticket of €100',
              },
              {
                icon: Shield,
                title: 'SPV Ownership',
                description: 'VaultCapital invests through a single SPV as nominee for all investors',
              },
              {
                icon: TrendingUp,
                title: 'Exit Distribution',
                description: 'Returns are distributed pro-rata when the startup exits',
              },
            ].map((step, index) => (
              <Card key={step.title} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Why VaultCapital?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Pooled Investment</h3>
            <p className="text-muted-foreground">
              Invest alongside hundreds of other investors. Lower minimums, shared due diligence.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Curated Deals</h3>
            <p className="text-muted-foreground">
              Access pre-negotiated terms with vetted startups. We do the heavy lifting.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <PieChart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Secondary Market</h3>
            <p className="text-muted-foreground">
              Trade your positions on our marketplace. Liquidity when you need it.
            </p>
          </div>
        </div>
      </section>

      {/* Startup CTA Section */}
      <section className="container py-16">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold">Are you a startup opening a round?</h3>
                <p className="mb-4 text-muted-foreground">
                  Apply to collaborate with VaultCapital. If we're interested, we'll contact you to evaluate a potential offer and open a Pool on our platform.
                </p>
                <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground md:justify-start">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Submit your pitch and metrics
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Internal team evaluation
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    If selected, we open a public Pool
                  </span>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link to="/apply">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Investing?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Join thousands of investors accessing private startup deals.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t bg-card py-8">
        <div className="container">
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            <p className="font-medium">Demo Application</p>
            <p className="mt-1">
              This is a demonstration platform. Not financial advice. 
              Investing in startups involves high risk including loss of capital.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 VaultCapital</span>
            <span>•</span>
            <Link to="#" className="hover:text-foreground">Privacy</Link>
            <span>•</span>
            <Link to="#" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
