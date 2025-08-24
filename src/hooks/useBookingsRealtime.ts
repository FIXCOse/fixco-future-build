import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useBookingsRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
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