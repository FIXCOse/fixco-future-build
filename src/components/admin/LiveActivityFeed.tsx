import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, FileText, Receipt, CreditCard, 
  User, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ActivityEvent {
  id: string;
  created_at: string;
  type: string;
  summary: string;
  payload: any;
}

const getEventIcon = (type: string) => {
  if (type.includes('booking')) return Calendar;
  if (type.includes('quote')) return FileText;
  if (type.includes('invoice')) return Receipt;
  if (type.includes('payment')) return CreditCard;
  if (type.includes('profile')) return User;
  return CheckCircle;
};

const getEventBadgeVariant = (type: string) => {
  if (type.includes('created')) return 'default';
  if (type.includes('sent')) return 'secondary';
  if (type.includes('paid') || type.includes('accepted')) return 'default';
  if (type.includes('rejected') || type.includes('overdue')) return 'destructive';
  return 'secondary';
};

export const LiveActivityFeed = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error loading events:', error);
          return;
        }

        const formattedEvents = (data || []).map(event => ({
          id: event.id,
          created_at: event.created_at,
          type: event.type || event.event_type || 'unknown',
          summary: event.summary || 'Händelse',
          payload: event.payload || event.event_data || {}
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('New event:', payload);
          setEvents(current => [payload.new as ActivityEvent, ...current.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Senaste aktivitet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Senaste aktivitet
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ingen aktivitet än</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const Icon = getEventIcon(event.type);
              const variant = getEventBadgeVariant(event.type);
              
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{event.summary}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={variant} className="text-xs">
                        {event.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.created_at), { 
                          addSuffix: true,
                          locale: sv 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};