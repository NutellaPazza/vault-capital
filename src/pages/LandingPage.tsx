import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import ReturnSimulator from '@/components/landing/ReturnSimulator';
import AboutSection from '@/components/landing/AboutSection';
import FaqSection from '@/components/landing/FaqSection';
import StartupCta from '@/components/landing/StartupCta';
import RiskDisclaimer from '@/components/landing/RiskDisclaimer';

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HowItWorks />
      <ReturnSimulator />
      <AboutSection />
      <StartupCta />
      <FaqSection />
      <RiskDisclaimer />

      {/* Final CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Investing?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Join a growing community of investors accessing private startup deals from just €100.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container">
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 VaultCapital</span>
            <span>•</span>
            <Link to="#" className="hover:text-foreground">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
