import { BackendModule, Services, InitOptions } from 'i18next';
import { supabase } from '@/integrations/supabase/client';

interface TranslationData {
  [key: string]: string;
}

interface CacheEntry {
  data: TranslationData;
  timestamp: number;
  ttl: number;
}

class SupabaseBackend implements BackendModule<{}> {
  type = 'backend' as const;
  
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  init(services: Services, backendOptions: {}, i18nOptions: InitOptions) {
    // Backend initialization if needed
  }

  async read(language: string, namespace: string, callback: (error: Error | null, translations?: TranslationData) => void) {
    const cacheKey = `${language}:${namespace}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return callback(null, cached.data);
    }

    try {
      const translations = await this.fetchTranslations(language, namespace);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: translations,
        timestamp: Date.now(),
        ttl: this.TTL
      });

      callback(null, translations);
    } catch (error) {
      console.error(`Failed to load translations for ${language}:${namespace}`, error);
      
      // Try to return cached data even if expired
      if (cached) {
        console.warn(`Using expired cache for ${language}:${namespace}`);
        return callback(null, cached.data);
      }
      
      callback(error as Error);
    }
  }

  private async fetchTranslations(language: string, namespace: string): Promise<TranslationData> {
    // Query translation keys and locales
    const { data, error } = await supabase
      .from('translation_keys')
      .select(`
        key,
        default_text,
        translation_locales!inner(
          locale,
          text,
          status
        )
      `)
      .eq('namespace', namespace)
      .eq('translation_locales.locale', language);

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    const translations: TranslationData = {};

    // Process the data
    if (data) {
      for (const item of data) {
        const locale = item.translation_locales[0];
        if (locale) {
          translations[item.key] = locale.text;
        } else if (language === 'sv') {
          // For Swedish, fall back to default_text
          translations[item.key] = item.default_text;
        }
      }
    }

    // If this is English and we have missing translations, fetch Swedish fallbacks
    if (language === 'en') {
      const { data: fallbackData } = await supabase
        .from('translation_keys')
        .select('key, default_text')
        .eq('namespace', namespace);

      if (fallbackData) {
        for (const item of fallbackData) {
          if (!translations[item.key]) {
            translations[item.key] = item.default_text;
            console.warn(`Missing English translation for ${namespace}.${item.key}, using Swedish fallback`);
          }
        }
      }
    }

    return translations;
  }

  // Clear cache method for admin use
  clearCache(language?: string, namespace?: string) {
    if (language && namespace) {
      this.cache.delete(`${language}:${namespace}`);
    } else if (language) {
      // Clear all entries for a language
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${language}:`)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear entire cache
      this.cache.clear();
    }
    
    // Also clear i18next resource store
    if (typeof window !== 'undefined' && (window as any).i18n) {
      (window as any).i18n.reloadResources();
    }
  }
}

export const supabaseBackend = new SupabaseBackend();