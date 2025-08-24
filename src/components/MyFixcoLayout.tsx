import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';

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
  const { user, profile, loading } = useAuth();

  if (loading) return <PageSkeleton />;
  if (!user) return <LoginRequired />;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyFixcoLayout;