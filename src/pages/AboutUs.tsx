import { Button } from "@/components/ui/button-premium";
import { CheckCircle, Star, Users, Award, Clock, MapPin, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';

const AboutUs = () => {
  const { t } = useCopy();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              {t('pages.about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('pages.about.subtitle')}
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
                {t('pages.about.history_title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('pages.about.history_text')}
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                {isEnglish ? 
                  "We specialize in combining traditional craftsmanship with modern technology and smart solutions. Our team consists of experienced craftsmen who are passionate about quality and customer satisfaction." :
                  "Vi specialiserar oss på att kombinera traditionellt hantverk med modern teknik och smarta lösningar. Vårt team består av erfarna hantverkare som brinner för kvalitet och kundnöjdhet."
                }
              </p>
              <p className="text-lg text-muted-foreground">
                {isEnglish ?
                  "Over the years, we have helped hundreds of families and businesses realize their projects – from small repairs to major renovations. We are proud of our high customer satisfaction and our reputation as a reliable partner." :
                  "Genom åren har vi hjälpt hundratals familjer och företag att förverkliga sina projekt – från små reparationer till stora renoveringar. Vi är stolta över vår höga kundnöjdhet och vårt rykte som en pålitlig partner."
                }
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="card-premium p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">500+</div>
                <div className="text-sm text-muted-foreground">{t('pages.about.customers')}</div>
              </div>
              <div className="card-premium p-6">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">{'< 5 dagar'}</div>
                <div className="text-sm text-muted-foreground">
                  {isEnglish ? "To project start" : "Till projektstart"}
                </div>
              </div>
              <div className="card-premium p-6">
                <Award className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                <div className="text-sm text-muted-foreground">
                  {isEnglish ? "Customer satisfaction" : "Kundnöjdhet"}
                </div>
              </div>
              <div className="card-premium p-6">
                <Star className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">{isEnglish ? "5 years" : "5 år"}</div>
                <div className="text-sm text-muted-foreground">
                  {isEnglish ? "Guarantee" : "Garanti"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t('pages.about.values')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('pages.about.speed'),
                description: t('pages.about.speedDesc'),
                icon: Clock
              },
              {
                title: t('pages.about.quality'), 
                description: t('pages.about.qualityDesc'),
                icon: Award
              },
              {
                title: t('pages.about.transparency'),
                description: t('pages.about.transparencyDesc'),
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
            {t('pages.about.coverageArea')}
          </h2>
          <div className="card-premium p-8 mb-8">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Uppsala & Stockholms län</h3>
            <p className="text-lg text-muted-foreground mb-6">
              {t('pages.about.coverageDesc')}
            </p>
            <p className="text-muted-foreground">
              <strong>
                {isEnglish ?
                  "For larger projects (over 50,000 SEK) we work throughout Sweden." :
                  "För större projekt (över 50 000 kr) arbetar vi i hela Sverige."
                }
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              {t('pages.about.readyToStart')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('pages.about.contactToday')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isEnglish ? "/en/contact" : "/kontakt"}>
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  {isEnglish ? "Request quote" : "Begär offert"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:08-123456789">
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-bold">
                  <Phone className="mr-2 h-5 w-5" />
                  {isEnglish ? "Call us: 08-123 456 78" : "Ring oss: 08-123 456 78"}
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