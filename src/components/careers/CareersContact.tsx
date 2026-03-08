import { motion } from "framer-motion";
import { Mail, Phone, Clock } from "lucide-react";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";

const contacts = [
  { icon: Mail, title: "E-post", content: "karriar@fixco.se", href: "mailto:karriar@fixco.se" },
  { icon: Phone, title: "Telefon", content: "+46 79 335 02 28", href: "tel:+46793350228" },
  { icon: Clock, title: "Öppettider", content: "Mån-Fre: 08:00 - 17:00" },
];

export const CareersContact = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Har du frågor?
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12">
          Kontakta vår HR-avdelning så hjälper vi dig gärna
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {contacts.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="bg-card border border-border rounded-xl p-6 text-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="text-primary hover:underline text-sm">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
