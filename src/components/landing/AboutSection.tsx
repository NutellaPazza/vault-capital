import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, Building2, PieChart, Eye, Shield, Banknote, 
  Briefcase, CheckCircle 
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Pooled Investment',
    description: 'Invest alongside hundreds of other investors. Lower minimums, shared due diligence.',
  },
  {
    icon: Building2,
    title: 'Curated Deals',
    description: 'Access pre-negotiated terms with vetted startups. We do the heavy lifting.',
  },
  {
    icon: PieChart,
    title: 'Secondary Market',
    description: 'Trade your positions on our marketplace. Liquidity when you need it.',
  },
];

const teamMembers = [
  {
    initials: 'MC',
    name: 'Marco Cappelli',
    role: 'CEO & Co-Founder',
    bio: 'Serial entrepreneur with 10+ years in fintech and venture capital.',
  },
  {
    initials: 'LR',
    name: 'Laura Ricci',
    role: 'COO & Co-Founder',
    bio: 'Former investment banker with expertise in deal structuring and compliance.',
  },
  {
    initials: 'AP',
    name: 'Andrea Piras',
    role: 'CTO',
    bio: 'Full-stack engineer, ex-Revolut. Built scalable financial platforms.',
  },
];

const AboutSection = () => (
  <>
    {/* Why VaultCapital */}
    <section className="container py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">Why VaultCapital?</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map(f => (
          <div key={f.title} className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <f.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* About Us / Team */}
    <section className="bg-muted/50 py-16">
      <div className="container">
        <h2 className="mb-4 text-center text-3xl font-bold">About Us</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          VaultCapital is building the future of retail startup investing. We make private market deals 
          accessible, transparent, and simple through our pooled investment model.
        </p>

        {/* Team */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {teamMembers.map(m => (
            <Card key={m.name}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {m.initials}
                </div>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-sm text-primary">{m.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legal Structure & How We Work */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Legal Structure (SPV)</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Each pool creates a Special Purpose Vehicle (SPV)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  VaultCapital acts as nominee/manager of the SPV
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Investors hold economic rights proportional to their investment
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Exit proceeds distributed pro-rata to all pool participants
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Fee Structure</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="rounded-lg bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Entry Fee</span>
                    <span className="text-xl font-bold text-primary">2%</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">Applied at the time of investment</p>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Carry Fee</span>
                    <span className="text-xl font-bold text-primary">2%</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">On profit at exit only — no profit, no carry</p>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Marketplace Fee</span>
                    <span className="text-xl font-bold text-primary">1%</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">Paid by the buyer on secondary trades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transparency */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Full Transparency</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-2 text-sm">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Company Updates</p>
                  <p className="text-muted-foreground">Regular reports from startups you've invested in</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Portfolio Visibility</p>
                  <p className="text-muted-foreground">Real-time tracking of your investments and valuations</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Risk Disclosure</p>
                  <p className="text-muted-foreground">Clear information on risks before every investment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </>
);

export default AboutSection;
