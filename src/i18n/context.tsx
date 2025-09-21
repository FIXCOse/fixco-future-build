import React, { createContext, useContext, ReactNode } from 'react';
import svTranslations from './locales/sv.json';
import enTranslations from './locales/en.json';

type Locale = 'sv' | 'en';

interface I18nContextType {
  locale: Locale;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  locale: Locale;
  children: ReactNode;
}

const translations = {
  sv: svTranslations,
  en: enTranslations,
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ locale, children }) => {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export type { Locale };