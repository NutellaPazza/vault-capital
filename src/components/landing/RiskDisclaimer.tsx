import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const RiskDisclaimer = () => (
  <section className="container py-8">
    <Alert className="border-warning/30 bg-warning/5">
      <AlertTriangle className="h-5 w-5 text-warning" />
      <AlertTitle className="text-warning">Investment Risk Warning</AlertTitle>
      <AlertDescription className="mt-2 text-sm text-muted-foreground">
        <p className="mb-2">
          Investing in startups involves <strong>significant risk</strong>, including the potential 
          <strong> total loss of your invested capital</strong>. Startup investments are illiquid, speculative, 
          and not suitable for all investors.
        </p>
        <p className="mb-2">
          Past performance is not indicative of future results. VaultCapital does not provide financial advice. 
          You should carefully consider your financial situation and risk tolerance before investing.
        </p>
        <p>
          By investing through VaultCapital, you acknowledge that you understand these risks. 
          Read our full <Link to="/terms" className="font-medium text-primary hover:underline">Terms & Conditions</Link> for complete details.
        </p>
      </AlertDescription>
    </Alert>
  </section>
);

export default RiskDisclaimer;
