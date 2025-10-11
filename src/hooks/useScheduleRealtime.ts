import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useScheduleRealtime(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('schedule-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs'
      }, onChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'job_locks'
      }, onChange)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'job_schedule_notifications'
      }, onChange)
      .subscribe();
    
    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [onChange]);
}
