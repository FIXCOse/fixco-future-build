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
  return useQuery({
    queryKey: ['service-addons', serviceId, locale],
    queryFn: async (): Promise<ServiceAddonWithTranslations[]> => {
      if (!serviceId) return [];
      
      const { data, error } = await supabase
        .from('service_addons')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching service addons:', error);
        throw error;
      }

      // Add localized title and description
      return data.map(addon => ({
        ...addon,
        title: locale === 'en' && addon.title_en ? addon.title_en : addon.title_sv,
        description: locale === 'en' && addon.description_en ? addon.description_en : addon.description_sv,
      }));
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
      const { data, error } = await supabase
        .from('service_addons')
        .insert(addon)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      toast.success('Tilläggstjänst tillagd!');
    },
    onError: (error) => {
      console.error('Error adding addon:', error);
      toast.error('Fel vid tillägg av tjänst');
    },
  });
};

// Hook to update an add-on
export const useUpdateServiceAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceAddon> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_addons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      toast.success('Tilläggstjänst uppdaterad!');
    },
    onError: (error) => {
      console.error('Error updating addon:', error);
      toast.error('Fel vid uppdatering');
    },
  });
};

// Hook to delete an add-on
export const useDeleteServiceAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addonId: string) => {
      const { error } = await supabase
        .from('service_addons')
        .delete()
        .eq('id', addonId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      toast.success('Tilläggstjänst borttagen!');
    },
    onError: (error) => {
      console.error('Error deleting addon:', error);
      toast.error('Fel vid borttagning');
    },
  });
};

// Hook to toggle add-on active status
export const useToggleAddonActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('service_addons')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-addons'] });
      toast.success('Status uppdaterad!');
    },
    onError: (error) => {
      console.error('Error toggling addon:', error);
      toast.error('Fel vid statusändring');
    },
  });
};
