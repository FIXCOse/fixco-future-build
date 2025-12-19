import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  rating?: number;
}

export const TestimonialCard = ({ quote, name, location, rating = 5 }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Card */}
      <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        {/* Quote icon decoration */}
        <div className="absolute top-4 right-4 opacity-10">
          <Quote className="w-16 h-16 text-primary" />
        </div>
        
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        
        {/* Quote */}
        <blockquote className="text-lg text-foreground/90 mb-6 relative z-10">
          "{quote}"
        </blockquote>
        
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
