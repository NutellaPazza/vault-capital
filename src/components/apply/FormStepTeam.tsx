import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ApplicationFormData } from '@/pages/ApplyPage';
import { Founder } from '@/types';
import { Plus, Trash2, User } from 'lucide-react';

interface Props {
  data: ApplicationFormData;
  updateData: (updates: Partial<ApplicationFormData>) => void;
  errors: Record<string, string>;
}

export const FormStepTeam = ({ data, updateData, errors }: Props) => {
  const addFounder = () => {
    updateData({
      founders: [...data.founders, { name: '', role: '', linkedin_url: '' }]
    });
  };

  const removeFounder = (index: number) => {
    if (data.founders.length <= 1) return;
    updateData({
      founders: data.founders.filter((_, i) => i !== index)
    });
  };

  const updateFounder = (index: number, updates: Partial<Founder>) => {
    updateData({
      founders: data.founders.map((f, i) => 
        i === index ? { ...f, ...updates } : f
      )
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Founders</h3>
          <p className="text-sm text-muted-foreground">Add your founding team members</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addFounder}>
          <Plus className="mr-2 h-4 w-4" />
          Add Founder
        </Button>
      </div>

      {errors.founders && (
        <p className="text-sm text-destructive">{errors.founders}</p>
      )}

      <div className="space-y-4">
        {data.founders.map((founder, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Founder {index + 1}</span>
                </div>
                {data.founders.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFounder(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={founder.name}
                    onChange={(e) => updateFounder(index, { name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Input
                    value={founder.role}
                    onChange={(e) => updateFounder(index, { role: e.target.value })}
                    placeholder="CEO / CTO / COO"
                  />
                  {errors[`founder_${index}_role`] && (
                    <p className="text-sm text-destructive">{errors[`founder_${index}_role`]}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>LinkedIn URL (optional)</Label>
                <Input
                  type="url"
                  value={founder.linkedin_url || ''}
                  onChange={(e) => updateFounder(index, { linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
