import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  Activity, 
  Calendar, 
  FileText, 
  CreditCard, 
  User, 
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ActivityEvent {
  id: string;
  event_type: string;
  event_data: any;
  created_at: string;
  user_id: string;
}

const ActivityPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadActivity();
      setupRealtime();
    }
  }, [user?.id]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading activity:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda aktivitet",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('activity-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${user!.id}`
        },
        (payload) => {
          setEvents(prev => [payload.new as ActivityEvent, ...prev.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'booking_created':
      case 'booking_updated':
        return <Calendar className="h-4 w-4" />;
      case 'invoice_sent':
      case 'invoice_paid':
        return <CreditCard className="h-4 w-4" />;
      case 'quote_sent':
      case 'quote_accepted':
        return <FileText className="h-4 w-4" />;
      case 'profile_updated':
        return <User className="h-4 w-4" />;
      case 'property_added':
      case 'property_updated':
        return <Home className="h-4 w-4" />;
      case 'booking_completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'booking_cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'booking_completed':
      case 'invoice_paid':
      case 'quote_accepted':
        return 'text-green-600 bg-green-100';
      case 'booking_cancelled':
        return 'text-red-600 bg-red-100';
      case 'booking_created':
      case 'property_added':
        return 'text-blue-600 bg-blue-100';
      case 'invoice_sent':
      case 'quote_sent':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatEventDescription = (event: ActivityEvent) => {
    const { event_type, event_data } = event;
    
    switch (event_type) {
      case 'booking_created':
        return `Bokning skapad för ${event_data?.service_name || 'okänd tjänst'}`;
      case 'booking_updated':
        return `Bokning uppdaterad: ${event_data?.service_name || 'okänd tjänst'}`;
      case 'booking_completed':
        return `Bokning slutförd: ${event_data?.service_name || 'okänd tjänst'}`;
      case 'booking_cancelled':
        return `Bokning avbruten: ${event_data?.service_name || 'okänd tjänst'}`;
      case 'invoice_sent':
        return `Faktura skickad: ${event_data?.invoice_number || 'okänt nummer'}`;
      case 'invoice_paid':
        return `Faktura betald: ${event_data?.invoice_number || 'okänt nummer'}`;
      case 'quote_sent':
        return `Offert skickad för ${event_data?.title || 'okänd tjänst'}`;
      case 'quote_accepted':
        return `Offert accepterad: ${event_data?.title || 'okänd tjänst'}`;
      case 'profile_updated':
        return 'Profil uppdaterad';
      case 'property_added':
        return `Fastighet tillagd: ${event_data?.name || event_data?.address || 'okänd adress'}`;
      case 'property_updated':
        return `Fastighet uppdaterad: ${event_data?.name || event_data?.address || 'okänd adress'}`;
      default:
        return `Aktivitet: ${event_type}`;
    }
  };

  const getEventStatus = (event: ActivityEvent) => {
    const { event_type, event_data } = event;
    
    switch (event_type) {
      case 'booking_created':
        return { label: 'Skapad', variant: 'secondary' as const };
      case 'booking_completed':
        return { label: 'Slutförd', variant: 'default' as const };
      case 'booking_cancelled':
        return { label: 'Avbruten', variant: 'destructive' as const };
      case 'invoice_paid':
        return { label: 'Betald', variant: 'default' as const };
      case 'invoice_sent':
        return { label: 'Skickad', variant: 'secondary' as const };
      case 'quote_accepted':
        return { label: 'Accepterad', variant: 'default' as const };
      case 'quote_sent':
        return { label: 'Skickad', variant: 'secondary' as const };
      default:
        return null;
    }
  };

  const filteredEvents = events.filter(event =>
    formatEventDescription(event).toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!profile) {
    return <div>Laddar...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Aktivitet | Mitt Fixco</title>
        <meta name="description" content="Se din senaste aktivitet och händelser" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <DashboardHeader profile={profile} />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Aktivitet</h2>
            <p className="text-muted-foreground">Se din senaste aktivitet och händelser</p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Sök aktivitet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Senaste aktivitet
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full mt-1" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {events.length === 0 ? 'Ingen aktivitet ännu' : 'Ingen matchande aktivitet'}
                </h3>
                <p className="text-muted-foreground">
                  {events.length === 0 
                    ? 'Din aktivitet kommer att visas här när du använder våra tjänster'
                    : 'Prova att ändra sökterm'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event, index) => {
                  const isToday = format(parseISO(event.created_at), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const isYesterday = format(parseISO(event.created_at), 'yyyy-MM-dd') === format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
                  
                  let dateDisplay;
                  if (isToday) {
                    dateDisplay = `Idag ${format(parseISO(event.created_at), 'HH:mm')}`;
                  } else if (isYesterday) {
                    dateDisplay = `Igår ${format(parseISO(event.created_at), 'HH:mm')}`;
                  } else {
                    dateDisplay = format(parseISO(event.created_at), 'd MMM HH:mm', { locale: sv });
                  }

                  const status = getEventStatus(event);

                  return (
                    <div key={event.id} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                      <div className={`p-2 rounded-full ${getEventColor(event.event_type)}`}>
                        {getEventIcon(event.event_type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {formatEventDescription(event)}
                          </p>
                          {status && (
                            <Badge variant={status.variant} className="ml-2">
                              {status.label}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{dateDisplay}</span>
                        </div>
                        {event.event_data && Object.keys(event.event_data).length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {event.event_data.amount && (
                              <span className="mr-3">
                                Belopp: {event.event_data.amount.toLocaleString('sv-SE')} kr
                              </span>
                            )}
                            {event.event_data.address && (
                              <span className="mr-3">
                                Adress: {event.event_data.address}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ActivityPage;