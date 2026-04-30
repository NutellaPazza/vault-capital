import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { useAppStore } from '@/store/appStore';
import { useNotificationToasts } from '@/hooks/useNotificationToasts';

export const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAppStore();
  useNotificationToasts();

  const isPublicPage = ['/', '/login', '/signup', '/terms', '/regulatory', '/about', '/how-it-works', '/faq'].includes(location.pathname);
  const showBottomNav = !isPublicPage && isAuthenticated;

  // Redirect unauthenticated users from protected pages
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
