import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { GradientText } from "./GradientText";
import MagneticButton from "@/components/MagneticButton";

export const CTAV2 = () => {
  return (
    <section className="relative py-32 md:py-40 px-4 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(262,83%,58%)] via-[hsl(280,100%,60%)] to-[hsl(200,100%,50%)] opacity-10" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, hsl(262 83% 58% / 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, hsl(200 100% 50% / 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, hsl(262 83% 58% / 0.2) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Redo att börja<br />
            <GradientText gradient="rainbow">
              ditt projekt?
            </GradientText>
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Få en kostnadsfri offert inom 24 timmar och upptäck varför tusentals kunder väljer Fixco
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <MagneticButton
              variant="default"
              size="lg"
              className="text-lg px-10 py-7 h-auto bg-white text-background hover:bg-white/90 group shadow-2xl"
              href="/boka/standard"
            >
              Boka gratis offert nu
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>

          {/* Contact Options */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <a 
              href="tel:08-123 456 78"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>08-123 456 78</span>
            </a>
            <span className="hidden sm:block text-muted-foreground">•</span>
            <a 
              href="mailto:info@fixco.se"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>info@fixco.se</span>
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Snabb offert</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>ROT & RUT-avdrag</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Erfarna hantverkare</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Garanti på arbete</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
