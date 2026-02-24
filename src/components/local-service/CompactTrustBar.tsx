import { motion } from "framer-motion";
import { Star, Clock, Shield, BadgeCheck } from "lucide-react";

interface CompactTrustBarProps {
  rating: number;
  area: string;
  rotRut: string;
}

export const CompactTrustBar = ({ rating, area, rotRut }: CompactTrustBarProps) => {
  const trustItems = [
    { icon: Star, text: `${rating.toFixed(1)}/5 betyg`, highlight: true },
    { icon: Clock, text: "Svar inom 2h" },
    { icon: BadgeCheck, text: `30% ${rotRut}-avdrag` },
    { icon: Shield, text: "Ansvarsförsäkrade" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="relative py-6"
    >
      {/* Background bar */}
      <div className="absolute inset-0 bg-muted/20" />
      
      {/* Trust items */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 relative z-10">
        {trustItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + idx * 0.1 }}
            className={`flex items-center gap-2 text-sm ${
              item.highlight 
                ? "text-foreground font-medium" 
                : "text-muted-foreground"
            }`}
          >
            <item.icon className={`h-4 w-4 ${item.highlight ? "text-amber-400" : "text-primary/60"}`} />
            <span>{item.text}</span>
            {idx < trustItems.length - 1 && (
              <span className="hidden md:block ml-4 text-border/50">·</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
