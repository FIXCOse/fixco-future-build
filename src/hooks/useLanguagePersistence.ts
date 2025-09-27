import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    return location.pathname.startsWith('/en') ? 'en' : 'sv';
  };

  // Convert Swedish path to English
  const toEnglishPath = (path: string): string => {
    const pathMap: Record<string, string> = {
      '/': '/en',
      '/tjanster': '/en/services',
      '/tjanster/el': '/en/services/el',
      '/tjanster/vvs': '/en/services/vvs',
      '/tjanster/snickeri': '/en/services/snickeri',
      '/tjanster/montering': '/en/services/montering',
      '/tjanster/tradgard': '/en/services/tradgard',
      '/tjanster/stadning': '/en/services/stadning',
      '/tjanster/markarbeten': '/en/services/markarbeten',
      '/tjanster/tekniska-installationer': '/en/services/tekniska-installationer',
      '/tjanster/flytt': '/en/services/flytt',
      '/kontakt': '/en/contact',
      '/om-oss': '/en/about',
      '/referenser': '/en/references',
      '/smart-hem': '/en/smart-home',
      '/faq': '/en/faq',
      '/terms': '/en/terms',
      '/privacy': '/en/privacy'
    };

    // Check direct mapping first
    if (pathMap[path]) {
      return pathMap[path];
    }

    // Handle dynamic paths like /tjanster/:slug
    if (path.startsWith('/tjanster/')) {
      const slug = path.replace('/tjanster/', '');
      return `/en/services/${slug}`;
    }

    // Default to English home
    return '/en';
  };

  // Convert English path to Swedish
  const toSwedishPath = (path: string): string => {
    const pathMap: Record<string, string> = {
      '/en': '/',
      '/en/services': '/tjanster',
      '/en/services/el': '/tjanster/el',
      '/en/services/vvs': '/tjanster/vvs',
      '/en/services/snickeri': '/tjanster/snickeri',
      '/en/services/montering': '/tjanster/montering',
      '/en/services/tradgard': '/tjanster/tradgard',
      '/en/services/stadning': '/tjanster/stadning',
      '/en/services/markarbeten': '/tjanster/markarbeten',
      '/en/services/tekniska-installationer': '/tjanster/tekniska-installationer',
      '/en/services/flytt': '/tjanster/flytt',
      '/en/contact': '/kontakt',
      '/en/about': '/om-oss',
      '/en/references': '/referenser',
      '/en/smart-home': '/smart-hem',
      '/en/faq': '/faq',
      '/en/terms': '/terms',
      '/en/privacy': '/privacy'
    };

    // Check direct mapping first
    if (pathMap[path]) {
      return pathMap[path];
    }

    // Handle dynamic paths like /en/services/:slug
    if (path.startsWith('/en/services/')) {
      const slug = path.replace('/en/services/', '');
      return `/tjanster/${slug}`;
    }

    // Default to Swedish home
    return '/';
  };

  // Switch language while maintaining current page context
  const switchLanguage = (targetLang: 'sv' | 'en') => {
    const currentLang = getCurrentLanguage();
    if (currentLang === targetLang) return;

    let targetPath: string;
    if (targetLang === 'en') {
      targetPath = toEnglishPath(location.pathname);
    } else {
      targetPath = toSwedishPath(location.pathname);
    }

    // Store preference
    setStoredLanguage(targetLang);
    
    // Navigate to new path
    navigate(targetPath + location.search + location.hash);
  };

  // Effect to enforce language preference on route changes
  useEffect(() => {
    const storedLang = getStoredLanguage();
    const currentLang = getCurrentLanguage();

    // If user has a language preference that doesn't match current URL, redirect
    if (storedLang && storedLang !== currentLang) {
      let targetPath: string;
      if (storedLang === 'en') {
        targetPath = toEnglishPath(location.pathname);
      } else {
        targetPath = toSwedishPath(location.pathname);
      }
      
      // Only redirect if the target path is different
      if (targetPath !== location.pathname) {
        navigate(targetPath + location.search + location.hash, { replace: true });
        return;
      }
    }

    // Store current language as preference
    setStoredLanguage(currentLang);
  }, [location.pathname, navigate]);

  return {
    currentLanguage: getCurrentLanguage(),
    switchLanguage,
    getStoredLanguage,
    setStoredLanguage
  };
};