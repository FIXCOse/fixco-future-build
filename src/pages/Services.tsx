import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryGrid from "@/components/CategoryGrid";
import FastServiceFilter from "@/components/FastServiceFilter";
import HeroMotion from "@/components/HeroMotion";
import TrustChips from "@/components/TrustChips";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-50" />
        <HeroMotion />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Våra <span className="gradient-text">tjänster</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Från små reparationer till stora byggnationer – vi har expertisen och erfarenheten 
              för att leverera professionella lösningar inom alla områden. 
              <span className="text-primary font-semibold"> Utnyttja ROT-avdraget och spara 50%.</span>
            </p>
            
            <TrustChips variant="services" showAll={true} />
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Välj kategori</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Klicka på en kategori för att se alla tjänster och få detaljerad information om priser och tillgänglighet.
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* All Services with Filters */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Alla tjänster</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sök, filtrera och jämför våra tjänster snabbt och enkelt. 
              Allt du behöver är synligt direkt - inga gömda menyer.
            </p>
          </div>
          <FastServiceFilter />
        </div>
      </section>

      {/* ROT Info Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              <span className="gradient-text">ROT-avdraget</span> – Spara 50% på arbetskostnaden
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4">Vad är ROT-avdrag?</h3>
                <p className="text-muted-foreground">
                  ROT-avdrag ger dig 50% rabatt på arbetskostnaden för reparation, om- och tillbyggnad 
                  samt underhållsarbeten i din bostad. Avdraget görs direkt från din skatt.
                </p>
              </div>
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4">Vi sköter allt</h3>
                <p className="text-muted-foreground">
                  Fixco hanterar alla ROT-ansökningar åt dig. Du behöver bara godkänna arbetet, 
                  resten ordnar vi. Enkelt och bekvämt.
                </p>
              </div>
            </div>
            
            <Link to="/kontakt">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Begär offert med ROT-avdrag
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;