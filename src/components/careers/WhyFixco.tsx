import { motion } from "framer-motion";
import { CheckCircle, Wallet, Clock, Shield, GraduationCap, Smartphone, Banknote, Calendar } from "lucide-react";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";

const benefits = [
  { icon: CheckCircle, title: "Kollektivavtal", description: "Vi följer Byggnads, Elektrikerförbundet och andra relevanta kollektivavtal" },
  { icon: Wallet, title: "Konkurrenskraftig lön", description: "Marknadsmässig timlön med bonussystem baserat på prestationer" },
  { icon: Clock, title: "Flexibla arbetstider", description: "Välj projekt som passar din livssituation och schema" },
  { icon: Shield, title: "Försäkringar", description: "TFA, Arbetsskadeförsäkring och trygghet enligt kollektivavtal" },
  { icon: Banknote, title: "Avtalspension", description: "Pensionsavsättning enligt kollektivavtal för din framtid" },
  { icon: GraduationCap, title: "Kompetensutveckling", description: "Kontinuerliga utbildningar och certifieringar" },
  { icon: Smartphone, title: "Modern teknik", description: "Digitala verktyg för schemaläggning, tidrapportering och kommunikation" },
  { icon: Calendar, title: "Säker betalning", description: "Alltid lön i tid, varje månad" },
];

export const WhyFixco = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Varför jobba hos <span className="text-primary">Fixco?</span>
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Vi erbjuder mer än bara ett jobb – vi erbjuder en karriär med trygghet, utveckling och gemenskap.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
