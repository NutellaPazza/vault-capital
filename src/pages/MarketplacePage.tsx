import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, getTimeSince } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { Store, Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketplacePage = () => {
  const { getListingsWithDetails, getPositionsWithPools, currentUser, buyListing, createListing, pools } = useAppStore();
  const listings = getListingsWithDetails();
  const positions = getPositionsWithPools();
  
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  // Sell dialog state
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string>('');
  const [sellPercent, setSellPercent] = useState('100');
  const [sellPrice, setSellPrice] = useState('');

  // Filter positions that can be listed (active pool, not already listed)
  const listablePositions = positions.filter(p => {
    const pool = pools.find(pool => pool.id === p.pool_id);
    return pool?.pool_status === 'active' && !p.is_listed_on_market;
  });

  const selectedPosition = listablePositions.find(p => p.id === selectedPositionId);

  const filteredListings = listings.filter(l => {
    if (!search) return true;
    return l.deal.startup_name.toLowerCase().includes(search.toLowerCase()) ||
           l.deal.industry.toLowerCase().includes(search.toLowerCase());
  });

  const listing = listings.find(l => l.id === selectedListing);
  const fee = listing ? listing.ask_price_eur * (listing.fee_marketplace_percent / 100) : 0;
  const total = listing ? listing.ask_price_eur + fee : 0;
  const canAfford = currentUser && listing && currentUser.wallet_balance_eur >= total;
  const isOwnListing = listing && listing.seller_user_id === currentUser?.id;

  // Calculate equity being sold in listing
  const getListingEquity = (l: typeof listing) => {
    if (!l) return 0;
    const sellerOwnership = l.position.ownership_percent_of_spv;
    return sellerOwnership * (l.percent_of_position_for_sale / 100);
  };

  const handleBuy = async () => {
    if (!selectedListing || !canAfford || isOwnListing) return;
    
    setIsBuying(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = buyListing(selectedListing);
    
    if (success) {
      toast({ title: 'Purchase Successful!', description: 'Position added to your portfolio.' });
      setSelectedListing(null);
    } else {
      toast({ title: 'Purchase Failed', description: 'Please try again.', variant: 'destructive' });
    }
    setIsBuying(false);
  };

  const handleCreateSellListing = () => {
    const percent = parseFloat(sellPercent);
    const price = parseFloat(sellPrice);
    
    if (!selectedPositionId || isNaN(percent) || isNaN(price) || percent <= 0 || percent > 100 || price <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid values.',
        variant: 'destructive',
      });
      return;
    }
    
    createListing(selectedPositionId, percent, price);
    
    toast({
      title: 'Listing Created!',
      description: 'Your position is now listed on the marketplace.',
    });
    
    setIsSellDialogOpen(false);
    setSelectedPositionId('');
    setSellPercent('100');
    setSellPrice('');
  };

  const handlePositionSelect = (positionId: string) => {
    setSelectedPositionId(positionId);
    const pos = listablePositions.find(p => p.id === positionId);
    if (pos) {
      setSellPrice(pos.current_estimated_value_eur.toString());
    }
  };

  // Calculate preview equity for sell dialog
  const sellPreviewEquity = selectedPosition 
    ? selectedPosition.ownership_percent_of_spv * (parseFloat(sellPercent) || 0) / 100 
    : 0;

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell startup positions</p>
        </div>
        <Button onClick={() => setIsSellDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Sell Position
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {filteredListings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map(listing => {
            const equityPercent = getListingEquity(listing);
            return (
              <Card key={listing.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelectedListing(listing.id)}>
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{listing.deal.startup_name}</h3>
                      <p className="text-sm text-muted-foreground">{listing.deal.industry}</p>
                    </div>
                    <StatusBadge status={listing.deal.stage} />
                  </div>
                  <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">For Sale:</span> <span className="font-medium">{listing.percent_of_position_for_sale}%</span></div>
                    <div><span className="text-muted-foreground">Price:</span> <span className="font-medium">{formatCompactCurrency(listing.ask_price_eur)}</span></div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Equity:</span>{' '}
                      <span className="font-medium text-primary">{equityPercent.toFixed(3)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {listing.seller.name}</span>
                    <span>{getTimeSince(listing.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><CardContent className="flex flex-col items-center py-12"><Store className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">No active listings</p></CardContent></Card>
      )}

      {/* Buy Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Position</DialogTitle>
            <DialogDescription>{listing?.deal.startup_name} - {listing?.percent_of_position_for_sale}% of position</DialogDescription>
          </DialogHeader>
          {listing && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-3 text-sm space-y-2">
                <div className="flex justify-between"><span>Price</span><span>{formatCurrency(listing.ask_price_eur)}</span></div>
                <div className="flex justify-between"><span>Equity</span><span className="text-primary">{getListingEquity(listing).toFixed(3)}%</span></div>
                <div className="flex justify-between"><span>Fee (1%)</span><span>{formatCurrency(fee)}</span></div>
                <div className="flex justify-between border-t pt-2 font-medium"><span>Total</span><span>{formatCurrency(total)}</span></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Balance</span>
                <span className={!canAfford ? 'text-destructive' : ''}>{formatCurrency(currentUser?.wallet_balance_eur || 0)}</span>
              </div>
              {isOwnListing && <p className="text-sm text-destructive">You cannot buy your own listing</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedListing(null)}>Cancel</Button>
            <Button onClick={handleBuy} disabled={!canAfford || isOwnListing || isBuying}>{isBuying ? 'Processing...' : 'Confirm Purchase'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sell Your Position</DialogTitle>
            <DialogDescription>
              Create a listing on the marketplace
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Position</Label>
              <Select value={selectedPositionId} onValueChange={handlePositionSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a position to sell" />
                </SelectTrigger>
                <SelectContent>
                  {listablePositions.map(pos => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.deal.startup_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPosition && (
              <>
                <div className="rounded-lg bg-muted p-3 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Investment</span>
                    <span>{formatCurrency(selectedPosition.invested_eur)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Value</span>
                    <span>{formatCurrency(selectedPosition.current_estimated_value_eur)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Ownership</span>
                    <span>{formatPercent(selectedPosition.ownership_percent_of_spv, 3)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Unrealized Gain</span>
                    <span className={selectedPosition.current_estimated_value_eur >= selectedPosition.invested_eur ? 'text-success' : 'text-destructive'}>
                      {formatCurrency(selectedPosition.current_estimated_value_eur - selectedPosition.invested_eur)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellPercent">Percentage to Sell</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sellPercent"
                      type="number"
                      value={sellPercent}
                      onChange={(e) => setSellPercent(e.target.value)}
                      min={1}
                      max={100}
                      step={1}
                    />
                    <span className="flex items-center text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellPrice">Asking Price (EUR)</Label>
                  <Input
                    id="sellPrice"
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    min={1}
                    step={100}
                  />
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                  <p className="text-muted-foreground mb-1">Buyer will receive:</p>
                  <p className="font-semibold text-primary">{formatPercent(sellPreviewEquity, 3)} equity</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Marketplace fee: 1% (paid by buyer)
                  </p>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSellListing} disabled={!selectedPositionId}>
              Create Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplacePage;