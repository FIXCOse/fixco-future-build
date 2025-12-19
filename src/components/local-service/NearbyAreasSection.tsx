import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { generateAreaSlug, STOCKHOLM_AREAS, UPPSALA_AREAS, getAreaMetadata, type AreaKey } from "@/data/localServiceData";

interface NearbyAreasSectionProps {
  currentArea: AreaKey;
  serviceSlug: string;
  serviceName: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const NearbyAreasSection = ({ currentArea, serviceSlug, serviceName }: NearbyAreasSectionProps) => {
  const metadata = getAreaMetadata(currentArea);
  const isStockholm = metadata.region === "Stockholm";
  
  // Get areas from same region, excluding current
  const sameRegionAreas = (isStockholm ? STOCKHOLM_AREAS : UPPSALA_AREAS).filter(a => a !== currentArea);
  
  // Show max 8 nearby areas
  const nearbyAreas = sameRegionAreas.slice(0, 8);
  
  if (nearbyAreas.length === 0) return null;
  
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(240,10%,8%)] to-[hsl(250,12%,9%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                {serviceName} i närliggande orter
              </h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {metadata.region}sområdet
            </span>
          </motion.div>
          
          <motion.div variants={containerVariants} className="flex flex-wrap gap-2">
            {nearbyAreas.map((area) => (
              <motion.div key={area} variants={itemVariants}>
                <Link
                  to={`/tjanster/${serviceSlug}/${generateAreaSlug(area)}`}
                  className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-white/[0.06] to-white/[0.03] border border-white/10 text-sm text-foreground/80 hover:border-primary/40 hover:text-foreground hover:bg-primary/10 transition-all"
                >
                  <span>{area}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
