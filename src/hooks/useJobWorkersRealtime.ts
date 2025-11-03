import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useJobWorkersRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('job-workers-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_workers'
        },
        () => {
          console.log('Job worker change detected - reloading data');
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
