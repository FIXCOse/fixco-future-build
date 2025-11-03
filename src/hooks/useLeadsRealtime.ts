import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useLeadsRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'leads' 
        },
        () => {
          console.log('Lead change detected - reloading data');
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
