import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { 
  MapPin, CheckCircle
} from "lucide-react";
// Note: Some icons kept for other sections below
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
    return isEnglish ? (getNicheServiceByEnSlug(slug) || getNicheService(slug)) : getNicheService(slug);
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
  const heroTitle = isEnglish ? niche.heroTitleEn : niche.heroTitle;
  const description = isEnglish ? niche.descriptionEn : niche.description;
  const metaDesc = isEnglish ? niche.metaDescriptionEn : niche.metaDescription;
  const usps = isEnglish ? niche.uspsEn : niche.usps;
  const faqs = isEnglish ? niche.faqsEn : niche.faqs;
  const IconComponent = niche.icon;
  const introText = isEnglish ? niche.introTextEn : niche.introText;
  const heroGradient = getHeroGradientStyle(niche.slug);
  const deductionLabel = niche.rotRut === 'ROT' ? '30% ROT' : '50% RUT';

  // Category display names for related services heading
  const CATEGORY_DISPLAY: Record<string, { sv: string; en: string }> = {
    kok: { sv: 'Kök', en: 'Kitchen' },
    badrum: { sv: 'Badrum', en: 'Bathroom' },
    snickeri: { sv: 'Snickeri', en: 'Carpentry' },
    malning: { sv: 'Målning', en: 'Painting' },
    el: { sv: 'El', en: 'Electrical' },
    golv: { sv: 'Golv', en: 'Flooring' },
    montering: { sv: 'Montering', en: 'Assembly' },
    vvs: { sv: 'VVS', en: 'Plumbing' },
    tradgard: { sv: 'Trädgård', en: 'Garden' },
    markarbeten: { sv: 'Markarbeten', en: 'Groundwork' },
    stadning: { sv: 'Städning', en: 'Cleaning' },
    flytt: { sv: 'Flytt', en: 'Moving' },
    'tekniska-installationer': { sv: 'Tekniska installationer', en: 'Technical Installations' },
    rivning: { sv: 'Rivning', en: 'Demolition' },
  };
  const categoryDisplay = CATEGORY_DISPLAY[niche.parentCategory];
  const categoryName = categoryDisplay ? (isEnglish ? categoryDisplay.en : categoryDisplay.sv) : title;

  const seoTitle = `${heroTitle} – Fixco | ${niche.rotRut}-avdrag & Garanti`;
  const seoDescription = metaDesc;
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
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`https://fixco.se${canonicalPath}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={`https://fixco.se${canonicalPath}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Breadcrumbs />

      {/* Hero Section — matches LocalServicePage */}
      <section className="relative w-full overflow-hidden">
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{ backgroundImage: heroGradient, backgroundSize: '200% 200%' }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 opacity-30 blur-3xl rounded-full animate-float-slow" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <div className="absolute bottom-32 right-1/4 w-64 h-64 opacity-20 blur-2xl rounded-full animate-float-fast" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-6 pt-8 pb-20 md:pt-10 md:pb-28">
          {/* Fixco Logo */}
          <div className="flex items-center justify-center pb-2 md:pb-4 shrink-0">
            <a href="/" className="inline-block transition-transform duration-300 hover:scale-105 no-underline">
              <img src={logoFixco} alt="Fixco" className="max-h-20 md:max-h-28 w-auto block" />
            </a>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-4xl"
          >
            {/* H1 */}
            <motion.h1 
              variants={itemVariants}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center leading-tight"
            >
              {heroTitle}
            </motion.h1>
            
            {/* Value prop */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 text-center max-w-3xl leading-relaxed"
            >
              {description}
            </motion.p>
            
            {/* CTA buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center mt-2"
            >
              <GradientButton 
                className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
                onClick={() => openServiceRequestModal({
                  serviceSlug: niche.slug,
                  prefill: { service_name: title }
                })}
              >
                {t('local.ctaQuote')}
              </GradientButton>
              <GradientButton className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5" href={servicePrefix}>
                {t('local.allServices')}
              </GradientButton>
            </motion.div>

            {/* Trust badges — pill style */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 mt-2"
            >
              {[
                deductionLabel,
                'F-skatt',
                isEnglish ? 'Insured' : 'Försäkrade',
                isEnglish ? 'Fixed price' : 'Fast pris',
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm md:text-base text-white/90">
                  <CheckCircle className="h-3.5 w-3.5 text-white/80" />
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Intro text section */}
      {introText && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {introText}
            </p>
          </div>
        </section>
      )}

      {/* Related services from database */}
      {relatedServices.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-text">
                {isEnglish ? `Our ${categoryName} Services` : `Våra ${categoryName.toLowerCase()}tjänster`}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {isEnglish 
                  ? `Browse our related services in the ${categoryName.toLowerCase()} category`
                  : `Se våra relaterade tjänster inom ${categoryName.toLowerCase()}`
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
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <GradientButton
              onClick={() => openServiceRequestModal({
                serviceSlug: niche.slug,
                prefill: { service_name: title }
              })}
              className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
            >
              {t('local.ctaQuote')}
            </GradientButton>
            <GradientButton
              className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
              href={servicePrefix}
            >
              {t('local.allServices')}
            </GradientButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NicheServiceLandingPage;
