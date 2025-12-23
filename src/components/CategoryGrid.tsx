import { useMemo } from "react";
import { Link } from "react-router-dom";
import { servicesDataNew } from "@/data/servicesDataNew";
import { LucideIcon } from "lucide-react";
import { useCopy } from '@/copy/CopyProvider';
import type { CopyKey } from '@/copy/keys';
import { FixcoFIcon } from '@/components/icons/FixcoFIcon';
import { useServices } from '@/hooks/useServices';
import { getGradientForService } from '@/utils/serviceGradients';

const CategoryGrid = () => {
  const { t, locale } = useCopy();
  const { data: dbServices = [] } = useServices(locale);

  // Map slugs to database category names (for cases where they differ)
  const slugToCategoryMap: Record<string, string> = {
    'malare': 'malning',
  };

  // Calculate service counts dynamically from database
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    servicesDataNew.forEach(cat => {
      const dbCategory = slugToCategoryMap[cat.slug] || cat.slug;
      counts[cat.slug] = dbServices.filter(service => 
        service.category === dbCategory || 
        service.additional_categories?.includes(dbCategory)
      ).length;
    });
    return counts;
  }, [dbServices]);

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
              <div className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center hover:scale-110 transition-all duration-300 z-10 bg-black/10 dark:bg-black/40 rounded-md p-1">
                <FixcoFIcon className="w-full h-full" />
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${getGradientForService(service.slug)}`}>
                <IconComponent className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Title */}
              <h3 className="text-base font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-rainbow-r transition-all duration-300">
                {t(translateKey) || service.title}
              </h3>
              
              {/* Sub-services count - dynamic from database */}
              <p className="text-xs text-muted-foreground">
                {serviceCounts[service.slug] || 0} {t('services.count')}
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
