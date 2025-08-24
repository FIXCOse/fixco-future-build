import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateProfile } from '@/lib/getOrCreateProfile';
import { useState, useEffect } from 'react';
import { OwnerCongrats } from '@/components/OwnerCongrats';
import { useOwnerCongrats } from '@/hooks/useOwnerCongrats';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useRoleGate } from '@/hooks/useRoleGate';
import AdminDashboardContent from '@/components/AdminDashboardContent';
import SalesOverview from '@/components/SalesOverview';

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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { show, acknowledge } = useOwnerCongrats();
  const { role, loading: authLoading } = useAuthProfile();
  const { shouldUseAdminLayout } = useRoleGate();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (session?.user) {
          setUser(session.user);
          const userProfile = await getOrCreateProfile();
          if (mounted) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        if (mounted) {
          // Add a small delay to prevent flashing
          setTimeout(() => setLoading(false), 500);
        }
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, []);

  // Removed automatic redirect to new admin interface

  if (loading || authLoading) {
    return <PageSkeleton />;
  }

  if (!user) {
    return <LoginRequired />;
  }

  // Check if user is admin/owner and on main mitt-fixco route
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';
  const isMainRoute = location.pathname === '/mitt-fixco';
  
  // If admin/owner and on main route, show tabbed interface (legacy support)
  if (isAdmin && isMainRoute) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Översikt</TabsTrigger>
                <TabsTrigger value="administration">Administration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <SalesOverview />
              </TabsContent>
              
              <TabsContent value="administration" className="mt-6">
                <AdminDashboardContent />
              </TabsContent>
            </Tabs>
            
            {show && <OwnerCongrats open={show} onClose={acknowledge} />}
          </div>
        </div>
      </div>
    );
  }

  // Regular layout for all other pages
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Outlet />
          {show && <OwnerCongrats open={show} onClose={acknowledge} />}
        </div>
      </div>
    </div>
  );
};

export default MyFixcoLayout;