import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'owner' | 'admin' | 'worker' | 'customer';

export function useRole() {
  const queryClient = useQueryClient();
  
  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        return null;
      }

      return data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute (reduced from 5 for faster updates)
    refetchOnMount: 'always', // Always refetch when component mounts
    retry: false
  });

  // Lyssna på auth changes och invalidera role-query
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    });
    
    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Get primary role (highest privilege)
  const roles = userRoles?.map(r => r.role) || [];
  const role: UserRole = 
    roles.includes('owner') ? 'owner' :
    roles.includes('admin') ? 'admin' :
    roles.includes('worker') ? 'worker' :
    'customer';
  
  const isAdmin = roles.includes('admin') || roles.includes('owner');
  const isOwner = roles.includes('owner');
  const isWorker = roles.includes('worker');
  const isStaff = roles.some(r => ['owner', 'admin', 'worker'].includes(r));
  
  return {
    role,
    loading: isLoading,
    isAdmin,
    isOwner,
    isWorker,
    isStaff,
    isCustomer: role === 'customer'
  };
}