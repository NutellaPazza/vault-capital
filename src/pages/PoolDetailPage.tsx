import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge, CountdownTimer } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Users, 
  Clock,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  FileText,
  Linkedin,
  Award,
  Banknote,
  Scale
} from 'lucide-react';

const PoolDetailPage = () => {
  const { poolId } = useParams();
  const navigate = useNavigate();
  const { getPoolWithDeal, currentUser, invest } = useAppStore();
  
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  const poolWithDeal = getPoolWithDeal(poolId || '');

  if (!poolWithDeal) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <h2 className="mb-4 text-xl font-semibold">Pool not found</h2>
        <Button asChild>
          <Link to="/explore">Back to Explore</Link>
        </Button>
      </div>
    );
  }

  const { deal, ...pool } = poolWithDeal;
  const progress = (pool.raised_eur / pool.target_eur) * 100;
  const isLive = pool.pool_status === 'live';
  
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

  return (
    <div className="container py-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={pool.pool_status} />
                    <StatusBadge status={deal.stage} />
                    {deal.accelerator && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <Award className="h-3 w-3" />
                        {deal.accelerator}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{deal.startup_name}</CardTitle>
                  <CardDescription className="text-base">
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
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCompactCurrency(pool.raised_eur)} raised of {formatCompactCurrency(pool.target_eur)}
                    </span>
                    <span className="font-medium">{formatPercent(progress, 0)}</span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{pool.investors_count} investors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Started {formatDate(pool.start_datetime)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
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

              {/* Team moved to dedicated tab */}
              
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
              {/* Company Links */}
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

              {/* Founders */}
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
                              {founder.name
                                .split(' ')
                                .filter(Boolean)
                                .map(n => n[0])
                                .join('')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate font-medium">{founder.name}</p>
                                {founder.linkedin_url && (
                                  <a
                                    href={founder.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                    aria-label={`Open ${founder.name} on LinkedIn`}
                                  >
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
                                <p>
                                  <span className="text-muted-foreground">Education: </span>
                                  <span className="text-foreground">{founder.education}</span>
                                </p>
                              )}
                              {founder.background && (
                                <p>
                                  <span className="text-muted-foreground">Background: </span>
                                  <span className="text-foreground">{founder.background}</span>
                                </p>
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
                        <span className="text-muted-foreground">Marketplace Fee</span>
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
                        are made by VaultCapital acting as nominee on behalf of all pool participants.
                      </p>
                      <p>
                        <strong>Exit:</strong> Exit timing and execution are decided by VaultCapital. Proceeds are distributed pro-rata 
                        based on your ownership percentage of the SPV.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="updates">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pool Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 border-l-2 border-primary pl-4">
                      <div className="flex-1">
                        <p className="font-medium">Pool Launched</p>
                        <p className="text-sm text-muted-foreground">Investment pool is now live for 72 hours</p>
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
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <a href={deal.docs.pitch_deck_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      Pitch Deck
                      <ExternalLink className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <a href={deal.docs.data_room_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      Data Room
                      <ExternalLink className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
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
                      a: 'If the pool fails to reach its target within the 72-hour window, all investments are automatically refunded to investors\' wallets.'
                    },
                    {
                      q: 'How does the SPV structure work?',
                      a: 'VaultCapital creates a Special Purpose Vehicle (SPV) that holds the investment on behalf of all pool participants. Investors own economic rights proportional to their investment.'
                    },
                    {
                      q: 'Can I sell my position before an exit?',
                      a: 'Yes, once the pool is active, you can list your position on our secondary marketplace and sell to other investors.'
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
          <Card className="sticky top-20">
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
                    {pool.pool_status === 'upcoming' ? 'Pool not yet live' : 'Pool closed'}
                  </p>
                  <p className="text-sm">
                    {pool.pool_status === 'upcoming' 
                      ? `Opens ${formatDate(pool.start_datetime)}` 
                      : 'This investment pool has ended'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoolDetailPage;