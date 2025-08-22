import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button-premium";
import { 
  Hammer, 
  Wrench, 
  Package, 
  TreePine, 
  Sparkles, 
  ClipboardList, 
  Mountain, 
  Cpu, 
  Zap, 
  Building,
  ArrowRight 
} from "lucide-react";

const services = [
  {
    title: "Snickeri",
    slug: "snickeri",
    description: "Kök, badrum, inredning och skräddarsydda möbler",
    icon: Hammer,
    subServices: ["Köksrenovering", "Badrumsinredning", "Skräddarsydda skåp", "Trappor", "Dörrar & fönster"],
    basePrice: "959 kr/h",
    rotPrice: "480 kr/h"
  },
  {
    title: "VVS",
    slug: "vvs",
    description: "Rör, värme och sanitär installation",
    icon: Wrench,
    subServices: ["Vatteninstallationer", "Värmeinstallationer", "Avlopp", "Badrum", "Läckagesökning"],
    basePrice: "959 kr/h",
    rotPrice: "480 kr/h"
  },
  {
    title: "Montering",
    slug: "montering",
    description: "Möbler, maskiner och teknisk utrustning", 
    icon: Package,
    subServices: ["IKEA-montering", "Kontorsmöbler", "Maskiner", "Lekredskap", "Hyllsystem"],
    basePrice: "959 kr/h",
    rotPrice: "480 kr/h"
  },
  {
    title: "Trädgård",
    slug: "tradgard",
    description: "Anläggning, skötsel och underhåll",
    icon: TreePine,
    subServices: ["Trädgårdsanläggning", "Plantering", "Beskärning", "Gräsmattor", "Stensättning"],
    basePrice: "959 kr/h",
    rotPrice: "480 kr/h"
  },
  {
    title: "Städning",
    slug: "stadning",
    description: "Byggstäd, flyttstäd och regelbunden städning",
    icon: Sparkles,
    subServices: ["Byggstädning", "Flyttstädning", "Kontorsstädning", "Fönsterputsning", "Djupstädning"],
    basePrice: "459 kr/h",
    rotPrice: "230 kr/h"
  },
  {
    title: "Projektledning",
    slug: "projektledning",
    description: "Helhetslösningar från start till mål",
    icon: ClipboardList,
    subServices: ["Totalentreprenad", "Projektplanering", "Byggledning", "Kvalitetskontroll", "Koordinering"],
    basePrice: "1159 kr/h",
    rotPrice: "580 kr/h"
  },
  {
    title: "Markarbeten",
    slug: "markarbeten",
    description: "Grävning, dränering och anläggning",
    icon: Mountain,
    subServices: ["Schaktning", "Dränering", "Grundläggning", "Markberedning", "Stensättning"],
    basePrice: "1259 kr/h",
    rotPrice: "630 kr/h"
  },
  {
    title: "Tekniska installationer",
    slug: "tekniska-installationer",
    description: "Automation, säkerhet och smarta lösningar",
    icon: Cpu,
    subServices: ["Säkerhetsystem", "Automation", "Larm", "Kameror", "Smarta hem"],
    basePrice: "1159 kr/h",
    rotPrice: "580 kr/h"
  },
  {
    title: "El",
    slug: "el",
    description: "Installation, reparation och underhåll",
    icon: Zap,
    subServices: ["Elinstallationer", "Belysning", "Säkerhetsskåp", "Laddboxar", "Felavhjälpning"],
    basePrice: "1059 kr/h",
    rotPrice: "530 kr/h"
  },
  {
    title: "Fastighetsskötsel",
    slug: "fastighetsskotsel",
    description: "Löpande underhåll och service",
    icon: Building,
    subServices: ["Underhållsplan", "Reparationer", "Säsongsarbeten", "Akutservice", "Teknisk service"],
    basePrice: "959 kr/h",
    rotPrice: "480 kr/h"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-50" />
        
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg">
                Begär offert
              </Button>
              <Button variant="ghost-premium" size="lg">
                Ring 08-123 456 78
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={service.slug}
                  className="card-premium p-8 group hover:shadow-glow transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 gradient-primary-subtle rounded-xl flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>

                  {/* Sub-services */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-sm mb-3 text-primary">INKLUDERAR:</h3>
                    <div className="space-y-1">
                      {service.subServices.slice(0, 3).map((subService) => (
                        <div key={subService} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {subService}
                        </div>
                      ))}
                      {service.subServices.length > 3 && (
                        <div className="text-sm text-primary">
                          + {service.subServices.length - 3} till...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-border pt-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Ordinarie pris:</span>
                      <span className="font-semibold line-through text-muted-foreground">{service.basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary">Med ROT-avdrag:</span>
                      <span className="text-2xl font-bold gradient-text">{service.rotPrice}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">inkl. moms</div>
                  </div>

                  {/* CTA */}
                  <Link to={`/tjanster/${service.slug}`}>
                    <Button variant="premium" className="w-full group">
                      Se mer om {service.title.toLowerCase()}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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