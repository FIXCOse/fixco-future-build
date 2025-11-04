import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { 
  FileText, 
  CheckCircle, 
  UserPlus, 
  Briefcase,
  Receipt,
  MessageSquare
} from 'lucide-react';

export function DashboardActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['dashboard-activity-feed'],
    queryFn: async () => {
      const { data: auditLogs } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      return auditLogs?.map((log) => {
        const meta = log.meta as any || {};
        return {
          id: log.id,
          action: log.action,
          description: getActivityDescription(log.action, meta),
          timestamp: log.created_at,
          icon: getActivityIcon(log.action),
          type: getActivityType(log.action),
        };
      }) || [];
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
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
        <CardTitle>Senaste aktivitet</CardTitle>
        <CardDescription>Realtidsuppdateringar från systemet</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getActivityBg(activity.type)}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { 
                      addSuffix: true,
                      locale: sv 
                    })}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getActivityDescription(action: string, meta: any): string {
  switch (action) {
    case 'quote_accepted':
      return `Offert ${meta.quote_number || 'accepterad'}`;
    case 'quote_created':
      return `Ny offert skapad`;
    case 'job_assigned':
      return `Jobb tilldelat ${meta.worker_name || 'worker'}`;
    case 'invoice_sent':
      return `Faktura ${meta.invoice_number || ''} skickad`;
    case 'user_created':
      return `Ny kund registrerad`;
    case 'quote_question':
      return `Ny fråga på offert`;
    default:
      return action;
  }
}

function getActivityIcon(action: string) {
  switch (action) {
    case 'quote_accepted':
      return CheckCircle;
    case 'quote_created':
      return FileText;
    case 'job_assigned':
      return Briefcase;
    case 'invoice_sent':
      return Receipt;
    case 'user_created':
      return UserPlus;
    case 'quote_question':
      return MessageSquare;
    default:
      return FileText;
  }
}

function getActivityType(action: string): string {
  if (action.includes('quote')) return 'Offert';
  if (action.includes('job')) return 'Jobb';
  if (action.includes('invoice')) return 'Faktura';
  if (action.includes('user')) return 'Kund';
  return 'System';
}

function getActivityBg(type: string): string {
  switch (type) {
    case 'Offert':
      return 'bg-blue-500/10 text-blue-500';
    case 'Jobb':
      return 'bg-green-500/10 text-green-500';
    case 'Faktura':
      return 'bg-purple-500/10 text-purple-500';
    case 'Kund':
      return 'bg-orange-500/10 text-orange-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
}
