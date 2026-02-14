import { Card, CardContent } from '@/components/ui/card';
import { Search, Clock, Shield, TrendingUp } from 'lucide-react';

const steps = [
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
];

const HowItWorks = () => (
  <section className="bg-muted/50 py-16">
    <div className="container">
      <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
      <div className="grid gap-6 md:grid-cols-4">
        {steps.map((step, index) => (
          <Card key={step.title} className="relative overflow-hidden">
            <CardContent className="p-6 pt-8">
              <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
