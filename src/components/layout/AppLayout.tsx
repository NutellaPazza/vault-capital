import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationToasts } from '@/hooks/useNotificationToasts';

export const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAppStore();
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
      <TopBar />
      <main className={showBottomNav ? 'pb-20' : ''}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};
