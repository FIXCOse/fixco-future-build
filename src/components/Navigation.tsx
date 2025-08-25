import { useState } from "react";
import { Menu, X, User, LogOut, MapPin, Phone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRole } from "@/hooks/useRole";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    // All pages visible to everyone
    const allItems = [
      { href: "/", label: "Hem" },
      { href: "/tjanster", label: "Tjänster" },
      { href: "/ai-assistent", label: "AI Assistent" },
      { href: "/mitt-fixco", label: "Mitt Fixco" },
      { href: "/smart-hem", label: "Smart Hem" },
      { href: "/naromrade", label: "Närområde" },
      { href: "/topplista", label: "Topplista" },
      { href: "/referenser", label: "Referenser" },
      { href: "/om-oss", label: "Om oss" },
      { href: "/kontakt", label: "Kontakt" },
    ];

    // Add admin link for admin/owner users
    if (isAdmin) {
      allItems.splice(4, 0, { href: "/admin", label: "Administration" });
    }

    return allItems;
  };

  const navItems = getNavItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png" 
              alt="Company Logo" 
              className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform"
            />
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <img 
                src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                alt="Fixco F" 
                className="h-3 w-3 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href} 
                className="text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>08-123 456 78</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Hela Sverige</span>
              </div>
            </div>
            
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/mitt-fixco">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Mitt Fixco</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logga ut</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Logga in
                  </Button>
                </Link>
                <Link to="/boka-hembesok">
                  <Button variant="cta-primary" size="sm">
                    Begär offert
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href} 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>08-123 456 78</span>
                </div>
                
                {user ? (
                  <div className="space-y-2">
                    <Link to="/mitt-fixco">
                      <Button variant="outline" size="sm" className="w-full flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-4 w-4" />
                        <span>Mitt Fixco</span>
                      </Button>
                    </Link>
                    <Link to="/mitt-fixco/settings">
                      <Button variant="ghost" size="sm" className="w-full flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="h-4 w-4" />
                        <span>Inställningar</span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full flex items-center space-x-2" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                      <LogOut className="h-4 w-4" />
                      <span>Logga ut</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/auth">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Logga in
                      </Button>
                    </Link>
                    <Link to="/boka-hembesok">
                      <Button variant="cta-primary" size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Begär offert
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};