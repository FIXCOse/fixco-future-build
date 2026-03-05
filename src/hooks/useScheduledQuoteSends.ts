import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ScheduledSend = {
  id: string;
  quote_id: string;
  scheduled_for: string;
  executed: boolean;
  executed_at: string | null;
  cancelled: boolean;
  created_by: string | null;
  created_at: string;
};

export function useScheduledQuoteSends(quoteId?: string) {
  const queryClient = useQueryClient();

  const { data: scheduledSends = [], isLoading } = useQuery({
    queryKey: ['scheduled-quote-sends', quoteId],
    queryFn: async () => {
      let query = supabase
        .from('scheduled_quote_sends')
        .select('*')
        .eq('cancelled', false)
        .eq('executed', false)
        .order('scheduled_for', { ascending: true });

      if (quoteId) {
        query = query.eq('quote_id', quoteId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as ScheduledSend[];
    },
    enabled: !!quoteId,
  });

  const scheduleMutation = useMutation({
    mutationFn: async ({ quoteId, scheduledFor }: { quoteId: string; scheduledFor: Date }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('scheduled_quote_sends')
        .insert({
          quote_id: quoteId,
          scheduled_for: scheduledFor.toISOString(),
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Utskick schemalagt!');
      queryClient.invalidateQueries({ queryKey: ['scheduled-quote-sends'] });
    },
    onError: (error: any) => {
      toast.error('Kunde inte schemalägga: ' + error.message);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (sendId: string) => {
      const { error } = await supabase
        .from('scheduled_quote_sends')
        .update({ cancelled: true })
        .eq('id', sendId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Schemalagt utskick avbrutet');
      queryClient.invalidateQueries({ queryKey: ['scheduled-quote-sends'] });
    },
    onError: (error: any) => {
      toast.error('Kunde inte avbryta: ' + error.message);
    },
  });

  return {
    scheduledSends,
    isLoading,
    schedule: scheduleMutation.mutate,
    cancel: cancelMutation.mutate,
    isScheduling: scheduleMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
