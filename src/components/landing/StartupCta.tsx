import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, CheckCircle, ArrowRight } from 'lucide-react';

const StartupCta = () => (
  <section className="container py-16">
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-bold">Raising a round?</h3>
            <p className="mb-4 text-muted-foreground">
              Apply to be considered for a VaultCapital vault. If selected, we may propose terms and open a public vault.
            </p>
            <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground md:justify-start">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                Submit deck + metrics
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                Team review
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                If selected, we open a 72h vault
              </span>
            </div>
          </div>
          <Button size="lg" asChild>
            <Link to="/apply">
              Apply <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </section>
);

export default StartupCta;
