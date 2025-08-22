import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-construction.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 hero-background">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-gradient" />
      </div>
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional construction work" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Stora</span> eller{" "}
              <span className="gradient-text">små</span> projekt –{" "}
              <br />
              <span className="text-foreground">Fixco hanterar</span>{" "}
              <span className="gradient-text animate-float">allt</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
              Snabbare, billigare och mer professionellt än våra konkurrenter. 
              <span className="text-primary font-semibold"> Start inom 24h.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/kontakt" className="w-full sm:w-auto">
                <Button
                  variant="cta-primary"
                  size="cta"
                  className="w-full sm:w-auto"
                >
                  Begär offert
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/tjanster" className="w-full sm:w-auto">
                <Button
                  variant="cta-secondary"
                  size="cta"
                  className="w-full sm:w-auto"
                >
                  Se våra tjänster
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-glow" />
                <span>ROT-avdrag: <span className="text-primary font-semibold">50% rabatt</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-glow" />
                <span>Nationell täckning: <span className="text-primary font-semibold">Hela Sverige</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-glow" />
                <span>Snabb start: <span className="text-primary font-semibold">Inom 24h</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-10 w-12 h-12 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
    </section>
  );
};

export default Hero;