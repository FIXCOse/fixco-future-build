import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-construction.jpg";
import { useCopy } from "@/copy/CopyProvider";

const Hero = () => {
  const { t, locale } = useCopy();
  const contactPath = locale === 'en' ? '/en/contact' : '/kontakt';
  const servicesPath = locale === 'en' ? '/en/services' : '/tjanster';
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Static background */}
      <div className="absolute inset-0 hero-background">
        <div className="absolute inset-0 bg-primary/5" />
      </div>
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional construction work" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">{t('hero.title_large')}</span> {t('hero.title_or')}{" "}
              <span className="text-foreground">{t('hero.title_small')}</span> {t('hero.title_projects')}{" "}
              <br />
              <span className="gradient-rainbow">{t('hero.fixco_handles')}</span>{" "}
              <span className="gradient-rainbow">{t('hero.everything')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
              {t('hero.subtitle')} 
              <span className="text-foreground font-semibold"> {t('timing.start_within_5_days')}.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to={contactPath} className="w-full sm:w-auto">
                <Button
                  variant="cta-primary"
                  size="cta"
                  className="w-full sm:w-auto"
                >
                  {t('hero.cta_request_quote')}
                </Button>
              </Link>
              <Link to={servicesPath} className="w-full sm:w-auto">
                <Button
                  variant="cta-secondary"
                  size="cta"
                  className="w-full sm:w-auto"
                >
                  {t('hero.cta_see_services')}
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-rainbow" />
                <span>{t('hero.trust_rot')} <span className="gradient-rainbow font-semibold">{t('hero.trust_rot_desc')}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-rainbow" />
                <span>{t('hero.trust_coverage')} <span className="gradient-rainbow font-semibold">{t('hero.trust_coverage_desc')}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-rainbow" />
                <span>{t('hero.trust_start')} <span className="gradient-rainbow font-semibold">{t('hero.trust_start_desc')}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static floating elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/10 rounded-full" />
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-accent/10 rounded-full" />
      <div className="absolute top-1/2 right-10 w-12 h-12 bg-primary/5 rounded-full" />
    </section>
  );
};

export default Hero;