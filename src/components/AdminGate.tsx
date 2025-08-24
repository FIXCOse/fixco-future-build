import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';

const AdminGate = () => {
  const { isAdmin, loading } = useAdmin();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Verifierar behörighet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/mitt-fixco" replace />;
  }

  return <Outlet />;
};

export default AdminGate;