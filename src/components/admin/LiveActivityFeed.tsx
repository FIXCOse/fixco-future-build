import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, FileText, Receipt, CreditCard, 
  User, CheckCircle, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ActivityEvent {
  id: string;
  occurred_at: string;
  event_type: string;
  summary: string;
  metadata?: any;
}

const getEventIcon = (eventType: string) => {
  if (eventType.includes('booking')) return Calendar;
  if (eventType.includes('quote')) return FileText;
  if (eventType.includes('invoice')) return Receipt;
  if (eventType.includes('payment')) return CreditCard;
  if (eventType.includes('profile')) return User;
  return CheckCircle;
};

const getEventBadgeVariant = (eventType: string) => {
  if (eventType.includes('created')) return 'default' as const;
  if (eventType.includes('sent')) return 'secondary' as const;
  if (eventType.includes('paid') || eventType.includes('accepted')) return 'default' as const;
  if (eventType.includes('rejected') || eventType.includes('overdue')) return 'destructive' as const;
  return 'secondary' as const;
};

export const LiveActivityFeed = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Senaste aktivitet
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getEventIcon(activity.event_type);
              const variant = getEventBadgeVariant(activity.event_type);
              
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.summary}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={variant} className="text-xs">
                        {activity.event_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.occurred_at), { 
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
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ingen aktivitet att visa</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};