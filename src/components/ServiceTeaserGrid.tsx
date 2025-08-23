import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Droplets, Hammer, Wrench, Shovel, Sparkles, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import GlobalPricingToggle from '@/components/GlobalPricingToggle';
import { usePriceStore } from '@/stores/priceStore';
import ServiceCardV3 from "@/components/ServiceCardV3";

const ServiceTeaserGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { mode, shouldShowService } = usePriceStore();

  const services: Array<{
    id: string;
    title: string;
    icon: any; 
    description: string; 
    basePrice: number;
    priceUnit: string;
    eligible: { rot: boolean; rut: boolean };
    laborShare: number;
    slug: string; 
    gradient: string; 
    iconColor: string;
  }> = [
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

  // Filter services based on eligibility - this will update when mode changes
  const filteredServices = useMemo(() => {
    return services.filter(service => shouldShowService(service.eligible));
  }, [services, shouldShowService, mode]); // Include mode to ensure re-filtering

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

        {/* Service Grid - Force re-render when mode changes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" key={`teaser-grid-${mode}`}>
          {filteredServices.map((service, index) => (
            <Link
              key={`${service.id}-${mode}`}
              to={`/tjanster/${service.slug}`}
              className="group block"
            >
              <ServiceCardV3
                title={service.title}
                category="Huvudtjänst"
                description={service.description}
                pricingType={service.priceUnit.includes('/h') ? 'hourly' : 'fixed'}
                priceIncl={service.basePrice}
                eligible={service.eligible}
                onBook={() => {
                  // Handle booking
                }}
                onQuote={() => {
                  // Handle quote request
                }}
              />
            </Link>
          ))}
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