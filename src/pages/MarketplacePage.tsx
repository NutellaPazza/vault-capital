import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency, formatPercent, getTimeSince } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import {
  Store, Search, Plus, Eye, Edit, Trash2, Check, X, MessageSquare,
  DollarSign, ShoppingCart, HelpCircle, SlidersHorizontal, ArrowUpDown,
  Activity, TrendingUp, Clock, Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type SortOption = 'newest' | 'oldest' | 'lowest_price' | 'highest_price' | 'highest_percent' | 'lowest_percent' | 'most_viewed';

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
  const [detailListing, setDetailListing] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  // Filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterStage, setFilterStage] = useState<string[]>([]);
  const [filterCountry, setFilterCountry] = useState<string[]>([]);
  const [filterSector, setFilterSector] = useState<string[]>([]);
  const [filterPool, setFilterPool] = useState<string[]>([]);
  const [filterPercentRange, setFilterPercentRange] = useState<string>('');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('');
  const [filterDaysRange, setFilterDaysRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Sell dialog state
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string>('');
  const [sellPercent, setSellPercent] = useState('100');
  const [sellPrice, setSellPrice] = useState('');
  const [sellConfirmed, setSellConfirmed] = useState(false);

  // Edit listing dialog state
  const [editListingId, setEditListingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editPercent, setEditPercent] = useState('');

  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Filter positions that can be listed
  const listablePositions = positions.filter(p => {
    const pool = pools.find(pool => pool.id === p.pool_id);
    return pool?.pool_status === 'active' && !p.is_listed_on_market;
  });

  const selectedPosition = listablePositions.find(p => p.id === selectedPositionId);

  // Mock view counts
  const getViewCount = (listingId: string) => {
    const hash = listingId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % 50) + 5;
  };

  // Calculate equity being sold in listing
  const getListingEquity = (l: typeof allListings[0] | undefined) => {
    if (!l) return 0;
    const sellerOwnership = l.position.ownership_percent_of_spv;
    return sellerOwnership * (l.percent_of_position_for_sale / 100);
  };

  // Available filter values
  const availableStages = useMemo(() => [...new Set(allListings.map(l => l.deal.stage))], [allListings]);
  const availableCountries = useMemo(() => [...new Set(allListings.map(l => l.deal.country))], [allListings]);
  const availableSectors = useMemo(() => [...new Set(allListings.map(l => l.deal.sector_type))], [allListings]);

  // Active filter count
  const activeFilterCount = [filterStage.length > 0, filterCountry.length > 0, filterSector.length > 0, !!filterPercentRange, !!filterPriceRange, !!filterDaysRange].filter(Boolean).length;

  // Filtered + sorted buyable listings
  const buyableListings = useMemo(() => {
    let result = allListings.filter(l => {
      if (l.seller_user_id === currentUser?.id) return false;
      if (search && !l.deal.startup_name.toLowerCase().includes(search.toLowerCase()) && !l.deal.industry.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStage.length > 0 && !filterStage.includes(l.deal.stage)) return false;
      if (filterCountry.length > 0 && !filterCountry.includes(l.deal.country)) return false;
      if (filterSector.length > 0 && !filterSector.includes(l.deal.sector_type)) return false;
      if (filterPercentRange) {
        const p = l.percent_of_position_for_sale;
        if (filterPercentRange === '0-25' && p > 25) return false;
        if (filterPercentRange === '25-50' && (p < 25 || p > 50)) return false;
        if (filterPercentRange === '50-100' && p < 50) return false;
      }
      if (filterPriceRange) {
        const pr = l.ask_price_eur;
        if (filterPriceRange === '0-1000' && pr > 1000) return false;
        if (filterPriceRange === '1000-5000' && (pr < 1000 || pr > 5000)) return false;
        if (filterPriceRange === '5000-10000' && (pr < 5000 || pr > 10000)) return false;
        if (filterPriceRange === '10000+' && pr < 10000) return false;
      }
      if (filterDaysRange) {
        const d = differenceInDays(new Date(), new Date(l.created_at));
        if (filterDaysRange === '0-7' && d > 7) return false;
        if (filterDaysRange === '7-30' && (d < 7 || d > 30)) return false;
        if (filterDaysRange === '30+' && d < 30) return false;
      }
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'lowest_price':
        result.sort((a, b) => a.ask_price_eur - b.ask_price_eur);
        break;
      case 'highest_percent':
        result.sort((a, b) => b.percent_of_position_for_sale - a.percent_of_position_for_sale);
        break;
      case 'most_viewed':
        result.sort((a, b) => getViewCount(b.id) - getViewCount(a.id));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    return result;
  }, [allListings, currentUser, search, filterStage, filterCountry, filterSector, filterPercentRange, filterPriceRange, filterDaysRange, sortBy]);

  // Current user's listings (all statuses)
  const myActiveListings = listings.filter(l => l.seller_user_id === currentUser?.id && l.status === 'active');
  const mySoldListings = listings.filter(l => l.seller_user_id === currentUser?.id && l.status === 'sold');
  const myCancelledListings = listings.filter(l => l.seller_user_id === currentUser?.id && l.status === 'cancelled');
  const allMyListings = [...myActiveListings, ...mySoldListings, ...myCancelledListings];

  // Offers received on user's listings
  const myReceivedOffers = offers.filter(o => {
    const listing = listings.find(l => l.id === o.listing_id);
    return listing?.seller_user_id === currentUser?.id && o.status === 'pending';
  });

  const listing = allListings.find(l => l.id === selectedListing);
  const detailListingData = allListings.find(l => l.id === detailListing);
  const fee = listing ? listing.ask_price_eur * (listing.fee_marketplace_percent / 100) : 0;
  const total = listing ? listing.ask_price_eur + fee : 0;
  const canAfford = currentUser && listing && currentUser.wallet_balance_eur >= total;
  const isOwnListing = listing && listing.seller_user_id === currentUser?.id;

  // Get listing details for my listings
  const getMyListingDetails = (listingId: string) => {
    const l = listings.find(li => li.id === listingId);
    if (!l) return null;
    const pool = pools.find(p => p.id === l.pool_id);
    const deal = pool ? useAppStore.getState().deals.find(d => d.id === pool.deal_id) : null;
    const position = positions.find(p => p.pool_id === l.pool_id);
    return { listing: l, pool, deal, position };
  };

  // Market summary stats
  const marketStats = useMemo(() => {
    const active = allListings.filter(l => l.status === 'active');
    const totalNotional = active.reduce((sum, l) => sum + l.ask_price_eur, 0);
    const avgDays = active.length > 0 ? Math.round(active.reduce((sum, l) => sum + differenceInDays(new Date(), new Date(l.created_at)), 0) / active.length) : 0;
    return { activeCount: active.length, totalNotional, avgDays };
  }, [allListings]);

  // Recent activity (mock from existing data)
  const recentActivity = useMemo(() => {
    const events: { icon: 'new' | 'sold' | 'viewed'; text: string }[] = [];
    const activeListings = allListings.filter(l => l.status === 'active');
    
    // newest listing
    if (activeListings.length > 0) {
      const newest = [...activeListings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      events.push({ icon: 'new', text: `New listing: ${newest.deal.startup_name}` });
    }
    // most viewed
    if (activeListings.length > 0) {
      const mostViewed = [...activeListings].sort((a, b) => getViewCount(b.id) - getViewCount(a.id))[0];
      events.push({ icon: 'viewed', text: `Most viewed: ${mostViewed.deal.startup_name}` });
    }
    // sold
    const sold = allListings.filter(l => l.status === 'sold');
    if (sold.length > 0) {
      events.push({ icon: 'sold', text: `Listing sold: ${sold[0].deal.startup_name}` });
    }

    return events;
  }, [allListings]);

  // Exposure tooltip label component
  const ExposureLabel = ({ className }: { className?: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 cursor-help ${className || ''}`}>
            Exposure (est.) <Info className="h-3 w-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-[200px] text-xs">Estimated economic exposure via SPV.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Toggle multi-select filter
  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const clearFilters = () => {
    setFilterStage([]);
    setFilterCountry([]);
    setFilterSector([]);
    setFilterPercentRange('');
    setFilterPriceRange('');
    setFilterDaysRange('');
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
    toast({ title: 'Listing Created!', description: 'Your position is now listed on the Resale Board.' });
    setIsSellDialogOpen(false);
    setSelectedPositionId('');
    setSellPercent('100');
    setSellPrice('');
    setSellConfirmed(false);
  };

  const handlePositionSelect = (positionId: string) => {
    setSelectedPositionId(positionId);
    const pos = listablePositions.find(p => p.id === positionId);
    if (pos) setSellPrice(pos.current_estimated_value_eur.toString());
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

  useEffect(() => { setTab(queryTab); }, [queryTab]);

  useEffect(() => {
    if (queryTab !== 'sell' || !queryPositionId) return;
    const pos = listablePositions.find(p => p.id === queryPositionId);
    if (!pos) return;
    setIsSellDialogOpen(true);
    handlePositionSelect(pos.id);
  }, [queryTab, queryPositionId, listablePositions]);

  useEffect(() => {
    if (queryTab !== 'sell' || querySection !== 'offers' || !offersSectionRef.current) return;
    requestAnimationFrame(() => {
      offersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [queryTab, querySection, myReceivedOffers.length]);

  return (
    <div className="container px-4 py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:mb-6">
        <div>
          <h1 className="mb-1 text-xl font-bold md:mb-2 md:text-2xl">Resale Board</h1>
          <p className="text-sm text-muted-foreground md:text-base">List or buy positions. Listings may not sell.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowHowItWorks(true)} className="gap-1.5 self-start text-xs md:text-sm">
          <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
          How It Works
        </Button>
      </div>

      {/* Market Summary Strip */}
      <div className="mb-2 grid grid-cols-3 gap-2 md:gap-3">
        <Card>
          <CardContent className="p-2.5 text-center md:p-3">
            <p className="text-[10px] text-muted-foreground md:text-xs">Active listings</p>
            <p className="text-lg font-bold md:text-xl">{marketStats.activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 text-center md:p-3">
            <p className="text-[10px] text-muted-foreground md:text-xs">Total notional</p>
            <p className="text-lg font-bold md:text-xl">{formatCompactCurrency(marketStats.totalNotional)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 text-center md:p-3">
            <p className="text-[10px] text-muted-foreground md:text-xs">Avg days listed</p>
            <p className="text-lg font-bold md:text-xl">{marketStats.avgDays}d</p>
          </CardContent>
        </Card>
      </div>
      <p className="mb-4 text-[10px] text-muted-foreground md:mb-6 md:text-xs">Listings may not sell. Liquidity is not guaranteed.</p>

      {/* 9. Recent Activity (desktop only) */}
      {recentActivity.length > 0 && (
        <div className="mb-6 hidden md:block">
          <div className="flex items-center gap-4 rounded-lg border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5 shrink-0" />
            {recentActivity.map((ev, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {ev.icon === 'new' && <Plus className="h-3 w-3 text-primary" />}
                {ev.icon === 'sold' && <Check className="h-3 w-3 text-green-500" />}
                {ev.icon === 'viewed' && <Eye className="h-3 w-3" />}
                {ev.text}
                {i < recentActivity.length - 1 && <Separator orientation="vertical" className="mx-2 h-3" />}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* How It Works Dialog */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>How the Resale Board Works</DialogTitle>
            <DialogDescription>Everything you need to know about buying and selling positions</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2 text-sm">
            <div>
              <h4 className="mb-2 font-semibold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" /> Buying
              </h4>
              <p className="text-muted-foreground">
                Browse available listings from other investors. You can buy at the asking price instantly,
                or make a custom offer with your preferred price and a message to the seller.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" /> Selling
              </h4>
              <p className="text-muted-foreground">
                List positions from your portfolio. Choose what percentage to sell, set your price,
                and manage incoming offers. You can edit or cancel listings anytime.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" /> Fees & Settlement
              </h4>
              <p className="text-muted-foreground">
                A <strong>1% resale fee</strong> is charged to the buyer on every transaction.
                Settlement is instant: the position transfers to the buyer and the seller's wallet is credited immediately.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Offers
              </h4>
              <p className="text-muted-foreground">
                When you make an offer, the seller receives a notification and can accept or reject it.
                If accepted, the trade executes at your offered price (+ 1% fee). Offers remain pending until acted upon.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'buy' | 'sell')} className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="buy" className="gap-1.5 text-xs md:gap-2 md:text-sm">
            <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Buy Listings
          </TabsTrigger>
          <TabsTrigger value="sell" className="gap-1.5 text-xs md:gap-2 md:text-sm">
            <Store className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Your Listings
          </TabsTrigger>
        </TabsList>

        {/* BUY TAB */}
        <TabsContent value="buy" className="space-y-4 md:space-y-6">
          {/* Search + Filters + Sorting */}
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search listings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="relative h-9 w-9 shrink-0" onClick={() => setFiltersOpen(true)}>
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                      <Badge variant="destructive" className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-full text-xs sm:w-[160px] sm:text-sm">
                      <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="lowest_price">Lowest price</SelectItem>
                      <SelectItem value="highest_percent">Highest % for sale</SelectItem>
                      <SelectItem value="most_viewed">Most viewed</SelectItem>
                      <SelectItem value="oldest">Oldest listings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {buyableListings.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
              {buyableListings.map(l => {
                const equityPercent = getListingEquity(l);
                const daysListed = differenceInDays(new Date(), new Date(l.created_at));
                const views = getViewCount(l.id);
                return (
                  <Card
                    key={l.id}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                    onClick={() => setDetailListing(l.id)}
                  >
                    <CardContent className="p-3 md:p-4">
                      {/* Header */}
                      <div className="mb-2 flex items-start justify-between md:mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold md:text-base">{l.deal.startup_name}</h3>
                          <p className="text-[10px] text-muted-foreground md:text-xs">{l.deal.industry}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 ml-2">
                          <StatusBadge status={l.deal.stage} />
                          <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">{l.deal.country}</Badge>
                        </div>
                      </div>
                      {/* Key metrics */}
                      <div className="mb-2 grid grid-cols-3 gap-1.5 text-xs md:mb-3 md:gap-2 md:text-sm">
                        <div>
                          <span className="block text-[10px] text-muted-foreground md:text-xs">Ask price</span>
                          <span className="font-semibold">{formatCompactCurrency(l.ask_price_eur)}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground md:text-xs">% for sale</span>
                          <span className="font-semibold">{l.percent_of_position_for_sale}%</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground md:text-xs"><ExposureLabel /></span>
                          <span className="font-semibold text-primary">{equityPercent.toFixed(3)}%</span>
                        </div>
                      </div>
                      {/* Secondary row */}
                      <div className="flex items-center justify-between border-t pt-2 text-[10px] text-muted-foreground md:text-xs">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{daysListed}d</span>
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{views}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] md:h-7 md:text-xs" onClick={(e) => { e.stopPropagation(); setDetailListing(l.id); }}>
                          View
                        </Button>
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
        <TabsContent value="sell" className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold md:text-lg">Your Listings</h2>
            <Button size="sm" className="text-xs md:text-sm" onClick={() => { setIsSellDialogOpen(true); setSellConfirmed(false); }}>
              <Plus className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" /> Create Listing
            </Button>
          </div>

          {/* 7. Structured Listing Table */}
          {allMyListings.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>% listed</TableHead>
                      <TableHead>Ask price</TableHead>
                      <TableHead className="hidden sm:table-cell">Views</TableHead>
                      <TableHead className="hidden sm:table-cell">Days listed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allMyListings.map(l => {
                      const details = getMyListingDetails(l.id);
                      if (!details?.deal) return null;
                      const views = getViewCount(l.id);
                      const days = differenceInDays(new Date(), new Date(l.created_at));
                      const listingOffers = offers.filter(o => o.listing_id === l.id && o.status === 'pending');
                      return (
                        <TableRow key={l.id}>
                          <TableCell className="font-medium">
                            {details.deal.startup_name}
                            {listingOffers.length > 0 && (
                              <Badge variant="secondary" className="ml-2 text-[10px]">{listingOffers.length} offer{listingOffers.length > 1 ? 's' : ''}</Badge>
                            )}
                          </TableCell>
                          <TableCell>{l.percent_of_position_for_sale}%</TableCell>
                          <TableCell>{formatCurrency(l.ask_price_eur)}</TableCell>
                          <TableCell className="hidden sm:table-cell">{views}</TableCell>
                          <TableCell className="hidden sm:table-cell">{days}d</TableCell>
                          <TableCell>
                            <Badge variant={l.status === 'active' ? 'default' : l.status === 'sold' ? 'secondary' : 'outline'} className="text-xs capitalize">
                              {l.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {l.status === 'active' && (
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleEditListing(l.id)}>
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => handleCancelListing(l.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center py-8">
                <Store className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No active listings</p>
                {/* 6. How to Sell Checklist */}
                <div className="rounded-lg border bg-muted/30 p-4 text-sm max-w-xs w-full">
                  <p className="font-semibold mb-3">How to sell (3 steps):</p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                      Pick a position from your portfolio
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                      Choose what % to sell
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                      Set your asking price
                    </li>
                  </ol>
                </div>
                {listablePositions.length === 0 && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    You need positions in active vaults to create listings.
                  </p>
                )}
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
                          <p className="text-sm text-muted-foreground">For your {deal.startup_name} listing</p>
                          {offer.offer_message && (
                            <p className="mt-2 text-sm italic text-muted-foreground">"{offer.offer_message}"</p>
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
        </TabsContent>
      </Tabs>

      {/* 2. Filter Drawer */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter Listings</SheetTitle>
            <SheetDescription>Narrow down available listings</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Stage */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Stage</Label>
              <div className="flex flex-wrap gap-2">
                {(['pre-seed', 'seed', 'series-a'] as const).map(s => (
                  <Button key={s} variant={filterStage.includes(s) ? 'default' : 'outline'} size="sm" onClick={() => toggleFilter(filterStage, s, setFilterStage)} className="capitalize text-xs">
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            {/* Country */}
            {availableCountries.length > 0 && (
              <div>
                <Label className="mb-2 block text-sm font-medium">Country</Label>
                <div className="flex flex-wrap gap-2">
                  {availableCountries.map(c => (
                    <Button key={c} variant={filterCountry.includes(c) ? 'default' : 'outline'} size="sm" onClick={() => toggleFilter(filterCountry, c, setFilterCountry)} className="text-xs">
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* Sector */}
            {availableSectors.length > 0 && (
              <div>
                <Label className="mb-2 block text-sm font-medium">Sector</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSectors.map(s => (
                    <Button key={s} variant={filterSector.includes(s) ? 'default' : 'outline'} size="sm" onClick={() => toggleFilter(filterSector, s, setFilterSector)} className="text-xs">
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* % for sale */}
            <div>
              <Label className="mb-2 block text-sm font-medium">% for sale</Label>
              <div className="flex flex-wrap gap-2">
                {[{ v: '0-25', l: 'Up to 25%' }, { v: '25-50', l: '25–50%' }, { v: '50-100', l: '50%+' }].map(o => (
                  <Button key={o.v} variant={filterPercentRange === o.v ? 'default' : 'outline'} size="sm" onClick={() => setFilterPercentRange(filterPercentRange === o.v ? '' : o.v)} className="text-xs">
                    {o.l}
                  </Button>
                ))}
              </div>
            </div>
            {/* Price range */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Price range</Label>
              <div className="flex flex-wrap gap-2">
                {[{ v: '0-1000', l: '< €1k' }, { v: '1000-5000', l: '€1k–5k' }, { v: '5000-10000', l: '€5k–10k' }, { v: '10000+', l: '€10k+' }].map(o => (
                  <Button key={o.v} variant={filterPriceRange === o.v ? 'default' : 'outline'} size="sm" onClick={() => setFilterPriceRange(filterPriceRange === o.v ? '' : o.v)} className="text-xs">
                    {o.l}
                  </Button>
                ))}
              </div>
            </div>
            {/* Days listed */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Days listed</Label>
              <div className="flex flex-wrap gap-2">
                {[{ v: '0-7', l: 'Last 7d' }, { v: '7-30', l: '7–30d' }, { v: '30+', l: '30d+' }].map(o => (
                  <Button key={o.v} variant={filterDaysRange === o.v ? 'default' : 'outline'} size="sm" onClick={() => setFilterDaysRange(filterDaysRange === o.v ? '' : o.v)} className="text-xs">
                    {o.l}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={clearFilters}>Clear all</Button>
            <Button onClick={() => setFiltersOpen(false)}>Apply</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 5. Listing Detail View */}
      <Dialog open={!!detailListing} onOpenChange={() => setDetailListing(null)}>
        <DialogContent className="max-w-lg">
          {detailListingData && (() => {
            const eq = getListingEquity(detailListingData);
            const pool = pools.find(p => p.id === detailListingData.pool_id);
            const detailFee = detailListingData.ask_price_eur * (detailListingData.fee_marketplace_percent / 100);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {detailListingData.deal.startup_name}
                    <StatusBadge status={detailListingData.deal.stage} />
                  </DialogTitle>
                  <DialogDescription>{detailListingData.deal.industry} · {detailListingData.deal.sector_type}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{detailListingData.deal.short_description}</p>

                  {/* Vault terms snapshot */}
                  <div className="rounded-lg bg-muted p-3 text-sm space-y-1.5">
                    <p className="font-medium text-xs text-muted-foreground mb-2">Vault terms</p>
                    <div className="flex justify-between"><span>Valuation</span><span className="font-medium">{formatCompactCurrency(detailListingData.deal.valuation_pre_money)}</span></div>
                    <div className="flex justify-between"><span>Equity offered</span><span className="font-medium">{detailListingData.deal.offer_equity_percent}%</span></div>
                    {pool && <div className="flex justify-between"><span>Vault closed</span><span className="font-medium">{new Date(pool.end_datetime).toLocaleDateString()}</span></div>}
                  </div>

                  {/* Listing details */}
                  <div className="rounded-lg border p-3 text-sm space-y-1.5">
                    <div className="flex justify-between"><span>Ask price</span><span className="font-semibold">{formatCurrency(detailListingData.ask_price_eur)}</span></div>
                    <div className="flex justify-between"><span>% for sale</span><span className="font-medium">{detailListingData.percent_of_position_for_sale}%</span></div>
                    <div className="flex justify-between"><span><ExposureLabel /></span><span className="font-medium text-primary">{eq.toFixed(3)}%</span></div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t"><span>Buyer fee</span><span>1% ({formatCurrency(detailFee)})</span></div>
                  </div>

                  <p className="text-xs text-muted-foreground">Listings may not sell. Liquidity is not guaranteed.</p>
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  <Button variant="outline" onClick={() => {
                    setDetailListing(null);
                    setSelectedListing(detailListingData.id);
                    setShowOfferForm(true);
                    setOfferPrice('');
                    setOfferMessage('');
                  }}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Make Offer
                  </Button>
                  <Button onClick={() => {
                    setDetailListing(null);
                    setSelectedListing(detailListingData.id);
                    setShowOfferForm(false);
                  }}>
                    Buy listing
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* 4. Enhanced Buy/Offer Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => { setSelectedListing(null); setShowOfferForm(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showOfferForm ? 'Make an Offer' : 'Buy listing'}</DialogTitle>
            <DialogDescription>
              {listing?.deal.startup_name} · {listing?.percent_of_position_for_sale}% of position
            </DialogDescription>
          </DialogHeader>
          {listing && !showOfferForm && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-3 text-sm space-y-2">
                <div className="flex justify-between"><span>Ask price</span><span>{formatCurrency(listing.ask_price_eur)}</span></div>
                <div className="flex justify-between"><span><ExposureLabel /></span><span className="text-primary">{getListingEquity(listing).toFixed(3)}%</span></div>
                <div className="flex justify-between"><span>Buyer fee (1%)</span><span>{formatCurrency(fee)}</span></div>
                <div className="flex justify-between border-t pt-2 font-medium"><span>Total paid</span><span>{formatCurrency(total)}</span></div>
              </div>
              <p className="text-sm text-muted-foreground">
                You receive: {listing.percent_of_position_for_sale}% of the seller's position (economic rights via SPV).
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Balance</span>
                <span className={!canAfford ? 'text-destructive' : ''}>{formatCurrency(currentUser?.wallet_balance_eur || 0)}</span>
              </div>
              {isOwnListing && <p className="text-sm text-destructive">You cannot buy your own listing.</p>}
              <p className="text-xs text-muted-foreground">Resale is not guaranteed. This listing may take time to sell.</p>
            </div>
          )}
          {listing && showOfferForm && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-3 text-sm space-y-2">
                <div className="flex justify-between"><span>Asking Price</span><span>{formatCurrency(listing.ask_price_eur)}</span></div>
                <div className="flex justify-between"><span><ExposureLabel /></span><span className="text-primary">{getListingEquity(listing).toFixed(3)}%</span></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Your Offer (EUR)</Label>
                <Input id="offerPrice" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Enter your offer" min={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerMessage">Message (Optional)</Label>
                <Textarea id="offerMessage" value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} placeholder="Add a message to the seller..." rows={3} />
              </div>
              <p className="text-xs text-muted-foreground">Make Offer lets you propose a lower price. Seller may ignore it.</p>
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {!showOfferForm ? (
              <>
                <Button variant="outline" onClick={() => setShowOfferForm(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Make Offer
                </Button>
                <Button onClick={handleBuy} disabled={!canAfford || !!isOwnListing || isBuying}>
                  {isBuying ? 'Processing...' : 'Buy listing'}
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

      {/* 8. Create Sell Listing Dialog with Confirmation */}
      <Dialog open={isSellDialogOpen} onOpenChange={(open) => { setIsSellDialogOpen(open); if (!open) setSellConfirmed(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sell Your Position</DialogTitle>
            <DialogDescription>Create a listing on the Resale Board</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-xs text-muted-foreground">Pricing is set by you. Listings may not sell.</p>

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
                    <div className="p-2 text-sm text-muted-foreground text-center">No positions available to list</div>
                  )}
                </SelectContent>
              </Select>
              {listablePositions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You need positions in active vaults to create listings.
                  <Link to="/explore" className="text-primary ml-1 hover:underline">Explore vaults</Link>
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
                    <Input id="sellPercent" type="number" value={sellPercent} onChange={(e) => setSellPercent(e.target.value)} min={1} max={100} />
                    <span className="flex items-center text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellPrice">Asking Price (EUR)</Label>
                  <Input id="sellPrice" type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} min={1} />
                </div>

                {/* You are selling summary */}
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm space-y-1">
                  <p className="font-medium text-xs mb-2">You are selling:</p>
                  <div className="flex justify-between"><span className="text-muted-foreground">% of position</span><span className="font-medium">{sellPercent || 0}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Exposure transferred (est.)</span><span className="font-medium text-primary">{formatPercent(sellPreviewEquity, 3)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Ask price</span><span className="font-medium">{formatCurrency(parseFloat(sellPrice || '0'))}</span></div>
                  <div className="border-t border-primary/10 pt-1.5 mt-1.5 text-xs text-muted-foreground">
                    <p>Buyer pays a 1% fee on top of the asking price.</p>
                  </div>
                </div>

                {/* Confirmation checkbox */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="sellConfirm"
                    checked={sellConfirmed}
                    onCheckedChange={(checked) => setSellConfirmed(checked === true)}
                  />
                  <Label htmlFor="sellConfirm" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                    I understand listings may not sell and prices are not guaranteed.
                  </Label>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSellListing} disabled={!selectedPositionId || !sellConfirmed}>Create Listing</Button>
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
              <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} min={1} />
            </div>
            <div className="space-y-2">
              <Label>Percentage for Sale</Label>
              <div className="flex gap-2">
                <Input type="number" value={editPercent} onChange={(e) => setEditPercent(e.target.value)} min={1} max={100} />
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
