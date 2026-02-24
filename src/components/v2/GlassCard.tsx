import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: string;
  darkOverlay?: boolean;
  innerGlow?: boolean;
}

export const GlassCard = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  glowColor = "hsl(262 83% 58% / 0.3)",
  darkOverlay = false,
  innerGlow = false
}: GlassCardProps) => {
  const Card = hoverEffect ? motion.div : "div";
  
  return (
    <Card
      className={cn(
        "relative rounded-2xl backdrop-blur-xl bg-card/80 border border-border shadow-2xl",
        "transition-all duration-300",
        hoverEffect && "hover:bg-muted hover:border-primary/30 hover:scale-[1.02]",
        className
      )}
      {...(hoverEffect && {
        whileHover: { 
          y: -8,
          boxShadow: `0 30px 60px -10px ${glowColor}`
        },
        transition: { duration: 0.3, ease: "easeOut" }
      })}
    >
      {darkOverlay && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85 rounded-2xl -z-10" />
      )}
      {innerGlow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl" />
      )}
      {children}
    </Card>
  );
};
