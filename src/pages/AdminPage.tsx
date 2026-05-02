import { useState, useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/common';
import { ApplicationsList } from '@/components/admin/ApplicationsList';
import { ApplicationDetail } from '@/components/admin/ApplicationDetail';
import { useAppStore } from '@/store/appStore';
import { toast } from '@/hooks/use-toast';
import { Settings, Zap, RefreshCw, FileText, Search, ExternalLink, Layers, Activity, Inbox, Users } from 'lucide-react';
import { PoolStatus, StartupApplication } from '@/types';

const AdminPage = () => {
  const {
    isAdmin, pools, deals, applications, allUsers,
    forcePoolStatus, simulateExit, resetToInitialState,
  } = useAppStore();
  const [selectedPool, setSelectedPool] = useState('');
  const [exitMultiple, setExitMultiple] = useState('2.0');
  const [selectedApplication, setSelectedApplication] = useState<StartupApplication | null>(null);
  const [poolSearch, setPoolSearch] = useState('');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const poolsWithDeals = useMemo(
    () => pools.map(p => ({ ...p, deal: deals.find(d => d.id === p.deal_id)! })).filter(p => p.deal),
    [pools, deals],
  );

  const filteredPools = useMemo(() => {
    const q = poolSearch.trim().toLowerCase();
    if (!q) return poolsWithDeals;
    return poolsWithDeals.filter(p => p.deal.startup_name.toLowerCase().includes(q));
  }, [poolsWithDeals, poolSearch]);

  const handleForceStatus = (poolId: string, status: PoolStatus) => {
    forcePoolStatus(poolId, status);
    toast({ title: 'Status Updated', description: `Pool status changed to ${status}` });
  };

  const handleExit = () => {
    const multiple = parseFloat(exitMultiple);
    if (!selectedPool || isNaN(multiple) || multiple <= 0) {
      toast({ title: 'Invalid Input', variant: 'destructive' });
      return;
    }
    simulateExit(selectedPool, multiple);
    toast({ title: 'Exit Simulated', description: `Proceeds distributed at ${multiple}x` });
    setSelectedPool('');
  };

  const handleReset = () => {
    resetToInitialState();
    toast({ title: 'Data Reset', description: 'All data restored to initial state.' });
  };

  const activePools = poolsWithDeals.filter(p => p.pool_status === 'active');

  // KPIs
  const totalVaults = pools.length;
  const liveCount = pools.filter(p => p.pool_status === 'live').length;
  const pendingApps = applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
  const totalUsers = allUsers.length;

  const kpis = [
    { icon: Layers, label: 'Total vaults', value: totalVaults, accent: 'bg-primary/10 text-primary' },
    { icon: Activity, label: 'Live now', value: liveCount, accent: 'bg-success/10 text-success' },
    { icon: Inbox, label: 'Pending applications', value: pendingApps, accent: 'bg-warning/20 text-warning' },
    { icon: Users, label: 'Total users', value: totalUsers, accent: 'bg-accent text-accent-foreground' },
  ];

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Admin Mode
        </span>
      </div>

      {/* KPI Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {kpis.map(({ icon: Icon, label, value, accent }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold leading-tight">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pools" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pools">Pool Management</TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {pendingApps > 0 && (
              <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                {pendingApps}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reset">Reset Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="pools">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pool Management</CardTitle>
                <CardDescription>Force pool status changes</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search pools by name..."
                    value={poolSearch}
                    onChange={(e) => setPoolSearch(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredPools.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No pools match your search.</p>
                ) : filteredPools.map(pool => (
                  <div key={pool.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{pool.deal.startup_name}</p>
                      <StatusBadge status={pool.pool_status} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <a href={`/pool/${pool.id}`} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-1 h-3.5 w-3.5" /> View
                        </a>
                      </Button>
                      {pool.pool_status === 'live' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleForceStatus(pool.id, 'filled')}>Mark Filled</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleForceStatus(pool.id, 'failed')}>Mark Failed</Button>
                        </>
                      )}
                      {pool.pool_status === 'filled' && (
                        <Button size="sm" onClick={() => handleForceStatus(pool.id, 'active')}>Activate</Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" /> Simulate Exit</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Active Pool</Label>
                  <Select value={selectedPool} onValueChange={setSelectedPool}>
                    <SelectTrigger><SelectValue placeholder="Choose pool" /></SelectTrigger>
                    <SelectContent>
                      {activePools.map(p => <SelectItem key={p.id} value={p.id}>{p.deal.startup_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Exit Multiple</Label>
                  <Input type="number" value={exitMultiple} onChange={(e) => setExitMultiple(e.target.value)} step="0.1" min="0.1" />
                </div>
                <Button onClick={handleExit} disabled={!selectedPool} className="w-full">Simulate Exit</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Startup Applications
                {pendingApps > 0 && (
                  <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    {pendingApps} pending
                  </span>
                )}
              </CardTitle>
              <CardDescription>Review and manage startup applications</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedApplication ? (
                <ApplicationDetail
                  application={selectedApplication}
                  onBack={() => setSelectedApplication(null)}
                />
              ) : (
                <ApplicationsList
                  applications={applications}
                  onSelectApplication={setSelectedApplication}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reset">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Reset Demo</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                This will reset all data to the initial state, including pools, positions, transactions, and applications.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Reset All Data</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset all demo data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all positions, transactions, and user data and restore the initial demo state. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, reset everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
