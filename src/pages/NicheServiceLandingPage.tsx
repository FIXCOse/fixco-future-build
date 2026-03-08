import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { 
  FileText, Calendar, MapPin, Clock, Star, Shield, 
  CheckCircle, ArrowRight, Phone 
} from "lucide-react";
import { Button } from "@/components/ui/button-premium";
import GradientButton from "@/components/GradientButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { FixcoFIcon } from "@/components/icons/FixcoFIcon";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import { useCopy } from "@/copy/CopyProvider";
import { useServices } from "@/hooks/useServices";
import ServiceCardV3 from "@/components/ServiceCardV3";
import { getNicheService, getNicheServiceByEnSlug } from "@/data/nicheServiceData";
import { getHeroGradientStyle } from "@/utils/serviceGradients";
import { STOCKHOLM_AREAS, UPPSALA_AREAS, generateAreaSlug } from "@/data/localServiceData";
import logoFixco from "@/assets/fixco-logo-white.png";
import { Seo } from "@/components/SEO";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } }
};

const NicheServiceLandingPage = () => {
  const location = useLocation();
  const { locale, t } = useCopy();
  const isEnglish = locale === 'en';
  const servicePrefix = isEnglish ? '/en/services' : '/tjanster';

  // Extract slug from pathname (last segment)
  const slug = location.pathname.split('/').filter(Boolean).pop();

  // Resolve niche service from slug
  const niche = useMemo(() => {
    if (!slug) return undefined;
    return isEnglish ? getNicheServiceByEnSlug(slug) : getNicheService(slug);
  }, [slug, isEnglish]);

  // Fetch related services from database
  const { data: dbServices } = useServices(locale);

  const relatedServices = useMemo(() => {
    if (!dbServices || !niche) return [];
    return dbServices
      .filter(s => 
        s.category === niche.parentCategory || 
        s.additional_categories?.includes(niche.parentCategory)
      )
      .sort((a, b) => (a.price_type !== 'quote' ? 0 : 1) - (b.price_type !== 'quote' ? 0 : 1))
      .slice(0, 6);
  }, [dbServices, niche]);

  if (!niche) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('serviceDetail.notFound')}</h1>
          <Link to={isEnglish ? "/en/services" : "/tjanster"}>
            <Button variant="premium">{t('serviceDetail.backToServices')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = isEnglish ? niche.titleEn : niche.title;
  const description = isEnglish ? niche.descriptionEn : niche.description;
  const usps = isEnglish ? niche.uspsEn : niche.usps;
  const faqs = isEnglish ? niche.faqsEn : niche.faqs;
  const IconComponent = niche.icon;
  const heroGradient = getHeroGradientStyle(niche.slug);
  const deductionLabel = niche.rotRut === 'ROT' ? '30% ROT' : '50% RUT';

  const seoTitle = `${title} – ${isEnglish ? 'Professional Service' : 'Professionell tjänst'} | Fixco`;
  const seoDescription = description;
  const canonicalPath = isEnglish ? `/en/services/${niche.enSlug}` : `/tjanster/${niche.slug}`;

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <div className="min-h-screen">
      <Seo title={seoTitle} description={seoDescription} canonicalPath={canonicalPath} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-90"
          style={{ background: heroGradient }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <motion.div 
          className="container mx-auto px-4 py-20 md:py-28 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center max-w-4xl mx-auto" variants={itemVariants}>
            <div className="flex items-center justify-center pb-2 md:pb-4 shrink-0">
              <a href="/" className="inline-block transition-transform duration-300 hover:scale-105 no-underline">
                <img src={logoFixco} alt="Fixco" className="max-h-20 md:max-h-28 w-auto block" />
              </a>
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant="outline" className="border-white/30 text-white bg-white/10 text-sm">
                {deductionLabel}-{isEnglish ? 'deduction' : 'avdrag'}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <GradientButton
                onClick={() => openServiceRequestModal({
                  serviceSlug: niche.slug,
                  prefill: { service_name: title }
                })}
                className="text-lg px-8 py-4"
              >
                <FileText className="h-5 w-5 mr-2" />
                {t('serviceDetail.requestQuote')}
              </GradientButton>
              <Button 
                variant="ghost-premium" 
                size="lg"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
              >
                <Calendar className="h-5 w-5 mr-2" />
                {t('footer.bookHomeVisit')}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> F-{t('serviceDetail.taxAndInsurance')}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {t('serviceDetail.startWithinDays')}</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4" /> 98% {t('serviceDetail.customerSatisfaction')}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Uppsala & Stockholm</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* USPs */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {usps.map((usp, i) => (
              <motion.div 
                key={i} 
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{usp}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related services from database */}
      {relatedServices.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-text">
                {isEnglish ? `Our ${title} Services` : `Våra ${title.toLowerCase()}tjänster`}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {isEnglish 
                  ? `Browse our related services in the ${title.toLowerCase()} category`
                  : `Se våra relaterade tjänster inom ${title.toLowerCase()}`
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedServices.map((s) => (
                <ServiceCardV3
                  key={s.id}
                  title={s.title}
                  category={s.category}
                  description={s.description}
                  pricingType={s.price_type === 'quote' ? 'quote' : s.price_unit?.includes('/h') ? 'hourly' : 'fixed'}
                  priceIncl={s.base_price}
                  eligible={{ rot: s.rot_eligible, rut: s.rut_eligible }}
                  serviceSlug={s.id}
                  serviceId={s.id}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Area links grid */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isEnglish ? `${title} Near You` : `${title} nära dig`}
            </h2>
            <p className="text-muted-foreground">
              {isEnglish 
                ? `We offer ${title.toLowerCase()} in Stockholm and Uppsala regions`
                : `Vi erbjuder ${title.toLowerCase()} i Stockholm- och Uppsalaregionen`
              }
            </p>
          </div>

          {/* Stockholm */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Stockholm
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {STOCKHOLM_AREAS.map(area => (
                <Link
                  key={area}
                  to={`${servicePrefix}/${niche.slug}/${generateAreaSlug(area)}`}
                  className="text-sm px-3 py-2 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all text-center text-foreground hover:text-primary"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          {/* Uppsala */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Uppsala
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {UPPSALA_AREAS.map(area => (
                <Link
                  key={area}
                  to={`${servicePrefix}/${niche.slug}/${generateAreaSlug(area)}`}
                  className="text-sm px-3 py-2 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all text-center text-foreground hover:text-primary"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isEnglish ? `FAQ – ${title}` : `Vanliga frågor – ${title}`}
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4 bg-card">
                <AccordionTrigger className="text-left font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            {isEnglish ? `Ready for your ${title.toLowerCase()}?` : `Redo för din ${title.toLowerCase()}?`}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isEnglish 
              ? 'Get a free quote or book a home visit. We respond within 24 hours.'
              : 'Få en kostnadsfri offert eller boka ett hembesök. Vi svarar inom 24 timmar.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton
              onClick={() => openServiceRequestModal({
                serviceSlug: niche.slug,
                prefill: { service_name: title }
              })}
              className="text-lg px-8 py-4"
            >
              <FileText className="h-5 w-5 mr-2" />
              {t('serviceDetail.requestQuote')}
            </GradientButton>
            <Button
              variant="outline"
              size="lg"
              onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
            >
              <Calendar className="h-5 w-5 mr-2" />
              {t('footer.bookHomeVisit')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NicheServiceLandingPage;
