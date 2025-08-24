import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useOwnerCongrats } from '@/hooks/useOwnerCongrats';
import { OwnerCongrats } from '@/components/OwnerCongrats';
import { getOrCreateProfile } from '@/lib/getOrCreateProfile';

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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { show, acknowledge } = useOwnerCongrats();

  useEffect(() => {
    let mounted = true;
    // Timeout fail-safe - never load forever
    const timer = setTimeout(() => mounted && setLoading(false), 6000);

    (async () => {
      try {
        // Get session
        const { data: sessionRes } = await supabase.auth.getSession();
        const currentUser = sessionRes?.session?.user;
        
        if (!mounted) return;
        setUser(currentUser);

        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Get or create profile with fail-safe
        const profileData = await getOrCreateProfile();
        if (!mounted) return;
        
        setProfile(profileData);
      } catch (error) {
        console.error("MyFixcoLayout error:", error);
        // Still allow rendering with partial data
      } finally {
        if (mounted) setLoading(false);
        clearTimeout(timer);
      }
    })();

    return () => { 
      mounted = false; 
      clearTimeout(timer);
    };
  }, []);

  if (loading) return <PageSkeleton />;
  if (!user) return <LoginRequired />;

  // Redirect OWNER users to admin panel
  if (profile?.role === 'owner') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Outlet />
        </div>
      </div>
      <OwnerCongrats open={show} onClose={acknowledge} />
    </div>
  );
};

export default MyFixcoLayout;