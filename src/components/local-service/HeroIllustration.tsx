import { motion } from "framer-motion";
import { Wrench, Hammer, Paintbrush, Zap, Lightbulb, Pipette, Ruler, Settings, Drill, Cog } from "lucide-react";

interface HeroIllustrationProps {
  serviceIcon?: React.ElementType;
}

// Each icon has unique animation style, color, and movement pattern
const floatingIcons = [
  { Icon: Hammer, x: 15, y: 20, size: 28, color: "text-orange-400", animation: "float", glowColor: "shadow-orange-500/30" },
  { Icon: Wrench, x: 80, y: 12, size: 26, color: "text-cyan-400", animation: "orbit", glowColor: "shadow-cyan-500/30" },
  { Icon: Paintbrush, x: 88, y: 55, size: 24, color: "text-pink-400", animation: "pulse", glowColor: "shadow-pink-500/30" },
  { Icon: Zap, x: 8, y: 65, size: 22, color: "text-amber-400", animation: "float", glowColor: "shadow-amber-500/30" },
  { Icon: Lightbulb, x: 50, y: 88, size: 26, color: "text-yellow-400", animation: "glow", glowColor: "shadow-yellow-500/40" },
  { Icon: Pipette, x: 92, y: 30, size: 20, color: "text-violet-400", animation: "orbit", glowColor: "shadow-violet-500/30" },
  { Icon: Ruler, x: 5, y: 42, size: 22, color: "text-emerald-400", animation: "float", glowColor: "shadow-emerald-500/30" },
  { Icon: Drill, x: 70, y: 78, size: 24, color: "text-rose-400", animation: "pulse", glowColor: "shadow-rose-500/30" },
];

// Different animation variants for variety
const getAnimationVariant = (animation: string, idx: number) => {
  const baseDelay = idx * 0.15;
  const ease = [0.4, 0, 0.2, 1] as const;
  
  switch (animation) {
    case "orbit":
      return {
        animate: {
          x: [0, 8, 0, -8, 0],
          y: [0, -6, -12, -6, 0],
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1, 1.05, 1],
        },
        transition: {
          duration: 5 + idx * 0.3,
          repeat: Infinity,
          ease,
          delay: baseDelay,
        }
      };
    case "pulse":
      return {
        animate: {
          scale: [1, 1.15, 1, 1.1, 1],
          opacity: [0.8, 1, 0.8, 1, 0.8],
          rotate: [0, 3, 0, -3, 0],
        },
        transition: {
          duration: 3 + idx * 0.2,
          repeat: Infinity,
          ease,
          delay: baseDelay,
        }
      };
    case "glow":
      return {
        animate: {
          scale: [1, 1.08, 1],
          opacity: [0.7, 1, 0.7],
        },
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease,
          delay: baseDelay,
        }
      };
    default: // float
      return {
        animate: {
          y: [0, -12, 0, 8, 0],
          x: [0, 4, 0, -4, 0],
          rotate: [0, 8, 0, -8, 0],
          scale: [1, 1.02, 1, 1.02, 1],
        },
        transition: {
          duration: 6 + idx * 0.4,
          repeat: Infinity,
          ease,
          delay: baseDelay,
        }
      };
  }
};

// Floating particles for extra atmosphere
const particles = [
  { x: 25, y: 30, size: 3, delay: 0 },
  { x: 75, y: 25, size: 2, delay: 0.5 },
  { x: 60, y: 70, size: 2.5, delay: 1 },
  { x: 35, y: 60, size: 2, delay: 1.5 },
  { x: 85, y: 45, size: 3, delay: 2 },
  { x: 20, y: 80, size: 2, delay: 2.5 },
  { x: 55, y: 15, size: 2.5, delay: 0.8 },
  { x: 45, y: 45, size: 1.5, delay: 1.2 },
];

export const HeroIllustration = ({ serviceIcon: ServiceIcon }: HeroIllustrationProps) => {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px]">
      {/* Main gradient blob */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Outer glow ring */}
        <div className="absolute w-[300px] h-[300px] lg:w-[380px] lg:h-[380px] rounded-full bg-gradient-to-br from-primary/25 via-purple-500/10 to-transparent blur-2xl" />
        
        {/* Main circle */}
        <div className="relative w-[250px] h-[250px] lg:w-[320px] lg:h-[320px] rounded-full bg-gradient-to-br from-white/[0.1] to-white/[0.02] border border-white/15 backdrop-blur-sm shadow-2xl shadow-primary/25">
          {/* Inner gradient */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/15 via-transparent to-violet-500/10" />
          
          {/* Center icon */}
          {ServiceIcon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div 
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(139, 92, 246, 0.3)",
                    "0 0 50px rgba(139, 92, 246, 0.5)",
                    "0 0 30px rgba(139, 92, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/15 border border-primary/40 flex items-center justify-center"
              >
                <ServiceIcon className="w-12 h-12 lg:w-16 lg:h-16 text-primary" />
              </motion.div>
            </motion.div>
          )}
          
          {/* Orbiting ring 1 - clockwise */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] lg:inset-[-30px] rounded-full border-2 border-dashed border-primary/20"
          >
            {/* Orbiting dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/60 shadow-lg shadow-primary/40" />
          </motion.div>
          
          {/* Orbiting ring 2 - counter-clockwise */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-50px] lg:inset-[-70px] rounded-full border border-white/10"
          >
            {/* Orbiting dot */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/50" />
          </motion.div>
          
          {/* Orbiting ring 3 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-80px] lg:inset-[-100px] rounded-full border border-white/5"
          />
        </div>
      </motion.div>
      
      {/* Floating icons with varied animations */}
      {floatingIcons.map(({ Icon, x, y, size, color, animation, glowColor }, idx) => {
        const animVariant = getAnimationVariant(animation, idx);
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + idx * 0.1, duration: 0.5, ease: "easeOut" }}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <motion.div
              animate={animVariant.animate}
              transition={animVariant.transition}
            >
              <div className={`w-11 h-11 lg:w-13 lg:h-13 rounded-xl bg-gradient-to-br from-white/[0.12] to-white/[0.04] border border-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg ${glowColor} hover:scale-110 transition-transform`}>
                <Icon style={{ width: size, height: size }} className={`${color}`} />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
      
      {/* Floating particles */}
      {particles.map((particle, idx) => (
        <motion.div
          key={`particle-${idx}`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -25, -50],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4 + idx * 0.3,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-gradient-to-t from-primary/60 to-primary/20"
          style={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`,
            width: particle.size * 2,
            height: particle.size * 2,
          }}
        />
      ))}
      
      {/* Decorative gradient dots */}
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-[20%] left-[40%] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-violet-400" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute top-[60%] right-[30%] w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" 
      />
      <motion.div 
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-[25%] left-[25%] w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
        className="absolute top-[40%] right-[15%] w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" 
      />
    </div>
  );
};
