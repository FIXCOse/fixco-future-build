import { Phone, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useCopy } from '@/copy/CopyProvider';
import './StickyPhoneButton.css';

export const StickyPhoneButton = () => {
  const [mounted, setMounted] = useState(false);
  const { t } = useCopy();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed bottom-28 md:bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Response time badge - hidden on mobile */}
      <div className="bg-card shadow-lg rounded-full px-4 py-2 hidden md:flex items-center gap-2 text-sm border border-border/50 animate-pulse">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-foreground">
          {t('sticky.responseTime')}
        </span>
      </div>
      
      {/* Phone button */}
      <a
        href="tel:+46793350228"
        className="sticky-phone-button"
        aria-label={t('sticky.callLabel')}
      >
        <span className="sticky-phone-button-text">
          <Phone className="w-5 h-5" />
          {t('sticky.callUs')}
        </span>
      </a>
    </div>,
    document.body
  );
};
