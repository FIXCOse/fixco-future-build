import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { GradientText } from "./GradientText";
import MagneticButton from "@/components/MagneticButton";
import { Button } from "@/components/ui/button";

export const HeroV2 = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,8%)] via-[hsl(222,47%,11%)] to-background" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(262 83% 58%) 0%, transparent 70%)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(200 100% 50%) 0%, transparent 70%)" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.05) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(0 0% 100% / 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Trust badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm text-muted-foreground">⚡ Snabb service · 15 000+ nöjda kunder</span>
          </motion.div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Vi bygger<br />
            <GradientText gradient="rainbow">
              framtidens hem
            </GradientText>
          </h1>

          {/* Subheadline */}
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Professionella renoverings- och byggtjänster med garanterat ROT & RUT-avdrag. 
            Från elmontörer till målare – vi hanterar allt.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <MagneticButton
              variant="default"
              size="lg"
              className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(200,100%,50%)] hover:opacity-90 group"
              href="/boka/standard"
            >
              Boka gratis offert
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 h-auto border-white/20 hover:bg-white/10 group"
              asChild
            >
              <a href="tel:08-123 456 78">
                <Phone className="mr-2 w-5 h-5" />
                Ring: 08-123 456 78
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating trust indicators */}
        <motion.div
          className="mt-20 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>ROT & RUT-godkänt</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>F-skattsedel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Försäkrade hantverkare</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Garanti på arbete</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
