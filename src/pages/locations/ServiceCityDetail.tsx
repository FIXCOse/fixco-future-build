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

  const faqSchema = useMemo(() => getFAQSchema(
    cityDataItem.faqs.map(faq => ({ question: faq.q, answer: faq.a }))
  ), [cityDataItem]);

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

        {/* FAQ Section */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Vanliga frågor om {categoryName?.toLowerCase()} i {city}</h2>
                <p className="text-muted-foreground">
                  Svar på de vanligaste frågorna vi får från våra kunder i {city}
                </p>
              </div>
              
              <div className="space-y-6">
                {cityDataItem.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground pl-7">{faq.a}</p>
                  </div>
                ))}
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
