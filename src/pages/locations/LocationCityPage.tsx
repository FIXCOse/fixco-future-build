import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { getBreadcrumbSchema } from "@/components/SEOSchemaEnhanced";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cityData, CityKey } from "@/data/cityData";
import { getAreaActivity, getAreaReviews, TestimonialData } from "@/data/areaActivityData";
import { AreaKey, STOCKHOLM_AREAS, UPPSALA_AREAS, generateAreaSlug } from "@/data/localServiceData";
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Star, 
  ArrowRight,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { useCopy } from "@/copy/CopyProvider";
import GradientButton from "@/components/GradientButton";
import { CityServicesGrid } from "@/components/city/CityServicesGrid";
import { CityStatsBar } from "@/components/city/CityStatsBar";
import { CityAreasTabs } from "@/components/city/CityAreasTabs";
import { TestimonialCarouselLocal } from "@/components/local-service/TestimonialCarouselLocal";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logoFixco from "@/assets/fixco-logo-white.png";

interface LocationCityPageProps {
  city: CityKey;
}

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

const uppsalaAreas = [
  "Uppsala", "Gottsunda", "Luthagen", "Svartbäcken", "Gränby", "Vaksala", 
  "Eriksberg", "Storvreta", "Björklinge", "Bälinge", "Gamla Uppsala", 
  "Sunnersta", "Sävja", "Ultuna", "Alsike", "Knivsta", "Vattholma", "Skyttorp", "Lövstalöt"
];

const stockholmAreas = [
  "Stockholm", "Södermalm", "Vasastan", "Östermalm", "Kungsholmen", "Norrmalm",
  "Bromma", "Huddinge", "Nacka", "Solna", "Täby", "Sundbyberg", "Lidingö",
  "Sollentuna", "Danderyd", "Järfälla", "Botkyrka", "Haninge", "Tyresö", "Värmdö"
];

const cityGradients: Record<string, string> = {
  Uppsala: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 25%, #3b82f6 50%, #1d4ed8 75%, #1e3a5f 100%)',
  Stockholm: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #1e293b 75%, #0f172a 100%)',
};

export const LocationCityPage: React.FC<LocationCityPageProps> = ({ city }) => {
  const { locale } = useCopy();
  const data = cityData[city];
  const citySlug = city.toLowerCase();
  const cityAreas = city === "Uppsala" ? uppsalaAreas : stockholmAreas;

  const aggregatedStats = useMemo(() => {
    let totalProjects = 0;
    let totalReviews = 0;
    let totalWorkers = 0;
    let ratingSum = 0;
    let ratingCount = 0;

    cityAreas.forEach(area => {
      const activity = getAreaActivity(area as AreaKey);
      totalProjects += activity.recentProjects;
      totalReviews += activity.reviewCount;
      totalWorkers = Math.max(totalWorkers, activity.activeWorkers);
      ratingSum += activity.avgRating;
      ratingCount++;
    });

    return {
      totalProjects,
      totalReviews,
      activeWorkers: totalWorkers,
      avgRating: ratingSum / ratingCount,
    };
  }, [cityAreas]);

  const allTestimonials = useMemo(() => {
    const reviews: TestimonialData[] = [];
    const services = ["Elektriker", "VVS", "Snickeri", "Målare", "Montering"];
    
    cityAreas.forEach((area, areaIdx) => {
      const service = services[areaIdx % services.length];
      const areaReviews = getAreaReviews(area, service, 2);
      reviews.push(...areaReviews);
    });

    return reviews.sort(() => Math.random() - 0.5).slice(0, 20);
  }, [cityAreas]);

  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem", url: "/" },
    { name: "Områden", url: "/" },
    { name: city, url: `/omraden/${citySlug}` },
  ]);

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `https://fixco.se/omraden/${citySlug}#service`,
    "inLanguage": "sv-SE",
    "name": `Fixco – ${city}`,
    "url": `https://fixco.se/omraden/${citySlug}`,
    "provider": { "@id": "https://fixco.se/#org" },
    "areaServed": { "@type": "AdministrativeArea", "name": `${city} kommun` },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.coordinates.lat,
      "longitude": data.coordinates.lng
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregatedStats.avgRating.toFixed(1),
      "reviewCount": aggregatedStats.totalReviews.toString(),
      "bestRating": "5"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "sv-SE",
    "mainEntity": data.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <>
      <Seo
        title={`Byggfirma ${city} – Fixco | ROT 30% & Start inom 24h`}
        description={data.description}
        canonicalPath={`/omraden/${citySlug}`}
        schemas={[breadcrumb, localSchema, faqSchema]}
        image={data.heroImage}
      />
      
      <div className="min-h-screen">
        <Breadcrumbs />

        {/* ============================================
            1. HERO — Centered, conversion-focused
            ============================================ */}
        <section className="relative w-full overflow-hidden">
          <div 
            className="absolute inset-0 animate-gradient-shift" 
            style={{ 
              backgroundImage: cityGradients[city] || cityGradients.Stockholm,
              backgroundSize: '200% 200%'
            }}
          />
          
          {/* Glow Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-72 h-72 opacity-30 blur-3xl rounded-full animate-float-slow" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-25 blur-3xl rounded-full animate-float-medium" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
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
              {/* Stars */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-1">
                <span className="text-sm text-white/90 tracking-wide">{aggregatedStats.avgRating.toFixed(1)}</span>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
                <span className="text-sm text-white/70 ml-1">({aggregatedStats.totalReviews}+ omdömen)</span>
              </motion.div>

              {/* H1 */}
              <motion.h1 
                variants={itemVariants}
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center leading-tight"
              >
                {data.title}
              </motion.h1>
              
              {/* Value prop */}
              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 text-center max-w-3xl leading-relaxed"
              >
                {data.description}
              </motion.p>
              
              {/* CTA buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center mt-2"
              >
                <GradientButton 
                  className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
                  onClick={() => openServiceRequestModal({ showCategories: true })}
                >
                  Begär offert
                </GradientButton>
                <GradientButton 
                  className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5" 
                  href={locale === 'en' ? '/en/services' : '/tjanster'}
                >
                  Visa tjänster
                </GradientButton>
              </motion.div>

              {/* Trust badges */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-3 mt-2"
              >
                {[
                  'Start inom 24h',
                  'ROT/RUT 30%',
                  `Resa: ${data.travelFee}`,
                  'Fast pris',
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

        {/* ============================================
            2. SERVICES
            ============================================ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Tjänster
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Våra tjänster i <span className="text-primary">{city}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Klicka på en tjänst för att se priser, förväntad tid och boka direkt i {city}.
              </p>
            </motion.div>
            
            <CityServicesGrid citySlug={citySlug} />
          </div>
        </section>

        {/* ============================================
            3. TESTIMONIALS
            ============================================ */}
        <section className="py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
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
                  Omdömen
                </span>
                <h2 className="text-2xl font-bold text-foreground">
                  Vad kunder i <span className="text-primary">{city}</span> säger
                </h2>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <TestimonialCarouselLocal testimonials={allTestimonials} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            4. STATS
            ============================================ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                Statistik
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Fixco i <span className="text-primary">{city}-regionen</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sammanställd statistik från alla {cityAreas.length} orter vi arbetar i.
              </p>
            </motion.div>
            
            <CityStatsBar stats={aggregatedStats} cityName={city} />
          </div>
        </section>

        {/* ============================================
            5. AREAS TABS
            ============================================ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-muted/30" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Områden i {city}
                </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Klicka på ett område för att se våra tjänster och priser specifikt för den orten.
              </p>
            </motion.div>
            
            <CityAreasTabs cityName={city} areas={cityAreas} />
          </div>
        </section>

        {/* ============================================
            6. CASES
            ============================================ */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Senaste case från {city}
                </h2>
              </div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.cases.map((c, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/20 transition-all">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            7. FAQ
            ============================================ */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-muted/30" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  FAQ
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Vanliga frågor om Fixco i <span className="text-primary">{city}</span>
                </h2>
                <p className="text-muted-foreground">
                  Hittar du inte svaret på din fråga? Kontakta oss direkt!
                </p>
              </div>
              
              <Accordion type="single" collapsible className="w-full space-y-3">
                {data.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/20 transition-colors">
                    <AccordionTrigger className="text-left hover:text-primary transition-colors py-4">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* ============================================
            8. FINAL CTA
            ============================================ */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
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
                    Redo att komma igång i <span className="text-primary">{city}</span>?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Kontakta oss idag för en kostnadsfri offert. Vi återkommer inom 24 timmar.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <GradientButton 
                      onClick={() => openServiceRequestModal({ showCategories: true })}
                    >
                      Begär offert
                    </GradientButton>
                    <GradientButton href={locale === 'en' ? '/en/services' : '/tjanster'}>
                      Visa tjänster
                    </GradientButton>
                  </div>
                  
                  {/* Quick area links */}
                  <div className="pt-8 mt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">Populära områden:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(city === "Uppsala" ? UPPSALA_AREAS : STOCKHOLM_AREAS).slice(0, 8).map((area) => {
                        const areaSlug = generateAreaSlug(area);
                        return (
                          <Link
                            key={area}
                            to={`/tjanster/snickare/${areaSlug}`}
                            className="px-3 py-1.5 rounded-full bg-muted border border-border text-sm hover:bg-primary/10 hover:border-primary/30 transition-all"
                          >
                            {area}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocationCityPage;
