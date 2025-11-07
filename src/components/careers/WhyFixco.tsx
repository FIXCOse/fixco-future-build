import { motion } from "framer-motion";
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";
import { CheckCircle, Wallet, Clock, Shield, GraduationCap, Smartphone, Banknote, Calendar } from "lucide-react";
import { containerVariants, slideFromLeft, slideFromRight, viewportConfig } from "@/utils/scrollAnimations";

const benefits = [
  {
    icon: CheckCircle,
    title: "Kollektivavtal",
    description: "Vi följer Byggnads, Elektrikerförbundet och andra relevanta kollektivavtal"
  },
  {
    icon: Wallet,
    title: "Konkurrenskraftig lön",
    description: "Marknadsmässig timlön med bonussystem baserat på prestationer"
  },
  {
    icon: Clock,
    title: "Flexibla arbetstider",
    description: "Välj projekt som passar din livssituation och schema"
  },
  {
    icon: Shield,
    title: "Försäkringar",
    description: "TFA, Arbetsskadeförsäkring och trygghet enligt kollektivavtal"
  },
  {
    icon: Banknote,
    title: "Avtalspension",
    description: "Pensionsavsättning enligt kollektivavtal för din framtid"
  },
  {
    icon: GraduationCap,
    title: "Kompetensutveckling",
    description: "Kontinuerliga utbildningar och certifieringar"
  },
  {
    icon: Smartphone,
    title: "Modern teknik",
    description: "Digitala verktyg för schemaläggning, tidrapportering och kommunikation"
  },
  {
    icon: Calendar,
    title: "Säker betalning",
    description: "Alltid lön i tid, varje månad"
  }
];

export const WhyFixco = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Varför jobba hos Fixco?</GradientText>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vi erbjuder mer än bara ett jobb – vi erbjuder en karriär med trygghet, utveckling och gemenskap.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                variants={isEven ? slideFromLeft : slideFromRight}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <GlassCard className="p-6 h-full" hoverEffect={true}>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4"
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
