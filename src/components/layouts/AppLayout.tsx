import React from 'react';
import { Outlet } from 'react-router-dom';
import { LocaleProvider } from '../LocaleProvider';
import { CopyProvider } from '@/copy/CopyProvider';
import { EditModeProvider } from '@/contexts/EditModeContext';
import Navigation from '../Navigation';
import AIChat from '../AIChat';
import { EditModeToggle } from '../EditModeToggle';
import { GlobalContentEditor } from '../GlobalContentEditor';
import EditModeIndicator from '../EditModeIndicator';
import { ContentLoadingIndicator } from '../ContentLoadingIndicator';
import { ModalHost } from '../ActionWizard';
import { Locale } from '@/i18n/context';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';
import { useContentLoader } from '@/hooks/useContentLoader';
import GlobalFooter from '../layout/GlobalFooter';

interface AppLayoutProps {
  locale?: Locale;
}

const AppLayout: React.FC<AppLayoutProps> = ({ locale = 'sv' }) => {
  // Initialize language persistence and content loading
  useLanguagePersistence();
  useContentLoader();
  
  return (
    <LocaleProvider locale={locale}>
      <CopyProvider locale={locale}>
        <EditModeProvider>
          <div className="min-h-screen bg-background" data-header="main">
            <Navigation />
            <main className="min-h-[60vh]">
              <Outlet />
            </main>
            <GlobalFooter locale={locale} />
            <AIChat />
            <GlobalContentEditor />
            <EditModeIndicator />
            <ContentLoadingIndicator />
            <ModalHost />
          </div>
        </EditModeProvider>
      </CopyProvider>
    </LocaleProvider>
  );
};

export default AppLayout;