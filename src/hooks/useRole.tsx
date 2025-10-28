import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'owner' | 'admin' | 'manager' | 'worker' | 'technician' | 'finance' | 'support' | 'customer';

export function useRole() {
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });

  // Get primary role (highest privilege)
  const roles = userRoles?.map(r => r.role) || [];
  const role: UserRole = 
    roles.includes('owner') ? 'owner' :
    roles.includes('admin') ? 'admin' :
    roles.includes('manager') ? 'manager' :
    roles.includes('technician') ? 'technician' :
    roles.includes('finance') ? 'finance' :
    roles.includes('support') ? 'support' :
    roles.includes('worker') ? 'worker' :
    'customer';
  
  const isAdmin = roles.includes('admin') || roles.includes('owner');
  const isOwner = roles.includes('owner');
  const isWorker = roles.includes('worker');
  const isStaff = ['owner', 'admin', 'manager', 'technician', 'finance', 'support'].some(r => roles.includes(r));
  
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