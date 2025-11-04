import { Outlet } from 'react-router-dom';
import { LocaleProvider } from '@/components/LocaleProvider';
import { CopyProvider } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

const AdminLayout = () => {
  const { currentLanguage } = useLanguagePersistence();
  
  return (
    <LocaleProvider locale={currentLanguage}>
      <CopyProvider locale={currentLanguage}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            
            <SidebarInset className="flex flex-col">
              <AdminTopBar />
              
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto px-6 py-8 max-w-[1600px]">
                  <Outlet />
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </CopyProvider>
    </LocaleProvider>
  );
};

export default AdminLayout;