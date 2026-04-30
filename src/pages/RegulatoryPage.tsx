import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft, ShieldCheck, Building2, Users, Store, AlertTriangle, FileCheck,
  BookOpen, Wallet, Clock,
} from 'lucide-react';

const protections = [
  {
    icon: BookOpen,
    title: 'Knowledge Test',
    desc: "Required before your first investment. Not a gate: if you don't pass, you receive a mandatory risk warning you must acknowledge.",
  },
  {
    icon: Wallet,
    title: 'Investment Caps',
    desc: 'Non-sophisticated investors are capped at max(€1,000 or 5% of net worth) per vault, enforced automatically by the platform.',
  },
  {
    icon: Clock,
    title: 'Reflection Period',
    desc: 'You have 4 calendar days to withdraw before a vault closes. After closing, capital is deployed and the only exit is the resale board.',
  },
  {
    icon: FileCheck,
    title: 'KIIS per Vault',
    desc: 'Every vault has a standardized Key Investment Information Sheet covering deal terms, risks, fees, and exit conditions.',
  },
];

const regulatoryRows = [
  { area: 'Crowdfunding', regulation: 'ECSPR (Reg. 2020/1503)', status: 'Licensed via Consob' },
  { area: 'SPV / Nominee', regulation: 'AIFMD (Dir. 2011/61/EU)', status: 'Nominee structure, non-AIF' },
  { area: 'Intermediation', regulation: 'MiFID II (Dir. 2014/65/EU)', status: 'Covered by ECSP license' },
  { area: 'Secondary Market', regulation: 'MiFID II MTF/OTF', status: 'Bulletin board only (ECSPR Art. 25)' },
  { area: 'KYC / AML', regulation: 'AMLD6 / D.Lgs. 231/2007', status: 'Third-party provider (Sumsub)' },
  { area: 'Investor Protection', regulation: 'ECSPR + AMLD6', status: 'Full ECSPR framework applied' },
];

const RegulatoryPage = () => (
  <div className="container py-8">
    <Button variant="ghost" size="sm" className="mb-6" asChild>
      <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Home</Link>
    </Button>

    {/* Hero */}
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <ShieldCheck className="h-7 w-7 text-primary" />
      </div>
      <h1 className="mb-3 text-4xl font-bold">Regulated. Transparent. Built to last.</h1>
      <p className="text-lg text-muted-foreground">
        VaultCapital operates under EU Crowdfunding Regulation (ECSPR — Regulation EU 2020/1503),
        authorized by Consob in Italy.
      </p>
    </div>

    <div className="mx-auto max-w-4xl space-y-6">
      {/* Section 1 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            ECSP Authorization
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          VaultCapital operates as a licensed European Crowdfunding Service Provider (ECSP) under
          ECSPR (Regulation EU 2020/1503), implemented in Italy by Consob via Regulation 22720/2023.
          Every vault on the platform is an independent ECSPR-compliant offering with its own Key
          Investment Information Sheet (KIIS).
        </CardContent>
      </Card>

      {/* Section 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Special Purpose Vehicles — Nominee Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Each vault uses a dedicated Italian SRL (Special Purpose Vehicle) that acts as a nominee —
          it holds the startup shares on behalf of investors. The SPV has zero discretionary
          authority: all exit conditions (acquisition events, valuation thresholds, 7-year hard cap)
          are published in the vault contract before the vault opens. VaultCapital does not make
          case-by-case investment decisions on your behalf.
        </CardContent>
      </Card>

      {/* Section 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            How We Protect Investors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {protections.map(p => (
              <div key={p.title} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <p.icon className="h-4 w-4 text-primary" />
                  <p className="font-semibold">{p.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Resale Board — What It Is and What It Is Not
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          The VaultCapital resale board is a bulletin board, not a trading venue. Investors post
          their position for sale. Interested buyers contact them directly. VaultCapital does not
          match orders, display bid/ask spreads, or operate an order book. This design operates
          under ECSPR Article 25. A 1% fee is charged on transfer completion — covering legal
          documentation and SPV membership transfer, not trade execution.
        </CardContent>
      </Card>

      {/* Section 5 — Disclaimer callout */}
      <Card className="border-warning/40 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Important Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-foreground/80">
          <p>VaultCapital does not provide investment advice. All content on this platform is informational only.</p>
          <p>Nothing on this platform constitutes a personalized investment recommendation.</p>
          <p>You may lose all of your invested capital.</p>
          <p>Startup investments are illiquid.</p>
          <p>Past performance is not indicative of future results.</p>
        </CardContent>
      </Card>

      {/* Section 6 — Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Regulatory Status
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Regulation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regulatoryRows.map(r => (
                <TableRow key={r.area}>
                  <TableCell className="font-medium">{r.area}</TableCell>
                  <TableCell className="text-muted-foreground">{r.regulation}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default RegulatoryPage;
