import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateAreaSlug, STOCKHOLM_AREAS, UPPSALA_AREAS, getAreaMetadata, type AreaKey } from "@/data/localServiceData";
import { useCopy } from "@/copy/CopyProvider";

interface NearbyAreasSectionProps {
  currentArea: AreaKey;
  serviceSlug: string;
  serviceName: string;
}

const INITIAL_COUNT = 8;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.95,
    transition: { duration: 0.15 }
  }
};

export const NearbyAreasSection = ({ currentArea, serviceSlug, serviceName }: NearbyAreasSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const { locale } = useCopy();
  const servicePrefix = locale === 'en' ? '/en/services' : '/tjanster';
  
  const metadata = getAreaMetadata(currentArea);
  const isStockholm = metadata.region === "Stockholm";
  
  // Get areas from same region, excluding current
  const sameRegionAreas = (isStockholm ? STOCKHOLM_AREAS : UPPSALA_AREAS).filter(a => a !== currentArea);
  
  // Show either first INITIAL_COUNT or all areas
  const nearbyAreas = showAll 
    ? sameRegionAreas 
    : sameRegionAreas.slice(0, INITIAL_COUNT);
  
  const remainingCount = sameRegionAreas.length - INITIAL_COUNT;
  
  if (sameRegionAreas.length === 0) return null;
  
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      
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
          
          <motion.div layout className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {nearbyAreas.map((area) => (
                <motion.div 
                  key={area} 
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <Link
                    to={`${servicePrefix}/${serviceSlug}/${generateAreaSlug(area)}`}
                    className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground/80 hover:border-primary/40 hover:text-foreground hover:bg-primary/10 transition-all"
                  >
                    <span>{area}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {remainingCount > 0 && (
              <motion.div variants={itemVariants} layout>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="h-auto px-4 py-2 text-sm text-primary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30"
                >
                  {showAll ? (
                    <>
                      Visa färre
                      <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Visa alla ({sameRegionAreas.length})
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
