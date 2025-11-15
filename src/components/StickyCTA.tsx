import { useState, useEffect } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const threshold = window.innerHeight * 0.3; // 30% scroll
      
      if (scrolled > threshold && !isDismissed) {
        setIsVisible(true);
      } else if (scrolled <= threshold) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hej! Jag är intresserad av era tjänster.');
    window.open(`https://wa.me/46793350228?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+46793350228';
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-xs z-50"
        >
          <div className="bg-card border border-primary/20 rounded-xl shadow-premium p-4 backdrop-blur-sm">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              aria-label="Stäng"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="mb-3">
              <h3 className="font-semibold text-sm mb-1">Behöver du hjälp?</h3>
              <p className="text-xs text-muted-foreground">
                Ring oss eller skriv på WhatsApp
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleCall}
                size="sm"
                className="flex-1 bg-gradient-rainbow text-white hover:opacity-90"
              >
                <Phone className="h-4 w-4 mr-1" />
                Ring
              </Button>
              <Button
                onClick={handleWhatsApp}
                size="sm"
                variant="outline"
                className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;