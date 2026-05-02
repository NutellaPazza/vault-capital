import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Home, Clock, FileText, Mail } from 'lucide-react';

interface Props {
  applicationId: string;
  onBackHome: () => void;
}

export const ApplicationSuccess = ({ applicationId, onBackHome }: Props) => {
  const infoCards = [
    {
      icon: Clock,
      title: 'What happens next?',
      body: 'Our team reviews your application against our deal criteria. If selected, we will contact you to schedule a 30-minute call.',
    },
    {
      icon: FileText,
      title: 'What we look for',
      body: 'European startups, pre-seed to Series A, raising €100K-€2M, with at least one clear market validation signal.',
    },
    {
      icon: Mail,
      title: 'Questions?',
      body: 'Contact us at apply@vaultcapital.eu — we respond within 48 hours.',
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        <Card className="border-success/20 bg-gradient-to-br from-card to-success/5">
          <CardContent className="flex flex-col items-center px-6 py-10 text-center md:px-10 md:py-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">Application submitted</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
              We have received your application and will review it within 5 business days.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-2 font-mono text-sm">
              <span className="text-muted-foreground">Application ID:</span>
              <span className="font-semibold text-foreground">{applicationId}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {infoCards.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 text-sm font-semibold md:text-base">{title}</h3>
                <p className="text-xs text-muted-foreground md:text-sm">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={onBackHome} size="lg">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <em>This is a demo. No real submissions are processed.</em>
        </p>
      </div>
    </div>
  );
};
