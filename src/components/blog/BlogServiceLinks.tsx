import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useMemo } from 'react';
import { BLOG_CATEGORY_TO_SERVICES } from '@/data/blogSlugs';
import { LOCAL_SERVICES, type LocalServiceSlug } from '@/data/localServiceData';

interface BlogServiceLinksProps {
  category: string;
}

const TOP_AREAS = [
  { name: 'Stockholm', slug: 'stockholm' },
  { name: 'Uppsala', slug: 'uppsala' },
  { name: 'Solna', slug: 'solna' },
];

export const BlogServiceLinks = ({ category }: BlogServiceLinksProps) => {
  const links = useMemo(() => {
    const serviceSlugs = BLOG_CATEGORY_TO_SERVICES[category] || [];
    return serviceSlugs.slice(0, 3).flatMap(serviceSlug => {
      const svc = LOCAL_SERVICES[serviceSlug as LocalServiceSlug];
      const name = svc?.name || serviceSlug.replace(/-/g, ' ');
      return TOP_AREAS.slice(0, 2).map(area => ({
        serviceSlug,
        serviceName: name,
        area,
        label: `${name} i ${area.name}`,
        url: `/tjanster/${serviceSlug}/${area.slug}`,
      }));
    });
  }, [category]);

  if (links.length === 0) return null;

  return (
    <div className="my-8 p-6 rounded-xl border border-primary/20 bg-primary/5">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Boka tjänsten
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.slice(0, 6).map(link => (
          <Link
            key={link.url}
            to={link.url}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors group text-sm"
          >
            <span>{link.label}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};
