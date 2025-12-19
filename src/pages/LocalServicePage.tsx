import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button-premium";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  Zap
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
  
  // Generera schema.org markup
  const localBusinessSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `Fixco ${content.h1}`,
    "description": content.description,
    "url": `https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`,
    "telephone": "+46-10-123-45-67",
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
      "ratingValue": "4.8",
      "reviewCount": "247"
    }
  }), [content, serviceSlug, areaSlug, area, metadata]);
  
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
      </Helmet>

      <div className="min-h-screen">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-background opacity-50" />
          
          {/* F Watermark */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute top-20 right-20 w-16 h-16 rotate-12 animate-pulse" style={{ animationDuration: '4s' }}>
              <FixcoFIcon className="w-full h-full opacity-35" />
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Icon + H1 */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 gradient-primary-subtle rounded-xl flex items-center justify-center mr-6 relative">
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <FixcoFIcon className="h-3 w-3" />
                  </div>
                  <IconComponent className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                    {content.h1}
                  </h1>
                </div>
              </div>
              
              {/* Intro text med markering */}
              <div className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-left prose prose-slate dark:prose-invert"
                   dangerouslySetInnerHTML={{ __html: content.intro.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\n\n/g, '</p><p class="mt-4">') }} 
              />
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  <span>Ansvarsförsäkrade i {area}</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  <span>4.8/5 på Trustpilot</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Start inom 24-48h i {area}</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <BadgeCheck className="h-4 w-4" />
                  <span>50% {service?.rotRut}-avdrag</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  Begär offert i {area}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = 'tel:010-123 45 67'}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Ring oss: 010-123 45 67
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Din lokala X i Y Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">{content.localSection.title}</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ 
                     __html: content.localSection.content
                       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                       .replace(/\n\n/g, '</p><p class="mt-4">')
                       .replace(/- (.*?)(?=\n|$)/g, '<li class="flex items-start gap-2"><span class="text-primary mt-1">✓</span><span>$1</span></li>')
                       .replace(/(<li.*?<\/li>\s*)+/g, '<ul class="list-none space-y-2 my-4">$&</ul>')
                   }} 
              />
            </div>
          </div>
        </section>

        {/* Tjänster Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">{content.servicesSection.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.servicesSection.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROT/RUT Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">{content.rotRutSection.title}</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ 
                     __html: content.rotRutSection.content
                       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                       .replace(/\n\n/g, '</p><p class="mt-4">')
                       .replace(/(\d\. .*?)(?=\n|$)/g, '<li>$1</li>')
                       .replace(/(<li>.*?<\/li>\s*)+/g, '<ol class="list-decimal list-inside space-y-2 my-4">$&</ol>')
                   }} 
              />
            </div>
          </div>
        </section>

        {/* Kontakta våra X i Y - Grid med alla orter */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">{content.ctaSection.title}</h2>
            <div className="max-w-3xl mx-auto text-center mb-12"
                 dangerouslySetInnerHTML={{ 
                   __html: content.ctaSection.content
                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                     .replace(/\n\n/g, '</p><p class="mt-4">')
                 }} 
            />
            
            {/* Stockholm-regionen */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {service?.name} i Stockholmsområdet
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {stockholmAreasForLinks.map((linkedArea) => (
                  <Link
                    key={linkedArea}
                    to={`/tjanster/${serviceSlug}/${generateAreaSlug(linkedArea)}`}
                    className="flex items-center justify-between bg-card border rounded-lg px-3 py-2 hover:border-primary hover:bg-primary/5 transition-all text-sm group"
                  >
                    <span>{service?.name} {linkedArea}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Uppsala-regionen */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {service?.name} i Uppsalaområdet
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {uppsalaAreasForLinks.map((linkedArea) => (
                  <Link
                    key={linkedArea}
                    to={`/tjanster/${serviceSlug}/${generateAreaSlug(linkedArea)}`}
                    className="flex items-center justify-between bg-card border rounded-lg px-3 py-2 hover:border-primary hover:bg-primary/5 transition-all text-sm group"
                  >
                    <span>{service?.name} {linkedArea}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Snabbfakta: {content.h1}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {content.quickFacts.map((fact, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-card border rounded-lg p-3">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Vanliga frågor om {service?.name?.toLowerCase()} i {area}</h2>
              <Accordion type="single" collapsible className="w-full">
                {content.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-primary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Hitta och anlita bästa {service?.name?.toLowerCase()} i {area}?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fixco hjälper dig hitta rätt {service?.name?.toLowerCase()} i {area}. 
                Få ett fast pris med 50% {service?.rotRut}-avdrag idag!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  asChild
                >
                  <Link to="/tjanster">
                    Alla tjänster
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Andra tjänster i området */}
        <section className="py-12 bg-background border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Andra tjänster i {area}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
              {LOCAL_SERVICES.filter(s => s.slug !== serviceSlug).map((otherService) => (
                <Link
                  key={otherService.slug}
                  to={`/tjanster/${otherService.slug}/${areaSlug}`}
                  className="flex items-center justify-center bg-card border rounded-lg px-3 py-3 hover:border-primary hover:bg-primary/5 transition-all text-sm text-center group"
                >
                  <span>{otherService.name} {area}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocalServicePage;
