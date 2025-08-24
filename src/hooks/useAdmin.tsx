import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserRole {
  role: 'owner' | 'admin' | 'staff' | 'customer';
}

export function useAdmin() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('customer'); // Default fallback
        } else {
          setRole(data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('customer'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const isAdmin = role === 'admin' || role === 'owner';
  const isOwner = role === 'owner';
  const isStaff = role === 'staff' || isAdmin;

  return {
    role,
    loading,
    isAdmin,
    isOwner,
    isStaff,
    isCustomer: role === 'customer',
  };
}