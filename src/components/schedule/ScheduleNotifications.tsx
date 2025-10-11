import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { fetchScheduleNotifications, markNotificationRead, type ScheduleNotification } from '@/lib/api/schedule';
import { toast } from 'sonner';

export function ScheduleNotifications() {
  const [notifications, setNotifications] = useState<ScheduleNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await fetchScheduleNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    setLoading(true);
    try {
      await markNotificationRead(id);
      await loadNotifications();
      toast.success('Notifikation markerad som läst');
    } catch (error) {
      toast.error('Kunde inte markera notifikation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Schemanotifikationer</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga nya notifikationer</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="border rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium">
                    {notif.jobs?.title || 'Jobb schemalagt'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(notif.scheduled_at), "d MMM 'kl' HH:mm", { locale: sv })}
                  </p>
                  {notif.jobs?.address && (
                    <p className="text-xs text-muted-foreground">{notif.jobs.address}</p>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => handleMarkRead(notif.id)}
                    disabled={loading}
                  >
                    Markera som läst
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
