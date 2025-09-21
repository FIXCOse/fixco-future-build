import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useCopy } from '@/copy/CopyProvider';
import { useLocalePath } from '@/copy/useLocalePath';

const LanguageSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { locale } = useCopy();
  const { toEN, toSV } = useLocalePath();

  const switchLanguage = () => {
    const targetUrl = locale === 'sv' ? toEN() : toSV();
    navigate(targetUrl);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLanguage}
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