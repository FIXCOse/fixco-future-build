import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Droplets, Hammer, Wrench, Shovel, Sparkles, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import GlobalPricingToggle from '@/components/GlobalPricingToggle';
import { usePriceStore } from '@/stores/priceStore';
import { calcDisplayPrice, ServicePricing } from '@/utils/priceCalculation';

const ServiceTeaserGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mode = usePriceStore((state) => state.mode);

  const services: (ServicePricing & { 
    icon: any; 
    description: string; 
    slug: string; 
    gradient: string; 
    iconColor: string;
  })[] = [
    {
      id: "el",
      title: "El",
      icon: Zap,
      description: "Uttag, belysning, laddbox",
      basePrice: 1059,
      priceUnit: "kr/h",
      eligible: { rot: true, rut: false },
      laborShare: 1.0,
      slug: "el",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400"
    },
    {
      id: "vvs",
      title: "VVS",
      icon: Droplets,
      description: "WC, handfat, duschvägg",
      basePrice: 959,
      priceUnit: "kr/h",
      eligible: { rot: true, rut: false },
      laborShare: 1.0,
      slug: "vvs",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      id: "snickeri",
      title: "Snickeri",
      icon: Hammer,
      description: "Kök, garderober, lister",
      basePrice: 859,
      priceUnit: "kr/h",
      eligible: { rot: true, rut: false },
      laborShare: 1.0,
      slug: "snickeri",
      gradient: "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-400"
    },
    {
      id: "montering",
      title: "Montering",
      icon: Wrench,
      description: "IKEA, vitvaror, TV-fästen",
      basePrice: 759,
      priceUnit: "kr/h",
      eligible: { rot: true, rut: false },
      laborShare: 1.0,
      slug: "montering",
      gradient: "from-gray-500/20 to-zinc-500/20",
      iconColor: "text-gray-400"
    },
    {
      id: "tradgard",
      title: "Trädgård",
      icon: Shovel,
      description: "Gräs, häck, ogräs, snö",
      basePrice: 659,
      priceUnit: "kr/h",
      eligible: { rot: false, rut: true },
      laborShare: 1.0,
      slug: "tradgard",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      id: "stadning",
      title: "Städning",
      icon: Sparkles,
      description: "Hem, bygg, kontor, flytt",
      basePrice: 459,
      priceUnit: "kr/h",
      eligible: { rot: false, rut: true },
      laborShare: 1.0,
      slug: "stadning",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      id: "flytt",
      title: "Flytt",
      icon: Truck,
      description: "Bärhjälp, lastning, packning",
      basePrice: 559,
      priceUnit: "kr/h",
      eligible: { rot: false, rut: true },
      laborShare: 1.0,
      slug: "flytt",
      gradient: "from-indigo-500/20 to-purple-500/20",
      iconColor: "text-indigo-400"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header with Pricing Toggle */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Våra <span className="gradient-text">huvudtjänster</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Från små reparationer till stora projekt – vi hanterar allt professionellt
          </p>
          
          {/* Enhanced Pricing Toggle */}
          <GlobalPricingToggle size="md" />
        </div>

        {/* Service Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredIndex === index;
            const pricing = calcDisplayPrice(service, mode);
            
            return (
              <Link
                key={service.id}
                to={`/tjanster/${service.slug}`}
                className="group block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={cn(
                  "relative p-6 rounded-xl border border-border bg-card",
                  "transition-all duration-300 ease-out",
                  "hover:border-primary/30 hover:shadow-card hover:-translate-y-1",
                  isHovered && "scale-[1.02]"
                )}>
                  {/* F Brand Badge - Bottom Right, Larger & More Visible */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                    <img 
                      src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                      alt="Fixco" 
                      className="h-4 w-4 object-contain opacity-90"
                    />
                  </div>

                  {/* Background gradient effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                    `bg-gradient-to-br ${service.gradient}`,
                    isHovered && "opacity-100"
                  )} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon and Arrow */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-lg transition-all duration-300",
                        "bg-gradient-to-br from-primary/10 to-accent/10",
                        isHovered && "scale-110 rotate-3"
                      )}>
                        <IconComponent className={cn(
                          "h-7 w-7 transition-colors duration-300",
                          service.iconColor,
                          isHovered && "text-primary"
                        )} />
                      </div>
                      <ArrowRight className={cn(
                        "h-5 w-5 text-muted-foreground transition-all duration-300",
                        isHovered && "text-primary translate-x-1"
                      )} />
                    </div>

                    {/* Title and Tax Benefits */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={cn(
                        "text-2xl font-bold transition-all duration-300",
                        isHovered && "gradient-text"
                      )}>
                        {service.title}
                      </h3>
                      
                      {/* Tax Benefit Badges */}
                      <div className="flex gap-1">
                        {service.eligible.rot && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            ROT
                          </span>
                        )}
                        {service.eligible.rut && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            RUT
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 text-sm">
                      {service.description}
                    </p>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="transition-all duration-300">
                        <div className={cn(
                          "text-2xl font-bold transition-all duration-300",
                          pricing.badge ? "text-primary" : "text-foreground"
                        )}>
                          {pricing.display}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {pricing.badge ? `Med ${pricing.badge}-avdrag` : "Inkl. moms"}
                          {!pricing.eligible && mode !== 'ordinary' && (
                            <span className="text-orange-600 ml-1">
                              (Ej {mode.toUpperCase()}-berättigad)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {pricing.originalDisplay && (
                        <div className="text-xs text-muted-foreground line-through">
                          {pricing.originalDisplay}
                        </div>
                      )}
                    </div>

                    {/* CTA Hint */}
                    <div className={cn(
                      "mt-4 text-sm font-medium transition-all duration-300",
                      isHovered ? "text-primary opacity-100" : "text-muted-foreground opacity-70"
                    )}>
                      Se alla tjänster →
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none",
                    "border-2 border-transparent",
                    isHovered && "border-primary/20 shadow-glow"
                  )} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Button 
            variant="cta-primary" 
            size="cta" 
            className="group" 
            asChild
          >
            <Link to="/tjanster">
              Se alla våra tjänster
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceTeaserGrid;