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

import { Link } from "react-router-dom";
import { useCopy } from "@/copy/CopyProvider";

const Services = () => {
  const { t, locale } = useCopy();
  const { isEditMode } = useEditMode();
  
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <EditableSection id="services-hero" title="Tjänster Hero">
        <section className="pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-background opacity-50" />
          <HeroMotion />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <EditableText 
                id="services-title"
                initialContent={t('services.title')}
                type="heading"
                as="h1"
                className="text-5xl md:text-6xl font-bold mb-6"
              />
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
              <EditableText 
                id="services-categories-title"
                initialContent={t('services.choose_category')}
                type="heading"
                as="h2"
                className="text-3xl font-bold mb-4"
              />
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
              <EditableText 
                id="services-all-title"
                initialContent={t('services.all_services')}
                type="heading"
                as="h2"
                className="text-3xl font-bold mb-4"
              />
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



      {/* ROT Info Section */}
      <EditableSection id="services-rot" title="ROT info sektion">
        <section className="py-20 relative">
          <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <EditableText 
                id="services-rot-title"
                initialContent={t('services.rot_section_title')}
                type="heading"
                as="h2"
                className="text-4xl font-bold mb-8"
              />
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="card-premium p-8">
                  <EditableText 
                    id="services-rot-what-title"
                    initialContent={t('services.rot_what_title')}
                    type="heading"
                    as="h3"
                    className="text-2xl font-bold mb-4"
                  />
                  <EditableText 
                    id="services-rot-what-description"
                    initialContent={t('services.rot_what_description')}
                    as="p"
                    className="text-muted-foreground"
                  />
                </div>
                <div className="card-premium p-8">
                  <EditableText 
                    id="services-rot-handle-title"
                    initialContent={t('services.rot_we_handle_title')}
                    type="heading"
                    as="h3"
                    className="text-2xl font-bold mb-4"
                  />
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