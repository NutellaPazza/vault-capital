import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApplicationFormData } from '@/pages/ApplyPage';

interface Props {
  data: ApplicationFormData;
  updateData: (updates: Partial<ApplicationFormData>) => void;
  errors: Record<string, string>;
}

export const FormStepPitch = ({ data, updateData, errors }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pitch_summary">Pitch Summary * (max 500 characters)</Label>
        <Textarea
          id="pitch_summary"
          value={data.pitch_summary}
          onChange={(e) => updateData({ pitch_summary: e.target.value.slice(0, 500) })}
          placeholder="Describe your startup in a few sentences. What do you do?"
          rows={3}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {errors.pitch_summary && <p className="text-destructive">{errors.pitch_summary}</p>}
          <span className="ml-auto">{data.pitch_summary.length}/500</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem">Problem *</Label>
        <Textarea
          id="problem"
          value={data.problem}
          onChange={(e) => updateData({ problem: e.target.value })}
          placeholder="What problem are you solving? Who experiences this problem?"
          rows={4}
        />
        {errors.problem && <p className="text-sm text-destructive">{errors.problem}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="solution">Solution *</Label>
        <Textarea
          id="solution"
          value={data.solution}
          onChange={(e) => updateData({ solution: e.target.value })}
          placeholder="What is your solution? How does it solve the problem?"
          rows={4}
        />
        {errors.solution && <p className="text-sm text-destructive">{errors.solution}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="traction">Traction (optional but recommended)</Label>
        <Textarea
          id="traction"
          value={data.traction}
          onChange={(e) => updateData({ traction: e.target.value })}
          placeholder="Current metrics, users, revenue, partnerships, etc."
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Share any proof points: users, revenue, growth rate, notable customers, press, etc.
        </p>
      </div>
    </div>
  );
};
