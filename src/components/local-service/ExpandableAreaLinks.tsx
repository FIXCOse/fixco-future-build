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
    <section className="py-14 relative">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-xl font-bold mb-6 text-center text-foreground/80">
            {serviceName} i andra områden
          </motion.h2>
          
          {/* Stockholm */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Stockholmsområdet
              <span className="text-xs text-muted-foreground/60">({stockholmAreas.length} orter)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {visibleStockholm.map((area) => (
                  <motion.div
                    key={area}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`${servicePrefix}/${serviceSlug}/${generateAreaSlug(area)}`}
                      className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground/70 hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-all inline-block"
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
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  {showAllStockholm ? (
                    <>
                      Visa färre
                      <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      + {remainingStockholm} fler orter
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Uppsala */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Uppsalaområdet
              <span className="text-xs text-muted-foreground/60">({uppsalaAreas.length} orter)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {visibleUppsala.map((area) => (
                  <motion.div
                    key={area}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`${servicePrefix}/${serviceSlug}/${generateAreaSlug(area)}`}
                      className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground/70 hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-all inline-block"
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
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  {showAllUppsala ? (
                    <>
                      Visa färre
                      <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      + {remainingUppsala} fler orter
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
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
