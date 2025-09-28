import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryGrid from "@/components/CategoryGrid";
import EditableCategoryGridNew from "@/components/EditableCategoryGridNew";
import FastServiceFilter from "@/components/FastServiceFilter";
import EditableFastServiceFilterNew from "@/components/EditableFastServiceFilterNew";
import { useEditMode } from "@/contexts/EditModeContext";
import HeroMotion from "@/components/HeroMotion";
import TrustChips from "@/components/TrustChips";
import { Project3DVisualizer } from "@/components/Project3DVisualizer";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { EcoScoreDisplay } from "@/components/EcoScoreDisplay";

import { Link } from "react-router-dom";
import { useCopy } from "@/copy/CopyProvider";

const Services = () => {
  const { t } = useCopy();
  const { isEditMode } = useEditMode();
  
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-50" />
        <HeroMotion />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('services.title').split(' ').map((word, index, array) => 
                index === array.length - 1 ? (
                  <span key={index} className="gradient-text">{word}</span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('services.subtitle')} 
              <span className="text-primary font-semibold"> {t('services.rot_benefit')}</span>
            </p>
            
            <TrustChips variant="services" showAll={true} />
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.choose_category')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.category_description')}
            </p>
          </div>
          {isEditMode ? <EditableCategoryGridNew /> : <CategoryGrid />}
        </div>
      </section>

      {/* All Services with Filters */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.all_services')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.all_services_description')}
            </p>
          </div>
          {isEditMode ? <EditableFastServiceFilterNew /> : <FastServiceFilter />}
        </div>
      </section>

      {/* Interactive Project Visualization */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.visualize_project')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.visualize_description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            <Project3DVisualizer projectType="bathroom" />
            <BeforeAfterSlider projectType="kitchen" />
            <div className="space-y-6">
              <div className="p-6 border rounded-lg">
                 <h3 className="font-bold mb-2 flex items-center gap-2">
                   <span className="text-2xl">🌱</span>
                   {t('services.eco_score')}
                 </h3>
                <EcoScoreDisplay score={85} showDetails={true} />
                 <p className="text-sm text-muted-foreground mt-3">
                   {t('project.eco_performance')}
                 </p>
              </div>
              
               <div className="p-4 bg-primary/5 rounded-lg">
                 <h4 className="font-medium mb-2">{t('smartHome.smart_features')}</h4>
                 <ul className="text-sm text-muted-foreground space-y-1">
                   <li>• 3D-{t('services.preview').toLowerCase()}</li>
                   <li>• {t('project.ai_results')}</li>
                   <li>• {t('project.environmental_impact')}</li>
                   <li>• {t('project.rot_rut_optimization')}</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
      </section>


      {/* ROT Info Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              <span className="gradient-text">{t('services.rot_section_title').split(' – ')[0]}</span> – {t('services.rot_section_title').split(' – ')[1]}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4">{t('services.rot_what_title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.rot_what_description')}
                </p>
              </div>
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4">{t('services.rot_we_handle_title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.rot_we_handle_description')}
                </p>
              </div>
            </div>
            
            <Link to="/kontakt">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                {t('services.request_quote_rot')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;