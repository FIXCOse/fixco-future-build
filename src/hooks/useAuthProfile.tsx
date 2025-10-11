import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, role, user_type, created_at, loyalty_points, total_spent')
        .eq('id', user.id)
        .maybeSingle();

      // If profile doesn't exist, create it
      if (!profileData && !profileError) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || '',
            last_name: user.user_metadata?.last_name || '',
            role: (user.email?.toLowerCase() === 'omar@fixco.se' || user.email?.toLowerCase() === 'omar@dinadress.se') ? 'owner' : 'customer',
            user_type: 'private',
            loyalty_points: 0,
            total_spent: 0
          })
          .select('id, email, first_name, last_name, phone, role, user_type, created_at, loyalty_points, total_spent')
          .single();
        
        return newProfile;
      }

      return profileData;
    },
    staleTime: 1000 * 60, // 1 minute instead of 5
    refetchOnWindowFocus: true, // Refetch when window gets focus
    retry: 3
  });

  return {
    profile,
    role: profile?.role || 'customer',
    loading: isLoading,
    error
  };
};