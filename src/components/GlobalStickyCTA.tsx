import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Calculator, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import OfferWizardModal from './OfferWizardModal';
import { FixcoFIcon } from '@/components/icons/FixcoFIcon';
import { useCopy } from '@/copy/CopyProvider';

const GlobalStickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showOfferWizard, setShowOfferWizard] = useState(false);
  const location = useLocation();
  const { t } = useCopy();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200;
      setIsScrolled(scrolled);
      
      const isMobile = window.innerWidth < 768;
      const shouldShow = isMobile || scrolled || location.pathname.startsWith('/tjanster/');
      setIsVisible(shouldShow && !isDismissed);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname, isDismissed]);

  useEffect(() => {
    setIsDismissed(false);
  }, [location.pathname]);

  const getContextualCta = () => {
    if (location.pathname.startsWith('/tjanster/')) {
      return { text: t('sticky.bookService'), icon: ArrowRight, variant: "default" as const };
    }
    if (location.pathname === '/kontakt') {
      return { text: t('sticky.callNow'), icon: Phone, variant: "default" as const };
    }
    return { text: t('sticky.requestQuote'), icon: Calculator, variant: "default" as const };
  };

  const contextualCta = getContextualCta();

  if (!isVisible) return null;

  return (
    <>
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-300",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Mobile CTA Bar */}
        <div className="md:hidden">
          <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-glow p-4 relative">
            <div className="absolute top-1 left-1 w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-20">
              <FixcoFIcon className="h-6 w-6" />
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDismissed(true)}
                className="shrink-0 w-8 h-8"
              >
                <X className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-primary/30 hover:bg-primary/10"
                onClick={() => window.open('tel:+46793350228')}
              >
                <Phone className="h-4 w-4" />
              </Button>

              <Button
                className="flex-1 gradient-primary text-primary-foreground font-medium"
                onClick={() => setShowOfferWizard(true)}
              >
                <contextualCta.icon className="h-4 w-4 mr-2" />
                {contextualCta.text}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop CTA Bar */}
        <div className="hidden md:block">
            <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-glow">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 flex items-center justify-center mr-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10">
                        <FixcoFIcon className="h-6 w-6" />
                      </div>
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">+46 79 335 02 28</span>
                    </div>
                  <div className="text-muted-foreground">
                    Uppsala & Stockholm
                  </div>
                  <div className="text-primary font-medium">
                    {t('sticky.rotDeduction')}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDismissed(true)}
                    className="w-8 h-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 hover:bg-primary/10"
                    onClick={() => window.open('tel:08-123-456-78')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {t('sticky.callNow')}
                  </Button>

                  <Button
                    size="sm"
                    className="gradient-primary text-primary-foreground font-medium hover:shadow-glow"
                    onClick={() => setShowOfferWizard(true)}
                  >
                    <contextualCta.icon className="h-4 w-4 mr-2" />
                    {contextualCta.text}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OfferWizardModal
        isOpen={showOfferWizard}
        onClose={() => setShowOfferWizard(false)}
      />
    </>
  );
};

export default GlobalStickyCTA;
