import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button-premium";
import { Menu, X, Phone, MapPin } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png" 
              alt="Company Logo" 
              className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform"
            />
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
            <Button variant="hero" size="sm">
              Begär offert
            </Button>
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
                <Button variant="hero" size="sm" className="w-full">
                  Begär offert
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;