import { motion } from "framer-motion";
import { Wrench, Hammer, Paintbrush, Zap, Lightbulb, Shield, Pipette, Home, Ruler, Settings } from "lucide-react";

interface HeroIllustrationProps {
  serviceIcon?: React.ElementType;
}

const floatingIcons = [
  { Icon: Hammer, delay: 0, x: 20, y: 30, size: 28 },
  { Icon: Wrench, delay: 0.2, x: 75, y: 15, size: 24 },
  { Icon: Paintbrush, delay: 0.4, x: 85, y: 60, size: 22 },
  { Icon: Zap, delay: 0.6, x: 15, y: 70, size: 20 },
  { Icon: Lightbulb, delay: 0.8, x: 50, y: 85, size: 26 },
  { Icon: Pipette, delay: 1.0, x: 90, y: 25, size: 18 },
  { Icon: Ruler, delay: 1.2, x: 10, y: 50, size: 20 },
  { Icon: Settings, delay: 1.4, x: 65, y: 40, size: 18 },
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
        <div className="absolute w-[300px] h-[300px] lg:w-[380px] lg:h-[380px] rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-xl" />
        
        {/* Main circle */}
        <div className="relative w-[250px] h-[250px] lg:w-[320px] lg:h-[320px] rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm shadow-2xl shadow-primary/20">
          {/* Inner gradient */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
          
          {/* Center icon */}
          {ServiceIcon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center shadow-2xl shadow-primary/30">
                <ServiceIcon className="w-12 h-12 lg:w-16 lg:h-16 text-primary" />
              </div>
            </motion.div>
          )}
          
          {/* Orbiting ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] lg:inset-[-30px] rounded-full border border-dashed border-white/10"
          />
          
          {/* Second orbiting ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-50px] lg:inset-[-70px] rounded-full border border-white/5"
          />
        </div>
      </motion.div>
      
      {/* Floating icons */}
      {floatingIcons.map(({ Icon, delay, x, y, size }, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0.4],
            scale: [0, 1.1, 1],
            y: [0, -10, 0, 10, 0]
          }}
          transition={{
            delay: delay + 0.5,
            duration: 0.5,
            y: {
              delay: delay + 1,
              duration: 4 + idx * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-white/[0.1] to-white/[0.03] border border-white/10 backdrop-blur-sm flex items-center justify-center">
            <Icon style={{ width: size, height: size }} className="text-primary/60" />
          </div>
        </motion.div>
      ))}
      
      {/* Decorative dots */}
      <div className="absolute top-[20%] left-[40%] w-2 h-2 rounded-full bg-primary/40" />
      <div className="absolute top-[60%] right-[30%] w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
      <div className="absolute bottom-[25%] left-[25%] w-2.5 h-2.5 rounded-full bg-purple-400/30" />
      <div className="absolute top-[40%] right-[15%] w-1 h-1 rounded-full bg-amber-400/50" />
    </div>
  );
};
