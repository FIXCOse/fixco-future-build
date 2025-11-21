import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWorkersData = () => {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchWorkers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            user_roles!inner(role)
          `)
          .eq('user_roles.role', 'worker')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setWorkers(data || []);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();

    // Setup realtime subscription for profiles
    const profilesChannel = supabase
      .channel('profiles-workers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchWorkers();
        }
      )
      .subscribe();

    // Setup realtime subscription for user_roles
    const rolesChannel = supabase
      .channel('user-roles-workers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        () => {
          fetchWorkers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(rolesChannel);
    };
  }, []);

  return { workers, loading };
};
