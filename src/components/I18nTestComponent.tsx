import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';

/**
 * Test component to verify i18n system is working
 * Remove this component once testing is complete
 */
export const I18nTestComponent: React.FC = () => {
  const { t } = useTranslation('header');
  const { currentLocale, changeLocale } = useLocale();

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  const testTranslation = () => {
    console.log('🧪 Testing i18n system:');
    console.log('Current locale:', currentLocale);
    console.log('Home translation:', t('nav.home', { defaultValue: 'Hem' }));
    console.log('Services translation:', t('nav.services', { defaultValue: 'Tjänster' }));
    
    // Clear cache and reload
    if ((window as any).i18nDebug) {
      (window as any).i18nDebug.clearCache();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-sm">
      <div className="font-bold mb-2">i18n Debug Panel</div>
      <div>Current: {currentLocale}</div>
      <div>Home: {t('nav.home', { defaultValue: 'Hem' })}</div>
      <div>Services: {t('nav.services', { defaultValue: 'Tjänster' })}</div>
      <div className="flex gap-2 mt-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => changeLocale('sv')}
          className="text-xs"
        >
          SV
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => changeLocale('en')}
          className="text-xs"
        >
          EN
        </Button>
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={testTranslation}
          className="text-xs"
        >
          Test
        </Button>
      </div>
    </div>
  );
};