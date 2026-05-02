import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationFormData } from '@/pages/ApplyPage';

const COUNTRIES = [
  'Italy', 'Germany', 'France', 'Spain', 'Netherlands', 'Belgium', 'Austria', 
  'Switzerland', 'Portugal', 'Ireland', 'Poland', 'Sweden', 'Denmark', 'Norway',
  'Finland', 'United Kingdom', 'United States', 'Canada', 'Other'
];

const INDUSTRIES = [
  'Fintech', 'B2B SaaS', 'AI/ML', 'E-commerce', 'HealthTech', 'CleanTech', 
  'EdTech', 'PropTech', 'FoodTech', 'Mobility', 'Cybersecurity', 'Other'
];

const STAGES = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
];

interface Props {
  data: ApplicationFormData;
  updateData: (updates: Partial<ApplicationFormData>) => void;
  errors: Record<string, string>;
}

export const FormStepBasics = ({ data, updateData, errors }: Props) => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground md:text-sm">
        Applications are reviewed on a rolling basis. We typically respond within 5 business days.
        Applying does not guarantee listing on the platform.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startup_name">Startup Name *</Label>
          <Input
            id="startup_name"
            value={data.startup_name}
            onChange={(e) => updateData({ startup_name: e.target.value })}
            placeholder="Your startup name"
          />
          {errors.startup_name && <p className="text-sm text-destructive">{errors.startup_name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={data.website}
            onChange={(e) => updateData({ website: e.target.value })}
            placeholder="https://yoursite.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Country *</Label>
          <Select value={data.country} onValueChange={(value) => updateData({ country: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
        </div>

        <div className="space-y-2">
          <Label>Industry *</Label>
          <Select value={data.industry} onValueChange={(value) => updateData({ industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Stage *</Label>
          <Select value={data.stage} onValueChange={(value) => updateData({ stage: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map(stage => (
                <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stage && <p className="text-sm text-destructive">{errors.stage}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="founding_year">Founding Year</Label>
          <Input
            id="founding_year"
            type="number"
            value={data.founding_year}
            onChange={(e) => updateData({ founding_year: e.target.value })}
            placeholder="2024"
            min="2000"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team_size">Team Size</Label>
          <Input
            id="team_size"
            type="number"
            value={data.team_size}
            onChange={(e) => updateData({ team_size: e.target.value })}
            placeholder="5"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email *</Label>
        <Input
          id="contact_email"
          type="email"
          value={data.contact_email}
          onChange={(e) => updateData({ contact_email: e.target.value })}
          placeholder="founder@startup.com"
        />
        {errors.contact_email && <p className="text-sm text-destructive">{errors.contact_email}</p>}
      </div>
    </div>
  );
};
