import React, { ReactNode } from 'react';
import { I18nProvider, Locale } from '@/i18n/context';

interface LocaleProviderProps {
  locale?: Locale;
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ 
  locale = 'sv', 
  children 
}) => {
  return (
    <I18nProvider locale={locale}>
      {children}
    </I18nProvider>
  );
};