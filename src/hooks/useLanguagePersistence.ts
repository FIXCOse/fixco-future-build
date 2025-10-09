import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertPath, getLanguageFromPath } from '@/utils/routeMapping';

const LANGUAGE_STORAGE_KEY = 'fixco-preferred-language';

export const useLanguagePersistence = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get stored language preference
  const getStoredLanguage = (): 'sv' | 'en' | null => {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) as 'sv' | 'en' | null;
    } catch {
      return null;
    }
  };

  // Store language preference
  const setStoredLanguage = (lang: 'sv' | 'en') => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Get current language from URL
  const getCurrentLanguage = (): 'sv' | 'en' => {
    return getLanguageFromPath(location.pathname);
  };

  // Switch language while maintaining current page context
  const switchLanguage = (targetLang: 'sv' | 'en') => {
    const currentLang = getCurrentLanguage();
    if (currentLang === targetLang) {
      console.log('[switchLanguage] Already on', targetLang);
      return;
    }

    const targetPath = convertPath(location.pathname + location.search + location.hash, targetLang);
    
    console.log('[switchLanguage] Switching from', currentLang, 'to', targetLang);
    console.log('[switchLanguage] Target path:', targetPath);

    // Store preference
    setStoredLanguage(targetLang);
    
    // Navigate to new path
    navigate(targetPath, { replace: false });
  };

  // Effect to store current language preference on mount only
  useEffect(() => {
    const currentLang = getCurrentLanguage();
    setStoredLanguage(currentLang);
  }, []); // Run only once on mount

  return {
    currentLanguage: getCurrentLanguage(),
    switchLanguage,
    getStoredLanguage,
    setStoredLanguage
  };
};