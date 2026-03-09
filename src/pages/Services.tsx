import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryGrid from "@/components/CategoryGrid";
import EditableCategoryGridNew from "@/components/EditableCategoryGridNew";
import FastServiceFilter from "@/components/FastServiceFilter";
import EditableServiceFilter from "@/components/EditableServiceFilter";
import { useEditMode } from "@/contexts/EditModeContext";
import HeroMotion from "@/components/HeroMotion";
import TrustChips from "@/components/TrustChips";
import { Project3DVisualizer } from "@/components/Project3DVisualizer";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { EcoScoreDisplay } from "@/components/EcoScoreDisplay";
import { EditableSection } from "@/components/EditableSection";
import { EditableText } from "@/components/EditableText";
import { GradientText } from "@/components/v2/GradientText";
import { Helmet } from 'react-helmet-async';
import { getServiceListSchema, getBreadcrumbSchema, getOfferCatalogSchema } from '@/components/SEOSchemaEnhanced';

import { Link } from "react-router-dom";
import { useCopy } from "@/copy/CopyProvider";

const Services = () => {
  const { t, locale } = useCopy();
  const { isEditMode } = useEditMode();
  
  const isEnglish = locale === 'en';
  const pageTitle = isEnglish ? 'All Services - Electrician, Plumber, Carpenter & More | Fixco' : 'Alla tjänster - Elektriker, VVS, Snickare & mer | Fixco';
  const pageDesc = isEnglish
    ? 'Browse all Fixco services: electrician, plumber, carpenter, assembly, cleaning and more in Uppsala & Stockholm. 30% ROT/RUT deduction included.'
    : 'Se alla Fixco-tjänster: elektriker, VVS, snickare, montering, städ och mer i Uppsala & Stockholm. 30% ROT/RUT-avdrag. ★ 5/5 betyg.';

  const servicesList = [
    { name: 'Elektriker', url: '/tjanster/elektriker', description: 'Elinstallation, felsökning, laddboxar' },
    { name: 'VVS', url: '/tjanster/vvs', description: 'Rörmokare, badrum, akuta läckor' },
    { name: 'Snickare', url: '/tjanster/snickare', description: 'Kök, garderober, inredning' },
    { name: 'Montering', url: '/tjanster/montering', description: 'IKEA-möbler, TV-fästen, vitvaror' },
    { name: 'Trädgård', url: '/tjanster/tradgard', description: 'Gräsklippning, häckar, plantering' },
    { name: 'Städning', url: '/tjanster/stad', description: 'Hemstäd, flyttstäd, byggstäd' },
    { name: 'Markarbeten', url: '/tjanster/markarbeten', description: 'Dränering, schaktning, plattläggning' },
    { name: 'Tekniska installationer', url: '/tjanster/tekniska-installationer', description: 'Nätverk, larm, IT-support' },
    { name: 'Flytt', url: '/tjanster/flytt', description: 'Flytthjälp, packning, transport' },
  ];

  const serviceListSchema = getServiceListSchema(servicesList.map(s => ({
    ...s,
    url: `https://fixco.se${s.url}`
  })));

  const offerCatalogSchema = getOfferCatalogSchema(servicesList.map(s => ({
    name: s.name,
    price: 959,
    description: s.description
  })));

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Hem', url: '/' },
    { name: 'Tjänster', url: '/tjanster' }
  ]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`https://fixco.se${isEnglish ? '/en/services' : '/tjanster'}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`https://fixco.se${isEnglish ? '/en/services' : '/tjanster'}`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={isEnglish ? 'en_US' : 'sv_SE'} />
        <meta property="og:site_name" content="Fixco" />
        <meta property="og:image" content="https://fixco.se/assets/fixco-logo-black.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify(serviceListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(offerCatalogSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Breadcrumbs />
      
      {/* Hero Section */}
      <EditableSection id="services-hero" title="Tjänster Hero">
        <section className="pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-background opacity-50" />
          <HeroMotion />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <GradientText gradient="rainbow">
                  {t('services.title')}
                </GradientText>
              </h1>
              <EditableText 
                id="services-subtitle"
                initialContent={`${t('services.subtitle')} ${t('services.rot_benefit')}`}
                as="p"
                className="text-xl text-muted-foreground mb-8"
              />
              
              <TrustChips variant="services" showAll={true} />
            </div>
          </div>
        </section>
      </EditableSection>

      {/* Main Categories Grid */}
      <EditableSection id="services-categories" title="Kategorier sektion">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <GradientText gradient="rainbow">
                  {t('services.choose_category')}
                </GradientText>
              </h2>
              <EditableText 
                id="services-categories-description"
                initialContent={t('services.category_description')}
                as="p"
                className="text-muted-foreground max-w-2xl mx-auto"
              />
            </div>
            {isEditMode ? <EditableCategoryGridNew /> : <CategoryGrid />}
          </div>
        </section>
      </EditableSection>

      {/* All Services with Filters */}
      <EditableSection id="services-all" title="Alla tjänster sektion">
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <GradientText gradient="rainbow">
                  {t('services.all_services')}
                </GradientText>
              </h2>
              <EditableText 
                id="services-all-description"
                initialContent={t('services.all_services_description')}
                as="p"
                className="text-muted-foreground max-w-2xl mx-auto"
              />
            </div>
            {isEditMode ? <EditableServiceFilter /> : <FastServiceFilter />}
          </div>
        </section>
      </EditableSection>



      {/* Geographic Links */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">{t('services.areaLinks.title')}</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t('services.areaLinks.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {(() => {
              const prefix = locale === 'en' ? '/en/services' : '/tjanster';
              const areas = [
                { slug: 'elektriker', sv: 'Elektriker', en: 'Electrician' },
                { slug: 'vvs', sv: 'VVS', en: 'Plumbing' },
                { slug: 'snickare', sv: 'Snickare', en: 'Carpentry' },
                { slug: 'montering', sv: 'Montering', en: 'Assembly' },
                { slug: 'tradgard', sv: 'Trädgård', en: 'Garden' },
                { slug: 'stad', sv: 'Städ', en: 'Cleaning' },
                { slug: 'markarbeten', sv: 'Markarbeten', en: 'Groundwork' },
                { slug: 'tekniska-installationer', sv: 'Teknik', en: 'Tech' },
                { slug: 'flytt', sv: 'Flytt', en: 'Moving' },
              ];
              const cities = ['Uppsala', 'Stockholm'];
              
              return cities.flatMap(city =>
                areas.map(area => (
                  <Link
                    key={`${area.slug}-${city.toLowerCase()}`}
                    to={`${prefix}/${area.slug}/${city.toLowerCase()}`}
                    className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                  >
                    {locale === 'en' ? area.en : area.sv} {city}
                  </Link>
                ))
              );
            })()}
          </div>
        </div>
      </section>

      {/* ROT Info Section */}
      <EditableSection id="services-rot" title="ROT info sektion">
        <section className="py-20 relative">
          <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">
                <GradientText gradient="rainbow">
                  {t('services.rot_section_title')}
                </GradientText>
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="card-premium p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    <GradientText gradient="rainbow">
                      {t('services.rot_what_title')}
                    </GradientText>
                  </h3>
                  <EditableText 
                    id="services-rot-what-description"
                    initialContent={t('services.rot_what_description')}
                    as="p"
                    className="text-muted-foreground"
                  />
                </div>
                <div className="card-premium p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    <GradientText gradient="rainbow">
                      {t('services.rot_we_handle_title')}
                    </GradientText>
                  </h3>
                  <EditableText 
                    id="services-rot-handle-description"
                    initialContent={t('services.rot_we_handle_description')}
                    as="p"
                    className="text-muted-foreground"
                  />
                </div>
              </div>
              
              <Link to={locale === 'en' ? '/en/contact' : '/kontakt'}>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                  <EditableText 
                    id="services-rot-cta"
                    initialContent={t('services.request_quote_rot')}
                  >
                    {t('services.request_quote_rot')}
                  </EditableText>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </EditableSection>
    </div>
  );
};

export default Services;