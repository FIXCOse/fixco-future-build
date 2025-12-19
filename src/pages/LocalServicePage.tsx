import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button-premium";
import Breadcrumbs from "@/components/Breadcrumbs";
import { motion } from "framer-motion";
import { 
  Phone, 
  FileText, 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Users,
  BadgeCheck,
  Zap,
  Lightbulb,
  XCircle,
  Calendar,
  Briefcase,
  TrendingUp
} from "lucide-react";
import { FixcoFIcon } from "@/components/icons/FixcoFIcon";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import {
  generateLocalContent,
  getAreaFromSlug,
  getServiceFromSlug,
  isValidLocalServicePage,
  generateAreaSlug,
  ALL_AREAS,
  LOCAL_SERVICES,
  STOCKHOLM_AREAS,
  UPPSALA_AREAS,
  getAreaMetadata,
  type LocalServiceSlug,
  type AreaKey
} from "@/data/localServiceData";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { servicesDataNew } from "@/data/servicesDataNew";
import { useMemo } from "react";
import { getAreaActivity, getAreaReview, getRandomReviewer, getHowToSteps } from "@/data/areaActivityData";
import { GradientText } from "@/components/v2/GradientText";
import useCountUpOnce from "@/hooks/useCountUpOnce";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }
  }
};

// Animated stat component
interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
  statKey: string;
  decimals?: number;
}

const AnimatedStat = ({ value: targetValue, suffix = "", label, icon: Icon, statKey, decimals = 0 }: AnimatedStatProps) => {
  const { value, observe } = useCountUpOnce({
    key: `local-stat-${statKey}`,
    from: 0,
    to: targetValue,
    duration: 2000,
    formatter: (val) => decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('sv-SE')
  });

  return (
    <motion.div
      ref={observe}
      variants={itemVariants}
      className="text-center"
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-bold mb-2">
        <GradientText>{value}{suffix}</GradientText>
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

const LocalServicePage = () => {
  const { serviceSlug, areaSlug } = useParams<{ serviceSlug: string; areaSlug: string }>();
  
  // Validera att kombinationen finns
  if (!serviceSlug || !areaSlug || !isValidLocalServicePage(serviceSlug, areaSlug)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sidan hittades inte</h1>
          <p className="text-muted-foreground mb-6">
            Vi kunde inte hitta den tjänst eller ort du söker.
          </p>
          <Button asChild>
            <Link to="/tjanster">Visa alla tjänster</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const area = getAreaFromSlug(areaSlug) as AreaKey;
  const service = getServiceFromSlug(serviceSlug);
  const content = generateLocalContent(serviceSlug as LocalServiceSlug, area);
  const metadata = getAreaMetadata(area);
  
  // Hämta ikon från servicesDataNew
  const serviceData = servicesDataNew.find(s => s.slug === service?.serviceKey);
  const IconComponent = serviceData?.icon || Zap;
  
  // Hämta aktivitetsdata för orten
  const areaActivity = getAreaActivity(area);
  const howToSteps = getHowToSteps(service?.name || '', area);
  
  // Generera schema.org markup
  const localBusinessSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `Fixco ${content.h1}`,
    "description": content.description,
    "url": `https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`,
    "telephone": "+46-79-335-02-28",
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": area
    },
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
      "bestRating": "5"
    },
    "review": [{
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": getRandomReviewer(area) },
      "reviewBody": getAreaReview(area, service?.name || ''),
      "datePublished": "2024-11-15"
    }]
  }), [content, serviceSlug, areaSlug, area, metadata, areaActivity, service]);

  // HowTo Schema för Google rich snippets
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

  // ContactPoint Schema
  const contactPointSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "telephone": "+46-79-335-02-28",
    "contactType": "customer service",
    "areaServed": area,
    "availableLanguage": ["Swedish", "English"],
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "18:00"
    }
  }), [area]);
  
  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }), [content.faqs]);

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

  // Hämta relaterade orter i samma region
  const relatedAreas = metadata.region === "Stockholm" 
    ? STOCKHOLM_AREAS.filter(a => a !== area).slice(0, 15)
    : UPPSALA_AREAS.filter(a => a !== area).slice(0, 15);
  
  // Hämta alla orter för intern länkning
  const stockholmAreasForLinks = STOCKHOLM_AREAS.filter(a => a !== area);
  const uppsalaAreasForLinks = UPPSALA_AREAS.filter(a => a !== area);

  const stepIcons = [FileText, Clock, Calendar, CheckCircle];
  
  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <link rel="canonical" href={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:url" content={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(contactPointSchema)}</script>
      </Helmet>

      <div className="min-h-screen">
        <Breadcrumbs />
        
        {/* Hero Section - Softer Premium Design */}
        <section className="pt-12 pb-20 relative overflow-hidden">
          {/* Softer gradient background with more color depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(258,35%,12%)] via-[hsl(240,20%,11%)] to-background" />
          
          {/* Mesh gradient overlay for more visual interest */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(at 20% 30%, hsl(262 83% 58% / 0.15) 0%, transparent 50%),
                radial-gradient(at 80% 70%, hsl(200 100% 50% / 0.1) 0%, transparent 50%),
                radial-gradient(at 50% 50%, hsl(340 80% 55% / 0.05) 0%, transparent 60%)
              `
            }}
          />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Enhanced blur-orbs with more visibility */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
              style={{ 
                background: "radial-gradient(circle, hsl(262 83% 58%) 0%, transparent 70%)",
                animationDuration: '8s'
              }} 
            />
            <div 
              className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 animate-pulse"
              style={{ 
                background: "radial-gradient(circle, hsl(200 100% 50%) 0%, transparent 70%)",
                animationDuration: '10s',
                animationDelay: '2s'
              }} 
            />
            <div 
              className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse"
              style={{ 
                background: "radial-gradient(circle, hsl(340 80% 55%) 0%, transparent 70%)",
                animationDuration: '12s',
                animationDelay: '4s'
              }} 
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Location badge - glassmorphism design */}
              <motion.div variants={badgeVariants} className="mb-6">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md text-sm font-medium shadow-lg shadow-primary/5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-foreground/90">Lokala hantverkare i {area}</span>
                </span>
              </motion.div>

              {/* Icon + H1 */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
                    <IconComponent className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                    <FixcoFIcon className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  <GradientText gradient="rainbow">{content.h1}</GradientText>
                </h1>
              </motion.div>
              
              {/* Intro text */}
              <motion.div 
                variants={itemVariants}
                className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto text-left prose prose-slate dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content.intro.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\n\n/g, '</p><p class="mt-4">') }} 
              />
              
              {/* Trust badges - Clean horizontal list */}
              <motion.div 
                variants={containerVariants}
                className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-muted-foreground"
              >
                {[
                  { icon: Shield, text: `Ansvarsförsäkrade` },
                  { icon: Star, text: `${areaActivity.avgRating.toFixed(1)}/5 betyg` },
                  { icon: Clock, text: `Start inom 24-48h` },
                  { icon: BadgeCheck, text: `50% ${service?.rotRut}-avdrag` }
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    variants={badgeVariants}
                    className="flex items-center gap-2"
                  >
                    <badge.icon className="h-4 w-4 text-primary" />
                    <span>{badge.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  size="lg"
                  className="shadow-lg shadow-primary/20"
                  onClick={() => {
                    openServiceRequestModal({
                      serviceSlug: service?.serviceKey || serviceSlug,
                      prefill: { service_name: content.h1 }
                    });
                  }}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Begär offert i {area}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/30 hover:bg-primary/10"
                  onClick={() => window.location.href = 'tel:+46793350228'}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Ring oss: 079-335 02 28
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Visual separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Aktivitet i orten - Enhanced Stats Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Subtle gradient background with color accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <GradientText>Fixco i {area}</GradientText> just nu
                </h2>
                <p className="text-muted-foreground">Se vår aktivitet och tillgänglighet i ditt område</p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <AnimatedStat
                  value={areaActivity.recentProjects}
                  label="Projekt senaste månaden"
                  icon={Briefcase}
                  statKey={`${area}-projects`}
                />
                <AnimatedStat
                  value={areaActivity.avgRating}
                  suffix="/5"
                  label={`Snittbetyg i ${area}`}
                  icon={Star}
                  statKey={`${area}-rating`}
                  decimals={1}
                />
                <AnimatedStat
                  value={areaActivity.responseTimeHours}
                  suffix="h"
                  label="Genomsnittlig svarstid"
                  icon={Clock}
                  statKey={`${area}-response`}
                />
                <AnimatedStat
                  value={areaActivity.activeWorkers}
                  label="Aktiva hantverkare"
                  icon={Users}
                  statKey={`${area}-workers`}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Visual separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {/* Så bokar du - Enhanced Timeline Design */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/50 to-surface/30" />
          {/* Subtle decorative element */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
            style={{
              background: "radial-gradient(ellipse, hsl(262 83% 58% / 0.15) 0%, transparent 70%)"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Så bokar du <GradientText>{service?.name?.toLowerCase()}</GradientText> i {area}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Det tar bara några minuter att komma igång
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
                  {/* Timeline connector - desktop only */}
                  <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                  
                  {howToSteps.map((step, idx) => {
                    const StepIcon = stepIcons[idx] || CheckCircle;
                    return (
                      <motion.div 
                        key={idx} 
                        variants={itemVariants}
                        className="relative"
                      >
                        {/* Step number badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold">
                            {idx + 1}
                          </div>
                        </div>
                        
                        {/* card-premium instead of GlassCard */}
                        <div className="card-premium pt-10 pb-6 px-6 text-center h-full hover:border-primary/30 transition-colors">
                          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                            <StepIcon className="h-7 w-7 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-2 text-lg">{step.title}</h3>
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

        {/* Visual separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Din lokala X i Y Section */}
        <section className="py-16 bg-gradient-to-b from-background to-surface/20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
                {content.localSection.title}
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: content.localSection.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p class="mt-4">')
                    .replace(/- (.*?)(?=\n|$)/g, '<li class="flex items-start gap-2"><span class="text-primary mt-1">✓</span><span>$1</span></li>')
                    .replace(/(<li.*?<\/li>\s*)+/g, '<ul class="list-none space-y-2 my-4">$&</ul>')
                }} 
              />
            </motion.div>
          </div>
        </section>

        {/* Tjänster Section - Premium Cards */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-center">
                {content.servicesSection.title}
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.servicesSection.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ROT/RUT Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
                {content.rotRutSection.title}
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: content.rotRutSection.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p class="mt-4">')
                    .replace(/(\d\. .*?)(?=\n|$)/g, '<li>$1</li>')
                    .replace(/(<li>.*?<\/li>\s*)+/g, '<ol class="list-decimal list-inside space-y-2 my-4">$&</ol>')
                }} 
              />
            </motion.div>
          </div>
        </section>

        {/* Kontakta våra X i Y - Grid med alla orter */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4 text-center">
                {content.ctaSection.title}
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="max-w-3xl mx-auto text-center mb-12"
                dangerouslySetInnerHTML={{ 
                  __html: content.ctaSection.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p class="mt-4">')
                }} 
              />
              
              {/* Stockholm-regionen */}
              <motion.div variants={itemVariants} className="mb-12">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {service?.name} i Stockholmsområdet
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {stockholmAreasForLinks.map((linkedArea) => (
                    <Link
                      key={linkedArea}
                      to={`/tjanster/${serviceSlug}/${generateAreaSlug(linkedArea)}`}
                      className="flex items-center justify-between bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 hover:border-primary hover:bg-primary/5 transition-all text-sm group"
                    >
                      <span>{service?.name} {linkedArea}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Uppsala-regionen */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {service?.name} i Uppsalaområdet
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {uppsalaAreasForLinks.map((linkedArea) => (
                    <Link
                      key={linkedArea}
                      to={`/tjanster/${serviceSlug}/${generateAreaSlug(linkedArea)}`}
                      className="flex items-center justify-between bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 hover:border-primary hover:bg-primary/5 transition-all text-sm group"
                    >
                      <span>{service?.name} {linkedArea}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Fler tjänster i orten - Premium Service Cards */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-center">
                Fler tjänster i <GradientText>{area}</GradientText>
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {LOCAL_SERVICES.filter(s => s.slug !== serviceSlug).map((otherService, idx) => {
                  const OtherIcon = servicesDataNew.find(s => s.slug === otherService.serviceKey)?.icon || Zap;
                  return (
                    <motion.div key={otherService.slug} variants={itemVariants}>
                      <Link 
                        to={`/tjanster/${otherService.slug}/${areaSlug}`}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-primary/5 hover:border-primary/50 transition-all group text-center"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <OtherIcon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{otherService.name}</span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Facts - GlassCard Design */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-center">
                Snabbfakta: <GradientText>{content.h1}</GradientText>
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {content.quickFacts.map((fact, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{fact}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Visste du detta om [Ort] - Clean Fun Facts */}
        {content.funFacts.length > 0 && (
          <section className="py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-surface/20" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div 
                className="max-w-4xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-center">
                  Visste du detta om <GradientText>{area}</GradientText>?
                </motion.h2>
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.funFacts.map((fact, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                    >
                      <div className="card-premium p-5 h-full hover:border-primary/30 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="h-5 w-5 text-amber-500" />
                          </div>
                          <span className="text-sm leading-relaxed">{fact}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Myter om tjänsten - Clean Design */}
        {content.myths.length > 0 && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-center">
                  Myter om {service?.name?.toLowerCase()} – sant eller falskt?
                </motion.h2>
                <motion.div variants={containerVariants} className="space-y-4">
                  {content.myths.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      variants={itemVariants}
                    >
                      <div className="card-premium p-6 hover:border-primary/30 transition-colors">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                            <XCircle className="h-4 w-4 text-destructive" />
                          </div>
                          <span className="font-medium text-destructive">Myt: &quot;{item.myth}&quot;</span>
                        </div>
                        <div className="flex items-start gap-3 pl-11">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-muted-foreground">Sanning: {item.truth}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQ Section - Enhanced Accordion */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-center">
                Vanliga frågor om <GradientText>{service?.name?.toLowerCase()}</GradientText> i {area}
              </motion.h2>
              <motion.div variants={itemVariants}>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {content.faqs.map((faq, idx) => (
                    <AccordionItem 
                      key={idx} 
                      value={`faq-${idx}`}
                      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-5">
                        <span className="font-medium">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA - Clean Premium Design */}
        <section className="py-20 relative overflow-hidden">
          {/* Subtle blur-orbs for CTA */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-10"
              style={{ background: "radial-gradient(circle, hsl(262 83% 58%) 0%, transparent 70%)" }} 
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="card-premium max-w-3xl mx-auto p-10 md:p-12 text-center">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
                  Hitta och anlita bästa <GradientText>{service?.name?.toLowerCase()}</GradientText> i {area}?
                </motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8">
                  Fixco hjälper dig hitta rätt {service?.name?.toLowerCase()} i {area}. 
                  Få ett fast pris med 50% {service?.rotRut}-avdrag idag!
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button 
                    size="lg"
                    onClick={() => {
                      openServiceRequestModal({
                        serviceSlug: service?.serviceKey || serviceSlug,
                        prefill: { service_name: content.h1 }
                      });
                    }}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Begär gratis offert
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary/30 hover:bg-primary/10"
                    asChild
                  >
                    <Link to="/tjanster">
                      Alla tjänster
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Andra tjänster i området - Clean footer links */}
        <section className="py-12 bg-background border-t border-border/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-center">
                Andra tjänster i {area}
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {LOCAL_SERVICES.filter(s => s.slug !== serviceSlug).map((otherService) => (
                  <motion.div key={otherService.slug} variants={itemVariants}>
                    <Link
                      to={`/tjanster/${otherService.slug}/${areaSlug}`}
                      className="flex items-center justify-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-3 hover:border-primary hover:bg-primary/5 transition-all text-sm text-center group"
                    >
                      <span>{otherService.name} {area}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocalServicePage;
