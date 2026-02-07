import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Phone, Star, Shield, Clock, CheckCircle2, ArrowRight, Percent } from 'lucide-react';
import { GradientText } from '@/components/v2/GradientText';
import { GlassCard } from '@/components/v2/GlassCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSEO } from '@/hooks/useSEO';
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';
import { Link } from 'react-router-dom';
import {
  doorLockBrands,
  comparisonData,
  doorLockFAQs,
  howToSteps,
  seoContent,
  getDoorLockSchema
} from '@/data/doorLockData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }
  })
};

const DoorLockLandingPage: React.FC = () => {
  const seoElement = useSEO({
    title: 'Installera Dörrlås | Yale Doorman, Linus, Nuki | 30% ROT',
    description: 'Installation av smarta dörrlås ★ 5/5 betyg ✓ Yale Doorman, Linus, Nuki, ASSA ✓ 30% ROT-avdrag ✓ Fast pris. Boka certifierad montör!',
    keywords: 'installera dörrlås, yale doorman installation, smart dörrlås, kodlås montering, yale linus, nuki smart lock, assa abloy, ROT-avdrag dörrlås, byta cylinderlås',
    canonicalPath: '/tjanster/dorrlas',
    type: 'service',
    schema: getDoorLockSchema()
  });

  const handleBooking = (serviceName?: string) => {
    openServiceRequestModal({
      mode: 'home_visit',
      showCategories: true,
      prefill: serviceName ? { service: serviceName } : undefined
    });
  };

  return (
    <>
      {seoElement}
      <div className="min-h-screen bg-background">
        {/* HERO SECTION */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-8">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-muted-foreground">5/5 betyg • 127+ installationer</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Installation av{' '}
                <GradientText gradient="rainbow">Dörrlås & Smarta Lås</GradientText>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Yale Doorman, Linus, Nuki, ASSA ABLOY och fler. Certifierad installation med{' '}
                <strong className="text-foreground">30% ROT-avdrag</strong>. Fast pris, inga dolda kostnader.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  onClick={() => handleBooking()}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Begär gratis offert
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-border hover:bg-muted/50"
                  asChild
                >
                  <a href="tel:+46793350228">
                    <Phone className="w-5 h-5 mr-2" />
                    079-335 02 28
                  </a>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                {[
                  { icon: Shield, text: 'F-skatteregistrerat' },
                  { icon: Percent, text: '30% ROT-avdrag' },
                  { icon: Clock, text: 'Installation 1–2h' },
                  { icon: CheckCircle2, text: 'Garanti & försäkring' }
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* BRAND CARDS SECTION */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Vi installerar <GradientText gradient="blue">alla märken</GradientText>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Oavsett om du valt Yale, Nuki, Glue eller ASSA – vi har erfarenhet av alla ledande märken.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doorLockBrands.map((brand, i) => {
                const Icon = brand.icon;
                return (
                  <motion.div
                    key={brand.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <GlassCard className="p-6 h-full flex flex-col" glowColor="hsl(var(--primary) / 0.2)">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{brand.models}</p>
                      <p className="text-sm text-muted-foreground flex-1 mb-4">{brand.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {brand.features.map(f => (
                          <span key={f} className="text-xs px-2 py-1 rounded-full bg-muted/50 border border-border text-muted-foreground">
                            {f}
                          </span>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-border hover:bg-muted/50"
                        onClick={() => handleBooking(brand.name)}
                      >
                        Boka installation
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO CONTENT SECTION */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
                Allt du behöver veta om{' '}
                <GradientText gradient="purple">smarta dörrlås</GradientText>
              </h2>

              <div className="space-y-10 text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Vad är ett smart dörrlås?</h3>
                  <p>{seoContent.intro}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Skillnaden mellan Yale Doorman, Linus, Nuki och Glue
                  </h3>
                  <div className="space-y-4">
                    {seoContent.brandComparison.split('\n\n').map((para, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Vilka dörrar passar smarta lås på?</h3>
                  <p>{seoContent.doorCompatibility}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    ROT-avdrag för dörrlåsinstallation
                  </h3>
                  <div className="space-y-4">
                    {seoContent.rotInfo.split('\n\n').map((para, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/^- (.*)/gm, '• $1') }} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Behöver man en professionell montör?
                  </h3>
                  <div className="space-y-4">
                    {seoContent.professionalHelp.split('\n\n').map((para, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Säkerhet och certifiering</h3>
                  <div className="space-y-4">
                    {seoContent.safety.split('\n\n').map((para, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/^- (.*)/gm, '• $1') }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <GradientText gradient="default">Jämför</GradientText> smarta lås
              </h2>
              <p className="text-muted-foreground text-lg">Hitta rätt lås för din dörr</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="max-w-5xl mx-auto overflow-x-auto"
            >
              <GlassCard className="p-0 overflow-hidden" hoverEffect={false}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Märke</th>
                      <th className="text-left p-4 font-semibold">Modell</th>
                      <th className="text-left p-4 font-semibold hidden sm:table-cell">Anslutning</th>
                      <th className="text-left p-4 font-semibold hidden md:table-cell">Passar dörrar</th>
                      <th className="text-center p-4 font-semibold">ROT</th>
                      <th className="text-right p-4 font-semibold">Pris (lås)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{row.brand}</td>
                        <td className="p-4 text-muted-foreground">{row.model}</td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{row.type}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{row.doorTypes}</td>
                        <td className="p-4 text-center">
                          {row.rotEligible ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">–</span>
                          )}
                        </td>
                        <td className="p-4 text-right text-muted-foreground">{row.priceRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                * Priserna avser låsets inköpspris (exkl. installation). Installationskostnad tillkommer.
              </p>
            </motion.div>
          </div>
        </section>

        {/* HOW TO BOOK */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Så bokar du <GradientText gradient="blue">installation</GradientText>
              </h2>
              <p className="text-muted-foreground text-lg">4 enkla steg till ditt nya dörrlås</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {howToSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  onClick={() => handleBooking()}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Begär gratis offert
                </Button>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Vanliga frågor om{' '}
                <GradientText gradient="purple">dörrlås</GradientText>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-3">
                {doorLockFAQs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-border rounded-xl px-6 bg-muted/30 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Utforska fler <GradientText gradient="default">tjänster</GradientText>
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: '/tjanster/montering', label: 'Montering', desc: 'Alla monteringstjänster' },
                { to: '/tjanster/tekniska-installationer', label: 'Tekniska installationer', desc: 'Nätverk, larm & IT' },
                { to: '/smart-hem', label: 'Smart Hem', desc: 'Smarta hemlösningar' },
                { to: '/tjanster/montering/uppsala', label: 'Dörrlås Uppsala', desc: 'Installation i Uppsala' },
                { to: '/tjanster/montering/stockholm', label: 'Dörrlås Stockholm', desc: 'Installation i Stockholm' },
                { to: '/rot-info', label: 'ROT-avdrag', desc: 'Så fungerar ROT-avdrag' }
              ].map((link, i) => (
                <motion.div
                  key={link.to}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Link to={link.to}>
                    <GlassCard className="p-5 group cursor-pointer" glowColor="hsl(var(--accent) / 0.2)">
                      <h3 className="font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                        {link.label}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-muted-foreground">{link.desc}</p>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-3xl mx-auto p-8 md:p-12 text-center" hoverEffect={false}>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Redo att uppgradera ditt <GradientText gradient="rainbow">dörrlås</GradientText>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Begär en gratis offert idag. Vi återkommer inom 24 timmar med pris och rekommendation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  onClick={() => handleBooking()}
                >
                  Begär gratis offert
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-border hover:bg-muted/50"
                  asChild
                >
                  <a href="tel:+46793350228">
                    <Phone className="w-5 h-5 mr-2" />
                    Ring oss
                  </a>
                </Button>
              </div>
            </GlassCard>
          </div>
        </section>
      </div>
    </>
  );
};

export default DoorLockLandingPage;
