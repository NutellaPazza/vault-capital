import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from '@/lib/formatters';
import { TrendingUp, TrendingDown, ExternalLink, Store, PieChart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const PortfolioPage = () => {
  const { getPositionsWithPools, createListing, pools } = useAppStore();
  const positions = getPositionsWithPools();
  
  const [listingPosition, setListingPosition] = useState<string | null>(null);
  const [listingPercent, setListingPercent] = useState('100');
  const [listingPrice, setListingPrice] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalInvested = positions.reduce((sum, p) => sum + p.invested_eur, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.current_estimated_value_eur, 0);
  const unrealizedGain = totalValue - totalInvested;
  const unrealizedPercent = totalInvested > 0 ? (unrealizedGain / totalInvested) * 100 : 0;

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
      description: 'Your position is now listed on the marketplace.',
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
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Track your startup investments</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <PieChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-xl font-bold">{formatCurrency(totalValue, false)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-bold">{formatCurrency(totalInvested, false)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${unrealizedGain >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {unrealizedGain >= 0 
                  ? <TrendingUp className="h-5 w-5 text-success" />
                  : <TrendingDown className="h-5 w-5 text-destructive" />
                }
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                <p className={`text-xl font-bold ${unrealizedGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {unrealizedGain >= 0 ? '+' : ''}{formatCurrency(unrealizedGain, false)} ({formatPercent(unrealizedPercent, 1)})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Positions List */}
      {positions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Positions</h2>
          {positions.map(position => {
            const gain = position.current_estimated_value_eur - position.invested_eur;
            const gainPercent = (gain / position.invested_eur) * 100;
            const pool = pools.find(p => p.id === position.pool_id);
            const canList = pool?.pool_status === 'active' && !position.is_listed_on_market;
            
            return (
              <Card key={position.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Link to={`/pool/${position.pool_id}`} className="font-semibold hover:underline">
                          {position.deal.startup_name}
                        </Link>
                        <StatusBadge status={position.pool.pool_status} />
                        {position.is_listed_on_market && (
                          <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                            Listed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {position.deal.industry} • Invested {formatDate(position.created_at)}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center sm:gap-8">
                      <div>
                        <p className="text-xs text-muted-foreground">Invested</p>
                        <p className="font-semibold">{formatCompactCurrency(position.invested_eur)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ownership</p>
                        <p className="font-semibold">{formatPercent(position.ownership_percent_of_spv, 2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Value</p>
                        <p className={`font-semibold ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCompactCurrency(position.current_estimated_value_eur)}
                        </p>
                        <p className={`text-xs ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {gain >= 0 ? '+' : ''}{formatPercent(gainPercent, 1)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/pool/${position.pool_id}`}>
                          <ExternalLink className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                      {canList && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => openListingDialog(position.id, position.current_estimated_value_eur)}
                        >
                          <Store className="mr-1 h-4 w-4" /> List
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">No positions yet</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Start investing in startup pools to build your portfolio
            </p>
            <Button asChild>
              <Link to="/explore">Explore Pools</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Listing Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Position on Marketplace</DialogTitle>
            <DialogDescription>
              Set your asking price and percentage to sell. A 1% marketplace fee applies.
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
                Marketplace fee: <span className="font-medium text-foreground">1%</span> (paid by buyer)
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
