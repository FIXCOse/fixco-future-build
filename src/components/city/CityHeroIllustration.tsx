import { motion } from "framer-motion";
import { MapPin, Hammer, Wrench, Zap, Paintbrush, TreePine, Drill, Home, Ruler } from "lucide-react";

interface CityHeroIllustrationProps {
  cityName: string;
}

// Service icons orbiting the city pin
const orbitingServices = [
  { Icon: Zap, angle: 0, color: "text-amber-400", bgGradient: "from-amber-500/30 to-amber-500/10", glow: "shadow-amber-500/40" },
  { Icon: Wrench, angle: 45, color: "text-cyan-400", bgGradient: "from-cyan-500/30 to-cyan-500/10", glow: "shadow-cyan-500/40" },
  { Icon: Hammer, angle: 90, color: "text-orange-400", bgGradient: "from-orange-500/30 to-orange-500/10", glow: "shadow-orange-500/40" },
  { Icon: Paintbrush, angle: 135, color: "text-pink-400", bgGradient: "from-pink-500/30 to-pink-500/10", glow: "shadow-pink-500/40" },
  { Icon: TreePine, angle: 180, color: "text-emerald-400", bgGradient: "from-emerald-500/30 to-emerald-500/10", glow: "shadow-emerald-500/40" },
  { Icon: Drill, angle: 225, color: "text-violet-400", bgGradient: "from-violet-500/30 to-violet-500/10", glow: "shadow-violet-500/40" },
  { Icon: Ruler, angle: 270, color: "text-rose-400", bgGradient: "from-rose-500/30 to-rose-500/10", glow: "shadow-rose-500/40" },
  { Icon: Home, angle: 315, color: "text-blue-400", bgGradient: "from-blue-500/30 to-blue-500/10", glow: "shadow-blue-500/40" },
];

const particles = [
  { x: 20, y: 25, size: 3, delay: 0 },
  { x: 80, y: 20, size: 2, delay: 0.5 },
  { x: 65, y: 75, size: 2.5, delay: 1 },
  { x: 30, y: 65, size: 2, delay: 1.5 },
  { x: 85, y: 50, size: 3, delay: 2 },
  { x: 15, y: 80, size: 2, delay: 2.5 },
];

export const CityHeroIllustration = ({ cityName }: CityHeroIllustrationProps) => {
  return (
    <div className="relative w-full h-[350px] lg:h-[450px]">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      
      {/* Main center element */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Outer glow ring */}
        <div className="absolute w-[280px] h-[280px] lg:w-[350px] lg:h-[350px] rounded-full bg-gradient-to-br from-primary/30 via-purple-500/15 to-transparent blur-2xl" />
        
        {/* Main circle with city */}
        <div className="relative w-[200px] h-[200px] lg:w-[260px] lg:h-[260px] rounded-full bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/20 backdrop-blur-sm shadow-2xl shadow-primary/30">
          {/* Inner gradient */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-violet-500/15" />
          
          {/* City icon and name */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
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
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-primary to-violet-600 border border-primary/40 flex items-center justify-center mb-2"
            >
              <MapPin className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
            </motion.div>
            <span className="text-sm lg:text-base font-semibold text-foreground/80">{cityName}</span>
          </motion.div>
          
          {/* Orbiting ring - clockwise */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-25px] lg:inset-[-35px] rounded-full border-2 border-dashed border-primary/25"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/60 shadow-lg shadow-primary/40" />
          </motion.div>
          
          {/* Orbiting ring - counter-clockwise */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-55px] lg:inset-[-75px] rounded-full border border-white/10"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/50" />
          </motion.div>
          
          {/* Outer decorative ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-85px] lg:inset-[-110px] rounded-full border border-white/5"
          />
        </div>
      </motion.div>
      
      {/* Orbiting service icons */}
      {orbitingServices.map(({ Icon, angle, color, bgGradient, glow }, idx) => {
        const radius = 220; // Distance from center on large screens
        const radiusSm = 170; // Distance on smaller screens
        const x = Math.cos((angle - 90) * (Math.PI / 180));
        const y = Math.sin((angle - 90) * (Math.PI / 180));
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + idx * 0.08, duration: 0.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2"
            style={{ 
              transform: `translate(calc(-50% + ${x * radiusSm}px), calc(-50% + ${y * radiusSm}px))`,
            }}
          >
            <motion.div
              animate={{
                y: [0, -8, 0, 8, 0],
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{
                duration: 5 + idx * 0.3,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
                delay: idx * 0.2,
              }}
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${bgGradient} border border-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg ${glow} hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${color}`} />
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
        className="absolute top-[25%] left-[35%] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-violet-400" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute top-[55%] right-[25%] w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" 
      />
      <motion.div 
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-[30%] left-[20%] w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400" 
      />
    </div>
  );
};
