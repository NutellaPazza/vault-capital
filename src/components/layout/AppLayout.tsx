import { Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationToasts } from '@/hooks/useNotificationToasts';
import { Button } from '@/components/ui/button';
import { FlaskConical, X } from 'lucide-react';

export const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated, demoMode, exitDemoMode } = useAppStore();
  const { loading } = useAuth();
  useNotificationToasts();

  const isPublicPage = ['/', '/login', '/signup', '/terms', '/regulatory', '/about', '/how-it-works', '/faq'].includes(location.pathname);
  const showBottomNav = !isPublicPage && isAuthenticated;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isPublicPage && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {demoMode && (
        <div className="sticky top-0 z-50 w-full border-b border-primary/30 bg-primary/10 px-4 py-2 text-xs sm:text-sm">
          <div className="container flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-foreground">
              <FlaskConical className="h-4 w-4 text-primary" />
              <span><strong>Demo mode</strong> — exploring with sample data. Nothing here is real.</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="default" className="h-7 px-3">
                <Link to="/signup" onClick={exitDemoMode}>Create account</Link>
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={exitDemoMode} aria-label="Exit demo">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <TopBar />
      <main className={showBottomNav ? 'pb-20' : ''}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};
