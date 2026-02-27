import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { Wallet, ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { TransactionType } from '@/types';

const transactionTypeLabels: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdraw: 'Withdrawal',
  invest: 'Investment',
  pool_refund: 'Vault Refund',
  market_buy: 'Resale Purchase',
  market_sell: 'Resale Sale',
  exit_distribution: 'Exit Distribution',
  fee: 'Fee',
};

const WalletPage = () => {
  const { currentUser, transactions, deposit, withdraw } = useAppStore();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [typeFilters, setTypeFilters] = useState<TransactionType[]>([]);

  const userTransactions = transactions
    .filter(t => t.user_id === currentUser?.id)
    .filter(t => typeFilters.length === 0 || typeFilters.includes(t.type));

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    deposit(amount);
    
    toast({
      title: 'Deposit Successful',
      description: `${formatCurrency(amount)} has been added to your wallet.`,
    });
    
    setIsDepositOpen(false);
    setDepositAmount('');
    setIsProcessing(false);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    if (currentUser && amount > currentUser.wallet_balance_eur) {
      toast({
        title: 'Insufficient Balance',
        description: 'You cannot withdraw more than your current balance.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = withdraw(amount);
    
    if (success) {
      toast({
        title: 'Withdrawal Successful',
        description: `${formatCurrency(amount)} has been withdrawn from your wallet.`,
      });
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
    } else {
      toast({
        title: 'Withdrawal Failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
    
    setIsProcessing(false);
  };

  const toggleTypeFilter = (type: TransactionType) => {
    setTypeFilters(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and view transaction history</p>
      </div>

      {/* Balance Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(currentUser?.wallet_balance_eur || 0)}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => setIsDepositOpen(true)} className="gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Deposit
              </Button>
              <Button variant="outline" onClick={() => setIsWithdrawOpen(true)} className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet activity</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  {typeFilters.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {typeFilters.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Transaction Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(transactionTypeLabels) as TransactionType[]).map(type => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={typeFilters.includes(type)}
                    onCheckedChange={() => toggleTypeFilter(type)}
                  >
                    {transactionTypeLabels[type]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {userTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDateTime(transaction.timestamp)}
                      </TableCell>
                      <TableCell>
                        <span className="rounded bg-muted px-2 py-1 text-xs font-medium">
                          {transactionTypeLabels[transaction.type]}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.meta.notes || '-'}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${transaction.amount_eur >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {transaction.amount_eur >= 0 ? '+' : ''}{formatCurrency(transaction.amount_eur)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>
              Add money to your VaultCapital wallet (simulated)
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (EUR)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="e.g. 1000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min={1}
                step={100}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepositOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeposit} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Deposit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Withdraw money from your wallet (simulated)
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (EUR)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="e.g. 500"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={1}
                max={currentUser?.wallet_balance_eur || 0}
                step={100}
              />
              <p className="text-sm text-muted-foreground">
                Available: {formatCurrency(currentUser?.wallet_balance_eur || 0)}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Withdraw'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;
