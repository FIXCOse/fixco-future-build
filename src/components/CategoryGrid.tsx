import { Link } from "react-router-dom";
import { servicesDataNew } from "@/data/servicesDataNew";
import { LucideIcon } from "lucide-react";
import { useCopy } from '@/copy/CopyProvider';
import type { CopyKey } from '@/copy/keys';

// Smart hem-inspirerade färger för olika tjänstekategorier
const getGradientForService = (slug: string): string => {
  const gradients: Record<string, string> = {
    'el': 'bg-gradient-to-r from-yellow-400 to-orange-500', // Gul-orange (elektricitet)
    'vvs': 'bg-gradient-to-r from-blue-400 to-cyan-500', // Blå-cyan (vatten)
    'snickeri': 'bg-gradient-to-r from-amber-500 to-orange-600', // Amber-orange (trä)
    'montering': 'bg-gradient-to-r from-purple-500 to-violet-600', // Lila-violet
    'tradgard': 'bg-gradient-to-r from-green-400 to-lime-500', // Grön-lime (natur)
    'stadning': 'bg-gradient-to-r from-pink-400 to-rose-500', // Rosa-rose
    'markarbeten': 'bg-gradient-to-r from-stone-500 to-amber-600', // Sten-amber (jord)
    'tekniska-installationer': 'bg-gradient-to-r from-slate-500 to-gray-600', // Grå-silver (tech)
    'flytt': 'bg-gradient-to-r from-red-400 to-pink-500' // Röd-rosa (energi/rörelse)
  };
  
  return gradients[slug] || 'bg-gradient-to-r from-gray-400 to-gray-500';
};

const CategoryGrid = () => {
  const { t, locale } = useCopy();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {servicesDataNew.map((service, index) => {
        const IconComponent = service.icon as LucideIcon;
        const basePath = locale === 'en' ? '/en/services' : '/tjanster';
        const translateKey = `serviceCategories.${service.slug}` as CopyKey;
        
        return (
          <Link
            key={service.slug}
            to={`${basePath}/${service.slug}`}
            className="group"
          >
            <div 
              className="card-service p-6 text-center h-full transition-all duration-300 animate-fade-in-up hover-scale"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* F Brand Badge - Bottom Right */}
              <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition-all duration-300 z-10 bg-primary/20 rounded-lg">
                <img 
                  src="/assets/fixco-f-icon-new.png" 
                  alt="Fixco"
                  className="w-5 h-5 object-contain"
                />
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${getGradientForService(service.slug)}`}>
                <IconComponent className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Title */}
              <h3 className="text-base font-bold group-hover:text-primary transition-colors mb-2">
                {t(translateKey) || service.title}
              </h3>
              
              {/* Sub-services count */}
              <p className="text-xs text-muted-foreground">
                {service.subServices.length} {t('services.count')}
              </p>
              
              {/* Hover indicator */}
              <div className="mt-3 text-primary text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                {t('cta.see_all')}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryGrid;