import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  user_type: 'private' | 'company' | 'brf';
  created_at: string;
  loyalty_points: number;
  total_spent: number;
  owner_welcome_at: string | null;
}

export const useAuthProfile = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['auth-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Optimized query - select profile data (role is now in user_roles table)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, user_type, created_at, loyalty_points, total_spent, owner_welcome_at')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If profile doesn't exist, create it immediately
      if (!profileData) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || '',
            last_name: user.user_metadata?.last_name || '',
            user_type: 'private',
            loyalty_points: 0,
            total_spent: 0
          })
          .select('id, email, first_name, last_name, phone, user_type, created_at, loyalty_points, total_spent, owner_welcome_at')
          .single();
        
        if (insertError) throw insertError;

        // Assign default customer role in user_roles table
        await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'customer'
          });
        
        return newProfile;
      }

      return profileData;
    },
    staleTime: Infinity, // Cache until explicitly invalidated
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 0, // No retries - fail fast
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  return {
    profile,
    loading: isLoading,
    error
  };
};
