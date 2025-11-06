import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, X, Trophy, Timer, ArrowRight, Clock, Zap, Wrench, Paintbrush, Hammer, Leaf, Sparkles, Mountain, Cpu, Truck, Shield, Award, TrendingDown, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FixcoFIcon } from '@/components/icons/FixcoFIcon';
import { serviceComparisonData, ServiceComparisonItem, serviceCategoryNames } from "@/data/serviceComparisonData";

interface ServiceComparisonCardProps {
  serviceKey: string;
  city: string;
}

// Icon mapping for comparison labels
const getIconForLabel = (label: string) => {
  const iconMap: Record<string, any> = {
    'Pris per timme': TrendingDown,
    'ROT-hantering': Shield,
    'RUT-hantering': Shield,
    'Start inom': Clock,
    'Garanti': Award,
    'Certifieringar': Shield,
    'Kundnöjdhet': Star,
    'default': CheckCircle
  };
  return iconMap[label] || iconMap.default;
};

export const ServiceComparisonCard = ({ serviceKey, city }: ServiceComparisonCardProps) => {
  const comparisonData = serviceComparisonData[serviceKey] || serviceComparisonData['default'];
  const serviceTypeName = serviceCategoryNames[serviceKey] || serviceCategoryNames.default;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 hero-background" />
        
        {/* F Watermark */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-20 left-20 w-24 h-24 rotate-12 animate-pulse" style={{ animationDuration: '5s' }}>
            <FixcoFIcon className="w-full h-full" disableFilter={true} />
          </div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 rotate-45 animate-pulse" style={{ animationDuration: '6s', animationDelay: '0.8s' }}>
            <FixcoFIcon className="w-full h-full" disableFilter={true} />
          </div>
        </div>
        
        {/* Animated gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 30% 20%, hsl(280 100% 60% / 0.08) 0%, transparent 40%)",
              "radial-gradient(circle at 70% 80%, hsl(320 100% 65% / 0.08) 0%, transparent 40%)",
              "radial-gradient(circle at 30% 20%, hsl(280 100% 60% / 0.08) 0%, transparent 40%)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-semibold gradient-text">⚡ Jämförelse</span>
          </div>
          <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">
            Fixco vs andra {serviceTypeName} i {city}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Se varför {serviceTypeName} från Fixco är det bästa valet i {city}
          </p>
        </motion.div>

        <div className="max-w-md md:max-w-5xl mx-auto">
          {/* Desktop Header Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:grid grid-cols-3 gap-3 mb-4"
          >
            <div className="text-center">
              <h3 className="text-base font-semibold text-muted-foreground">Kriterie</h3>
            </div>
            <div className="card-premium p-3 text-center border-primary/20">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <h3 className="text-lg font-bold gradient-text">Fixco</h3>
            </div>
            <div className="card-premium p-3 text-center border-muted/20">
              <Timer className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <h3 className="text-lg font-bold text-muted-foreground">Andra företag</h3>
            </div>
          </motion.div>

          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:hidden grid grid-cols-3 gap-2 mb-4 text-center"
          >
            <div className="text-xs font-medium text-muted-foreground">Kriterie</div>
            <div className="text-xs font-bold gradient-text">Fixco</div>
            <div className="text-xs font-medium text-muted-foreground">Andra</div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="space-y-2 md:space-y-2">
            {comparisonData.map((item: ServiceComparisonItem, index: number) => {
              const IconComponent = getIconForLabel(item.label);
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.12, duration: 0.5 }}
                  className="grid grid-cols-3 gap-2 md:gap-3 items-center"
                >
                  {/* Kriterie-kolumn */}
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 min-h-[60px] md:min-h-[44px]">
                    <div className="w-6 h-6 md:w-8 md:h-8 gradient-primary-subtle rounded-lg flex items-center justify-center shrink-0">
                      <IconComponent className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs md:text-base leading-tight">{item.label}</h4>
                    </div>
                  </div>

                  {/* Fixco-kolumn */}
                  <motion.div
                    className="card-premium p-2 md:p-3 border-primary/20 relative bg-primary/5 min-h-[60px] md:min-h-[44px] flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CheckCircle className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-2.5 w-2.5 md:h-3 md:w-3 text-green-400" />
                    <div className="text-center px-1">
                      <div className="text-xs sm:text-sm md:text-xl font-bold gradient-text">
                        {item.fixco}
                      </div>
                      {item.fixcoSubtext && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.fixcoSubtext}</div>
                      )}
                    </div>
                  </motion.div>

                  {/* Konkurrent-kolumn */}
                  <div className="card-premium p-2 md:p-3 border-muted/20 bg-muted/10 min-h-[60px] md:min-h-[44px] flex items-center justify-center relative">
                    {item.competitorBad && (
                      <X className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-2.5 w-2.5 md:h-3 md:w-3 text-red-400" />
                    )}
                    <div className="text-center px-1">
                      <div className="text-xs sm:text-sm md:text-xl font-bold text-muted-foreground">
                        {item.competitor}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Winner Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-4 md:mt-6"
          >
            <div className="card-premium p-4 md:p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Left: Summary */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                      <FixcoFIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold gradient-text">
                      Fixco vinner {comparisonData.length}/{comparisonData.length} kategorier
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Vi är marknadsledande inom {serviceTypeName.toLowerCase()} i {city}
                  </p>
                </div>
                
                {/* Right: CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end items-center">
                  <Link to="/kontakt" className="w-full sm:w-auto">
                    <Button variant="cta-primary" size="cta" className="w-full sm:w-auto">
                      Begär offert
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/tjanster" className="w-full sm:w-auto">
                    <Button variant="cta-secondary" size="cta" className="w-full sm:w-auto">
                      Se alla tjänster
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="grid grid-cols-3 gap-2 md:gap-3 mt-4"
          >
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">24-48h</div>
              <p className="text-xs text-muted-foreground">Efter offert</p>
            </div>
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">3000+</div>
              <p className="text-xs text-muted-foreground">Projekt genomförda</p>
            </div>
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">08-19:00</div>
              <p className="text-xs text-muted-foreground">Support vardagar</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
