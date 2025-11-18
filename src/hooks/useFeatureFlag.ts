import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  meta: any;
  updated_at: string | null;
}

export interface FeatureFlagOverride {
  id: string;
  flag_key: string;
  user_id: string;
  enabled: boolean;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  reason: string | null;
}

export interface FeatureFlagHistory {
  id: string;
  flag_key: string;
  old_enabled: boolean | null;
  new_enabled: boolean;
  old_meta: any;
  new_meta: any;
  changed_by: string | null;
  changed_at: string;
  reason: string | null;
}

// Hook to check if a specific feature is enabled
export function useFeatureFlag(flagKey: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['feature-flag', flagKey, user?.id],
    queryFn: async () => {
      // First check for user override
      if (user?.id) {
        const { data: override } = await supabase
          .from('feature_flag_overrides')
          .select('*')
          .eq('flag_key', flagKey)
          .eq('user_id', user.id)
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
          .single();

        if (override) {
          return override.enabled;
        }
      }

      // Fall back to global flag
      const { data: flag } = await supabase
        .from('feature_flags')
        .select('enabled')
        .eq('key', flagKey)
        .single();

      return flag?.enabled ?? false;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get all feature flags (admin only)
export function useFeatureFlags() {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('key');

      if (error) throw error;
      return data as FeatureFlag[];
    },
  });
}

// Hook to get feature flag history
export function useFeatureFlagHistory(flagKey?: string) {
  return useQuery({
    queryKey: ['feature-flag-history', flagKey],
    queryFn: async () => {
      let query = supabase
        .from('feature_flag_history')
        .select('*')
        .order('changed_at', { ascending: false });

      if (flagKey) {
        query = query.eq('flag_key', flagKey);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FeatureFlagHistory[];
    },
  });
}

// Hook to get feature flag overrides
export function useFeatureFlagOverrides(flagKey?: string) {
  return useQuery({
    queryKey: ['feature-flag-overrides', flagKey],
    queryFn: async () => {
      let query = supabase
        .from('feature_flag_overrides')
        .select('*')
        .order('created_at', { ascending: false });

      if (flagKey) {
        query = query.eq('flag_key', flagKey);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FeatureFlagOverride[];
    },
  });
}

// Hook to toggle feature flag
export function useToggleFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      flagKey, 
      enabled, 
      reason 
    }: { 
      flagKey: string; 
      enabled: boolean; 
      reason?: string;
    }) => {
      const { data, error } = await supabase.rpc('toggle_feature_flag', {
        flag_key: flagKey,
        new_enabled: enabled,
        change_reason: reason,
      });

      if (error) throw error;
      return flagKey;
    },
    onSuccess: (flagKey) => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      queryClient.invalidateQueries({ queryKey: ['feature-flag-history'] });
      queryClient.invalidateQueries({ queryKey: ['feature-flag', flagKey] });
      queryClient.invalidateQueries({ queryKey: ['feature-flag'] });
    },
  });
}

// Hook to create user override
export function useCreateFeatureFlagOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (override: {
      flag_key: string;
      user_id: string;
      enabled: boolean;
      expires_at?: string | null;
      reason?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('feature_flag_overrides')
        .insert({
          ...override,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feature-flag-overrides'] });
      queryClient.invalidateQueries({ queryKey: ['feature-flag', data.flag_key] });
      queryClient.invalidateQueries({ queryKey: ['feature-flag'] });
    },
  });
}

// Hook to delete user override
export function useDeleteFeatureFlagOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (overrideId: string) => {
      const { data: override } = await supabase
        .from('feature_flag_overrides')
        .select('flag_key')
        .eq('id', overrideId)
        .single();

      const { error } = await supabase
        .from('feature_flag_overrides')
        .delete()
        .eq('id', overrideId);

      if (error) throw error;
      return override?.flag_key;
    },
    onSuccess: (flagKey) => {
      queryClient.invalidateQueries({ queryKey: ['feature-flag-overrides'] });
      if (flagKey) {
        queryClient.invalidateQueries({ queryKey: ['feature-flag', flagKey] });
        queryClient.invalidateQueries({ queryKey: ['feature-flag'] });
      }
    },
  });
}
