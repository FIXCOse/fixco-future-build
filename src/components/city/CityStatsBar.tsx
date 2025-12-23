import { motion } from "framer-motion";
import { CheckCircle2, Star, Users, Clock } from "lucide-react";

interface CityStatsBarProps {
  stats: {
    totalProjects: number;
    avgRating: number;
    totalReviews: number;
    activeWorkers: number;
  };
  cityName: string;
}

const statItems = [
  { 
    key: "projects",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-emerald-500/5",
    format: (v: number) => `${v}+`,
    label: "projekt genomförda"
  },
  { 
    key: "rating",
    icon: Star,
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/20 to-yellow-500/5",
    format: (v: number) => v.toFixed(1),
    label: "snittbetyg"
  },
  { 
    key: "reviews",
    icon: Star,
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-amber-500/5",
    format: (v: number) => `${v}+`,
    label: "recensioner"
  },
  { 
    key: "workers",
    icon: Users,
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/20 to-cyan-500/5",
    format: (v: number) => `${v}+`,
    label: "aktiva hantverkare"
  },
];

export const CityStatsBar = ({ stats, cityName }: CityStatsBarProps) => {
  const values = {
    projects: stats.totalProjects,
    rating: stats.avgRating,
    reviews: stats.totalReviews,
    workers: stats.activeWorkers,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        const value = values[item.key as keyof typeof values];
        
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
            <div className="relative flex flex-col items-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/15 transition-all">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center mb-3`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {item.format(value)}
              </span>
              <span className="text-sm text-muted-foreground text-center">
                {item.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
