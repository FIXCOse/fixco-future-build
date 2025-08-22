import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Hem', path: '/' }
    ];

    // Map path segments to readable labels
    const segmentLabels: Record<string, string> = {
      'tjanster': 'Tjänster',
      'snickeri': 'Snickeri',
      'vvs': 'VVS',
      'montering': 'Montering',
      'tradgard': 'Trädgård',
      'stadning': 'Städning',
      'projektledning': 'Projektledning',
      'markarbeten': 'Markarbeten',
      'tekniska-installationer': 'Tekniska installationer',
      'el': 'El',
      'fastighetsskotsel': 'Fastighetsskötsel',
      'kontakt': 'Kontakt',
      'om-oss': 'Om oss',
      'faq': 'FAQ',
      'boka-hembesok': 'Boka hembesök',
      'rot-info': 'ROT-information',
      'referenser': 'Referenser'
    };

    let currentPath = '';
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
  if (location.pathname === '/') return null;

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