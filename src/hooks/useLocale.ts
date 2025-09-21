import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';

export const useLocale = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ locale?: string }>();
  
  const [isChanging, setIsChanging] = useState(false);

  // Get current locale from URL or default
  const currentLocale = (params.locale as Locale) || DEFAULT_LOCALE;

  // Sync i18n language with URL locale
  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n]);

  // Validate locale on mount and redirect if invalid
  useEffect(() => {
    if (params.locale && !SUPPORTED_LOCALES.includes(params.locale as Locale)) {
      // Invalid locale in URL, redirect to default
      const newPath = location.pathname.replace(`/${params.locale}`, '') || '/';
      navigate(newPath + location.search + location.hash, { replace: true });
    }
  }, [params.locale, location, navigate]);

  const changeLocale = async (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    setIsChanging(true);
    
    try {
      // Change i18n language
      await i18n.changeLanguage(newLocale);
      
      // Update URL
      let newPath = location.pathname;
      
      if (currentLocale !== DEFAULT_LOCALE) {
        // Remove current locale from path
        newPath = newPath.replace(`/${currentLocale}`, '');
      }
      
      if (newLocale !== DEFAULT_LOCALE) {
        // Add new locale to path
        newPath = `/${newLocale}${newPath}`;
      }
      
      // Ensure path starts with /
      if (!newPath.startsWith('/')) {
        newPath = '/' + newPath;
      }
      
      // Navigate to new path with query params and hash
      navigate(newPath + location.search + location.hash);
      
    } finally {
      setIsChanging(false);
    }
  };

  const getLocalizedPath = (path: string, locale?: Locale) => {
    const targetLocale = locale || currentLocale;
    
    if (targetLocale === DEFAULT_LOCALE) {
      return path;
    }
    
    return `/${targetLocale}${path}`;
  };

  const isDefaultLocale = currentLocale === DEFAULT_LOCALE;

  return {
    currentLocale,
    changeLocale,
    getLocalizedPath,
    isDefaultLocale,
    isChanging,
    supportedLocales: SUPPORTED_LOCALES,
  };
};