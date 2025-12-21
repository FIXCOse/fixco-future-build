import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { TestimonialData } from "@/data/areaActivityData";

interface Props {
  testimonials: TestimonialData[];
}

export const TestimonialCarouselLocal = ({ testimonials }: Props) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Duplicera för oändlig loop
  const loopedItems = [...testimonials, ...testimonials];
  
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        
        // Reset scroll när halva vägen nådd (seamless loop)
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  return (
    <div 
      ref={scrollRef}
      className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-4 -mx-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ scrollBehavior: 'auto' }}
    >
      {loopedItems.map((testimonial, idx) => (
        <TestimonialSlide key={idx} {...testimonial} />
      ))}
    </div>
  );
};

const TestimonialSlide = ({ quote, name, location, rating }: TestimonialData) => (
  <motion.div 
    className="flex-shrink-0 w-[300px] md:w-[350px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors"
    whileHover={{ scale: 1.02, y: -4 }}
  >
    {/* Quote icon */}
    <div className="mb-4">
      <Quote className="w-8 h-8 text-primary/40" />
    </div>
    
    {/* Stars */}
    <div className="flex gap-1 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
      {Array.from({ length: 5 - rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-white/20" />
      ))}
    </div>
    
    {/* Quote */}
    <p className="text-foreground/90 text-sm leading-relaxed mb-6">"{quote}"</p>
    
    {/* Author */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20">
        <span className="text-sm font-bold text-primary">{name.charAt(0)}</span>
      </div>
      <div>
        <p className="font-medium text-foreground text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{location}</p>
      </div>
    </div>
  </motion.div>
);
