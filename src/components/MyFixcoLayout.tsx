import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { OwnerCongrats } from '@/components/OwnerCongrats';
import { useOwnerCongrats } from '@/hooks/useOwnerCongrats';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useRoleGate } from '@/hooks/useRoleGate';
import AdminDashboardContent from '@/components/AdminDashboardContent';
import SalesOverview from '@/components/SalesOverview';
import { LocaleProvider } from '@/components/LocaleProvider';
import { CopyProvider } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';

const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-16 bg-background/80 border-b border-border" />
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-8 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  </div>
);

const LoginRequired = () => <Navigate to="/auth" replace />;

const MyFixcoLayout = () => {
  const [user, setUser] = useState(null);
  const { show, acknowledge } = useOwnerCongrats();
  const { profile, loading: authLoading } = useAuthProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguagePersistence();

  useEffect(() => {
    let mounted = true;
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session?.user) {
        setUser(session.user);
      }
    };

    checkSession();
    return () => { mounted = false; };
  }, []);

  // Check if user is admin/owner/worker based on profile from useAuthProfile
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';
  const isWorker = profile?.role === 'worker';

  // Redirect admin/owner users to admin dashboard, workers to worker dashboard
  useEffect(() => {
    if (authLoading) return;
    
    // Only redirect from /mitt-fixco to correct dashboard
    if (location.pathname !== '/mitt-fixco') return;
    
    if (!profile) return;
    
    if (isAdmin) {
      navigate('/admin', { replace: true });
    } else if (isWorker) {
      navigate('/worker', { replace: true });
    }
  }, [authLoading, profile, isAdmin, isWorker, location.pathname, navigate]);

  if (authLoading) {
    return <PageSkeleton />;
  }

  if (!user) {
    return <LoginRequired />;
  }

  // Regular layout for all other pages
  return (
    <LocaleProvider locale={currentLanguage}>
      <CopyProvider locale={currentLanguage}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="pt-[calc(64px+2rem)] md:pt-[calc(64px+2rem)]">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <Outlet />
              {show && <OwnerCongrats open={show} onClose={acknowledge} />}
            </div>
          </div>
        </div>
      </CopyProvider>
    </LocaleProvider>
  );
};

export default MyFixcoLayout;