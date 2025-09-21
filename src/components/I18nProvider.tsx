import React from 'react';
import { useTranslation } from 'react-i18next';

interface I18nProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}) => {
  const { ready } = useTranslation();
  
  if (!ready) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default I18nProvider;