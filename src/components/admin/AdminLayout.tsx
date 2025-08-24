import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Back to Overview Button */}
          <div className="mb-4">
            <Link to="/mitt-fixco">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Till Admin-översikt
              </Button>
            </Link>
          </div>
          
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;