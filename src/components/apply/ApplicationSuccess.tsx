import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Home, Compass } from 'lucide-react';

interface Props {
  applicationId: string;
  contactEmail?: string;
  onBackHome: () => void;
}

export const ApplicationSuccess = ({ applicationId, contactEmail, onBackHome }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-success/20 bg-gradient-to-br from-card to-success/5">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center md:px-10 md:py-16">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Application received</h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              We review all applications within 5 business days. You'll hear from our team at{' '}
              <span className="font-medium text-foreground">
                {contactEmail || 'the email you provided'}
              </span>
              .
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-2 font-mono text-sm">
              <span className="text-muted-foreground">Application ID:</span>
              <span className="font-semibold text-foreground">{applicationId}</span>
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={onBackHome} variant="outline" size="lg" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to home
                </Link>
              </Button>
              <Button size="lg" asChild>
                <Link to="/explore">
                  <Compass className="mr-2 h-4 w-4" />
                  Explore open vaults
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

