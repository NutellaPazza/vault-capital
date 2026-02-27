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
    <div className="container space-y-6 py-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="text-xl font-bold">{formatCurrency(currentUser?.wallet_balance_eur || 0, false)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <PieChart className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Investments</p>
              <p className="text-xl font-bold">{positions.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-xl font-bold">{formatCompactCurrency(totalInvested)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${unrealizedGain >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <BarChart3 className={`h-6 w-6 ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolio P&L</p>
              <p className={`text-xl font-bold ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                {unrealizedGain >= 0 ? '+' : ''}{formatCurrency(unrealizedGain, false)}
              </p>
              <p className={`text-xs ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                {gainPercent >= 0 ? '+' : ''}{formatPercent(gainPercent, 1)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Vaults */}
      {livePools.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Vaults</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/explore">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Featured first live vault */}
          <Card className="mb-4 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-success/10 px-3 py-0.5 text-xs font-semibold text-success animate-pulse-soft">
                      ● LIVE
                    </span>
                    <span className="text-sm text-muted-foreground">{livePools[0].deal.industry}</span>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">{livePools[0].deal.startup_name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{livePools[0].deal.short_description}</p>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCompactCurrency(livePools[0].raised_eur)} raised
                      </span>
                      <span className="font-medium">
                        {formatPercent((livePools[0].raised_eur / livePools[0].target_eur) * 100, 0)} of {formatCompactCurrency(livePools[0].target_eur)}
                      </span>
                    </div>
                    <Progress value={(livePools[0].raised_eur / livePools[0].target_eur) * 100} className="h-2.5" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{livePools[0].investors_count} investors</span>
                    <span>Min €{livePools[0].deal.min_ticket_eur}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-t bg-muted/50 p-6 md:border-l md:border-t-0">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">TIME REMAINING</p>
                  <CountdownTimer endDatetime={livePools[0].end_datetime} />
                  {new Date(livePools[0].end_datetime) > new Date() ? (
                    <Button className="mt-4 w-full" asChild>
                      <Link to={`/pool/${livePools[0].id}`}>
                        Invest Now <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <span className="mt-2 inline-block rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Ended</span>
                      <Button className="mt-2 w-full" variant="outline" asChild>
                        <Link to={`/pool/${livePools[0].id}`}>
                          View Vault <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other live vaults as compact cards */}
          {livePools.length > 1 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {livePools.slice(1).map(pool => (
                <Card key={pool.id} className="transition-colors hover:bg-muted/30">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                        ● LIVE
                      </span>
                      <span className="text-xs text-muted-foreground">{pool.deal.industry}</span>
                    </div>
                    <h4 className="mb-1 font-semibold">{pool.deal.startup_name}</h4>
                    <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{pool.deal.short_description}</p>
                    <div className="mb-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{formatCompactCurrency(pool.raised_eur)} raised</span>
                        <span className="font-medium">{formatPercent((pool.raised_eur / pool.target_eur) * 100, 0)}</span>
                      </div>
                      <Progress value={(pool.raised_eur / pool.target_eur) * 100} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{pool.investors_count} investors</span>
                      <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portfolio Performance */}
        {positions.length > 0 && (
          <section>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Portfolio Performance</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/portfolio">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {positions.map(pos => {
                  const pnl = pos.current_estimated_value_eur - pos.invested_eur;
                  const pnlPercent = (pnl / pos.invested_eur) * 100;
                  return (
                    <Link key={pos.id} to={`/pool/${pos.pool_id}`} className="block">
                      <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{pos.deal.startup_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {pos.deal.industry} • {pos.deal.country} • {pos.deal.sector_type}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{pos.deal.short_description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(pos.current_estimated_value_eur, false)}</p>
                          <p className={`text-xs font-medium ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
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
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Newspaper className="h-5 w-5" />
                  Company Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyUpdates.map((update, i) => (
                  <div key={i} className="flex gap-4 border-l-2 border-primary pl-4">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-primary">{update.startup_name}</p>
                      <p className="font-medium">{update.headline}</p>
                      <p className="text-sm text-muted-foreground">{update.summary}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(update.date)}</p>
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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                 <CardTitle className="flex items-center gap-2 text-lg">
                   <Store className="h-5 w-5" />
                   Resale Board Activity
                 </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/marketplace?tab=sell">Manage</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{myListings.length}</span>
                  <span className="text-sm text-muted-foreground">Active Listings</span>
                </div>
                {myPendingOffers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{myPendingOffers.length}</span>
                    <span className="text-sm text-muted-foreground">Pending Offers</span>
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Vaults</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/explore">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {upcomingPools.map(pool => (
              <div key={pool.id} className="w-72 flex-shrink-0">
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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Updates</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotifications.map(notification => (
                <div key={notification.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Quick Actions */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-gradient-to-br from-card to-accent/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">Deposit Funds</h3>
              <p className="text-sm text-muted-foreground">Add money to your wallet</p>
            </div>
            <Button asChild>
              <Link to="/wallet">Deposit</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">Browse Resale Board</h3>
              <p className="text-sm text-muted-foreground">Buy positions from other investors</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/marketplace">Explore</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
