import { useRef, useEffect } from 'react';
import { Shield, MapPin, Clock, Award, CheckCircle, Users } from 'lucide-react';
import { AnimatedFixcoFIcon } from '@/components/icons/AnimatedFixcoFIcon';
import { gsap } from '@/lib/gsap';

const TrustBar = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const trustItems = [
    {
      icon: "image",
      src: "/assets/fixco-f-icon-new.png",
      text: "Fixco Kvalitet"
    },
    {
      icon: Clock,
      text: "Start inom < 5 dagar"
    },
    {
      icon: MapPin,
      text: "Uppsala & Stockholm"
    },
    {
      icon: CheckCircle,
      text: "500+ nöjda kunder"
    },
    {
      icon: Award,
      text: "Försäkrad & garanterad"
    },
    {
      icon: Users,
      text: "Familjeföretag sedan 2015"
    }
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const items = Array.from(container.children);
    const firstHalf = items.slice(0, trustItems.length);
    
    // GSAP seamless loop animation
    gsap.to(container, {
      x: () => -(firstHalf[0] as HTMLElement).offsetWidth * trustItems.length,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: any) => parseFloat(x) % (-(firstHalf[0] as HTMLElement).offsetWidth * trustItems.length))
      }
    });

    // Magnetic hover on each item
    firstHalf.forEach((item) => {
      const element = item as HTMLElement;
      
      const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power2.out" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power2.out" });
      const scaleTo = gsap.quickTo(element, "scale", { duration: 0.3, ease: "power2.out" });

      element.addEventListener('mouseenter', () => {
        scaleTo(1.1);
      });

      element.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
        scaleTo(1);
      });
    });

    return () => {
      gsap.killTweensOf(container);
    };
  }, []);

  return (
    <section className="py-8 border-y border-border bg-gradient-primary-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center overflow-hidden">
          <div ref={scrollContainerRef} className="flex">
            {[...trustItems, ...trustItems].map((item, index) => {
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-2 mx-8 whitespace-nowrap cursor-pointer will-change-transform"
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
