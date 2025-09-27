import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useCopy } from '@/copy/CopyProvider';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useCopy();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    // Remove /en prefix for breadcrumb processing
    const cleanPath = path.startsWith('/en') ? path.replace('/en', '') || '/' : path;
    const segments = cleanPath.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('nav.home'), path: path.startsWith('/en') ? '/en' : '/' }
    ];

    // Map path segments to readable labels
    const segmentLabels: Record<string, string> = {
      'tjanster': t('nav.services'),
      'services': t('nav.services'),
      'snickeri': t('serviceCategories.snickeri'),
      'vvs': t('serviceCategories.vvs'),
      'montering': t('serviceCategories.montering'),
      'tradgard': t('serviceCategories.tradgard'),
      'stadning': t('serviceCategories.stadning'),
      'markarbeten': t('serviceCategories.markarbeten'),
      'tekniska-installationer': t('serviceCategories.tekniska-installationer'),
      'el': t('serviceCategories.el'),
      'flytt': t('serviceCategories.flytt'),
      'kontakt': t('nav.contact'),
      'contact': t('nav.contact'),
      'om-oss': t('nav.about'),
      'about': t('nav.about'),
      'faq': t('pages.faq.title'),
      'boka-hembesok': t('pages.contact.bookVisit'),
      'book-visit': t('pages.contact.bookVisit'),
      'rot-info': t('pages.rot.title'),
      'smart-hem': t('nav.smartHome'),
      'smart-home': t('nav.smartHome'),
      'referenser': t('nav.references'),
      'references': t('nav.references'),
      'privacy': t('pages.privacy.title'),
      'terms': t('pages.terms.title')
    };

    let currentPath = path.startsWith('/en') ? '/en' : '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segmentLabels[segment] || segment;
      
      // Only add path if not the last item
      const isLast = index === segments.length - 1;
      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/' || location.pathname === '/en') return null;

  return (
    <nav className="bg-muted/20 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
              )}
              
              {index === 0 && (
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              
              {item.path ? (
                <Link 
                  to={item.path} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;