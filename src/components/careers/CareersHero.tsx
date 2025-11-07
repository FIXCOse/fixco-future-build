import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";
import ParticleCanvas from "@/components/ParticleCanvas";
import useCountUpOnce from "@/hooks/useCountUpOnce";
import { Briefcase, Users, Award, TrendingUp, Phone } from "lucide-react";

const stats = [
  { key: "workers", label: "Nöjda hantverkare", value: 500, suffix: "+" },
  { key: "projects", label: "Genomförda projekt", value: 1000, suffix: "+" },
  { key: "rating", label: "Kundbetyg", value: 4.9, suffix: "/5", decimals: 1 }
];

export const CareersHero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Particle Background */}
      <ParticleCanvas />
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-primary/5 to-secondary/5 -z-10" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8 md:p-12 lg:p-16" hoverEffect={false}>
              <div className="text-center">
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 relative"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Briefcase className="w-5 h-5" />
                  </motion.div>
                  <span className="text-sm font-medium">Vi söker nya medarbetare NU!</span>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Main heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                >
                  <GradientText gradient="rainbow">
                    Bli en del av<br />Fixco-familjen
                  </GradientText>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                >
                  Vi söker skickliga hantverkare som delar vår passion för kvalitet, service och professionalism.
                  Hos Fixco erbjuder vi kollektivavtal, konkurrenskraftig lön och flexibla arbetstider.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                >
                  <MagneticButton
                    size="lg"
                    onClick={scrollToForm}
                    className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  >
                    Ansök nu
                  </MagneticButton>
                  <MagneticButton
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = 'tel:+46701234567'}
                    className="text-lg px-8 py-6 border-2"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Ring oss
                  </MagneticButton>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border/50"
                >
                  {stats.map((stat, index) => (
                    <StatCounter key={stat.key} stat={stat} index={index} />
                  ))}
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Floating trust badges */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute left-4 top-1/4 hidden lg:block"
      >
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Kollektivavtal</span>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute right-4 top-1/3 hidden lg:block"
      >
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">500+ Medarbetare</span>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute left-4 bottom-1/4 hidden lg:block"
      >
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Snabb tillväxt</span>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
};

interface StatCounterProps {
  stat: typeof stats[0];
  index: number;
}

const StatCounter = ({ stat }: StatCounterProps) => {
  const { value, observe } = useCountUpOnce({
    key: `hero-stat-${stat.key}`,
    from: 0,
    to: stat.value,
    duration: 2000,
    formatter: (val) => stat.decimals ? val.toFixed(1) : Math.round(val).toLocaleString('sv-SE')
  });

  return (
    <div ref={observe} className="text-center">
      <div className="text-3xl md:text-4xl font-bold mb-1">
        <GradientText>
          {value}{stat.suffix}
        </GradientText>
      </div>
      <div className="text-sm text-muted-foreground">
        {stat.label}
      </div>
    </div>
  );
};
