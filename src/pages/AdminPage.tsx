import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/common';
import { ApplicationsList } from '@/components/admin/ApplicationsList';
import { ApplicationDetail } from '@/components/admin/ApplicationDetail';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { Settings, Zap, RefreshCw, FileText } from 'lucide-react';
import { PoolStatus, StartupApplication } from '@/types';

const AdminPage = () => {
  const { isAdmin, pools, deals, positions, applications, forcePoolStatus, simulateExit, resetToInitialState } = useAppStore();
  const [selectedPool, setSelectedPool] = useState('');
  const [exitMultiple, setExitMultiple] = useState('2.0');
  const [selectedApplication, setSelectedApplication] = useState<StartupApplication | null>(null);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const poolsWithDeals = pools.map(p => ({ ...p, deal: deals.find(d => d.id === p.deal_id)! })).filter(p => p.deal);

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

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <Tabs defaultValue="pools" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pools">Pool Management</TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {applications.length > 0 && (
              <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                {applications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reset">Reset Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="pools">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Pool Management</CardTitle><CardDescription>Force pool status changes</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {poolsWithDeals.map(pool => (
                  <div key={pool.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{pool.deal.startup_name}</p>
                      <StatusBadge status={pool.pool_status} />
                    </div>
                    <div className="flex gap-2">
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
              <Button variant="destructive" onClick={handleReset}>Reset All Data</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
