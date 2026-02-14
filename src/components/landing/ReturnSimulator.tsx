import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Calculator, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const ReturnSimulator = () => {
  const [investment, setInvestment] = useState(500);
  const [multiple, setMultiple] = useState(5);

  const grossReturn = investment * multiple;
  const entryFee = investment * 0.02;
  const profit = grossReturn - investment;
  const carryFee = profit > 0 ? profit * 0.02 : 0;
  const netReturn = grossReturn - entryFee - carryFee;
  const netProfit = netReturn - investment;

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Return Simulator</h2>
        </div>
        <p className="mb-8 text-muted-foreground">
          See what your investment could become. Startup investing is high risk — but when it works, the returns speak for themselves.
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
              <span className="text-muted-foreground">Gross Return</span>
              <span className="font-medium">{formatCurrency(grossReturn, false)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entry Fee (2%)</span>
              <span className="font-medium">-{formatCurrency(entryFee, false)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Carry Fee (2% on profit)</span>
              <span className="font-medium">-{formatCurrency(carryFee, false)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Net Return</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(netReturn, false)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-lg font-semibold text-success">
                +{formatCurrency(netProfit, false)} profit
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            This is a simulation only. Past performance does not guarantee future results. 
            Startup investments are high risk and you may lose your entire capital.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ReturnSimulator;
