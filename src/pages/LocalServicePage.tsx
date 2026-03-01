import { useParams, Link } from "react-router-dom";
import { getGradientForService } from "@/utils/serviceGradients";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button-premium";
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
import { getAreaActivity, getAreaReview, getRandomReviewer, getHowToSteps, getAreaReviews } from "@/data/areaActivityData";
import { GradientText } from "@/components/v2/GradientText";
import { CompactTrustBar } from "@/components/local-service/CompactTrustBar";
import { TestimonialCarouselLocal } from "@/components/local-service/TestimonialCarouselLocal";
import { NearbyAreasSection } from "@/components/local-service/NearbyAreasSection";
import { ExpandableAreaLinks } from "@/components/local-service/ExpandableAreaLinks";
import { 
  getAuthorSchema, 
  getSpeakableSchema, 
  getOrganizationSchema,
  getReviewSchema
} from "@/components/SEOSchemaEnhanced";

// Action section images — used as hero backgrounds for services that have them
import carpenterImage from "@/assets/carpenter-team-action.png";
import painterImage from "@/assets/malare-malar-vardagsrum.webp";
import plumberImage from "@/assets/vvs-tekniker-badrum.webp";
import electricianImage from "@/assets/elektriker-elinstallation.webp";
import gardenImage from "@/assets/tradgard-plantering.webp";
import groundworkImage from "@/assets/markarbeten-gravmaskiner.webp";

const serviceHeroImages: Record<string, string> = {
  snickare: carpenterImage,
  malare: painterImage,
  vvs: plumberImage,
  el: electricianImage,
  tradgard: gardenImage,
  markarbeten: groundworkImage,
};

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

const LocalServicePage = () => {
  const { serviceSlug, areaSlug } = useParams<{ serviceSlug: string; areaSlug: string }>();
  const { locale, t } = useCopy();
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

  const heroImage = (serviceSlug && serviceHeroImages[serviceSlug]) || null;

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
            HERO SECTION — Full-width image or clean gradient
            ============================================ */}
        <section className="relative overflow-hidden">
          {/* Background: action image OR gradient */}
          {heroImage ? (
            <>
              <img
                src={heroImage}
                alt={`Fixco ${service?.name?.toLowerCase()} i ${area}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />
            </>
          ) : (
            <div className="absolute inset-0 bg-muted/30" />
          )}

          <div className="container mx-auto px-4 relative z-10 pt-12 pb-16 lg:pt-20 lg:pb-28">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-3xl"
            >
              {/* Location badge */}
              <motion.div variants={itemVariants} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border backdrop-blur-sm text-sm text-foreground/90">
                  <MapPin className="h-4 w-4 text-primary" />
                  {t('local.heroBadge')} {area}
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1 
                variants={itemVariants}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-5 text-foreground"
              >
                <GradientText gradient="rainbow">{content.h1}</GradientText>
              </motion.h1>
              
              {/* Intro text */}
              <motion.p 
                variants={itemVariants}
                className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl hero-description"
              >
                {t('local.heroIntro')} {service?.name?.toLowerCase()} {locale === 'en' ? 'in' : 'i'} {area}. 
                {locale === 'en' ? 'Fixed price, insured contractors and' : 'Fast pris, försäkrade hantverkare och'} {service?.rotRut}{t('local.rotDeduction')}.
              </motion.p>
              
              {/* Trust badges */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-3 mb-8"
              >
                {[
                  { icon: Star, text: `${areaActivity.avgRating.toFixed(1)}/5`, color: "text-amber-400" },
                  { icon: BadgeCheck, text: `30% ${service?.rotRut}`, color: "text-emerald-400" },
                  { icon: Clock, text: t('local.response2h'), color: "text-blue-400" },
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm backdrop-blur-sm">
                    <badge.icon className={`h-4 w-4 ${badge.color}`} />
                    <span className="text-foreground/80">{badge.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button 
                  size="lg"
                  className="shadow-xl shadow-primary/25"
                  onClick={() => {
                    openServiceRequestModal({
                      serviceSlug: service?.serviceKey || serviceSlug,
                      prefill: { service_name: content.h1 }
                    });
                  }}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  {t('local.ctaQuote')}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-border hover:bg-muted"
                  onClick={() => window.location.href = 'tel:+46793350228'}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  079-335 02 28
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Compact Trust Bar */}
        <CompactTrustBar 
          rating={areaActivity.avgRating}
          area={area}
          rotRut={service?.rotRut || "ROT"}
        />

        {/* ============================================
            SEO SECTION 1: Vanliga projekt i {ort}
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('local.demandBadge')} {area}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {locale === 'en' ? 'Common' : 'Vanliga'} <span className="text-primary">{service?.name?.toLowerCase()}</span>{t('local.commonProjects')} {area}
                </h2>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {uniqueContent.popularSearches.map((search, idx) => (
                  <motion.div
                    key={`search-${idx}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                  >
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm capitalize">{search} {locale === 'en' ? 'in' : 'i'} {area}</span>
                  </motion.div>
                ))}
                {uniqueContent.projectExamples.map((project, idx) => (
                  <motion.div
                    key={`project-${idx}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-amber-500/30 transition-all"
                  >
                    <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span className="text-sm capitalize">{project}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Local Tip */}
              <motion.div 
                variants={itemVariants}
                className="mt-8 p-5 bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] rounded-xl border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">{t('local.tipsFor')} {service?.name?.toLowerCase()} {locale === 'en' ? 'in' : 'i'} {area}</h4>
                    <p className="text-sm text-muted-foreground">{uniqueContent.localTip}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            SEO SECTION: Om {tjänst} i {ort}
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  {t('local.aboutServiceIn')} <span className="text-primary">{service?.name?.toLowerCase()}</span> {locale === 'en' ? 'in' : 'i'} {area}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {uniqueContent.uniqueIntro}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>


        {/* ============================================
            HOW TO BOOK - Warmer Timeline
            ============================================ */}
        <section className="py-20 relative overflow-hidden">
          {/* Warm gradient background */}
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
                  {/* Connecting line - desktop */}
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
                        {/* Step number - floating above */}
                        <div className="flex justify-center mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.bg} ${colors.border} border-2 flex items-center justify-center font-bold text-lg ${colors.text} shadow-lg group-hover:scale-110 transition-transform`}>
                            {idx + 1}
                          </div>
                        </div>
                        
                        {/* Card */}
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
            NEARBY AREAS - For easy navigation
            ============================================ */}
        <NearbyAreasSection
          currentArea={area}
          serviceSlug={serviceSlug}
          serviceName={service?.name || ""}
        />

        {/* ============================================
            SERVICES SECTION - Larger Clickable Cards
            ============================================ */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          
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
            ROT/RUT SECTION - Green/Teal Highlight Box
            ============================================ */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left - Icon/visual */}
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
                
                {/* Right - Content */}
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
            TESTIMONIAL SECTION - Carousel with Multiple Reviews
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
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
            COMBINED FACTS SECTION - Quick Facts + Fun Facts
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
              {/* Quick Facts */}
              <motion.div variants={itemVariants} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
                  {t('local.quickFacts')} <span className="text-primary">{content.h1}</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {content.quickFacts.slice(0, 8).map((fact, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{fact}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Fun Facts */}
              {content.funFacts.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-6 justify-center">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    <h3 className="text-xl font-semibold text-foreground">{t('local.didYouKnow')} {area}?</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.funFacts.slice(0, 4).map((fact, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-xl bg-gradient-to-br from-amber-500/[0.06] to-amber-500/[0.02] border border-amber-500/10"
                      >
                        <p className="text-sm text-foreground/80">{fact}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ============================================
            FAQ SECTION - Includes Myths
            ============================================ */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('local.faq')}
                </span>
                <h2 className="text-3xl font-bold text-foreground">
                  {t('local.faqTitle')} <span className="text-primary">{service?.name?.toLowerCase()}</span> {locale === 'en' ? 'in' : 'i'} {area}
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

        {/* ============================================
            OTHER SERVICES IN AREA
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
            FINAL CTA
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
                    <Button 
                      size="lg"
                      className="shadow-xl shadow-primary/30"
                      onClick={() => {
                        openServiceRequestModal({
                          serviceSlug: service?.serviceKey || serviceSlug,
                          prefill: { service_name: content.h1 }
                        });
                      }}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      {t('local.ctaQuote')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-border hover:bg-muted"
                      asChild
                    >
                      <Link to={servicePrefix}>
                        {t('local.allServices')}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            SEO ZONE - Discrete sections for search engines
            ============================================ */}
        
        {/* Nearby Areas Links */}
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
        
        {/* Related Searches */}
        <section className="py-6 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h4 className="text-xs font-medium text-zinc-600 mb-3">
                {t('local.relatedSearches')}
              </h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {uniqueContent.relatedSearches.slice(0, 8).map((search, idx) => (
                  <Link 
                    key={idx} 
                    to={`${servicePrefix}/${serviceSlug}/${areaSlug}`}
                    className="text-xs text-zinc-600 hover:text-primary transition-colors"
                  >
                    {search}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Urgent Services - now subtle */}
        {uniqueContent.urgentServices.length > 0 && (
          <section className="py-6 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h4 className="text-xs font-medium text-zinc-600 mb-3">
                  {t('local.urgentHelp')} {area}:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueContent.urgentServices.map((urgent, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                    >
                      {urgent} {locale === 'en' ? 'in' : 'i'} {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Area Links - Expandable for SEO */}
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
