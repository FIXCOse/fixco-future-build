import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Info, Award, Users2 } from "lucide-react";
import CaseSwitcher from "./CaseSwitcher";
import ComparisonMetrics from "./ComparisonMetrics";
import InteractiveToggle from "./InteractiveToggle";

// Session storage key for tracking animations
const ANIMATION_KEY = 'fixco-comparison-v2-animated';

type CaseType = 'el' | 'vvs' | 'snickeri';
type RegionType = 'uppsala' | 'stockholm' | 'both';

const AdvancedComparisonV2 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseType>('el');
  const [showROT, setShowROT] = useState(true);
  const [region, setRegion] = useState<RegionType>('both');
  const [isSticky, setIsSticky] = useState(false);

  // Case-specific data
  const caseData = {
    el: {
      startTime: { fixco: 24, competitor: 7 },
      pricing: { base: 1059, rot: 530, competitor: 1200 },
      satisfaction: { fixco: 98, competitor: 82 }
    },
    vvs: {
      startTime: { fixco: 24, competitor: 8 },
      pricing: { base: 959, rot: 480, competitor: 1100 },
      satisfaction: { fixco: 97, competitor: 79 }
    },
    snickeri: {
      startTime: { fixco: 24, competitor: 6 },
      pricing: { base: 859, rot: 430, competitor: 950 },
      satisfaction: { fixco: 99, competitor: 81 }
    }
  };

  // Generate counter keys based on current case
  const generateCounterValues = (caseType: CaseType) => {
    const data = caseData[caseType];
    return {
      [`${caseType}_startTime_fixco`]: data.startTime.fixco,
      [`${caseType}_startTime_competitor`]: data.startTime.competitor,
      [`${caseType}_pricing_fixco`]: showROT ? data.pricing.rot : data.pricing.base,
      [`${caseType}_pricing_competitor`]: data.pricing.competitor,
      [`${caseType}_satisfaction_fixco`]: data.satisfaction.fixco,
      [`${caseType}_satisfaction_competitor`]: data.satisfaction.competitor
    };
  };

  const [counters, setCounters] = useState(() => {
    const animated = sessionStorage.getItem(ANIMATION_KEY) === 'true';
    return animated ? generateCounterValues(selectedCase) : {};
  });

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCounter = useCallback((key: string, target: number) => {
    if (prefersReducedMotion) {
      setCounters(prev => ({ ...prev, [key]: target }));
      return;
    }

    let startTime: number;
    const startValue = counters[key] || 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const duration = 1000;
      
      if (elapsed < duration) {
        const progress = 1 - Math.pow(1 - elapsed / duration, 3);
        const current = Math.floor(startValue + (target - startValue) * progress);
        
        setCounters(prev => ({ ...prev, [key]: current }));
        requestAnimationFrame(animate);
      } else {
        setCounters(prev => ({ ...prev, [key]: target }));
      }
    };
    
    requestAnimationFrame(animate);
  }, [counters, prefersReducedMotion]);

  // Handle case change with animation
  const handleCaseChange = useCallback((newCase: CaseType) => {
    setSelectedCase(newCase);
    
    if (hasAnimated) {
      const newValues = generateCounterValues(newCase);
      
      // Animate to new values
      Object.entries(newValues).forEach(([key, target], index) => {
        setTimeout(() => {
          animateCounter(key, target);
        }, index * 100);
      });
    }
  }, [hasAnimated, showROT, animateCounter]);

  // Handle ROT toggle
  const handleROTChange = useCallback((enabled: boolean) => {
    setShowROT(enabled);
    
    if (hasAnimated) {
      // Re-animate pricing values
      const data = caseData[selectedCase];
      const newPrice = enabled ? data.pricing.rot : data.pricing.base;
      animateCounter(`${selectedCase}_pricing_fixco`, newPrice);
    }
  }, [hasAnimated, selectedCase, animateCounter]);

  // Intersection Observer for initial animation
  useEffect(() => {
    const alreadyAnimated = sessionStorage.getItem(ANIMATION_KEY) === 'true';
    
    if (alreadyAnimated) {
      setHasAnimated(true);
      setAnimationStep(6);
      setCounters(generateCounterValues(selectedCase));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          
          sessionStorage.setItem(ANIMATION_KEY, 'true');
          
          const sequence = [
            () => setAnimationStep(1), // Headers
            () => setAnimationStep(2), // Case switcher
            () => setAnimationStep(3), // Toggles
            () => setAnimationStep(4), // Start metrics animation
            () => setAnimationStep(5), // Additional metrics
            () => setAnimationStep(6)  // Final highlight
          ];

          if (prefersReducedMotion) {
            setAnimationStep(6);
            setCounters(generateCounterValues(selectedCase));
          } else {
            sequence.forEach((step, index) => {
              setTimeout(step, index * 500);
            });
          }
          
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('comparison-v2-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated, prefersReducedMotion, selectedCase, showROT]);

  // Start counter animations
  useEffect(() => {
    if (animationStep >= 4 && !prefersReducedMotion && hasAnimated) {
      const targetValues = generateCounterValues(selectedCase);
      
      Object.entries(targetValues).forEach(([key, target], index) => {
        setTimeout(() => {
          animateCounter(key, target);
        }, index * 150);
      });
    }
  }, [animationStep, animateCounter, prefersReducedMotion, hasAnimated, selectedCase, showROT]);

  // Sticky scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('comparison-v2-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsSticky(rect.top <= 100 && rect.bottom > window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="comparison-v2-section" 
      className={`py-24 relative overflow-hidden transition-all duration-500 ${
        isSticky ? 'bg-background/95 backdrop-blur-md shadow-2xl' : ''
      }`}
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10" />
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 50%)',
            backgroundSize: '100% 100%'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: animationStep >= 1 ? 1 : 0, 
            y: animationStep >= 1 ? 0 : 30 
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            animate={{ 
              background: isVisible ? [
                "linear-gradient(45deg, hsl(var(--foreground)), hsl(var(--foreground)))",
                "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary-variant)))",
                "linear-gradient(45deg, hsl(var(--foreground)), hsl(var(--foreground)))"
              ] : undefined
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}
          >
            Fixco vs <span className="gradient-text">Konkurrenter</span>
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Interaktiv jämförelse som visar exakt varför fler väljer Fixco
          </p>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: animationStep >= 1 ? 1 : 0,
              scale: animationStep >= 1 ? 1 : 0.9
            }}
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
              <span>Marknadens snabbaste start</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Case Switcher */}
        <AnimatePresence mode="wait">
          {animationStep >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <CaseSwitcher
                selectedCase={selectedCase}
                onCaseChange={handleCaseChange}
                disabled={animationStep < 4}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Toggles */}
        <AnimatePresence mode="wait">
          {animationStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <InteractiveToggle
                showROT={showROT}
                onROTChange={handleROTChange}
                region={region}
                onRegionChange={setRegion}
                disabled={animationStep < 4}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Metrics */}
        <AnimatePresence mode="wait">
          {animationStep >= 4 && (
            <motion.div
              key={selectedCase} // Force re-mount on case change
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ComparisonMetrics
                case={selectedCase}
                showROT={showROT}
                counters={counters}
                animationStep={animationStep}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced ROT Savings Highlight */}
        <AnimatePresence mode="wait">
          {animationStep >= 6 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-16"
            >
              <div className="card-premium p-8 text-center relative overflow-hidden">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold mb-4 gradient-text">
                    Spara tusentals kronor med ROT-avdrag
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Med ROT-avdrag betalar du bara hälften. Fixco hanterar hela processen - 
                    från ansökan till utbetalning.
                  </p>
                  
                  {/* Savings calculator */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="grid md:grid-cols-3 gap-6 text-center"
                  >
                    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-2">Utan ROT</div>
                      <div className="text-2xl font-bold text-red-400">
                        {caseData[selectedCase].pricing.base} kr/h
                      </div>
                    </div>
                    
                    <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-6 border border-primary/30 relative">
                      <motion.div
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        BÄST
                      </motion.div>
                      <div className="text-sm text-primary mb-2">Med ROT (50% rabatt)</div>
                      <div className="text-3xl font-bold text-green-400">
                        {caseData[selectedCase].pricing.rot} kr/h
                      </div>
                    </div>
                    
                    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border">
                      <div className="text-sm text-muted-foreground mb-2">Du sparar</div>
                      <div className="text-2xl font-bold text-primary">
                        {caseData[selectedCase].pricing.base - caseData[selectedCase].pricing.rot} kr/h
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AdvancedComparisonV2;