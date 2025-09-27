import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useCopy } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';

const LanguageSwitcher: React.FC = () => {
  const { locale } = useCopy();
  const { switchLanguage } = useLanguagePersistence();

  const handleSwitchLanguage = () => {
    const targetLang = locale === 'sv' ? 'en' : 'sv';
    switchLanguage(targetLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitchLanguage}
      className="flex items-center gap-2 h-9 px-3 whitespace-nowrap"
      title={locale === 'sv' ? 'Switch to English' : 'Växla till svenska'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {locale === 'sv' ? 'EN' : 'SV'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;