import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-[calc(64px+2rem)] md:pt-[calc(64px+2rem)]">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;