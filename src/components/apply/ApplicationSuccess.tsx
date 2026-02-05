import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  applicationId: string;
  onBackHome: () => void;
}

export const ApplicationSuccess = ({ applicationId, onBackHome }: Props) => {
  const copyId = () => {
    navigator.clipboard.writeText(applicationId);
    toast({ title: 'Copied!', description: 'Application ID copied to clipboard.' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="mb-2 text-2xl font-bold">Application Received!</h1>
          <p className="mb-6 text-muted-foreground">
            Thank you for your submission. Our team will review your application.
          </p>

          <div className="mb-6 rounded-lg border bg-muted/30 p-4">
            <p className="mb-1 text-sm text-muted-foreground">Your Application ID</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-mono font-semibold text-primary">{applicationId}</code>
              <Button variant="ghost" size="icon" onClick={copyId} className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-left">
            <h3 className="mb-2 font-medium">Next Steps</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Our team will review your application within 5-7 business days</li>
              <li>• If we're interested, we'll reach out via the email you provided</li>
              <li>• Shortlisted startups will receive a follow-up call</li>
            </ul>
          </div>

          <p className="mb-6 text-xs text-muted-foreground">
            <em>This is a demo. No real submissions are processed.</em>
          </p>

          <Button onClick={onBackHome} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
