import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useQuotesRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('quotes_new-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'quotes_new' 
        },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}