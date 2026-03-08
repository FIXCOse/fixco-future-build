import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Hammer, Zap, Droplet, Paintbrush, TreePine, SparklesIcon, Wrench, Mountain, Truck, ArrowRight } from "lucide-react";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";

const professions = [
  { icon: Hammer, title: "Snickare", description: "Bygg, renovering, kök & badrum" },
  { icon: Zap, title: "Elektriker", description: "Elinstallationer, larm, fiber" },
  { icon: Droplet, title: "VVS-installatörer", description: "Rörmokeri, värme, ventilation" },
  { icon: Paintbrush, title: "Målare", description: "Målning inomhus & utomhus" },
  { icon: TreePine, title: "Trädgårdsmästare", description: "Trädgårdsanläggning & skötsel" },
  { icon: SparklesIcon, title: "Städpersonal", description: "Städning & fastighetsservice" },
  { icon: Wrench, title: "Monteringstekniker", description: "Möbel- & vitvarumontering" },
  { icon: Mountain, title: "Markarbetare", description: "Markarbeten & utomhusjobb" },
  { icon: Truck, title: "Flyttpersonal", description: "Flytt & transport" },
];

export const ProfessionGrid = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Lediga tjänster
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Vi söker skickliga yrkesmänniskor inom flera olika områden
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {professions.map((profession, index) => {
            const Icon = profession.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{profession.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{profession.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollToForm}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Ansök direkt <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
