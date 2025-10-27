import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: string;
}

export const GlassCard = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  glowColor = "hsl(262 83% 58% / 0.3)"
}: GlassCardProps) => {
  const Card = hoverEffect ? motion.div : "div";
  
  return (
    <Card
      className={cn(
        "relative rounded-2xl backdrop-blur-md bg-white/5 border border-white/10",
        "transition-all duration-300",
        hoverEffect && "hover:bg-white/10 hover:border-white/20",
        className
      )}
      {...(hoverEffect && {
        whileHover: { 
          y: -8,
          boxShadow: `0 20px 40px -10px ${glowColor}`
        },
        transition: { duration: 0.3, ease: "easeOut" }
      })}
    >
      {children}
    </Card>
  );
};
