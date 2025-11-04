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
          <h3 className="text-2xl font-bold mb-4">Tjänster i Ditt Område</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Se specifik information för din stad och tjänst
          </p>
          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {/* Uppsala */}
            <Link to="/tjanster/elmontor-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Elmontör Uppsala
            </Link>
            <Link to="/tjanster/vvs-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              VVS Uppsala
            </Link>
            <Link to="/tjanster/snickare-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Snickare Uppsala
            </Link>
            <Link to="/tjanster/montering-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Montering Uppsala
            </Link>
            <Link to="/tjanster/tradgard-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Trädgård Uppsala
            </Link>
            <Link to="/tjanster/stad-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Städ Uppsala
            </Link>
            <Link to="/tjanster/markarbeten-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Markarbeten Uppsala
            </Link>
            <Link to="/tjanster/tekniska-installationer-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Teknik Uppsala
            </Link>
            <Link to="/tjanster/flytt-uppsala" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Flytt Uppsala
            </Link>
            
            {/* Stockholm */}
            <Link to="/tjanster/elmontor-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Elmontör Stockholm
            </Link>
            <Link to="/tjanster/vvs-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              VVS Stockholm
            </Link>
            <Link to="/tjanster/snickare-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Snickare Stockholm
            </Link>
            <Link to="/tjanster/montering-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Montering Stockholm
            </Link>
            <Link to="/tjanster/tradgard-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Trädgård Stockholm
            </Link>
            <Link to="/tjanster/stad-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Städ Stockholm
            </Link>
            <Link to="/tjanster/markarbeten-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Markarbeten Stockholm
            </Link>
            <Link to="/tjanster/tekniska-installationer-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Teknik Stockholm
            </Link>
            <Link to="/tjanster/flytt-stockholm" className="px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              Flytt Stockholm
            </Link>
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