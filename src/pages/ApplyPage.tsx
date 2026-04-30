import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/appStore';
import { StartupApplication, Founder } from '@/types';
import { FormStepBasics } from '@/components/apply/FormStepBasics';
import { FormStepTeam } from '@/components/apply/FormStepTeam';
import { FormStepPitch } from '@/components/apply/FormStepPitch';
import { FormStepMaterials } from '@/components/apply/FormStepMaterials';
import { FormStepFundraising } from '@/components/apply/FormStepFundraising';
import { FormStepReview } from '@/components/apply/FormStepReview';
import { ApplicationSuccess } from '@/components/apply/ApplicationSuccess';
import { ArrowLeft, ArrowRight, Save, Rocket } from 'lucide-react';

const STEPS = [
  { title: 'Basics', description: 'Company info' },
  { title: 'Team', description: 'Founders' },
  { title: 'Pitch', description: 'Your story' },
  { title: 'Materials', description: 'Documents' },
  { title: 'Fundraising', description: 'The ask' },
  { title: 'Review', description: 'Submit' },
];

const DRAFT_KEY = 'vaultcapital-application-draft';

export interface ApplicationFormData {
  startup_name: string;
  website: string;
  country: string;
  industry: string;
  stage: string;
  founding_year: string;
  team_size: string;
  contact_email: string;
  founders: Founder[];
  pitch_summary: string;
  problem: string;
  solution: string;
  traction: string;
  deck_url: string;
  demo_url: string;
  data_room_url: string;
  fundraising_target_eur: string;
  offering_equity_percent: string;
  valuation_pre_money_eur: string;
  use_of_funds: string[];
}

const initialFormData: ApplicationFormData = {
  startup_name: '',
  website: '',
  country: '',
  industry: '',
  stage: '',
  founding_year: '',
  team_size: '',
  contact_email: '',
  founders: [{ name: '', role: '', linkedin_url: '' }],
  pitch_summary: '',
  problem: '',
  solution: '',
  traction: '',
  deck_url: '',
  demo_url: '',
  data_room_url: '',
  fundraising_target_eur: '',
  offering_equity_percent: '',
  valuation_pre_money_eur: '',
  use_of_funds: [],
};

const ApplyPage = () => {
  const navigate = useNavigate();
  const { submitApplication } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setShowDraftBanner(true);
    }
  }, []);

  const handleResumeDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed.data);
        setCurrentStep(parsed.step || 0);
      } catch (e) {
        console.error('Failed to parse draft');
      }
    }
    setShowDraftBanner(false);
  };

  const handleStartFresh = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftBanner(false);
  };

  const handleSaveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ data: formData, step: currentStep }));
    toast({ title: 'Draft Saved', description: 'You can resume your application later.' });
  };

  const updateFormData = (updates: Partial<ApplicationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach(key => delete clearedErrors[key]);
    setErrors(clearedErrors);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basics
        if (!formData.startup_name.trim()) newErrors.startup_name = 'Startup name is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        if (!formData.stage) newErrors.stage = 'Stage is required';
        if (!formData.contact_email.trim()) newErrors.contact_email = 'Contact email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
          newErrors.contact_email = 'Invalid email format';
        }
        break;
      case 1: // Team
        if (formData.founders.length === 0 || !formData.founders[0].name.trim()) {
          newErrors.founders = 'At least one founder is required';
        } else {
          formData.founders.forEach((f, i) => {
            if (f.name.trim() && !f.role.trim()) {
              newErrors[`founder_${i}_role`] = 'Role is required';
            }
          });
        }
        break;
      case 2: // Pitch
        if (!formData.pitch_summary.trim()) newErrors.pitch_summary = 'Pitch summary is required';
        if (!formData.problem.trim()) newErrors.problem = 'Problem is required';
        if (!formData.solution.trim()) newErrors.solution = 'Solution is required';
        break;
      case 3: // Materials
        if (!formData.deck_url.trim()) newErrors.deck_url = 'Pitch deck URL is required';
        else if (!/^https?:\/\/.+/.test(formData.deck_url)) {
          newErrors.deck_url = 'Invalid URL format';
        }
        break;
      case 4: // Fundraising
        if (!formData.fundraising_target_eur || parseFloat(formData.fundraising_target_eur) <= 0) {
          newErrors.fundraising_target_eur = 'Fundraising target is required';
        }
        if (!formData.offering_equity_percent || parseFloat(formData.offering_equity_percent) <= 0 || parseFloat(formData.offering_equity_percent) > 100) {
          newErrors.offering_equity_percent = 'Valid equity percentage is required (1-100)';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/');
      return;
    }
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    // Final validation
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
        return;
      }
    }

    const appId = submitApplication({
      startup_name: formData.startup_name,
      website: formData.website || undefined,
      country: formData.country,
      industry: formData.industry,
      stage: formData.stage as 'pre-seed' | 'seed' | 'series-a',
      founding_year: formData.founding_year ? parseInt(formData.founding_year) : undefined,
      team_size: formData.team_size ? parseInt(formData.team_size) : undefined,
      contact_email: formData.contact_email,
      founders: formData.founders.filter(f => f.name.trim()),
      pitch_summary: formData.pitch_summary,
      problem: formData.problem,
      solution: formData.solution,
      traction: formData.traction || undefined,
      deck_url: formData.deck_url,
      demo_url: formData.demo_url || undefined,
      data_room_url: formData.data_room_url || undefined,
      fundraising_target_eur: parseFloat(formData.fundraising_target_eur),
      offering_equity_percent: parseFloat(formData.offering_equity_percent),
      valuation_pre_money_eur: formData.valuation_pre_money_eur ? parseFloat(formData.valuation_pre_money_eur) : undefined,
      use_of_funds: formData.use_of_funds.filter(u => u.trim()),
    });

    localStorage.removeItem(DRAFT_KEY);
    setSubmittedAppId(appId);
  };

  if (submittedAppId) {
    return <ApplicationSuccess applicationId={submittedAppId} onBackHome={() => navigate('/')} />;
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            VaultCapital
          </Link>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </header>

      <main className="container max-w-3xl py-8">
        {/* Draft Banner */}
        {showDraftBanner && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="flex items-center justify-between p-4">
              <p className="text-sm">You have a saved draft. Would you like to resume?</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleResumeDraft}>Resume</Button>
                <Button size="sm" variant="outline" onClick={handleStartFresh}>Start Fresh</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Startup Application</h1>
          <p className="mt-2 text-muted-foreground">
            Apply to collaborate with VaultCapital. Demo: no submission is real.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">{STEPS[currentStep].title}</span>
            <span className="text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="mt-3 flex justify-between">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'border-2 border-primary text-primary'
                      : 'border border-muted-foreground/30'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-1 hidden text-xs sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep].title}</CardTitle>
            <CardDescription>{STEPS[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <FormStepBasics data={formData} updateData={updateFormData} errors={errors} />
            )}
            {currentStep === 1 && (
              <FormStepTeam data={formData} updateData={updateFormData} errors={errors} />
            )}
            {currentStep === 2 && (
              <FormStepPitch data={formData} updateData={updateFormData} errors={errors} />
            )}
            {currentStep === 3 && (
              <FormStepMaterials data={formData} updateData={updateFormData} errors={errors} />
            )}
            {currentStep === 4 && (
              <FormStepFundraising data={formData} updateData={updateFormData} errors={errors} />
            )}
            {currentStep === 5 && (
              <FormStepReview data={formData} onSubmit={handleSubmit} />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 0 ? 'Home' : 'Back'}
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default ApplyPage;
