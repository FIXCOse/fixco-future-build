import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

const FloatingSettingsWidget = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1 bg-card border border-border shadow-lg rounded-full px-2 py-1">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>,
    document.body
  );
};

export default FloatingSettingsWidget;
