import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApplicationFormData } from '@/pages/ApplyPage';
import { Plus, X } from 'lucide-react';

interface Props {
  data: ApplicationFormData;
  updateData: (updates: Partial<ApplicationFormData>) => void;
  errors: Record<string, string>;
}

export const FormStepFundraising = ({ data, updateData, errors }: Props) => {
  const [newFundUse, setNewFundUse] = useState('');

  const addFundUse = () => {
    if (newFundUse.trim()) {
      updateData({ use_of_funds: [...data.use_of_funds, newFundUse.trim()] });
      setNewFundUse('');
    }
  };

  const removeFundUse = (index: number) => {
    updateData({ use_of_funds: data.use_of_funds.filter((_, i) => i !== index) });
  };

  const impliedValuation = data.fundraising_target_eur && data.offering_equity_percent
    ? (parseFloat(data.fundraising_target_eur) / parseFloat(data.offering_equity_percent)) * 100
    : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fundraising_target_eur">Fundraising Target (EUR) *</Label>
          <Input
            id="fundraising_target_eur"
            type="number"
            value={data.fundraising_target_eur}
            onChange={(e) => updateData({ fundraising_target_eur: e.target.value })}
            placeholder="500000"
            min="0"
          />
          {errors.fundraising_target_eur && (
            <p className="text-sm text-destructive">{errors.fundraising_target_eur}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="offering_equity_percent">Equity Offered (%) *</Label>
          <Input
            id="offering_equity_percent"
            type="number"
            value={data.offering_equity_percent}
            onChange={(e) => updateData({ offering_equity_percent: e.target.value })}
            placeholder="10"
            min="0"
            max="100"
            step="0.1"
          />
          {errors.offering_equity_percent && (
            <p className="text-sm text-destructive">{errors.offering_equity_percent}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="valuation_pre_money_eur">Pre-money Valuation (EUR) (optional)</Label>
        <Input
          id="valuation_pre_money_eur"
          type="number"
          value={data.valuation_pre_money_eur}
          onChange={(e) => updateData({ valuation_pre_money_eur: e.target.value })}
          placeholder="5000000"
          min="0"
        />
        {impliedValuation && (
          <p className="text-xs text-muted-foreground">
            Implied pre-money from target & equity: €{impliedValuation.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Use of Funds</Label>
        <p className="text-xs text-muted-foreground">
          How will you allocate the raised capital? (e.g., "40% Product Development", "30% Sales & Marketing")
        </p>
        
        <div className="flex gap-2">
          <Input
            value={newFundUse}
            onChange={(e) => setNewFundUse(e.target.value)}
            placeholder="40% Product Development"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFundUse())}
          />
          <Button type="button" variant="outline" onClick={addFundUse}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.use_of_funds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.use_of_funds.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeFundUse(index)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="mb-2 font-medium">Summary</h4>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Raising:</span>
            <span className="font-medium">
              {data.fundraising_target_eur 
                ? `€${parseFloat(data.fundraising_target_eur).toLocaleString('de-DE')}`
                : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">For equity:</span>
            <span className="font-medium">
              {data.offering_equity_percent ? `${data.offering_equity_percent}%` : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Implied valuation:</span>
            <span className="font-medium">
              {impliedValuation 
                ? `€${impliedValuation.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`
                : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
