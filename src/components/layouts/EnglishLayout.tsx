import React from 'react';
import { Outlet } from 'react-router-dom';
import EnglishNavigation from './EnglishNavigation';
import StickyCtaBar from '../StickyCtaBar';
import StickyCTA from '../StickyCTA';
import AIChat from '../AIChat';
import { ModalHost } from '../ActionWizard';

const EnglishLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <EnglishNavigation />
      <main>
        <Outlet />
      </main>
      <StickyCtaBar />
      <StickyCTA />
      <AIChat />
      <ModalHost />
    </div>
  );
};

export default EnglishLayout;