import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CopyProvider } from '@/copy/CopyProvider';
import { EditModeProvider } from '@/contexts/EditModeContext';
import Navigation from '../Navigation';
import Navbar2 from '../Navbar2';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { usePersistedFeatureFlag } from '@/hooks/usePersistedFeatureFlag';

import { EditModeToggle } from '../EditModeToggle';
import { GlobalContentEditor } from '../GlobalContentEditor';
import EditModeIndicator from '../EditModeIndicator';
import { ContentLoadingIndicator } from '../ContentLoadingIndicator';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';
import { useContentLoader } from '@/hooks/useContentLoader';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import GlobalFooter from '../layout/GlobalFooter';
import { getLanguageFromPath } from '@/utils/routeMapping';
import { FloatingAIWidget } from '../FloatingAIWidget';

interface AppLayoutProps {
  locale?: 'sv' | 'en';
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const location = useLocation();
  const locale = getLanguageFromPath(location.pathname);
  
  // Check if AI chat is enabled
  const { data: chatEnabled, isLoading: chatLoading } = useFeatureFlag('chat_ai_enabled');
  
  // Check which menu to show (TOP Navigation vs BOTTOM Navbar2)
  const { data: useTopMenu } = usePersistedFeatureFlag('use_top_menu', false);
  
  // Initialize language persistence
  useLanguagePersistence();
  // Note: useContentLoader moved to App.tsx for global loading
  
  // Automatically translate services when on English locale
  useAutoTranslate(locale);
  
  // Debug logging
  useEffect(() => {
    console.log('[AppLayout] Current locale:', locale, 'Path:', location.pathname);
  }, [locale, location.pathname]);
  
  useEffect(() => {
    console.log('💬 [AppLayout] chatEnabled:', chatEnabled, 'isLoading:', chatLoading);
  }, [chatEnabled, chatLoading]);
  
  useEffect(() => {
    console.log('🎨 [AppLayout] useTopMenu:', useTopMenu);
  }, [useTopMenu]);
  
  return (
    <CopyProvider locale={locale} key={locale}>
      <EditModeProvider>
        <div className="min-h-screen bg-background" data-header="main">
        {/* TOP meny - visa ENDAST om toggle INTE är bottom */}
        {useTopMenu !== false && <Navigation />}
          
          <main className="min-h-[60vh]">
            <Outlet />
          </main>
          
          <GlobalFooter locale={locale} />
          
          {/* BOTTOM meny - visa bara om feature flag är explicit false */}
          {useTopMenu === false && <Navbar2 />}
          
          <EditModeToggle />
          <GlobalContentEditor />
          <EditModeIndicator />
          <ContentLoadingIndicator />
          {chatEnabled && <FloatingAIWidget />}
        </div>
      </EditModeProvider>
    </CopyProvider>
  );
};

export default AppLayout;