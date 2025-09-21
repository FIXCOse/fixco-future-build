/**
 * Debug utilities for i18n system
 */

import { supabaseBackend } from './supabaseBackend';

// Add debug methods to window for development
declare global {
  interface Window {
    i18n?: any;
    i18nDebug: {
      clearCache: () => void;
      reloadTranslations: () => void;
      checkTranslation: (key: string, namespace?: string) => void;
    };
  }
}

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.i18nDebug = {
    clearCache: () => {
      supabaseBackend.clearCache();
      console.log('🔄 i18n cache cleared');
    },
    
    reloadTranslations: () => {
      supabaseBackend.clearCache();
      if (window.i18n) {
        window.i18n.reloadResources().then(() => {
          console.log('🔄 i18n translations reloaded');
        });
      }
    },
    
    checkTranslation: (key: string, namespace = 'common') => {
      if (window.i18n) {
        const currentLang = window.i18n.language;
        const translation = window.i18n.t(`${namespace}:${key}`);
        console.log(`🔍 Translation check:`, {
          key: `${namespace}:${key}`,
          language: currentLang,
          translation
        });
      }
    }
  };

  console.log('🛠️ i18n debug tools available at window.i18nDebug');
}