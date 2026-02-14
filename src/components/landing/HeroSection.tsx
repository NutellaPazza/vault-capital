import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Users, Shield } from 'lucide-react';

const HeroSection = () => (
  <section className="container flex flex-col items-center py-16 text-center md:py-24">
    <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
      Invest in Private Startups{' '}
      <span className="text-primary">from €100</span>
    </h1>
    <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
      Access exclusive startup deals through pooled investments. 
      Join a community of retail investors building tomorrow's success stories.
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
    
    {/* Value Props instead of fake stats */}
    <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <p className="text-lg font-bold">72h Pools</p>
        <p className="text-sm text-muted-foreground">Limited-time investment windows</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <p className="text-lg font-bold">From €100</p>
        <p className="text-sm text-muted-foreground">Low minimum ticket</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <p className="text-lg font-bold">SPV Protected</p>
        <p className="text-sm text-muted-foreground">Professional legal structure</p>
      </div>
    </div>
  </section>
);

export default HeroSection;
