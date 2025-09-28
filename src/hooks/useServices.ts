import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Service {
  id: string;
  category: string;
  title_sv: string;
  description_sv: string;
  title_en?: string;
  description_en?: string;
  base_price: number;
  price_unit: string;
  price_type: 'hourly' | 'fixed' | 'quote';
  rot_eligible: boolean;
  rut_eligible: boolean;
  location: 'inomhus' | 'utomhus' | 'båda';
  sub_category?: string;
  is_active: boolean;
  translation_status: 'pending' | 'completed' | 'failed';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithTranslations extends Service {
  title: string;
  description: string;
}

// Hook to get all services
export const useServices = (locale: 'sv' | 'en' = 'sv') => {
  return useQuery({
    queryKey: ['services', locale],
    queryFn: async (): Promise<ServiceWithTranslations[]> => {
      console.log('Fetching services for locale:', locale);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order');

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }

      console.log('Services fetched:', data?.length || 0);

      // Add localized title and description
      return data.map(service => ({
        ...service,
        title: locale === 'en' && service.title_en ? service.title_en : service.title_sv,
        description: locale === 'en' && service.description_en ? service.description_en : service.description_sv,
        price_type: service.price_type as 'hourly' | 'fixed' | 'quote',
        location: service.location as 'inomhus' | 'utomhus' | 'båda',
        translation_status: service.translation_status as 'pending' | 'completed' | 'failed'
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get services by category
export const useServicesByCategory = (category: string, locale: 'sv' | 'en' = 'sv') => {
  return useQuery({
    queryKey: ['services', 'category', category, locale],
    queryFn: async (): Promise<ServiceWithTranslations[]> => {
      let query = supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (category !== 'alla') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(service => ({
        ...service,
        title: locale === 'en' && service.title_en ? service.title_en : service.title_sv,
        description: locale === 'en' && service.description_en ? service.description_en : service.description_sv,
        price_type: service.price_type as 'hourly' | 'fixed' | 'quote',
        location: service.location as 'inomhus' | 'utomhus' | 'båda',
        translation_status: service.translation_status as 'pending' | 'completed' | 'failed'
      }));
    },
  });
};

// Hook to add new service (admin only)
export const useAddService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: Omit<Service, 'created_at' | 'updated_at' | 'translation_status'>) => {
      console.log('Adding new service:', serviceData);
      
      const { data, error } = await supabase
        .from('services')
        .insert([{
          ...serviceData,
          translation_status: 'pending',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Add service error:', error);
        throw error;
      }

      console.log('Service added successfully:', data);

      // Trigger automatic translation
      try {
        await supabase.functions.invoke('translate-service', {
          body: { service_id: data.id }
        });
      } catch (translationError) {
        console.warn('Auto-translation failed:', translationError);
        // Don't fail the whole operation if translation fails
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch all services
      queryClient.invalidateQueries({ queryKey: ['services'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['services'] });
      toast.success('Tjänst tillagd! Översättning pågår...');
    },
    onError: (error) => {
      console.error('Add service error:', error);
      toast.error('Fel vid tillägg av tjänst: ' + error.message);
    }
  });
};

// Hook to update service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Service> }) => {
      console.log('Updating service:', id, updates);
      
      const { data, error } = await supabase
        .from('services')
        .update({
          ...updates,
          // Reset translation status if Swedish text was changed
          translation_status: (updates.title_sv || updates.description_sv) ? 'pending' : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Service updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Update mutation succeeded, invalidating cache...');
      
      // Invalidate all services queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['services'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['services'] });
      
      toast.success('Tjänst uppdaterad och sparad!');

      // Trigger re-translation if Swedish text was updated
      if (data.title_sv || data.description_sv) {
        try {
          supabase.functions.invoke('translate-service', {
            body: { service_id: data.id }
          });
        } catch (translationError) {
          console.warn('Auto-translation failed:', translationError);
        }
      }
    },
    onError: (error) => {
      console.error('Update service error:', error);
      toast.error('Fel vid uppdatering: ' + error.message);
    }
  });
};

// Hook to delete service (soft delete)
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Soft deleting service:', id);
      
      const { data, error } = await supabase
        .from('services')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Service deleted successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Delete mutation succeeded, invalidating cache...');
      
      // Invalidate all services queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['services'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['services'] });
      
      toast.success('Tjänst borttagen!');
    },
    onError: (error) => {
      console.error('Delete service error:', error);
      toast.error('Fel vid borttagning: ' + error.message);
    }
  });
};

// Hook to translate all pending services
export const useTranslateAllPending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Get all services with pending translations
      const { data: pendingServices, error } = await supabase
        .from('services')
        .select('id')
        .eq('translation_status', 'pending');

      if (error) throw error;

      // Translate each service
      const results = await Promise.allSettled(
        pendingServices.map(service =>
          supabase.functions.invoke('translate-service', {
            body: { service_id: service.id }
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { successful, failed, total: pendingServices.length };
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.refetchQueries({ queryKey: ['services'] });
      toast.success(`Översättning klar! ${results.successful} lyckades, ${results.failed} misslyckades.`);
    },
    onError: (error) => {
      toast.error('Fel vid översättning: ' + error.message);
    }
  });
};