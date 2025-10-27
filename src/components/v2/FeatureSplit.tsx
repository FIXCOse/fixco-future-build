import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

interface Feature {
  title: string;
  description: string;
}

interface FeatureSplitProps {
  title: string;
  subtitle: string;
  features: Feature[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

export const FeatureSplit = ({ 
  title, 
  subtitle, 
  features, 
  imageSrc, 
  imageAlt,
  reverse = false 
}: FeatureSplitProps) => {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
          {/* Image Side */}
          <motion.div
            className={`${reverse ? 'md:order-2' : ''}`}
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <OptimizedImage
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            className={`${reverse ? 'md:order-1' : ''}`}
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {subtitle}
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
