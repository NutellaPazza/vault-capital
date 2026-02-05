import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, getTimeSince } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { Store, Search, Plus, Eye, Edit, Trash2, Check, X, MessageSquare, DollarSign, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketplacePage = () => {
  const location = useLocation();
  const offersSectionRef = useRef<HTMLDivElement | null>(null);

  const {
    getListingsWithDetails,
    getPositionsWithPools,
    currentUser,
    buyListing,
    createListing,
    cancelListing,
    pools,
    listings,
    offers,
    createOffer,
    acceptOffer,
    rejectOffer,
    updateListing,
    allUsers,
  } = useAppStore();

  const allListings = getListingsWithDetails();
  const positions = getPositionsWithPools();

  const query = new URLSearchParams(location.search);
  const queryTab = query.get('tab') === 'sell' ? 'sell' : 'buy';
  const queryPositionId = query.get('positionId') || '';
  const querySection = query.get('section') || '';

  const [tab, setTab] = useState<'buy' | 'sell'>(queryTab);

  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  // Sell dialog state
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string>('');
  const [sellPercent, setSellPercent] = useState('100');
  const [sellPrice, setSellPrice] = useState('');

  // Edit listing dialog state
  const [editListingId, setEditListingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editPercent, setEditPercent] = useState('');

  // Filter positions that can be listed (active pool, not already listed)
  const listablePositions = positions.filter(p => {
    const pool = pools.find(pool => pool.id === p.pool_id);
    return pool?.pool_status === 'active' && !p.is_listed_on_market;
  });

  const selectedPosition = listablePositions.find(p => p.id === selectedPositionId);

  // Listings available to buy (not current user's)
  const buyableListings = allListings.filter(l => {
    if (l.seller_user_id === currentUser?.id) return false;
    if (!search) return true;
    return l.deal.startup_name.toLowerCase().includes(search.toLowerCase()) ||
           l.deal.industry.toLowerCase().includes(search.toLowerCase());
  });

  // Current user's active listings
  const myListings = listings.filter(l => 
    l.seller_user_id === currentUser?.id && l.status === 'active'
  );

  // Sold listings
  const mySoldListings = listings.filter(l => 
    l.seller_user_id === currentUser?.id && l.status === 'sold'
  );

  // Offers received on user's listings
  const myReceivedOffers = offers.filter(o => {
    const listing = listings.find(l => l.id === o.listing_id);
    return listing?.seller_user_id === currentUser?.id && o.status === 'pending';
  });

  const listing = allListings.find(l => l.id === selectedListing);
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

  // Get listing details for my listings
  const getMyListingDetails = (listingId: string) => {
    const l = listings.find(li => li.id === listingId);
    if (!l) return null;
    const pool = pools.find(p => p.id === l.pool_id);
    const deal = pool ? useAppStore.getState().deals.find(d => d.id === pool.deal_id) : null;
    const position = positions.find(p => p.pool_id === l.pool_id);
    return { listing: l, pool, deal, position };
  };

  const handleBuy = async () => {
    if (!selectedListing || !canAfford || isOwnListing) return;
    
    setIsBuying(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = buyListing(selectedListing);
    
    if (success) {
      toast({ title: 'Purchase Successful!', description: 'Position added to your portfolio.' });
      setSelectedListing(null);
      setShowOfferForm(false);
    } else {
      toast({ title: 'Purchase Failed', description: 'Please try again.', variant: 'destructive' });
    }
    setIsBuying(false);
  };

  const handleMakeOffer = () => {
    const price = parseFloat(offerPrice);
    if (!selectedListing || isNaN(price) || price <= 0) {
      toast({ title: 'Invalid Offer', description: 'Please enter a valid price.', variant: 'destructive' });
      return;
    }

    createOffer(selectedListing, price, offerMessage || undefined);
    toast({ title: 'Offer Sent!', description: 'The seller will be notified of your offer.' });
    setSelectedListing(null);
    setShowOfferForm(false);
    setOfferPrice('');
    setOfferMessage('');
  };

  const handleCreateSellListing = () => {
    const percent = parseFloat(sellPercent);
    const price = parseFloat(sellPrice);
    
    if (!selectedPositionId || isNaN(percent) || isNaN(price) || percent <= 0 || percent > 100 || price <= 0) {
      toast({ title: 'Invalid Input', description: 'Please enter valid values.', variant: 'destructive' });
      return;
    }
    
    createListing(selectedPositionId, percent, price);
    toast({ title: 'Listing Created!', description: 'Your position is now listed on the marketplace.' });
    
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

  const handleCancelListing = (listingId: string) => {
    cancelListing(listingId);
    toast({ title: 'Listing Cancelled', description: 'Your listing has been removed.' });
  };

  const handleEditListing = (listingId: string) => {
    const l = listings.find(li => li.id === listingId);
    if (l) {
      setEditListingId(listingId);
      setEditPrice(l.ask_price_eur.toString());
      setEditPercent(l.percent_of_position_for_sale.toString());
    }
  };

  const handleSaveEdit = () => {
    if (!editListingId) return;
    const price = parseFloat(editPrice);
    const percent = parseFloat(editPercent);
    
    if (isNaN(price) || price <= 0 || isNaN(percent) || percent <= 0 || percent > 100) {
      toast({ title: 'Invalid Input', description: 'Please enter valid values.', variant: 'destructive' });
      return;
    }

    updateListing(editListingId, { ask_price_eur: price, percent_of_position_for_sale: percent });
    toast({ title: 'Listing Updated', description: 'Your changes have been saved.' });
    setEditListingId(null);
  };

  const handleAcceptOffer = (offerId: string) => {
    const success = acceptOffer(offerId);
    if (success) {
      toast({ title: 'Offer Accepted!', description: 'The trade has been completed.' });
    } else {
      toast({ title: 'Failed', description: 'Buyer may not have enough funds.', variant: 'destructive' });
    }
  };

  const handleRejectOffer = (offerId: string) => {
    rejectOffer(offerId);
    toast({ title: 'Offer Rejected', description: 'The offer has been declined.' });
  };

  // Calculate preview equity for sell dialog
  const sellPreviewEquity = selectedPosition 
    ? selectedPosition.ownership_percent_of_spv * (parseFloat(sellPercent) || 0) / 100 
    : 0;

  // Mock view counts
  const getViewCount = (listingId: string) => {
    const hash = listingId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % 50) + 5;
  };

  // Auto-switch tab when linked with ?tab=sell
  useEffect(() => {
    setTab(queryTab);
  }, [queryTab]);

  // Deep-link: open Sell dialog for a specific position
  useEffect(() => {
    if (queryTab !== 'sell') return;
    if (!queryPositionId) return;

    const pos = listablePositions.find(p => p.id === queryPositionId);
    if (!pos) return;

    setIsSellDialogOpen(true);
    handlePositionSelect(pos.id);
  }, [queryTab, queryPositionId, listablePositions]);

  // Deep-link: scroll to offers section
  useEffect(() => {
    if (queryTab !== 'sell') return;
    if (querySection !== 'offers') return;
    if (!offersSectionRef.current) return;

    // let the tab render first
    requestAnimationFrame(() => {
      offersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [queryTab, querySection, myReceivedOffers.length]);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Buy and sell startup positions</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'buy' | 'sell')} className="space-y-6">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="buy" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="gap-2">
            <Store className="h-4 w-4" />
            Sell
          </TabsTrigger>
        </TabsList>

        {/* BUY TAB */}
        <TabsContent value="buy" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search listings..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="pl-9" 
                />
              </div>
            </CardContent>
          </Card>

          {buyableListings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {buyableListings.map(listing => {
                const equityPercent = getListingEquity(listing);
                return (
                  <Card 
                    key={listing.id} 
                    className="cursor-pointer transition-shadow hover:shadow-md" 
                    onClick={() => {
                      setSelectedListing(listing.id);
                      setShowOfferForm(false);
                      setOfferPrice('');
                      setOfferMessage('');
                    }}
                  >
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
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <Store className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No listings available to buy</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SELL TAB */}
        <TabsContent value="sell" className="space-y-6">
          {/* Create Listing Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Listings</h2>
            <Button onClick={() => setIsSellDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Listing
            </Button>
          </div>

          {/* Active Listings */}
          {myListings.length > 0 ? (
            <div className="space-y-4">
              {myListings.map(l => {
                const details = getMyListingDetails(l.id);
                if (!details?.deal) return null;
                const viewCount = getViewCount(l.id);
                const listingOffers = offers.filter(o => o.listing_id === l.id && o.status === 'pending');
                
                return (
                  <Card key={l.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{details.deal.startup_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {l.percent_of_position_for_sale}% of position • {formatCurrency(l.ask_price_eur)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {viewCount} views
                          </span>
                          {listingOffers.length > 0 && (
                            <span className="flex items-center gap-1 text-primary">
                              <MessageSquare className="h-4 w-4" />
                              {listingOffers.length} offer{listingOffers.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditListing(l.id)}>
                            <Edit className="mr-1 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleCancelListing(l.id)}>
                            <Trash2 className="mr-1 h-4 w-4" /> Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center py-8">
                <Store className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No active listings</p>
                <p className="text-sm text-muted-foreground">
                  {listablePositions.length > 0 
                    ? 'Create a listing to sell your positions'
                    : 'You need positions in active pools to create listings'}
                </p>
              </CardContent>
            </Card>
          )}

           {/* Pending Offers Section */}
           <div ref={offersSectionRef} />
           {myReceivedOffers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pending Offers
              </h2>
              {myReceivedOffers.map(offer => {
                const offerListing = listings.find(l => l.id === offer.listing_id);
                const pool = offerListing ? pools.find(p => p.id === offerListing.pool_id) : null;
                const deal = pool ? useAppStore.getState().deals.find(d => d.id === pool.deal_id) : null;
                const buyer = allUsers.find(u => u.id === offer.buyer_user_id);
                
                if (!deal || !buyer) return null;

                return (
                  <Card key={offer.id} className="border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{buyer.name} offered {formatCurrency(offer.offer_price_eur)}</p>
                          <p className="text-sm text-muted-foreground">
                            For your {deal.startup_name} listing
                          </p>
                          {offer.offer_message && (
                            <p className="mt-2 text-sm italic text-muted-foreground">
                              "{offer.offer_message}"
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAcceptOffer(offer.id)}>
                            <Check className="mr-1 h-4 w-4" /> Accept
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRejectOffer(offer.id)}>
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Sold History */}
          {mySoldListings.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Sold</h2>
              {mySoldListings.map(l => {
                const details = getMyListingDetails(l.id);
                if (!details?.deal) return null;
                
                return (
                  <Card key={l.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{details.deal.startup_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {l.percent_of_position_for_sale}% sold for {formatCurrency(l.ask_price_eur)}
                          </p>
                        </div>
                        <span className="rounded bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          Sold
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Buy/Offer Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => {
        setSelectedListing(null);
        setShowOfferForm(false);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showOfferForm ? 'Make an Offer' : 'Buy Position'}</DialogTitle>
            <DialogDescription>
              {listing?.deal.startup_name} - {listing?.percent_of_position_for_sale}% of position
            </DialogDescription>
          </DialogHeader>
          {listing && !showOfferForm && (
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
          {listing && showOfferForm && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-3 text-sm space-y-2">
                <div className="flex justify-between"><span>Asking Price</span><span>{formatCurrency(listing.ask_price_eur)}</span></div>
                <div className="flex justify-between"><span>Equity</span><span className="text-primary">{getListingEquity(listing).toFixed(3)}%</span></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Your Offer (EUR)</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Enter your offer"
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerMessage">Message (Optional)</Label>
                <Textarea
                  id="offerMessage"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Add a message to the seller..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {!showOfferForm ? (
              <>
                <Button variant="outline" onClick={() => setShowOfferForm(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Make Offer
                </Button>
                <Button onClick={handleBuy} disabled={!canAfford || isOwnListing || isBuying}>
                  {isBuying ? 'Processing...' : 'Confirm Purchase'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowOfferForm(false)}>Back</Button>
                <Button onClick={handleMakeOffer}>Submit Offer</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Sell Listing Dialog */}
      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sell Your Position</DialogTitle>
            <DialogDescription>Create a listing on the marketplace</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Position</Label>
              <Select value={selectedPositionId} onValueChange={handlePositionSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a position to sell" />
                </SelectTrigger>
                <SelectContent>
                  {listablePositions.length > 0 ? (
                    listablePositions.map(pos => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.deal.startup_name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No positions available to list
                    </div>
                  )}
                </SelectContent>
              </Select>
              {listablePositions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You need positions in active pools to create listings. 
                  <Link to="/explore" className="text-primary ml-1 hover:underline">Explore pools</Link>
                </p>
              )}
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
                  />
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                  <p className="text-muted-foreground mb-1">Buyer will receive:</p>
                  <p className="font-semibold text-primary">{formatPercent(sellPreviewEquity, 3)} equity</p>
                  <p className="text-xs text-muted-foreground mt-2">Marketplace fee: 1% (paid by buyer)</p>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSellListing} disabled={!selectedPositionId}>Create Listing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Listing Dialog */}
      <Dialog open={!!editListingId} onOpenChange={() => setEditListingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Asking Price (EUR)</Label>
              <Input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Percentage for Sale</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={editPercent}
                  onChange={(e) => setEditPercent(e.target.value)}
                  min={1}
                  max={100}
                />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditListingId(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplacePage;
