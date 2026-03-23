import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import { usePriceStore } from "@/stores/priceStore";
import { calcDisplayPrice, isEligibleForMode } from "@/utils/priceCalculation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-premium";
import { servicesDataNew, SubService } from "@/data/servicesDataNew";
import { useServices } from "@/hooks/useServices";
import PriceSummary from '@/components/PriceSummary';
import ServiceCardV3 from '@/components/ServiceCardV3';
import SegmentedPriceToggle from '@/components/SegmentedPriceToggle';
import { Badge } from '@/components/ui/badge';
import { useCopy } from "@/copy/CopyProvider";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle, Lock, MapPin } from "lucide-react";
import GradientButton from '@/components/GradientButton';
import logoFixco from "@/assets/fixco-logo-white.png";
import { getHeroGradientStyle } from "@/utils/serviceGradients";
import { motion } from "framer-motion";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";

// Slug alias mappning - mappar URL-slugs till data-slugs
const subCategoryTranslations: Record<string, string> = {
  'Akustik': 'Acoustics', 'Allmänt': 'General', 'Altan': 'Deck',
  'Anläggning': 'Landscaping', 'AV': 'AV', 'Avlopp': 'Drainage',
  'Bänkskiva': 'Countertop', 'Beläggning': 'Paving', 'Belysning': 'Lighting',
  'Blandare': 'Faucets', 'Dörrar': 'Doors', 'Dörrlås': 'Door Locks',
  'Dränering': 'Drainage', 'Dusch': 'Shower', 'Elektronik': 'Electronics',
  'Fasad': 'Facade', 'Finish': 'Finish', 'Fönster': 'Windows',
  'Förvaring': 'Storage', 'Grävning': 'Excavation', 'Hemstäd': 'Home Cleaning',
  'Innerväggar': 'Interior Walls', 'Inredning': 'Interior', 'Installationer': 'Installations',
  'Isolering': 'Insulation', 'IT': 'IT', 'Kakel': 'Tiles',
  'Klinker': 'Clinker', 'Kök': 'Kitchen', 'Laminat/Vinyl': 'Laminate/Vinyl',
  'Målning': 'Painting', 'Matta': 'Carpet', 'Möbler': 'Furniture',
  'Montering': 'Assembly', 'Murning': 'Masonry', 'Packning': 'Packing',
  'Parkett': 'Parquet', 'Renovering': 'Renovation', 'Säkerhet': 'Security',
  'Sanitetsarbeten': 'Sanitary Work', 'Service': 'Service', 'Skötsel': 'Maintenance',
  'Specialstäd': 'Special Cleaning', 'Större projekt': 'Larger Projects',
  'Strömbrytare': 'Switches', 'Tak': 'Roof', 'Takläggning': 'Roofing',
  'Tapetsering': 'Wallpapering', 'Totalrenovering': 'Full Renovation',
  'Transport': 'Transport', 'Underhåll': 'Maintenance', 'Utebelysning': 'Outdoor Lighting',
  'Utomhus': 'Outdoor', 'Uttag': 'Outlets', 'Värme': 'Heating',
  'Vinterservice': 'Winter Service', 'Vitvaror': 'Appliances',
};

const slugAliases: Record<string, string> = {
  'malning': 'malare',
  'maleri': 'malare',
  'elektriker': 'el',
  'elmontor': 'el',
  'stad': 'stadning',
  'snickare': 'snickeri',
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { t, locale } = useCopy();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const itemsPerPage = 9;
  const mode = usePriceStore((state) => state.mode);
  const setMode = usePriceStore((state) => state.setMode);

  // Determine if we're on English site
  const isEnglish = locale === 'en';
  
  // Normalisera slug via alias-mappning
  const normalizedSlug = slug ? (slugAliases[slug] || slug) : undefined;
  
  // Get static service category info for UI
  const service = servicesDataNew.find(s => s.slug === normalizedSlug);

  // Auto-set price mode based on service eligibility & reset filters on slug change
  useEffect(() => {
    if (!service) return;
    setSelectedSubCategory(null);
    setCurrentPage(1);
    if (service.eligible?.rot) {
      setMode('rot');
    } else if (service.eligible?.rut) {
      setMode('rut');
    }
  }, [normalizedSlug]);
  
  // Fetch database services with translations based on locale
  const { data: dbServices, isLoading } = useServices(locale);
  
  // Map slug to category name for filtering - använd normalizedSlug
  const categoryMap: Record<string, string> = {
    'el': 'el',
    'vvs': 'vvs',
    'snickeri': 'snickeri',
    'malare': 'malning',
    'maleri': 'malning',
    'malning': 'malning',
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
     'takarbeten': 'takarbeten',
     'rivning': 'rivning'
  };
  
  const categoryName = normalizedSlug ? categoryMap[normalizedSlug] : undefined;
  
  // Filter services by category from database (including cross-listed)
  const filteredSubServices = useMemo(() => {
    if (!dbServices || !categoryName) return [];
    return dbServices
      .filter(s => 
        s.category === categoryName || 
        s.additional_categories?.includes(categoryName)
      )
      .sort((a, b) => {
        const aHasPrice = a.price_type !== 'quote' ? 0 : 1;
        const bHasPrice = b.price_type !== 'quote' ? 0 : 1;
        return aHasPrice - bHasPrice;
      });
  }, [dbServices, categoryName]);

  // Extract unique sub-categories for filter chips
  const subCategories = useMemo(() => {
    const cats = filteredSubServices
      .map(s => s.sub_category)
      .filter((c): c is string => Boolean(c));
    return [...new Set(cats)].sort();
  }, [filteredSubServices]);

  // Apply sub-category filter
  const displayServices = useMemo(() => {
    if (!selectedSubCategory) return filteredSubServices;
    return filteredSubServices.filter(s => s.sub_category === selectedSubCategory);
  }, [filteredSubServices, selectedSubCategory]);

  // Related services (other services from different categories)
  const relatedServices = useMemo(() => {
    if (!dbServices || !categoryName) return [];
    return dbServices
      .filter(s => s.category !== categoryName)
      .slice(0, 3);
  }, [dbServices, categoryName]);

  if (!service) {
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



  const totalPages = Math.ceil(displayServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubServices = displayServices.slice(startIndex, startIndex + itemsPerPage);

  // SEO - dynamisk titel och beskrivning
  const seoTitle = `${t(`serviceCategories.${service.slug}.title` as any) || service.title} | Fixco`;
  const seoDescription = t(`serviceCategories.${service.slug}.description` as any) || service.description;

  return (
    <div className="min-h-screen">
      <Seo 
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/tjanster/${slug}`}
      />
      <Breadcrumbs />
      
      {/* Hero Section — gradient style matching LocalServicePage */}
      <section className="relative w-full overflow-hidden">
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{ backgroundImage: getHeroGradientStyle(normalizedSlug || ''), backgroundSize: '200% 200%' }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 opacity-30 blur-3xl rounded-full animate-float-slow" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-4xl"
          >
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center leading-tight">
              {t(`serviceCategories.${service.slug}.title` as any) || service.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 text-center max-w-3xl leading-relaxed">
              {t(`serviceCategories.${service.slug}.description` as any) || service.description}
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center mt-2">
              <GradientButton 
                className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
                onClick={() => {
                  openServiceRequestModal({
                    serviceSlug: service.slug,
                    prefill: { 
                      service_name: t(`serviceCategories.${service.slug}.title` as any) || service.title 
                    }
                  });
                }}
              >
                {t('serviceDetail.requestQuote')}
              </GradientButton>
              <GradientButton 
                className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
                onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
              >
                {t('footer.bookHomeVisit')}
              </GradientButton>
            </div>

            {/* Service Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{filteredSubServices.length}</div>
                <div className="text-sm text-white/70">{t('serviceDetail.differentServices')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{'< 5 ' + t('serviceDetail.days')}</div>
                <div className="text-sm text-white/70">{t('serviceDetail.projectStart')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">30%</div>
                <div className="text-sm text-white/70">{mode === 'rut' ? 'RUT-' + t('serviceDetail.discount') : 'ROT-' + t('serviceDetail.discount')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-white/70">{t('serviceDetail.guaranteed')}</div>
              </div>
            </div>

            {/* Trust badges — pill style */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {[
                'F-' + t('serviceDetail.taxAndInsurance'),
                t('serviceDetail.startWithinDays'),
                'Uppsala & Stockholm',
                '98% ' + t('serviceDetail.customerSatisfaction'),
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm md:text-base text-white/90">
                  <CheckCircle className="h-3.5 w-3.5 text-white/80" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* Door Lock Highlight Banner - for montering & tekniska-installationer */}
      {(normalizedSlug === 'montering' || normalizedSlug === 'tekniska-installationer') && (
        <section className="py-6">
          <div className="container mx-auto px-4">
            <Link 
              to={isEnglish ? '/en/services/door-locks' : '/tjanster/dorrlas'}
              className="block group"
            >
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        {isEnglish ? 'New!' : 'Nytt!'}
                      </Badge>
                      <h3 className="font-bold text-foreground">
                        {isEnglish ? 'Smart Door Lock Installation' : 'Installation av smarta dörrlås'}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish 
                        ? 'Yale Doorman, Linus, Nuki & more — 30% ROT deduction' 
                        : 'Yale Doorman, Linus, Nuki m.fl. — 30% ROT-avdrag'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-medium text-sm shrink-0">
                  {isEnglish ? 'Learn more' : 'Se mer'}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Sub-services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              {t('serviceDetail.allOurServices')} {(t(`serviceCategories.${service.slug}.title` as any) || service.title).toLowerCase()} {t('services.count')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {filteredSubServices.length} {t('serviceDetail.specializedServices')} {' '}
              {t('serviceDetail.allPricesInclude')}
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{t('serviceDetail.availableIn')}</span>
            </div>
            <div className="flex justify-center mt-6">
              <SegmentedPriceToggle size="md" allowedModes={
                service.eligible?.rot && service.eligible?.rut ? ['all', 'rot', 'rut'] :
                service.eligible?.rot ? ['all', 'rot'] :
                service.eligible?.rut ? ['all', 'rut'] :
                ['all']
              } />
            </div>
            {/* Sub-category filter chips */}
            {subCategories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button 
                  onClick={() => { setSelectedSubCategory(null); setCurrentPage(1); }}
                  className={cn("px-4 py-1.5 rounded-full border text-sm font-medium transition-all",
                    !selectedSubCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {isEnglish ? 'All' : 'Alla'}
                </button>
                {subCategories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { setSelectedSubCategory(cat); setCurrentPage(1); }}
                    className={cn("px-4 py-1.5 rounded-full border text-sm font-medium transition-all",
                      selectedSubCategory === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {isEnglish ? (subCategoryTranslations[cat] || cat) : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSubServices.map((dbService) => {
             return (
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
             );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && displayServices.length > 0 && (
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

      {/* Related Services */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">{t('serviceDetail.customersAlsoBook')}</h2>
            <p className="text-muted-foreground">
              {t('serviceDetail.relatedServices')} {(t(`serviceCategories.${service.slug}.title` as any) || service.title).toLowerCase()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((relatedService) => {
              return (
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
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetail;