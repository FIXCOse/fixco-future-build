import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type Locale = 'sv' | 'en';

export const useLocale = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const currentLocale = i18n.language as Locale;

  const setLocale = async (locale: Locale) => {
    setIsLoading(true);
    try {
      // Set cookie
      document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      
      // Change i18n language
      await i18n.changeLanguage(locale);
      
      // Update user profile if authenticated
      if (user) {
        await supabase
          .from('profiles')
          .update({ language: locale })
          .eq('id', user.id);
      }

      // Update document language
      document.documentElement.lang = locale;
      
    } catch (error) {
      console.error('Failed to set locale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize locale on mount
  useEffect(() => {
    const initializeLocale = async () => {
      let preferredLocale: Locale = 'sv';

      // Priority: cookie -> user.profile.locale -> Accept-Language -> 'sv'
      
      // 1. Check cookie
      const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
        ?.split('=')[1] as Locale;
      
      if (cookieLocale && ['sv', 'en'].includes(cookieLocale)) {
        preferredLocale = cookieLocale;
      } else if (user) {
        // 2. Check user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', user.id)
          .single();
        
        if (profile?.language && ['sv', 'en'].includes(profile.language)) {
          preferredLocale = profile.language as Locale;
        }
      } else {
        // 3. Check browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('en')) {
          preferredLocale = 'en';
        }
      }

      if (currentLocale !== preferredLocale) {
        await setLocale(preferredLocale);
      }
    };

    initializeLocale();
  }, [user, currentLocale]);

  return {
    locale: currentLocale,
    setLocale,
    isLoading,
    isSwedish: currentLocale === 'sv',
    isEnglish: currentLocale === 'en',
  };
};