import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';
import { PoolWithDeal } from '@/types';
import { formatCompactCurrency, formatPercent } from '@/lib/formatters';
import { Users, TrendingUp, MapPin, Briefcase, Globe } from 'lucide-react';

interface PoolCardProps {
  pool: PoolWithDeal;
  variant?: 'default' | 'compact' | 'featured';
}

export const PoolCard = ({ pool, variant = 'default' }: PoolCardProps) => {
  const progress = (pool.raised_eur / pool.target_eur) * 100;
  const isLive = pool.pool_status === 'live';
  const isUpcoming = pool.pool_status === 'upcoming';

  if (variant === 'compact') {
    return (
      <Link to={`/pool/${pool.id}`}>
        <Card className="h-full transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{pool.deal.startup_name}</h3>
                <p className="text-xs text-muted-foreground">{pool.deal.industry}</p>
              </div>
              <StatusBadge status={pool.pool_status} />
            </div>
            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{pool.deal.short_description}</p>
            <div className="mb-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
                <MapPin className="h-3 w-3" /> {pool.deal.country}
              </span>
              <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
                <Briefcase className="h-3 w-3" /> {pool.deal.stage}
              </span>
              <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
                {pool.deal.sector_type}
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCompactCurrency(pool.raised_eur)} raised</span>
                <span>{formatPercent(progress, 0)}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatPercent(pool.deal.offer_equity_percent)} equity</span>
              <span>Min €{pool.deal.min_ticket_eur}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-accent/30">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <StatusBadge status={pool.pool_status} className="mb-2" />
              <h2 className="text-2xl font-bold">{pool.deal.startup_name}</h2>
              <p className="text-muted-foreground">{pool.deal.industry} • {pool.deal.country}</p>
            </div>
            <StatusBadge status={pool.deal.stage} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{pool.deal.short_description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {formatCompactCurrency(pool.raised_eur)} / {formatCompactCurrency(pool.target_eur)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="font-semibold">{formatCompactCurrency(pool.target_eur)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Equity</p>
              <p className="font-semibold">{pool.deal.offer_equity_percent}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Min. Ticket</p>
              <p className="font-semibold">€{pool.deal.min_ticket_eur}</p>
            </div>
          </div>

          {isLive && (
            <div className="flex items-center justify-between rounded-lg bg-card p-3">
              <div>
                <p className="text-xs text-muted-foreground">Time Remaining</p>
                <CountdownTimer endDatetime={pool.end_datetime} compact />
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{pool.investors_count} investors</span>
              </div>
            </div>
          )}

          <Button asChild className="w-full" size="lg">
            <Link to={`/pool/${pool.id}`}>
              {isLive ? 'Invest Now' : isUpcoming ? 'View Details' : 'View Pool'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default variant — enriched with more startup info
  return (
    <Link to={`/pool/${pool.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="font-semibold">{pool.deal.startup_name}</h3>
                <StatusBadge status={pool.pool_status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {pool.deal.industry} • {pool.deal.country}
              </p>
            </div>
            <StatusBadge status={pool.deal.stage} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {pool.deal.short_description}
          </p>

          {/* Key highlights */}
          {pool.deal.highlights.length > 0 && (
            <div className="space-y-1">
              {pool.deal.highlights.slice(0, 2).map((h, i) => (
                <p key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="line-clamp-1">{h}</span>
                </p>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{pool.deal.sector_type}</span>
            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{pool.deal.country}</span>
            {pool.deal.accelerator && (
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{pool.deal.accelerator}</span>
            )}
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-medium">
                {formatCompactCurrency(pool.raised_eur)} / {formatCompactCurrency(pool.target_eur)}
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between text-sm">
            {isLive ? (
              <CountdownTimer endDatetime={pool.end_datetime} compact className="text-primary" />
            ) : isUpcoming ? (
              <span className="text-muted-foreground">Starts soon</span>
            ) : (
              <span className="text-muted-foreground">Closed</span>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{pool.investors_count}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <span>{formatPercent(pool.deal.offer_equity_percent)} equity • Min €{pool.deal.min_ticket_eur}</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {formatCompactCurrency(pool.deal.valuation_pre_money)} valuation
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
