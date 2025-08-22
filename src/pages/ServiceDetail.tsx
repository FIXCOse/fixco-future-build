import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button-premium";
import { ArrowRight, CheckCircle, Star, Clock } from "lucide-react";

const serviceData = {
  "snickeri": {
    title: "Snickeri",
    description: "Professionell snickeriservice för kök, badrum, inredning och skräddarsydda möbler",
    hero: "Vi är experter på alla typer av träarbeten och snickeriprojekt. Från kompletta köksrenovering till skräddarsydda förvaringslösningar.",
    services: [
      {
        name: "Köksrenovering",
        description: "Komplett köksrenovering med skräddarsydda lösningar",
        features: ["Design och planering", "Skåpstillverkning", "Bänkskivor", "Installation", "Målning"]
      },
      {
        name: "Badrumsinredning", 
        description: "Snygga och funktionella badrumslösningar",
        features: ["Badrumsskap", "Spegelmöbler", "Handdukstorkar", "Hyllsystem", "Målning"]
      },
      {
        name: "Skräddarsydda skåp",
        description: "Förvaringslösningar anpassade för dina behov",
        features: ["Garderobsystem", "Loft- och källarförvaring", "Skoförvaring", "Leksaksförvaring", "Kontorsförvaring"]
      },
      {
        name: "Trappor",
        description: "Nya trappor eller renovering av befintliga",
        features: ["Räcken och handledare", "Steg och avsatser", "Spiraltrappor", "Ytbehandling", "Säkerhetsglas"]
      },
      {
        name: "Dörrar & fönster",
        description: "Installation och reparation av dörrar och fönster",
        features: ["Inre dörrar", "Skjutdörrar", "Fönsterrenovering", "Karmar och lister", "Tätningar"]
      }
    ],
    basePrice: "959",
    rotPrice: "480",
    startTime: "24-48h",
    warranty: "5 år garanti"
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceData[slug as keyof typeof serviceData];

  if (!service) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 text-center">
          <h1 className="text-4xl font-bold">Tjänst inte hittad</h1>
          <p className="text-muted-foreground mt-4">Den tjänst du letar efter finns inte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">{service.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {service.description}
            </p>
            <p className="text-lg mb-8">
              {service.hero}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="cta" size="xl">
                Begär offert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="ghost-premium" size="xl">
                Ring 08-123 456 78
              </Button>
            </div>

            {/* Key metrics */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="card-premium p-4">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Projektstart</div>
                <div className="font-bold">{service.startTime}</div>
              </div>
              <div className="card-premium p-4">
                <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Garanti</div>
                <div className="font-bold">{service.warranty}</div>
              </div>
              <div className="card-premium p-4">
                <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">ROT-avdrag</div>
                <div className="font-bold gradient-text">50% rabatt</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Våra <span className="gradient-text">{service.title.toLowerCase()}</span> tjänster
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {service.services.map((subService, index) => (
              <div 
                key={subService.name}
                className="card-premium p-8 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-2xl font-bold mb-4">{subService.name}</h3>
                <p className="text-muted-foreground mb-6">{subService.description}</p>
                
                <div className="space-y-3 mb-8">
                  {subService.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="border-t border-border pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Ordinarie pris:</span>
                    <span className="font-semibold line-through text-muted-foreground">{service.basePrice} kr/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">Med ROT-avdrag:</span>
                    <span className="text-2xl font-bold gradient-text">{service.rotPrice} kr/h</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">inkl. moms</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Redo att starta ditt <span className="gradient-text">{service.title.toLowerCase()}</span> projekt?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Få en kostnadsfri offert inom 24 timmar. Vi hjälper dig från idé till färdigt resultat.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4 gradient-text">Kostnadsfri offert</h3>
                <p className="text-muted-foreground mb-6">
                  Vi kommer hem till dig och gör en noggrann genomgång av ditt projekt. 
                  Offerten är alltid kostnadsfri och utan förpliktelser.
                </p>
                <Button variant="cta" className="w-full">
                  Boka hembesök
                </Button>
              </div>
              
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4 gradient-text">ROT-avdrag direkt</h3>
                <p className="text-muted-foreground mb-6">
                  Vi hjälper dig med alla ROT-papper och du betalar direkt det rabatterade priset. 
                  Spara 50% på arbetskostnaden.
                </p>
                <Button variant="premium" className="w-full">
                  Läs mer om ROT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;