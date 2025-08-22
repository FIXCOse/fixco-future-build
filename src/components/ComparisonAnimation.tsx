import { useState, useEffect } from "react";
import { Clock, Euro, MapPin, CheckCircle, XCircle } from "lucide-react";

const ComparisonAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start animation sequence
          const steps = [0, 1, 2, 3, 4];
          steps.forEach((step, index) => {
            setTimeout(() => setAnimationStep(step), index * 800);
          });
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('comparison-animation');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const metrics = [
    {
      label: "Projektstart",
      fixco: "24h",
      competitors: "7-14 dagar",
      icon: Clock,
      unit: ""
    },
    {
      label: "Timpris (ROT)",
      fixco: "480",
      competitors: "800-950",
      icon: Euro,
      unit: "kr/h"
    },
    {
      label: "Täckningsområde",
      fixco: "Hela Sverige",
      competitors: "Lokalt begränsat",
      icon: MapPin,
      unit: ""
    }
  ];

  return (
    <section id="comparison-animation" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 hero-background opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Varför välja <span className="gradient-text">Fixco</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vi levererar snabbare, billigare och mer professionellt än våra konkurrenter
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div></div>
            <div className="text-center">
              <div className="gradient-text text-2xl font-bold mb-2">FIXCO</div>
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-2">KONKURRENTER</div>
              <XCircle className="h-8 w-8 text-red-500 mx-auto" />
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-8">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              const isAnimated = animationStep > index;
              
              return (
                <div 
                  key={metric.label}
                  className={`grid grid-cols-3 gap-8 items-center p-6 card-premium transition-all duration-1000 ${
                    isAnimated ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Metric Label */}
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">{metric.label}</span>
                  </div>

                  {/* Fixco Value */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold gradient-text transition-all duration-1000 ${
                      isAnimated ? 'scale-110 animate-glow' : 'scale-100'
                    }`}>
                      {metric.fixco}
                      <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                    </div>
                  </div>

                  {/* Competitors Value */}
                  <div className="text-center">
                    <div className={`text-2xl font-semibold text-muted-foreground transition-all duration-1000 ${
                      isAnimated ? 'opacity-70' : 'opacity-100'
                    }`}>
                      {metric.competitors}
                      <span className="text-sm ml-1">{metric.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ROT Savings Highlight */}
          <div className={`mt-12 p-8 card-premium rot-highlight text-center transition-all duration-1000 ${
            animationStep > 2 ? 'animate-scale-in opacity-100' : 'opacity-0'
          }`}>
            <h3 className="text-2xl font-bold mb-4">
              Spara <span className="gradient-text text-4xl">50%</span> med ROT-avdrag
            </h3>
            <p className="text-lg text-muted-foreground mb-4">
              Från 959 kr/h ner till endast 480 kr/h inklusive moms
            </p>
            <div className="text-sm text-muted-foreground">
              * ROT-avdrag på 50% av arbetskostnaden, max 50 000 kr per person och år
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonAnimation;