import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageSquare, FileCheck, Calendar, Sparkles, Shield, ArrowRight, ArrowDown } from "lucide-react";
import { GlassCard } from "@/components/v2/GlassCard";
import usePersistentCounters from "@/hooks/usePersistentCounters";
import { useEffect } from "react";

interface HowItWorksStep {
  step: number;
  title: string;
  desc: string;
}

interface HowItWorksProps {
  steps: HowItWorksStep[];
}

// Helper function to get icon by index
const getIcon = (index: number) => {
  const icons = [MessageSquare, FileCheck, Calendar, Sparkles, Shield];
  return icons[index] || MessageSquare;
};

// ALTERNATIV 1: Timeline med pilar och animationer
export const HowItWorksTimeline = ({ steps }: HowItWorksProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Så här går det till
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            En smidig och transparent process från start till mål
          </p>
        </motion.div>

        {/* Desktop Timeline (horizontal) */}
        <div className="hidden lg:block max-w-7xl mx-auto">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-[60px] left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-0" />
            
            <div className="grid grid-cols-5 gap-4 relative z-10">
              {steps.map((step, index) => {
                const Icon = getIcon(index);
                
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                  >
                    {/* Card */}
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="relative bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300"
                    >
                      {/* Gradient number badge */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="flex justify-center mb-4 mt-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-bold text-lg mb-3 text-center">{step.title}</h3>
                      <p className="text-sm text-muted-foreground text-center leading-relaxed">
                        {step.desc}
                      </p>

                      {/* Arrow (except last step) */}
                      {index < steps.length - 1 && (
                        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-primary/40 hidden xl:block">
                          <ArrowRight className="w-8 h-8" />
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Timeline (vertical) */}
        <div className="lg:hidden max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const Icon = getIcon(index);
            
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative mb-8 last:mb-0"
              >
                {/* Timeline connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-7 top-20 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/20" />
                )}

                <div className="flex gap-4">
                  {/* Number badge */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold text-white">{step.step}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-card border-2 border-border rounded-xl p-5 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg pt-2">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ALTERNATIV 2: Glass Morphism med 3D-effekter
export const HowItWorksGlass = ({ steps }: HowItWorksProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Så här går det till
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            En smidig och transparent process från start till mål
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = getIcon(index);
            
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GlassCard 
                  className="p-8 h-full relative group"
                  glowColor="hsl(262 83% 58% / 0.5)"
                >
                  {/* Animated gradient badge */}
                  <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>

                  {/* Floating icon */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="font-bold text-lg mb-3 text-center text-white group-hover:text-purple-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-300 text-center leading-relaxed">
                    {step.desc}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// GLASS VARIANT 1: Classic (Purple Dream) - Optimized existing
export const HowItWorksGlassClassic = ({ steps }: HowItWorksProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Så här går det till
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            En smidig och transparent process från start till mål
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = getIcon(index);
            
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GlassCard 
                  className="p-8 h-full relative group"
                  glowColor="hsl(262 83% 58% / 0.5)"
                >
                  {/* Animated gradient badge */}
                  <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>

                  {/* Floating icon */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="font-bold text-lg mb-3 text-center text-white group-hover:text-purple-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-300 text-center leading-relaxed">
                    {step.desc}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// GLASS VARIANT 2: Neon (Cyberpunk) - Neon cyan & magenta
export const HowItWorksGlassNeon = ({ steps }: HowItWorksProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 via-cyan-950/30 to-slate-950 relative overflow-hidden">
      {/* Neon background blobs */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full blur-3xl" />
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="h-32 w-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            Så här går det till
          </h2>
          <p className="text-cyan-200 text-lg max-w-2xl mx-auto">
            En smidig och transparent process från start till mål
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = getIcon(index);
            
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 0 30px rgba(34, 211, 238, 0.6), 0 20px 40px -10px rgba(34, 211, 238, 0.3)"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative rounded-2xl backdrop-blur-md bg-white/5 border-2 border-cyan-500/30 p-8 h-full group hover:bg-white/10 hover:border-cyan-400/50 transition-all"
                  style={{
                    boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)"
                  }}
                >
                  {/* Neon gradient badge */}
                  <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                      {step.step}
                    </span>
                  </div>

                  {/* Floating icon with neon glow */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center backdrop-blur-sm border border-cyan-400/30"
                  >
                    <Icon className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  </motion.div>

                  <h3 className="font-bold text-lg mb-3 text-center text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-cyan-100/80 text-center leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// GLASS VARIANT 3: Aurora (Nordic Lights) - Teal/Green/Blue aurora
export const HowItWorksGlassAurora = ({ steps }: HowItWorksProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-950/40 to-indigo-950 relative overflow-hidden">
      {/* Aurora wave animation */}
      <motion.div
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(120deg, #10b981, #14b8a6, #3b82f6, #10b981)",
          backgroundSize: "200% 200%"
        }}
      />

      {/* Aurora blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-teal-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-blue-300 bg-clip-text text-transparent">
            Så här går det till
          </h2>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto">
            En smidig och transparent process från start till mål
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = getIcon(index);
            
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GlassCard 
                  className="p-8 h-full relative group"
                  glowColor="hsl(174 72% 56% / 0.5)"
                >
                  {/* Aurora gradient badge with shimmer */}
                  <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 flex items-center justify-center shadow-2xl overflow-hidden">
                    <span className="text-xl font-bold text-white relative z-10">{step.step}</span>
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </div>

                  {/* Floating icon */}
                  <motion.div 
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/20 flex items-center justify-center backdrop-blur-sm border border-emerald-400/30"
                  >
                    <Icon className="w-8 h-8 text-emerald-300" />
                  </motion.div>

                  <h3 className="font-bold text-lg mb-3 text-center bg-gradient-to-r from-emerald-200 via-teal-200 to-blue-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:via-teal-300 group-hover:to-blue-300 transition-all">
                    {step.title}
                  </h3>
                  <p className="text-sm text-teal-100/80 text-center leading-relaxed">
                    {step.desc}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ALTERNATIV 3: Zigzag/Alternating Layout med stora ikoner
export const HowItWorksZigzag = ({ steps }: HowItWorksProps) => {
  const { counters, animateCounter } = usePersistentCounters('how-it-works-zigzag');

  useEffect(() => {
    // Animate all counters when component mounts
    steps.forEach((step, index) => {
      const key = `step-${step.step}`;
      if (!counters[key]?.hasAnimated) {
        animateCounter({
          key,
          target: step.step,
          duration: 1000,
          easing: 'easeOut'
        });
      }
    });
  }, [steps, counters, animateCounter]);

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Så här går det till
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            En smidig och transparent process från start till mål
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8">
          {steps.map((step, index) => {
            const Icon = getIcon(index);
            const isEven = index % 2 === 0;
            const counterKey = `step-${step.step}`;
            const counterValue = counters[counterKey]?.value || 0;
            
            return (
              <div key={step.step} className="relative">
                {/* Connector arrow (except last step) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 z-10">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      <ArrowDown className="w-8 h-8 text-primary" />
                    </motion.div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={cn(
                    "flex items-center gap-8",
                    isEven ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  {/* Icon side */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="flex-shrink-0"
                  >
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                      {/* Animated counter badge */}
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-accent border-4 border-background flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-accent-foreground">
                          {Math.round(counterValue)}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content side */}
                  <div className="flex-1 bg-card border-2 border-border rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all">
                    <h3 className="font-bold text-2xl mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
