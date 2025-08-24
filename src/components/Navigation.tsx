import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button-premium";
import { Menu, X, Phone, MapPin, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte logga ut",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Utloggad",
        description: "Du har loggats ut"
      });
      navigate('/');
    }
  };

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
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Hem
            </Link>
            <Link to="/tjanster" className="text-foreground hover:text-primary transition-colors">
              Tjänster
            </Link>
            <Link to="/om-oss" className="text-foreground hover:text-primary transition-colors">
              Om oss
            </Link>
            <Link to="/faq" className="text-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/referenser" className="text-foreground hover:text-primary transition-colors">
              Referenser
            </Link>
            <Link to="/kontakt" className="text-foreground hover:text-primary transition-colors">
              Kontakt
            </Link>
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
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/mitt-fixco">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Mitt Fixco</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center space-x-2">
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
                <Button variant="hero" size="sm">
                  Begär offert
                </Button>
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
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hem
              </Link>
              <Link 
                to="/tjanster" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tjänster
              </Link>
              <Link 
                to="/om-oss" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Om oss
              </Link>
              <Link 
                to="/faq" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                to="/referenser" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Referenser
              </Link>
              <Link 
                to="/kontakt" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
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
                    <Button variant="ghost" size="sm" className="w-full flex items-center space-x-2" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
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
                    <Button variant="hero" size="sm" className="w-full">
                      Begär offert
                    </Button>
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

export default Navigation;