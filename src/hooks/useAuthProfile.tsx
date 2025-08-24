import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  user_type: 'private' | 'company' | 'brf';
  created_at: string;
  loyalty_points: number;
  total_spent: number;
}

export const useAuthProfile = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['auth-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, user_type, created_at, loyalty_points, total_spent')
        .eq('id', user.id)
        .single();

      return profileData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    profile,
    role: profile?.role || 'customer',
    loading: isLoading,
    error
  };
};