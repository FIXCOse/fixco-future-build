import { Phone } from 'lucide-react';
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
    <a
      href="tel:+46793350228"
      className="sticky-phone-button"
      aria-label="Ring oss på 079-335 02 28"
    >
      <span className="sticky-phone-button-text">
        <Phone className="w-5 h-5" />
        Ring Oss
      </span>
    </a>,
    document.body
  );
};
