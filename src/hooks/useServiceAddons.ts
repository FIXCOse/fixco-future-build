import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceAddon {
  id: string;
  service_id: string;
  title_sv: string;
  description_sv?: string;
  title_en?: string;
  description_en?: string;
  addon_price: number;
  price_unit: string;
  rot_eligible: boolean;
  rut_eligible: boolean;
  is_active: boolean;
  is_popular?: boolean;
  sort_order: number;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceAddonWithTranslations extends ServiceAddon {
  title: string;
  description?: string;
}

export interface SelectedAddon {
  addon_id: string;
  title: string;
  price: number;
  quantity: number;
}

// Hook to get active add-ons for a service
export const useServiceAddons = (serviceId: string | null, locale: 'sv' | 'en' = 'sv') => {
  console.log('🔍 [useServiceAddons] Hook called with serviceId:', serviceId);
  
  return useQuery({
    queryKey: ['service-addons', serviceId, locale],
    queryFn: async (): Promise<ServiceAddonWithTranslations[]> => {
      console.log('📡 [useServiceAddons] Fetching addons for serviceId:', serviceId);
      
      if (!serviceId) {
        console.log('⚠️ [useServiceAddons] No serviceId provided, returning empty array');
        return [];
      }
      
      const { data, error } = await supabase
        .from('service_addons')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('❌ [useServiceAddons] Error fetching addons:', error);
        throw error;
      }

      console.log('✅ [useServiceAddons] Found addons:', data.length, data);

      // Add localized title and description
      const result = data.map(addon => ({
        ...addon,
        title: locale === 'en' && addon.title_en ? addon.title_en : addon.title_sv,
        description: locale === 'en' && addon.description_en ? addon.description_en : addon.description_sv,
      }));
      
      console.log('📦 [useServiceAddons] Returning addons:', result);
      return result;
    },
    enabled: !!serviceId,
  });
};

// Hook to get all add-ons for a service (admin only)
export const useAllServiceAddons = (serviceId: string | null, locale: 'sv' | 'en' = 'sv') => {
  return useQuery({
    queryKey: ['service-addons', 'admin', serviceId, locale],
    queryFn: async (): Promise<ServiceAddonWithTranslations[]> => {
      if (!serviceId) return [];
      
      const { data, error } = await supabase
        .from('service_addons')
        .select('*')
        .eq('service_id', serviceId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;

      return data.map(addon => ({
        ...addon,
        title: locale === 'en' && addon.title_en ? addon.title_en : addon.title_sv,
        description: locale === 'en' && addon.description_en ? addon.description_en : addon.description_sv,
      }));
    },
    enabled: !!serviceId,
  });
};

// Hook to add a new add-on
export const useAddServiceAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addon: Omit<ServiceAddon, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('➕ [useAddServiceAddon] Adding addon:', addon);
      
      const { data, error } = await supabase
        .from('service_addons')
        .insert(addon)
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ [useAddServiceAddon] Addon added:', data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all cache entries for this service
      console.log('🔄 [useAddServiceAddon] Invalidating cache for service:', data.service_id);
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      queryClient.invalidateQueries({ queryKey: ['service-addons', data.service_id] });
      queryClient.invalidateQueries({ queryKey: ['service-addons', 'admin', data.service_id] });
      toast.success(`Tilläggstjänst tillagd för tjänst-ID: ${data.service_id}`);
    },
    onError: (error) => {
      console.error('❌ [useAddServiceAddon] Error adding addon:', error);
      toast.error('Fel vid tillägg av tjänst');
    },
  });
};

// Hook to update an add-on
export const useUpdateServiceAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceAddon> & { id: string }) => {
      console.log('✏️ [useUpdateServiceAddon] Updating addon:', id, updates);
      
      const { data, error } = await supabase
        .from('service_addons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ [useUpdateServiceAddon] Addon updated:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🔄 [useUpdateServiceAddon] Invalidating cache for service:', data.service_id);
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      queryClient.invalidateQueries({ queryKey: ['service-addons', data.service_id] });
      queryClient.invalidateQueries({ queryKey: ['service-addons', 'admin', data.service_id] });
      toast.success('Tilläggstjänst uppdaterad!');
    },
    onError: (error) => {
      console.error('❌ [useUpdateServiceAddon] Error updating addon:', error);
      toast.error('Fel vid uppdatering');
    },
  });
};

// Hook to delete an add-on
export const useDeleteServiceAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addonId: string) => {
      console.log('🗑️ [useDeleteServiceAddon] Deleting addon:', addonId);
      
      // First get the addon to know which service to invalidate
      const { data: addon } = await supabase
        .from('service_addons')
        .select('service_id')
        .eq('id', addonId)
        .single();
      
      const { error } = await supabase
        .from('service_addons')
        .delete()
        .eq('id', addonId);

      if (error) throw error;
      
      console.log('✅ [useDeleteServiceAddon] Addon deleted');
      return addon?.service_id;
    },
    onSuccess: (serviceId) => {
      console.log('🔄 [useDeleteServiceAddon] Invalidating cache for service:', serviceId);
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      if (serviceId) {
        queryClient.invalidateQueries({ queryKey: ['service-addons', serviceId] });
        queryClient.invalidateQueries({ queryKey: ['service-addons', 'admin', serviceId] });
      }
      toast.success('Tilläggstjänst borttagen!');
    },
    onError: (error) => {
      console.error('❌ [useDeleteServiceAddon] Error deleting addon:', error);
      toast.error('Fel vid borttagning');
    },
  });
};

// Hook to toggle add-on active status
export const useToggleAddonActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      console.log('👁️ [useToggleAddonActive] Toggling addon:', id, 'to', is_active);
      
      // First get the addon to know which service to invalidate
      const { data: addon } = await supabase
        .from('service_addons')
        .select('service_id')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('service_addons')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ [useToggleAddonActive] Status toggled');
      return addon?.service_id;
    },
    onSuccess: (serviceId) => {
      console.log('🔄 [useToggleAddonActive] Invalidating cache for service:', serviceId);
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      if (serviceId) {
        queryClient.invalidateQueries({ queryKey: ['service-addons', serviceId] });
        queryClient.invalidateQueries({ queryKey: ['service-addons', 'admin', serviceId] });
      }
      toast.success('Status uppdaterad!');
    },
    onError: (error) => {
      console.error('❌ [useToggleAddonActive] Error toggling addon:', error);
      toast.error('Fel vid statusändring');
    },
  });
};
