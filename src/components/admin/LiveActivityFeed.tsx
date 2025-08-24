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
  created_at: string;
  type: string;
  summary: string;
}

const mockEvents: ActivityEvent[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'system_started',
    summary: 'Admin-systemet startat'
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'booking_created',
    summary: 'Ny bokning från John Doe'
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'quote_sent',
    summary: 'Offert skickad till kund'
  }
];

const getEventIcon = (type: string) => {
  if (type.includes('booking')) return Calendar;
  if (type.includes('quote')) return FileText;
  if (type.includes('invoice')) return Receipt;
  if (type.includes('payment')) return CreditCard;
  if (type.includes('profile')) return User;
  return CheckCircle;
};

const getEventBadgeVariant = (type: string) => {
  if (type.includes('created')) return 'default' as const;
  if (type.includes('sent')) return 'secondary' as const;
  if (type.includes('paid') || type.includes('accepted')) return 'default' as const;
  if (type.includes('rejected') || type.includes('overdue')) return 'destructive' as const;
  return 'secondary' as const;
};

export const LiveActivityFeed = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Senaste aktivitet
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mockEvents.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ingen aktivitet än</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockEvents.map((event) => {
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