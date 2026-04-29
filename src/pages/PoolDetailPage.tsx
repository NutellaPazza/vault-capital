import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { StatusBadge, CountdownTimer } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Users, Clock, ExternalLink, Info, CheckCircle,
  AlertTriangle, FileText, Linkedin, Award, Banknote, Scale,
  Download, BarChart3, TrendingUp
} from 'lucide-react';

const PoolDetailPage = () => {
  const { poolId } = useParams();
  const navigate = useNavigate();
  const { getPoolWithDeal, currentUser, invest, isAdmin, resolveProcessingPool } = useAppStore();
  
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const poolWithDeal = getPoolWithDeal(poolId || '');

  if (!poolWithDeal) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <h2 className="mb-4 text-xl font-semibold">Vault not found</h2>
        <Button asChild>
          <Link to="/explore">Back to Explore</Link>
        </Button>
      </div>
    );
  }

  const { deal, ...pool } = poolWithDeal;
  const progress = (pool.raised_eur / pool.target_eur) * 100;
  const isExpired = new Date(pool.end_datetime) <= new Date();
  const isLive = pool.pool_status === 'live' && !isExpired;
  const effectiveStatus = pool.pool_status === 'live' && isExpired
    ? (pool.raised_eur >= pool.target_eur ? 'filled' : 'processing')
    : pool.pool_status;
  
  const amount = parseFloat(investAmount) || 0;
  const fee = amount * (pool.fee_entry_percent / 100);
  const total = amount + fee;
  const canAfford = currentUser && currentUser.wallet_balance_eur >= total;
  const meetsMinimum = amount >= deal.min_ticket_eur;
  const canInvest = isLive && canAfford && meetsMinimum && amount > 0;

  const handleInvest = async () => {
    if (!canInvest) return;
    
    setIsInvesting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = invest(pool.id, amount);
    
    if (success) {
      toast({
        title: 'Investment Successful!',
        description: `You invested ${formatCurrency(amount)} in ${deal.startup_name}`,
      });
      setInvestAmount('');
      navigate('/portfolio');
    } else {
      toast({
        title: 'Investment Failed',
        description: 'Please check your wallet balance and try again.',
        variant: 'destructive',
      });
    }
    
    setIsInvesting(false);
  };

  // Extract key metrics from highlights
  const keyMetrics = [
    { label: 'Valuation', value: formatCompactCurrency(deal.valuation_pre_money), icon: BarChart3 },
    { label: 'Equity Offered', value: `${deal.offer_equity_percent}%`, icon: TrendingUp },
    { label: 'Stage', value: deal.stage.toUpperCase(), icon: Award },
    { label: 'Min. Ticket', value: `€${deal.min_ticket_eur}`, icon: Banknote },
  ];

  return (
    <div className="container px-4 py-4 md:px-6 md:py-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-3 md:mb-4" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
      </Button>

      {effectiveStatus === 'processing' && (() => {
        const elapsedMs = Math.max(0, now - new Date(pool.end_datetime).getTime());
        const totalSec = Math.floor(elapsedMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        const elapsedLabel = days > 0
          ? `${days}d ${hours}h ${minutes}m ${seconds}s`
          : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return (
          <Alert className="mb-4 border-warning/40 bg-warning/10 md:mb-6">
            <Clock className="h-4 w-4 text-warning" />
            <AlertTitle className="flex flex-wrap items-center justify-between gap-2 text-warning">
              <span>Vault in Processing</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2 py-0.5 font-mono text-xs text-warning">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
                Processing for {elapsedLabel}
              </span>
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2 text-sm text-foreground/80">
              <p>
                This vault has reached its deadline without fully meeting the funding target
                ({formatCompactCurrency(pool.raised_eur)} raised of {formatCompactCurrency(pool.target_eur)}).
                VaultCapital is now evaluating the next step. Two outcomes are possible:
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  <strong className="text-success">FILLED</strong> — VaultCapital covers the remaining gap
                  and the vault closes successfully. Your investment proceeds as planned.
                </li>
                <li>
                  <strong className="text-destructive">FAILED</strong> — The vault is declared failed and
                  your full capital, including the entry fee, is refunded to your wallet within a few business days.
                </li>
              </ul>
              <p className="text-xs text-muted-foreground">
                No action is required from you at this stage. You will be notified as soon as a decision is made.
              </p>

              {isAdmin && (
                <div className="mt-3 flex flex-col gap-2 rounded-md border border-warning/30 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-foreground">
                    Admin simulation — resolve this vault:
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isResolving}
                      className="border-success/50 text-success hover:bg-success/10"
                      onClick={() => {
                        setIsResolving(true);
                        resolveProcessingPool(pool.id, 'filled');
                        toast({
                          title: `${deal.startup_name}: vault FILLED`,
                          description: 'VaultCapital covered the gap. Portfolio updated.',
                        });
                      }}
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" /> Mark FILLED
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isResolving}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setIsResolving(true);
                        resolveProcessingPool(pool.id, 'failed');
                        toast({
                          title: `${deal.startup_name}: vault FAILED`,
                          description: 'Capital and entry fees refunded to investors.',
                          variant: 'destructive',
                        });
                      }}
                    >
                      <AlertTriangle className="mr-1.5 h-4 w-4" /> Mark FAILED
                    </Button>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        );
      })()}

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <Card className="mb-4 md:mb-6">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-1.5 md:gap-2">
                    <StatusBadge status={effectiveStatus} />
                    <StatusBadge status={deal.stage} />
                    {deal.accelerator && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 md:text-xs">
                        <Award className="h-3 w-3" />
                        {deal.accelerator}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{deal.startup_name}</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {deal.industry} • {deal.sector_type} • {deal.country}
                  </CardDescription>
                </div>
                {isLive && (
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xs text-muted-foreground">Time Remaining</p>
                    <CountdownTimer endDatetime={pool.end_datetime} />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">
                      {formatCompactCurrency(pool.raised_eur)} raised of {formatCompactCurrency(pool.target_eur)}
                    </span>
                    <span className="font-medium">{formatPercent(progress, 0)}</span>
                  </div>
                  <Progress value={progress} className="h-2 md:h-2.5" />
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground md:gap-4 md:text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span>{pool.investors_count} investors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span>Started {formatDate(pool.start_datetime)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Card */}
          <Card className="mb-4 md:mb-6">
            <CardContent className="p-3 md:p-4">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-4">
                {keyMetrics.map(m => (
                  <div key={m.label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 p-2.5 md:gap-3 md:p-3">
                    <m.icon className="h-4 w-4 text-primary md:h-5 md:w-5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground md:text-xs">{m.label}</p>
                      <p className="text-sm font-semibold md:text-base">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="team" className="text-xs md:text-sm">Team</TabsTrigger>
              <TabsTrigger value="terms" className="text-xs md:text-sm">Terms</TabsTrigger>
              <TabsTrigger value="updates" className="text-xs md:text-sm">Updates</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs md:text-sm">Docs</TabsTrigger>
              <TabsTrigger value="faq" className="text-xs md:text-sm">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About {deal.startup_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{deal.long_description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {deal.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {deal.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        <span className="text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              {(deal.website_url || deal.founders?.some(f => f.linkedin_url)) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {deal.website_url && (
                      <Button variant="outline" className="w-full justify-start gap-2" asChild>
                        <a href={deal.website_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Website
                          <ExternalLink className="ml-auto h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {deal.founders && deal.founders.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Team</CardTitle>
                    <CardDescription>Founders & key roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {deal.founders.map((founder, i) => (
                        <div key={i} className="rounded-lg border p-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                              {founder.name.split(' ').filter(Boolean).map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate font-medium">{founder.name}</p>
                                {founder.linkedin_url && (
                                  <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                    <Linkedin className="h-5 w-5" />
                                  </a>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{founder.role}</p>
                            </div>
                          </div>
                          {(founder.education || founder.background) && (
                            <div className="mt-3 space-y-1 text-sm">
                              {founder.education && (
                                <p><span className="text-muted-foreground">Education: </span><span>{founder.education}</span></p>
                              )}
                              {founder.background && (
                                <p><span className="text-muted-foreground">Background: </span><span>{founder.background}</span></p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Team information not available.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="terms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investment Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">Target Raise</p>
                      <p className="text-xl font-bold">{formatCurrency(pool.target_eur, false)}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">Equity Offered</p>
                      <p className="text-xl font-bold">{deal.offer_equity_percent}%</p>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">Pre-money Valuation</p>
                      <p className="text-xl font-bold">{formatCompactCurrency(deal.valuation_pre_money)}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">Minimum Ticket</p>
                      <p className="text-xl font-bold">€{deal.min_ticket_eur}</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold">
                      <Banknote className="h-4 w-4" />
                      Fee Structure
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry Fee</span>
                        <span className="font-medium">{pool.fee_entry_percent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carry (on profit)</span>
                        <span className="font-medium">{pool.fee_carry_percent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resale Fee</span>
                        <span className="font-medium">1%</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-400">
                      <Scale className="h-4 w-4" />
                      Dividend & Governance Policy
                    </h4>
                    <div className="space-y-2 text-sm text-amber-900/80 dark:text-amber-200/80">
                      <p>
                        <strong>Dividend Rights:</strong> Dividends corresponding to your equity stake are managed by VaultCapital as SPV manager. 
                        You acquire economic rights to equity only; dividends are reinvested or distributed at VaultCapital's discretion.
                      </p>
                      <p>
                        <strong>Governance:</strong> Investors do not hold direct voting rights. All governance decisions regarding the investment 
                        are made by VaultCapital acting as nominee on behalf of all vault participants.
                      </p>
                      <p>
                        <strong>Exit:</strong> Exit timing and execution follow the vault's exit objectives. VaultCapital may deviate if market conditions change. Proceeds are distributed pro rata based on your ownership percentage of the SPV.
                      </p>
                    </div>
                  </div>

                  {/* Exit Objectives */}
                  {deal.exit_objectives && deal.exit_objectives.length > 0 && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <h4 className="mb-3 flex items-center gap-2 font-semibold">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Exit Objectives
                      </h4>
                      <ul className="space-y-2">
                        {deal.exit_objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span><strong>{obj.label}:</strong> {obj.value}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-muted-foreground italic">
                        VaultCapital may deviate if market conditions change.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="updates">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(deal.company_updates || []).length > 0 ? (
                      (deal.company_updates || []).map((update, i) => (
                        <div key={i} className="flex gap-4 border-l-2 border-primary pl-4">
                          <div className="flex-1">
                            <p className="font-medium">{update.headline}</p>
                            <p className="text-sm text-muted-foreground">{update.summary}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{formatDate(update.date)}</p>
                          </div>
                        </div>
                      ))
                    ) : null}
                    <div className="flex gap-4 border-l-2 border-primary pl-4">
                      <div className="flex-1">
                       <p className="font-medium">Vault Launched</p>
                        <p className="text-sm text-muted-foreground">Investment vault is now live for 72 hours</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(pool.start_datetime)}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 border-l-2 border-muted pl-4">
                      <div className="flex-1">
                        <p className="font-medium">Due Diligence Complete</p>
                        <p className="text-sm text-muted-foreground">VaultCapital has completed verification of all documents</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(new Date(new Date(pool.start_datetime).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents & Resources</CardTitle>
                  <CardDescription>Review all materials before investing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a 
                    href={deal.docs.pitch_deck_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Pitch Deck</p>
                      <p className="text-sm text-muted-foreground">Company presentation and business plan</p>
                    </div>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </a>
                  <a 
                    href={deal.docs.data_room_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Data Room</p>
                      <p className="text-sm text-muted-foreground">Financial statements, contracts, and legal documents</p>
                    </div>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </a>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      q: 'What happens if the target is not reached?',
                      a: 'If the vault fails to reach its target within the 72-hour window, all investments are automatically refunded to investors\' wallets.'
                    },
                    {
                      q: 'How does the SPV structure work?',
                      a: 'VaultCapital creates a Special Purpose Vehicle (SPV) that holds the investment on behalf of all vault participants. Investors own economic rights proportional to their investment.'
                    },
                    {
                      q: 'Can I sell my position before an exit?',
                      a: 'Yes, once the vault is active, you can list your position on the resale board. Liquidity is not guaranteed. Listings may not sell.'
                    },
                    {
                      q: 'What are the fees?',
                      a: `There is a ${pool.fee_entry_percent}% entry fee charged at the time of investment, and a ${pool.fee_carry_percent}% carry fee on profits at exit.`
                    }
                  ].map((faq, i) => (
                    <div key={i}>
                      <h4 className="font-medium">{faq.q}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Invest Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Risk Banner */}
            <Alert className="border-warning/30 bg-warning/5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertTitle className="text-sm text-warning">High Risk Investment</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Startup investments are speculative. You may lose your entire capital.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Invest in {deal.startup_name}</CardTitle>
                <CardDescription>
                  Minimum investment: €{deal.min_ticket_eur}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLive ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Investment Amount (EUR)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder={`Min. €${deal.min_ticket_eur}`}
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        min={deal.min_ticket_eur}
                        step={100}
                      />
                      {amount > 0 && !meetsMinimum && (
                        <p className="text-sm text-destructive">
                          Minimum investment is €{deal.min_ticket_eur}
                        </p>
                      )}
                    </div>

                    {amount > 0 && meetsMinimum && (
                      <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Investment</span>
                          <span>{formatCurrency(amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entry Fee ({pool.fee_entry_percent}%)</span>
                          <span>{formatCurrency(fee)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-medium">
                          <span>Total</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>
                    )}

                    {currentUser && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Your Balance</span>
                        <span className={!canAfford && amount > 0 ? 'text-destructive' : ''}>
                          {formatCurrency(currentUser.wallet_balance_eur)}
                        </span>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      size="lg" 
                      disabled={!canInvest || isInvesting}
                      onClick={handleInvest}
                    >
                      {isInvesting ? 'Processing...' : 'Invest Now'}
                    </Button>

                    <div className="flex items-start gap-2 rounded-lg bg-accent/50 p-3 text-xs text-muted-foreground">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        VaultCapital acts as nominee/SPV manager. Investors do not hold direct voting rights. 
                        Exit timing decided by VaultCapital.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p className="mb-2 font-medium">
                      {pool.pool_status === 'upcoming' ? 'Vault not yet live' : 'Vault closed'}
                    </p>
                    <p className="text-sm">
                      {pool.pool_status === 'upcoming' 
                        ? `Opens ${formatDate(pool.start_datetime)}` 
                        : 'This vault has ended'}
                    </p>
                    {pool.pool_status !== 'upcoming' && (
                      <div className="mt-4 space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/portfolio">View your position</Link>
                        </Button>
                        <Button variant="ghost" className="w-full" asChild>
                          <Link to="/marketplace">Browse resale board</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDetailPage;
