import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Handshake, Clock, Briefcase, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Handshake,
    title: 'We source and negotiate a deal',
    description: '',
    badge: null,
  },
  {
    icon: Clock,
    title: 'A 72 hour vault opens',
    description: "Invest while the vault is live. If it doesn\u2019t fill, you\u2019re refunded.",
    badge: 'Full refund',
  },
  {
    icon: Briefcase,
    title: 'SPV holds the investment',
    description: 'The SPV owns the stake. VaultCapital manages admin and provides updates.',
    badge: null,
  },
];

const HowItWorks = () => (
  <section className="bg-muted/50 py-16">
    <div className="container">
      <h2 className="mb-12 text-center text-3xl font-bold">How it works</h2>

      <div className="relative mx-auto max-w-3xl">
        {/* Connecting line */}
        <div className="absolute left-6 top-0 hidden h-full w-px bg-border md:left-1/2 md:block" />

        <div className="grid gap-10 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex items-start gap-6 md:justify-center">
              {/* Step number + icon */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <step.icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 md:max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">Step {index + 1}</span>
                  {step.badge && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      {step.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-semibold">{step.title}</h3>
                {step.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Button variant="outline" asChild>
          <Link to="/how-it-works">
            Read the full process <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default HowItWorks;
