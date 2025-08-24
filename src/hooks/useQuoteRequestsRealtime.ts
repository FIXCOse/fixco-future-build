import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useQuoteRequestsRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('rt-quotes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'quote_requests' 
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