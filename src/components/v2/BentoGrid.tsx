import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Zap, Wrench, Paintbrush, Droplets, Lock, Home } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Elmontör",
    description: "Elinstallationer, felsökning och certifierad elkontroll",
    size: "large",
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
  {
    icon: Droplets,
    title: "VVS",
    description: "Badrumsrenovering, stambyten och läckageskador",
    size: "large",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Paintbrush,
    title: "Målning",
    description: "In- och utvändig målning med ROT-avdrag",
    size: "medium",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: Wrench,
    title: "Snickare",
    description: "Byggnation, renovering och anpassningar",
    size: "medium",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: Lock,
    title: "Låssmed",
    description: "Lås, säkerhet och beslag",
    size: "small",
    gradient: "from-gray-500/20 to-slate-500/20"
  },
  {
    icon: Home,
    title: "Totalrenovering",
    description: "Kompletta projekt från A till Ö",
    size: "small",
    gradient: "from-indigo-500/20 to-violet-500/20"
  }
];

export const BentoGrid = () => {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Våra tjänster
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Professionella hantverkare för alla dina hem- och byggbehov
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
          {services.map((service, index) => {
            const Icon = service.icon;
            const sizeClasses = {
              large: "md:col-span-2 md:row-span-2",
              medium: "md:col-span-2",
              small: "md:col-span-1"
            };

            return (
              <motion.div
                key={service.title}
                className={sizeClasses[service.size as keyof typeof sizeClasses]}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard 
                  className={`h-full p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br ${service.gradient}`}
                  hoverEffect={true}
                >
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-white/10 mb-4">
                      <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                  
                  <button className="mt-6 text-sm font-medium hover:gap-2 flex items-center gap-1 transition-all group">
                    Läs mer 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
