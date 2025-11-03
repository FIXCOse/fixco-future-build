import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useJobRequestsRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('job-requests-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'job_requests' 
        },
        () => {
          console.log('Job request change detected - reloading data');
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
