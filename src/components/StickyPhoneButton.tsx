import { Phone } from 'lucide-react';
import './StickyPhoneButton.css';

export const StickyPhoneButton = () => {
  return (
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
  );
};
