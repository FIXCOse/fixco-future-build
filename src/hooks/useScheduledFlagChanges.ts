import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduledFlagChange {
  id: string;
  flag_key: string;
  target_enabled: boolean;
  scheduled_for: string;
  reason: string | null;
  scheduled_by: string | null;
  created_at: string;
  executed: boolean;
  executed_at: string | null;
  cancelled: boolean;
  cancelled_at: string | null;
}

export function useScheduledFlagChanges() {
  return useQuery({
    queryKey: ['scheduled-flag-changes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_feature_flag_changes')
        .select('*')
        .eq('executed', false)
        .eq('cancelled', false)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data as ScheduledFlagChange[];
    },
  });
}

export function useCreateScheduledChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (change: {
      flag_key: string;
      target_enabled: boolean;
      scheduled_for: string;
      reason?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('scheduled_feature_flag_changes')
        .insert({
          ...change,
          scheduled_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-flag-changes'] });
    },
  });
}

export function useCancelScheduledChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (changeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('scheduled_feature_flag_changes')
        .update({
          cancelled: true,
          cancelled_at: new Date().toISOString(),
          cancelled_by: user?.id,
        })
        .eq('id', changeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-flag-changes'] });
    },
  });
}
