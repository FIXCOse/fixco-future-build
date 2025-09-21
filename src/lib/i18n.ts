import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabaseBackend } from './i18n/supabaseBackend';

export const SUPPORTED_LOCALES = ['sv', 'en'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: Locale = 'sv';

const initI18n = () => {
  i18n
    .use(LanguageDetector)
    .use(supabaseBackend)
    .use(initReactI18next)
    .init({
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: SUPPORTED_LOCALES,
      
      // Language detection config
      detection: {
        order: ['path', 'cookie', 'navigator'],
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        caches: ['cookie'],
        cookieMinutes: 525600, // 1 year
        cookieDomain: undefined,
        cookieOptions: { path: '/', sameSite: 'strict' }
      },

      // Namespace configuration
      defaultNS: 'common',
      ns: ['common', 'header', 'home', 'services', 'forms', 'seo'],

      interpolation: {
        escapeValue: false, // React already escapes
      },

      // Backend configuration
      backend: {
        loadPath: '/api/translations/{{lng}}/{{ns}}', // This will be handled by our custom backend
      },

      // Development options
      debug: import.meta.env.DEV,
      
      // React options
      react: {
        useSuspense: false, // We'll handle loading states manually
      }
    });

  return i18n;
};

// Singleton instance
let i18nInstance: typeof i18n | null = null;

export const getI18n = () => {
  if (!i18nInstance) {
    i18nInstance = initI18n();
  }
  return i18nInstance;
};

export default getI18n();