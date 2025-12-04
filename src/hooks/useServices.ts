import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Service {
  id: string;
  category: string;
  additional_categories?: string[];
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
  search_keywords?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithTranslations extends Service {
  title: string;
  description: string;
  searchKeywords?: string | null;
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
      const translatedServices = data.map(service => {
        const title = locale === 'en' && service.title_en ? service.title_en : service.title_sv;
        const description = locale === 'en' && service.description_en ? service.description_en : service.description_sv;
        
        return {
          ...service,
          title,
          description,
          searchKeywords: service.search_keywords,
          price_type: service.price_type as 'hourly' | 'fixed' | 'quote',
          location: service.location as 'inomhus' | 'utomhus' | 'båda',
          translation_status: service.translation_status as 'pending' | 'completed' | 'failed'
        };
      });
      
      return translatedServices;
    },
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Always refetch on mount
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
        // Match primary category OR if additional_categories contains this category
        query = query.or(`category.eq.${category},additional_categories.cs.{${category}}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(service => ({
        ...service,
        title: locale === 'en' && service.title_en ? service.title_en : service.title_sv,
        description: locale === 'en' && service.description_en ? service.description_en : service.description_sv,
        searchKeywords: service.search_keywords,
        price_type: service.price_type as 'hourly' | 'fixed' | 'quote',
        location: service.location as 'inomhus' | 'utomhus' | 'båda',
        translation_status: service.translation_status as 'pending' | 'completed' | 'failed'
      }));
    },
  });
};

// Hook to get all services including inactive (admin only)
export const useAllServicesForAdmin = (locale: 'sv' | 'en' = 'sv') => {
  return useQuery({
    queryKey: ['services', 'admin', locale],
    queryFn: async (): Promise<ServiceWithTranslations[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category')
        .order('sort_order');

      if (error) throw error;

      return data.map(service => ({
        ...service,
        title: locale === 'en' && service.title_en ? service.title_en : service.title_sv,
        description: locale === 'en' && service.description_en ? service.description_en : service.description_sv,
        searchKeywords: service.search_keywords,
        price_type: service.price_type as 'hourly' | 'fixed' | 'quote',
        location: service.location as 'inomhus' | 'utomhus' | 'båda',
        translation_status: service.translation_status as 'pending' | 'completed' | 'failed'
      }));
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
    onSuccess: (data, variables) => {
      console.log('Update mutation succeeded, invalidating cache...');
      
      // Invalidate all services queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['services'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['services'] });
      
      toast.success('Tjänst uppdaterad och sparad!');

      // Trigger re-translation if Swedish text was updated
      if (variables.updates.title_sv || variables.updates.description_sv) {
        try {
          supabase.functions.invoke('translate-service', {
            body: { service_id: data.id }
          });
          console.log('Auto-translation triggered for service:', data.id);
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

// Hook to toggle service active status
export const useToggleServiceActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      console.log('🔄 Toggle service START:', { id, is_active });
      
      // FORCE session refresh (inte bara getSession)
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      console.log('🔑 Session after refresh:', {
        userId: session?.user?.id,
        hasToken: !!session?.access_token,
        expiresAt: session?.expires_at,
        error: refreshError
      });
      
      if (refreshError || !session) {
        console.error('❌ Session refresh failed:', refreshError);
        await supabase.auth.signOut();
        throw new Error('Session utgången. Logga in igen.');
      }

      // WORKAROUND: RLS prewarm - Tvinga en SELECT först för att "värma upp" RLS context
      console.log('🔍 RLS prewarm: SELECT före UPDATE');
      const { data: preCheck, error: preCheckError } = await supabase
        .from('services')
        .select('id, is_active')
        .eq('id', id)
        .single();
        
      console.log('🔍 Pre-check result:', { preCheck, preCheckError });

      if (preCheckError) {
        console.error('❌ Pre-check failed:', preCheckError);
        throw preCheckError;
      }

      console.log('📤 Attempting UPDATE:', { id, is_active });
      
      const { data, error } = await supabase
        .from('services')
        .update({ 
          is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      console.log('📥 UPDATE result:', { data, error });

      if (error) {
        console.error('❌ UPDATE ERROR:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('✅ Toggle service SUCCESS:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.refetchQueries({ queryKey: ['services'] });
      toast.success(data.is_active ? 'Tjänst aktiverad!' : 'Tjänst dold!');
    },
    onError: (error: any) => {
      console.error('🚨 Toggle active ERROR HANDLER:', {
        error,
        code: error?.code,
        message: error?.message,
        details: error?.details
      });
      
      // Visa detaljerat felmeddelande
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        toast.error('RLS-fel: ' + error.message, { duration: 5000 });
      } else if (error.code === 'PGRST301') {
        toast.error(`PGRST301: ${error.message} - ${error.details || ''}`, { duration: 5000 });
      } else if (error.message?.includes('Session utgången')) {
        toast.error('Session utgången - omdirigerar till login...', { duration: 3000 });
        setTimeout(() => window.location.href = '/auth', 1000);
      } else {
        toast.error(`Okänt fel: ${error.message || JSON.stringify(error)}`, { duration: 5000 });
      }
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