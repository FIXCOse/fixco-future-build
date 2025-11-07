import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import { usePriceStore } from "@/stores/priceStore";
import { Button } from "@/components/ui/button-premium";
import { servicesDataNew } from "@/data/servicesDataNew";
import { useServices } from "@/hooks/useServices";
import ServiceCardV3 from '@/components/ServiceCardV3';
import { useCopy } from "@/copy/CopyProvider";
import { 
  FileText,
  Phone,
  Clock,
  Shield,
  MapPin,
  Star,
  CheckCircle,
  Award,
  Lock,
  FileCheck,
  AlertCircle,
  AlertTriangle,
  Wrench,
  Zap,
  CheckCircle2,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { FixcoFIcon } from '@/components/icons/FixcoFIcon';
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import { cityData, CityKey } from "@/data/cityData";
import { serviceCityData, ServiceKey } from "@/data/serviceCityData";
import { Helmet } from "react-helmet-async";
import { 
  getOrganizationSchema, 
  getServiceSchema,
  getFAQSchema,
  getBreadcrumbSchema 
} from "@/components/SEOSchemaEnhanced";
import { generateCityServiceData } from "@/utils/cityServiceTemplates";
import { serviceCityContent } from "@/data/serviceCityContent";
import { ServiceComparisonCard } from "@/components/ServiceComparisonCard";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { HowItWorksTimeline } from '@/components/v2/HowItWorksVariants';

interface ServiceCityDetailProps {
  service: string; // slug like 'el', 'vvs', 'snickeri'
  city: CityKey;
}

const ServiceCityDetail = ({ service, city }: ServiceCityDetailProps) => {
  const { t, locale } = useCopy();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const mode = usePriceStore((state) => state.mode);

  // Determine if we're on English site
  const isEnglish = locale === 'en';
  
  // Get static service category info for UI
  const serviceData = servicesDataNew.find(s => s.slug === service);
  
  // Fetch database services with translations based on locale
  const { data: dbServices, isLoading } = useServices(locale);
  
  // Map slug to category name for filtering
  const categoryMap: Record<string, string> = {
    'el': 'el',
    'vvs': 'vvs',
    'snickeri': 'snickeri',
    'montering': 'montering',
    'tradgard': 'tradgard',
    'stadning': 'stadning',
    'flytt': 'flytt',
    'markarbeten': 'markarbeten',
    'tekniska-installationer': 'tekniska-installationer',
    'badrum': 'badrum',
    'fonster-dorrar': 'fonster-dorrar',
    'golv': 'golv',
    'kok': 'kok',
    'malning': 'malning',
    'maleri': 'maleri',
    'takarbeten': 'takarbeten'
  };

  // Map slug to ServiceKey
  const serviceKeyMap: Record<string, ServiceKey> = {
    'el': 'Elmontör',
    'vvs': 'VVS',
    'snickeri': 'Snickare',
    'maleri': 'Måleri',
    'stadning': 'Städ',
    'markarbeten': 'Markarbeten',
    'flytt': 'Flytt',
    'montering': 'Montering',
    'tradgard': 'Trädgård',
    'tekniska-installationer': 'Tekniska installationer'
  };
  
  const categoryName = service ? categoryMap[service] : undefined;
  const serviceKey = service ? serviceKeyMap[service] : undefined;
  const cityDataItem = cityData[city];

  // Get city-specific service data (for FAQs and cases only)
  const cityServiceData = serviceCityData.find(
    item => item.service === serviceKey && item.city === city
  );

  // Generate metadata dynamically from main service data (Single Source of Truth)
  const generatedMeta = generateCityServiceData(service, city);
  
  // Get service content for "Om tjänsten" section
  const serviceContent = serviceKey && serviceCityContent[serviceKey]?.[city];
  
  // Filter services by category from database
  const filteredSubServices = useMemo(() => {
    if (!dbServices || !categoryName) return [];
    return dbServices.filter(s => s.category === categoryName);
  }, [dbServices, categoryName]);

  // Related services (other services from different categories)
  const relatedServices = useMemo(() => {
    if (!dbServices || !categoryName) return [];
    return dbServices
      .filter(s => s.category !== categoryName)
      .slice(0, 3);
  }, [dbServices, categoryName]);

  const totalPages = Math.ceil(filteredSubServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubServices = filteredSubServices.slice(startIndex, startIndex + itemsPerPage);

  // SEO Schema - must be before any early returns
  const breadcrumbSchema = useMemo(() => getBreadcrumbSchema([
    { name: 'Hem', url: 'https://fixco.se' },
    { name: 'Tjänster', url: 'https://fixco.se/tjanster' },
    { name: serviceData?.title || '', url: `https://fixco.se/tjanster/${service}` },
    { name: city, url: `https://fixco.se/tjanster/${cityServiceData?.slug || ''}` }
  ]), [serviceData, service, cityServiceData, city]);

  const localBusinessSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `Fixco ${generatedMeta?.h1 || ''}`,
    "description": generatedMeta?.description || '',
    "areaServed": {
      "@type": "City",
      "name": city,
      "containsPlace": cityDataItem.districts.map(district => ({
        "@type": "Place",
        "name": district
      }))
    },
    "priceRange": "$$",
    "telephone": "+46-XX-XXX-XX-XX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "SE"
    }
  }), [generatedMeta, city, cityDataItem]);

  const faqSchema = useMemo(() => {
    const faqs = cityServiceData?.faqs && cityServiceData.faqs.length > 0 
      ? cityServiceData.faqs 
      : cityDataItem.faqs;
    return getFAQSchema(faqs.map(faq => ({ question: faq.q, answer: faq.a })));
  }, [cityServiceData, cityDataItem]);

  const aggregateRatingSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "ProfessionalService",
      "name": generatedMeta?.h1 || '',
    },
    "ratingValue": "4.8",
    "bestRating": "5",
    "ratingCount": "247"
  }), [generatedMeta]);

  // Handle loading and error states AFTER all hooks
  if (!serviceData || !generatedMeta) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('serviceDetail.notFound')}</h1>
            <Link to={isEnglish ? "/en/services" : "/tjanster"}>
              <Button variant="premium">{t('serviceDetail.backToServices')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = serviceData.icon;

  return (
    <>
      <Helmet>
        <title>{generatedMeta.title}</title>
        <meta name="description" content={generatedMeta.description} />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(aggregateRatingSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-background opacity-50" />
          
          {/* F Watermark Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute top-20 right-20 w-16 h-16 rotate-12 animate-pulse" style={{ animationDuration: '4s' }}>
              <FixcoFIcon className="w-full h-full opacity-35" />
            </div>
            <div className="absolute bottom-10 left-20 w-12 h-12 -rotate-12 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <FixcoFIcon className="w-full h-full opacity-25" />
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 gradient-primary-subtle rounded-xl flex items-center justify-center mr-6 relative">
                  {/* F Brand Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center opacity-70 hover:opacity-90 transition-opacity">
                    <FixcoFIcon className="h-3 w-3" />
                  </div>
                  <IconComponent className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                    {generatedMeta.h1}
                  </h1>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                {generatedMeta.description}
              </p>
              
              {/* City-specific paragraph */}
              <div className="bg-muted/20 rounded-lg p-6 mb-8 border border-primary/10">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Vi på Fixco täcker hela {city} kommun och är redo att hjälpa dig med {categoryName?.toLowerCase()} i områden som{' '}
                  <strong>{cityDataItem.districts.slice(0, 4).join(', ')}</strong> och alla övriga stadsdelar. 
                  {cityDataItem.travelFee === "0 kr" 
                    ? ` Du betalar ingen resekostnad för uppdrag i ${city}.`
                    : ` Resekostnad: ${cityDataItem.travelFee}.`
                  }
                  {' '}Start inom 24-48 timmar och ROT/RUT-avdrag på 50% av arbetskostnaden.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  variant="cta" 
                  size="lg"
                  onClick={() => {
                    openServiceRequestModal({
                      serviceSlug: serviceData.slug,
                      prefill: { 
                        service_name: generatedMeta.h1 
                      }
                    });
                  }}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  {t('serviceDetail.requestQuote')}
                </Button>
                <Button 
                  variant="ghost-premium" 
                  size="lg"
                  onClick={() => window.location.href = 'tel:08-123 456 78'}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {t('serviceDetail.callUs')}
                </Button>
              </div>

              {/* Service Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{filteredSubServices.length}</div>
                  <div className="text-sm text-muted-foreground">{t('serviceDetail.differentServices')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{'< 5 ' + t('serviceDetail.days')}</div>
                  <div className="text-sm text-muted-foreground">{t('serviceDetail.projectStart')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50%</div>
                  <div className="text-sm text-muted-foreground">{mode === 'rut' ? 'RUT-' + t('serviceDetail.discount') : 'ROT-' + t('serviceDetail.discount')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">{t('serviceDetail.guaranteed')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Om tjänsten Section */}
        {serviceContent && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
                <h2 className="text-3xl font-bold mb-6">{serviceContent.aboutTitle}</h2>
                {serviceContent.aboutParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
                
                {serviceContent.authorizations && (
                  <div className="bg-muted/20 rounded-lg p-6 my-6 border border-primary/10">
                    <h3 className="text-xl font-semibold mb-3">Behörigheter och certifieringar</h3>
                    <ul className="space-y-2">
                      {serviceContent.authorizations.map((auth, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>{auth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <h3 className="text-xl font-semibold mb-3">Vanligaste uppdragen i {city}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {serviceContent.commonTasks.map((task, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section 1 - Se alla våra tjänster */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                💡 Utforska vårt utbud
              </div>
              <h2 className="text-3xl font-bold mb-4">Se alla våra tjänster</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fixco erbjuder ett komplett utbud av hantverkstjänster med ROT/RUT-avdrag. 
                Utforska alla våra tjänster och se priser, avdragsmöjligheter och mer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/tjanster">
                    Visa alla tjänster
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/tjanster#priser">
                    Se priser & ROT/RUT-avdrag
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Populära tjänster Section */}
        {serviceContent && (
          <section className="py-12 bg-muted/5">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">
                Populära {categoryName?.toLowerCase()}-tjänster i {city}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {serviceContent.popularServices.map((service, idx) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={idx} className="flex items-center space-x-2 bg-card border rounded-lg p-3 hover:border-primary/50 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{service.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Price Examples Section */}
        {cityServiceData?.priceExamples && cityServiceData.priceExamples.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">
                  Prisexempel för {categoryName?.toLowerCase()} i {city}
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                  Alla priser inkluderar material, arbete och ROT-avdrag. Exakta priser får du i din offert.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full bg-card border rounded-lg">
                    <thead className="bg-muted/50">
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-6 font-semibold">Jobb</th>
                        <th className="text-left py-4 px-6 font-semibold">Pris (efter ROT)</th>
                        <th className="text-left py-4 px-6 font-semibold">Tid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cityServiceData.priceExamples.map((ex, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6 font-medium">{ex.job}</td>
                          <td className="py-4 px-6 text-primary font-bold text-lg">{ex.price}</td>
                          <td className="py-4 px-6 text-sm text-muted-foreground">{ex.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Lokal Statistik Section */}
        <section className="py-12 bg-muted/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Fixco i {city} – i siffror
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">247+</div>
                <div className="text-sm text-muted-foreground">
                  Genomförda {categoryName?.toLowerCase()}-jobb i {city} 2024
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
                <div className="text-sm text-muted-foreground">
                  Snittbetyg från kunder i {city}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{'< 24h'}</div>
                <div className="text-sm text-muted-foreground">
                  Svarstid för offerter
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">
                  Av kunder rekommenderar oss
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {cityDataItem.travelFee}
                </div>
                <div className="text-sm text-muted-foreground">
                  Resekostnad i {city}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifieringar & Badges Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Certifieringar och medlemskap
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 bg-card border rounded-lg px-6 py-4">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">
                    {serviceKey === 'Elmontör' ? 'Elsäkerhetsverket' : 
                     serviceKey === 'VVS' ? 'Certifierad VVS-installatör' :
                     'Yrkescertifiering'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {serviceKey === 'Elmontör' ? 'Auktoriserad installatör' : 'Professionell utbildning'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-card border rounded-lg px-6 py-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Branschförbundet</div>
                  <div className="text-xs text-muted-foreground">Medlem sedan 2020</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-card border rounded-lg px-6 py-4">
                <FileCheck className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">ISO 9001</div>
                  <div className="text-xs text-muted-foreground">Kvalitetscertifierad</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-card border rounded-lg px-6 py-4">
                <Lock className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Ansvarsförsäkring</div>
                  <div className="text-xs text-muted-foreground">10 miljoner kr</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-8 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>F-{t('serviceDetail.taxAndInsurance')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{t('serviceDetail.startWithinDays')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{city} - {cityDataItem.travelFee} resekostnad</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-primary" />
                <span>98% {t('serviceDetail.customerSatisfaction')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Varför välja oss + Jämförelsetabell Section */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Därför väljer kunder i {city} Fixco
            </h2>
            
            {/* 6 USPs i grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              <div className="text-center p-6 bg-card border rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">
                  {serviceKey === 'Elmontör' ? 'Auktoriserade & Försäkrade' : 
                   serviceKey === 'VVS' ? 'Certifierade VVS-montörer' :
                   'Professionella hantverkare'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {serviceKey === 'Elmontör' 
                    ? 'Alla våra elektriker är auktoriserade av Elsäkerhetsverket. Fullständig ansvarsförsäkring på 10 miljoner kr.' 
                    : 'Certifierade yrkesutövare med fullständig försäkring och F-skattsedel.'}
                </p>
              </div>

              <div className="text-center p-6 bg-card border rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast pris i offert</h3>
                <p className="text-sm text-muted-foreground">
                  Du får tydlig offert med fast pris innan vi börjar. Inga dolda kostnader eller överraskningar.
                </p>
              </div>

              <div className="text-center p-6 bg-card border rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">ROT/RUT-hantering</h3>
                <p className="text-sm text-muted-foreground">
                  Vi sköter all administration för ROT/RUT-avdrag åt dig – helt kostnadsfritt. Du sparar 50% på arbetskostnaden.
                </p>
              </div>

              <div className="text-center p-6 bg-card border rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">100% nöjd-garanti</h3>
                <p className="text-sm text-muted-foreground">
                  Inte nöjd? Vi åtgärdar felet kostnadsfritt eller återbetalar. Inga krångel, inga frågor.
                </p>
              </div>

              <div className="text-center p-6 bg-card border rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Snabb start</h3>
                <p className="text-sm text-muted-foreground">
                  Vi strävar efter att starta inom 24-48 timmar efter godkänd offert. Akuta ärenden prioriteras.
                </p>
              </div>

              <div className="text-center p-6 bg-card border rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Lokalt team i {city}</h3>
                <p className="text-sm text-muted-foreground">
                  Vi är lokalt förankrade i {city} och känner till områdets specifika behov och utmaningar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section - Upgraded with ServiceComparisonCard */}
        <ServiceComparisonCard serviceKey={service} city={city} />

        {/* Sub-services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-text">
                Alla våra {categoryName?.toLowerCase()}-tjänster i {city}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {filteredSubServices.length} specialiserade tjänster tillgängliga.{' '}
                Alla priser inkluderar moms och ROT/RUT-avdrag om tillämpligt.
              </p>
              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Tillgängligt i hela {city} kommun</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSubServices.map((dbService) => (
                <ServiceCardV3
                  key={dbService.id}
                  title={dbService.title}
                  category={dbService.category}
                  description={dbService.description}
                  pricingType={dbService.price_type === 'quote' ? 'quote' : 
                               dbService.price_unit.includes('/h') ? 'hourly' : 'fixed'}
                  priceIncl={dbService.base_price}
                  eligible={{ rot: dbService.rot_eligible, rut: dbService.rut_eligible }}
                  serviceSlug={dbService.id}
                  serviceId={dbService.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && filteredSubServices.length > 0 && (
              <div className="flex justify-center mt-12 space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {t('serviceDetail.previous')}
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "premium" : "ghost"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  {t('serviceDetail.next')}
                </Button>
              </div>
            )}
          </div>
        </section>


        {/* How It Works Section */}
        {cityServiceData?.howItWorks && cityServiceData.howItWorks.length > 0 ? (
          <HowItWorksTimeline steps={cityServiceData.howItWorks} />
        ) : (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Så fungerar {categoryName?.toLowerCase()}-uppdrag i {city}
              </h2>
              <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto md:grid-cols-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Beskriv uppdraget</h3>
                  <p className="text-sm text-muted-foreground">
                    Fyll i formulär eller ring – vi ger offert inom 24h
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Godkänn offert</h3>
                  <p className="text-sm text-muted-foreground">
                    Tydlig offert med priser, ROT/RUT-avdrag och tidplan
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Vi utför jobbet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start inom 24-48h, professionell utförande med dokumentation
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Klart & garanterat</h3>
                  <p className="text-sm text-muted-foreground">
                    Slutbesiktning, dokumentation och 100% nöjd kund-garanti
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quality Assurance Process Section */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Så säkerställer vi kvalitet
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Kontroll före start</h3>
                    <p className="text-sm text-muted-foreground">
                      {serviceKey === 'Elmontör' 
                        ? 'Spänningstest, kontroll av jordfelsbrytare och dokumentation av befintlig installation.'
                        : serviceKey === 'VVS'
                        ? 'Genomgång av vattenledningar, tryck och befintliga system innan arbete påbörjas.'
                        : 'Noggrant inventering och dokumentation av nuvarande status innan projektstart.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fackmässig utförande</h3>
                    <p className="text-sm text-muted-foreground">
                      {serviceKey === 'Elmontör'
                        ? 'Arbete enligt SS 436 40 00 med korrekt materiel och verktyg. Skyddsmaterial för golv och trappor.'
                        : 'Arbete enligt gällande byggnorm och branschstandard. Vi använder kvalitetsmaterial och professionell utrustning.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Test efter installation</h3>
                    <p className="text-sm text-muted-foreground">
                      {serviceKey === 'Elmontör'
                        ? 'Funktionsprov, isolationsmätning och dokumentation enligt Elsäkerhetsverkets krav.'
                        : serviceKey === 'VVS'
                        ? 'Trycktester, läckagekontroll och funktionsprov av alla installationer.'
                        : 'Grundlig genomgång och testning av allt arbete innan slutgodkännande.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Slutbesiktning & garanti</h3>
                    <p className="text-sm text-muted-foreground">
                      Genomgång med kund, utdelning av protokoll och aktivering av 2 års garanti. Vi städar efter oss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Garantier & Försäkring Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              100% trygghet med Fixco-garantin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card border-2 border-primary/20 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">100% Nöjd kund-garanti</h3>
                    <p className="text-sm text-muted-foreground">
                      Inte nöjd? Vi åtgärdar felet kostnadsfritt eller återbetalar. Inga krångel, inga frågor. Vi står för kvaliteten i vårt arbete.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border-2 border-primary/20 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">2 års garanti på arbete</h3>
                    <p className="text-sm text-muted-foreground">
                      Alla våra {categoryName?.toLowerCase()}-installationer har 2 års garanti. Vi står för kvaliteten och kommer tillbaka om något skulle uppstå.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border-2 border-primary/20 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Ansvarsförsäkring 10 mkr</h3>
                    <p className="text-sm text-muted-foreground">
                      Fullständig ansvarsförsäkring genom If Försäkring. Du är skyddad vid eventuella skador under och efter projektet.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border-2 border-primary/20 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {serviceKey === 'Elmontör' || serviceKey === 'VVS' 
                        ? 'Besiktningsprotokoll inkluderat'
                        : 'Dokumentation inkluderad'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {serviceKey === 'Elmontör'
                        ? 'Vid alla större installationer får du besiktningsprotokoll enligt Elsäkerhetsverkets krav – utan extra kostnad.'
                        : serviceKey === 'VVS'
                        ? 'Trycktester, protokoll och dokumentation enligt försäkringsbolagens krav ingår alltid.'
                        : 'Alla projekt dokumenteras noggrant med fotografier och slutrapport för din trygghet.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Using service-specific FAQs */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Vanliga frågor om {categoryName?.toLowerCase()} i {city}</h2>
                <p className="text-muted-foreground">
                  Svar på de vanligaste frågorna vi får från våra kunder i {city}
                </p>
              </div>
              
              <div className="space-y-4">
                {(cityServiceData?.faqs && cityServiceData.faqs.length > 0 
                  ? cityServiceData.faqs 
                  : cityDataItem.faqs
                ).map((faq, idx) => (
                  <Collapsible key={idx}>
                    <CollapsibleTrigger className="w-full bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between text-left">
                        <h3 className="text-lg font-semibold flex items-start flex-1">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                          {faq.q}
                        </h3>
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4 transition-transform group-data-[state=open]:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-4 pt-2">
                      <p className="text-muted-foreground pl-7">{faq.a}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts Section */}
        {cityServiceData?.quickFacts && cityServiceData.quickFacts.length > 0 && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Zap className="w-7 h-7 text-primary" />
                    Bra att veta om {categoryName?.toLowerCase()} i {city}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {cityServiceData.quickFacts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm leading-tight">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Did You Know Section */}
        {cityServiceData?.didYouKnow && cityServiceData.didYouKnow.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Lightbulb className="w-7 h-7 text-amber-500" />
                    Visste du att...
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cityServiceData.didYouKnow.map((fact, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                        <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm leading-tight">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Säsongstips Section */}
        {serviceContent?.seasonalTips && serviceContent.seasonalTips.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-center">
                  {city === 'Stockholm' || city === 'Uppsala' 
                    ? `Tänk på detta med ${categoryName?.toLowerCase()} i ${city} under vintern`
                    : `Säsongstips för ${categoryName?.toLowerCase()} i ${city}`}
                </h2>
                <div className="bg-card border rounded-lg p-8">
                  <ul className="space-y-4">
                    {serviceContent.seasonalTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Vanliga Problem Section */}
        {serviceContent?.commonProblems && serviceContent.commonProblems.length > 0 && (
          <section className="py-16 bg-muted/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">
                  Vanliga problem med {categoryName?.toLowerCase()} vi löser
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Oavsett om du bor i en sekelskiftslägenhet, 60-talsvilla eller nybyggt radhus – 
                  dessa problem är vanliga och vi har lösningen. Alla uppdrag inkluderar ROT/RUT-avdrag.
                </p>
                
                <div className="space-y-6">
                  {serviceContent.commonProblems.map((problem, idx) => (
                    <div key={idx} className="bg-card border-2 border-orange-200/50 dark:border-orange-900/50 rounded-lg p-6 hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-3">{problem.title}</h3>
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                                Problemet
                              </span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {problem.description}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                                Vår lösning
                              </span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {problem.solution}
                              </p>
                            </div>
                            {problem.relatedService && (
                              <div className="pt-2">
                                <Link 
                                  to={problem.relatedService.slug}
                                  className="text-sm text-primary hover:underline font-medium inline-flex items-center"
                                >
                                  Läs mer om {problem.relatedService.name} →
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* CTA efter problem-listan */}
                <div className="mt-12 text-center bg-primary/5 border-2 border-primary/20 rounded-lg p-8">
                  <h3 className="text-xl font-bold mb-3">
                    Känner du igen dig i något av dessa problem?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Vi hjälper dig med en kostnadsfri genomgång och offert inom 24 timmar. 
                    Ingen bindning – bara professionella råd.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      onClick={() => openServiceRequestModal({ serviceSlug: service })}
                    >
                      Begär kostnadsfri offert
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => window.location.href = 'tel:018-123456'}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Ring: 018-123 456
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cases Section - Using service-specific cases */}
        {cityServiceData?.cases && cityServiceData.cases.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Tidigare uppdrag – {categoryName} i {city}</h2>
                <p className="text-muted-foreground">
                  Exempel på genomförda projekt från nöjda kunder
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {cityServiceData.cases.map((caseItem, idx) => (
                  <div key={idx} className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <div className="flex items-start mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{caseItem.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{caseItem.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section 2 - Behöver du hjälp med något annat? */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Column - Information */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Behöver du hjälp med något annat?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Fixco erbjuder ett komplett utbud av hantverkstjänster. Från el och VVS till snickeri, måleri, städ och mycket mer.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>ROT/RUT-avdrag på de flesta tjänster</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>Snabb service och professionella hantverkare</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>Försäkring och garanti på alla uppdrag</span>
                    </li>
                  </ul>
                </div>
                
                {/* Right Column - CTA Card */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-8">
                  <div className="text-5xl mb-4">🛠️</div>
                  <h3 className="text-2xl font-bold mb-3">
                    Utforska alla våra tjänster
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Se vårt kompletta utbud, priser och läs mer om varje tjänst.
                  </p>
                  <Button asChild size="lg" className="w-full">
                    <Link to="/tjanster">
                      Till alla tjänster →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Området vi täcker Section */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {categoryName} i alla stadsdelar i {city}
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-center text-muted-foreground mb-8">
                Vi utför {categoryName?.toLowerCase()}-jobb i hela {city} kommun. Nedan ser du alla områden vi täcker:
              </p>
              
              {/* Grid med alla stadsdelar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
                {cityDataItem.districts.map((district, idx) => (
                  <div 
                    key={idx} 
                    className="bg-card border rounded-lg p-3 hover:border-primary/50 transition-colors cursor-default"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{district}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Resekostnad highlight */}
              <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  {cityDataItem.travelFee === "0 kr" 
                    ? `✅ Ingen resekostnad i ${city}`
                    : `Resekostnad: ${cityDataItem.travelFee}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cityDataItem.travelFee === "0 kr" 
                    ? `${city} är vårt primära verksamhetsområde och vi tar ingen extra kostnad för resa. Vi kommer till dig snabbt och enkelt.`
                    : `Fast resekostnad för alla uppdrag i ${city}. Inga tilläggsavgifter eller överraskningar. Priset inkluderas i offerten.`
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Vad våra kunder i {city} säger</h2>
                <p className="text-muted-foreground">
                  Verkliga recensioner från nöjda kunder
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cityDataItem.testimonials.map((testimonial, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-lg p-6 relative">
                    <div className="absolute -top-3 left-6">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 mt-2 italic">"{testimonial.text}"</p>
                    <p className="font-semibold text-sm">— {testimonial.author}</p>
                    {testimonial.date && (
                      <p className="text-xs text-muted-foreground mt-1">{testimonial.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Akut Jobb & Nödkontakt Section */}
        <section className="py-12 bg-red-50 dark:bg-red-900/10 border-y-2 border-red-200 dark:border-red-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {serviceKey === 'Elmontör' 
                  ? `Akut eljobb i ${city}? Vi hjälper samma dag!`
                  : serviceKey === 'VVS'
                  ? `Akut läcka eller vattenrörsskada i ${city}?`
                  : `Akuta ${categoryName?.toLowerCase()}-problem i ${city}?`}
              </h2>
              <p className="text-muted-foreground mb-6">
                {serviceKey === 'Elmontör'
                  ? 'Vid akuta elfel, utlösta säkringar eller jordfel prioriterar vi ditt ärende. Ring oss direkt så hjälper vi dig så snabbt som möjligt.'
                  : serviceKey === 'VVS'
                  ? 'Vid akuta läckor, stopp i avlopp eller vattenrörsskador kommer vi ut samma dag. Vi hjälper dig direkt.'
                  : `Vid akuta problem med ${categoryName?.toLowerCase()} prioriterar vi ditt ärende. Ring för snabb hjälp.`}
              </p>
              
              <div className="bg-white dark:bg-gray-900 border-2 border-red-500 rounded-lg p-6 mb-6">
                <div className="text-sm text-muted-foreground mb-2">Ring för akut hjälp:</div>
                <a 
                  href="tel:018-123456" 
                  className="text-3xl font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  018-123 456
                </a>
                <div className="text-xs text-muted-foreground mt-2">
                  Vardagar 07:00-20:00 | Helger 09:00-17:00
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Samma dags-service</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>
                    {serviceKey === 'Elmontör' ? 'Auktoriserade elektriker' : 
                     serviceKey === 'VVS' ? 'Certifierade VVS-montörer' :
                     'Professionella hantverkare'}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Tydligt fastpris</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Kunder bokar även</h2>
              <p className="text-muted-foreground">
                Relaterade tjänster som kan vara av intresse
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => (
                <ServiceCardV3
                  key={relatedService.id}
                  title={relatedService.title}
                  category={relatedService.category}
                  description={relatedService.description}
                  pricingType={relatedService.price_type === 'quote' ? 'quote' : 
                               relatedService.price_unit.includes('/h') ? 'hourly' : 'fixed'}
                  priceIncl={relatedService.base_price}
                  eligible={{ rot: relatedService.rot_eligible, rut: relatedService.rut_eligible }}
                  serviceSlug={relatedService.id}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default ServiceCityDetail;
