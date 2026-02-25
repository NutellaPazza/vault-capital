import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const RiskDisclaimer = () => (
  <section className="container py-8">
    <Alert className="border-warning/30 bg-warning/5">
      <AlertTriangle className="h-5 w-5 text-warning" />
      <AlertTitle className="text-warning">Risk Warning</AlertTitle>
      <AlertDescription className="mt-2 text-sm text-muted-foreground">
        <p className="mb-2">
          Investing in startups involves <strong>significant risk</strong>, including the potential
          <strong> total loss of your invested capital</strong>. Startup investments are illiquid, speculative,
          and not suitable for all investors.
        </p>
        <p className="mb-2">
          VaultCapital does not provide financial advice. Past performance is not indicative of future results.
          You should carefully consider your financial situation and risk tolerance before investing.
        </p>
        <p>
          Resale listings on the resale board may not find a buyer. Liquidity is not guaranteed. Listings may not sell.{' '}
          <Link to="/terms" className="font-medium text-primary hover:underline">Read full risk disclosure</Link>.
        </p>
      </AlertDescription>
    </Alert>
  </section>
);

export default RiskDisclaimer;
