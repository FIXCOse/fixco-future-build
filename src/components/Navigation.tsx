import { useState } from "react";
import { Menu, X, User, LogOut, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRole } from "@/hooks/useRole";
import { LanguageSelector } from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { isAdmin } = useRole();

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
      navigate('/');
      toast.success('Du har loggats ut');
    } catch (error) {
      toast.error('Kunde inte logga ut');
    }
  };

  const getNavItems = () => {
    const allItems = [
      { href: "/", label: "Hem" },
      { href: "/tjanster", label: "Tjänster" },
      { href: "/smart-hem", label: "Smart Hem" },
      { href: "/referenser", label: "Referenser" },
      { href: "/om-oss", label: "Om oss" },
      { href: "/kontakt", label: "Kontakt" },
    ];

    if (isAdmin) {
      allItems.splice(-2, 0, { href: "/admin", label: "Administration" });
    }

    return allItems;
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border" style={{ "--header-h": "64px" } as any}>
      <nav className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-10">
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-x-4 md:gap-x-6 min-h-[48px] md:min-h-[56px] lg:min-h-[64px]">
          
          {/* Left: Logo Only */}
          <Link 
            to="/" 
            className="inline-flex items-center h-[var(--header-h)] mr-2 md:mr-4 group"
          >
            <img 
              src="/assets/fixco-logo-black.png" 
              alt="FIXCO - Din Helhetslösning" 
              className="h-6 md:h-7 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Center: F Icon + Primary Navigation - No Wrap, XL+ Only */}
          <div className="hidden xl:flex items-center flex-nowrap justify-center gap-x-[clamp(12px,1.2vw,22px)] min-w-0">
            {/* F Icon positioned before navigation */}
            <img 
              src="/assets/fixco-f-icon-black.png" 
              alt="F" 
              className="h-5 w-5 opacity-70 mr-2"
            />
            <ul className="flex items-center flex-nowrap gap-x-[clamp(12px,1.2vw,22px)]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "inline-flex items-center h-[var(--header-h)] px-3 md:px-3.5 lg:px-4 whitespace-nowrap",
                      "text-foreground hover:text-primary transition-colors",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "hover:underline underline-offset-4 decoration-2",
                      isActive(item.href) && "text-primary font-medium"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Secondary Actions - Single Line, No Wrap */}
          <div className="flex items-center gap-x-3 md:gap-x-4 whitespace-nowrap">
            {/* Contact (Compact for Space) */}
            <a 
              href="tel:+46812345678" 
              className="hidden lg:inline-flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">08-123 456 78</span>
              <span className="xl:hidden">08-123</span>
            </a>
            
            {/* Language Selector (Desktop) */}
            <div className="hidden lg:block">
              <LanguageSelector />
            </div>
            
            {/* User Actions */}
            {user ? (
              <div className="hidden lg:flex items-center gap-x-2">
                <Link to="/mitt-fixco">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 md:h-10 px-2 md:px-3 inline-flex items-center gap-x-1 whitespace-nowrap"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden xl:inline">Mitt Fixco</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="h-9 md:h-10 px-2 md:px-3 inline-flex items-center gap-x-1 whitespace-nowrap"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">Logga ut</span>
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-x-2">
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-9 md:h-10 px-2 md:px-3 whitespace-nowrap"
                  >
                    <span className="hidden xl:inline">Logga in</span>
                    <span className="xl:hidden">Login</span>
                  </Button>
                </Link>
                <Link to="/boka-hembesok">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="h-9 md:h-10 px-2 md:px-3 bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
                  >
                    <span className="hidden xl:inline">Begär offert</span>
                    <span className="xl:hidden">Offert</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button - Shows XL and below */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden inline-flex items-center h-9 px-3 hover:bg-muted rounded-md transition-colors"
              aria-label="Öppna meny"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay - Shows XL and below */}
        {isMenuOpen && (
          <div className="xl:hidden border-t border-border bg-background">
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
                
                <div className="px-4">
                  <LanguageSelector />
                </div>

                {user ? (
                  <div className="space-y-2 px-4">
                    <Link to="/mitt-fixco" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start gap-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Mitt Fixco</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-x-2" 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logga ut</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Logga in
                      </Button>
                    </Link>
                    <Link to="/boka-hembesok" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Begär offert
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