import { motion } from "framer-motion";
import { CheckCircle, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { serviceComparisonData, ServiceComparisonItem } from "@/data/serviceComparisonData";

interface ServiceComparisonCardProps {
  serviceKey: string;
  city: string;
}

export const ServiceComparisonCard = ({ serviceKey, city }: ServiceComparisonCardProps) => {
  const comparisonData = serviceComparisonData[serviceKey] || serviceComparisonData['default'];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              ⚡ Jämförelse
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Fixco vs andra företag i {city}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Se vad som skiljer oss från andra leverantörer - transparenta priser, snabb start och alltid med garanti
            </p>
          </motion.div>

          {/* Comparison Grid - Desktop */}
          <div className="hidden md:block">
            {/* Header Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="grid grid-cols-[2fr,1.5fr,1.5fr] gap-4 mb-4"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-muted-foreground">Kriteria</h3>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Fixco
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">Din pålitliga partner</p>
              </div>
              <div className="bg-muted/30 border border-muted rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-muted-foreground">Andra</h3>
                </div>
                <p className="text-xs text-muted-foreground">Typiskt hos konkurrenter</p>
              </div>
            </motion.div>

            {/* Data Rows */}
            <div className="space-y-3">
              {comparisonData.map((item: ServiceComparisonItem, index: number) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="grid grid-cols-[2fr,1.5fr,1.5fr] gap-4 items-center"
                >
                  {/* Label */}
                  <div className="bg-card border rounded-xl p-4 flex items-center min-h-[70px]">
                    <h4 className="font-semibold text-base">{item.label}</h4>
                  </div>

                  {/* Fixco Value */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl p-4 relative min-h-[70px] flex items-center justify-center"
                  >
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-green-500" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {item.fixco}
                      </div>
                      {item.fixcoSubtext && (
                        <p className="text-xs text-muted-foreground mt-1">{item.fixcoSubtext}</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Competitor Value */}
                  <div className="bg-muted/20 border border-muted rounded-xl p-4 relative min-h-[70px] flex items-center justify-center">
                    {item.competitorBad && (
                      <X className="absolute top-2 right-2 h-4 w-4 text-red-400" />
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold text-muted-foreground">
                        {item.competitor}
                      </div>
                      {item.competitorSubtext && (
                        <p className="text-xs text-muted-foreground mt-1">{item.competitorSubtext}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Comparison Grid - Mobile */}
          <div className="md:hidden space-y-4">
            {/* Mobile Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="grid grid-cols-3 gap-2 text-center mb-4"
            >
              <div className="text-xs font-medium text-muted-foreground">Kriteria</div>
              <div className="text-xs font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Fixco ✓
              </div>
              <div className="text-xs font-medium text-muted-foreground">Andra</div>
            </motion.div>

            {/* Mobile Data Rows */}
            {comparisonData.map((item: ServiceComparisonItem, index: number) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="grid grid-cols-3 gap-2 items-center"
              >
                {/* Label */}
                <div className="bg-card border rounded-lg p-3 min-h-[60px] flex items-center">
                  <h4 className="font-semibold text-xs leading-tight">{item.label}</h4>
                </div>

                {/* Fixco Value */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-lg p-3 relative min-h-[60px] flex items-center justify-center">
                  <CheckCircle className="absolute top-1 right-1 h-3 w-3 text-green-500" />
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">{item.fixco}</div>
                  </div>
                </div>

                {/* Competitor Value */}
                <div className="bg-muted/20 border border-muted rounded-lg p-3 relative min-h-[60px] flex items-center justify-center">
                  {item.competitorBad && (
                    <X className="absolute top-1 right-1 h-3 w-3 text-red-400" />
                  )}
                  <div className="text-center">
                    <div className="text-sm font-bold text-muted-foreground">{item.competitor}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 md:mt-12"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Upplev Fixco-skillnaden i {city}
              </h3>
              <p className="text-muted-foreground mb-6 text-sm md:text-base">
                Vi erbjuder transparent prissättning, snabb start och alltid med garanti. 
                Få din kostnadsfria offert idag!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="default">
                  <Link to="/kontakt">
                    Få kostnadsfri offert
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/tjanster">
                    Se alla tjänster
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
