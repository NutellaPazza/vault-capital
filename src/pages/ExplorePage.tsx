import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PoolCard } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DealStage, PoolStatus } from '@/types';

const ExplorePage = () => {
  const { pools, deals } = useAppStore();
  const [search, setSearch] = useState('');
  const [stageFilters, setStageFilters] = useState<DealStage[]>([]);
  const [statusFilters, setStatusFilters] = useState<PoolStatus[]>([]);

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
        
        return true;
      });
  }, [pools, deals, search, stageFilters, statusFilters]);

  const toggleStageFilter = (stage: DealStage) => {
    setStageFilters(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage) 
        : [...prev, stage]
    );
  };

  const toggleStatusFilter = (status: PoolStatus) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setStageFilters([]);
    setStatusFilters([]);
    setSearch('');
  };

  const hasFilters = stageFilters.length > 0 || statusFilters.length > 0 || search;

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Stage
                  {stageFilters.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {stageFilters.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Stage</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={stageFilters.includes('pre-seed')}
                  onCheckedChange={() => toggleStageFilter('pre-seed')}
                >
                  Pre-seed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stageFilters.includes('seed')}
                  onCheckedChange={() => toggleStageFilter('seed')}
                >
                  Seed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stageFilters.includes('series-a')}
                  onCheckedChange={() => toggleStageFilter('series-a')}
                >
                  Series A
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                  {statusFilters.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {statusFilters.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes('live')}
                  onCheckedChange={() => toggleStatusFilter('live')}
                >
                  Live
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes('upcoming')}
                  onCheckedChange={() => toggleStatusFilter('upcoming')}
                >
                  Upcoming
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes('active')}
                  onCheckedChange={() => toggleStatusFilter('active')}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes('filled')}
                  onCheckedChange={() => toggleStatusFilter('filled')}
                >
                  Filled
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear
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
