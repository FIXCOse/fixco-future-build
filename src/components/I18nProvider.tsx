import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const i18n = getI18n();

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
};