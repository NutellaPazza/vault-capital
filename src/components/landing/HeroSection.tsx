import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Banknote, Shield, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mockVaults = [
{ name: 'NovaTech AI', stage: 'Seed', progress: 72, timeLeft: '48h left', ticket: '€100' },
{ name: 'GreenLoop', stage: 'Series A', progress: 45, timeLeft: '61h left', ticket: '€250' },
{ name: 'FinBridge', stage: 'Pre-Seed', progress: 88, timeLeft: '12h left', ticket: '€100' }];


const HeroSection = () =>
<section className="relative overflow-hidden">
    {/* Subtle gradient background */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />

    <div className="container relative flex flex-col gap-8 py-8 md:flex-row md:items-center md:gap-16 md:py-24">
      {/* Left: Copy */}
      <div className="flex-1 text-center md:text-left">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
          Venture investing for the rest of us.
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Invest in Private Startups{' '}
          <span className="text-primary">
from €100</span>
        </h1>
        <p className="mb-8 max-w-xl text-base text-muted-foreground md:text-xl">Curated deals · 72-hour vaults · SPV held positions.</p>

        {/* Micro bullets */}
        <div className="mb-8 flex flex-wrap justify-center gap-6 md:justify-start">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <span>72h vault window</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Banknote className="h-4 w-4 text-primary" />
            </div>
            <span>From €100</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <RotateCcw className="h-4 w-4 text-primary" />
            </div>
            <span>Full refund if vault doesn't fill</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
          <Button size="lg" asChild>
            <Link to="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/try-demo">Try the Demo</Link>
          </Button>
        </div>

        {/* Social proof strip */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 border-t pt-6 md:justify-start">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Designed for EU investors</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Banknote className="h-3.5 w-3.5" />
            <span>Transparent fees</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>SPV structure</span>
          </div>
        </div>
      </div>

      {/* Right: Vault Card Stack */}
      <div className="relative mx-auto w-full max-w-sm md:mx-0 md:flex-1">
        <p className="mb-3 text-center text-[11px] text-muted-foreground">Example vaults</p>
        <div className="relative h-[320px]">
          {mockVaults.map((vault, i) => <div
          key={vault.name}
          className="vault-float absolute left-0 right-0 rounded-xl border bg-card p-4 shadow-lg"
          style={{
            top: `${i * 90}px`,
            zIndex: 3 - i,
            animationDelay: `${i * 0.5}s`,
            transform: `scale(${1 - i * 0.03})`
          }}>

              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-card-foreground">{vault.name}</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {vault.stage}
                </span>
              </div>
              <div className="mb-2">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium text-primary">{vault.progress}%</span>
                </div>
                <Progress value={vault.progress} className="h-2" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {vault.timeLeft}
                </span>
                <span>Min. {vault.ticket}</span>
              </div>
            </div>
        )}
        </div>
      </div>
    </div>
  </section>;


export default HeroSection;