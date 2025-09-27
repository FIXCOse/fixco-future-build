import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LocaleProvider } from '@/components/LocaleProvider';
import { CopyProvider } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';

const AdminLayout = () => {
  const { currentLanguage } = useLanguagePersistence();
  
  return (
    <LocaleProvider locale={currentLanguage}>
      <CopyProvider locale={currentLanguage}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="pt-[calc(64px+1.5rem)] md:pt-[calc(64px+1.5rem)]">
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
      </CopyProvider>
    </LocaleProvider>
  );
};

export default AdminLayout;