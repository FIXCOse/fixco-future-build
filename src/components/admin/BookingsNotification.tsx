import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function BookingsNotification() {
  // Hämta antal OSEDDA nya bokningar
  const { data: unseenCount = 0 } = useQuery({
    queryKey: ['unseen-bookings-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')
        .is('seen_at', null)
        .is('deleted_at', null);
      
      if (error) {
        console.error('Error fetching unseen bookings:', error);
        throw error;
      }
      return count || 0;
    },
    refetchInterval: 30000,
  });

  // Hämta de senaste osedda bokningarna
  const { data: recentBookings = [] } = useQuery({
    queryKey: ['recent-unseen-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, service_slug, payload, mode, created_at')
        .eq('status', 'new')
        .is('seen_at', null)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching recent bookings:', error);
        throw error;
      }
      return data || [];
    },
    refetchInterval: 30000,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <FileText className="h-5 w-5" />
          {unseenCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unseenCount > 9 ? '9+' : unseenCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nya förfrågningar</h3>
            {unseenCount > 0 && (
              <Badge variant="destructive">{unseenCount} nya</Badge>
            )}
          </div>
          
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking: any) => {
                const payload = booking.payload || {};
                const customerName = payload.name || payload.contact_name || 'Okänd kund';
                const serviceName = payload.service_name || booking.service_slug || 'Tjänst';
                const isHomeVisit = booking.mode === 'home_visit';
                
                return (
                  <div key={booking.id} className="text-sm space-y-1 border-b border-border pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground line-clamp-1">{serviceName}</p>
                      {isHomeVisit && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">🏠</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {customerName} • {new Date(booking.created_at).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Inga nya förfrågningar</p>
          )}
          
          <Link to="/admin/quotes?tab=requests" className="block">
            <Button variant="outline" size="sm" className="w-full">
              Visa alla förfrågningar
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
