import { useRef, useEffect } from 'react';
import { Shield, MapPin, Clock, Award, Star, Briefcase, Heart, Zap, Calculator, Home, ThumbsUp, TrendingUp } from 'lucide-react';
import { AnimatedFixcoFIcon } from '@/components/icons/AnimatedFixcoFIcon';
import { gsap } from '@/lib/gsap';

const TrustBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const trustItems = [
    { icon: "image", text: "Fixco Kvalitet" },
    { icon: Clock, text: "Start inom < 5 dagar" },
    { icon: MapPin, text: "#1 i Uppsala & Stockholm" },
    { icon: Star, text: "4.9 ★ på Google" },
    { icon: Award, text: "Försäkrad & garanterad" },
    { icon: Briefcase, text: "10+ års erfarenhet" },
    { icon: Heart, text: "Personlig service" },
    { icon: Zap, text: "Snabb offert – samma dag" },
    { icon: Calculator, text: "ROT-avdrag inkluderat" },
    { icon: Home, text: "Gratis hembesök" },
    { icon: ThumbsUp, text: "Rekommenderas av 9 av 10" },
    { icon: TrendingUp, text: "98% nöjda kunder" },
  ];

  // GSAP hover effects only
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('.trust-item');
    
    items.forEach((item) => {
      const element = item as HTMLElement;
      const scaleTo = gsap.quickTo(element, "scale", { duration: 0.3, ease: "power2.out" });

      element.addEventListener('mouseenter', () => scaleTo(1.1));
      element.addEventListener('mouseleave', () => scaleTo(1));
    });
  }, []);

  // Triplicera items för sömlös loop
  const allItems = [...trustItems, ...trustItems, ...trustItems];

  return (
    <section className="py-8 border-y border-border bg-gradient-primary-subtle overflow-hidden mb-[120px] md:mb-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center overflow-hidden">
          <div ref={containerRef} className="flex animate-marquee">
            {allItems.map((item, index) => (
              <div 
                key={index}
                className="trust-item flex items-center space-x-2 mx-8 whitespace-nowrap cursor-pointer will-change-transform"
              >
                {item.icon === "image" ? (
                  <AnimatedFixcoFIcon className="h-5 w-5 shrink-0" />
                ) : (
                  (() => {
                    const IconComponent = item.icon as any;
                    return <IconComponent className="h-5 w-5 text-primary shrink-0" />;
                  })()
                )}
                <span className="text-sm font-medium text-foreground">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
