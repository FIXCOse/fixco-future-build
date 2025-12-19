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
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group"
    >
      <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-6 text-center shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <div className="text-4xl md:text-5xl font-bold mb-2">
          <GradientText>{value}{suffix}</GradientText>
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
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
        
        {/* Hero Section - Warm Premium Design */}
        <section className="pt-16 pb-24 relative overflow-hidden">
          {/* Warmer, deeper gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(250,25%,14%)] via-[hsl(240,18%,11%)] to-[hsl(220,20%,9%)]" />
          
          {/* Large, soft top glow - creates focal point */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px]"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, hsl(262 70% 55% / 0.25) 0%, hsl(200 80% 50% / 0.08) 40%, transparent 70%)"
            }}
          />
          
          {/* Warm accent orbs - more visible and colorful */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-[15%] left-[15%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
              style={{ background: "hsl(262 80% 60%)" }} 
            />
            <div 
              className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
              style={{ background: "hsl(200 90% 55%)" }} 
            />
            <div 
              className="absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-15"
              style={{ background: "hsl(340 80% 60%)" }} 
            />
          </div>
          
          {/* Subtle warm noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Location badge - warm glassmorphism */}
              <motion.div variants={badgeVariants} className="mb-8">
                <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-white/[0.12] to-white/[0.04] border border-white/20 backdrop-blur-xl text-sm font-medium shadow-2xl shadow-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Lokala hantverkare i {area}</span>
                </span>
              </motion.div>

              {/* Icon + H1 */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-xl shadow-primary/20">
                    <IconComponent className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
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
              
              {/* Trust badges - Enhanced with hover effects */}
              <motion.div 
                variants={containerVariants}
                className="flex flex-wrap justify-center gap-4 mb-10"
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
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
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
                  className="shadow-xl shadow-primary/30"
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
                  className="border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                  onClick={() => window.location.href = 'tel:+46793350228'}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Ring oss: 079-335 02 28
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Gradient separator with glow */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute inset-x-1/4 h-8 -top-4 bg-primary/10 blur-2xl" />
        </div>

        {/* Aktivitet i orten - Premium Stats Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Lighter background with warm accent */}
          <div className="absolute inset-0 bg-[hsl(240,12%,10%)]" />
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, hsl(262 60% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(200 80% 50% / 0.05) 0%, transparent 40%)"
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-14">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Live statistik
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <GradientText>Fixco i {area}</GradientText> just nu
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">Se vår aktivitet och tillgänglighet i ditt område</p>
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

        {/* Warm gradient separator */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>

        {/* Så bokar du - Warm Timeline Design */}
        <section className="py-24 relative overflow-hidden">
          {/* Warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(30,15%,10%)] via-[hsl(240,10%,9%)] to-[hsl(260,15%,10%)]" />
          
          {/* Warm ambient light */}
          <div 
            className="absolute top-0 right-0 w-[600px] h-[400px]"
            style={{
              background: "radial-gradient(ellipse, hsl(30 80% 50% / 0.08) 0%, transparent 60%)"
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-[500px] h-[300px]"
            style={{
              background: "radial-gradient(ellipse, hsl(262 70% 55% / 0.06) 0%, transparent 60%)"
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
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                  Så enkelt är det
                </span>
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
                  <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-amber-500/30 via-primary to-primary/30" />
                  
                  {howToSteps.map((step, idx) => {
                    const StepIcon = stepIcons[idx] || CheckCircle;
                    return (
                      <motion.div 
                        key={idx} 
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="relative group"
                      >
                        {/* Step number badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            {idx + 1}
                          </div>
                        </div>
                        
                        {/* Enhanced card with depth */}
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl pt-10 pb-6 px-6 text-center h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
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

        {/* Cyan accent separator */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>

        {/* Din lokala X i Y Section - Clean neutral */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-[hsl(240,8%,8%)]" />
          <div className="container mx-auto px-4 relative z-10">
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
                className="prose prose-slate dark:prose-invert max-w-none bg-gradient-to-br from-white/[0.04] to-transparent p-8 rounded-2xl border border-white/5"
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

        {/* Tjänster Section - Premium with depth */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(240,10%,11%)] via-[hsl(250,12%,12%)] to-[hsl(240,10%,10%)]" />
          {/* Subtle accent */}
          <div 
            className="absolute top-1/2 left-0 w-[400px] h-[300px] -translate-y-1/2"
            style={{ background: "radial-gradient(ellipse, hsl(262 60% 50% / 0.06) 0%, transparent 60%)" }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-10 text-center">
                {content.servicesSection.title}
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.servicesSection.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ x: 6, scale: 1.01 }}
                    className="flex items-center gap-4 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ROT/RUT Section - Green/Teal accent */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(160,20%,10%)] via-[hsl(180,15%,9%)] to-[hsl(200,15%,10%)]" />
          {/* Teal glow */}
          <div 
            className="absolute top-1/2 right-0 w-[500px] h-[400px] -translate-y-1/2"
            style={{ background: "radial-gradient(ellipse, hsl(160 60% 40% / 0.1) 0%, transparent 60%)" }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                  Spara pengar
                </span>
                <h2 className="text-3xl font-bold">
                  {content.rotRutSection.title}
                </h2>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="prose prose-slate dark:prose-invert max-w-none bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-8 rounded-2xl border border-emerald-500/10"
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
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-[hsl(240,8%,8%)]" />
          <div className="container mx-auto px-4 relative z-10">
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
                className="max-w-3xl mx-auto text-center mb-12 text-muted-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: content.ctaSection.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
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
                      className="flex items-center justify-between bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-lg px-3 py-2.5 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm group"
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
                      className="flex items-center justify-between bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-lg px-3 py-2.5 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm group"
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

        {/* Purple separator */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* Fler tjänster i orten - Premium Service Cards */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(260,15%,11%)] to-[hsl(240,10%,9%)]" />
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]"
            style={{ background: "radial-gradient(ellipse, hsl(262 60% 50% / 0.06) 0%, transparent 60%)" }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8 text-center">
                Fler tjänster i <GradientText>{area}</GradientText>
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {LOCAL_SERVICES.filter(s => s.slug !== serviceSlug).map((otherService, idx) => {
                  const OtherIcon = servicesDataNew.find(s => s.slug === otherService.serviceKey)?.icon || Zap;
                  return (
                    <motion.div key={otherService.slug} variants={itemVariants} whileHover={{ y: -4 }}>
                      <Link 
                        to={`/tjanster/${otherService.slug}/${areaSlug}`}
                        className="flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group text-center"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <OtherIcon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{otherService.name}</span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Facts - Enhanced with depth */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[hsl(240,8%,8%)]" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8 text-center">
                Snabbfakta: <GradientText>{content.h1}</GradientText>
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {content.quickFacts.map((fact, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{fact}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Visste du detta om [Ort] - Warm Fun Facts */}
        {content.funFacts.length > 0 && (
          <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(35,20%,10%)] via-[hsl(30,15%,9%)] to-[hsl(40,15%,8%)]" />
            {/* Warm glow */}
            <div 
              className="absolute top-0 left-1/3 w-[500px] h-[300px]"
              style={{ background: "radial-gradient(ellipse, hsl(35 70% 50% / 0.08) 0%, transparent 60%)" }}
            />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div 
                className="max-w-4xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                    Lokalt
                  </span>
                  <h2 className="text-2xl font-bold">
                    Visste du detta om <GradientText>{area}</GradientText>?
                  </h2>
                </motion.div>
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.funFacts.map((fact, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="bg-gradient-to-br from-amber-500/[0.08] to-amber-500/[0.02] border border-amber-500/10 rounded-2xl p-6 h-full hover:border-amber-500/20 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="h-5 w-5 text-amber-400" />
                          </div>
                          <span className="text-sm leading-relaxed text-foreground/90">{fact}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Myter om tjänsten - Enhanced Design */}
        {content.myths.length > 0 && (
          <section className="py-16 relative">
            <div className="absolute inset-0 bg-[hsl(240,8%,8%)]" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8 text-center">
                  Myter om {service?.name?.toLowerCase()} – sant eller falskt?
                </motion.h2>
                <motion.div variants={containerVariants} className="space-y-4">
                  {content.myths.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-primary/20 transition-colors">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                            <XCircle className="h-4 w-4 text-destructive" />
                          </div>
                          <span className="font-medium text-destructive">Myt: &quot;{item.myth}&quot;</span>
                        </div>
                        <div className="flex items-start gap-3 pl-11">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
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

        {/* FAQ Section - Premium Accordion */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(260,15%,11%)] via-[hsl(250,12%,10%)] to-[hsl(240,10%,9%)]" />
          {/* Subtle glow */}
          <div 
            className="absolute bottom-0 right-0 w-[500px] h-[400px]"
            style={{ background: "radial-gradient(ellipse, hsl(262 60% 50% / 0.06) 0%, transparent 60%)" }}
          />
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
                  FAQ
                </span>
                <h2 className="text-3xl font-bold">
                  Vanliga frågor om <GradientText>{service?.name?.toLowerCase()}</GradientText> i {area}
                </h2>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {content.faqs.map((faq, idx) => (
                    <AccordionItem 
                      key={idx} 
                      value={`faq-${idx}`}
                      className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 rounded-xl px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5 transition-all"
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

        {/* Final CTA - Premium with strong glow */}
        <section className="py-24 relative overflow-hidden">
          {/* Strong ambient glows */}
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(260,15%,10%)] to-[hsl(240,10%,7%)]" />
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-25"
              style={{ background: "hsl(262 80% 55%)" }} 
            />
            <div 
              className="absolute top-1/3 right-1/4 w-[400px] h-[300px] rounded-full blur-[80px] opacity-15"
              style={{ background: "hsl(200 90% 55%)" }} 
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="max-w-3xl mx-auto p-10 md:p-14 text-center bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl shadow-2xl shadow-primary/10">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
                  Hitta och anlita bästa <GradientText>{service?.name?.toLowerCase()}</GradientText> i {area}?
                </motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Fixco hjälper dig hitta rätt {service?.name?.toLowerCase()} i {area}. 
                  Få ett fast pris med 50% {service?.rotRut}-avdrag idag!
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
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
                    Begär gratis offert
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary/30 hover:bg-primary/10 hover:border-primary/50"
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
        <section className="py-14 relative">
          <div className="absolute inset-0 bg-[hsl(240,8%,6%)]" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8 text-center">
                Andra tjänster i {area}
              </motion.h2>
              <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {LOCAL_SERVICES.filter(s => s.slug !== serviceSlug).map((otherService) => (
                  <motion.div key={otherService.slug} variants={itemVariants} whileHover={{ y: -2 }}>
                    <Link
                      to={`/tjanster/${otherService.slug}/${areaSlug}`}
                      className="flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-lg px-3 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-center"
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
