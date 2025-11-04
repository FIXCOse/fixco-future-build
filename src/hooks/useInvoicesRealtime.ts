import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useInvoicesRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('invoices-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices' 
        },
        () => {
          console.log('Invoice change detected - reloading data');
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
