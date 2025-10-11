import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Clock, Star, Shield, MapPin, Timer, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useProgressiveEnhancement from "@/hooks/useProgressiveEnhancement";
import useCountUpOnce from "@/hooks/useCountUpOnce";
import useGlobalROT from "@/hooks/useGlobalROT";
import useGlobalPricing from "@/hooks/useGlobalPricing";
import { useCopy } from "@/copy/CopyProvider";

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
  const { pricingMode, rotEnabled } = useGlobalPricing();
  const { t, locale } = useCopy();
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
    to: 5,
    duration: 1500,
    formatter: (value) => `< ${Math.round(value)} ${t('comparison.days')}`
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
      title: t('comparison.start_time'),
      fixcoValue: t('timing.less_than_5_days'),
      competitorValue: t('comparison.5_10_days'),
      isWin: true,
      description: t('comparison.timing_description')
    },
    {
      icon: TrendingUp,
      title: t('comparison.price_title'),
      fixcoValue: rotEnabled ? 480 : 959,
      fixcoUnit: "kr/h",
      competitorValue: rotEnabled ? "800-1 300" : "800-1 300",
      competitorUnit: "kr/h",
      isWin: true,
      description: rotEnabled ? t('comparison.price_rot_desc') : t('comparison.price_no_rot_desc')
    },
    {
      icon: MapPin,
      title: t('comparison.coverage_area'),
      fixcoValue: t('location.uppsala_stockholm'),
      competitorValue: t('comparison.limited'),
      isWin: true,
      description: t('location.national_large_projects')
    },
    {
      icon: Star,
      title: t('comparison.customer_satisfaction'),
      fixcoValue: customerSatisfaction.value,
      fixcoUnit: "/5",
      competitorValue: "3.8",
      competitorUnit: "/5",
      counterKey: "customer_satisfaction",
      isWin: true,
      description: t('comparison.customer_satisfaction_desc')
    },
    {
      icon: Shield,
      title: t('comparison.rut_handling'),
      fixcoValue: t('comparison.rut_handling_fixco'),
      competitorValue: t('comparison.rut_handling_competitor'),
      isWin: true,
      description: t('comparison.rut_handling_desc')
    },
    {
      icon: Trophy,
      title: t('comparison.project_completion'),
      fixcoValue: completionRate.value,
      fixcoUnit: "%",
      competitorValue: "70-80",
      competitorUnit: "%",
      counterKey: "completion_rate",
      isWin: true,
      description: t('comparison.project_completion_desc')
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
        
        {/* Simplified F Watermark - Reduced DOM nodes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
          <div 
            className="absolute top-20 left-20 w-24 h-24 bg-primary/30 rotate-12 animate-pulse hero-f-icon"
            style={{ animationDuration: '5s' }}
            aria-hidden="true"
          />
          <div 
            className="absolute top-1/2 left-1/4 w-20 h-20 bg-primary/20 rotate-45 animate-pulse hero-f-icon"
            style={{ animationDuration: '6s', animationDelay: '0.8s' }}
            aria-hidden="true"
          />
        </div>
        
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
            {t('home.comparison.title')}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            {t('home.comparison.subtitle')}
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
              <h3 className="text-base font-semibold text-muted-foreground">{t('comparison.header')}</h3>
            </div>
            <div className="card-premium p-3 text-center border-primary/20">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <h3 className="text-lg font-bold gradient-text">Fixco</h3>
            </div>
            <div className="card-premium p-3 text-center border-muted/20">
              <Timer className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <h3 className="text-lg font-bold text-muted-foreground">{t('comparison.competitors')}</h3>
            </div>
          </motion.div>

          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:hidden grid grid-cols-3 gap-2 mb-4 text-center"
          >
            <div className="text-xs font-medium text-muted-foreground">{t('comparison.header')}</div>
            <div className="text-xs font-bold gradient-text">Fixco</div>
            <div className="text-xs font-medium text-muted-foreground">{t('comparison.competitors')}</div>
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
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 min-h-[60px] md:min-h-[44px]">
                    <div className="w-6 h-6 md:w-8 md:h-8 gradient-primary-subtle rounded-lg flex items-center justify-center shrink-0">
                      <IconComponent className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs md:text-base leading-tight">{metric.title}</h4>
                    </div>
                  </div>

                   {/* Fixco Value - Mobile Optimized */}
                  <motion.div
                    className="card-premium p-2 md:p-3 border-primary/20 relative bg-primary/5 min-h-[60px] md:min-h-[44px] flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CheckCircle className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-2.5 w-2.5 md:h-3 md:w-3 text-green-400" />
                    <div className="text-center px-1">
                      <div className="text-xs sm:text-sm md:text-xl font-bold gradient-text">
                        {metric.fixcoValue}
                        {metric.fixcoUnit && <span className="text-xs md:text-sm">{metric.fixcoUnit}</span>}
                      </div>
                    </div>
                  </motion.div>

                   {/* Competitor Value - Mobile Optimized */}
                  <div className="card-premium p-2 md:p-3 border-muted/20 bg-muted/10 min-h-[60px] md:min-h-[44px] flex items-center justify-center">
                    <div className="text-center px-1">
                      <div className="text-xs sm:text-sm md:text-xl font-bold text-muted-foreground">
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
                    <div className="w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                      <img 
                        src="/assets/fixco-f-icon-new.png"
                        alt="Fixco" 
                        className="h-6 w-6 object-contain opacity-90"
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold gradient-text">
                      {t('comparison.wins_all')} {metrics.length}/{metrics.length}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {t('comparison.market_leader')}{rotEnabled && ` + upp till 50% ROT-besparing`}
                  </p>
                </div>
                
                {/* Right: CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end items-center">
                  <Link to={locale === 'en' ? '/en/contact' : '/kontakt'} className="w-full sm:w-auto">
                    <Button
                      variant="cta-primary"
                      size="cta"
                      className="w-full sm:w-auto"
                    >
                      {t('comparison.request_quote')}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link to={locale === 'en' ? '/en/services' : '/tjanster'} className="w-full sm:w-auto">
                    <Button
                      variant="cta-secondary"
                      size="cta"
                      className="w-full sm:w-auto"
                    >
                      {t('comparison.see_all_services')}
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
              <p className="text-xs text-muted-foreground">{t('comparison.start_time_label')}</p>
            </div>
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">2000+</div>
              <p className="text-xs text-muted-foreground">{t('comparison.satisfied_customers')}</p>
            </div>
            <div className="card-premium p-3 md:p-4 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm md:text-xl font-bold gradient-text mb-1">24/7</div>
              <p className="text-xs text-muted-foreground">{t('comparison.support')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonUltra;