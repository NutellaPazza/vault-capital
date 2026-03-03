import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PoolCard } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DealStage, PoolStatus } from '@/types';
import { motion } from 'framer-motion';

const STAGES: { value: DealStage; label: string }[] = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
];

const STATUSES: { value: PoolStatus; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'filled', label: 'Filled' },
];

const COUNTRIES = ['Italy', 'Germany', 'Netherlands', 'France', 'Spain', 'UK'];
const SECTORS = ['B2B', 'B2C', 'B2B2C', 'Fintech', 'AI/ML', 'SaaS', 'E-commerce', 'HealthTech', 'CleanTech'];

const TICKET_RANGES = [
  { label: 'Up to €250', min: 0, max: 250 },
  { label: '€250 – €500', min: 250, max: 500 },
  { label: '€500 – €1 000', min: 500, max: 1000 },
  { label: '€1 000+', min: 1000, max: Infinity },
];

const TARGET_RANGES = [
  { label: 'Less than €250k', min: 0, max: 250_000 },
  { label: '€250k – €1M', min: 250_000, max: 1_000_000 },
  { label: 'More than €1M', min: 1_000_000, max: Infinity },
];

type SortOption = 'most_funded' | 'ending_soon' | 'newest' | 'lowest_ticket';

const ExplorePage = () => {
  const { pools, deals } = useAppStore();
  const [search, setSearch] = useState('');
  const [stageFilters, setStageFilters] = useState<DealStage[]>([]);
  const [statusFilters, setStatusFilters] = useState<PoolStatus[]>([]);
  const [countryFilters, setCountryFilters] = useState<string[]>([]);
  const [sectorFilters, setSectorFilters] = useState<string[]>([]);
  const [ticketRange, setTicketRange] = useState<number | null>(null);
  const [targetRange, setTargetRange] = useState<number | null>(null);
  const [acceleratorOnly, setAcceleratorOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption | ''>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = stageFilters.length + statusFilters.length + countryFilters.length + sectorFilters.length
    + (ticketRange !== null ? 1 : 0) + (targetRange !== null ? 1 : 0) + (acceleratorOnly ? 1 : 0);

  const poolsWithDeals = useMemo(() => {
    const filtered = pools
      .map(pool => {
        const deal = deals.find(d => d.id === pool.deal_id);
        if (!deal) return null;
        return { ...pool, deal };
      })
      .filter(Boolean)
      .filter(pool => {
        if (!pool) return false;
        
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch = 
            pool.deal.startup_name.toLowerCase().includes(searchLower) ||
            pool.deal.industry.toLowerCase().includes(searchLower) ||
            pool.deal.country.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        
        if (stageFilters.length > 0 && !stageFilters.includes(pool.deal.stage)) return false;
        if (statusFilters.length > 0 && !statusFilters.includes(pool.pool_status)) return false;
        if (countryFilters.length > 0 && !countryFilters.includes(pool.deal.country)) return false;

        if (sectorFilters.length > 0) {
          const matchesSector = sectorFilters.some(sector => 
            pool.deal.sector_type === sector || 
            pool.deal.industry.toLowerCase().includes(sector.toLowerCase())
          );
          if (!matchesSector) return false;
        }

        if (ticketRange !== null) {
          const range = TICKET_RANGES[ticketRange];
          if (pool.deal.min_ticket_eur < range.min || pool.deal.min_ticket_eur > range.max) return false;
        }

        if (targetRange !== null) {
          const range = TARGET_RANGES[targetRange];
          if (pool.target_eur < range.min || pool.target_eur > range.max) return false;
        }

        if (acceleratorOnly && !pool.deal.accelerator) return false;
        
        return true;
      });

    if (sortBy) {
      filtered.sort((a, b) => {
        if (!a || !b) return 0;
        switch (sortBy) {
          case 'most_funded': return b.raised_eur - a.raised_eur;
          case 'ending_soon': {
            const aLive = a.pool_status === 'live' ? 0 : 1;
            const bLive = b.pool_status === 'live' ? 0 : 1;
            if (aLive !== bLive) return aLive - bLive;
            return new Date(a.end_datetime).getTime() - new Date(b.end_datetime).getTime();
          }
          case 'newest': return new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime();
          case 'lowest_ticket': return a.deal.min_ticket_eur - b.deal.min_ticket_eur;
          default: return 0;
        }
      });
    }

    return filtered;
  }, [pools, deals, search, stageFilters, statusFilters, countryFilters, sectorFilters, ticketRange, targetRange, acceleratorOnly, sortBy]);

  const toggleFilter = <T extends string>(value: T, current: T[], setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearFilters = () => {
    setStageFilters([]);
    setStatusFilters([]);
    setCountryFilters([]);
    setSectorFilters([]);
    setTicketRange(null);
    setTargetRange(null);
    setAcceleratorOnly(false);
    setSearch('');
    setSortBy('');
  };

  const hasFilters = activeFilterCount > 0 || search;

  return (
    <div className="container px-4 py-4 md:px-6 md:py-6">
      <div className="mb-4 md:mb-6">
        <h1 className="mb-1 text-xl font-bold md:mb-2 md:text-2xl">Explore Vaults</h1>
        <p className="text-sm text-muted-foreground md:text-base">Discover and invest in curated startup opportunities</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="flex flex-col gap-2.5 p-3 sm:flex-row sm:gap-3 sm:p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search startup, industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full text-xs sm:w-[160px] sm:text-sm">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most_funded">Most funded</SelectItem>
                <SelectItem value="ending_soon">Ending soon</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="lowest_ticket">Lowest min ticket</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground sm:ml-1">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-[85vw] max-w-80 flex-col">
                <SheetHeader>
                  <SheetTitle>Filter Vaults</SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto py-4">
                  {/* Status */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold">Status</h4>
                    <div className="space-y-2">
                      {STATUSES.map(status => (
                        <div key={status.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status.value}`}
                            checked={statusFilters.includes(status.value)}
                            onCheckedChange={() => toggleFilter(status.value, statusFilters, setStatusFilters)}
                          />
                          <Label htmlFor={`status-${status.value}`} className="text-sm font-normal cursor-pointer">
                            {status.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Stage */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold">Stage</h4>
                    <div className="space-y-2">
                      {STAGES.map(stage => (
                        <div key={stage.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stage-${stage.value}`}
                            checked={stageFilters.includes(stage.value)}
                            onCheckedChange={() => toggleFilter(stage.value, stageFilters, setStageFilters)}
                          />
                          <Label htmlFor={`stage-${stage.value}`} className="text-sm font-normal cursor-pointer">
                            {stage.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Country */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold">Country</h4>
                    <div className="space-y-2">
                      {COUNTRIES.map(country => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox
                            id={`country-${country}`}
                            checked={countryFilters.includes(country)}
                            onCheckedChange={() => toggleFilter(country, countryFilters, setCountryFilters)}
                          />
                          <Label htmlFor={`country-${country}`} className="text-sm font-normal cursor-pointer">
                            {country}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Sector/Type */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold">Sector / Type</h4>
                    <div className="space-y-2">
                      {SECTORS.map(sector => (
                        <div key={sector} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sector-${sector}`}
                            checked={sectorFilters.includes(sector)}
                            onCheckedChange={() => toggleFilter(sector, sectorFilters, setSectorFilters)}
                          />
                          <Label htmlFor={`sector-${sector}`} className="text-sm font-normal cursor-pointer">
                            {sector}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Min Ticket Range */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold">Min Ticket</h4>
                    <div className="flex flex-wrap gap-2">
                      {TICKET_RANGES.map((range, i) => (
                        <Button
                          key={i}
                          variant={ticketRange === i ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs"
                          onClick={() => setTicketRange(ticketRange === i ? null : i)}
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Target Size Range */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold">Target Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {TARGET_RANGES.map((range, i) => (
                        <Button
                          key={i}
                          variant={targetRange === i ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs"
                          onClick={() => setTargetRange(targetRange === i ? null : i)}
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Accelerator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accelerator-toggle" className="text-sm font-semibold cursor-pointer">Accelerator-backed only</Label>
                      <Switch
                        id="accelerator-toggle"
                        checked={acceleratorOnly}
                        onCheckedChange={setAcceleratorOnly}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Show only YC, Techstars, etc.</p>
                  </div>
                </div>

                <SheetFooter className="flex-row gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
                    Apply
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {hasFilters && (
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pool Grid */}
      {poolsWithDeals.length > 0 ? (
        <motion.div
          className="grid gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {poolsWithDeals.map((pool, i) => pool && (
            <motion.div
              key={pool.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
              }}
            >
              <PoolCard pool={pool} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">No vaults found</h3>
            <p className="text-center text-sm text-muted-foreground">
              {hasFilters 
                ? 'Try adjusting your filters or search terms' 
                : 'Check back soon for new investment opportunities'}
            </p>
            {hasFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExplorePage;
