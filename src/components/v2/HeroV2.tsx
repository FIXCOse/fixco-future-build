import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { GradientText } from "./GradientText";
import MagneticButton from "@/components/MagneticButton";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/copy/CopyProvider";

export const HeroV2 = () => {
  const { t, locale } = useCopy();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background Effects with Parallax */}
      <div className="absolute inset-0 -z-10" data-speed="0.5">
        <div className="absolute inset-0 hero-background" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(262 83% 58%) 0%, transparent 70%)" }}
          data-speed="0.8"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(200 100% 50%) 0%, transparent 70%)" }}
          data-speed="0.6"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.05) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(0 0% 100% / 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center z-10" data-speed="1.1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm text-muted-foreground">{t('v2.hero.badge')}</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            {t('v2.hero.title1')}<br />
            <GradientText gradient="rainbow">
              {t('v2.hero.title2')}
            </GradientText>
          </h1>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('v2.hero.subtitle')}
          </motion.p>

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
              href={locale === 'en' ? '/en/book/standard' : '/boka/standard'}
            >
              {t('v2.hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 h-auto border-border hover:bg-muted group"
              asChild
            >
              <a href="tel:+46793350228">
                <Phone className="mr-2 w-5 h-5" />
                {t('v2.hero.call')}
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            t('v2.hero.trust.rot'),
            t('v2.hero.trust.ftax'),
            t('v2.hero.trust.insured'),
            t('v2.hero.trust.warranty'),
          ].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
