import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { RELATED_SERVICES_MAP } from '@/data/blogSlugs';
import { LOCAL_SERVICES, type LocalServiceSlug } from '@/data/localServiceData';

interface RelatedServicesSectionProps {
  serviceSlug: string;
  areaSlug: string;
  areaName: string;
  locale?: string;
}

export const RelatedServicesSection = ({ serviceSlug, areaSlug, areaName, locale = 'sv' }: RelatedServicesSectionProps) => {
  const isEnglish = locale === 'en';
  const servicePrefix = isEnglish ? '/en/services' : '/tjanster';

  const relatedServices = useMemo(() => {
    const slugs = RELATED_SERVICES_MAP[serviceSlug] || [];
    return slugs.slice(0, 5).map(slug => {
      const svc = LOCAL_SERVICES[slug as LocalServiceSlug];
      return {
        slug,
        name: svc?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      };
    });
  }, [serviceSlug]);

  if (relatedServices.length === 0) return null;

  return (
    <section className="py-8 border-t border-border">
      <h2 className="text-lg font-bold mb-4">
        {isEnglish
          ? `More services in ${areaName}`
          : `Fler tjänster i ${areaName}`}
      </h2>
      <div className="flex flex-wrap gap-2">
        {relatedServices.map(svc => (
          <Link
            key={svc.slug}
            to={`${servicePrefix}/${svc.slug}/${areaSlug}`}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            {svc.name}
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
};
