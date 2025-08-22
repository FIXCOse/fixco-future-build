import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Clock, Star, Shield, MapPin, Timer, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MagneticButton from "@/components/MagneticButton";
import useProgressiveEnhancement from "@/hooks/useProgressiveEnhancement";
import usePersistentCounters from "@/hooks/usePersistentCounters";
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
  const isInView = useInView(sectionRef, { once: true });
  
  // Persistent counters
  const { 
    animateCounter, 
    getCounterValue, 
    hasCounterAnimated,
    prefersReducedMotion 
  } = usePersistentCounters("comparison-ultra");

  useEffect(() => {
    if (isInView) {
      // Start animations for counters
      if (!hasCounterAnimated("customer_satisfaction")) {
        animateCounter({
          key: "customer_satisfaction",
          target: 4.9,
          duration: 2000,
          easing: "easeOut"
        });
      }
      
      if (!hasCounterAnimated("completion_rate")) {
        setTimeout(() => {
          animateCounter({
            key: "completion_rate", 
            target: 97,
            duration: 2500,
            easing: "easeOut"
          });
        }, 200);
      }
      
      if (!hasCounterAnimated("response_time")) {
        setTimeout(() => {
          animateCounter({
            key: "response_time",
            target: 60,
            duration: 1800,
            easing: "easeOut"
          });
        }, 400);
      }
    }
  }, [isInView, animateCounter, hasCounterAnimated]);

  // Dynamic metrics based on current counter values
  const metrics: ComparisonMetric[] = [
    {
      icon: Clock,
      title: "Starttid",
      fixcoValue: "24h",
      competitorValue: "5-10 dagar",
      isWin: true,
      description: "Vi börjar inom 24 timmar vs konkurrenters veckolånga väntetider"
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
      fixcoValue: getCounterValue("customer_satisfaction") || 4.9,
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
      fixcoValue: getCounterValue("completion_rate") || 97,
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
      className="relative py-24 overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 hero-background" />
        
        {/* ULTRA: Enhanced background effects */}
        {ultraEnabled && capabilities.prefersMotion && (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 30% 20%, hsl(280 100% 60% / 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(320 100% 65% / 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 20%, hsl(280 100% 60% / 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 80%, hsl(320 100% 65% / 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 20%, hsl(280 100% 60% / 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(320 100% 65% / 0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Varför välja{" "}
            <span className="gradient-text">Fixco</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            En transparent jämförelse som visar varför tusentals kunder väljer oss framför konkurrenterna
          </p>
        </motion.div>

        {/* Main Comparison Grid */}
        <div className="max-w-7xl mx-auto">
          {/* Header Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="hidden md:block" /> {/* Empty space for metric titles */}
            <div className="card-premium p-6 text-center">
              <div className="w-16 h-16 mx-auto gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-2">Fixco</h3>
              <p className="text-muted-foreground">Marknadsledare</p>
            </div>
            <div className="card-premium p-6 text-center border-destructive/20">
              <div className="w-16 h-16 mx-auto bg-muted rounded-xl flex items-center justify-center mb-4">
                <Timer className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Konkurrenter</h3>
              <p className="text-muted-foreground">Branschsnitt</p>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="space-y-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                >
                  {/* Metric Title */}
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 gradient-primary-subtle rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{metric.title}</h4>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>

                  {/* Fixco Value */}
                  <motion.div
                    className="card-premium p-6 border-primary/30 relative overflow-hidden"
                    whileHover={ultraEnabled ? { scale: 1.02, rotateY: 2 } : { scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-1">
                        {metric.counterKey && typeof metric.fixcoValue === 'number' 
                          ? (metric.counterKey === "customer_satisfaction" 
                              ? (getCounterValue(metric.counterKey) || metric.fixcoValue).toFixed(1)
                              : Math.round(getCounterValue(metric.counterKey) || metric.fixcoValue)
                            )
                          : metric.fixcoValue
                        }
                        {metric.fixcoUnit && <span className="text-lg">{metric.fixcoUnit}</span>}
                      </div>
                    </div>
                  </motion.div>

                  {/* Competitor Value */}
                  <motion.div
                    className="card-premium p-6 border-muted/30 relative"
                    whileHover={ultraEnabled ? { scale: 1.01 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-muted-foreground mb-1">
                        {metric.competitorValue}
                        {metric.competitorUnit && <span className="text-lg">{metric.competitorUnit}</span>}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Winner Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="card-premium p-8 border-primary/30 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center mb-6">
                <Trophy className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-4">
                Fixco vinner {metrics.length}/{metrics.length}
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Inom alla viktiga områden är vi marknadsledare. 
                {rotEnabled && " Med ROT-avdrag sparar du dessutom upp till 50%."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <MagneticButton
                    className="gradient-primary text-primary-foreground text-lg px-8 py-4 shadow-premium hover:shadow-glow"
                  >
                    Begär offert
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MagneticButton>
                </Link>
                <Link to="/tjanster">
                  <MagneticButton
                    variant="outline"
                    className="text-lg px-8 py-4 border-primary/30 hover:bg-primary/10 backdrop-blur-sm"
                  >
                    Se våra tjänster
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Additional Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="card-premium p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                &lt;{Math.round(getCounterValue("response_time") || 60)} min
              </div>
              <p className="text-muted-foreground">Genomsnittlig svarstid</p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">2000+</div>
              <p className="text-muted-foreground">Nöjda kunder</p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-muted-foreground">Kundtjänst tillgänglig</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonUltra;