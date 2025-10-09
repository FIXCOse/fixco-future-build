import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useBookingsRealtime(onChange: () => void) {
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    
    try {
      channel = supabase
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
        .subscribe((status, err) => {
          if (err) {
            console.warn('Realtime subscription error (non-critical):', err.message);
          }
          if (status === 'SUBSCRIBED') {
            console.log('Bookings realtime connected');
          }
        });
    } catch (error) {
      console.warn('Could not establish realtime connection (non-critical):', error);
      // Non-critical: app still works without realtime updates
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel).catch(err => {
          console.warn('Error removing channel:', err);
        });
      }
    };
  }, [onChange]);
}