import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button-premium";
import { CheckCircle, Star, Users, Award, Clock, MapPin, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                {t('about.historyTitle')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('about.historyParagraph1')}
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                {t('about.historyParagraph2')}
              </p>
              <p className="text-lg text-muted-foreground">
                {t('about.historyParagraph3')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="card-premium p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">500+</div>
                <div className="text-sm text-muted-foreground">{t('about.statsHappyCustomers')}</div>
              </div>
              <div className="card-premium p-6">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">{'< 5 dagar'}</div>
                <div className="text-sm text-muted-foreground">{t('about.statsProjectStart')}</div>
              </div>
              <div className="card-premium p-6">
                <Award className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                <div className="text-sm text-muted-foreground">{t('about.statsCustomerSatisfaction')}</div>
              </div>
              <div className="card-premium p-6">
                <Star className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">5 år</div>
                <div className="text-sm text-muted-foreground">{t('about.statsWarranty')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t('about.valuesTitle')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('about.speedTitle'),
                description: t('about.speedDescription'),
                icon: Clock
              },
              {
                title: t('about.qualityTitle'), 
                description: t('about.qualityDescription'),
                icon: Award
              },
              {
                title: t('about.transparencyTitle'),
                description: t('about.transparencyDescription'),
                icon: CheckCircle
              }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={value.title} className="card-premium p-8 text-center animate-fade-in-up" 
                     style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-16 h-16 gradient-primary-subtle rounded-xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-8">
            {t('about.coverageTitle')}
          </h2>
          <div className="card-premium p-8 mb-8">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">{t('about.coverageMainTitle')}</h3>
            <p className="text-lg text-muted-foreground mb-6">
              {t('about.coverageDescription')}
            </p>
            <p className="text-muted-foreground">
              <strong>{t('about.coverageLargeProjects')}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              {t('about.readyToStart')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('about.contactTitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt">
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  {t('common.requestQuote')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:08-123456789">
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-bold">
                  <Phone className="mr-2 h-5 w-5" />
                  {t('common.callUs')}: {t('common.phone')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;