import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Check, Clock, Eye, Send, FileText, XCircle, AlertTriangle, RefreshCw, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import type { QuoteNewRow } from '@/lib/api/quotes-new';

type Props = {
  quote: QuoteNewRow;
  onRefresh: () => void;
};

type Step = {
  key: string;
  label: string;
  icon: React.ReactNode;
  timestamp: string | null | undefined;
  active: boolean;
  variant?: 'success' | 'danger' | 'warning' | 'default';
  badge?: string;
  tooltipContent?: React.ReactNode;
};

const formatTimestamp = (ts: string | null | undefined) => {
  if (!ts) return null;
  try {
    return format(new Date(ts), "d MMM yyyy 'kl.' HH:mm", { locale: sv });
  } catch {
    return null;
  }
};

export function QuoteStatusTimeline({ quote, onRefresh }: Props) {
  // Fetch all views for this quote
  const { data: views } = useQuery({
    queryKey: ['quote-views', quote.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_views')
        .select('viewed_at, ip_address, city, country')
        .eq('quote_id', quote.id)
        .order('viewed_at', { ascending: true }) as unknown as { data: { viewed_at: string; ip_address: string | null; city: string | null; country: string | null }[] | null; error: any };
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
  });

  const viewCount = views?.length || 0;
  const latestView = views && views.length > 0 ? views[views.length - 1].viewed_at : quote.viewed_at;
  const uniqueIps = views ? new Set(views.map(v => v.ip_address).filter(Boolean)).size : 0;

  const viewTooltip = viewCount > 0 ? (
    <div className="space-y-1">
      <p className="font-medium text-xs mb-1">
        Öppnad {viewCount} {viewCount === 1 ? 'gång' : 'gånger'}
        {uniqueIps > 0 && ` (${uniqueIps} ${uniqueIps === 1 ? 'unik IP' : 'unika IP:er'})`}
      </p>
      {views?.map((v, i) => {
        const geoLabel = [v.city, v.country].filter(Boolean).join(', ');
        return (
          <p key={i} className="text-[11px] text-muted-foreground">
            {formatTimestamp(v.viewed_at)}{v.ip_address ? ` — ${v.ip_address}` : ''}{geoLabel ? ` (${geoLabel})` : ''}
          </p>
        );
      })}
    </div>
  ) : undefined;

  const steps: Step[] = [
    {
      key: 'created',
      label: 'Skapad',
      icon: <FileText className="h-3.5 w-3.5" />,
      timestamp: quote.created_at,
      active: true,
    },
    {
      key: 'sent',
      label: 'Skickad',
      icon: <Send className="h-3.5 w-3.5" />,
      timestamp: quote.sent_at,
      active: !!quote.sent_at,
    },
    {
      key: 'viewed',
      label: 'Öppnad av kund',
      icon: <Eye className="h-3.5 w-3.5" />,
      timestamp: latestView,
      active: !!quote.viewed_at || viewCount > 0,
      badge: viewCount > 1 ? `${viewCount}×` : undefined,
      tooltipContent: viewTooltip,
    },
  ];

  // Add reminder step if reminder was sent
  const reminderSentAt = (quote as any).reminder_sent_at;
  if (reminderSentAt) {
    const viewsAfterReminder = views?.filter(v => new Date(v.viewed_at) > new Date(reminderSentAt)) || [];
    const afterCount = viewsAfterReminder.length;

    const reminderTooltip = (
      <div className="space-y-1">
        <p className="font-medium text-xs mb-1">
          Påminnelse skickad {formatTimestamp(reminderSentAt)}
        </p>
        {afterCount > 0 ? (
          <>
            <p className="text-xs text-green-600 font-medium">
              ✅ Kund öppnade offerten {afterCount} {afterCount === 1 ? 'gång' : 'gånger'} efter påminnelsen
            </p>
            {viewsAfterReminder.map((v, i) => {
              const geoLabel = [v.city, v.country].filter(Boolean).join(', ');
              return (
                <p key={i} className="text-[11px] text-muted-foreground">
                  {formatTimestamp(v.viewed_at)}{v.ip_address ? ` — ${v.ip_address}` : ''}{geoLabel ? ` (${geoLabel})` : ''}
                </p>
              );
            })}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Kunden har inte öppnat offerten efter påminnelsen ännu</p>
        )}
      </div>
    );

    steps.push({
      key: 'reminder',
      label: afterCount > 0 ? 'Påminnelse → Öppnad' : 'Påminnelse skickad',
      icon: afterCount > 0 ? <Eye className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />,
      timestamp: afterCount > 0 ? viewsAfterReminder[viewsAfterReminder.length - 1].viewed_at : reminderSentAt,
      active: true,
      variant: afterCount > 0 ? 'success' : 'warning',
      badge: afterCount > 0 ? `${afterCount}×` : undefined,
      tooltipContent: reminderTooltip,
    });
  }

  // Add final step based on outcome
  if (quote.declined_at) {
    steps.push({
      key: 'declined',
      label: 'Avböjd',
      icon: <XCircle className="h-3.5 w-3.5" />,
      timestamp: quote.declined_at,
      active: true,
      variant: 'danger',
    });
  } else if (quote.change_req_at) {
    steps.push({
      key: 'change_requested',
      label: 'Ändring begärd',
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      timestamp: quote.change_req_at,
      active: true,
      variant: 'warning',
    });
  } else if (quote.reaccept_requested_at && quote.status === 'pending_reaccept') {
    steps.push({
      key: 'reaccept',
      label: 'Ny acceptans begärd',
      icon: <RefreshCw className="h-3.5 w-3.5" />,
      timestamp: quote.reaccept_requested_at,
      active: true,
      variant: 'warning',
    });
  } else {
    steps.push({
      key: 'accepted',
      label: 'Accepterad',
      icon: <Check className="h-3.5 w-3.5" />,
      timestamp: quote.accepted_at,
      active: !!quote.accepted_at,
      variant: quote.accepted_at ? 'success' : 'default',
    });
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const now = new Date().toISOString();
      const updates: Record<string, any> = { status: newStatus };

      if (newStatus === 'sent' && !quote.sent_at) updates.sent_at = now;
      if (newStatus === 'viewed' && !quote.viewed_at) updates.viewed_at = now;
      if (newStatus === 'accepted' && !quote.accepted_at) updates.accepted_at = now;
      if (newStatus === 'declined' && !quote.declined_at) updates.declined_at = now;
      if (newStatus === 'change_requested' && !quote.change_req_at) updates.change_req_at = now;

      const { error } = await supabase
        .from('quotes_new')
        .update(updates)
        .eq('id', quote.id);

      if (error) throw error;
      toast.success('Status uppdaterad');
      onRefresh();
    } catch (err: any) {
      toast.error('Kunde inte uppdatera status: ' + err.message);
    }
  };

  const dotColor = (step: Step) => {
    if (!step.active) return 'bg-muted border-border text-muted-foreground';
    if (step.variant === 'danger') return 'bg-destructive border-destructive text-destructive-foreground';
    if (step.variant === 'warning') return 'bg-amber-500 border-amber-500 text-white';
    if (step.variant === 'success') return 'bg-green-600 border-green-600 text-white';
    return 'bg-primary border-primary text-primary-foreground';
  };

  const lineColor = (active: boolean) =>
    active ? 'bg-primary' : 'bg-border';

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Spårning</h4>
          <Select value={quote.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Utkast</SelectItem>
              <SelectItem value="sent">Skickad</SelectItem>
              <SelectItem value="viewed">Öppnad</SelectItem>
              <SelectItem value="accepted">Accepterad</SelectItem>
              <SelectItem value="declined">Avböjd</SelectItem>
              <SelectItem value="change_requested">Ändring begärd</SelectItem>
              <SelectItem value="expired">Utgången</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="flex items-start gap-0">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <div
                        className={cn(
                          'flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 cursor-default',
                          dotColor(step)
                        )}
                      >
                        {step.active ? step.icon : <Clock className="h-3.5 w-3.5" />}
                      </div>
                      {step.badge && (
                        <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {step.badge}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  {step.tooltipContent && (
                    <TooltipContent side="bottom" className="max-w-xs">
                      {step.tooltipContent}
                    </TooltipContent>
                  )}
                </Tooltip>
                <div className="mt-1.5 text-center px-1">
                  <p className={cn('text-xs font-medium leading-tight', !step.active && 'text-muted-foreground')}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {step.active && step.timestamp
                      ? formatTimestamp(step.timestamp)
                      : 'Väntar...'}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mt-3.5 mx-1',
                    lineColor(steps[i + 1]?.active)
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
