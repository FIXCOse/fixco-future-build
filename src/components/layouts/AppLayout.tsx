import React from 'react';
import { Outlet } from 'react-router-dom';
import { LocaleProvider } from '../LocaleProvider';
import Navigation from '../Navigation';
import StickyCtaBar from '../StickyCtaBar';
import StickyCTA from '../StickyCTA';
import AIChat from '../AIChat';
import { ModalHost } from '../ActionWizard';
import { Locale } from '@/i18n/context';

interface AppLayoutProps {
  locale?: Locale;
}

const AppLayout: React.FC<AppLayoutProps> = ({ locale = 'sv' }) => {
  return (
    <LocaleProvider locale={locale}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Outlet />
        </main>
        <StickyCtaBar />
        <StickyCTA />
        <AIChat />
        <ModalHost />
      </div>
    </LocaleProvider>
  );
};

export default AppLayout;