import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Clock, Star, Shield, MapPin, Timer, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useProgressiveEnhancement from "@/hooks/useProgressiveEnhancement";
import useCountUpOnce from "@/hooks/useCountUpOnce";
import useGlobalROT from "@/hooks/useGlobalROT";

interface ComparisonMetric {
  icon: React.ComponentType<any>;
  title: string;
  fixcoValue: string | number;
  fixcoUnit?: string;
  competitorValue: string | number;
  competitorUnit?: string;
  counterKey?: string;
  isWin: boolean;
  description: string;
}

const ComparisonUltra = () => {
  const { ultraEnabled, capabilities } = useProgressiveEnhancement();
  const { rotEnabled } = useGlobalROT();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Robust once-only counters
  const customerSatisfaction = useCountUpOnce({
    key: "customer_satisfaction",
    from: 0,
    to: 49,
    duration: 1800,
    formatter: (value) => (value / 10).toFixed(1)
  });

  const completionRate = useCountUpOnce({
    key: "completion_rate", 
    from: 0,
    to: 98,
    duration: 2000,
    formatter: (value) => Math.round(value).toString()
  });

  const startTime = useCountUpOnce({
    key: "start_time",
    from: 0,
    to: 3,
    duration: 1500,
    formatter: (value) => `< ${Math.round(value)} h`
  });

  // Attach observers to the main section when it becomes visible
  useEffect(() => {
    if (sectionRef.current) {
      customerSatisfaction.observe(sectionRef.current);
      completionRate.observe(sectionRef.current);
      startTime.observe(sectionRef.current);
    }
  }, [customerSatisfaction.observe, completionRate.observe, startTime.observe]);

  const isInView = useInView(sectionRef, { once: true });

  // Dynamic metrics based on current counter values
  const metrics: ComparisonMetric[] = [
    {
      icon: Clock,
      title: "Starttid",
      fixcoValue: "< 5 dagar",
      competitorValue: "5-10 dagar",
      isWin: true,
      description: "Vi börjar inom 5 dagar vs konkurrenters veckolånga väntetider"
    },
    {
      icon: TrendingUp,
      title: rotEnabled ? "Pris med ROT-avdrag" : "Ordinarie pris",
      fixcoValue: rotEnabled ? 480 : 959,
      fixcoUnit: "kr/h",
      competitorValue: rotEnabled ? "800-1 300" : "800-1 300",
      competitorUnit: "kr/h",
      isWin: true,
      description: rotEnabled ? "Upp till 50% billigare med ROT-avdrag" : "Konkurrenskraftiga priser utan ROT"
    },
    {
      icon: MapPin,
      title: "Täckningsområde",
      fixcoValue: "Uppsala & Stockholm",
      competitorValue: "Begränsat",
      isWin: true,
      description: "Full täckning i Uppsala & Stockholm, större projekt nationellt"
    },
    {
      icon: Star,
      title: "Kundnöjdhet",
      fixcoValue: customerSatisfaction.value,
      fixcoUnit: "/5",
      competitorValue: "3.8",
      competitorUnit: "/5",
      counterKey: "customer_satisfaction",
      isWin: true,
      description: "Branschens högsta kundnöjdhet baserat på tusentals recensioner"
    },
    {
      icon: Shield,
      title: "ROT-hantering",
      fixcoValue: "Vi sköter allt",
      competitorValue: "Du själv",
      isWin: true,
      description: "Komplett ROT-service utan krångel för dig som kund"
    },
    {
      icon: Trophy,
      title: "Projekt klart i tid",
      fixcoValue: completionRate.value,
      fixcoUnit: "%",
      competitorValue: "70-80",
      competitorUnit: "%",
      counterKey: "completion_rate",
      isWin: true,
      description: "Nästan alla projekt levereras enligt överenskommen tidsplan"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 hero-background" />
        
        {/* ULTRA: Subtle background effects */}
        {ultraEnabled && capabilities.prefersMotion && (
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
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">
            Varför välja <span className="gradient-text">Fixco</span>?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Transparent jämförelse som visar varför tusentals kunder väljer oss
          </p>
        </motion.div>

        {/* Mobile-Optimized Comparison */}
        <div className="max-w-md md:max-w-5xl mx-auto">
          {/* Header Row - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:grid grid-cols-3 gap-3 mb-4"
          >
            <div className="text-center">
              <h3 className="text-base font-semibold text-muted-foreground">Jämförelse</h3>
            </div>
            <div className="card-premium p-3 text-center border-primary/20">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <h3 className="text-lg font-bold gradient-text">Fixco</h3>
            </div>
            <div className="card-premium p-3 text-center border-muted/20">
              <Timer className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <h3 className="text-lg font-bold text-muted-foreground">Konkurrenter</h3>
            </div>
          </motion.div>

          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:hidden grid grid-cols-3 gap-2 mb-4 text-center"
          >
            <div className="text-xs font-medium text-muted-foreground">Jämförelse</div>
            <div className="text-xs font-bold gradient-text">Fixco</div>
            <div className="text-xs font-medium text-muted-foreground">Konkurrenter</div>
          </motion.div>

          {/* Compact Metrics Grid */}
          <div className="space-y-2 md:space-y-2">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.12, duration: 0.5 }}
                  className="grid grid-cols-3 gap-2 md:gap-3 items-center"
                >
                  {/* Metric Title - Mobile Optimized */}
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 min-h-[44px]">
                    <div className="w-6 h-6 md:w-8 md:h-8 gradient-primary-subtle rounded-lg flex items-center justify-center shrink-0">
                      <IconComponent className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs md:text-base leading-tight">{metric.title}</h4>
                    </div>
                  </div>

                  {/* Fixco Value - Mobile Optimized */}
                  <motion.div
                    className="card-premium p-2 md:p-3 border-primary/20 relative bg-primary/5 min-h-[44px] flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CheckCircle className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-2.5 w-2.5 md:h-3 md:w-3 text-green-400" />
                    <div className="text-center">
                      <div className="text-sm md:text-xl font-bold gradient-text">
                        {metric.fixcoValue}
                        {metric.fixcoUnit && <span className="text-xs md:text-sm">{metric.fixcoUnit}</span>}
                      </div>
                    </div>
                  </motion.div>

                  {/* Competitor Value - Mobile Optimized */}
                  <div className="card-premium p-2 md:p-3 border-muted/20 bg-muted/10 min-h-[44px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm md:text-xl font-bold text-muted-foreground">
                        {metric.competitorValue}
                        {metric.competitorUnit && <span className="text-xs md:text-sm">{metric.competitorUnit}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Compact Winner Summary + CTA */}
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
                    <Trophy className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    <h3 className="text-lg md:text-xl font-bold gradient-text">
                      Fixco vinner {metrics.length}/{metrics.length}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Marknadsledare inom alla områden{rotEnabled && " + upp till 50% ROT-besparing"}
                  </p>
                </div>
                
                {/* Right: CTAs - Arrow Removed */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end items-center">
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
                      Se tjänster
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Compact Additional Stats - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="grid grid-cols-3 gap-2 md:gap-3 mt-4"
          >
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">
                {startTime.value}
              </div>
              <p className="text-xs text-muted-foreground">Starttid</p>
            </div>
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">2000+</div>
              <p className="text-xs text-muted-foreground">Nöjda kunder</p>
            </div>
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">24/7</div>
              <p className="text-xs text-muted-foreground">Support</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonUltra;