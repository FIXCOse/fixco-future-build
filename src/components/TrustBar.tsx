import { Shield, MapPin, Clock, Award, CheckCircle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TrustBar = () => {
  const { t } = useTranslation('common');
  const trustItems = [
    {
      icon: "image",
      src: "/assets/fixco-f-icon-new.png",
      text: t('trust.fixco_quality', { defaultValue: "Fixco Kvalitet" })
    },
    {
      icon: Clock,
      text: t('trust.quick_start', { defaultValue: "Start inom < 5 dagar" })
    },
    {
      icon: MapPin,
      text: t('trust.locations', { defaultValue: "Uppsala & Stockholm" })
    },
    {
      icon: CheckCircle,
      text: t('trust.satisfied_customers', { defaultValue: "500+ nöjda kunder" })
    },
    {
      icon: Award,
      text: t('trust.insured_guaranteed', { defaultValue: "Försäkrad & garanterad" })
    },
    {
      icon: Users,
      text: t('trust.family_business', { defaultValue: "Familjeföretag sedan 2015" })
    }
  ];

  return (
    <section className="py-8 border-y border-border bg-gradient-primary-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="overflow-hidden w-full max-w-6xl">
            <div className="flex animate-scroll-left">
              {[...trustItems, ...trustItems].map((item, index) => {
                return (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 mx-8 whitespace-nowrap"
                  >
                    {item.icon === "image" ? (
                      <img 
                        src={item.src} 
                        alt="Fixco Brand" 
                        className="h-5 w-5 object-contain opacity-80 shrink-0"
                      />
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