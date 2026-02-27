import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from '@/lib/formatters';
import { TrendingUp, TrendingDown, ExternalLink, Store, PieChart, ShoppingBag, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';

// Mock chart data
const portfolioValueData = [
  { month: 'Sep', value: 10000 },
  { month: 'Oct', value: 10200 },
  { month: 'Nov', value: 10800 },
  { month: 'Dec', value: 11100 },
  { month: 'Jan', value: 11900 },
  { month: 'Feb', value: 12500 },
];

const DONUT_COLORS = [
  'hsl(24, 90%, 55%)',   // primary
  'hsl(142, 72%, 42%)',  // success
  'hsl(220, 15%, 60%)',  // muted
  'hsl(38, 92%, 50%)',   // warning
];

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

const PortfolioPage = () => {
  const { getPositionsWithPools, createListing, pools, deals, listings, transactions } = useAppStore();
  const positions = getPositionsWithPools();
  
  const [listingPosition, setListingPosition] = useState<string | null>(null);
  const [listingPercent, setListingPercent] = useState('100');
  const [listingPrice, setListingPrice] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalInvested = positions.reduce((sum, p) => sum + p.invested_eur, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.current_estimated_value_eur, 0);
  const unrealizedGain = totalValue - totalInvested;
  const unrealizedPercent = totalInvested > 0 ? (unrealizedGain / totalInvested) * 100 : 0;

  // P&L by position for bar chart
  const plByPosition = useMemo(() => positions.map(p => ({
    name: p.deal.startup_name,
    pnl: p.current_estimated_value_eur - p.invested_eur,
  })), [positions]);

  // Allocation donut data
  const allocationData = useMemo(() => positions.map(p => ({
    name: p.deal.startup_name,
    value: p.invested_eur,
  })), [positions]);

  // Total fees paid
  const totalFees = useMemo(() => {
    return transactions
      .filter(t => t.type === 'fee')
      .reduce((sum, t) => sum + Math.abs(t.amount_eur), 0);
  }, [transactions]);

  // Get user's active listings
  const myActiveListings = listings.filter(l => 
    l.seller_user_id === positions[0]?.user_id && l.status === 'active'
  );

  const handleCreateListing = () => {
    const percent = parseFloat(listingPercent);
    const price = parseFloat(listingPrice);
    
    if (!listingPosition || isNaN(percent) || isNaN(price) || percent <= 0 || percent > 100 || price <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid values for percentage and price.',
        variant: 'destructive',
      });
      return;
    }
    
    createListing(listingPosition, percent, price);
    
    toast({
      title: 'Listing Created!',
      description: 'Your position is now listed on the resale board.',
    });
    
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

  return (
    <div className="container py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Track your startup investments</p>
        </div>
        {myActiveListings.length > 0 && (
          <Button variant="outline" asChild>
            <Link to="/marketplace">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Manage Listings ({myActiveListings.length})
            </Link>
          </Button>
        )}
      </div>

      {positions.length > 0 ? (
        <>
          {/* KPIs + Charts Split */}
          <div className="mb-6 grid gap-6 lg:grid-cols-5">
            {/* Left: KPI Summary */}
            <Card className="lg:col-span-2">
              <CardContent className="flex flex-col justify-center gap-6 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalInvested, false)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    Est. Value
                    <span className="rounded bg-muted px-1 py-0.5 text-[10px] font-medium">Est.</span>
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(totalValue, false)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                  <p className={`text-2xl font-bold ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {unrealizedGain >= 0 ? '+' : ''}{formatCurrency(unrealizedGain, false)}
                    <span className="ml-2 text-base font-medium">
                      ({formatPercent(unrealizedPercent, 1)})
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right: Chart Tabs */}
            <Card className="lg:col-span-3">
              <Tabs defaultValue="value" className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-base">Portfolio Overview</CardTitle>
                  <TabsList className="h-8">
                    <TabsTrigger value="value" className="px-2 py-1 text-xs">Value</TabsTrigger>
                    <TabsTrigger value="pnl" className="px-2 py-1 text-xs">P&L</TabsTrigger>
                    <TabsTrigger value="allocation" className="px-2 py-1 text-xs">Allocation</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="value" className="mt-0">
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground">Portfolio value over time</span>
                    <IllustrativeTag />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={portfolioValueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `€${(v/1000).toFixed(0)}K`} />
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
                    <span className="text-xs text-muted-foreground">Unrealized P&L by position</span>
                    <IllustrativeTag />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={plByPosition}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `€${v}`} />
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
                    <span className="text-xs text-muted-foreground">Allocation by company</span>
                    <IllustrativeTag />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPie>
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {allocationData.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number) => [formatCurrency(value, false), 'Invested']}
                      />
                      <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Positions Table */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Positions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Invested</TableHead>
                      <TableHead className="text-right">Ownership %</TableHead>
                      <TableHead className="text-right">Est. Value</TableHead>
                      <TableHead className="text-right">Unrealized P&L</TableHead>
                      <TableHead className="text-center">Listed?</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map(position => {
                      const gain = position.current_estimated_value_eur - position.invested_eur;
                      const gainPercent = (gain / position.invested_eur) * 100;
                      const pool = pools.find(p => p.id === position.pool_id);
                      const deal = deals.find(d => d.id === pool?.deal_id);
                      const canList = pool?.pool_status === 'active' && !position.is_listed_on_market;
                      const lastUpdate = deal?.company_updates?.[0]?.date || position.created_at;
                      
                      return (
                        <TableRow key={position.id}>
                          <TableCell>
                            <Link to={`/pool/${position.pool_id}`} className="font-medium hover:underline">
                              {position.deal.startup_name}
                            </Link>
                            <p className="text-xs text-muted-foreground">{position.deal.industry}</p>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={position.pool.pool_status} />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCompactCurrency(position.invested_eur)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPercent(position.ownership_percent_of_spv, 2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-[10px] text-muted-foreground">Est. </span>
                            <span className="font-medium">{formatCompactCurrency(position.current_estimated_value_eur)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-medium ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {gain >= 0 ? '+' : ''}{formatCompactCurrency(gain)}
                            </span>
                            <span className={`ml-1 text-xs ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                              ({formatPercent(gainPercent, 1)})
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {position.is_listed_on_market ? (
                              <Link to="/marketplace" className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground hover:bg-accent/80">
                                Yes
                              </Link>
                            ) : (
                              <span className="text-xs text-muted-foreground">No</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(lastUpdate)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/pool/${position.pool_id}`}>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              {canList && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openListingDialog(position.id, position.current_estimated_value_eur)}
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
            </CardContent>
          </Card>

          {/* Realized vs Unrealized P&L */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">P&L Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Realized P&L</p>
                  <p className="mt-1 text-xl font-bold text-muted-foreground">€0</p>
                  <p className="mt-1 text-xs text-muted-foreground">No exits yet</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                  <p className={`mt-1 text-xl font-bold ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {unrealizedGain >= 0 ? '+' : ''}{formatCurrency(unrealizedGain, false)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="rounded bg-muted px-1 py-0.5 text-[10px]">Est.</span> Based on latest valuations
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total Fees Paid</p>
                  <p className="mt-1 text-xl font-bold">{formatCurrency(totalFees, false)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Entry + carry + resale fees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">No positions yet</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Start investing in startup vaults to build your portfolio
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
            <DialogTitle>List Position on Resale Board</DialogTitle>
            <DialogDescription>
              Set your asking price and percentage to sell. A 1% resale fee applies.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="percent">Percentage to Sell</Label>
              <div className="flex gap-2">
                <Input
                  id="percent"
                  type="number"
                  value={listingPercent}
                  onChange={(e) => setListingPercent(e.target.value)}
                  min={1}
                  max={100}
                  step={1}
                />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Asking Price (EUR)</Label>
              <Input
                id="price"
                type="number"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                min={1}
                step={100}
                placeholder="e.g. 5000"
              />
            </div>
            
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="text-muted-foreground">
                Resale fee: <span className="font-medium text-foreground">1%</span> (paid by buyer)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateListing}>
              Create Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioPage;
