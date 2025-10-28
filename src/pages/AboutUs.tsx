import { useCopy } from '@/copy/CopyProvider';
import { Button } from "@/components/ui/button";
import { Home, Building2, Briefcase, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";

const AboutUs = () => {
  const { t, locale } = useCopy();
  
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <GradientText gradient="rainbow">
                {t('pages.about.title')}
              </GradientText>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('pages.about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our History - Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <GradientText gradient="rainbow">
              {t('pages.about.history_title')}
            </GradientText>
          </h2>
          
          <div className="space-y-12">
            {[
              { year: '2015', text: t('pages.about.founded_vision') },
              { year: '2017', text: t('pages.about.growth_story') },
              { year: '2020', text: t('pages.about.pandemic_adapt') },
              { year: '2023', text: t('pages.about.today_team') },
              { year: '2024', text: t('pages.about.current_status') },
            ].map((milestone, index) => (
              <div key={index} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1 pt-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {milestone.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <GradientText gradient="rainbow">
              {t('pages.about.what_we_offer_title')}
            </GradientText>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: t('pages.about.for_private_title'),
                description: t('pages.about.for_private_desc')
              },
              {
                icon: Building2,
                title: t('pages.about.for_brf_title'),
                description: t('pages.about.for_brf_desc')
              },
              {
                icon: Briefcase,
                title: t('pages.about.for_business_title'),
                description: t('pages.about.for_business_desc')
              }
            ].map((service, index) => (
              <GlassCard key={index} className="p-8">
                <service.icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8">
            <GradientText gradient="rainbow">
              {t('pages.about.our_team_title')}
            </GradientText>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            {t('pages.about.team_description')}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <GradientText gradient="rainbow">
              {t('pages.about.values')}
            </GradientText>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('pages.about.quality_value'),
                description: t('pages.about.quality_value_desc')
              },
              {
                title: t('pages.about.transparency_value'),
                description: t('pages.about.transparency_value_desc')
              },
              {
                title: t('pages.about.respect_value'),
                description: t('pages.about.respect_value_desc')
              }
            ].map((value, index) => (
              <GlassCard key={index} className="p-8">
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-8">
            <GradientText gradient="rainbow">
              {t('pages.about.where_we_operate')}
            </GradientText>
          </h2>
          <div className="card-premium p-8">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('pages.about.coverage_simple')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              <GradientText gradient="rainbow">
                {t('pages.about.want_to_know_more')}
              </GradientText>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('pages.about.contact_us_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to={locale === 'sv' ? '/kontakt' : '/en/contact'}>
                  {t('pages.about.contact_us_button')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={locale === 'sv' ? '/tjanster' : '/en/services'}>
                  {t('pages.about.see_services_button')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
