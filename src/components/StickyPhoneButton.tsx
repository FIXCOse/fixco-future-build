import { Phone } from 'lucide-react';
import './GradientButton.css';

export const StickyPhoneButton = () => {
  return (
    <a
      href="tel:+46793350228"
      className="gradient-button fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[9999] 
        !px-4 !py-3 !rounded-full"
      aria-label="Ring oss på 079-335 02 28"
    >
      <span className="gradient-button-text flex items-center gap-2">
        <Phone className="w-5 h-5" />
        Ring Oss
      </span>
    </a>
  );
};
