import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Calculator, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const ReturnSimulator = () => {
  const [investment, setInvestment] = useState(500);
  const [multiple, setMultiple] = useState(5);

  const entryFee = investment * 0.02;
  const amountInVault = investment - entryFee;
  const grossReturn = amountInVault * multiple;
  const profit = grossReturn - amountInVault;
  const carryFee = profit > 0 ? profit * 0.02 : 0;
  const netReturn = grossReturn - carryFee;
  const netProfit = netReturn - investment;

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Return Simulator</h2>
        </div>
        <p className="mb-2 text-muted-foreground">
          See what your investment could become. Startup investing is high risk, but when it works, the returns speak for themselves.
        </p>
        <p className="mb-8 text-sm font-medium text-warning">
          Illustration only. Returns are not guaranteed.
        </p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-8 p-6 md:p-8">
          {/* Investment Amount */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Investment Amount</label>
              <span className="text-xl font-bold text-primary">{formatCurrency(investment, false)}</span>
            </div>
            <Slider
              value={[investment]}
              onValueChange={([v]) => setInvestment(v)}
              min={100}
              max={10000}
              step={100}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>€100</span>
              <span>€10,000</span>
            </div>
          </div>

          {/* Exit Multiple */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Startup Exit Multiple</label>
              <span className="text-xl font-bold text-primary">{multiple}x</span>
            </div>
            <Slider
              value={[multiple]}
              onValueChange={([v]) => setMultiple(v)}
              min={2}
              max={20}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2x</span>
              <span>20x</span>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Investment</span>
              <span className="font-medium">{formatCurrency(investment, false)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entry fee (2%, deducted)</span>
              <span className="font-medium">{formatCurrency(entryFee, false)}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-3">
              <span className="font-medium">Amount in vault</span>
              <span className="font-semibold">{formatCurrency(amountInVault, false)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gross return ({multiple}x)</span>
              <span className="font-medium">{formatCurrency(grossReturn, false)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Carry fee (2% on profit)</span>
              <span className="font-medium">{carryFee > 0 ? `-${formatCurrency(carryFee, false)}` : '€0'}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Net return</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(netReturn, false)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-lg font-semibold text-success">
                +{formatCurrency(netProfit, false)} profit
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              Fees: 2% entry fee + 2% exit fee on profit only. No hidden charges.
            </p>
            <p>
              This simulation is for illustrative purposes only. It does not represent a guarantee
              or prediction of future returns. You may lose all invested capital.
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
              Reference scenarios: −100% (total loss) · 0% (capital preserved) · 3x (positive exit).
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Past performance does not guarantee future results. Startup investments are high risk.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ReturnSimulator;
