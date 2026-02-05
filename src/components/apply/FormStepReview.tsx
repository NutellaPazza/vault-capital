import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ApplicationFormData } from '@/pages/ApplyPage';
import { Building2, Users, Lightbulb, FileText, Target, Send } from 'lucide-react';

interface Props {
  data: ApplicationFormData;
  onSubmit: () => void;
}

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm font-medium">
      <Icon className="h-4 w-4 text-primary" />
      {title}
    </div>
    <div className="ml-6 space-y-1 text-sm text-muted-foreground">
      {children}
    </div>
  </div>
);

export const FormStepReview = ({ data, onSubmit }: Props) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Please review your application before submitting. Make sure all information is accurate.
        </p>
      </div>

      <div className="space-y-6">
        <Section icon={Building2} title="Company Information">
          <div className="grid gap-1 sm:grid-cols-2">
            <p><span className="font-medium text-foreground">Name:</span> {data.startup_name}</p>
            <p><span className="font-medium text-foreground">Country:</span> {data.country}</p>
            <p><span className="font-medium text-foreground">Industry:</span> {data.industry}</p>
            <p><span className="font-medium text-foreground">Stage:</span> {data.stage}</p>
            {data.website && <p><span className="font-medium text-foreground">Website:</span> {data.website}</p>}
            {data.founding_year && <p><span className="font-medium text-foreground">Founded:</span> {data.founding_year}</p>}
            {data.team_size && <p><span className="font-medium text-foreground">Team Size:</span> {data.team_size}</p>}
          </div>
          <p><span className="font-medium text-foreground">Contact:</span> {data.contact_email}</p>
        </Section>

        <Section icon={Users} title="Founders">
          {data.founders.filter(f => f.name.trim()).map((founder, i) => (
            <p key={i}>
              <span className="font-medium text-foreground">{founder.name}</span> — {founder.role}
              {founder.linkedin_url && (
                <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                  LinkedIn
                </a>
              )}
            </p>
          ))}
        </Section>

        <Section icon={Lightbulb} title="Pitch">
          <p><span className="font-medium text-foreground">Summary:</span> {data.pitch_summary}</p>
          <p className="mt-2"><span className="font-medium text-foreground">Problem:</span> {data.problem}</p>
          <p className="mt-2"><span className="font-medium text-foreground">Solution:</span> {data.solution}</p>
          {data.traction && <p className="mt-2"><span className="font-medium text-foreground">Traction:</span> {data.traction}</p>}
        </Section>

        <Section icon={FileText} title="Materials">
          <p>
            <span className="font-medium text-foreground">Pitch Deck:</span>{' '}
            <a href={data.deck_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {data.deck_url}
            </a>
          </p>
          {data.demo_url && (
            <p>
              <span className="font-medium text-foreground">Demo:</span>{' '}
              <a href={data.demo_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {data.demo_url}
              </a>
            </p>
          )}
          {data.data_room_url && (
            <p>
              <span className="font-medium text-foreground">Data Room:</span>{' '}
              <a href={data.data_room_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {data.data_room_url}
              </a>
            </p>
          )}
        </Section>

        <Section icon={Target} title="Fundraising">
          <div className="grid gap-1 sm:grid-cols-2">
            <p>
              <span className="font-medium text-foreground">Target:</span>{' '}
              €{parseFloat(data.fundraising_target_eur || '0').toLocaleString('de-DE')}
            </p>
            <p>
              <span className="font-medium text-foreground">Equity:</span> {data.offering_equity_percent}%
            </p>
            {data.valuation_pre_money_eur && (
              <p>
                <span className="font-medium text-foreground">Pre-money:</span>{' '}
                €{parseFloat(data.valuation_pre_money_eur).toLocaleString('de-DE')}
              </p>
            )}
          </div>
          {data.use_of_funds.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-foreground">Use of Funds:</span>
              <ul className="ml-4 mt-1 list-disc">
                {data.use_of_funds.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      </div>

      <div className="flex items-start space-x-3 rounded-lg border bg-muted/30 p-4">
        <Checkbox
          id="confirm"
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked === true)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="confirm" className="cursor-pointer">
            I confirm this information is accurate *
          </Label>
          <p className="text-xs text-muted-foreground">
            By submitting, you agree that the VaultCapital team may review your application and contact you.
          </p>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!confirmed}
        size="lg"
        className="w-full"
      >
        <Send className="mr-2 h-4 w-4" />
        Submit Application
      </Button>
    </div>
  );
};
