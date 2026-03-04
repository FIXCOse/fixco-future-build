import { useParams, Link } from "react-router-dom";
import { getGradientForService, getHeroGradientStyle } from "@/utils/serviceGradients";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button-premium";
import GradientButton from "@/components/GradientButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { motion } from "framer-motion";
import { 
  Phone, 
  FileText, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight,
  BadgeCheck,
  Zap,
  Lightbulb,
  XCircle,
  Calendar
} from "lucide-react";
import { FixcoFIcon } from "@/components/icons/FixcoFIcon";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import { useEventTracking } from "@/hooks/useEventTracking";
import {
  generateLocalContent,
  getAreaFromSlug,
  getServiceFromSlug,
  isValidLocalServicePage,
  generateAreaSlug,
  LOCAL_SERVICES,
  STOCKHOLM_AREAS,
  UPPSALA_AREAS,
  getAreaMetadata,
  type LocalServiceSlug,
  type AreaKey
} from "@/data/localServiceData";
import { generateUniqueLocalContent } from "@/data/localSeoData";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { servicesDataNew } from "@/data/servicesDataNew";
import { useMemo } from "react";
import { useCopy } from "@/copy/CopyProvider";
import { SEARCH_ACTION_PATTERNS } from "@/data/localSeoData";
import { getAreaActivity, getAreaReview, getRandomReviewer, getHowToSteps, getAreaReviews } from "@/data/areaActivityData";
import { GradientText } from "@/components/v2/GradientText";
// CompactTrustBar removed — trust badges integrated in hero
import { TestimonialCarouselLocal } from "@/components/local-service/TestimonialCarouselLocal";
import { NearbyAreasSection } from "@/components/local-service/NearbyAreasSection";
import { ExpandableAreaLinks } from "@/components/local-service/ExpandableAreaLinks";
import { 
  getAuthorSchema, 
  getSpeakableSchema, 
  getOrganizationSchema,
  getReviewSchema
} from "@/components/SEOSchemaEnhanced";



// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
};

const stepIcons = [FileText, Clock, Calendar, CheckCircle];
const stepColors = [
  { bg: "from-purple-500/20 to-purple-500/5", text: "text-purple-400", border: "border-purple-500/20" },
  { bg: "from-blue-500/20 to-blue-500/5", text: "text-blue-400", border: "border-blue-500/20" },
  { bg: "from-amber-500/20 to-amber-500/5", text: "text-amber-400", border: "border-amber-500/20" },
  { bg: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400", border: "border-emerald-500/20" },
];

/**
 * Maps a related search term to the correct service+area URL instead of self-linking.
 * Analyzes the term against SEARCH_ACTION_PATTERNS to find the best matching service.
 */
const getRelatedSearchUrl = (
  term: string, 
  currentServiceSlug: string, 
  currentAreaSlug: string,
  servicePrefix: string
): string => {
  const lowerTerm = term.toLowerCase();
  
  // Try to match term against other services' synonyms/projectTypes
  let bestMatch: string | null = null;
  
  for (const [slug, patterns] of Object.entries(SEARCH_ACTION_PATTERNS)) {
    if (slug === currentServiceSlug) continue; // Skip current service
    
    const allTerms = [...patterns.synonyms, ...patterns.projectTypes];
    if (allTerms.some(t => lowerTerm.includes(t.toLowerCase()))) {
      bestMatch = slug;
      break;
    }
  }
  
  // If no match to another service, try matching current service's synonyms 
  // and link to a nearby service instead
  if (!bestMatch) {
    const serviceKeys = Object.keys(SEARCH_ACTION_PATTERNS);
    const currentIdx = serviceKeys.indexOf(currentServiceSlug);
    // Pick the next service in the list as a cross-link
    bestMatch = serviceKeys[(currentIdx + 1) % serviceKeys.length];
  }
  
  return `${servicePrefix}/${bestMatch}/${currentAreaSlug}`;
};

const LocalServicePage = () => {
  const { serviceSlug, areaSlug } = useParams<{ serviceSlug: string; areaSlug: string }>();
  const { locale, t } = useCopy();
  const { trackClick } = useEventTracking();
  const servicePrefix = locale === 'en' ? '/en/services' : '/tjanster';
  
  const isValid = serviceSlug && areaSlug && isValidLocalServicePage(serviceSlug, areaSlug);
  
  const area = isValid ? getAreaFromSlug(areaSlug!) as AreaKey : "" as AreaKey;
  const service = isValid ? getServiceFromSlug(serviceSlug!) : null;
  const content = isValid ? generateLocalContent(serviceSlug as LocalServiceSlug, area, locale) : null;
  const metadata = isValid ? getAreaMetadata(area) : null;
  const uniqueContent = isValid ? generateUniqueLocalContent(serviceSlug as LocalServiceSlug, area) : null;
  
  const serviceData = isValid ? servicesDataNew.find(s => s.slug === service?.serviceKey) : null;
  const IconComponent = serviceData?.icon || Zap;
  
  const areaActivity = isValid ? getAreaActivity(area) : { avgRating: 0, reviewCount: 0 };
  const howToSteps = isValid ? getHowToSteps(service?.name || '', area, locale) : [];

  

  // Schema.org markup
  const localBusinessSchema = useMemo(() => {
    if (!content || !metadata) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": `Fixco ${content.h1}`,
      "description": content.description,
      "url": `https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`,
      "telephone": "+46-79-335-02-28",
      "priceRange": "$$",
      "areaServed": { "@type": "City", "name": area },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": area,
        "addressRegion": metadata.region,
        "addressCountry": "SE"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": areaActivity.avgRating.toFixed(1),
        "reviewCount": areaActivity.reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://www.facebook.com/fixco",
        "https://www.instagram.com/fixco_se",
        "https://www.linkedin.com/company/fixco"
      ],
      "hasMap": `https://www.google.com/maps?q=Fixco+${encodeURIComponent(service?.name || '')}+${encodeURIComponent(area)}`,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${service?.name} i ${area}`,
        "itemListElement": content.servicesSection.items.map((item: string) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": item,
            "provider": { "@id": "https://fixco.se#organization" }
          }
        }))
      }
    };
  }, [content, serviceSlug, areaSlug, area, metadata, areaActivity, service]);

  const howToSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `Så bokar du ${service?.name?.toLowerCase()} i ${area}`,
    "description": `Steg-för-steg guide för att boka ${service?.name?.toLowerCase()} via Fixco i ${area}`,
    "totalTime": "PT5M",
    "step": howToSteps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.title,
      "text": step.description
    }))
  }), [service, area, howToSteps]);
  
  const faqSchema = useMemo(() => {
    if (!content) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": content.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
      }))
    };
  }, [content]);

  const breadcrumbSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Hem", "item": "https://fixco.se" },
      { "@type": "ListItem", "position": 2, "name": "Tjänster", "item": "https://fixco.se/tjanster" },
      { "@type": "ListItem", "position": 3, "name": service?.name, "item": `https://fixco.se/tjanster/${service?.serviceKey}` },
      { "@type": "ListItem", "position": 4, "name": `${service?.name} ${area}`, "item": `https://fixco.se/tjanster/${serviceSlug}/${areaSlug}` }
    ]
  }), [service, area, serviceSlug, areaSlug]);

  // AI-optimized schemas for maximum visibility
  const authorSchema = useMemo(() => getAuthorSchema(), []);
  const organizationSchema = useMemo(() => getOrganizationSchema(), []);
  const speakableSchema = useMemo(() => {
    if (!content) return null;
    return getSpeakableSchema({
      headline: content.h1,
      description: content.description,
      url: `https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`,
      speakableSelectors: ["h1", ".hero-description", ".service-intro"]
    });
  }, [content, serviceSlug, areaSlug]);

  // Individual Review schemas to validate AggregateRating
  const reviewSchemas = useMemo(() => {
    if (!service) return [];
    const reviews = getAreaReviews(area, service.name, 5);
    return getReviewSchema(reviews.map((r, idx) => ({
      author: r.name,
      rating: r.rating,
      text: r.quote,
      date: `2026-0${Math.min(idx + 1, 2)}-${String(10 + idx).padStart(2, '0')}`
    })));
  }, [area, service]);

  // Combine myths into FAQ for consolidation
  const allFaqItems = content ? [
    ...content.faqs,
    ...content.myths.map(m => ({ q: `Myt: "${m.myth}" – stämmer det?`, a: `Nej, det är en myt. Sanningen är: ${m.truth}` }))
  ] : [];

  if (!isValid || !content || !uniqueContent || !metadata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('local.notFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('local.notFoundDesc')}</p>
          <Button asChild>
            <Link to={servicePrefix}>{t('local.allServices')}</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <link rel="canonical" href={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:url" content={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        {/* hreflang for multilingual SEO */}
        <link rel="alternate" hrefLang="sv" href={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        <link rel="alternate" hrefLang="en" href={`https://fixco.se/en/services/${serviceSlug}/${areaSlug}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        {/* Geo meta tags for local ranking */}
        {metadata?.region && <meta name="geo.region" content={`SE-${metadata.region === 'Uppsala' ? 'C' : 'AB'}`} />}
        <meta name="geo.placename" content={area} />
        {/* Core SEO schemas */}
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        {/* AI-optimized schemas for ChatGPT, Claude, Perplexity, etc */}
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(authorSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>
        {/* Individual Review schemas for AggregateRating validation */}
        {reviewSchemas.map((review, idx) => (
          <script key={`review-${idx}`} type="application/ld+json">{JSON.stringify(review)}</script>
        ))}
      </Helmet>

      <div className="min-h-screen">
        <Breadcrumbs />
        
        {/* ============================================
            1. HERO — Conversion-focused, no filler
            ============================================ */}
        <section className="relative w-full overflow-hidden">
          {/* Gradient Background — service-specific */}
          <div 
            className="absolute inset-0 animate-gradient-shift" 
            style={{ 
              backgroundImage: getHeroGradientStyle(serviceSlug!),
              backgroundSize: '200% 200%'
            }}
          />
          
          {/* Glow Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-72 h-72 opacity-30 blur-3xl rounded-full animate-float-slow" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-25 blur-3xl rounded-full animate-float-medium" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div className="absolute bottom-32 right-1/4 w-64 h-64 opacity-20 blur-2xl rounded-full animate-float-fast" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-6 pt-12 pb-16 md:pt-20 md:pb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-4xl"
            >
              {/* Stars */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-1">
                <span className="text-sm text-white/90 tracking-wide">{areaActivity.avgRating.toFixed(1)}</span>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
                <span className="text-sm text-white/70 ml-1">({areaActivity.reviewCount}+ {locale === 'en' ? 'reviews' : 'omdömen'})</span>
              </motion.div>

              {/* H1 */}
              <motion.h1 
                variants={itemVariants}
                className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-[120%]"
              >
                {content.h1}
              </motion.h1>
              
              {/* Value prop */}
              <motion.p 
                variants={itemVariants}
                className="text-base md:text-xl lg:text-2xl text-white/90 text-center max-w-3xl leading-relaxed hero-description"
              >
                {locale === 'en' 
                  ? `Top-rated in ${metadata?.region || 'the region'} — free quote within 24h. Fixed price, insured contractors and ${service?.rotRut} deduction.`
                  : `Topprankade i ${metadata?.region || 'regionen'} — gratis offert inom 24h. Fast pris, försäkrade hantverkare och ${service?.rotRut}-avdrag.`
                }
              </motion.p>
              
              {/* CTA buttons — GradientButton */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center mt-2"
              >
                <GradientButton 
                  onClick={() => {
                    trackClick('hero_cta_quote', { service: service?.serviceKey || serviceSlug, area: areaSlug });
                    openServiceRequestModal({
                      serviceSlug: service?.serviceKey || serviceSlug,
                      prefill: { service_name: content.h1 }
                    });
                  }}
                >
                  {t('local.ctaQuote')}
                </GradientButton>
                <GradientButton href={servicePrefix}>
                  {t('local.allServices')}
                </GradientButton>
              </motion.div>

              {/* Trust badges */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-3 mt-2"
              >
                {[
                  `30% ${service?.rotRut}`,
                  'F-skatt',
                  locale === 'en' ? 'Insured' : 'Försäkrade',
                  locale === 'en' ? 'Fixed price' : 'Fast pris',
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/90">
                    <CheckCircle className="h-3.5 w-3.5 text-white/80" />
                    <span>{badge}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            2. SOCIAL PROOF — Testimonials direkt efter hero
            ============================================ */}
        <section className="py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-6xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('local.reviews')}
                </span>
                <h2 className="text-2xl font-bold text-foreground">{t('local.whatCustomersSay')} {area} {locale === 'en' ? 'say' : 'säger'}</h2>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <TestimonialCarouselLocal 
                  testimonials={getAreaReviews(area, service?.name || '', 15, locale)}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            3. HOW TO BOOK — 4 steg (moved up for conversion)
            ============================================ */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-14">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                  {t('local.fourSteps')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                  {t('local.howToBook')} <span className="text-primary">{service?.name?.toLowerCase()}</span>
                </h2>
                <p className="text-muted-foreground">{t('local.fromRequestToDone')}</p>
              </motion.div>

              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  <div className="hidden md:block absolute top-20 left-[12%] right-[12%] h-0.5">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-blue-500/40 via-amber-500/40 to-emerald-500/40" />
                  </div>
                  
                  {howToSteps.map((step, idx) => {
                    const StepIcon = stepIcons[idx] || CheckCircle;
                    const colors = stepColors[idx] || stepColors[0];
                    return (
                      <motion.div 
                        key={idx} 
                        variants={itemVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="relative group"
                      >
                        <div className="flex justify-center mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.bg} ${colors.border} border-2 flex items-center justify-center font-bold text-lg ${colors.text} shadow-lg group-hover:scale-110 transition-transform`}>
                            {idx + 1}
                          </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-2xl p-6 text-center h-full hover:border-primary/20 transition-all">
                          <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                            <StepIcon className={`h-6 w-6 ${colors.text}`} />
                          </div>
                          <h3 className="font-semibold mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            4. TJÄNSTER — Vad vi gör (kompakt)
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3 text-foreground">
                  {content.servicesSection.title}
                </h2>
                <p className="text-muted-foreground">{t('local.allYouNeed')}</p>
              </motion.div>
              
              <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.servicesSection.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="group cursor-default"
                  >
                    <div className="bg-card border border-border rounded-xl p-5 h-full hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{item}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            4. ROT/RUT — Prisincitament
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div variants={itemVariants} className="flex justify-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
                      <span className="text-6xl font-bold text-emerald-400">30%</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                      {service?.rotRut}{t('local.rotDeduction')}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                    {t('local.saveMoney')}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {content.rotRutSection.title}
                  </h2>
                  <div 
                    className="prose prose-sm prose-slate dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: content.rotRutSection.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                        .replace(/\n\n/g, '</p><p class="mt-3">')
                        .replace(/\n(\d+)\. /g, '<br /><br />$1. ')
                        .replace(/\n- /g, '<br />• ')
                    }} 
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            6. ANDRA TJÄNSTER — Korsförsäljning
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-10">
                <h2 className="text-2xl font-bold text-foreground">
                  {t('local.moreServices')} <span className="text-primary">{area}</span>
                </h2>
              </motion.div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" key={`services-grid-${serviceSlug}`}>
                {LOCAL_SERVICES.filter(s => s.slug !== serviceSlug).map((otherService) => {
                  const OtherIcon = servicesDataNew.find(s => s.slug === otherService.serviceKey)?.icon || Zap;
                  return (
                    <motion.div 
                      key={otherService.slug} 
                      initial={{ opacity: 1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link 
                        to={`${servicePrefix}/${otherService.slug}/${areaSlug}`}
                        className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-border hover:bg-primary/5 hover:border-primary/30 transition-all group text-center"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${getGradientForService(otherService.slug)}`}>
                          <OtherIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{otherService.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            7. FINAL CTA — Stark avslutning
            ============================================ */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="max-w-2xl mx-auto text-center">
                <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-10 md:p-14 shadow-2xl shadow-primary/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                    {t('local.readyToBook')} <span className="text-primary">{service?.name?.toLowerCase()}</span>?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    {t('local.fixedPrice')} {area} – {locale === 'en' ? 'with' : 'med'} 30% {service?.rotRut}{t('local.rotDeduction')}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <GradientButton 
                      onClick={() => {
                        trackClick('bottom_cta_quote', { service: service?.serviceKey || serviceSlug, area: areaSlug });
                        openServiceRequestModal({
                          serviceSlug: service?.serviceKey || serviceSlug,
                          prefill: { service_name: content.h1 }
                        });
                      }}
                    >
                      {t('local.ctaQuote')}
                    </GradientButton>
                    <GradientButton href={servicePrefix}>
                      {t('local.allServices')}
                    </GradientButton>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SEO ZONE — Diskret, längst ner
            ════════════════════════════════════════════ */}

        {/* FAQ + Myths */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-2xl font-bold text-muted-foreground">
                  {t('local.faqTitle')} <span className="text-primary/70">{service?.name?.toLowerCase()}</span> {locale === 'en' ? 'in' : 'i'} {area}
                </h2>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {allFaqItems.map((faq, idx) => (
                    <AccordionItem 
                      key={idx} 
                      value={`faq-${idx}`}
                      className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-all"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium pr-4">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Vanliga projekt (SEO) */}
        <section className="py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-lg font-semibold text-muted-foreground mb-6 text-center">
                {locale === 'en' ? 'Common' : 'Vanliga'} {service?.name?.toLowerCase()}{t('local.commonProjects')} {area}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {uniqueContent.popularSearches.map((search, idx) => (
                  <div
                    key={`search-${idx}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-primary/50 flex-shrink-0" />
                    <span className="capitalize">{search} {locale === 'en' ? 'in' : 'i'} {area}</span>
                  </div>
                ))}
                {uniqueContent.projectExamples.map((project, idx) => (
                  <div
                    key={`project-${idx}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border text-sm text-muted-foreground"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400/50 flex-shrink-0" />
                    <span className="capitalize">{project}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Om tjänst i ort (SEO) */}
        <section className="py-10 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-muted-foreground mb-4">
                {t('local.aboutServiceIn')} {service?.name?.toLowerCase()} {locale === 'en' ? 'in' : 'i'} {area}
              </h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {uniqueContent.uniqueIntro}
              </p>
              {/* Local Tip */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-4 w-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('local.tipsFor')} {service?.name?.toLowerCase()} {locale === 'en' ? 'in' : 'i'} {area}</h4>
                    <p className="text-xs text-muted-foreground/70">{uniqueContent.localTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts + Fun Facts (SEO) */}
        <section className="py-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-sm font-medium text-muted-foreground/70 mb-4 text-center">
                {t('local.quickFacts')} {content.h1}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {content.quickFacts.slice(0, 8).map((fact, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border text-xs text-muted-foreground/70"
                  >
                    <CheckCircle className="h-3 w-3 text-primary/40 flex-shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
              
              {content.funFacts.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground/60 mb-3 text-center">
                    {t('local.didYouKnow')} {area}?
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {content.funFacts.slice(0, 4).map((fact, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-card border border-border">
                        <p className="text-xs text-muted-foreground/60">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Nearby Areas */}
        <NearbyAreasSection
          currentArea={area}
          serviceSlug={serviceSlug}
          serviceName={service?.name || ""}
        />

        {/* Nearby Areas Links (SEO) */}
        {uniqueContent.nearbyAreas.length > 0 && (
          <section className="py-8 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h4 className="text-sm font-medium text-zinc-500 mb-4">
                  {service?.name} {locale === 'en' ? 'in' : 'i hela'} {area} {t('local.nearbyTitle')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueContent.nearbyAreas.map((neighbor) => (
                    <Link 
                      key={neighbor}
                      to={`${servicePrefix}/${serviceSlug}/${generateAreaSlug(neighbor)}`}
                      className="text-sm text-zinc-500 hover:text-primary transition-colors"
                    >
                      {service?.name} {neighbor}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Related Searches (SEO) */}
        <section className="py-6 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h4 className="text-xs font-medium text-zinc-600 mb-3">
                {t('local.relatedSearches')}
              </h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {uniqueContent.relatedSearches.slice(0, 8).map((search, idx) => {
                  const targetUrl = getRelatedSearchUrl(search, serviceSlug!, areaSlug!, servicePrefix);
                  return (
                    <Link 
                      key={idx} 
                      to={targetUrl}
                      className="text-xs text-zinc-600 hover:text-primary transition-colors"
                    >
                      {search}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        
        {/* Urgent Services (SEO) */}
        {uniqueContent.urgentServices.length > 0 && (
          <section className="py-6 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h4 className="text-xs font-medium text-zinc-600 mb-3">
                  {t('local.urgentHelp')} {area}:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueContent.urgentServices.map((urgent, idx) => (
                    <Link 
                      key={idx}
                      to={`${servicePrefix}/${serviceSlug}/${areaSlug}`}
                      className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded hover:text-primary transition-colors"
                    >
                      {urgent} {locale === 'en' ? 'in' : 'i'} {area}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Area Links (SEO) */}
        <ExpandableAreaLinks
          currentArea={area}
          serviceSlug={serviceSlug}
          serviceName={service?.name || ""}
        />
      </div>
    </>
  );
};

export default LocalServicePage;
