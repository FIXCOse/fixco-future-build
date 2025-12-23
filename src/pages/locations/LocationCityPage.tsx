import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Seo } from "@/components/SEO";
import { getBreadcrumbSchema } from "@/components/SEOSchemaEnhanced";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cityData, CityKey } from "@/data/cityData";
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Calendar, 
  Star, 
  ArrowRight,
  Quote,
  Briefcase
} from "lucide-react";
import { useCopy } from "@/copy/CopyProvider";
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";
import { CityHeroIllustration } from "@/components/city/CityHeroIllustration";
import { CityServicesGrid } from "@/components/city/CityServicesGrid";
import { FixcoFIcon } from "@/components/icons/FixcoFIcon";
import { Button } from "@/components/ui/button-premium";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LocationCityPageProps {
  city: CityKey;
}

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

export const LocationCityPage: React.FC<LocationCityPageProps> = ({ city }) => {
  const { locale } = useCopy();
  const data = cityData[city];
  const citySlug = city.toLowerCase();

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
      "ratingValue": "4.9",
      "reviewCount": "127",
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
        title={`Byggfirma ${city} – Fixco | ROT 50% & Start inom 24h`}
        description={data.description}
        canonicalPath={`/omraden/${citySlug}`}
        schemas={[breadcrumb, localSchema, faqSchema]}
        image={data.heroImage}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 hero-background opacity-60" />
          
          {/* Floating F Watermarks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-12 left-8 w-16 h-16 rotate-[-15deg] opacity-[0.06] animate-pulse" 
                 style={{ animationDuration: '6s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
            <div className="absolute top-8 right-16 w-24 h-24 rotate-12 opacity-[0.05] animate-pulse" 
                 style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
            <div className="absolute top-1/2 left-6 w-12 h-12 rotate-[-8deg] opacity-[0.04] animate-pulse" 
                 style={{ animationDuration: '7s', animationDelay: '2s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
            <div className="absolute top-1/3 right-8 w-20 h-20 rotate-[20deg] opacity-[0.05] animate-pulse" 
                 style={{ animationDuration: '5.5s', animationDelay: '0.5s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
            <div className="absolute bottom-12 left-20 w-20 h-20 rotate-[-25deg] opacity-[0.05] animate-pulse" 
                 style={{ animationDuration: '6.5s', animationDelay: '1.5s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
            <div className="absolute bottom-8 right-24 w-16 h-16 rotate-[8deg] opacity-[0.04] animate-pulse" 
                 style={{ animationDuration: '4.5s', animationDelay: '3s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs 
              items={[
                { name: "Hem", url: "/" },
                { name: "Områden", url: "/" },
                { name: city, url: `/omraden/${citySlug}` }
              ]}
            />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center mt-8">
              {/* Text Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    <GradientText>{data.title}</GradientText>
                  </h1>
                </motion.div>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-lg text-muted-foreground mb-8 max-w-xl"
                >
                  {data.description}
                </motion.p>
                
                {/* Trust badges */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-3 mb-8"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium text-sm border border-primary/20">
                    <Calendar className="w-4 h-4" />
                    Start inom 24h
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 font-medium text-sm border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    ROT/RUT 50%
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-400 font-medium text-sm border border-cyan-500/20">
                    <MapPin className="w-4 h-4" />
                    Resa: {data.travelFee}
                  </span>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-4"
                >
                  <Button asChild size="lg" variant="cta">
                    <Link to={locale === 'en' ? '/en/services' : '/tjanster'}>
                      Visa tjänster
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="tel:+46793350228">
                      <Phone className="w-5 h-5 mr-2" />
                      Ring 079-335 02 28
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/boka-hembesok">
                      Boka gratis hembesök
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Hero Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:block"
              >
                <CityHeroIllustration cityName={city} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <GradientText>Våra tjänster i {city}</GradientText>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Klicka på en tjänst för att se priser, förväntad tid och boka direkt i {city}.
              </p>
            </motion.div>
            
            <CityServicesGrid citySlug={citySlug} />
          </div>
        </section>

        {/* Districts Section */}
        {data.districts?.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-8" hoverEffect={false}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Vi arbetar i hela {city}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {data.districts.map((d) => (
                      <motion.span 
                        key={d} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-full bg-white/[0.08] border border-white/10 text-sm font-medium hover:bg-primary/20 hover:border-primary/30 transition-all cursor-default"
                      >
                        {d}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </section>
        )}

        {/* Cases and Testimonials */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Cases */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-8 h-full" hoverEffect={false}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold">Senaste Case från {city}</h3>
                  </div>
                  <ul className="space-y-6">
                    {data.cases.map((c, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="pb-6 border-b border-white/10 last:border-0 last:pb-0"
                      >
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {c.title}
                        </h4>
                        <p className="text-sm text-muted-foreground pl-6">{c.desc}</p>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
              
              {/* Testimonials */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-8 h-full" hoverEffect={false}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/30 to-amber-500/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold">Kundomdömen från {city}</h3>
                  </div>
                  <ul className="space-y-6">
                    {data.testimonials.map((t, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="pb-6 border-b border-white/10 last:border-0 last:pb-0"
                      >
                        <div className="flex gap-2 mb-2">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <div className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <p className="text-sm text-muted-foreground italic">{t.text}</p>
                        </div>
                        <p className="text-sm font-medium mt-2 pl-6">
                          – {t.author}
                          {t.date && <span className="text-muted-foreground ml-1">({t.date})</span>}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <GradientText>Vanliga frågor om Fixco i {city}</GradientText>
                </h2>
                <p className="text-muted-foreground">
                  Hittar du inte svaret på din fråga? Kontakta oss direkt!
                </p>
              </div>
              
              <GlassCard className="p-6 md:p-8" hoverEffect={false}>
                <Accordion type="single" collapsible className="w-full">
                  {data.faqs.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-white/10">
                      <AccordionTrigger className="text-left hover:text-primary transition-colors py-4">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-violet-500/20" />
          
          {/* Floating F Watermarks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-10 w-32 h-32 rotate-[-20deg] opacity-[0.08] animate-pulse" 
                 style={{ animationDuration: '5s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
            <div className="absolute bottom-1/4 right-10 w-40 h-40 rotate-[15deg] opacity-[0.06] animate-pulse" 
                 style={{ animationDuration: '6s', animationDelay: '1s' }}>
              <FixcoFIcon className="w-full h-full" disableFilter />
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <GradientText>Redo att komma igång?</GradientText>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Kontakta oss idag för en kostnadsfri offert. Vi återkommer inom 24 timmar.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="cta">
                  <a href="tel:+46793350228">
                    <Phone className="w-5 h-5 mr-2" />
                    Ring 079-335 02 28
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/boka-hembesok">
                    Boka gratis hembesök
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocationCityPage;
