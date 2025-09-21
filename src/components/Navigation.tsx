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
          
          {/* Left: Logo */}
          <Link 
            to="/" 
            className="inline-flex items-center h-[var(--header-h)] mr-2 md:mr-4 group"
          >
            <img 
              src="/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png" 
              alt="Company Logo" 
              className="h-6 md:h-7 w-auto group-hover:scale-105 transition-transform"
            />
            <div className="ml-2 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <img 
                src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                alt="Fixco F" 
                className="h-3 w-3 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>

          {/* Center: Primary Navigation */}
          <ul className="hidden lg:flex items-center justify-center gap-x-[clamp(12px,1.2vw,24px)]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "inline-flex items-center h-[var(--header-h)] px-3 md:px-3.5 lg:px-4",
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

          {/* Right: Secondary Actions */}
          <div className="flex items-center gap-x-3 md:gap-x-4">
            {/* Contact (Desktop only) */}
            <div className="hidden xl:flex items-center gap-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-x-1">
                <Phone className="h-4 w-4" />
                <span>08-123 456 78</span>
              </div>
            </div>
            
            {/* Language Selector (Desktop) */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            
            {/* User Actions */}
            {user ? (
              <div className="hidden md:flex items-center gap-x-3">
                <Link to="/mitt-fixco">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 md:h-10 px-3.5 md:px-4 inline-flex items-center gap-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Mitt Fixco</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="h-9 md:h-10 px-3.5 md:px-4 inline-flex items-center gap-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logga ut</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-x-3">
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-9 md:h-10 px-3.5 md:px-4"
                  >
                    Logga in
                  </Button>
                </Link>
                <Link to="/boka-hembesok">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="h-9 md:h-10 px-3.5 md:px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Begär offert
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden inline-flex items-center h-9 px-3.5 hover:bg-muted rounded-md transition-colors"
              aria-label="Öppna meny"
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
                <div className="flex items-center gap-x-2 px-4 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>08-123 456 78</span>
                </div>
                
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