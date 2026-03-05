import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

const HIDDEN_ROUTES = ['/q/', '/invoice/', '/offert/', '/faktura/'];

const FloatingSettingsWidget = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const shouldHide = HIDDEN_ROUTES.some(r => location.pathname.startsWith(r));

  if (!mounted || typeof document === 'undefined' || shouldHide) {
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
