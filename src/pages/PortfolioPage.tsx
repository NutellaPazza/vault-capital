import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from '@/lib/formatters';
import {
  TrendingUp, TrendingDown, ExternalLink, Store, PieChart, ShoppingBag, Info,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, Calendar, Clock,
  Download, FileText, ChevronDown, Search, Filter, ArrowUpDown, Minus, Activity,
  Banknote, Receipt, Target, Sparkles, X, Bell, Wallet, BarChart3, Percent,
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { motion } from 'framer-motion';

// Mock value-over-time series (kept illustrative)
const portfolioValueData = [
  { month: 'Sep', value: 10000 },
  { month: 'Oct', value: 10200 },
  { month: 'Nov', value: 10800 },
  { month: 'Dec', value: 11100 },
  { month: 'Jan', value: 11900 },
  { month: 'Feb', value: 12500 },
];

const DONUT_COLORS = [
  'hsl(24, 90%, 55%)',
  'hsl(142, 72%, 42%)',
  'hsl(220, 15%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 55%)',
  'hsl(200, 70%, 50%)',
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const IllustrativeTag = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-2 inline-flex cursor-help items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Info className="h-3 w-3" /> Illustrative
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Chart data is for demonstration purposes only.</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

type SortKey = 'pnl_pct' | 'pnl_abs' | 'invested' | 'value' | 'date';
type FilterStatus = 'all' | 'active' | 'filled' | 'failed' | 'closed';

const PortfolioPage = () => {
  const { getPositionsWithPools, createListing, pools, deals, listings, transactions } = useAppStore();
  const positions = getPositionsWithPools();

  // Listing dialog state
  const [listingPosition, setListingPosition] = useState<string | null>(null);
  const [listingPercent, setListingPercent] = useState('100');
  const [listingPrice, setListingPrice] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter/sort state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [hideListed, setHideListed] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('pnl_pct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Drill-down drawer
  const [drillPositionId, setDrillPositionId] = useState<string | null>(null);

  // What-if simulator
  const [whatIfPct, setWhatIfPct] = useState(50);

  // Dismissed alerts (session)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // ---- Aggregate metrics ----
  const totalInvested = positions.reduce((sum, p) => sum + p.invested_eur, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.current_estimated_value_eur, 0);
  const unrealizedGain = totalValue - totalInvested;
  const unrealizedPercent = totalInvested > 0 ? (unrealizedGain / totalInvested) * 100 : 0;

  // MoM delta (illustrative: from last two points of mock series)
  const lastMonth = portfolioValueData[portfolioValueData.length - 2]?.value ?? totalValue;
  const momAbs = totalValue - lastMonth;
  const momPct = lastMonth > 0 ? (momAbs / lastMonth) * 100 : 0;

  // Best & worst performer (this period)
  const ranked = useMemo(() => {
    return [...positions]
      .map(p => ({
        name: p.deal.startup_name,
        poolId: p.pool_id,
        pnl: p.current_estimated_value_eur - p.invested_eur,
        pnlPct: p.invested_eur > 0
          ? ((p.current_estimated_value_eur - p.invested_eur) / p.invested_eur) * 100
          : 0,
      }))
      .sort((a, b) => b.pnlPct - a.pnlPct);
  }, [positions]);
  const bestPerformer = ranked[0];
  const worstPerformer = ranked[ranked.length - 1];

  // ---- Charts data ----
  const plByPosition = useMemo(() => positions.map(p => ({
    name: p.deal.startup_name,
    pnl: p.current_estimated_value_eur - p.invested_eur,
  })), [positions]);

  const allocationData = useMemo(() => positions.map(p => ({
    name: p.deal.startup_name,
    value: p.invested_eur,
  })), [positions]);

  // ---- Fees breakdown ----
  const feesBreakdown = useMemo(() => {
    const entry = transactions.filter(t => t.type === 'fee' && (t.meta?.notes || '').toLowerCase().includes('entry'))
      .reduce((s, t) => s + Math.abs(t.amount_eur), 0);
    const carry = transactions.filter(t => t.type === 'fee' && (t.meta?.notes || '').toLowerCase().includes('carry'))
      .reduce((s, t) => s + Math.abs(t.amount_eur), 0);
    const resale = transactions.filter(t => t.type === 'fee' && (t.meta?.notes || '').toLowerCase().includes('resale'))
      .reduce((s, t) => s + Math.abs(t.amount_eur), 0);
    const all = transactions.filter(t => t.type === 'fee').reduce((s, t) => s + Math.abs(t.amount_eur), 0);
    const other = Math.max(0, all - entry - carry - resale);
    return { entry, carry, resale, other, total: all };
  }, [transactions]);

  // ---- Diversification health ----
  const diversification = useMemo(() => {
    if (positions.length === 0) {
      return { concentration: 0, sectors: 0, stages: 0, score: 0, topName: '' };
    }
    const sorted = [...positions].sort((a, b) => b.invested_eur - a.invested_eur);
    const top = sorted[0];
    const concentration = totalInvested > 0 ? (top.invested_eur / totalInvested) * 100 : 0;
    const sectors = new Set(positions.map(p => p.deal.industry)).size;
    const stages = new Set(positions.map(p => p.deal.stage)).size;

    // Simple score 0-100
    const concentrationScore = Math.max(0, 100 - concentration); // lower = better
    const sectorScore = Math.min(100, sectors * 25);
    const stageScore = Math.min(100, stages * 35);
    const score = Math.round((concentrationScore * 0.5) + (sectorScore * 0.3) + (stageScore * 0.2));
    return { concentration, sectors, stages, score, topName: top.deal.startup_name };
  }, [positions, totalInvested]);

  const concentrationLevel: 'low' | 'medium' | 'high' =
    diversification.concentration > 60 ? 'high' :
    diversification.concentration > 35 ? 'medium' : 'low';

  // ---- Next milestones ----
  const milestones = useMemo(() => {
    const items: Array<{
      type: 'vault_close' | 'update' | 'listing_expiry' | 'exit_window';
      title: string;
      subtitle: string;
      date: Date;
      poolId?: string;
      icon: typeof Calendar;
    }> = [];

    const now = Date.now();

    positions.forEach(p => {
      const pool = pools.find(po => po.id === p.pool_id);
      if (!pool) return;
      const end = new Date(pool.end_datetime).getTime();
      if (pool.pool_status === 'active' && end > now) {
        items.push({
          type: 'vault_close',
          title: `${p.deal.startup_name} Vault closes`,
          subtitle: 'Allocation will be locked',
          date: new Date(end),
          poolId: p.pool_id,
          icon: Clock,
        });
      }
      // Estimated exit window 18 months after creation (illustrative)
      const created = new Date(p.created_at).getTime();
      const exitDate = new Date(created + 1000 * 60 * 60 * 24 * 540);
      if (exitDate.getTime() > now) {
        items.push({
          type: 'exit_window',
          title: `${p.deal.startup_name} estimated exit window`,
          subtitle: 'Indicative target. Subject to market conditions',
          date: exitDate,
          poolId: p.pool_id,
          icon: Target,
        });
      }
    });

    // Listings expiring (illustrative: 30 days from listing creation)
    listings
      .filter(l => l.status === 'active' && l.seller_user_id === positions[0]?.user_id)
      .forEach(l => {
        const exp = new Date(new Date(l.created_at).getTime() + 1000 * 60 * 60 * 24 * 30);
        const deal = deals.find(d => pools.find(po => po.id === l.pool_id)?.deal_id === d.id);
        items.push({
          type: 'listing_expiry',
          title: `Your listing expires (${deal?.startup_name ?? 'position'})`,
          subtitle: `Asking ${formatCompactCurrency(l.ask_price_eur)}`,
          date: exp,
          icon: Store,
        });
      });

    return items.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 4);
  }, [positions, pools, listings, deals]);

  // ---- Activity feed (recent transactions for current user) ----
  const activityFeed = useMemo(() => {
    const userId = positions[0]?.user_id;
    if (!userId) return [];
    return transactions
      .filter(t => t.user_id === userId)
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  }, [transactions, positions]);

  // ---- My active listings ----
  const myActiveListings = listings.filter(l =>
    l.seller_user_id === positions[0]?.user_id && l.status === 'active'
  );

  // ---- Smart alerts ----
  const alerts = useMemo(() => {
    const list: Array<{
      id: string;
      severity: 'info' | 'warning' | 'critical' | 'success';
      icon: typeof Bell;
      title: string;
      description: string;
      action?: { label: string; href?: string; onClick?: () => void };
    }> = [];

    // High concentration
    if (diversification.concentration > 60 && diversification.topName) {
      list.push({
        id: 'concentration',
        severity: 'warning',
        icon: AlertTriangle,
        title: 'High concentration risk',
        description: `${diversification.topName} represents ${formatPercent(diversification.concentration, 0)} of your portfolio. Consider diversifying.`,
        action: { label: 'Explore vaults', href: '/explore' },
      });
    }

    // Vault closing in <48h
    const now = Date.now();
    positions.forEach(p => {
      const pool = pools.find(po => po.id === p.pool_id);
      if (!pool || pool.pool_status !== 'active') return;
      const hoursLeft = (new Date(pool.end_datetime).getTime() - now) / (1000 * 60 * 60);
      if (hoursLeft > 0 && hoursLeft < 48) {
        list.push({
          id: `closing-${p.pool_id}`,
          severity: 'info',
          icon: Clock,
          title: `${p.deal.startup_name} Vault closing soon`,
          description: `Closes in ${Math.round(hoursLeft)}h. Allocation will be locked.`,
          action: { label: 'Open vault', href: `/pool/${p.pool_id}` },
        });
      }
    });

    // Listing expiring (<7 days)
    listings
      .filter(l => l.status === 'active' && l.seller_user_id === positions[0]?.user_id)
      .forEach(l => {
        const exp = new Date(l.created_at).getTime() + 1000 * 60 * 60 * 24 * 30;
        const daysLeft = (exp - now) / (1000 * 60 * 60 * 24);
        if (daysLeft > 0 && daysLeft < 7) {
          const deal = deals.find(d => pools.find(po => po.id === l.pool_id)?.deal_id === d.id);
          list.push({
            id: `listing-${l.id}`,
            severity: 'warning',
            icon: Store,
            title: 'Resale listing expiring',
            description: `Your ${deal?.startup_name ?? 'listing'} expires in ${Math.ceil(daysLeft)}d at ${formatCompactCurrency(l.ask_price_eur)}.`,
            action: { label: 'Manage', href: '/marketplace' },
          });
        }
      });

    // Big underperformer (-20% or worse)
    const losers = positions.filter(p => {
      const pct = p.invested_eur > 0
        ? ((p.current_estimated_value_eur - p.invested_eur) / p.invested_eur) * 100
        : 0;
      return pct < -20;
    });
    if (losers.length > 0) {
      list.push({
        id: 'underperformer',
        severity: 'critical',
        icon: TrendingDown,
        title: `${losers.length} position${losers.length > 1 ? 's' : ''} underperforming`,
        description: `${losers.map(p => p.deal.startup_name).join(', ')} dropped over 20% from entry.`,
      });
    }

    // Strong performer (+50% or more)
    const winners = positions.filter(p => {
      const pct = p.invested_eur > 0
        ? ((p.current_estimated_value_eur - p.invested_eur) / p.invested_eur) * 100
        : 0;
      return pct > 50 && !p.is_listed_on_market && p.pool.pool_status === 'active';
    });
    if (winners.length > 0) {
      list.push({
        id: 'winner',
        severity: 'success',
        icon: Sparkles,
        title: `Take profit opportunity`,
        description: `${winners[0].deal.startup_name} is up significantly. Consider partial sale on Resale Board.`,
      });
    }

    return list.filter(a => !dismissedAlerts.has(a.id));
  }, [positions, pools, listings, deals, diversification, dismissedAlerts]);

  // ---- What-if simulator: sell whatIfPct of all active, listable positions ----
  const whatIf = useMemo(() => {
    const listable = positions.filter(p =>
      p.pool.pool_status === 'active' && !p.is_listed_on_market
    );
    const totalListableValue = listable.reduce((s, p) => s + p.current_estimated_value_eur, 0);
    const totalListableInvested = listable.reduce((s, p) => s + p.invested_eur, 0);
    const sellValue = totalListableValue * (whatIfPct / 100);
    const sellInvested = totalListableInvested * (whatIfPct / 100);
    const grossPnl = sellValue - sellInvested;
    const carry = grossPnl > 0 ? grossPnl * 0.02 : 0; // 2% carry on profit
    const netCash = sellValue - carry;
    const remainingValue = totalValue - sellValue;
    return {
      listableCount: listable.length,
      totalListableValue,
      sellValue,
      grossPnl,
      carry,
      netCash,
      remainingValue,
    };
  }, [positions, whatIfPct, totalValue]);

  // ---- Drill-down position data ----
  const drillPosition = useMemo(() => {
    if (!drillPositionId) return null;
    return positions.find(p => p.id === drillPositionId) ?? null;
  }, [drillPositionId, positions]);

  const drillTransactions = useMemo(() => {
    if (!drillPosition) return [];
    return transactions
      .filter(t => t.meta?.pool_id === drillPosition.pool_id)
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [drillPosition, transactions]);

  // ---- Filtered + sorted positions ----
  const filteredPositions = useMemo(() => {
    let list = [...positions];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.deal.startup_name.toLowerCase().includes(q) ||
        p.deal.industry.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') {
      list = list.filter(p => p.pool.pool_status === filterStatus);
    }
    if (hideListed) {
      list = list.filter(p => !p.is_listed_on_market);
    }
    list.sort((a, b) => {
      const aPnl = a.current_estimated_value_eur - a.invested_eur;
      const bPnl = b.current_estimated_value_eur - b.invested_eur;
      const aPnlPct = a.invested_eur > 0 ? aPnl / a.invested_eur : 0;
      const bPnlPct = b.invested_eur > 0 ? bPnl / b.invested_eur : 0;
      let cmp = 0;
      switch (sortKey) {
        case 'pnl_pct': cmp = aPnlPct - bPnlPct; break;
        case 'pnl_abs': cmp = aPnl - bPnl; break;
        case 'invested': cmp = a.invested_eur - b.invested_eur; break;
        case 'value': cmp = a.current_estimated_value_eur - b.current_estimated_value_eur; break;
        case 'date': cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [positions, search, filterStatus, hideListed, sortKey, sortDir]);

  // ---- Handlers ----
  const handleCreateListing = () => {
    const percent = parseFloat(listingPercent);
    const price = parseFloat(listingPrice);

    if (!listingPosition || isNaN(percent) || isNaN(price) || percent <= 0 || percent > 100 || price <= 0) {
      toast({ title: 'Invalid Input', description: 'Please enter valid values for percentage and price.', variant: 'destructive' });
      return;
    }

    createListing(listingPosition, percent, price);
    toast({ title: 'Listing Created', description: 'Your position is now listed on the resale board.' });

    setIsDialogOpen(false);
    setListingPosition(null);
    setListingPercent('100');
    setListingPrice('');
  };

  const openListingDialog = (positionId: string, estimatedValue: number) => {
    setListingPosition(positionId);
    setListingPrice(estimatedValue.toString());
    setIsDialogOpen(true);
  };

  const exportCsv = () => {
    const rows = [
      ['Company', 'Industry', 'Stage', 'Invested EUR', 'Ownership %', 'Est Value EUR', 'PnL EUR', 'PnL %', 'Listed', 'Created'],
      ...positions.map(p => {
        const pnl = p.current_estimated_value_eur - p.invested_eur;
        const pnlPct = p.invested_eur > 0 ? (pnl / p.invested_eur) * 100 : 0;
        return [
          p.deal.startup_name, p.deal.industry, p.deal.stage,
          p.invested_eur.toFixed(2),
          p.ownership_percent_of_spv.toFixed(4),
          p.current_estimated_value_eur.toFixed(2),
          pnl.toFixed(2),
          pnlPct.toFixed(2),
          p.is_listed_on_market ? 'Yes' : 'No',
          p.created_at,
        ];
      }),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaultcapital-portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'CSV exported', description: 'Your portfolio has been downloaded.' });
  };

  const generatePdf = () => {
    // Simple printable view (browser print to PDF)
    toast({ title: 'Generating report', description: 'Use your browser dialog to save as PDF.' });
    setTimeout(() => window.print(), 250);
  };

  const txIcon = (type: string) => {
    switch (type) {
      case 'invest': return Banknote;
      case 'exit_distribution': return ArrowUpRight;
      case 'fee': return Receipt;
      case 'market_buy': return ShoppingBag;
      case 'market_sell': return Store;
      case 'pool_refund': return ArrowDownRight;
      case 'deposit': return ArrowDownRight;
      case 'withdraw': return ArrowUpRight;
      default: return Activity;
    }
  };

  const txLabel = (t: typeof transactions[number]) => {
    const map: Record<string, string> = {
      invest: 'Invested in vault',
      exit_distribution: 'Exit distribution',
      fee: 'Platform fee',
      market_buy: 'Bought on resale board',
      market_sell: 'Sold on resale board',
      pool_refund: 'Vault refund',
      deposit: 'Wallet deposit',
      withdraw: 'Wallet withdrawal',
    };
    return map[t.type] || t.type;
  };

  let sectionIndex = 0;

  return (
    <div className="container px-4 py-4 md:px-6 md:py-6">
      {/* Page Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:mb-6">
        <div>
          <h1 className="mb-1 text-xl font-bold md:mb-2 md:text-2xl">Portfolio</h1>
          <p className="text-sm text-muted-foreground md:text-base">Track your startup investments</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {myActiveListings.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/marketplace">
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                Listings ({myActiveListings.length})
              </Link>
            </Button>
          )}
          {positions.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={generatePdf}>
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                PDF
              </Button>
            </>
          )}
        </div>
      </div>

      {positions.length > 0 ? (
        <>
          {/* ============ SMART ALERTS ============ */}
          {alerts.length > 0 && (
            <motion.div
              className="mb-4 space-y-2 md:mb-6"
              initial="hidden" animate="visible" variants={fadeUp} custom={sectionIndex++}
            >
              {alerts.map(a => {
                const Icon = a.icon;
                const styles = {
                  info: 'border-primary/30 bg-primary/5 text-primary',
                  warning: 'border-warning/40 bg-warning/10 text-warning-foreground',
                  critical: 'border-destructive/40 bg-destructive/10 text-destructive',
                  success: 'border-success/40 bg-success/10 text-success',
                }[a.severity];
                return (
                  <div key={a.id} className={`flex items-start gap-3 rounded-lg border p-3 md:p-3.5 ${styles}`}>
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold md:text-sm">{a.title}</p>
                      <p className="mt-0.5 text-[11px] text-foreground/80 md:text-xs">{a.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {a.action && (
                        a.action.href ? (
                          <Button variant="ghost" size="sm" className="h-7 text-[11px] md:text-xs" asChild>
                            <Link to={a.action.href}>{a.action.label}</Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-7 text-[11px] md:text-xs" onClick={a.action.onClick}>
                            {a.action.label}
                          </Button>
                        )
                      )}
                      <button
                        onClick={() => setDismissedAlerts(prev => new Set(prev).add(a.id))}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground"
                        aria-label="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* ============ 1. KPI HERO + CHARTS ============ */}
          <motion.div
            className="mb-4 grid gap-3 md:mb-6 md:gap-6 lg:grid-cols-5"
            initial="hidden" animate="visible" variants={fadeUp} custom={sectionIndex++}
          >
            {/* Hero performance card */}
            <Card className="relative overflow-hidden lg:col-span-2">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
              <CardContent className="relative p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
                    Total portfolio value
                    <span className="rounded bg-muted px-1 py-0.5 text-[9px] font-medium">Est.</span>
                  </p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold md:text-xs ${
                    momAbs >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {momAbs >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {formatPercent(momPct, 1)} MoM
                  </span>
                </div>

                <p className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                  {formatCurrency(totalValue, false)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
                  Invested {formatCurrency(totalInvested, false)} ·{' '}
                  <span className={unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}>
                    {unrealizedGain >= 0 ? '+' : ''}{formatCurrency(unrealizedGain, false)} ({formatPercent(unrealizedPercent, 1)})
                  </span>
                </p>

                {/* Sparkline */}
                <div className="mt-3 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioValueData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(24, 90%, 55%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(24, 90%, 55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="hsl(24, 90%, 55%)" strokeWidth={2} fill="url(#sparkFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Best / Worst */}
                {bestPerformer && worstPerformer && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-success" /> Best
                      </p>
                      <p className="truncate text-xs font-semibold md:text-sm">{bestPerformer.name}</p>
                      <p className="text-[11px] font-medium text-success md:text-xs">
                        {formatPercent(bestPerformer.pnlPct, 1)}
                      </p>
                    </div>
                    <div className="min-w-0 text-right">
                      <p className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <TrendingDown className="h-3 w-3 text-destructive" /> Worst
                      </p>
                      <p className="truncate text-xs font-semibold md:text-sm">{worstPerformer.name}</p>
                      <p className={`text-[11px] font-medium md:text-xs ${worstPerformer.pnlPct >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatPercent(worstPerformer.pnlPct, 1)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart Tabs */}
            <Card className="lg:col-span-3">
              <Tabs defaultValue="value" className="p-3 md:p-4">
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-sm md:text-base">Portfolio overview</CardTitle>
                  <TabsList className="h-7 md:h-8">
                    <TabsTrigger value="value" className="px-2 py-0.5 text-[11px] md:text-xs">Value</TabsTrigger>
                    <TabsTrigger value="pnl" className="px-2 py-0.5 text-[11px] md:text-xs">P&L</TabsTrigger>
                    <TabsTrigger value="allocation" className="px-2 py-0.5 text-[11px] md:text-xs">Allocation</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="value" className="mt-0">
                  <div className="flex items-center">
                    <span className="text-[10px] text-muted-foreground md:text-xs">Portfolio value over time</span>
                    <IllustrativeTag />
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={portfolioValueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `€${(v/1000).toFixed(0)}K`} width={40} />
                      <RechartsTooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number) => [formatCurrency(value, false), 'Value']}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(24, 90%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="pnl" className="mt-0">
                  <div className="flex items-center">
                    <span className="text-[10px] text-muted-foreground md:text-xs">Unrealized P&L by position</span>
                    <IllustrativeTag />
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={plByPosition}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `€${v}`} width={40} />
                      <RechartsTooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number) => [formatCurrency(value, false), 'P&L']}
                      />
                      <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                        {plByPosition.map((entry, i) => (
                          <Cell key={i} fill={entry.pnl >= 0 ? 'hsl(142, 72%, 42%)' : 'hsl(0, 72%, 51%)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="allocation" className="mt-0">
                  <div className="flex items-center">
                    <span className="text-[10px] text-muted-foreground md:text-xs">Allocation by company</span>
                    <IllustrativeTag />
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPie>
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {allocationData.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number) => [formatCurrency(value, false), 'Invested']}
                      />
                      <Legend formatter={(value) => <span className="text-[10px] md:text-xs">{value}</span>} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* ============ 2 + 3. NEXT MILESTONES + DIVERSIFICATION HEALTH ============ */}
          <motion.div
            className="mb-4 grid gap-3 md:mb-6 md:gap-6 lg:grid-cols-2"
            initial="hidden" animate="visible" variants={fadeUp} custom={sectionIndex++}
          >
            {/* Next milestones */}
            <Card>
              <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Calendar className="h-4 w-4 text-primary" />
                  Next milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                {milestones.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No upcoming milestones in the next periods.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {milestones.map((m, i) => {
                      const Icon = m.icon;
                      const days = Math.ceil((m.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      const inner = (
                        <div className="flex items-start gap-3 rounded-lg border border-border/60 p-2.5 transition-colors hover:bg-muted/40 md:p-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold md:text-sm">{m.title}</p>
                            <p className="truncate text-[11px] text-muted-foreground md:text-xs">{m.subtitle}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] font-semibold md:text-xs">{formatDate(m.date.toISOString())}</p>
                            <p className="text-[10px] text-muted-foreground">in {days}d</p>
                          </div>
                        </div>
                      );
                      return (
                        <li key={i}>
                          {m.poolId ? (
                            <Link to={`/pool/${m.poolId}`} className="block">{inner}</Link>
                          ) : inner}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Diversification health */}
            <Card>
              <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                <CardTitle className="flex items-center justify-between text-sm md:text-base">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Diversification health
                  </span>
                  <span className="text-2xl font-bold tabular-nums md:text-3xl">
                    {diversification.score}
                    <span className="text-xs font-normal text-muted-foreground">/100</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <div className="space-y-3">
                  {/* Concentration */}
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${
                          concentrationLevel === 'low' ? 'bg-success' :
                          concentrationLevel === 'medium' ? 'bg-warning' : 'bg-destructive'
                        }`} />
                        <span className="text-xs font-medium md:text-sm">Concentration risk</span>
                      </div>
                      <span className="text-xs font-semibold tabular-nums md:text-sm">
                        {formatPercent(diversification.concentration, 0)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground md:text-xs">
                      Top holding: <span className="font-medium text-foreground">{diversification.topName}</span>
                      {' '}·{' '}
                      {concentrationLevel === 'high' ? 'Consider rebalancing.' :
                       concentrationLevel === 'medium' ? 'Reasonable, monitor exposure.' :
                       'Well distributed.'}
                    </p>
                  </div>

                  {/* Sectors + Stages grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        {diversification.sectors >= 3 ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                        )}
                        <span className="text-xs font-medium md:text-sm">Sectors</span>
                      </div>
                      <p className="mt-1 text-xl font-bold md:text-2xl">{diversification.sectors}</p>
                      <p className="text-[10px] text-muted-foreground md:text-xs">distinct industries</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        {diversification.stages >= 2 ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                        )}
                        <span className="text-xs font-medium md:text-sm">Stages</span>
                      </div>
                      <p className="mt-1 text-xl font-bold md:text-2xl">{diversification.stages}</p>
                      <p className="text-[10px] text-muted-foreground md:text-xs">funding stages</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ============ WHAT-IF SIMULATOR ============ */}
          {whatIf.listableCount > 0 && (
            <motion.div
              className="mb-4 md:mb-6"
              initial="hidden" animate="visible" variants={fadeUp} custom={sectionIndex++}
            >
              <Card className="overflow-hidden">
                <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <Sparkles className="h-4 w-4 text-primary" />
                    What-if simulator
                    <IllustrativeTag />
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                  <div className="grid gap-4 md:grid-cols-5 md:gap-6">
                    {/* Slider control */}
                    <div className="md:col-span-2">
                      <div className="mb-2 flex items-end justify-between">
                        <p className="text-xs text-muted-foreground md:text-sm">
                          If you sold this share of your{' '}
                          <span className="font-medium text-foreground">{whatIf.listableCount}</span> listable position{whatIf.listableCount > 1 ? 's' : ''}:
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[whatIfPct]}
                          onValueChange={([v]) => setWhatIfPct(v)}
                          min={0}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                        <div className="flex h-9 w-16 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-sm font-bold tabular-nums">
                          {whatIfPct}%
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                        <span>Hold</span>
                        <span>Half</span>
                        <span>Sell all</span>
                      </div>
                    </div>

                    {/* Results grid */}
                    <div className="grid grid-cols-2 gap-2 md:col-span-3 md:grid-cols-4">
                      <div className="rounded-lg border p-2.5 md:p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground md:text-[11px]">Sold value</p>
                        <p className="mt-1 text-sm font-bold tabular-nums md:text-base">{formatCompactCurrency(whatIf.sellValue)}</p>
                      </div>
                      <div className="rounded-lg border p-2.5 md:p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground md:text-[11px]">Gross P&L</p>
                        <p className={`mt-1 text-sm font-bold tabular-nums md:text-base ${whatIf.grossPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {whatIf.grossPnl >= 0 ? '+' : ''}{formatCompactCurrency(whatIf.grossPnl)}
                        </p>
                      </div>
                      <div className="rounded-lg border p-2.5 md:p-3">
                        <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground md:text-[11px]">
                          <Percent className="h-2.5 w-2.5" /> Carry (2%)
                        </p>
                        <p className="mt-1 text-sm font-bold tabular-nums text-muted-foreground md:text-base">
                          -{formatCompactCurrency(whatIf.carry)}
                        </p>
                      </div>
                      <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-2.5 md:p-3">
                        <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary md:text-[11px]">
                          <Wallet className="h-2.5 w-2.5" /> Net cash
                        </p>
                        <p className="mt-1 text-sm font-bold tabular-nums text-primary md:text-base">
                          {formatCompactCurrency(whatIf.netCash)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[10px] text-muted-foreground md:text-xs">
                    Simulation assumes listings sell at current estimated value. Actual outcomes depend on buyer demand on the Resale Board.
                    Remaining portfolio value: <span className="font-medium text-foreground">{formatCompactCurrency(whatIf.remainingValue)}</span>.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ============ 4. POSITIONS WITH FILTERS + 6. ACTIVITY SIDEBAR ============ */}
          <motion.div
            className="mb-4 grid gap-3 md:mb-6 md:gap-6 lg:grid-cols-3"
            initial="hidden" animate="visible" variants={fadeUp} custom={sectionIndex++}
          >
            <Card className="lg:col-span-2">
              <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-sm md:text-base">Your positions</CardTitle>
                  <span className="text-[11px] text-muted-foreground md:text-xs">
                    {filteredPositions.length} of {positions.length}
                  </span>
                </div>

                {/* Filters bar */}
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search company or sector"
                      className="h-9 pl-8 text-xs md:text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                    <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                      <SelectTrigger className="h-9 text-xs md:text-sm">
                        <Filter className="mr-1 h-3.5 w-3.5" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="filled">Filled</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={`${sortKey}-${sortDir}`} onValueChange={(v) => {
                      const [k, d] = v.split('-') as [SortKey, 'asc' | 'desc'];
                      setSortKey(k); setSortDir(d);
                    }}>
                      <SelectTrigger className="h-9 text-xs md:text-sm">
                        <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pnl_pct-desc">P&L %: high to low</SelectItem>
                        <SelectItem value="pnl_pct-asc">P&L %: low to high</SelectItem>
                        <SelectItem value="pnl_abs-desc">P&L €: high to low</SelectItem>
                        <SelectItem value="invested-desc">Invested: high to low</SelectItem>
                        <SelectItem value="value-desc">Est. value: high to low</SelectItem>
                        <SelectItem value="date-desc">Date: newest first</SelectItem>
                        <SelectItem value="date-asc">Date: oldest first</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant={hideListed ? 'default' : 'outline'}
                    size="sm"
                    className="h-9 shrink-0 text-xs md:text-sm"
                    onClick={() => setHideListed(v => !v)}
                  >
                    {hideListed ? 'Show listed' : 'Hide listed'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filteredPositions.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-muted-foreground md:px-6">
                    No positions match the current filters.
                  </p>
                ) : (
                  <>
                    {/* Mobile: card list */}
                    <div className="space-y-2 p-3 md:hidden">
                      {filteredPositions.map(position => {
                        const gain = position.current_estimated_value_eur - position.invested_eur;
                        const gainPct = position.invested_eur > 0 ? (gain / position.invested_eur) * 100 : 0;
                        const pool = pools.find(p => p.id === position.pool_id);
                        const canList = pool?.pool_status === 'active' && !position.is_listed_on_market;

                        return (
                          <button
                            key={position.id}
                            type="button"
                            onClick={() => setDrillPositionId(position.id)}
                            className="block w-full text-left"
                          >
                            <div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
                              <div className="mb-2 flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold">{position.deal.startup_name}</p>
                                  <p className="text-[10px] text-muted-foreground">{position.deal.industry} · {position.deal.stage}</p>
                                </div>
                                <StatusBadge status={position.pool.pool_status} />
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-muted-foreground">Invested</span>
                                  <p className="font-medium">{formatCompactCurrency(position.invested_eur)}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-muted-foreground">Est. Value</span>
                                  <p className="font-medium">{formatCompactCurrency(position.current_estimated_value_eur)}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Ownership</span>
                                  <p className="font-medium">{formatPercent(position.ownership_percent_of_spv, 2)}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-muted-foreground">P&L</span>
                                  <p className={`font-medium ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    {gain >= 0 ? '+' : ''}{formatCompactCurrency(gain)} ({formatPercent(gainPct, 1)})
                                  </p>
                                </div>
                              </div>
                              {canList && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="mt-2 h-9 w-full text-xs"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); openListingDialog(position.id, position.current_estimated_value_eur); }}
                                >
                                  <Store className="mr-1 h-3.5 w-3.5" /> Sell on Resale Board
                                </Button>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Desktop: table */}
                    <div className="hidden overflow-x-auto md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Invested</TableHead>
                            <TableHead className="text-right">Ownership</TableHead>
                            <TableHead className="text-right">Est. Value</TableHead>
                            <TableHead className="text-right">Unrealized P&L</TableHead>
                            <TableHead className="text-center">Listed</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPositions.map(position => {
                            const gain = position.current_estimated_value_eur - position.invested_eur;
                            const gainPct = position.invested_eur > 0 ? (gain / position.invested_eur) * 100 : 0;
                            const pool = pools.find(p => p.id === position.pool_id);
                            const canList = pool?.pool_status === 'active' && !position.is_listed_on_market;

                            return (
                              <TableRow
                                key={position.id}
                                className="cursor-pointer"
                                onClick={() => setDrillPositionId(position.id)}
                              >
                                <TableCell>
                                  <span className="font-medium hover:underline">
                                    {position.deal.startup_name}
                                  </span>
                                  <p className="text-xs text-muted-foreground">{position.deal.industry} · {position.deal.stage}</p>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={position.pool.pool_status} />
                                </TableCell>
                                <TableCell className="text-right font-medium tabular-nums">
                                  {formatCompactCurrency(position.invested_eur)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                  {formatPercent(position.ownership_percent_of_spv, 2)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                  <span className="text-[10px] text-muted-foreground">Est. </span>
                                  <span className="font-medium">{formatCompactCurrency(position.current_estimated_value_eur)}</span>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                  <span className={`font-medium ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    {gain >= 0 ? '+' : ''}{formatCompactCurrency(gain)}
                                  </span>
                                  <span className={`ml-1 text-xs ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    ({formatPercent(gainPct, 1)})
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  {position.is_listed_on_market ? (
                                    <Link
                                      to="/marketplace"
                                      onClick={(e) => e.stopPropagation()}
                                      className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground hover:bg-accent/80"
                                    >
                                      Yes
                                    </Link>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">No</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                                      <Link to={`/pool/${position.pool_id}`}>
                                        <ExternalLink className="h-3.5 w-3.5" />
                                      </Link>
                                    </Button>
                                    {canList && (
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={(e) => { e.stopPropagation(); openListingDialog(position.id, position.current_estimated_value_eur); }}
                                      >
                                        <Store className="mr-1 h-3.5 w-3.5" /> Sell
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Activity feed sidebar */}
            <Card className="lg:col-span-1">
              <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Activity className="h-4 w-4 text-primary" />
                  Recent activity
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                {activityFeed.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No recent activity.</p>
                ) : (
                  <ol className="relative space-y-3 border-l border-border/60 pl-4">
                    {activityFeed.map(t => {
                      const Icon = txIcon(t.type);
                      const positive = ['exit_distribution', 'deposit', 'market_sell'].includes(t.type);
                      return (
                        <li key={t.id} className="relative">
                          <span className={`absolute -left-[21px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-background ${
                            positive ? 'bg-success' : t.type === 'fee' ? 'bg-muted-foreground/40' : 'bg-primary'
                          }`}>
                            <Icon className="h-2.5 w-2.5 text-primary-foreground" />
                          </span>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium md:text-sm">{txLabel(t)}</p>
                              <p className="text-[10px] text-muted-foreground md:text-xs">{formatDate(t.timestamp)}</p>
                            </div>
                            <span className={`shrink-0 text-xs font-semibold tabular-nums md:text-sm ${
                              t.amount_eur > 0 ? 'text-success' : t.amount_eur < 0 ? 'text-destructive' : 'text-muted-foreground'
                            }`}>
                              {t.amount_eur > 0 ? '+' : ''}{formatCompactCurrency(t.amount_eur)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
                <Button variant="ghost" size="sm" className="mt-3 w-full text-xs" asChild>
                  <Link to="/wallet">
                    View all transactions <ChevronDown className="ml-1 h-3 w-3 rotate-[-90deg]" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ============ 5 + 7. P&L SUMMARY WITH FEE BREAKDOWN + EXIT FORECAST ============ */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={sectionIndex++}>
            <Card>
              <CardHeader className="px-4 pb-2 pt-4 md:px-6 md:pb-3 md:pt-6">
                <CardTitle className="text-sm md:text-base">P&L summary</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 md:gap-4">
                  {/* Realized with forecast */}
                  <div className="rounded-lg border p-3 md:p-4">
                    <p className="text-xs text-muted-foreground md:text-sm">Realized P&L</p>
                    <p className="mt-1 text-lg font-bold text-muted-foreground md:text-xl">€0</p>
                    {milestones.find(m => m.type === 'exit_window') ? (
                      <p className="mt-1 text-[10px] text-muted-foreground md:text-xs">
                        <Target className="mr-0.5 inline h-3 w-3" />
                        Estimated next exit:{' '}
                        <span className="font-medium text-foreground">
                          {formatDate(milestones.find(m => m.type === 'exit_window')!.date.toISOString())}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] text-muted-foreground md:text-xs">No exits yet.</p>
                    )}
                  </div>

                  {/* Unrealized */}
                  <div className="rounded-lg border p-3 md:p-4">
                    <p className="text-xs text-muted-foreground md:text-sm">Unrealized P&L</p>
                    <p className={`mt-1 text-lg font-bold md:text-xl ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {unrealizedGain >= 0 ? '+' : ''}{formatCurrency(unrealizedGain, false)}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground md:text-xs">
                      <span className="rounded bg-muted px-1 py-0.5 text-[10px]">Est.</span> Based on latest valuations
                    </p>
                  </div>

                  {/* Fees with breakdown tooltip */}
                  <div className="rounded-lg border p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground md:text-sm">Total fees paid</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            <p className="font-medium">Breakdown</p>
                            <ul className="mt-1 space-y-0.5">
                              <li>Entry: {formatCurrency(feesBreakdown.entry, false)}</li>
                              <li>Carry: {formatCurrency(feesBreakdown.carry, false)}</li>
                              <li>Resale: {formatCurrency(feesBreakdown.resale, false)}</li>
                              {feesBreakdown.other > 0 && <li>Other: {formatCurrency(feesBreakdown.other, false)}</li>}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="mt-1 text-lg font-bold md:text-xl">{formatCurrency(feesBreakdown.total, false)}</p>
                    {/* Mini stacked bar */}
                    {feesBreakdown.total > 0 && (
                      <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="bg-primary" style={{ width: `${(feesBreakdown.entry / feesBreakdown.total) * 100}%` }} />
                        <div className="bg-success" style={{ width: `${(feesBreakdown.carry / feesBreakdown.total) * 100}%` }} />
                        <div className="bg-warning" style={{ width: `${(feesBreakdown.resale / feesBreakdown.total) * 100}%` }} />
                      </div>
                    )}
                    <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
                      <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />Entry</span>
                      <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success" />Carry</span>
                      <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-warning" />Resale</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">No positions yet</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Start investing in startup vaults to build your portfolio.
            </p>
            <Button asChild>
              <Link to="/explore">Explore Vaults</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Listing Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List position on Resale Board</DialogTitle>
            <DialogDescription>
              Set your asking price and percentage to sell. A 1% resale fee applies (paid by buyer).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="percent">Percentage to sell</Label>
              <div className="flex gap-2">
                <Input id="percent" type="number" value={listingPercent} onChange={(e) => setListingPercent(e.target.value)} min={1} max={100} step={1} />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Asking price (EUR)</Label>
              <Input id="price" type="number" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} min={1} step={100} placeholder="e.g. 5000" />
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="text-muted-foreground">
                Resale fee: <span className="font-medium text-foreground">1%</span> (paid by buyer)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateListing}>Create listing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioPage;
