import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatDate, getTimeSince } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { Store, Search, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MarketplacePage = () => {
  const { getListingsWithDetails, currentUser, buyListing } = useAppStore();
  const listings = getListingsWithDetails();
  
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

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

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Buy and sell startup positions</p>
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
          {filteredListings.map(listing => (
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
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>By {listing.seller.name}</span>
                  <span>{getTimeSince(listing.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="flex flex-col items-center py-12"><Store className="mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">No active listings</p></CardContent></Card>
      )}

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
    </div>
  );
};

export default MarketplacePage;
