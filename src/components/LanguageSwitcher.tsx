import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { getAlternateLanguageUrl, getCurrentLanguage } from '@/utils/slugMapping';

const LanguageSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang = getCurrentLanguage(location.pathname);

  const switchLanguage = () => {
    const targetLang = currentLang === 'sv' ? 'en' : 'sv';
    const targetUrl = getAlternateLanguageUrl(location.pathname + location.search + location.hash, targetLang);
    navigate(targetUrl);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLanguage}
      className="flex items-center gap-2 h-9 px-3"
      title={currentLang === 'sv' ? 'Switch to English' : 'Växla till svenska'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {currentLang === 'sv' ? 'EN' : 'SV'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;