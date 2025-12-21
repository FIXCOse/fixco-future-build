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
import { HeroIllustration } from "@/components/local-service/HeroIllustration";
import { CompactTrustBar } from "@/components/local-service/CompactTrustBar";
import { TestimonialCard } from "@/components/local-service/TestimonialCard";
import { NearbyAreasSection } from "@/components/local-service/NearbyAreasSection";
import { ExpandableAreaLinks } from "@/components/local-service/ExpandableAreaLinks";
import { CarpenterActionSection } from "@/components/local-service/CarpenterActionSection";
import { PainterActionSection } from "@/components/local-service/PainterActionSection";
import { PlumberActionSection } from "@/components/local-service/PlumberActionSection";
import { ElectricianActionSection } from "@/components/local-service/ElectricianActionSection";
import { GardenActionSection } from "@/components/local-service/GardenActionSection";
import { GroundworkActionSection } from "@/components/local-service/GroundworkActionSection";

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
  { bg: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400", border: "border-emerald-500/20" },
  { bg: "from-amber-500/20 to-amber-500/5", text: "text-amber-400", border: "border-amber-500/20" },
];

const LocalServicePage = () => {
  const { serviceSlug, areaSlug } = useParams<{ serviceSlug: string; areaSlug: string }>();
  
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
  
  const serviceData = servicesDataNew.find(s => s.slug === service?.serviceKey);
  const IconComponent = serviceData?.icon || Zap;
  
  const areaActivity = getAreaActivity(area);
  const howToSteps = getHowToSteps(service?.name || '', area);
  
  // Schema.org markup
  const localBusinessSchema = useMemo(() => ({
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
      "bestRating": "5"
    }
  }), [content, serviceSlug, areaSlug, area, metadata, areaActivity]);

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
  
  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
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

  // Area links are now handled by ExpandableAreaLinks component

  // Combine myths into FAQ for consolidation
  const allFaqItems = [
    ...content.faqs,
    ...content.myths.map(m => ({ q: `Myt: "${m.myth}" – stämmer det?`, a: `Nej, det är en myt. Sanningen är: ${m.truth}` }))
  ];
  
  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <link rel="canonical" href={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:url" content={`https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`} />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <div className="min-h-screen">
        <Breadcrumbs />
        
        {/* ============================================
            HERO SECTION - Split Layout with Illustration
            ============================================ */}
        <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 relative overflow-hidden">
          {/* Background - warm deep gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(260,25%,12%)] via-[hsl(250,20%,10%)] to-[hsl(240,18%,8%)]" />
          
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute -top-[20%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
              style={{ background: "linear-gradient(135deg, hsl(262 70% 55%), hsl(200 80% 50%))" }} 
            />
            <div 
              className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
              style={{ background: "hsl(340 70% 55%)" }} 
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="order-2 lg:order-1"
              >
                {/* Location badge */}
                <motion.div variants={itemVariants} className="mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/10 backdrop-blur-sm text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-foreground/80">Lokala hantverkare i {area}</span>
                  </span>
                </motion.div>

                {/* H1 with icon */}
                <motion.div variants={itemVariants} className="flex items-start gap-4 mb-6">
                  <div className="hidden sm:flex relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <FixcoFIcon className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    <GradientText gradient="rainbow">{content.h1}</GradientText>
                  </h1>
                </motion.div>
                
                {/* Intro text - shorter for hero */}
                <motion.p 
                  variants={itemVariants}
                  className="text-lg text-muted-foreground mb-8 max-w-lg"
                >
                  Hitta kvalificerade {service?.name?.toLowerCase()} i {area}. 
                  Fast pris, försäkrade hantverkare och {service?.rotRut}-avdrag.
                </motion.p>
                
                {/* Quick trust badges - inline */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-3 mb-8"
                >
                  {[
                    { icon: Star, text: `${areaActivity.avgRating.toFixed(1)}/5`, color: "text-amber-400" },
                    { icon: BadgeCheck, text: `50% ${service?.rotRut}`, color: "text-emerald-400" },
                    { icon: Clock, text: "Svar 2h", color: "text-blue-400" },
                  ].map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-sm">
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
                    Begär gratis offert
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/20 hover:bg-white/5"
                    onClick={() => window.location.href = 'tel:+46793350228'}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    079-335 02 28
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Right Column - Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <HeroIllustration serviceIcon={IconComponent} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Service Action Sections - Conditional by service type */}
        {serviceSlug === "snickare" && (
          <CarpenterActionSection area={area} />
        )}
        {serviceSlug === "malare" && (
          <PainterActionSection area={area} />
        )}
        {serviceSlug === "vvs" && (
          <PlumberActionSection area={area} />
        )}
        {serviceSlug === "el" && (
          <ElectricianActionSection area={area} />
        )}
        {serviceSlug === "tradgard" && (
          <GardenActionSection area={area} />
        )}
        {serviceSlug === "markarbeten" && (
          <GroundworkActionSection area={area} />
        )}

        {/* Compact Trust Bar */}
        <CompactTrustBar 
          rating={areaActivity.avgRating}
          recentProjects={areaActivity.recentProjects}
          area={area}
          rotRut={service?.rotRut || "ROT"}
        />

        {/* ============================================
            HOW TO BOOK - Warmer Timeline
            ============================================ */}
        <section className="py-20 relative overflow-hidden">
          {/* Warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(35,15%,9%)] via-[hsl(30,12%,8%)] to-[hsl(260,12%,9%)]" />
          
          {/* Warm ambient glow */}
          <div 
            className="absolute top-0 right-[20%] w-[500px] h-[400px] opacity-40"
            style={{ background: "radial-gradient(ellipse, hsl(35 70% 50% / 0.12) 0%, transparent 60%)" }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-14">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                  4 enkla steg
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Så bokar du <GradientText>{service?.name?.toLowerCase()}</GradientText>
                </h2>
                <p className="text-muted-foreground">Från förfrågan till färdigt jobb på nolltid</p>
              </motion.div>

              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {/* Connecting line - desktop */}
                  <div className="hidden md:block absolute top-20 left-[12%] right-[12%] h-0.5">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-blue-500/40 via-emerald-500/40 to-amber-500/40" />
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
                        <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-6 text-center h-full hover:border-white/20 transition-all">
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
          <div className="absolute inset-0 bg-[hsl(240,10%,8%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">
                  {content.servicesSection.title}
                </h2>
                <p className="text-muted-foreground">Allt du behöver, samlat på ett ställe</p>
              </motion.div>
              
              <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.servicesSection.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="group cursor-default"
                  >
                    <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl p-5 h-full hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all">
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
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(165,18%,9%)] via-[hsl(180,15%,8%)] to-[hsl(200,15%,9%)]" />
          
          {/* Teal glow */}
          <div 
            className="absolute top-1/2 right-0 w-[500px] h-[400px] -translate-y-1/2 opacity-50"
            style={{ background: "radial-gradient(ellipse, hsl(165 60% 40% / 0.15) 0%, transparent 60%)" }}
          />
          
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
                      <span className="text-6xl font-bold text-emerald-400">50%</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                      {service?.rotRut}-avdrag
                    </div>
                  </div>
                </motion.div>
                
                {/* Right - Content */}
                <motion.div variants={itemVariants}>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                    Spara pengar
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {content.rotRutSection.title}
                  </h2>
                  <div 
                    className="prose prose-sm prose-slate dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: content.rotRutSection.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                        .replace(/\n\n/g, '</p><p class="mt-3">')
                    }} 
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            TESTIMONIAL SECTION - Human Touch
            ============================================ */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[hsl(240,10%,7%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Kundrecension
                </span>
                <h2 className="text-2xl font-bold">Vad våra kunder säger</h2>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <TestimonialCard 
                  quote={getAreaReview(area, service?.name || '')}
                  name={getRandomReviewer(area)}
                  location={area}
                  rating={5}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            COMBINED FACTS SECTION - Quick Facts + Fun Facts
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(260,12%,10%)] to-[hsl(240,10%,8%)]" />
          
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
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Snabbfakta: <GradientText>{content.h1}</GradientText>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {content.quickFacts.slice(0, 8).map((fact, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/5 text-sm"
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
                    <h3 className="text-xl font-semibold">Visste du detta om {area}?</h3>
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
          <div className="absolute inset-0 bg-[hsl(240,8%,7%)]" />
          
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-40"
            style={{ background: "radial-gradient(ellipse, hsl(262 60% 50% / 0.1) 0%, transparent 60%)" }}
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
                  Vanliga frågor
                </span>
                <h2 className="text-3xl font-bold">
                  FAQ om <GradientText>{service?.name?.toLowerCase()}</GradientText> i {area}
                </h2>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {allFaqItems.map((faq, idx) => (
                    <AccordionItem 
                      key={idx} 
                      value={`faq-${idx}`}
                      className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl px-6 data-[state=open]:border-primary/30 transition-all"
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
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(260,12%,10%)] to-[hsl(240,10%,8%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-10">
                <h2 className="text-2xl font-bold">
                  Fler tjänster i <GradientText>{area}</GradientText>
                </h2>
              </motion.div>
              
              <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {LOCAL_SERVICES.filter(s => s.slug !== serviceSlug).map((otherService) => {
                  const OtherIcon = servicesDataNew.find(s => s.slug === otherService.serviceKey)?.icon || Zap;
                  return (
                    <motion.div key={otherService.slug} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }}>
                      <Link 
                        to={`/tjanster/${otherService.slug}/${areaSlug}`}
                        className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-primary/5 hover:border-primary/30 transition-all group text-center"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <OtherIcon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{otherService.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            FINAL CTA
            ============================================ */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(260,15%,10%)] to-[hsl(240,12%,6%)]" />
          
          {/* Strong glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[100px] opacity-30"
              style={{ background: "linear-gradient(135deg, hsl(262 70% 55%), hsl(200 80% 50%))" }} 
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="max-w-2xl mx-auto text-center">
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl p-10 md:p-14 shadow-2xl shadow-primary/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Redo att boka <GradientText>{service?.name?.toLowerCase()}</GradientText>?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Få ett fast pris från lokala hantverkare i {area} – med 50% {service?.rotRut}-avdrag.
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
                      Begär gratis offert
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white/20 hover:bg-white/5"
                      asChild
                    >
                      <Link to="/tjanster">
                        Alla tjänster
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
            AREA LINKS - For SEO (Expandable)
            ============================================ */}
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
