import { Link } from "react-router-dom";
import { servicesDataNew } from "@/data/servicesDataNew";
import { LucideIcon } from "lucide-react";

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {servicesDataNew.map((service, index) => {
        const IconComponent = service.icon as LucideIcon;
        return (
          <Link
            key={service.slug}
            to={`/tjanster/${service.slug}`}
            className="group"
          >
            <div 
              className="card-service p-6 text-center h-full hover:shadow-glow transition-all duration-300 animate-fade-in-up hover-scale"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* F Brand Badge - Bottom Right, Larger & More Visible */}
              <div className="absolute bottom-3 right-3 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                <img 
                  src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                  alt="Fixco" 
                  className="h-3 w-3 object-contain opacity-90"
                />
              </div>

              {/* Icon */}
              <div className="w-12 h-12 mx-auto gradient-primary-subtle rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <IconComponent className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Title */}
              <h3 className="text-base font-bold group-hover:text-primary transition-colors mb-2">
                {service.title}
              </h3>
              
              {/* Sub-services count */}
              <p className="text-xs text-muted-foreground">
                {service.subServices.length} tjänster
              </p>
              
              {/* Hover indicator */}
              <div className="mt-3 text-primary text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                Se alla →
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryGrid;