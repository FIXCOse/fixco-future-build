import { Phone } from 'lucide-react';

export const StickyPhoneButton = () => {
  return (
    <a
      href="tel:+46793350228"
      className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[9999] 
        px-4 py-3 rounded-full
        bg-gradient-to-b from-primary to-primary/80
        hover:from-primary/90 hover:to-primary/70
        flex items-center gap-2
        shadow-lg hover:shadow-xl
        shadow-[inset_0_2px_3px_rgba(255,255,255,0.72)]
        transition-all duration-300 hover:scale-105
        group"
      aria-label="Ring oss på 079-335 02 28"
    >
      <Phone className="w-5 h-5 text-primary-foreground" />
      <span className="text-primary-foreground font-semibold text-sm">
        Ring Oss
      </span>
    </a>
  );
};
