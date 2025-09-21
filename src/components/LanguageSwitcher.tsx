import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Locale } from '@/lib/i18n';

const LOCALE_NAMES: Record<Locale, { native: string; english: string }> = {
  sv: { native: 'Svenska', english: 'Swedish' },
  en: { native: 'English', english: 'English' },
};

interface LanguageSwitcherProps {
  variant?: 'button' | 'minimal';
  showText?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'button',
  showText = true 
}) => {
  const { t } = useTranslation('common');
  const { currentLocale, changeLocale, supportedLocales, isChanging } = useLocale();

  const handleLocaleChange = (newLocale: Locale) => {
    changeLocale(newLocale);
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-1">
        {supportedLocales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            disabled={isChanging}
            className={`
              px-2 py-1 text-sm font-medium rounded transition-colors
              ${currentLocale === locale 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
              ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={isChanging}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {showText && (
            <span className="hidden sm:inline">
              {LOCALE_NAMES[currentLocale].native}
            </span>
          )}
          <span className="sm:hidden">
            {currentLocale.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLocales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            disabled={isChanging}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {LOCALE_NAMES[locale].native}
              </span>
              <span className="text-xs text-muted-foreground">
                {LOCALE_NAMES[locale].english}
              </span>
            </div>
            {currentLocale === locale && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};