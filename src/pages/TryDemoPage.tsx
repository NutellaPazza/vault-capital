import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';

const TryDemoPage = () => {
  const navigate = useNavigate();
  const enterDemoMode = useAppStore(s => s.enterDemoMode);

  useEffect(() => {
    enterDemoMode();
    navigate('/dashboard', { replace: true });
  }, [enterDemoMode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
};

export default TryDemoPage;
