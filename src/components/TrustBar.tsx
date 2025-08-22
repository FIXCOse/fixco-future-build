import { Shield, MapPin, Clock, Award, CheckCircle, Users } from 'lucide-react';

const TrustBar = () => {
  const trustItems = [
    {
      icon: Shield,
      text: "ROT-certifierad"
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

  return (
    <section className="py-8 border-y border-border bg-gradient-primary-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="overflow-hidden w-full max-w-6xl">
            <div className="flex animate-scroll-left">
              {[...trustItems, ...trustItems].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 mx-8 whitespace-nowrap"
                  >
                    <IconComponent className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-left {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustBar;