import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateProfile } from '@/lib/getOrCreateProfile';

export interface UserRole {
  role: 'owner' | 'admin' | 'staff' | 'customer';
}

export function useAdmin() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchRole = async () => {
      try {
        const profile = await getOrCreateProfile();
        if (!mounted) return;
        
        setRole(profile.role || 'customer');
      } catch (error) {
        console.error('Error fetching user role:', error);
        if (mounted) setRole('customer'); // Default fallback
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRole();

    return () => { mounted = false; };
  }, []);

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