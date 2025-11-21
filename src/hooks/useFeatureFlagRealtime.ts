import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFeatureFlagRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔥 Feature Flag Realtime: Subscribing...');
    
    const channel = supabase
      .channel('feature-flags-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feature_flags'
      }, (payload) => {
        console.log('🔥 Feature flag changed:', payload);
        queryClient.refetchQueries({ queryKey: ['feature-flags'] });
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'feature-flag',
          refetchType: 'all'
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feature_flag_overrides'
      }, (payload) => {
        console.log('🔥 Feature flag override changed:', payload);
        queryClient.refetchQueries({ queryKey: ['feature-flag-overrides'] });
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'feature-flag',
          refetchType: 'all'
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'scheduled_feature_flag_changes'
      }, (payload) => {
        console.log('🔥 Scheduled change updated:', payload);
        queryClient.refetchQueries({ queryKey: ['scheduled-flag-changes'] });
      })
      .subscribe((status) => {
        console.log('🔥 Realtime subscription status:', status);
      });
    
    return () => { 
      console.log('🔥 Feature Flag Realtime: Unsubscribing...');
      supabase.removeChannel(channel); 
    };
  }, [queryClient]);
}
