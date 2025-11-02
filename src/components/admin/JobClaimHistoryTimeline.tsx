import { useState, useEffect } from 'react';
import { fetchJobClaimHistory, type JobClaimEvent } from '@/lib/api/schedule';
import { Hand, RotateCcw, CheckCircle, UserPlus, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface JobClaimHistoryTimelineProps {
  jobId: string;
}

export function JobClaimHistoryTimeline({ jobId }: JobClaimHistoryTimelineProps) {
  const [history, setHistory] = useState<JobClaimEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchJobClaimHistory(jobId)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobId]);

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'job.claimed': return <Hand className="w-4 h-4 text-blue-500" />;
      case 'job.returned_to_pool': return <RotateCcw className="w-4 h-4 text-orange-500" />;
      case 'job.completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'job.assigned': return <UserPlus className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventText = (event: JobClaimEvent) => {
    switch (event.event) {
      case 'job.claimed':
        return 'Claimade jobbet från poolen';
      case 'job.returned_to_pool':
        const reason = event.meta?.reason || 'unspecified';
        const reasonText = event.meta?.reason_text;
        return `Returnerade till pool (${reason})${reasonText ? `: ${reasonText}` : ''}`;
      case 'job.completed':
        return 'Slutförde jobbet';
      case 'job.assigned':
        return 'Tilldelades av admin';
      default:
        return event.event;
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'job.claimed': return 'text-blue-700 bg-blue-50';
      case 'job.returned_to_pool': return 'text-orange-700 bg-orange-50';
      case 'job.completed': return 'text-green-700 bg-green-50';
      case 'job.assigned': return 'text-purple-700 bg-purple-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Claim History</h3>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Ingen historik tillgänglig
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Claim History</h3>
      <div className="space-y-3">
        {history.map((event, i) => (
          <div key={event.id} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              {getEventIcon(event.event)}
              {i < history.length - 1 && <div className="w-0.5 h-12 bg-border mt-1" />}
            </div>
            <div className={`flex-1 rounded-lg p-3 ${getEventColor(event.event)}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium">
                  {event.profiles?.first_name} {event.profiles?.last_name}
                </p>
                <Badge variant="outline" className="text-xs">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: sv })}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {getEventText(event)}
              </p>
              {event.meta?.time_held_minutes && (
                <p className="text-xs text-muted-foreground mt-1">
                  Höll jobbet i {Math.round(event.meta.time_held_minutes)} minuter
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
