import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button-premium";
import { generateAreaSlug, STOCKHOLM_AREAS, UPPSALA_AREAS, type AreaKey } from "@/data/localServiceData";
import { useCopy } from "@/copy/CopyProvider";

interface ExpandableAreaLinksProps {
  currentArea: AreaKey;
  serviceSlug: string;
  serviceName: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  }
};

export const ExpandableAreaLinks = ({ currentArea, serviceSlug, serviceName }: ExpandableAreaLinksProps) => {
  const [showAllStockholm, setShowAllStockholm] = useState(false);
  const [showAllUppsala, setShowAllUppsala] = useState(false);
  const { locale } = useCopy();
  const servicePrefix = locale === 'en' ? '/en/services' : '/tjanster';
  
  const stockholmAreas = STOCKHOLM_AREAS.filter(a => a !== currentArea);
  const uppsalaAreas = UPPSALA_AREAS.filter(a => a !== currentArea);
  
  const INITIAL_COUNT = 12;
  
  const visibleStockholm = showAllStockholm ? stockholmAreas : stockholmAreas.slice(0, INITIAL_COUNT);
  const visibleUppsala = showAllUppsala ? uppsalaAreas : uppsalaAreas.slice(0, INITIAL_COUNT);
  
  const remainingStockholm = stockholmAreas.length - INITIAL_COUNT;
  const remainingUppsala = uppsalaAreas.length - INITIAL_COUNT;
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.h2 variants={itemVariants} className="text-lg font-semibold mb-6 text-foreground">
            {serviceName} i andra områden
          </motion.h2>
          
          {/* Stockholm */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Stockholmsområdet
              <span className="text-xs text-muted-foreground">({stockholmAreas.length})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {visibleStockholm.map((area) => (
                  <motion.div
                    key={area}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to={`${servicePrefix}/${serviceSlug}/${generateAreaSlug(area)}`}
                      className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all inline-block"
                    >
                      {area}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {remainingStockholm > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllStockholm(!showAllStockholm)}
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  {showAllStockholm ? (
                    <>Visa färre <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>+ {remainingStockholm} fler <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Uppsala */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Uppsalaområdet
              <span className="text-xs text-muted-foreground">({uppsalaAreas.length})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {visibleUppsala.map((area) => (
                  <motion.div
                    key={area}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to={`${servicePrefix}/${serviceSlug}/${generateAreaSlug(area)}`}
                      className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all inline-block"
                    >
                      {area}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {remainingUppsala > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllUppsala(!showAllUppsala)}
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  {showAllUppsala ? (
                    <>Visa färre <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>+ {remainingUppsala} fler <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
