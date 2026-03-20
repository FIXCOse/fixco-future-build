import { motion } from "framer-motion";
import { TrendingDown, Info } from "lucide-react";
import type { ServicePriceGuide } from "@/data/carpentryPriceData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

interface PriceGuideSectionProps {
  guide: ServicePriceGuide;
  area: string;
  locale: 'sv' | 'en';
  rotRut: string;
}

const formatPrice = (n: number): string => {
  return n.toLocaleString('sv-SE');
};

export const PriceGuideSection = ({ guide, area, locale, rotRut }: PriceGuideSectionProps) => {
  const isEn = locale === 'en';
  const headline = (isEn ? guide.headlineEn : guide.headline).replace(/\{area\}/g, area);
  const intro = (isEn ? guide.introEn : guide.intro).replace(/\{area\}/g, area);
  const afterNote = isEn ? guide.afterRotNoteEn : guide.afterRotNote;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {isEn ? 'Price Guide' : 'Prisguide'}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {headline}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              {intro}
            </p>
          </motion.div>

          {/* Price table */}
          <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3.5 px-5 text-sm font-semibold text-foreground">
                      {isEn ? 'Project type' : 'Projekttyp'}
                    </th>
                    <th className="text-right py-3.5 px-5 text-sm font-semibold text-foreground">
                      {isEn ? 'Price range' : 'Prisintervall'}
                    </th>
                    <th className="text-right py-3.5 px-5 text-sm font-semibold text-primary">
                      <span className="flex items-center justify-end gap-1.5">
                        <TrendingDown className="h-4 w-4" />
                        {isEn ? `After ${rotRut}` : `Efter ${rotRut}`}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guide.prices.map((row, idx) => {
                    const enRow = guide.pricesEn[idx];
                    const project = isEn && enRow ? enRow.project : row.project;
                    const unit = isEn && enRow ? enRow.unit : row.unit;
                    const note = isEn && enRow ? enRow.note : row.note;
                    const afterFrom = Math.round(row.priceFrom * 0.7);
                    const afterTo = Math.round(row.priceTo * 0.7);
                    
                    return (
                      <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-5">
                          <span className="text-sm font-medium text-foreground">{project}</span>
                          {note && (
                            <span className="block text-xs text-muted-foreground mt-0.5">{note}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="text-sm tabular-nums text-muted-foreground">
                            {formatPrice(row.priceFrom)}–{formatPrice(row.priceTo)} {unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="text-sm tabular-nums font-medium text-primary">
                            {formatPrice(afterFrom)}–{formatPrice(afterTo)} {unit}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Note */}
          <motion.div variants={itemVariants} className="mt-4 flex items-start gap-2.5 text-sm text-muted-foreground">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{afterNote}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
