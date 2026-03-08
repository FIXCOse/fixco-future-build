import { Button } from "@/components/ui/button-premium";
import { ArrowRight, Home, Clipboard, CreditCard, X, Sparkles, Droplets, Shirt, TreePine, Wrench, Package, ChevronDown } from "lucide-react";
import { useCopy } from '@/copy/CopyProvider';
import { Helmet } from 'react-helmet-async';
import RUTCalculator from "@/components/RUTCalculator";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useBookHomeVisitModal } from "@/hooks/useBookHomeVisitModal";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";
import { Badge } from "@/components/ui/badge";
import { type LucideIcon } from "lucide-react";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const INITIAL_VISIBLE = 4;

const QualifiesCard = ({
  type,
  title,
  items,
  showAllLabel,
  showLessLabel,
}: {
  type: 'positive' | 'negative';
  title: string;
  items: { label: string; icon: LucideIcon }[];
  showAllLabel: string;
  showLessLabel: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isPositive = type === 'positive';
  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE);
  const hasMore = items.length > INITIAL_VISIBLE;

  return (
    <motion.div
      variants={itemVariants}
      className={`relative overflow-hidden rounded-2xl border-l-4 ${
        isPositive
          ? 'border-l-primary bg-gradient-to-br from-primary/5 to-card'
          : 'border-l-destructive bg-gradient-to-br from-destructive/5 to-card'
      } border border-border p-8 shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-6">
        <Badge
          variant={isPositive ? 'default' : 'destructive'}
          className={`text-sm px-3 py-1 ${
            isPositive
              ? 'bg-primary/15 text-primary border-primary/20 hover:bg-primary/15'
              : 'bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/15'
          }`}
        >
          {isPositive ? '✅' : '❌'} {title}
        </Badge>
      </div>

      <div className="space-y-1">
        <AnimatePresence initial={false}>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-3 text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  isPositive ? 'hover:bg-primary/5' : 'hover:bg-destructive/5'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isPositive ? 'bg-primary/10' : 'bg-destructive/10'
                }`}>
                  <Icon className={`h-4 w-4 ${isPositive ? 'text-primary' : 'text-destructive'}`} />
                </div>
                <span className={isPositive ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-4 flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isPositive ? 'text-primary hover:text-primary/80' : 'text-destructive hover:text-destructive/80'
          }`}
        >
          {expanded ? showLessLabel : showAllLabel}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </motion.div>
  );
};

const RUT = () => {
  const { t, locale } = useCopy();
  const isEnglish = locale === 'en';
  const { open: openBooking } = useBookHomeVisitModal();

  const examples = [
    {
      service: t('pages.rut.examples.service1'),
      work: t('pages.rut.examples.work1'),
      normalPrice: 2040,
      rutPrice: 1020,
      savings: 1020,
    },
    {
      service: t('pages.rut.examples.service2'),
      work: t('pages.rut.examples.work2'),
      normalPrice: 1020,
      rutPrice: 510,
      savings: 510,
    },
    {
      service: t('pages.rut.examples.service3'),
      work: t('pages.rut.examples.work3'),
      normalPrice: 4080,
      rutPrice: 2040,
      savings: 2040,
    },
  ];

  const qualifyingServices = isEnglish
    ? [
        { label: "Regular home cleaning", icon: Sparkles },
        { label: "Window cleaning (inside and outside)", icon: Droplets },
        { label: "Deep cleaning of kitchen and bathroom", icon: Sparkles },
        { label: "Construction cleaning after renovation", icon: Wrench },
        { label: "Move-out cleaning", icon: Package },
        { label: "Laundry and ironing services", icon: Shirt },
        { label: "Carpet and upholstery cleaning", icon: Sparkles },
        { label: "Cleaning of balconies and patios", icon: TreePine },
        { label: "Small maintenance tasks", icon: Wrench },
      ]
    : [
        { label: "Regelbunden hemstädning", icon: Sparkles },
        { label: "Fönsterputs (in- och utvändigt)", icon: Droplets },
        { label: "Djuprengöring av kök och badrum", icon: Sparkles },
        { label: "Byggstäd efter renovering", icon: Wrench },
        { label: "Flyttstäd", icon: Package },
        { label: "Tvätt- och stryktjänster", icon: Shirt },
        { label: "Matta- och möbelrengöring", icon: Sparkles },
        { label: "Städning av balkonger och uteplatser", icon: TreePine },
        { label: "Mindre underhållsarbeten", icon: Wrench },
      ];

  const nonQualifyingServices = isEnglish
    ? [
        "Construction and renovation work",
        "New installations (covered by ROT)",
        "Garden work and landscaping",
        "Exterior maintenance of building facades",
        "Electrical and plumbing installations",
        "Material costs (only labor qualifies)",
        "Business premises cleaning",
        "Industrial cleaning services",
        "Repairs requiring permits",
      ]
    : [
        "Bygg- och renoveringsarbeten",
        "Nyinstallationer (täcks av ROT)",
        "Trädgårdsarbeten och anläggning",
        "Yttre underhåll av byggnadsfasader",
        "El- och VVS-installationer",
        "Materialkostnader (endast arbetskostnad berättigar)",
        "Städning av affärslokaler",
        "Industriell rengöring",
        "Reparationer som kräver bygglov",
      ];

  const steps = [
    {
      title: t('pages.rut.process.step1.title'),
      description: t('pages.rut.process.step1.description'),
      icon: Home,
    },
    {
      title: t('pages.rut.process.step2.title'),
      description: t('pages.rut.process.step2.description'),
      icon: Clipboard,
    },
    {
      title: t('pages.rut.process.step3.title'),
      description: t('pages.rut.process.step3.description'),
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? 'RUT Tax Deduction - Save 30% on Home Services | Fixco' : 'RUT-avdrag - Spara 30% på hemservice | Fixco'}</title>
        <meta name="description" content={isEnglish ? 'Save 30% on home service costs with RUT tax deduction in Sweden. We handle all paperwork and applications for you. Book a free consultation today.' : 'Spara 30% på hemservice med RUT-avdrag. Vi sköter alla ansökningar och pappersarbete åt dig. Boka gratis konsultation idag.'} />
      </Helmet>

      {/* Hero — Animerad counter */}
      <section className="pt-32 pb-24 hero-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-baseline gap-3 mb-6">
              <span className="text-7xl md:text-9xl font-black tracking-tight text-primary">
                <AnimatedCounter target={30} suffix="%" />
              </span>
              <span className="text-2xl md:text-3xl font-semibold text-muted-foreground">
                {isEnglish ? 'tax deduction' : 'skattereduktion'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
              {t('pages.rut.hero.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              {t('pages.rut.hero.subtitle')}
            </p>

            <Button size="lg" className="gradient-primary text-primary-foreground font-bold" onClick={openBooking}>
              {t('pages.rut.hero.bookVisit')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Så fungerar det — 3-stegs timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('pages.rut.process.title')}
          </motion.h2>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-border" />

            <motion.div
              className="grid md:grid-cols-3 gap-12 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div key={i} variants={itemVariants} className="text-center">
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      <div className="w-full h-full rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kalkylator */}
      <RUTCalculator />

      {/* Prisexempel */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('pages.rut.examples.title')}
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            {isEnglish ? 'See how much you save on common home services.' : 'Se hur mycket du sparar på vanliga hemtjänster.'}
          </p>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {examples.map((ex) => {
              const savingsPercent = Math.round((ex.savings / ex.normalPrice) * 100);
              return (
                <motion.div
                  key={ex.service}
                  variants={itemVariants}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-lg mb-1 text-foreground">{ex.service}</h3>
                  <p className="text-xs text-muted-foreground mb-5">{ex.work}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('pages.rut.examples.price')}</span>
                      <span className="line-through text-muted-foreground">{ex.normalPrice.toLocaleString('sv-SE')} kr</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/30 rounded-full" style={{ width: '100%' }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary font-medium">{t('pages.rut.examples.withRut')}</span>
                      <span className="font-bold text-primary">{ex.rutPrice.toLocaleString('sv-SE')} kr</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${100 - savingsPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{t('pages.rut.examples.savings')}</span>
                    <span className="text-lg font-bold text-primary">
                      <AnimatedCounter target={ex.savings} /> kr
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Vad kvalificerar */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('pages.rut.qualifies.title')}
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            {isEnglish ? 'Only labor costs qualify — not materials.' : 'Endast arbetskostnaden kvalificerar — inte material.'}
          </p>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <QualifiesCard
              type="positive"
              title={t('pages.rut.qualifies.yes.title')}
              items={qualifyingServices}
              showAllLabel={isEnglish ? 'Show all' : 'Visa alla'}
              showLessLabel={isEnglish ? 'Show less' : 'Visa färre'}
            />

            <QualifiesCard
              type="negative"
              title={t('pages.rut.qualifies.no.title')}
              items={nonQualifyingServices.map(label => ({ label, icon: X }))}
              showAllLabel={isEnglish ? 'Show all' : 'Visa alla'}
              showLessLabel={isEnglish ? 'Show less' : 'Visa färre'}
            />
          </motion.div>
        </div>
      </section>

      {/* Avslutande CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {isEnglish ? 'Ready to save 30%?' : 'Redo att spara 30%?'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {isEnglish
                ? 'Book a free home visit. We handle all RUT paperwork for you.'
                : 'Boka ett kostnadsfritt hembesök. Vi sköter allt RUT-pappersarbete åt dig.'}
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground font-bold" onClick={openBooking}>
              {t('pages.rut.hero.bookVisit')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RUT;
