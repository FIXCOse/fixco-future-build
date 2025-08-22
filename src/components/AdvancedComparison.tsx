import { useState, useEffect, useCallback } from "react";
import { Check, X, Clock, DollarSign, MapPin, Star, TrendingUp } from "lucide-react";

// Session storage key for tracking animations
const ANIMATION_KEY = 'fixco-comparison-animated';

const AdvancedComparison = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Final counter values
  const finalValues = {
    fixcoStart: 24,
    competitorStart: 10,
    fixcoPrice: 480,
    competitorPrice: 1200,
    fixcoSatisfaction: 98,
    competitorSatisfaction: 80
  };

  const [counters, setCounters] = useState(() => {
    // Check if animation already happened in this session
    const animated = sessionStorage.getItem(ANIMATION_KEY) === 'true';
    return animated ? finalValues : {
      fixcoStart: 0,
      competitorStart: 0,
      fixcoPrice: 0,
      competitorPrice: 0,
      fixcoSatisfaction: 0,
      competitorSatisfaction: 0
    };
  });

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCounter = useCallback((key: keyof typeof counters, target: number) => {
    if (prefersReducedMotion) {
      setCounters(prev => ({ ...prev, [key]: target }));
      return;
    }

    let startTime: number;
    let startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const duration = 1200; // 1.2s animation
      
      if (elapsed < duration) {
        // Smooth ease-out curve
        const progress = 1 - Math.pow(1 - elapsed / duration, 3);
        const current = Math.floor(startValue + (target - startValue) * progress);
        
        setCounters(prev => ({ ...prev, [key]: current }));
        requestAnimationFrame(animate);
      } else {
        setCounters(prev => ({ ...prev, [key]: target }));
      }
    };
    
    requestAnimationFrame(animate);
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Check if already animated this session
    const alreadyAnimated = sessionStorage.getItem(ANIMATION_KEY) === 'true';
    
    if (alreadyAnimated) {
      setHasAnimated(true);
      setAnimationStep(6);
      setCounters(finalValues);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          
          // Mark as animated in session storage
          sessionStorage.setItem(ANIMATION_KEY, 'true');
          
          // Start animation sequence
          const sequence = [
            () => setAnimationStep(1), // Show headers
            () => setAnimationStep(2), // Start counters
            () => setAnimationStep(3), // Show first metric
            () => setAnimationStep(4), // Show second metric  
            () => setAnimationStep(5), // Show third metric
            () => setAnimationStep(6)  // Show final highlight
          ];

          if (prefersReducedMotion) {
            // Skip animation for reduced motion
            setAnimationStep(6);
            setCounters(finalValues);
          } else {
            sequence.forEach((step, index) => {
              setTimeout(step, index * 600);
            });
          }
          
          // Unobserve after first trigger
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('comparison-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated, prefersReducedMotion, finalValues]);

  useEffect(() => {
    if (animationStep >= 2 && !prefersReducedMotion && !hasAnimated) {
      // Animate counters with staggered start
      Object.entries(finalValues).forEach(([key, target], index) => {
        setTimeout(() => {
          animateCounter(key as keyof typeof counters, target);
        }, index * 150);
      });
    }
  }, [animationStep, animateCounter, prefersReducedMotion, hasAnimated, finalValues]);

  const metrics = [
    {
      icon: Clock,
      label: "Projektstart",
      fixcoValue: `${counters.fixcoStart}h`,
      competitorValue: `${counters.competitorStart} dagar`,
      fixcoColor: "text-green-400",
      competitorColor: "text-red-400",
      unit: ""
    },
    {
      icon: DollarSign, 
      label: "Timpris (efter ROT)",
      fixcoValue: `${counters.fixcoPrice}`,
      competitorValue: `${counters.competitorPrice}`,
      fixcoColor: "text-green-400",
      competitorColor: "text-red-400", 
      unit: "kr/h"
    },
    {
      icon: Star,
      label: "Kundnöjdhet",
      fixcoValue: `${counters.fixcoSatisfaction}`,
      competitorValue: `${counters.competitorSatisfaction}`,
      fixcoColor: "text-green-400",
      competitorColor: "text-yellow-400",
      unit: "%"
    }
  ];

  return (
    <section id="comparison-section" className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Fixco vs <span className="gradient-text">Konkurrenter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            En objektiv jämförelse som talar för sig själv
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto">
          {/* Headers */}
          <div className={`grid grid-cols-3 gap-4 mb-8 transition-all duration-1000 ${
            animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div></div>
            <div className="card-premium p-6 text-center bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <div className="flex items-center justify-center mb-3">
                <Check className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-2xl font-bold gradient-text">FIXCO</span>
              </div>
              <p className="text-sm text-green-400">Branschledande</p>
            </div>
            <div className="card-premium p-6 text-center bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <div className="flex items-center justify-center mb-3">
                <X className="h-6 w-6 text-red-400 mr-2" />
                <span className="text-2xl font-bold text-foreground">KONKURRENTER</span>
              </div>
              <p className="text-sm text-red-400">Genomsnitt i branschen</p>
            </div>
          </div>

          {/* Metrics */}
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const isVisible = animationStep >= 3 + index;
            
            return (
              <div 
                key={metric.label}
                className={`grid grid-cols-3 gap-4 mb-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center p-6">
                  <IconComponent className="h-8 w-8 text-primary mr-4" />
                  <span className="text-lg font-semibold">{metric.label}</span>
                </div>
                
                <div className="card-premium p-6 text-center hover:scale-105 transition-transform">
                  <div className={`text-3xl font-bold ${metric.fixcoColor} mb-2`}>
                    {metric.fixcoValue}{metric.unit}
                  </div>
                  <div className="text-sm text-muted-foreground">Fixco</div>
                </div>
                
                <div className="card-premium p-6 text-center">
                  <div className={`text-3xl font-bold ${metric.competitorColor} mb-2`}>
                    {metric.competitorValue}{metric.unit}
                  </div>
                  <div className="text-sm text-muted-foreground">Konkurrenter</div>
                </div>
              </div>
            );
          })}

          {/* Coverage Area */}
          <div className={`grid grid-cols-3 gap-4 mb-8 transition-all duration-700 ${
            animationStep >= 6 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
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
          </div>

          {/* ROT Savings Highlight */}
          <div className={`mt-12 transition-all duration-1000 ${
            animationStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="card-premium p-8 text-center gradient-primary-subtle border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
              <div className="relative z-10">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
                <h3 className="text-2xl font-bold mb-3 gradient-text">ROT-avdrag ger dig 50% rabatt</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Vårt timpris 959 kr/h blir endast <span className="text-primary font-bold">480 kr/h</span> med ROT-avdrag
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="font-semibold text-primary">Fixco med ROT</div>
                    <div className="text-2xl font-bold text-green-400">480 kr/h</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="font-semibold text-muted-foreground">Konkurrenter med ROT</div>
                    <div className="text-2xl font-bold text-red-400">550-650 kr/h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedComparison;