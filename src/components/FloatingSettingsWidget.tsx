import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1 bg-card border border-border shadow-lg rounded-full px-2 py-1">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  );
};

export default FloatingSettingsWidget;
