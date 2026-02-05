import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Scale, Banknote, Users, TrendingUp, AlertTriangle, Store, FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Terms & Conditions</h1>
        <p className="mb-8 text-muted-foreground">
          Please read these terms carefully before investing through VaultCapital.
        </p>

        <div className="space-y-6">
          {/* Platform Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                VaultCapital is a retail investment platform that enables individuals to invest in private startup equity 
                through pooled investment vehicles. We source, negotiate, and structure deals with high-potential startups, 
                allowing retail investors to participate with minimum investments starting from €100.
              </p>
              <p>
                Investments are made through a Special Purpose Vehicle (SPV) structure, where VaultCapital acts as the 
                nominee and manager on behalf of all pool participants. This structure simplifies the investment process 
                while providing investors with economic rights proportional to their contribution.
              </p>
            </CardContent>
          </Card>

          {/* Fee Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                2. Fee Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="text-2xl font-bold">2%</p>
                    <p className="text-xs text-muted-foreground">Charged at investment</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carry Fee</p>
                    <p className="text-2xl font-bold">2%</p>
                    <p className="text-xs text-muted-foreground">On profits at exit</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Marketplace Fee</p>
                    <p className="text-2xl font-bold">1%</p>
                    <p className="text-xs text-muted-foreground">On secondary trades</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Entry Fee (2%):</strong> This fee is charged at the time of investment and is added to your 
                  investment amount. For example, investing €1,000 requires €1,020 total (€1,000 + €20 fee).
                </p>
                <p>
                  <strong>Carry Fee (2%):</strong> Applied only to profits realized at exit. If you invest €1,000 and 
                  receive €2,000 at exit (€1,000 profit), the carry fee would be €20 (2% of €1,000 profit).
                </p>
                <p>
                  <strong>Marketplace Fee (1%):</strong> Charged to buyers on secondary market transactions. Sellers 
                  receive the full asking price; buyers pay an additional 1% on top.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dividend Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                3. Dividend Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Dividends corresponding to your equity stake are managed by VaultCapital in its capacity as SPV manager. 
                When portfolio companies distribute dividends, these funds are received by the SPV.
              </p>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-400">Important Notice</h4>
                <p className="text-amber-900/80 dark:text-amber-200/80">
                  Investors acquire <strong>economic rights</strong> to equity only. Dividend distributions to individual 
                  investors are made at VaultCapital's discretion. In most cases, dividends are reinvested to maximize 
                  long-term value or held until a liquidity event. Direct dividend pass-through is not guaranteed.
                </p>
              </div>
              <p>
                VaultCapital may, at its sole discretion, distribute dividends to investors on a pro-rata basis when 
                deemed appropriate. Any such distributions will be communicated via the platform and credited directly 
                to investors' wallets.
              </p>
            </CardContent>
          </Card>

          {/* Exit Procedures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                4. Exit Procedures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Exit timing and execution are determined by VaultCapital acting in the best interests of all pool 
                participants. Common exit scenarios include:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Acquisition of the portfolio company by a third party</li>
                <li>Initial Public Offering (IPO) of the portfolio company</li>
                <li>Secondary sale to another investor or fund</li>
                <li>Company liquidation (in adverse scenarios)</li>
              </ul>
              <h4 className="font-semibold text-foreground mt-4">Distribution Process</h4>
              <p>
                Upon an exit event, proceeds are distributed as follows:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Settlement of any outstanding fees or expenses</li>
                <li>Calculation of net proceeds available for distribution</li>
                <li>Deduction of carry fee (2% of profits)</li>
                <li>Pro-rata distribution to investors based on SPV ownership percentage</li>
              </ol>
              <p className="mt-4">
                Distributions are typically processed within 30-90 days of receiving exit proceeds, depending on 
                the complexity of the transaction and any escrow arrangements.
              </p>
            </CardContent>
          </Card>

          {/* SPV/Nominee Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                5. SPV & Nominee Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                All investments are made through a Special Purpose Vehicle (SPV) managed by VaultCapital. This structure 
                provides several benefits:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Simplified cap table for portfolio companies (single entity instead of hundreds of individuals)</li>
                <li>Professional management of investor rights and communications</li>
                <li>Standardized legal framework across all investments</li>
                <li>Lower minimum investment thresholds for retail investors</li>
              </ul>
              <div className="rounded-lg border p-4 mt-4">
                <h4 className="font-semibold text-foreground mb-2">Investor Rights</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-foreground">What You Own</p>
                    <ul className="text-xs space-y-1 mt-1">
                      <li>✓ Economic rights to equity</li>
                      <li>✓ Pro-rata share of exit proceeds</li>
                      <li>✓ Right to sell on secondary market</li>
                      <li>✓ Access to company updates</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">What VaultCapital Manages</p>
                    <ul className="text-xs space-y-1 mt-1">
                      <li>• Voting rights and governance</li>
                      <li>• Board observer rights (if any)</li>
                      <li>• Communication with companies</li>
                      <li>• Exit negotiations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risks and Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                6. Risks and Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="font-semibold text-destructive mb-2">HIGH RISK INVESTMENT WARNING</p>
                <p className="text-destructive/80">
                  Investing in startups involves substantial risk, including the complete loss of your investment. 
                  Past performance does not guarantee future results. Only invest money you can afford to lose entirely.
                </p>
              </div>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Illiquidity Risk:</strong> Startup investments are highly illiquid. While our secondary 
                marketplace provides some liquidity, there is no guarantee you will find a buyer for your position.</p>
                <p><strong>Valuation Risk:</strong> Estimated values shown on the platform are indicative only and 
                based on the most recent funding round or internal assessment. Actual exit values may differ significantly.</p>
                <p><strong>Dilution Risk:</strong> Your ownership percentage may be reduced in future funding rounds 
                if you do not participate in follow-on investments.</p>
                <p><strong>Failure Risk:</strong> Most startups fail. According to industry statistics, approximately 
                90% of startups do not achieve successful exits.</p>
                <p><strong>No Guarantee:</strong> VaultCapital does not guarantee any returns on investment. 
                All investment decisions are made at your own risk.</p>
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                7. Marketplace Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Our secondary marketplace allows investors to trade positions before a company exit. 
                The following rules apply:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Positions can only be listed after the pool has successfully closed and transitioned to "active" status</li>
                <li>Sellers set their own asking price; there is no price regulation</li>
                <li>A 1% marketplace fee is charged to buyers on each transaction</li>
                <li>Ownership transfer is processed within 24-48 hours of purchase</li>
                <li>Sellers receive funds in their wallet upon successful transfer</li>
                <li>Listings can be cancelled at any time before a purchase is made</li>
              </ul>
              <p className="mt-4">
                <strong>Settlement:</strong> When a position is purchased, ownership is transferred electronically 
                through our platform. The buyer receives proportional ownership of the SPV, entitling them to 
                corresponding economic rights in the underlying investment.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                For questions about these terms, please contact our support team.
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated: January 2025 • VaultCapital © 2024
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;