import { Button } from "@/components/ui/button-premium";
import { CheckCircle, ArrowRight, Home, Clipboard, CreditCard, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCopy } from '@/copy/CopyProvider';
import { Helmet } from 'react-helmet-async';
import ROTCalculator from "@/components/ROTCalculator";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useBookHomeVisitModal } from "@/hooks/useBookHomeVisitModal";
import { containerVariants, itemVariants, viewportConfig } from "@/utils/scrollAnimations";

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

const ROTInfo = () => {
  const { t, locale } = useCopy();
  const isEnglish = locale === 'en';
  const { open: openBooking } = useBookHomeVisitModal();

  const bookingPath = isEnglish ? '/en/book-visit' : '/boka-hembesok';

  const examples = [
    {
      service: t('pages.rot.examples.service1'),
      work: t('pages.rot.examples.work1'),
      normalPrice: 1918,
      rotPrice: 1343,
      savings: 575,
    },
    {
      service: t('pages.rot.examples.service2'),
      work: t('pages.rot.examples.work2'),
      normalPrice: 3500,
      rotPrice: 2450,
      savings: 1050,
    },
    {
      service: t('pages.rot.examples.service3'),
      work: t('pages.rot.examples.work3'),
      normalPrice: 38360,
      rotPrice: 26852,
      savings: 11508,
    },
  ];

  const qualifyingServices = isEnglish
    ? [
        "Carpentry work (kitchen, bathroom, interior)",
        "Plumbing installations and repairs",
        "Electrical installations and lighting",
        "Painting and wallpapering",
        "Floor laying and tiling work",
        "Garden work and landscaping",
        "Facade work and roofing",
        "Assembly of furniture and equipment",
        "Ground work and drainage",
      ]
    : [
        "Snickeriarbeten (kök, badrum, inredning)",
        "VVS-installationer och reparationer",
        "Elinstallationer och belysning",
        "Målning och tapetsering",
        "Golvläggning och kakelarbeten",
        "Trädgårdsarbeten och anläggning",
        "Fasadarbeten och takarbeten",
        "Montering av möbler och utrustning",
        "Markarbeten och dränering",
      ];

  const nonQualifyingServices = isEnglish
    ? [
        "Cleaning only (without construction work)",
        "New construction of entire houses",
        "Work on holiday homes (not permanent)",
        "Outdoor work unrelated to residence",
        "Pure consulting without physical work",
        "Materials (only labor qualifies)",
        "Moving costs",
        "Insurance matters",
        "Commercial properties",
      ]
    : [
        "Enbart städning (utan byggarbete)",
        "Nybyggnation av hela hus",
        "Fritidshus som inte är permanentbostad",
        "Arbete utomhus ej kopplat till bostaden",
        "Rena konsulttjänster utan fysiskt arbete",
        "Material (endast arbetskostnaden berättigar)",
        "Flyttkostnader",
        "Försäkringsärenden",
        "Kommersiella fastigheter",
      ];

  const steps = [
    {
      title: t('pages.rot.process.step1.title'),
      description: t('pages.rot.process.step1.description'),
      icon: Home,
    },
    {
      title: t('pages.rot.process.step2.title'),
      description: t('pages.rot.process.step2.description'),
      icon: Clipboard,
    },
    {
      title: t('pages.rot.process.step3.title'),
      description: t('pages.rot.process.step3.description'),
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? 'ROT Tax Deduction - Save 30% on Home Improvements | Fixco' : 'ROT-avdrag - Spara 30% på hemförbättringar | Fixco'}</title>
        <meta name="description" content={isEnglish ? 'Save 30% on labor costs with ROT tax deduction in Sweden. We handle all paperwork and applications for you. Book a free consultation today.' : 'Spara 30% på arbetskostnaden med ROT-avdrag. Vi sköter alla ansökningar och pappersarbete åt dig. Boka gratis konsultation idag.'} />
      </Helmet>

      {/* Hero — Minimalistisk med animerad siffra */}
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
              {t('pages.rot.hero.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              {t('pages.rot.hero.subtitle')}
            </p>

            <Link to={bookingPath}>
              <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                {t('pages.rot.hero.bookVisit')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
            {t('pages.rot.process.title')}
          </motion.h2>

          <div className="relative">
            {/* Connecting line */}
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

      {/* Kalkylator — sidans hjärta */}
      <ROTCalculator />

      {/* Prisexempel — visuella jämförelsekort */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('pages.rot.examples.title')}
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            {isEnglish ? 'See how much you save on common home projects.' : 'Se hur mycket du sparar på vanliga hemprojekt.'}
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

                  {/* Before/after bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('pages.rot.examples.price')}</span>
                      <span className="line-through text-muted-foreground">{ex.normalPrice.toLocaleString('sv-SE')} kr</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/30 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary font-medium">{t('pages.rot.examples.withRot')}</span>
                      <span className="font-bold text-primary">{ex.rotPrice.toLocaleString('sv-SE')} kr</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${100 - savingsPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{t('pages.rot.examples.savings')}</span>
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

      {/* Vad berättigar — Premium två-kolumns-layout */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('pages.rot.qualifies.title')}
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            {isEnglish ? 'Only labor costs qualify — not materials.' : 'Endast arbetskostnaden kvalificerar — inte material.'}
          </p>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Berättigar ✅ */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <span className="text-xl">✅</span>
                {t('pages.rot.qualifies.yes.title')}
              </h3>
              <div className="space-y-3">
                {qualifyingServices.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Berättigar inte ❌ */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <span className="text-xl">❌</span>
                {t('pages.rot.qualifies.no.title')}
              </h3>
              <div className="space-y-3">
                {nonQualifyingServices.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
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
                ? 'Book a free home visit. We handle all ROT paperwork for you.'
                : 'Boka ett kostnadsfritt hembesök. Vi sköter allt ROT-pappersarbete åt dig.'}
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground font-bold" onClick={openBooking}>
              {t('pages.rot.hero.bookVisit')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ROTInfo;
