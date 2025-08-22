import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button-premium";
import { Phone, MessageSquare, Calculator, Calendar } from "lucide-react";

const StickyCtaBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 200);
      
      // Show on service pages and after scrolling
      const showOnPages = ['/tjanster', '/kontakt', '/om-oss'];
      const shouldShow = scrollY > 400 || showOnPages.some(path => location.pathname.startsWith(path));
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Context-aware CTA text based on current page
  const getContextualCta = () => {
    if (location.pathname.startsWith('/tjanster/')) {
      return { text: "Boka denna tjänst", icon: Calendar, variant: "cta" as const };
    }
    if (location.pathname === '/kontakt') {
      return { text: "Ring direkt", icon: Phone, variant: "hero" as const };
    }
    return { text: "Begär offert", icon: Calculator, variant: "cta" as const };
  };

  const contextualCta = getContextualCta();
  const CtaIcon = contextualCta.icon;

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-premium">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Contact Info - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>08-123 456 78</span>
              </div>
              <div className="text-muted-foreground">
                Uppsala & Stockholm
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
              {/* Mobile: WhatsApp button */}
              <Button 
                variant="ghost-premium" 
                size="sm" 
                className="sm:hidden flex-1"
                onClick={() => window.open('https://wa.me/46812345678', '_blank')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>

              {/* Mobile: Call button */}
              <Button 
                variant="ghost-premium" 
                size="sm" 
                className="sm:hidden flex-1"
                onClick={() => window.open('tel:+46812345678')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Ring
              </Button>

              {/* Desktop: All buttons */}
              <Button 
                variant="ghost-premium" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => window.open('https://wa.me/46812345678', '_blank')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>

              <Button 
                variant="ghost-premium" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => window.open('tel:+46812345678')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Ring oss
              </Button>

              {/* Main CTA - Context aware */}
              <Button 
                variant={contextualCta.variant}
                size="sm"
                className="shadow-glow animate-glow"
              >
                <CtaIcon className="h-4 w-4 mr-2" />
                {contextualCta.text}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCtaBar;