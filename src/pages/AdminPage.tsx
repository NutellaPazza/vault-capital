import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/common';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatCompactCurrency } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { Settings, Zap, RefreshCw } from 'lucide-react';
import { PoolStatus } from '@/types';

const AdminPage = () => {
  const { isAdmin, pools, deals, positions, forcePoolStatus, simulateExit, resetToInitialState } = useAppStore();
  const [selectedPool, setSelectedPool] = useState('');
  const [exitMultiple, setExitMultiple] = useState('2.0');

  if (!isAdmin) {
    return (
      <div className="container flex flex-col items-center justify-center py-16">
        <Settings className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Admin Access Required</h2>
        <p className="text-muted-foreground">Enable admin mode from the settings menu.</p>
      </div>
    );
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

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Reset Demo</CardTitle></CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleReset}>Reset All Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
