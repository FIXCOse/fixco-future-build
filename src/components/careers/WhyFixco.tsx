import { motion } from "framer-motion";
import { CheckCircle, Wallet, Clock, Shield, GraduationCap, Smartphone, Banknote, Calendar } from "lucide-react";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";

const heroCards = [
  {
    icon: Wallet,
    title: "Konkurrenskraftig lön",
    description: "Marknadsmässig timlön med bonussystem baserat på prestationer, kundnöjdhet och effektivitet. Plus avtalspension och försäkringar.",
  },
  {
    icon: Clock,
    title: "Flexibla arbetstider",
    description: "Välj projekt som passar din livssituation och schema. Du styr din arbetsdag — vi stöttar dig med rätt verktyg och resurser.",
  },
];

const checklistItems = [
  { icon: Shield, text: "Kollektivavtal med Byggnads, Elektrikerförbundet m.fl." },
  { icon: Banknote, text: "Pensionsavsättning enligt kollektivavtal" },
  { icon: GraduationCap, text: "Betalda utbildningar och certifieringar" },
  { icon: Smartphone, text: "Digitala verktyg för schemaläggning & tidrapportering" },
  { icon: Calendar, text: "Alltid lön i tid, varje månad" },
  { icon: CheckCircle, text: "TFA och arbetsskadeförsäkring ingår" },
];

export const WhyFixco = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Varför jobba hos <span className="text-primary">Fixco?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vi erbjuder mer än bara ett jobb – vi erbjuder en karriär med trygghet, utveckling och gemenskap.
          </p>
        </motion.div>

        {/* 2 Hero benefit cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          {heroCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className="relative bg-card border border-border rounded-2xl p-8 shadow-sm overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[80px] -mr-4 -mt-4 group-hover:bg-primary/10 transition-colors" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 6 Checklist items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4"
        >
          {checklistItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                variants={itemVariants}
                className="flex items-center gap-3 py-2"
              >
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
