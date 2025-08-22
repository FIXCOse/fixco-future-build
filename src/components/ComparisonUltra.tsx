import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Info, Award, Users2, Clock, DollarSign, Star, MapPin } from "lucide-react";
import CaseSwitcher from "./CaseSwitcher";
import InteractiveToggle from "./InteractiveToggle";
import useProgressiveEnhancement from "@/hooks/useProgressiveEnhancement";
import usePersistentCounters from "@/hooks/usePersistentCounters";
import useGlobalROT from "@/hooks/useGlobalROT";

type CaseType = 'el' | 'vvs' | 'snickeri';
type RegionType = 'uppsala' | 'stockholm' | 'both';

interface Metric {
  id: string;
  icon: any;
  label: string;
  description: string;
  unit: string;
  format: 'number' | 'currency' | 'percentage' | 'time';
}

const ComparisonUltra = () => {
  const { ultraEnabled, proEnabled } = useProgressiveEnhancement();
  const { rotEnabled, toggleROT } = useGlobalROT();
  const { animateCounters, getCounterValue, hasCounterAnimated } = usePersistentCounters('comparison-ultra');

  const [isVisible, setIsVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseType>('el');
  const [region, setRegion] = useState<RegionType>('both');
  const [animationTriggered, setAnimationTriggered] = useState(false);

  // Case-specific data
  const caseData = {
    el: {
      startTime: { fixco: 24, competitor: 7 },
      pricing: { base: 1059, rot: 530, competitor: 1200 },
      satisfaction: { fixco: 98, competitor: 82 },
      title: "Elinstallationer"
    },
    vvs: {
      startTime: { fixco: 24, competitor: 8 },
      pricing: { base: 959, rot: 480, competitor: 1100 },
      satisfaction: { fixco: 97, competitor: 79 },
      title: "VVS-tjänster"
    },
    snickeri: {
      startTime: { fixco: 24, competitor: 6 },
      pricing: { base: 859, rot: 430, competitor: 950 },
      satisfaction: { fixco: 99, competitor: 81 },
      title: "Snickeriarbeten"
    }
  };

  const currentCase = caseData[selectedCase];

  const metrics: Metric[] = [
    {
      id: 'startTime',
      icon: Clock,
      label: 'Projektstart',
      description: 'Tid från första kontakt till projektstart',
      unit: selectedCase === 'el' ? 'h' : 'dagar',
      format: 'time'
    },
    {
      id: 'pricing',
      icon: DollarSign,
      label: rotEnabled ? 'Timpris (efter ROT)' : 'Timpris ordinarie',
      description: rotEnabled ? 'Pris efter 50% ROT-avdrag' : 'Ordinarie timpris',
      unit: 'kr/h',
      format: 'currency'
    },
    {
      id: 'satisfaction',
      icon: Star,
      label: 'Kundnöjdhet',
      description: 'Genomsnittligt betyg senaste 12 månaderna',
      unit: '%',
      format: 'percentage'
    }
  ];

  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationTriggered) {
          setIsVisible(true);
          setAnimationTriggered(true);
          
          // Start counter animations after a short delay
          setTimeout(() => {
            const counterConfigs = metrics.map(metric => {
              const fixcoKey = `${selectedCase}_${metric.id}_fixco`;
              const competitorKey = `${selectedCase}_${metric.id}_competitor`;
              
              let fixcoValue: number, competitorValue: number;
              
              switch (metric.id) {
                case 'startTime':
                  fixcoValue = currentCase.startTime.fixco;
                  competitorValue = currentCase.startTime.competitor;
                  break;
                case 'pricing':
                  fixcoValue = rotEnabled ? currentCase.pricing.rot : currentCase.pricing.base;
                  competitorValue = currentCase.pricing.competitor;
                  break;
                case 'satisfaction':
                  fixcoValue = currentCase.satisfaction.fixco;
                  competitorValue = currentCase.satisfaction.competitor;
                  break;
                default:
                  fixcoValue = 0;
                  competitorValue = 0;
              }
              
              return [
                { key: fixcoKey, target: fixcoValue, duration: 1500, easing: 'easeOut' as const },
                { key: competitorKey, target: competitorValue, duration: 1500, easing: 'easeOut' as const }
              ];
            }).flat();
            
            animateCounters(counterConfigs, 200);
          }, 1000);
          
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('comparison-ultra-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [animationTriggered, selectedCase, rotEnabled, animateCounters, currentCase, metrics]);

  // Handle case change
  const handleCaseChange = useCallback((newCase: CaseType) => {
    setSelectedCase(newCase);
    
    // If already animated, animate to new values
    if (hasCounterAnimated(`${selectedCase}_startTime_fixco`)) {
      const newData = caseData[newCase];
      const counterConfigs = metrics.map(metric => {
        const fixcoKey = `${newCase}_${metric.id}_fixco`;
        const competitorKey = `${newCase}_${metric.id}_competitor`;
        
        let fixcoValue: number, competitorValue: number;
        
        switch (metric.id) {
          case 'startTime':
            fixcoValue = newData.startTime.fixco;
            competitorValue = newData.startTime.competitor;
            break;
          case 'pricing':
            fixcoValue = rotEnabled ? newData.pricing.rot : newData.pricing.base;
            competitorValue = newData.pricing.competitor;
            break;
          case 'satisfaction':
            fixcoValue = newData.satisfaction.fixco;
            competitorValue = newData.satisfaction.competitor;
            break;
          default:
            fixcoValue = 0;
            competitorValue = 0;
        }
        
        return [
          { key: fixcoKey, target: fixcoValue, duration: 800, easing: 'easeOut' as const },
          { key: competitorKey, target: competitorValue, duration: 800, easing: 'easeOut' as const }
        ];
      }).flat();
      
      animateCounters(counterConfigs, 100);
    }
  }, [selectedCase, rotEnabled, hasCounterAnimated, animateCounters, metrics]);

  // Handle ROT change
  const handleROTChange = useCallback((enabled: boolean) => {
    toggleROT(enabled);
    
    // Update pricing counter if already animated
    if (hasCounterAnimated(`${selectedCase}_pricing_fixco`)) {
      const newPrice = enabled ? currentCase.pricing.rot : currentCase.pricing.base;
      animateCounters([
        { key: `${selectedCase}_pricing_fixco`, target: newPrice, duration: 600, easing: 'easeOut' }
      ]);
    }
  }, [toggleROT, selectedCase, currentCase.pricing, hasCounterAnimated, animateCounters]);

  const formatValue = (value: number, metric: Metric) => {
    switch (metric.format) {
      case 'currency':
        return value.toLocaleString('sv-SE');
      case 'percentage':
        return value;
      case 'time':
        return value;
      default:
        return value;
    }
  };

  return (
    <section 
      id="comparison-ultra-section"
      className="py-24 relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10" />
        
        {/* PRO: CSS Animation */}
        {proEnabled && (
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{
              background: [
                "radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 70%)",
                "radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 70%)",
                "radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 70%)"
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
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Fixco vs <span className="gradient-text">Konkurrenter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Interaktiv jämförelse med verkliga siffror från {currentCase.title.toLowerCase()}
          </p>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <Users2 className="h-4 w-4 text-primary" />
              <span>2000+ nöjda kunder</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Branschledande priser</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Start inom 24h</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Case Switcher */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <CaseSwitcher
              selectedCase={selectedCase}
              onCaseChange={handleCaseChange}
            />
          </motion.div>
        </AnimatePresence>

        {/* Interactive Toggles */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <InteractiveToggle
              showROT={rotEnabled}
              onROTChange={handleROTChange}
              region={region}
              onRegionChange={setRegion}
            />
          </motion.div>
        </AnimatePresence>

        {/* Comparison Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Headers */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div></div>
            <div className="card-premium p-6 text-center bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <div className="flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-2xl font-bold gradient-text">FIXCO</span>
              </div>
              <p className="text-sm text-green-400">Branschledande</p>
            </div>
            <div className="card-premium p-6 text-center bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-foreground">KONKURRENTER</span>
              </div>
              <p className="text-sm text-red-400">Branschgenomsnitt</p>
            </div>
          </div>

          {/* Metrics */}
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const fixcoValue = getCounterValue(`${selectedCase}_${metric.id}_fixco`);
            const competitorValue = getCounterValue(`${selectedCase}_${metric.id}_competitor`);
            
            return (
              <motion.div
                key={`${selectedCase}-${metric.id}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.15, duration: 0.5 }}
                className="grid grid-cols-3 gap-4 mb-6"
              >
                {/* Metric Label */}
                <div className="flex items-center p-6 card-service">
                  <div className="w-12 h-12 gradient-primary-subtle rounded-xl flex items-center justify-center mr-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{metric.label}</h3>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                </div>

                {/* Fixco Value */}
                <motion.div 
                  className="card-premium p-6 text-center relative overflow-hidden group"
                  whileHover={ultraEnabled ? { 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(34, 197, 94, 0.15)",
                    rotateY: 5
                  } : { scale: 1.02 }}
                  style={ultraEnabled ? { perspective: 1000 } : {}}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-3xl font-bold text-green-400 mb-2"
                      animate={ultraEnabled ? { 
                        textShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 20px rgba(34, 197, 94, 0.3)", "0 0 0px rgba(34, 197, 94, 0)"]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {formatValue(fixcoValue, metric)}{metric.unit}
                    </motion.div>
                    <div className="text-sm font-medium text-green-300">Fixco</div>
                    
                    {/* ROT Badge */}
                    {rotEnabled && metric.id === 'pricing' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                      >
                        ROT
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Competitor Value */}
                <motion.div 
                  className="card-premium p-6 text-center relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {formatValue(competitorValue, metric)}{metric.unit}
                  </div>
                  <div className="text-sm font-medium text-red-300">Konkurrenter</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-red-500/50 rounded-full animate-pulse" />
                </motion.div>
              </motion.div>
            );
          })}

          {/* Coverage Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="flex items-center p-6">
              <MapPin className="h-8 w-8 text-primary mr-4" />
              <span className="text-lg font-semibold">Täckningsområde</span>
            </div>
            
            <div className="card-premium p-6 text-center hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-green-400 mb-2">
                Uppsala & Stockholm
              </div>
              <div className="text-sm text-green-400 mb-2">+ Nationellt vid större projekt</div>
              <div className="text-xs text-muted-foreground">Fixco</div>
            </div>
            
            <div className="card-premium p-6 text-center">
              <div className="text-2xl font-bold text-red-400 mb-2">
                Begränsat område
              </div>
              <div className="text-sm text-red-400 mb-2">Lokala företag endast</div>
              <div className="text-xs text-muted-foreground">Konkurrenter</div>
            </div>
          </motion.div>
        </motion.div>

        {/* ROT Savings Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
          transition={{ delay: 2.0, duration: 0.7 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="card-premium p-8 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
              animate={ultraEnabled ? {
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1]
              } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative z-10">
              <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4 gradient-text">
                Spara {currentCase.pricing.base - currentCase.pricing.rot} kr/h med ROT-avdrag
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Med ROT-avdrag betalar du bara hälften för {currentCase.title.toLowerCase()}. 
                Fixco hanterar hela processen åt dig.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Utan ROT</div>
                  <div className="text-2xl font-bold text-red-400">
                    {currentCase.pricing.base} kr/h
                  </div>
                </div>
                
                <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-6 border border-primary/30 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                    MED ROT
                  </div>
                  <div className="text-sm text-primary mb-2">50% rabatt</div>
                  <div className="text-3xl font-bold text-green-400">
                    {currentCase.pricing.rot} kr/h
                  </div>
                </div>
                
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Du sparar</div>
                  <div className="text-2xl font-bold text-primary">
                    {currentCase.pricing.base - currentCase.pricing.rot} kr/h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonUltra;