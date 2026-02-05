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
import { DealStage, PoolStatus } from '@/types';

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

const ExplorePage = () => {
  const { pools, deals } = useAppStore();
  const [search, setSearch] = useState('');
  const [stageFilters, setStageFilters] = useState<DealStage[]>([]);
  const [statusFilters, setStatusFilters] = useState<PoolStatus[]>([]);
  const [countryFilters, setCountryFilters] = useState<string[]>([]);
  const [sectorFilters, setSectorFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = stageFilters.length + statusFilters.length + countryFilters.length + sectorFilters.length;

  const poolsWithDeals = useMemo(() => {
    return pools
      .map(pool => {
        const deal = deals.find(d => d.id === pool.deal_id);
        if (!deal) return null;
        return { ...pool, deal };
      })
      .filter(Boolean)
      .filter(pool => {
        if (!pool) return false;
        
        // Search filter
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch = 
            pool.deal.startup_name.toLowerCase().includes(searchLower) ||
            pool.deal.industry.toLowerCase().includes(searchLower) ||
            pool.deal.country.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        
        // Stage filter
        if (stageFilters.length > 0 && !stageFilters.includes(pool.deal.stage)) {
          return false;
        }
        
        // Status filter
        if (statusFilters.length > 0 && !statusFilters.includes(pool.pool_status)) {
          return false;
        }

        // Country filter
        if (countryFilters.length > 0 && !countryFilters.includes(pool.deal.country)) {
          return false;
        }

        // Sector filter
        if (sectorFilters.length > 0) {
          const matchesSector = sectorFilters.some(sector => 
            pool.deal.sector_type === sector || 
            pool.deal.industry.toLowerCase().includes(sector.toLowerCase())
          );
          if (!matchesSector) return false;
        }
        
        return true;
      });
  }, [pools, deals, search, stageFilters, statusFilters, countryFilters, sectorFilters]);

  const toggleFilter = <T extends string>(value: T, current: T[], setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearFilters = () => {
    setStageFilters([]);
    setStatusFilters([]);
    setCountryFilters([]);
    setSectorFilters([]);
    setSearch('');
  };

  const hasFilters = activeFilterCount > 0 || search;

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Explore Pools</h1>
        <p className="text-muted-foreground">Discover and invest in curated startup opportunities</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by startup, industry, or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-80 flex-col">
                <SheetHeader>
                  <SheetTitle>Filter Pools</SheetTitle>
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
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pool Grid */}
      {poolsWithDeals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {poolsWithDeals.map(pool => pool && (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">No pools found</h3>
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