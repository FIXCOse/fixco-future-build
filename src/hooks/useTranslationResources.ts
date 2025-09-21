import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TranslationResource {
  ns: string;
  key: string;
  locale: string;
  value: string;
}

export const useTranslationResources = (namespace: string, locale: string) => {
  const [resources, setResources] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: supabaseError } = await supabase
          .from('i18n_resources')
          .select('key, value')
          .eq('ns', namespace)
          .eq('locale', locale);

        if (supabaseError) {
          throw supabaseError;
        }

        const resourceMap: Record<string, string> = {};
        data?.forEach(resource => {
          resourceMap[resource.key] = resource.value;
        });

        setResources(resourceMap);
      } catch (err: any) {
        console.error('Failed to load translation resources:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, [namespace, locale]);

  return { resources, isLoading, error };
};