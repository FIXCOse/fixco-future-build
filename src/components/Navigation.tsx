import { useState } from "react";
import { Menu, X, User, LogOut, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCopy } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { isAdmin, isOwner } = useRole();
  const { t } = useCopy();
  const { currentLanguage } = useLanguagePersistence();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
      navigate(currentLanguage === 'en' ? '/en' : '/');
      toast.success(currentLanguage === 'en' ? 'You have been logged out' : 'Du har loggats ut');
    } catch (error) {
      toast.error(currentLanguage === 'en' ? 'Could not log out' : 'Kunde inte logga ut');
    }
  };

  const getNavItems = () => {
    // For admin/owner users, show only admin-relevant items
    if (isAdmin || isOwner) {
      return [
        { href: currentLanguage === 'en' ? "/en/admin" : "/mitt-fixco", label: t('nav.adminPanel') },
      ];
    }

    // Determine base path for language
    const basePath = currentLanguage === 'en' ? '/en' : '';
    
    // For regular users, show all navigation items
    return [
      { href: currentLanguage === 'en' ? "/en" : "/", label: t('nav.home') },
      { href: `${basePath}/tjanster`, label: t('nav.services') },
      { href: `${basePath}/smart-hem`, label: t('nav.smartHome') },
      { href: `${basePath}/referenser`, label: t('nav.references') },
      { href: `${basePath}/om-oss`, label: t('nav.about') },
      { href: `${basePath}/kontakt`, label: t('nav.contact') },
    ];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border" style={{ "--header-h": "64px" } as any}>
      <nav className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo with Proper Spacing */}
          <div className="flex items-center">
            <Link 
              to={currentLanguage === 'en' ? "/en" : "/"} 
              className="inline-flex items-center py-2 group flex-shrink-0"
            >
              <img 
                src="/assets/fixco-logo-black.png" 
                alt={currentLanguage === 'en' ? "FIXCO - Your Complete Solution" : "FIXCO - Din Helhetslösning"} 
                className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
                style={{ minWidth: '80px', maxWidth: '140px' }}
              />
            </Link>
          </div>

          {/* Center: Navigation - Desktop Only */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200",
                    "text-foreground hover:text-primary hover:bg-primary/10",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive(item.href) && "text-primary bg-primary/10 font-semibold"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions with Proper Spacing */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Contact - Desktop Only */}
            <a 
              href="tel:+46812345678" 
              className="hidden lg:inline-flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted whitespace-nowrap"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline font-medium">08-123 456 78</span>
            </a>
            
            {/* User Actions - Desktop */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-2">
                     <Link to={currentLanguage === 'en' ? "/en/admin" : "/mitt-fixco"}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-3 inline-flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden xl:inline">{(isAdmin || isOwner) ? t('nav.adminPanel') : t('nav.myFixco')}</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="h-9 px-3 inline-flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden xl:inline">{currentLanguage === 'en' ? 'Log out' : 'Logga ut'}</span>
                    </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                    <Link to="/auth">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-9 px-3"
                      >
                        <span className="hidden xl:inline">{t('cta.login')}</span>
                        <span className="xl:hidden">Login</span>
                      </Button>
                    </Link>
                    <Link to={currentLanguage === 'en' ? "/en/book-visit" : "/boka-hembesok"}>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                      >
                        <span className="hidden xl:inline">{t('cta.request_quote')}</span>
                        <span className="xl:hidden">{t('cta.get_quote')}</span>
                      </Button>
                    </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden inline-flex items-center h-10 px-4 hover:bg-muted rounded-md transition-colors ml-2"
              aria-label={currentLanguage === 'en' ? 'Open menu' : 'Öppna meny'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="py-4 space-y-2">
              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center py-3 px-4 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors",
                      isActive(item.href) && "text-primary font-medium bg-muted"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="pt-4 space-y-3 border-t border-border">
                <a 
                  href="tel:+46812345678" 
                  className="flex items-center gap-x-2 px-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>08-123 456 78</span>
                </a>

                {user ? (
                  <div className="space-y-2 px-4">
                    <Link to={currentLanguage === 'en' ? "/en/admin" : "/mitt-fixco"} onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start gap-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>{(isAdmin || isOwner) ? t('nav.adminPanel') : t('nav.myFixco')}</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-x-2" 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{currentLanguage === 'en' ? 'Log out' : 'Logga ut'}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        <span>{t('cta.login')}</span>
                      </Button>
                    </Link>
                    <Link to={currentLanguage === 'en' ? "/en/book-visit" : "/boka-hembesok"} onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {t('cta.request_quote')}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};