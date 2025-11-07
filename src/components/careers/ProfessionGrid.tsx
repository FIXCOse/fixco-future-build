import { motion } from "framer-motion";
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";
import { Button } from "@/components/ui/button";
import { Hammer, Zap, Droplet, Paintbrush, TreePine, SparklesIcon, Wrench, Mountain, Truck } from "lucide-react";
import { containerVariants, rotateIn, viewportConfig } from "@/utils/scrollAnimations";

const professions = [
  { icon: Hammer, title: "Snickare", description: "Bygg, renovering, kök & badrum" },
  { icon: Zap, title: "Elektriker", description: "Elinstallationer, larm, fiber" },
  { icon: Droplet, title: "VVS-installatörer", description: "Rörmokeri, värme, ventilation" },
  { icon: Paintbrush, title: "Målare", description: "Målning inomhus & utomhus" },
  { icon: TreePine, title: "Trädgårdsmästare", description: "Trädgårdsanläggning & skötsel" },
  { icon: SparklesIcon, title: "Städpersonal", description: "Städning & fastighetsservice" },
  { icon: Wrench, title: "Monteringstekniker", description: "Möbel- & vitvarumontering" },
  { icon: Mountain, title: "Markarbetare", description: "Markarbeten & utomhusjobb" },
  { icon: Truck, title: "Flyttpersonal", description: "Flytt & transport" }
];

export const ProfessionGrid = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText gradient="blue">Lediga tjänster</GradientText>
          </h2>
          <p className="text-xl text-muted-foreground">
            Vi söker skickliga yrkesmänniskor inom flera olika områden
          </p>
        </motion.div>

        {/* Consistent Grid Layout with Wave Effect */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {professions.map((profession, index) => {
            const Icon = profession.icon;

            return (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  y: 50,
                  rotateX: -15,
                  filter: "blur(10px)"
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  rotateX: 0,
                  filter: "blur(0px)"
                }}
                transition={{
                  duration: 0.6,
                  delay: (index % 3) * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard 
                  className="p-6 h-full group relative overflow-hidden"
                  hoverEffect={true}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, hsl(${index * 40}, 80%, 60%, 0.1), transparent 70%)`
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon with 3D effect */}
                    <motion.div
                      whileHover={{ 
                        rotateY: 180,
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="w-16 h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                      style={{
                        boxShadow: `0 10px 30px -5px hsl(${index * 40}, 80%, 60%, 0.3)`
                      }}
                    >
                      <Icon className="w-8 h-8 text-primary" />
                    </motion.div>

                    <h3 className="text-xl font-bold mb-3">
                      {profession.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {profession.description}
                    </p>

                    {/* Quick apply button appears on hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        onClick={scrollToForm}
                        className="w-full"
                      >
                        Ansök direkt
                      </Button>
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
