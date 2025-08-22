import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import FastServiceFilter from "@/components/FastServiceFilter";
import ROTToggle from "@/components/ROTToggle";
import HeroMotion from "@/components/HeroMotion";
import TrustCues from "@/components/TrustCues";
import { Button } from "@/components/ui/button-premium";
import { servicesData } from "@/data/servicesData";
import { ArrowRight } from "lucide-react";

const Services = () => {
  const [showROTPrice, setShowROTPrice] = useState(true);

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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="cta" size="lg">
                Begär offert
              </Button>
              <Button variant="ghost-premium" size="lg">
                Ring 08-123 456 78
              </Button>
            </div>
            
            <TrustCues variant="minimal" />
          </div>
        </div>
      </section>

      {/* Fast Service Filter */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hitta rätt tjänst</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sök, filtrera och jämför våra tjänster snabbt och enkelt. 
              Allt du behöver är synligt direkt - inga gömda menyer.
            </p>
          </div>
          <FastServiceFilter />
        </div>
      </section>

      {/* ROT Price Toggle */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ROTToggle 
              defaultEnabled={showROTPrice}
              onChange={setShowROTPrice}
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Alla våra tjänster</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Komplett översikt över våra tjänster med transparent prissättning. 
              Alla priser inkluderar moms och kan kombineras med ROT-avdrag.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicesData.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={service.slug}
                  className="card-premium p-4 group hover:shadow-glow transition-all duration-300 animate-fade-in-up hover-scale"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 gradient-primary-subtle rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  {/* Sub-services count */}
                  <div className="mb-4">
                    <div className="text-xs text-primary font-semibold">
                      {service.subServices.length} TJÄNSTER TILLGÄNGLIGA
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-border pt-3 mb-4">
                    {showROTPrice ? (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Ordinarie:</span>
                          <span className="text-xs line-through text-muted-foreground">{service.basePrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-primary">Med ROT:</span>
                          <span className="text-sm font-bold gradient-text">{service.rotPrice}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold">Pris från:</span>
                        <span className="text-sm font-bold">{service.basePrice}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link to={`/tjanster/${service.slug}`}>
                    <Button variant="premium" size="sm" className="w-full group">
                      Se alla tjänster
                      <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
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
            
            <Button variant="cta" size="xl">
              Begär offert med ROT-avdrag
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;