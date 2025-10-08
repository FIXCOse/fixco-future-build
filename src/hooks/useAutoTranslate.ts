import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Automatically translates all services missing English translations
 * Runs silently in the background when on English locale
 */
export const useAutoTranslate = (locale: 'sv' | 'en') => {
  const queryClient = useQueryClient();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Only run on English locale and only once per session
    if (locale !== 'en' || hasTriggeredRef.current) {
      return;
    }

    const translatePendingServices = async () => {
      try {
        console.log('[AutoTranslate] Checking for services needing translation...');
        
        // Get all services that need translation
        const { data: services, error } = await supabase
          .from('services')
          .select('id, title_sv, title_en, description_en, translation_status')
          .eq('is_active', true)
          .or('title_en.is.null,description_en.is.null,translation_status.eq.pending,translation_status.eq.failed');

        if (error) {
          console.error('[AutoTranslate] Error fetching services:', error);
          return;
        }

        if (!services || services.length === 0) {
          console.log('[AutoTranslate] All services already translated ✓');
          return;
        }

        console.log(`[AutoTranslate] Found ${services.length} services needing translation, starting background translation...`);

        // Translate each service in the background
        const translationPromises = services.map(async (service) => {
          try {
            const { error: invokeError } = await supabase.functions.invoke('translate-service', {
              body: { service_id: service.id }
            });

            if (invokeError) {
              console.warn(`[AutoTranslate] Failed to translate service ${service.id}:`, invokeError);
            } else {
              console.log(`[AutoTranslate] ✓ Translated: ${service.title_sv}`);
            }
          } catch (err) {
            console.warn(`[AutoTranslate] Error translating service ${service.id}:`, err);
          }
        });

        // Run all translations in parallel but don't block
        await Promise.allSettled(translationPromises);

        console.log('[AutoTranslate] Background translation completed, refreshing data...');
        
        // Invalidate and refetch services after translations
        queryClient.invalidateQueries({ queryKey: ['services'] });
        await queryClient.refetchQueries({ queryKey: ['services'] });

      } catch (error) {
        console.error('[AutoTranslate] Unexpected error:', error);
      }
    };

    // Mark as triggered and start translation
    hasTriggeredRef.current = true;
    translatePendingServices();

  }, [locale, queryClient]);
};
