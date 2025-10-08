import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CopyProvider } from '@/copy/CopyProvider';
import { EditModeProvider } from '@/contexts/EditModeContext';
import Navigation from '../Navigation';
import AIChat from '../AIChat';
import { EditModeToggle } from '../EditModeToggle';
import { GlobalContentEditor } from '../GlobalContentEditor';
import EditModeIndicator from '../EditModeIndicator';
import { ContentLoadingIndicator } from '../ContentLoadingIndicator';
import { ModalHost } from '../ActionWizard';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';
import { useContentLoader } from '@/hooks/useContentLoader';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import GlobalFooter from '../layout/GlobalFooter';
import { getLanguageFromPath } from '@/utils/routeMapping';

interface AppLayoutProps {
  locale?: 'sv' | 'en';
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const location = useLocation();
  const locale = getLanguageFromPath(location.pathname);
  
  // Initialize language persistence and content loading
  useLanguagePersistence();
  useContentLoader();
  
  // Automatically translate services when on English locale
  useAutoTranslate(locale);
  
  // Debug logging
  useEffect(() => {
    console.log('[AppLayout] Current locale:', locale, 'Path:', location.pathname);
  }, [locale, location.pathname]);
  
  return (
    <CopyProvider locale={locale} key={locale}>
      <EditModeProvider>
        <div className="min-h-screen bg-background" data-header="main">
          <Navigation />
          <main className="min-h-[60vh]">
            <Outlet key={`${locale}-${location.pathname}`} />
          </main>
          <GlobalFooter locale={locale} />
          <AIChat />
          <EditModeToggle />
          <GlobalContentEditor />
          <EditModeIndicator />
          <ContentLoadingIndicator />
          <ModalHost />
        </div>
      </EditModeProvider>
    </CopyProvider>
  );
};

export default AppLayout;