import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { StartupApplication, ApplicationStatus } from '@/types';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Building2, Users, Lightbulb, FileText, Target, Mail,
  Eye, Star, XCircle, CheckCircle, MessageSquare
} from 'lucide-react';

interface Props {
  application: StartupApplication;
  onBack: () => void;
}

const statusColors: Record<ApplicationStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-green-100 text-green-800',
};

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm">
      {children}
    </CardContent>
  </Card>
);

export const ApplicationDetail = ({ application, onBack }: Props) => {
  const { updateApplicationStatus, addApplicationNote } = useAppStore();
  const [noteText, setNoteText] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleStatusChange = (status: ApplicationStatus, reason?: string) => {
    updateApplicationStatus(application.id, status, reason);
    toast({ title: 'Status Updated', description: `Application marked as ${status}` });
    if (status === 'rejected') setShowRejectDialog(false);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      addApplicationNote(application.id, noteText.trim());
      setNoteText('');
      toast({ title: 'Note Added' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{application.startup_name}</h2>
            <p className="text-sm text-muted-foreground">ID: {application.id}</p>
          </div>
        </div>
        <Badge className={statusColors[application.status]} variant="secondary">
          {application.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Contact Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="flex items-center gap-3 py-4">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Contact Email</p>
            <a href={`mailto:${application.contact_email}`} className="font-medium text-primary hover:underline">
              {application.contact_email}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Status Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {application.status === 'submitted' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('under_review')}>
              <Eye className="mr-2 h-4 w-4" />
              Mark Under Review
            </Button>
          )}
          {['submitted', 'under_review'].includes(application.status) && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('shortlisted')}>
              <Star className="mr-2 h-4 w-4" />
              Shortlist
            </Button>
          )}
          {['submitted', 'under_review', 'shortlisted'].includes(application.status) && (
            <>
              <Button size="sm" variant="default" onClick={() => handleStatusChange('accepted')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setShowRejectDialog(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Application Data */}
      <div className="grid gap-4 md:grid-cols-2">
        <Section icon={Building2} title="Company Info">
          <div className="space-y-2">
            <p><strong>Country:</strong> {application.country}</p>
            <p><strong>Industry:</strong> {application.industry}</p>
            <p><strong>Stage:</strong> {application.stage}</p>
            {application.website && (
              <p><strong>Website:</strong> <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{application.website}</a></p>
            )}
            {application.founding_year && <p><strong>Founded:</strong> {application.founding_year}</p>}
            {application.team_size && <p><strong>Team Size:</strong> {application.team_size}</p>}
          </div>
        </Section>

        <Section icon={Users} title="Founders">
          <div className="space-y-3">
            {application.founders.map((founder, i) => (
              <div key={i} className="rounded-lg bg-muted/50 p-2">
                <p className="font-medium">{founder.name}</p>
                <p className="text-muted-foreground">{founder.role}</p>
                {founder.linkedin_url && (
                  <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Lightbulb} title="Pitch">
          <div className="space-y-3">
            <div>
              <p className="font-medium">Summary</p>
              <p className="text-muted-foreground">{application.pitch_summary}</p>
            </div>
            <div>
              <p className="font-medium">Problem</p>
              <p className="text-muted-foreground">{application.problem}</p>
            </div>
            <div>
              <p className="font-medium">Solution</p>
              <p className="text-muted-foreground">{application.solution}</p>
            </div>
            {application.traction && (
              <div>
                <p className="font-medium">Traction</p>
                <p className="text-muted-foreground">{application.traction}</p>
              </div>
            )}
          </div>
        </Section>

        <Section icon={FileText} title="Materials">
          <div className="space-y-2">
            <p>
              <strong>Deck:</strong>{' '}
              <a href={application.deck_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Deck
              </a>
            </p>
            {application.demo_url && (
              <p>
                <strong>Demo:</strong>{' '}
                <a href={application.demo_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  View Demo
                </a>
              </p>
            )}
            {application.data_room_url && (
              <p>
                <strong>Data Room:</strong>{' '}
                <a href={application.data_room_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Open Data Room
                </a>
              </p>
            )}
          </div>
        </Section>

        <Section icon={Target} title="Fundraising">
          <div className="space-y-2">
            <p><strong>Target:</strong> {formatCurrency(application.fundraising_target_eur)}</p>
            <p><strong>Equity Offered:</strong> {application.offering_equity_percent}%</p>
            {application.valuation_pre_money_eur && (
              <p><strong>Pre-money Valuation:</strong> {formatCurrency(application.valuation_pre_money_eur)}</p>
            )}
            {application.use_of_funds.length > 0 && (
              <div>
                <p className="font-medium">Use of Funds:</p>
                <ul className="ml-4 list-disc text-muted-foreground">
                  {application.use_of_funds.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>

        <Section icon={MessageSquare} title="Internal Notes">
          <div className="space-y-4">
            {application.internal_notes.length > 0 ? (
              <div className="space-y-2">
                {application.internal_notes.map((note) => (
                  <div key={note.id} className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{note.author}</span>
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                    <p className="mt-1">{note.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No notes yet</p>
            )}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
              />
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>Add</Button>
            </div>
          </div>
        </Section>
      </div>

      {/* Rejection Reason */}
      {application.status === 'rejected' && application.rejection_reason && (
        <Card className="border-destructive/50">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-destructive">Rejection Reason</p>
            <p className="text-sm text-muted-foreground">{application.rejection_reason}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-xs text-muted-foreground">
        <p>Created: {formatDate(application.created_at)}</p>
        <p>Last Updated: {formatDate(application.updated_at)}</p>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for rejection (required)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => handleStatusChange('rejected', rejectReason)}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
