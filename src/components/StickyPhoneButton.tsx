import { Phone } from 'lucide-react';

export const StickyPhoneButton = () => {
  return (
    <a
      href="tel:+46793350228"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[4999] 
        w-14 h-14 rounded-full bg-primary hover:bg-primary/90
        flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all duration-300 hover:scale-110
        animate-pulse hover:animate-none
        group"
      aria-label="Ring oss på 079-335 02 28"
    >
      <Phone className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform" />
    </a>
  );
};
