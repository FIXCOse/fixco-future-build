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

// Glass Cascade - Diagonal Waterfall Layout (Enhanced Readability)
export const HowItWorksGlassCascade = ({ steps }: HowItWorksProps) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Enhanced background with more depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        {/* Animated gradient blobs - more saturated and slower */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight text-shadow-ultra text-stroke-light">
            Hur det <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">fungerar</span>
          </h2>
          <p className="text-white text-xl max-w-2xl mx-auto font-semibold text-shadow-ultra">
            En transparent process från förfrågan till färdigt resultat
          </p>
        </motion.div>

        {/* Desktop: Diagonal cascade */}
        <div className="hidden md:block relative min-h-[800px]">
          {steps.map((step, i) => {
            const Icon = getIcon(i);
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -100, rotate: -10, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: i * 0.15, 
                  type: "spring",
                  stiffness: 80,
                  damping: 15
                }}
                style={{
                  position: 'absolute',
                  left: `${i * 18}%`,
                  top: `${i * 15}%`,
                  zIndex: i + 1,
                  width: '300px'
                }}
              >
                <GlassCard 
                  className="group"
                  glowColor="hsl(262 83% 58% / 0.5)"
                  darkOverlay={true}
                  innerGlow={true}
                >
                  <div className="relative p-8">
                    {/* Gradient number badge - larger */}
                    <motion.div 
                      className="absolute -top-4 -left-4 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 
                                 flex items-center justify-center font-black text-white text-2xl shadow-2xl border-2 border-white/30 text-shadow-ultra"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {step.step}
                    </motion.div>

                    {/* Floating icon - larger */}
                    <motion.div
                      className="mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/40 to-blue-500/40 
                                 flex items-center justify-center border border-white/30 shadow-xl"
                      whileHover={{ rotate: 12, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </motion.div>

                    {/* Content with solid text container */}
                    <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-6 border border-white/10">
                      <h3 className="text-3xl font-black text-white mb-5 tracking-tight text-shadow-ultra text-stroke-light leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-white text-lg leading-loose font-semibold text-shadow-ultra">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connection line to next card - thicker and more visible */}
                  {i < steps.length - 1 && (
                    <svg
                      className="absolute -right-16 top-1/2 w-16 h-2 pointer-events-none"
                      style={{ transform: 'translateY(-50%)' }}
                    >
                      <motion.line
                        x1="0"
                        y1="1"
                        x2="64"
                        y2="1"
                        stroke="url(#gradient-line)"
                        strokeWidth="3"
                        strokeDasharray="4 4"
                        className="opacity-50"
                        animate={{
                          strokeDashoffset: [0, -8],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <defs>
                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                          <stop offset="100%" stopColor="hsl(200, 100%, 50%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: Vertical stack with offset - improved readability */}
        <div className="md:hidden space-y-8">
          {steps.map((step, i) => {
            const Icon = getIcon(i);
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  marginLeft: i % 2 === 0 ? '0' : '1rem'
                }}
              >
                <GlassCard 
                  glowColor="hsl(262 83% 58% / 0.5)"
                  darkOverlay={true}
                  innerGlow={true}
                >
                  <div className="relative p-7">
                    <motion.div 
                      className="absolute -top-3 -left-3 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 
                                 flex items-center justify-center font-black text-white text-xl shadow-xl border-2 border-white/30 text-shadow-ultra"
                    >
                      {step.step}
                    </motion.div>

                    <div className="mb-5 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/40 to-blue-500/40 
                                    flex items-center justify-center border border-white/30 shadow-lg">
                      <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>

                    <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-white/10">
                      <h3 className="text-2xl font-black text-white mb-4 tracking-tight text-shadow-ultra text-stroke-light leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-white text-base leading-loose font-semibold text-shadow-ultra">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Glass Orbit - Circular Planetary System Layout
export const HowItWorksGlassOrbit = ({ steps }: HowItWorksProps) => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at center, hsl(262 83% 58% / 0.3) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Så fungerar det
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Din resa i vårt ekosystem
          </p>
        </motion.div>

        {/* Desktop: Circular Orbit */}
        <div className="hidden md:block">
          <div className="relative w-[700px] h-[700px] mx-auto">
            {/* Orbit circles */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <motion.circle
                cx="350"
                cy="350"
                r="280"
                stroke="url(#orbitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="10,10"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2 }}
              />
              <defs>
                <linearGradient id="orbitGradient">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                  <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central hub */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <GlassCard hoverEffect={false} glowColor="hsl(262 83% 58% / 0.5)">
                <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-3"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-white font-semibold text-sm">
                    Din resa<br />börjar här
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Orbiting cards */}
            {steps.map((step, i) => {
              const Icon = getIcon(i);
              const angle = (i * 360 / steps.length - 90) * (Math.PI / 180);
              const radius = 280;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={i}
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    rotate: -360
                  }}
                  whileInView={{
                    scale: 1,
                    x,
                    y,
                    rotate: 0
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.2, type: "spring" }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                  }}
                  className="w-56"
                >
                  <GlassCard hoverEffect={true} glowColor="hsl(262 83% 58% / 0.4)">
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="relative mb-4"
                        >
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <motion.div
                            animate={{ rotate: [0, -360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-lg"
                          >
                            {step.step}
                          </motion.div>
                        </motion.div>
                        <h3 className="text-base font-bold text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-white/70 text-xs leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical List */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => {
            const Icon = getIcon(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hoverEffect={false}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Glass Stream - Horizontal Flowing River Layout
export const HowItWorksGlassStream = ({ steps }: HowItWorksProps) => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Flowing wave background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent 0%, hsl(262 83% 58% / 0.3) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            top: `${20 + i * 8}%`,
            left: 0,
          }}
          animate={{
            x: ['0vw', '100vw'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear"
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Så fungerar det
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Följ flödet från start till mål
          </p>
        </motion.div>

        {/* Horizontal scrolling stream */}
        <div className="overflow-x-auto overflow-y-visible pb-8 -mx-4 md:mx-0 scroll-smooth snap-x snap-mandatory">
          <div className="flex gap-8 px-4 min-w-max relative py-16">
            {steps.map((step, i) => {
              const Icon = getIcon(i);
              const yOffset = i % 2 === 0 ? -20 : 20;
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-72 md:w-80 flex-shrink-0 snap-center"
                  style={{ transform: `translateY(${yOffset}px)` }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <GlassCard hoverEffect={true} glowColor="hsl(262 83% 58% / 0.4)">
                      <div className="p-8">
                        <div className="flex flex-col items-center text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="relative mb-6"
                          >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center">
                              <Icon className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                              {step.step}
                            </div>
                          </motion.div>
                          <h3 className="text-xl font-bold text-white mb-3">
                            {step.title}
                          </h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {step.desc}
                        </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 md:hidden"
        >
          <p className="text-white/50 text-sm flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Swipa för att se alla steg
          </p>
        </motion.div>
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
