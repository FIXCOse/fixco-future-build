import { useRef, useEffect } from 'react';
import { Shield, MapPin, Clock, Award, Star, Briefcase, Heart, Zap, Calculator, Home, ThumbsUp, TrendingUp } from 'lucide-react';
import { AnimatedFixcoFIcon } from '@/components/icons/AnimatedFixcoFIcon';
import { gsap } from '@/lib/gsap';
import { useCopy } from '@/copy/CopyProvider';
import type { CopyKey } from '@/copy/keys';

const TrustBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useCopy();
  
  const trustItems: { icon: any; textKey: CopyKey }[] = [
    { icon: "image", textKey: "trustbar.quality" },
    { icon: Clock, textKey: "trustbar.startTime" },
    { icon: MapPin, textKey: "trustbar.location" },
    { icon: Star, textKey: "trustbar.google" },
    { icon: Award, textKey: "trustbar.insured" },
    { icon: Briefcase, textKey: "trustbar.experience" },
    { icon: Heart, textKey: "trustbar.personal" },
    { icon: Zap, textKey: "trustbar.quickQuote" },
    { icon: Calculator, textKey: "trustbar.rot" },
    { icon: Home, textKey: "trustbar.freeVisit" },
    { icon: ThumbsUp, textKey: "trustbar.recommended" },
    { icon: TrendingUp, textKey: "trustbar.satisfied" },
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
    <section className="py-8 border-y border-border bg-gradient-primary-subtle overflow-hidden">
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
                  {t(item.textKey)}
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
