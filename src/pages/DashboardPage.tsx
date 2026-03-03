import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PoolCard, CountdownTimer } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from '@/lib/formatters';
import { 
  Wallet, TrendingUp, PieChart, ArrowRight, Clock, 
  Newspaper, Store, BarChart3 
} from 'lucide-react';

const DashboardPage = () => {
  const { 
    currentUser, getLivePools, getUpcomingPools, getPositionsWithPools, 
    notifications, deals, listings, offers, pools 
  } = useAppStore();
  
  const livePools = getLivePools();
  const upcomingPools = getUpcomingPools();
  const positions = getPositionsWithPools();
  const recentNotifications = notifications.filter(n => !n.read).slice(0, 3);
  
  const totalInvested = positions.reduce((sum, p) => sum + p.invested_eur, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.current_estimated_value_eur, 0);
  const unrealizedGain = totalValue - totalInvested;
  const gainPercent = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

  // Company updates from invested deals
  const companyUpdates = positions
    .flatMap(p => 
      (p.deal?.company_updates || []).map(u => ({ ...u, startup_name: p.deal.startup_name }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // My marketplace activity
  const myListings = listings.filter(l => l.seller_user_id === currentUser?.id && l.status === 'active');
  const myPendingOffers = offers.filter(o => {
    const listing = listings.find(l => l.id === o.listing_id);
    return listing?.seller_user_id === currentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container space-y-4 px-4 py-4 md:space-y-6 md:px-6 md:py-6">
      {/* Stats Cards — 2x2 grid on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-2.5 p-3 md:gap-4 md:p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 md:h-12 md:w-12">
              <Wallet className="h-4 w-4 text-primary md:h-6 md:w-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-muted-foreground md:text-sm">Wallet</p>
              <p className="truncate text-base font-bold md:text-xl">{formatCurrency(currentUser?.wallet_balance_eur || 0, false)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-2.5 p-3 md:gap-4 md:p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent md:h-12 md:w-12">
              <PieChart className="h-4 w-4 text-accent-foreground md:h-6 md:w-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-muted-foreground md:text-sm">Investments</p>
              <p className="truncate text-base font-bold md:text-xl">{positions.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-2.5 p-3 md:gap-4 md:p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted md:h-12 md:w-12">
              <TrendingUp className="h-4 w-4 text-muted-foreground md:h-6 md:w-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-muted-foreground md:text-sm">Invested</p>
              <p className="truncate text-base font-bold md:text-xl">{formatCompactCurrency(totalInvested)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-2.5 p-3 md:gap-4 md:p-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg md:h-12 md:w-12 ${unrealizedGain >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <BarChart3 className={`h-4 w-4 md:h-6 md:w-6 ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-muted-foreground md:text-sm">P&L</p>
              <p className={`truncate text-base font-bold md:text-xl ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                {unrealizedGain >= 0 ? '+' : ''}{formatCurrency(unrealizedGain, false)}
              </p>
              <p className={`text-[10px] md:text-xs ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                {gainPercent >= 0 ? '+' : ''}{formatPercent(gainPercent, 1)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Vaults */}
      {livePools.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <h2 className="text-lg font-semibold md:text-xl">Live Vaults</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/explore">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Featured first live vault */}
          <Card className="mb-3 overflow-hidden md:mb-4">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-4 md:p-6">
                  <div className="mb-2 flex items-center gap-2 md:mb-3">
                    <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-success animate-pulse-soft md:px-3 md:text-xs">
                      ● LIVE
                    </span>
                    <span className="text-xs text-muted-foreground md:text-sm">{livePools[0].deal.industry}</span>
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold md:mb-2 md:text-2xl">{livePools[0].deal.startup_name}</h3>
                  <p className="mb-3 line-clamp-2 text-xs text-muted-foreground md:mb-4 md:line-clamp-none md:text-sm">{livePools[0].deal.short_description}</p>
                  
                  <div className="mb-3 space-y-1.5 md:mb-4 md:space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">
                        {formatCompactCurrency(livePools[0].raised_eur)} raised
                      </span>
                      <span className="font-medium">
                        {formatPercent((livePools[0].raised_eur / livePools[0].target_eur) * 100, 0)} of {formatCompactCurrency(livePools[0].target_eur)}
                      </span>
                    </div>
                    <Progress value={(livePools[0].raised_eur / livePools[0].target_eur) * 100} className="h-2 md:h-2.5" />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground md:gap-4 md:text-sm">
                    <span>{livePools[0].investors_count} investors</span>
                    <span>Min €{livePools[0].deal.min_ticket_eur}</span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 border-t bg-muted/50 p-4 md:flex-col md:justify-center md:border-l md:border-t-0 md:p-6">
                  <div className="flex flex-col items-center">
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground md:mb-2 md:text-xs">TIME REMAINING</p>
                    <CountdownTimer endDatetime={livePools[0].end_datetime} />
                  </div>
                  {new Date(livePools[0].end_datetime) > new Date() ? (
                    <Button className="shrink-0 md:mt-4 md:w-full" size="sm" asChild>
                      <Link to={`/pool/${livePools[0].id}`}>
                        Invest Now <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 md:mt-2 md:flex-col md:w-full">
                      <span className="inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground md:text-xs">Ended</span>
                      <Button variant="outline" size="sm" className="shrink-0 md:w-full" asChild>
                        <Link to={`/pool/${livePools[0].id}`}>
                          View Vault <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other live vaults as compact cards */}
          {livePools.length > 1 && (
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {livePools.slice(1).map(pool => (
                <Card key={pool.id} className="transition-colors hover:bg-muted/30">
                  <CardContent className="p-3 md:p-4">
                    <div className="mb-1.5 flex items-center gap-2 md:mb-2">
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                        ● LIVE
                      </span>
                      <span className="text-[10px] text-muted-foreground md:text-xs">{pool.deal.industry}</span>
                    </div>
                    <h4 className="mb-0.5 text-sm font-semibold md:mb-1 md:text-base">{pool.deal.startup_name}</h4>
                    <p className="mb-2 line-clamp-2 text-[11px] text-muted-foreground md:mb-3 md:text-xs">{pool.deal.short_description}</p>
                    <div className="mb-1.5 space-y-1 md:mb-2">
                      <div className="flex justify-between text-[11px] md:text-xs">
                        <span className="text-muted-foreground">{formatCompactCurrency(pool.raised_eur)} raised</span>
                        <span className="font-medium">{formatPercent((pool.raised_eur / pool.target_eur) * 100, 0)}</span>
                      </div>
                      <Progress value={(pool.raised_eur / pool.target_eur) * 100} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground md:text-xs">{pool.investors_count} investors</span>
                      <Button size="sm" variant="outline" className="h-6 text-[11px] md:h-7 md:text-xs" asChild>
                        <Link to={`/pool/${pool.id}`}>
                          View <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Portfolio Performance */}
        {positions.length > 0 && (
          <section>
            <Card>
              <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">Portfolio Performance</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 text-xs md:h-9 md:text-sm" asChild>
                    <Link to="/portfolio">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-4 md:space-y-3 md:px-6">
                {positions.map(pos => {
                  const pnl = pos.current_estimated_value_eur - pos.invested_eur;
                  const pnlPercent = (pnl / pos.invested_eur) * 100;
                  return (
                    <Link key={pos.id} to={`/pool/${pos.pool_id}`} className="block">
                      <div className="flex items-center justify-between gap-3 rounded-lg border p-2.5 transition-colors hover:bg-muted/50 md:p-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium md:text-base">{pos.deal.startup_name}</p>
                          <p className="truncate text-[10px] text-muted-foreground md:text-xs">
                            {pos.deal.industry} • {pos.deal.country}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-medium md:text-base">{formatCurrency(pos.current_estimated_value_eur, false)}</p>
                          <p className={`text-[10px] font-medium md:text-xs ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {pnl >= 0 ? '+' : ''}{formatCurrency(pnl, false)} ({pnl >= 0 ? '+' : ''}{formatPercent(pnlPercent, 1)})
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Company Updates Feed */}
        {companyUpdates.length > 0 && (
          <section>
            <Card>
              <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Newspaper className="h-4 w-4 md:h-5 md:w-5" />
                  Company Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 md:space-y-4 md:px-6">
                {companyUpdates.map((update, i) => (
                  <div key={i} className="flex gap-3 border-l-2 border-primary pl-3 md:gap-4 md:pl-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-medium text-primary md:text-xs">{update.startup_name}</p>
                      <p className="text-sm font-medium md:text-base">{update.headline}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground md:line-clamp-none md:text-sm">{update.summary}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground md:mt-1 md:text-xs">{formatDate(update.date)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Marketplace Activity */}
      {(myListings.length > 0 || myPendingOffers.length > 0) && (
        <section>
          <Card>
            <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
              <div className="flex items-center justify-between">
                 <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                   <Store className="h-4 w-4 md:h-5 md:w-5" />
                   Resale Board
                 </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs md:h-9 md:text-sm" asChild>
                  <Link to="/marketplace?tab=sell">Manage</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="flex gap-4 md:gap-6">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-xl font-bold md:text-2xl">{myListings.length}</span>
                  <span className="text-xs text-muted-foreground md:text-sm">Active Listings</span>
                </div>
                {myPendingOffers.length > 0 && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="text-xl font-bold text-primary md:text-2xl">{myPendingOffers.length}</span>
                    <span className="text-xs text-muted-foreground md:text-sm">Pending Offers</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Upcoming Pools */}
      {upcomingPools.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <h2 className="text-lg font-semibold md:text-xl">Upcoming Vaults</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/explore">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:gap-4">
            {upcomingPools.map(pool => (
              <div key={pool.id} className="w-60 flex-shrink-0 md:w-72">
                <PoolCard pool={pool} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <section>
          <Card>
            <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Recent Updates</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs md:h-9 md:text-sm" asChild>
                  <Link to="/profile">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-4 md:space-y-3 md:px-6">
              {recentNotifications.map(notification => (
                <div key={notification.id} className="flex items-start gap-2.5 rounded-lg border p-2.5 md:gap-3 md:p-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-8 md:w-8">
                    <Clock className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium md:text-base">{notification.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">{notification.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Quick Actions */}
      <section className="grid gap-2.5 sm:grid-cols-2 md:gap-4">
        <Card className="bg-gradient-to-br from-card to-accent/20">
          <CardContent className="flex items-center justify-between p-4 md:p-6">
            <div>
              <h3 className="text-sm font-semibold md:text-base">Deposit Funds</h3>
              <p className="text-xs text-muted-foreground md:text-sm">Add money to your wallet</p>
            </div>
            <Button size="sm" className="md:size-default" asChild>
              <Link to="/wallet">Deposit</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardContent className="flex items-center justify-between p-4 md:p-6">
            <div>
              <h3 className="text-sm font-semibold md:text-base">Browse Resale Board</h3>
              <p className="text-xs text-muted-foreground md:text-sm">Buy positions from other investors</p>
            </div>
            <Button variant="outline" size="sm" className="md:size-default" asChild>
              <Link to="/marketplace">Explore</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
