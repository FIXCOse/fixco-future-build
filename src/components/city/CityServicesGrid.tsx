import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Wrench, Hammer, Paintbrush, TreePine, Package, Home, Truck, Settings, ArrowRight, type LucideIcon } from "lucide-react";
import { getGradientForService } from "@/utils/serviceGradients";

interface CityServicesGridProps {
  citySlug: string;
}

interface ServiceItem {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

const services: ServiceItem[] = [
  { slug: "el", name: "Elektriker", icon: Zap, description: "El & installation" },
  { slug: "vvs", name: "VVS", icon: Wrench, description: "Rör & vatten" },
  { slug: "snickeri", name: "Snickeri", icon: Hammer, description: "Trä & bygg" },
  { slug: "malare", name: "Målare", icon: Paintbrush, description: "Färg & tapet" },
  { slug: "tradgard", name: "Trädgård", icon: TreePine, description: "Utemiljö" },
  { slug: "montering", name: "Montering", icon: Package, description: "Möbler & inredning" },
  { slug: "markarbeten", name: "Markarbeten", icon: Home, description: "Mark & grund" },
  { slug: "flytt", name: "Flytt", icon: Truck, description: "Flytt & transport" },
  { slug: "tekniska-installationer", name: "Tekniska installationer", icon: Settings, description: "Tech & automation" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }
  }
};

export const CityServicesGrid = ({ citySlug }: CityServicesGridProps) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {services.map((service) => {
        const Icon = service.icon;
        const gradient = getGradientForService(service.slug);
        
        return (
          <motion.div key={service.slug} variants={itemVariants}>
            <Link
              to={`/tjanster/${service.slug}/${citySlug}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Icon with gradient */}
              <div className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Service name */}
              <div className="text-center">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {service.description}
                </p>
              </div>
              
              {/* Arrow on hover */}
              <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
