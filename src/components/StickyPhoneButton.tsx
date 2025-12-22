import { Phone, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './StickyPhoneButton.css';

export const StickyPhoneButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Only render via portal in browser
  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed bottom-28 md:bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Responstid badge - hidden on mobile */}
      <div className="bg-card shadow-lg rounded-full px-4 py-2 hidden md:flex items-center gap-2 text-sm border border-border/50 animate-pulse">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-foreground">
          Vi svarar inom <strong className="text-primary">2 timmar</strong>
        </span>
      </div>
      
      {/* Phone button */}
      <a
        href="tel:+46793350228"
        className="sticky-phone-button"
        aria-label="Ring oss på 079-335 02 28"
      >
        <span className="sticky-phone-button-text">
          <Phone className="w-5 h-5" />
          Ring Oss
        </span>
      </a>
    </div>,
    document.body
  );
};
