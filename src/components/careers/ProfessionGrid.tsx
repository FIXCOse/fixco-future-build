import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hammer, Zap, Droplet, Paintbrush, TreePine, SparklesIcon, Wrench, Mountain, Truck, ArrowRight } from "lucide-react";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";

const professions = [
  { icon: Hammer, title: "Snickare", description: "Bygg, renovering, kök & badrum", hiring: true, accent: "bg-amber-500" },
  { icon: Zap, title: "Elektriker", description: "Elinstallationer, larm, fiber", hiring: true, accent: "bg-blue-500" },
  { icon: Droplet, title: "VVS-installatörer", description: "Rörmokeri, värme, ventilation", hiring: true, accent: "bg-cyan-500" },
  { icon: Paintbrush, title: "Målare", description: "Målning inomhus & utomhus", hiring: false, accent: "bg-rose-500" },
  { icon: TreePine, title: "Trädgårdsmästare", description: "Trädgårdsanläggning & skötsel", hiring: false, accent: "bg-green-500" },
  { icon: SparklesIcon, title: "Städpersonal", description: "Städning & fastighetsservice", hiring: true, accent: "bg-purple-500" },
  { icon: Wrench, title: "Monteringstekniker", description: "Möbel- & vitvarumontering", hiring: false, accent: "bg-orange-500" },
  { icon: Mountain, title: "Markarbetare", description: "Markarbeten & utomhusjobb", hiring: false, accent: "bg-stone-500" },
  { icon: Truck, title: "Flyttpersonal", description: "Flytt & transport", hiring: false, accent: "bg-indigo-500" },
];

export const ProfessionGrid = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Lediga tjänster
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Vi söker skickliga yrkesmänniskor inom flera olika områden
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 scrollbar-hide"
        >
          {professions.map((profession) => {
            const Icon = profession.icon;
            return (
              <motion.div
                key={profession.title}
                variants={itemVariants}
                className="min-w-[260px] lg:min-w-0 snap-start bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/30 transition-all flex flex-col"
              >
                {/* Accent stripe */}
                <div className={`h-1 w-full ${profession.accent}`} />
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {profession.hiring && (
                      <Badge variant="default" className="text-[10px] px-2 py-0.5">
                        Vi söker aktivt
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-1.5 text-foreground">{profession.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">{profession.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToForm}
                    className="w-full"
                  >
                    Ansök direkt <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
