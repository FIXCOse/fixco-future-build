import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Award, TrendingUp, Hammer, Zap, Droplet, Paintbrush, TreePine, SparklesIcon, Wrench, Mountain, Truck } from "lucide-react";
import { containerVariants, itemVariants } from "@/utils/scrollAnimations";

const professionChips = [
  { icon: Hammer, title: "Snickare" },
  { icon: Zap, title: "Elektriker" },
  { icon: Droplet, title: "VVS" },
  { icon: Paintbrush, title: "Målare" },
  { icon: TreePine, title: "Trädgård" },
  { icon: SparklesIcon, title: "Städ" },
  { icon: Wrench, title: "Montering" },
  { icon: Mountain, title: "Mark" },
  { icon: Truck, title: "Flytt" },
];

const trustBadges = [
  { label: "Kollektivavtal", icon: Award },
  { label: "500+ Medarbetare", icon: Briefcase },
  { label: "Snabb tillväxt", icon: TrendingUp },
];

export const CareersHero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text + CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">Vi söker nya medarbetare</span>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight"
            >
              Bli en del av{' '}
              <span className="text-primary">Fixco-familjen</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg"
            >
              Vi söker skickliga hantverkare som delar vår passion för kvalitet, 
              service och professionalism. Kollektivavtal, konkurrenskraftig lön 
              och flexibla arbetstider.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <Button size="lg" onClick={scrollToForm} className="text-base px-8 py-6">
                Ansök nu <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">{badge.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right: 3x3 profession grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-3"
          >
            {professionChips.map((chip, index) => {
              const Icon = chip.icon;
              return (
                <motion.div
                  key={chip.title}
                  variants={itemVariants}
                  className="flex flex-col items-center gap-2 p-4 md:p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{chip.title}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
