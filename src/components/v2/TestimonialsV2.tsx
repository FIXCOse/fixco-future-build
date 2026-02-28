import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Star } from "lucide-react";
import { useCopy } from "@/copy/CopyProvider";
import type { CopyKey } from "@/copy/keys";

const testimonials = [
  { name: "Anna Svensson", contentKey: "v2.testimonials.1.content" as CopyKey, roleKey: "v2.testimonials.1.role" as CopyKey, rating: 5, avatar: "AS" },
  { name: "Erik Johansson", contentKey: "v2.testimonials.2.content" as CopyKey, roleKey: "v2.testimonials.2.role" as CopyKey, rating: 5, avatar: "EJ" },
  { name: "Maria Larsson", contentKey: "v2.testimonials.3.content" as CopyKey, roleKey: "v2.testimonials.3.role" as CopyKey, rating: 5, avatar: "ML" },
];

export const TestimonialsV2 = () => {
  const { t } = useCopy();

  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t('v2.testimonials.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('v2.testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <GlassCard className="h-full p-6 md:p-8 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-lg mb-6 flex-grow">
                  "{t(testimonial.contentKey)}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(262,83%,58%)] to-[hsl(200,100%,50%)] flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{t(testimonial.roleKey)}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
