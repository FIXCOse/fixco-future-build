import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryGrid from "@/components/CategoryGrid";
import FastServiceFilter from "@/components/FastServiceFilter";
import HeroMotion from "@/components/HeroMotion";
import TrustChips from "@/components/TrustChips";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-[100dvh] safe-area-top">
      <Navigation />
      <Breadcrumbs />
      
      {/* Hero Section - Mobile optimized */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-50" />
        <HeroMotion />
        
        <div className="container mx-auto container-mobile relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-fluid-5xl md:text-fluid-6xl font-bold mb-4 md:mb-6">
              Våra <span className="gradient-text">tjänster</span>
            </h1>
            <p className="text-fluid-lg text-muted-foreground mb-6 md:mb-8">
              Från små reparationer till stora byggnationer – vi har expertisen och erfarenheten 
              för att leverera professionella lösningar inom alla områden. 
              <span className="text-primary font-semibold"> Utnyttja ROT-avdraget och spara 50%.</span>
            </p>
            
            <TrustChips variant="services" maxVisible={6} />
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="spacing-lg">
        <div className="container mx-auto container-mobile">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-fluid-3xl font-bold mb-3 md:mb-4">Välj kategori</h2>
            <p className="text-muted-foreground text-fluid-base max-w-2xl mx-auto">
              Klicka på en kategori för att se alla tjänster och få detaljerad information om priser och tillgänglighet.
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* All Services with Filters */}
      <section className="spacing-lg bg-muted/5">
        <div className="container mx-auto container-mobile">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-fluid-3xl font-bold mb-3 md:mb-4">Alla tjänster</h2>
            <p className="text-muted-foreground text-fluid-base max-w-2xl mx-auto">
              Sök, filtrera och jämför våra tjänster snabbt och enkelt. 
              Allt du behöver är synligt direkt - inga gömda menyer.
            </p>
          </div>
          <FastServiceFilter />
        </div>
      </section>

      {/* ROT Info Section - Mobile optimized */}
      <section className="spacing-xl relative">
        <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
        
        <div className="container mx-auto container-mobile relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-fluid-4xl font-bold mb-6 md:mb-8">
              <span className="gradient-text">ROT-avdraget</span> – Spara 50% på arbetskostnaden
            </h2>
            <div className="responsive-grid-2 mb-8 md:mb-12">
              <div className="card-premium">
                <h3 className="text-fluid-2xl font-bold mb-3 md:mb-4">Vad är ROT-avdrag?</h3>
                <p className="text-muted-foreground text-fluid-base">
                  ROT-avdrag ger dig 50% rabatt på arbetskostnaden för reparation, om- och tillbyggnad 
                  samt underhållsarbeten i din bostad. Avdraget görs direkt från din skatt.
                </p>
              </div>
              <div className="card-premium">
                <h3 className="text-fluid-2xl font-bold mb-3 md:mb-4">Vi sköter allt</h3>
                <p className="text-muted-foreground text-fluid-base">
                  Fixco hanterar alla ROT-ansökningar åt dig. Du behöver bara godkänna arbetet, 
                  resten ordnar vi. Enkelt och bekvämt.
                </p>
              </div>
            </div>
            
            <Button 
              variant="cta-primary" 
              size="cta" 
              className="min-h-[var(--touch-target)] focus-outline"
              asChild
            >
              <Link to="/kontakt">
                Begär offert med ROT-avdrag
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;