import React from 'react';
import { Outlet } from 'react-router-dom';
import { LocaleProvider } from '../LocaleProvider';
import { CopyProvider } from '@/copy/CopyProvider';
import { EditModeProvider } from '@/contexts/EditModeContext';
import Navigation from '../Navigation';
import { EditModeToggle } from '../EditModeToggle';
import { ModalHost } from '../ActionWizard';
import { Locale } from '@/i18n/context';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';

interface AppLayoutProps {
  locale?: Locale;
}

const AppLayout: React.FC<AppLayoutProps> = ({ locale = 'sv' }) => {
  // Initialize language persistence
  useLanguagePersistence();
  
  return (
    <LocaleProvider locale={locale}>
      <CopyProvider locale={locale}>
        <EditModeProvider>
          <div className="min-h-screen bg-background" data-header="main">
            <Navigation />
            <main>
              <Outlet />
            </main>
            <EditModeToggle />
            <ModalHost />
          </div>
        </EditModeProvider>
      </CopyProvider>
    </LocaleProvider>
  );
};

export default AppLayout;