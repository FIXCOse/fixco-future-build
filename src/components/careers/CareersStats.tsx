import { motion } from "framer-motion";
import useCountUpOnce from "@/hooks/useCountUpOnce";
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";
import { Users, Briefcase, TrendingUp, Award } from "lucide-react";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";

const stats = [
  { 
    key: "employees", 
    label: "Anställda hantverkare", 
    value: 500, 
    suffix: "+",
    icon: Users,
    color: "hsl(262 83% 58%)"
  },
  { 
    key: "professions", 
    label: "Olika yrken", 
    value: 15, 
    suffix: "",
    icon: Briefcase,
    color: "hsl(200 100% 50%)"
  },
  { 
    key: "satisfaction", 
    label: "Nöjd-medarbetar-index", 
    value: 98, 
    suffix: "%",
    icon: Award,
    color: "hsl(320 100% 65%)"
  },
  { 
    key: "growth", 
    label: "Tillväxt senaste året", 
    value: 45, 
    suffix: "%",
    icon: TrendingUp,
    color: "hsl(280 100% 60%)"
  }
];

export const CareersStats = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Fixco i siffror</GradientText>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vi växer snabbt och söker alltid fler duktiga hantverkare
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.key} variants={itemVariants}>
              <StatCard stat={stat} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface StatCardProps {
  stat: typeof stats[0];
  index: number;
}

const StatCard = ({ stat, index }: StatCardProps) => {
  const { value, observe } = useCountUpOnce({
    key: `career-stat-${stat.key}`,
    from: 0,
    to: stat.value,
    duration: 2000,
    formatter: (val) => Math.round(val).toLocaleString('sv-SE')
  });

  const Icon = stat.icon;

  return (
    <div ref={observe}>
      <GlassCard 
        className="p-6 text-center h-full flex flex-col justify-center"
        hoverEffect={true}
        glowColor={stat.color}
        innerGlow={true}
      >
        <div className="flex justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `${stat.color}15`,
              boxShadow: `0 0 20px ${stat.color}30`
            }}
          >
            <Icon className="w-8 h-8" style={{ color: stat.color }} />
          </div>
        </div>
        
        <div className="text-5xl md:text-6xl font-bold mb-2">
          <GradientText>
            {value}{stat.suffix}
          </GradientText>
        </div>
        
        <div className="text-sm md:text-base text-muted-foreground font-medium">
          {stat.label}
        </div>
      </GlassCard>
    </div>
  );
};
