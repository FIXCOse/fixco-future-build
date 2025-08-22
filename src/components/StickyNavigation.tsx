import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const StickyNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Tjänster', href: '/tjanster' },
    { name: 'Referenser', href: '/referenser' },
    { name: 'Om oss', href: '/om-oss' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Kontakt', href: '/kontakt' }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-card" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto container-mobile">
        <div className="flex items-center justify-between min-h-[var(--touch-target)] md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group min-h-[var(--touch-target)] focus-outline">
            <div className="text-fluid-xl md:text-fluid-3xl font-bold gradient-text group-hover:scale-105 transition-transform">
              Fixco
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-fluid-sm font-medium transition-colors hover:text-primary min-h-[var(--touch-target)] flex items-center focus-outline",
                  location.pathname === item.href 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:bg-primary/10 min-h-[var(--touch-target)] focus-outline"
              onClick={() => window.open('tel:08-123-456-78')}
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden xl:inline">08-123 456 78</span>
              <span className="xl:hidden">Ring</span>
            </Button>
            <Button 
              variant="cta-primary" 
              size="cta" 
              className="group min-h-[var(--touch-target)] focus-outline" 
              asChild
            >
              <Link to="/kontakt">
                <span className="hidden xl:inline">Begär offert</span>
                <span className="xl:hidden">Offert</span>
                <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors min-h-[var(--touch-target)] min-w-[var(--touch-target)] focus-outline"
            aria-label={isMobileMenuOpen ? "Stäng meny" : "Öppna meny"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md safe-area-bottom">
            <nav className="flex flex-col spacing-xs">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-fluid-base font-medium transition-colors hover:text-primary min-h-[var(--touch-target)] flex items-center focus-outline",
                    location.pathname === item.href 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 px-4 py-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start text-primary hover:bg-primary/10 min-h-[var(--touch-target)] focus-outline w-full"
                  onClick={() => {
                    window.open('tel:08-123-456-78');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  08-123 456 78
                </Button>
                <Button 
                  variant="cta-primary" 
                  size="cta" 
                  className="group w-full min-h-[var(--touch-target)] focus-outline" 
                  asChild
                >
                  <Link to="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>
                    Begär offert
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default StickyNavigation;