import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Calculator, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import OfferWizardModal from './OfferWizardModal';

const GlobalStickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showOfferWizard, setShowOfferWizard] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200;
      setIsScrolled(scrolled);
      
      // Show CTA after scrolling 200px or when on service pages
      const shouldShow = scrolled || location.pathname.startsWith('/tjanster/');
      setIsVisible(shouldShow && !isDismissed);
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, isDismissed]);

  // Reset dismissed state when navigating to new page
  useEffect(() => {
    setIsDismissed(false);
  }, [location.pathname]);

  const getContextualCta = () => {
    if (location.pathname.startsWith('/tjanster/')) {
      return {
        text: "Boka denna tjänst",
        icon: ArrowRight,
        variant: "default" as const
      };
    }
    
    if (location.pathname === '/kontakt') {
      return {
        text: "Ring nu",
        icon: Phone,
        variant: "default" as const
      };
    }

    return {
      text: "Begär offert",
      icon: Calculator,
      variant: "default" as const
    };
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
            {/* F Brand Badge - Make More Visible */}
            <div className="absolute top-1 left-1 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-20">
              <img 
                src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                alt="Fixco" 
                className="h-4 w-4 object-contain opacity-95"
              />
            </div>

            <div className="flex items-center space-x-3">
              {/* Dismiss Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDismissed(true)}
                className="shrink-0 w-8 h-8"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Phone Button */}
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-primary/30 hover:bg-primary/10"
                onClick={() => window.open('tel:08-123-456-78')}
              >
                <Phone className="h-4 w-4" />
              </Button>

              {/* Main CTA */}
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
                  {/* Contact Info with F Brand */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10">
                        <img 
                          src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                          alt="Fixco" 
                          className="h-4 w-4 object-contain opacity-95"
                        />
                      </div>
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">08-123 456 78</span>
                    </div>
                  <div className="text-muted-foreground">
                    Uppsala & Stockholm
                  </div>
                  <div className="text-primary font-medium">
                    ROT-avdrag 50%
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {/* Dismiss Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDismissed(true)}
                    className="w-8 h-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Phone CTA */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 hover:bg-primary/10"
                    onClick={() => window.open('tel:08-123-456-78')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Ring nu
                  </Button>

                  {/* Main CTA */}
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

      {/* Offer Wizard Modal */}
      <OfferWizardModal
        isOpen={showOfferWizard}
        onClose={() => setShowOfferWizard(false)}
      />
    </>
  );
};

export default GlobalStickyCTA;