import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = { name: string; url: string };

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [], className = "" }) => {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="w-4 h-4" />}
          {i === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.name}</span>
          ) : (
            <Link to={item.url} className="hover:text-foreground transition-colors">
              {item.name}
            </Link>
          )}
        </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
