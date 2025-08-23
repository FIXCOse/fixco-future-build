import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Droplets, Hammer, Wrench, Shovel, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ServiceTeaserGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotEnabled, setRotEnabled] = useState(false);

  const services = [
    {
      name: "El",
      icon: Zap,
      description: "Uttag, belysning, laddbox",
      priceRegular: "959 kr/h",
      priceRot: "480 kr/h",
      slug: "el",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400"
    },
    {
      name: "VVS",
      icon: Droplets,
      description: "WC, handfat, duschvägg",
      priceRegular: "959 kr/h",
      priceRot: "480 kr/h",
      slug: "vvs",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      name: "Snickeri",
      icon: Hammer,
      description: "Kök, garderober, lister",
      priceRegular: "959 kr/h",
      priceRot: "480 kr/h",
      slug: "snickeri",
      gradient: "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-400"
    },
    {
      name: "Montering",
      icon: Wrench,
      description: "IKEA, vitvaror, TV-fästen",
      priceRegular: "699 kr/h",
      priceRot: "350 kr/h",
      slug: "montering",
      gradient: "from-gray-500/20 to-zinc-500/20",
      iconColor: "text-gray-400"
    },
    {
      name: "Markarbeten",
      icon: Shovel,
      description: "Schakt, altan, staket",
      priceRegular: "1199 kr/h",
      priceRot: "600 kr/h",
      slug: "markarbeten",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      name: "Städning",
      icon: Sparkles,
      description: "Hem, bygg, kontor",
      priceRegular: "89 kr/m²",
      priceRot: "45 kr/m²",
      slug: "stadning",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header with ROT Toggle */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Våra <span className="gradient-text">huvudtjänster</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Från små reparationer till stora projekt – vi hanterar allt professionellt
          </p>
          
          {/* ROT Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={cn("text-sm font-medium", !rotEnabled && "text-primary")}>
              Ordinarie pris
            </span>
            <button
              onClick={() => setRotEnabled(!rotEnabled)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                rotEnabled ? "bg-primary" : "bg-border"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  rotEnabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium", rotEnabled && "text-primary")}>
              Med ROT-avdrag (50%)
            </span>
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <Link
                key={service.name}
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

                    {/* Title */}
                    <h3 className={cn(
                      "text-2xl font-bold mb-3 transition-all duration-300",
                      isHovered && "gradient-text"
                    )}>
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 text-sm">
                      {service.description}
                    </p>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className={cn(
                        "transition-all duration-300",
                        rotEnabled ? "opacity-100 transform-none" : "opacity-100"
                      )}>
                        <div className={cn(
                          "text-2xl font-bold transition-all duration-300",
                          rotEnabled ? "text-primary" : "text-foreground"
                        )}>
                          {rotEnabled ? service.priceRot : service.priceRegular}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rotEnabled ? "Med ROT-avdrag" : "Inkl. moms"}
                        </div>
                      </div>
                      
                      {rotEnabled && (
                        <div className="text-xs text-muted-foreground line-through">
                          Ord: {service.priceRegular}
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