import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LocaleProvider } from '@/components/LocaleProvider';
import { CopyProvider } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import QuoteQuestionsNotification from './QuoteQuestionsNotification';

const AdminLayout = () => {
  const { currentLanguage } = useLanguagePersistence();
  const [notifications, setNotifications] = useState<any>({ counts: { total: 0 }, notifications: [] });
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('viewedNotifications');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await supabase.functions.invoke('get-admin-notifications');
        if (data) {
          // Filter out viewed notifications
          const filteredNotifications = data.notifications.filter(
            (notif: any) => !viewedNotifications.has(notif.id)
          );
          setNotifications({
            ...data,
            notifications: filteredNotifications
          });
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [viewedNotifications]);

  const markAsViewed = (notificationId: string) => {
    const newViewed = new Set(viewedNotifications);
    newViewed.add(notificationId);
    setViewedNotifications(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
  };
  
  return (
    <LocaleProvider locale={currentLanguage}>
      <CopyProvider locale={currentLanguage}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="pt-[calc(64px+1.5rem)] md:pt-[calc(64px+1.5rem)]">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {/* Back and Notifications */}
              <div className="mb-4 flex items-center justify-between">
                <Link to="/mitt-fixco">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Till Admin-översikt
                  </Button>
                </Link>
                
                <div className="flex items-center gap-2">
                  {/* Offertfrågor notifikation */}
                  <QuoteQuestionsNotification />
                  
                  {/* Accepterade offerter/projekt notifikation */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5" />
                        {notifications.notifications && notifications.notifications.length > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                          >
                            {notifications.notifications.length > 9 ? '9+' : notifications.notifications.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold">Notifikationer</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.notifications.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            Inga notifikationer
                          </div>
                        ) : (
                          notifications.notifications.map((notif: any, idx: number) => (
                            <Link 
                              key={idx} 
                              to={notif.link}
                              onClick={() => markAsViewed(notif.id)}
                              className="block p-4 hover:bg-muted border-b last:border-b-0"
                            >
                              <p className="text-sm font-medium">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {notif.number} • {new Date(notif.timestamp).toLocaleDateString('sv-SE')}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
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